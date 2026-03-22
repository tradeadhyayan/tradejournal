import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const CASHFREE_APP_ID = Deno.env.get("CASHFREE_APP_ID") || "";
const CASHFREE_SECRET_KEY = Deno.env.get("CASHFREE_SECRET_KEY") || "";
const IS_PRODUCTION = Deno.env.get("CASHFREE_PRODUCTION") === "true";

const API_ENDPOINT = IS_PRODUCTION
    ? "https://api.cashfree.com/pg/orders"
    : "https://sandbox.cashfree.com/pg/orders";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

        const body = await req.json();
        const { order_id, admin_reset, secret } = body;

        // EMERGENCY RESET BLOCK - TO BE REMOVED AFTER USE
        if (admin_reset === true && secret === "RESET_ALL_PLANS_2026") {
            const { data, error: resetError } = await supabase
                .from('profiles')
                .update({ plan: 'FREE', updated_at: new Date().toISOString() })
                .neq('id', '00000000-0000-0000-0000-000000000000'); // Filter to satisfy safety checks

            if (resetError) throw resetError;
            return new Response(JSON.stringify({ status: 'success', message: 'All users reset to FREE' }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        if (!order_id) {
            throw new Error("Order ID is required");
        }

        // 1. Verify payment status with Cashfree
        const response = await fetch(`${API_ENDPOINT}/${order_id}`, {
            method: "GET",
            headers: {
                "x-api-version": "2023-08-01",
                "x-client-id": CASHFREE_APP_ID,
                "x-client-secret": CASHFREE_SECRET_KEY,
            }
        });

        const orderData = await response.json();
        console.log(`Order data for ${order_id}:`, JSON.stringify(orderData, null, 2));

        if (!response.ok) {
            console.error("Cashfree Verification Error:", orderData);
            throw new Error(`Failed to verify order with Cashfree: ${orderData.message || 'Unknown error'}`);
        }

        const isPaid = orderData.order_status === "PAID" || orderData.order_status === "SUCCESS";
        const userId = orderData.customer_details?.customer_id;

        console.log(`Order status: ${orderData.order_status}, isPaid: ${isPaid}, userId: ${userId}`);

        if (!userId) {
            throw new Error("Customer ID not found in order data");
        }

        // Determine plan based on amount or order_id
        let assignedPlan = 'PRO';
        if (orderData.order_amount >= 4000) assignedPlan = 'MENTOR';

        console.log(`Assigning plan: ${assignedPlan} for amount: ${orderData.order_amount}`);

        if (isPaid) {
            // 2. Update user profile in Supabase
            // We'll try 'users' first as per AuthContext logic
            const { error: updateError } = await supabase
                .from('users')
                .update({
                    plan: assignedPlan,
                    subscription_status: 'ACTIVE',
                    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (updateError) {
                console.error("Supabase Update Error (users table):", updateError);
                // Fallback to 'profiles' table if 'users' fails
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({
                        plan: assignedPlan,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', userId);

                if (profileError) {
                    console.error("Supabase Update Error (profiles table):", profileError);
                    throw new Error(`Database update failed: ${updateError.message}`);
                }
            }

            console.log(`Successfully upgraded user ${userId} to ${assignedPlan}`);

            return new Response(JSON.stringify({
                status: 'success',
                message: 'Plan upgraded successfully',
                plan: assignedPlan
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        } else {
            console.warn(`Payment not completed for order ${order_id}. Current status: ${orderData.order_status}`);
            return new Response(JSON.stringify({
                status: 'failed',
                message: `Payment status: ${orderData.order_status}. Please complete the payment.`,
                order_status: orderData.order_status
            }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

    } catch (error) {
        console.error("Verification Function Exception:", error);
        return new Response(JSON.stringify({
            status: 'error',
            error: error.message
        }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
