# Supabase Auth Configuration Guide

To fix the `localhost` redirect and set up your custom email message, follow these steps in your [Supabase Dashboard](https://supabase.com/dashboard):

## 1. Fix Verification Link (Redirect to Vercel)
The link sends you to localhost because the "Site URL" needs to be updated.
1.  Navigate to **Authentication > URL Configuration**.
2.  Set **Site URL** to: `https://tradeadhyayan.vercel.app`
3.  Add to **Redirect URLs**: `https://tradeadhyayan.vercel.app/**`
4.  **Save** changes.

## 2. Customize Verification Email
To provide a premium experience for your users:
1.  Navigate to **Authentication > Email Templates**.
2.  Open the **Confirm Signup** template.
3.  Replace the **Message body** with:

```html
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
  <h2 style="color: #1e293b; font-size: 24px; font-weight: 800; margin-bottom: 16px;">Welcome to Trade Adhyayan</h2>
  <p style="color: #64748b; line-height: 1.6; margin-bottom: 24px;">
    You're one step away from professional-grade analytics. Click the button below to verify your account and activate your terminal access.
  </p>
  <div style="text-align: center; margin-bottom: 32px;">
    <a href="{{ .ConfirmationURL }}" style="background: #4f46e5; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; display: inline-block; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
      Verify My Account
    </a>
  </div>
  <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 32px;">
    If you didn't create an account, you can safely ignore this email.<br>
    Link reference: {{ .ConfirmationURL }}
  </p>
</div>
```
4.  **Save** changes.

---

## 3. 🚨 Troubleshooting "Email Not Sent" (Error 500 / 535)
If you see an error like `535 API key not found` or `Error sending confirmation email`:
1.  This means your **Custom SMTP** settings are enabled but invalid.
2.  Go to **Authentication > SMTP Settings**.
3.  **DISABLE** (Toggle OFF) "Enable Custom SMTP".
4.  Click **Save**.
5.  Supabase will now use its default built-in mailer, which works immediately.

---

## 4. Edge Function Proxy (Current Architecture)

Due to SMTP limitations and free domain restrictions on Resend, we now use a **`signup-proxy` Edge Function**.

*   **Auto-Verification**: Users are created with `email_confirm: true` via the Admin API.
*   **Silent Email Failure**: The function attempts to send a welcome email via Resend but **ignores errors** if it fails (e.g., due to unverified domains in Resend Sandbox).
*   **Frontend Logic**: `Login.tsx` calls this function (`signup-proxy`) instead of the standard `supabase.auth.signUp`.
*   **Result**: Users can sign up and are immediately logged in, even if email delivery fails.
