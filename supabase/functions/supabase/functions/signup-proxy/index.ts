
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { email, password, options } = body;
    const full_name = options?.data?.full_name || 'Trader';
    
    console.log(`Starting signup proxy for ${email}`);

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const RESEND_KEY = Deno.env.get("RESEND_API_KEY");

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);

    // 1. Create User (Auto-Confirm to bypass verification requirement if email fails)
    // using createUser with email_confirm: true
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: options?.data,
      email_confirm: true 
    });

    if (createError) {
        console.error("Create User Error:", createError);
        throw createError;
    }

    const new_user = userData.user;
    
    // 2. Attempt to send Welcome Email
    let emailStatus = "sent";
    let emailError = null;

    if (!RESEND_KEY) {
        console.warn("No RESEND_API_KEY. Skipping email.");
        emailStatus = "skipped_no_key";
    } else {
        // Send simply "Welcome" email, no verification link needed since they are auto-verified
        const emailResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_KEY}`,
            },
            body: JSON.stringify({
                from: "Trade Adhyayan <onboarding@resend.dev>",
                to: [email],
                subject: "Welcome to Trade Adhyayan",
                html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
                    <h2 style="color: #1e293b; font-size: 24px; font-weight: 800; margin-bottom: 16px;">Welcome to Trade Adhyayan, ${full_name}!</h2>
                    <p style="color: #64748b; line-height: 1.6; margin-bottom: 24px;">
                    Your account has been successfully created and verified. You can now login to your professional terminal.
                    </p>
                    <div style="text-align: center; margin-bottom: 32px;">
                    <a href="https://tradeadhyayan.vercel.app/login" style="background: #4f46e5; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; display: inline-block; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
                        Login to Dashboard
                    </a>
                    </div>
                </div>
                `,
            }),
        });

        if (!emailResponse.ok) {
            const errorText = await emailResponse.text();
            console.error("Resend API Error (Survivable):", errorText);
            // We DO NOT THROW here, to allow the signup to succeed even if email fails (e.g. Sandbox mode)
            emailStatus = "failed";
            emailError = errorText;
        }
    }

    return new Response(JSON.stringify({ 
        user: new_user, 
        session: null,
        email_status: emailStatus,
        email_warning: emailError 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Signup Proxy Error:", error);
    return new Response(JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: JSON.stringify(error)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
