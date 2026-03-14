import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is missing. Email notifications will be disabled.");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const ADMIN_EMAIL = "cortexedr@gmail.com";
export const SYSTEM_EMAIL = "no-reply@cortex-edr.com";

// Constants for branding
const LOGO_URL = "https://wkugzsqxrsorvcmzavvo.supabase.co/storage/v1/object/public/system_assets/logo_wide_dark.png"; // We'll need to upload the logo to a public bucket
const APP_URL = "https://www.cortex-edr.com";

/**
 * Renders the professional base wrapper for all emails
 */
const renderBaseTemplate = (title: string, content: string, actionText?: string, actionUrl?: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #000000;">
        <tr>
            <td align="center" style="padding: 40px 0 20px 0;">
                <img src="${LOGO_URL}" alt="Cortex EDR" width="180" style="display: block; border: 0;" />
            </td>
        </tr>
        <tr>
            <td align="center" style="padding: 0 20px 40px 20px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0d0d0d; border: 1px solid #1a1a1a; border-radius: 16px; overflow: hidden;">
                    <tr>
                        <td style="padding: 40px;">
                            <h1 style="margin: 0 0 24px 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase; font-family: 'Inter', sans-serif;">
                                ${title}
                            </h1>
                            <div style="color: #a1a1aa; font-size: 14px; line-height: 24px; font-weight: 500;">
                                ${content}
                            </div>
                            ${actionText && actionUrl ? `
                            <table border="0" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
                                <tr>
                                    <td align="center" style="border-radius: 8px; background-color: #ffffff;">
                                        <a href="${actionUrl}" target="_blank" style="display: inline-block; padding: 12px 32px; color: #000000; font-size: 13px; font-weight: 700; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em;">
                                            ${actionText}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            ` : ''}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 24px 40px; background-color: #111111; border-top: 1px solid #1a1a1a;">
                            <p style="margin: 0; color: #52525b; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                Security Intelligence Protocol &copy; ${new Date().getFullYear()} Cortex EDR
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td align="center" style="padding: 0 20px 40px 20px;">
                <p style="margin: 0; color: #3f3f46; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
                    This is an automated operational transmission.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
`;

export const templates = {
    welcome: (userName: string) => ({
        subject: "Node Initialization Successful | Welcome to Cortex EDR",
        html: renderBaseTemplate(
            "Activation Successful",
            `Hi ${userName},<br/><br/>Welcome to the Cortex network. Your account has been initialized and you are now connected to the most advanced security intelligence cluster. Identity verification is complete.<br/><br/>You now have access to deep-pass core analysis and distributed compute nodes.`,
            "Launch Dashboard",
            `${APP_URL}/dashboard`
        )
    }),

    otp: (otp: string) => ({
        subject: "Security Protocol: Your Verification Code",
        html: renderBaseTemplate(
            "Verify Identity",
            `Please enter the following 6-digit code to verify your Cortex account. This code is valid for 10 minutes and should not be shared with anyone.<br/><br/>
            <div style="background-color: #000; border: 1px solid #1a1a1a; border-radius: 12px; padding: 32px; text-align: center; margin: 24px 0;">
                <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #ffffff;">${otp}</span>
            </div>
            If you did not request this code, please secure your account immediately.`,
        )
    }),

    paymentSubmitted: (userName: string, tierName: string, amount: number, method: string, ref: string) => ({
        subject: `Verification Protocol Initiated | ${tierName}`,
        html: renderBaseTemplate(
            "Activation Pending",
            `Hello ${userName},<br/><br/>We have received your manual payment submission for the <strong>${tierName}</strong> tier. Our engineers are currently verifying the transaction integrity.<br/><br/>
            <div style="margin: 20px 0; padding: 16px; background-color: #000; border: 1px solid #1a1a1a; border-radius: 8px;">
                <table width="100%" style="font-size: 12px; font-family: monospace;">
                    <tr><td style="color: #52525b;">TIER:</td><td style="color: #fff; text-align: right;">${tierName}</td></tr>
                    <tr><td style="color: #52525b;">AMOUNT:</td><td style="color: #fff; text-align: right;">$${amount}</td></tr>
                    <tr><td style="color: #52525b;">METHOD:</td><td style="color: #fff; text-align: right; text-transform: uppercase;">${method}</td></tr>
                    <tr><td style="color: #52525b;">REF_ID:</td><td style="color: #fff; text-align: right;">${ref}</td></tr>
                </table>
            </div>
            Please allow 24-48 hours for protocol activation. Your patience is valued as we ensure the highest security standards for your dedicated node cluster.`,
            "View Billing",
            `${APP_URL}/dashboard/billing`
        )
    }),

    tierActivated: (userName: string, tierName: string) => ({
        subject: `Strategic Upgrade Confirmed | ${tierName}`,
        html: renderBaseTemplate(
            "Upgrade Successful",
            `Greetings ${userName},<br/><br/>Verification is complete. Your account has been upgraded to the <strong>${tierName}</strong> tier. New operational limits and advanced security protocols are now active on your account.<br/><br/>Thank you for trusting Cortex EDR with your security infrastructure.`,
            "Access New Tiers",
            `${APP_URL}/dashboard`
        )
    }),

    billingReminder: (userName: string, amount: number, date: string) => ({
        subject: "Maintenance Cycle Approaching | Billing Reminder",
        html: renderBaseTemplate(
            "Protocol Renewal",
            `Hello ${userName},<br/><br/>Your monthly maintenance cycle is approaching. To ensure uninterrupted access to your dedicated compute nodes, please ensure your next payment of <strong>$${amount}</strong> is processed by <strong>${date}</strong>.`,
            "Manage Billing",
            `${APP_URL}/dashboard/billing`
        )
    }),

    quotaLimit: (userName: string, tierName: string) => ({
        subject: "Operational Capacity Reached | Action Required",
        html: renderBaseTemplate(
            "Quota Exhausted",
            `Hello ${userName},<br/><br/>You have reached the scan capacity limit for your current <strong>${tierName}</strong> tier. Deep-pass analysis protocols have been paused until the next cycle or a tier upgrade is initiated.`,
            "Upgrade Capacity",
            `${APP_URL}/dashboard/billing`
        )
    }),

    adminAlert: (userName: string, userEmail: string, tierId: string, amount: number, method: string, ref: string, proofUrl: string | null) => ({
        subject: `[ADMIN] New Payment Submission: ${userEmail}`,
        html: `
            <div style="font-family: monospace; background: #000; color: #fff; padding: 30px; border: 2px solid #d00;">
                <h2 style="color: #f00;">CRITICAL: PAYMENT_VERIFICATION_REQUIRED</h2>
                <hr style="border-color: #333;"/>
                <p>USER: ${userName} (${userEmail})</p>
                <p>TIER: ${tierId}</p>
                <p>AMOUNT: $${amount}</p>
                <p>METHOD: ${method}</p>
                <p>REF_ID: ${ref}</p>
                ${proofUrl ? `<p><a href="${proofUrl}" style="color: #0f0;">VIEW_PROOF_OF_PAYMENT_&gt;&gt;</a></p>` : '<p style="color: #f00;">NO_PROOF_ATTACHED</p>'}
                <hr style="border-color: #333;"/>
                <p style="font-size: 10px; color: #666;">EXECUTE VERIFICATION PROTOCOL IN SUPABASE DASHBOARD</p>
            </div>
        `
    })
};
