import { NextRequest, NextResponse } from 'next/server';
import { Paddle, EventName, Environment } from '@paddle/paddle-node-sdk';
import { createClient } from '@supabase/supabase-js';

const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
    environment: Environment.sandbox, // Change to Environment.production for live
});

// Initialize Supabase with Service Role Key for admin overrides
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    const signature = req.headers.get('paddle-signature') || '';
    const body = await req.text();
    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET || '';

    try {
        if (!signature) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
        }

        // Use unmarshal to verify signature and parse body in one go
        const event = await paddle.webhooks.unmarshal(body, webhookSecret, signature);

        const eventType = event.eventType;
        const data = event.data;

        console.log(`[Paddle Webhook] Received event: ${eventType}`);

        switch (eventType) {
            case 'subscription.created':
            case 'subscription.updated':
            case 'subscription.activated':
                await handleSubscriptionUpdate(data);
                break;
            case 'subscription.canceled':
            case 'subscription.past_due':
                await handleSubscriptionDeactivation(data);
                break;
            default:
                console.log(`[Paddle Webhook] Unhandled event type: ${eventType}`);
        }

        return NextResponse.json({ status: 'success' });
    } catch (err) {
        console.error('[Paddle Webhook Error]:', err);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}

async function handleSubscriptionUpdate(subscription: any) {
    const customerId = subscription.customer_id;
    const subscriptionId = subscription.id;
    const status = subscription.status;
    const customData = subscription.custom_data || {};
    const userId = customData.userId; // We'll pass this during checkout

    if (!userId) {
        console.error('[Paddle Webhook] Missing userId in custom_data');
        return;
    }

    // Map Paddle Price ID to our Plan Tier (MUST MATCH TierId enum)
    const priceId = subscription.items?.[0]?.price_id;
    let tier = 'VIBE_CODER';

    // Map these in your .env.local
    if (priceId === process.env.PADDLE_PRICE_ID_DEVELOPER) tier = 'DEVELOPER';
    if (priceId === process.env.PADDLE_PRICE_ID_TEAMS) tier = 'TEAMS';
    if (priceId === process.env.PADDLE_PRICE_ID_ENTERPRISE) tier = 'ENTERPRISE';

    const { error } = await supabaseAdmin
        .from('profiles')
        .update({
            paddle_customer_id: customerId,
            paddle_subscription_id: subscriptionId,
            subscription_status: status,
            plan_tier: tier, // We'll refine this once Price IDs are known
            updated_at: new Date().toISOString()
        })
        .eq('id', userId);

    if (error) {
        console.error('[Paddle Webhook] Supabase update error:', error);
        throw error;
    }
}

async function handleSubscriptionDeactivation(subscription: any) {
    const subscriptionId = subscription.id;
    const status = subscription.status;

    const { error } = await supabaseAdmin
        .from('profiles')
        .update({
            subscription_status: status,
            plan_tier: 'VIBE_CODER', // Downgrade to lowest tier on deactivation
            updated_at: new Date().toISOString()
        })
        .eq('paddle_subscription_id', subscriptionId);

    if (error) {
        console.error('[Paddle Webhook] Supabase deactivation error:', error);
        throw error;
    }
}
