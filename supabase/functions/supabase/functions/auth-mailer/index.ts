import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, confirmation_url, full_name } = await req.json();

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set in secrets");
      return new Response(JSON.stringify({ error: "Server configuration error - Missing Resend Key" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Trade Adhyayan <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to Trade Adhyayan - Verify Your Account",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
            <h2 style="color: #1e293b; font-size: 24px; font-weight: 800; margin-bottom: 16px;">Welcome to Trade Adhyayan, ${full_name}!</h2>
            <p style="color: #64748b; line-height: 1.6; margin-bottom: 24px;">
              You're one step away from institutional-grade analytics. Click the button below to verify your account and activate your terminal access.
            </p>
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${confirmation_url}" style="background: #4f46e5; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; display: inline-block; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
                Verify My Account
              </a>
            </div>
            <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 32px;">
              If you didn't create an account, you can safely ignore this email.<br>
              Link reference: ${confirmation_url}
            </p>
          </div>
        `,
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: res.status,
    });
  } catch (error) {
    console.error("Error in auth-mailer:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
