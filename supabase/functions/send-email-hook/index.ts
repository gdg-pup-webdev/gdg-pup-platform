import { createTransport } from "npm:nodemailer@6.10.0";

const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: Deno.env.get("GMAIL_USER"),
    pass: Deno.env.get("GMAIL_APP_PASS"),
  },
});

interface EmailPayload {
  to: string; // The user's email address
  type: string; // 'signup', 'recovery', 'magiclink', 'invite', etc.
  token: string | null; // Only for 'signup' or 'magiclink' if using token directly
  token_hash: string; // The token hash for PKCE flow
  redirect_to: string; // The URL to redirect to after verification
  email_action_type: string;
  url_action_type: string;

  // Custom data we might inject or expect
  user?: {
    email: string;
  };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // TODO: Re-enable after debugging
    // const authHeader = req.headers.get("authorization");
    // const hookSecret = Deno.env.get("HOOK_SECRET");
    // if (hookSecret && authHeader) {
    //   const providedSecret = authHeader.replace("Bearer ", "");
    //   if (providedSecret !== hookSecret) {
    //     console.error("Invalid hook secret provided");
    //     console.error("Expected:", hookSecret);
    //     console.error("Received:", providedSecret);
    //     return new Response(JSON.stringify({ error: "Unauthorized" }), {
    //       headers: { "Content-Type": "application/json" },
    //       status: 401,
    //     });
    //   }
    // }

    const payload = await req.json();
    console.log("=== RECEIVED PAYLOAD ===");
    console.log(JSON.stringify(payload, null, 2));
    console.log("========================");

    // Extract email from various possible locations in the payload
    const userEmail =
      payload.email || payload.user?.email || payload.email_data?.email;
    const emailType = payload.type || payload.email_data?.type || "signup";
    const tokenHash = payload.token_hash || payload.email_data?.token_hash;
    const redirectTo = payload.redirect_to || payload.email_data?.redirect_to;

    if (!userEmail) {
      console.error("No email found in payload");
      return new Response(JSON.stringify({ error: "No email provided" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    if (!tokenHash) {
      console.error("No token_hash found in payload");
      return new Response(JSON.stringify({ error: "No token_hash provided" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    const siteUrl = Deno.env.get("SITE_URL") || "http://localhost:3000";
    const verificationLink = `${siteUrl}/auth/confirm?token_hash=${tokenHash}&type=${emailType}&next=${encodeURIComponent(redirectTo || "/")}`;

    console.log("Sending email to:", userEmail);
    console.log("Verification link:", verificationLink);

    const mailOptions = {
      from: `"GDG PUP Platform" <support@gdgpup.org>`,
      to: userEmail,
      subject: `Verify your account`,
      text: `Confirm your email by clicking here: ${verificationLink}`,
      html: `
        <h2>Confirm your email</h2>
        <p>Click the link below to verify your email address:</p>
        <p><a href="${verificationLink}">Verify Email</a></p>
        <p>If you didn't request this, you can ignore this email.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);

    // Return success response that Supabase expects
    return new Response(
      JSON.stringify({
        success: true,
        message_id: info.messageId,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error: any) {
    console.error("❌ Error in send-email-hook:", error);
    console.error("Error stack:", error.stack);

    // Still return 200 to prevent Supabase from aborting user creation
    // but log the error for debugging
    return new Response(
      JSON.stringify({
        error: error.message,
        stack: error.stack,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200, // Changed from 500 to prevent blocking user creation
      },
    );
  }
});
