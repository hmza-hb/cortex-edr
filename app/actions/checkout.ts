"use server";

import { resend, ADMIN_EMAIL, SYSTEM_EMAIL, templates } from "@/lib/email/resend";
import { createClient } from "@supabase/supabase-js";
import { TierId, SYSTEM_CONFIG } from "@/lib/config/system";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface CheckoutSubmission {
    userId: string;
    userEmail: string;
    userName: string;
    tierId: TierId;
    amount: number;
    paymentMethod: string;
    proofUrl: string | null;
    transactionId: string;
}

export async function submitManualPayment(data: CheckoutSubmission) {
    try {
        const tierConfig = SYSTEM_CONFIG.tiers[data.tierId];

        // 1. Log to Database
        const { error: dbError } = await supabaseAdmin
            .from('payment_submissions')
            .insert({
                user_id: data.userId,
                user_email: data.userEmail,
                user_name: data.userName,
                tier_id: data.tierId,
                amount: data.amount,
                payment_method: data.paymentMethod,
                proof_url: data.proofUrl,
                transaction_id: data.transactionId,
                status: 'pending'
            });

        if (dbError) throw dbError;

        // 2. Send User Pro-forma Invoice Email (Professional Template)
        const userEmailContent = templates.paymentSubmitted(
            data.userName,
            tierConfig.name,
            data.amount,
            data.paymentMethod,
            data.transactionId
        );

        await resend.emails.send({
            from: `Cortex EDR <${SYSTEM_EMAIL}>`,
            to: data.userEmail,
            subject: userEmailContent.subject,
            html: userEmailContent.html
        });

        // 3. Send Admin Notification Email
        const adminEmailContent = templates.adminAlert(
            data.userName,
            data.userEmail,
            data.tierId,
            data.amount,
            data.paymentMethod,
            data.transactionId,
            data.proofUrl
        );

        await resend.emails.send({
            from: `Cortex Ops <${SYSTEM_EMAIL}>`,
            to: ADMIN_EMAIL,
            subject: adminEmailContent.subject,
            html: adminEmailContent.html
        });

        return { success: true };
    } catch (error: any) {
        console.error("Manual payment submission error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Admin action to verify a payment and upgrade a user's tier
 */
export async function verifyPaymentAndUpgradeTier(submissionId: string) {
    try {
        // 1. Get submission details
        const { data: submission, error: fetchError } = await supabaseAdmin
            .from('payment_submissions')
            .select('*')
            .eq('id', submissionId)
            .single();

        if (fetchError || !submission) throw new Error("Submission not found");

        const tierConfig = SYSTEM_CONFIG.tiers[submission.tier_id as TierId];

        // 2. Update user profile
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({
                plan_tier: submission.tier_id,
                payment_status: 'paid',
                payment_date: new Date().toISOString()
            })
            .eq('id', submission.user_id);

        if (profileError) throw profileError;

        // 3. Mark submission as verified
        await supabaseAdmin
            .from('payment_submissions')
            .update({ status: 'verified' })
            .eq('id', submissionId);

        // 4. Send Success Email to User
        const successEmail = templates.tierActivated(
            submission.user_name,
            tierConfig.name
        );

        await resend.emails.send({
            from: `Cortex EDR <${SYSTEM_EMAIL}>`,
            to: submission.user_email,
            subject: successEmail.subject,
            html: successEmail.html
        });

        return { success: true };
    } catch (error: any) {
        console.error("Verification error:", error);
        return { success: false, error: error.message };
    }
}
