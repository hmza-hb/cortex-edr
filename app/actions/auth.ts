'use server';

import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

import { resend, SYSTEM_EMAIL, templates } from '@/lib/email/resend';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function checkEmail(email: string) {
    if (!email) return { exists: false };

    try {
        const { data: user } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        return { exists: !!user };
    } catch (error) {
        console.error("Check email error:", error);
        return { exists: false };
    }
}

export async function initiateRegistration(formData: FormData) {
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const password = formData.get('password') as string;

    if (!email || !name || !password) {
        return { error: "Missing required fields" };
    }

    try {
        // 1. Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

        // 2. Store OTP
        const { error: otpError } = await supabaseAdmin
            .from('auth_codes')
            .upsert({
                email,
                code: otp, // In production, we should hash this
                expires_at: expiresAt,
                attempts: 0
            });

        if (otpError) throw otpError;

        // 3. Send Email
        const emailTemplate = templates.otp(otp);
        const { error: emailError } = await resend.emails.send({
            from: `Cortex EDR <${SYSTEM_EMAIL}>`,
            to: email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
        });

        if (emailError) throw emailError;

        return { success: true };
    } catch (error: any) {
        console.error("Initiate registration error:", error);

        // Sanitize technical errors
        if (error.message?.includes('auth_codes')) {
            return { error: "System synchronization in progress. Please try again in 30 seconds." };
        }

        return { error: "Security protocol failed to initialize. Please verify your details and retry." };
    }
}

export async function completeRegistration(email: string, code: string, signupData: any) {
    if (!email || !code || !signupData) {
        return { error: "Missing required verification data" };
    }

    try {
        // 1. Verify OTP
        const { data: authCode, error: fetchError } = await supabaseAdmin
            .from('auth_codes')
            .select('*')
            .eq('email', email)
            .single();

        if (fetchError || !authCode) {
            return { error: "Verification code not found or expired" };
        }

        if (new Date(authCode.expires_at) < new Date()) {
            return { error: "Verification code has expired" };
        }

        if (authCode.code !== code) {
            // Increment attempts
            await supabaseAdmin
                .from('auth_codes')
                .update({ attempts: authCode.attempts + 1 })
                .eq('email', email);

            return { error: "Invalid verification code" };
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(signupData.password, 12);

        // 3. Create user
        const { data: newUser, error: createError } = await supabaseAdmin
            .from('users')
            .insert({
                email,
                password: hashedPassword,
                name: signupData.name,
                image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(signupData.name)}`
            })
            .select()
            .single();

        if (createError) throw createError;

        // 4. Cleanup OTP
        await supabaseAdmin
            .from('auth_codes')
            .delete()
            .eq('email', email);

        // 5. Send Welcome Email
        const welcomeTemplate = templates.welcome(newUser.name);
        await resend.emails.send({
            from: `Cortex EDR <${SYSTEM_EMAIL}>`,
            to: email,
            subject: welcomeTemplate.subject,
            html: welcomeTemplate.html,
        });

        return { success: true };
    } catch (error: any) {
        console.error("Complete registration error:", error);

        if (error.message?.includes('auth_codes')) {
            return { error: "Validation system is currently updating. Please try again shortly." };
        }

        return { error: "Verification process interrupted. Please re-initiate the protocol." };
    }
}

export async function requestPasswordReset(email: string) {
    if (!email) return { error: "Email address required" };

    try {
        // 1. Verify user exists
        const { data: user } = await supabaseAdmin
            .from('users')
            .select('id, name')
            .eq('email', email)
            .maybeSingle();

        if (!user) {
            // Security: Don't reveal if user exists, just return success
            return { success: true };
        }

        // 2. Generate reset token/OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 20 * 60 * 1000).toISOString(); // 20 minutes for reset

        // 3. Store in auth_codes (overwriting any previous)
        const { error: otpError } = await supabaseAdmin
            .from('auth_codes')
            .upsert({ email, code: otp, expires_at: expiresAt, attempts: 0 });

        if (otpError) throw otpError;

        // 4. Send Recovery Email (Using a new template if needed, or OTP template)
        const emailTemplate = templates.otp(otp); // We'll reuse OTP template for simplicity in this MVP
        await resend.emails.send({
            from: `Cortex Security <${SYSTEM_EMAIL}>`,
            to: email,
            subject: "Security Alert: Password Recovery Protocol",
            html: emailTemplate.html,
        });

        return { success: true };
    } catch (error: any) {
        console.error("Request reset error:", error);
        return { error: "Security protocol failed. Please contact node administrator." };
    }
}

export async function resendVerificationCode(email: string) {
    if (!email) return { error: "Identity discovery required" };

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

        const { error: otpError } = await supabaseAdmin
            .from('auth_codes')
            .upsert({ email, code: otp, expires_at: expiresAt, attempts: 0 });

        if (otpError) throw otpError;

        const emailTemplate = templates.otp(otp);
        await resend.emails.send({
            from: `Cortex EDR <${SYSTEM_EMAIL}>`,
            to: email,
            subject: "Identity Verification: New Code Dispatched",
            html: emailTemplate.html,
        });

        return { success: true };
    } catch (error: any) {
        console.error("Resend code error:", error);
        return { error: "Redispatch failed. System synchronization in progress." };
    }
}

export async function signUpWithEmail(formData: FormData) {
    // Deprecated in favor of multi-step flow above
    return { error: "Method deprecated. Use initiateRegistration." };
}
