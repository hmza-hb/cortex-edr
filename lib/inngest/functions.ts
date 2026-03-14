import { inngest } from "./client";
import { supabaseService } from "../supabase/service";
import { resend, SYSTEM_EMAIL, templates } from "../email/resend";
import { SYSTEM_CONFIG, TierId } from "../config/system";

export const sendBillingReminders = inngest.createFunction(
    { id: "send-billing-reminders" },
    { cron: "0 9 * * *" }, // Run daily at 9 AM UTC
    async ({ step }) => {
        const usersToRemind = await step.run("fetch-users-needing-reminders", async () => {
            // Find users whose last payment was exactly 23 days ago
            // (Assuming a 30-day billing cycle, this gives them a 7-day head start)
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() - 23);
            const targetDateStr = targetDate.toISOString().split('T')[0];

            const { data, error } = await supabaseService
                .from('profiles')
                .select('email, user_name, plan_tier, payment_date')
                .filter('payment_status', 'eq', 'paid')
                .filter('payment_date', 'gte', `${targetDateStr}T00:00:00`)
                .filter('payment_date', 'lte', `${targetDateStr}T23:59:59`);

            if (error) throw error;
            return data || [];
        });

        if (usersToRemind.length === 0) return { message: "No users to remind today" };

        const results = await step.run("send-reminder-emails", async () => {
            const sent = [];
            for (const user of usersToRemind) {
                try {
                    const tierKey = user.plan_tier as TierId;
                    const tierConfig = SYSTEM_CONFIG.tiers[tierKey];
                    const amount = tierConfig.priceMonthly;

                    // Calculate renewal date (payment_date + 30 days)
                    const renewalDate = new Date(user.payment_date);
                    renewalDate.setDate(renewalDate.getDate() + 30);
                    const renewalDateStr = renewalDate.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    });

                    const emailContent = templates.billingReminder(
                        user.user_name || 'Protocol User',
                        amount,
                        renewalDateStr
                    );

                    await resend.emails.send({
                        from: `Cortex EDR <${SYSTEM_EMAIL}>`,
                        to: user.email,
                        subject: emailContent.subject,
                        html: emailContent.html
                    });

                    sent.push(user.email);
                } catch (err) {
                    console.error(`Failed to send reminder to ${user.email}:`, err);
                }
            }
            return sent;
        });

        return { remindedCount: usersToRemind.length, successfullySent: results };
    }
);
