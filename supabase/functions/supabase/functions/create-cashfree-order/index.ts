import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
        const { planName, amount, customerDetails } = await req.json();

        // 1. Create Order in Cashfree
        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-version": "2023-08-01",
                "x-client-id": CASHFREE_APP_ID,
                "x-client-secret": CASHFREE_SECRET_KEY,
            },
            body: JSON.stringify({
                order_amount: amount,
                order_currency: "INR",
                order_id: `ORDER_${Date.now()}_${customerDetails.id.split('-')[0]}`,
                customer_details: {
                    customer_id: customerDetails.id,
                    customer_email: customerDetails.email,
                    customer_phone: customerDetails.phone || "9999999999",
                },
                order_meta: {
                    return_url: `https://trade-adhyayan-app.vercel.app/payment-status?order_id={order_id}&plan=${planName}`,
                },
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Cashfree API Error:", data);
            return new Response(JSON.stringify({ error: data.message || "Failed to create order" }), {
                status: response.status,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({
            payment_session_id: data.payment_session_id,
            order_id: data.order_id
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
