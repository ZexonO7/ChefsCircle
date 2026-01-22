import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PaymentNotificationRequest {
  userEmail: string;
  tierName: string;
  amount: string;
  cryptoType: string;
  transactionId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, tierName, amount, cryptoType, transactionId }: PaymentNotificationRequest = await req.json();

    // Send notification to admin
    const adminEmailResponse = await resend.emails.send({
      from: "ChefsCircle <noreply@chefscircle.in>",
      to: ["Advithya@ChefsCircle.in"],
      subject: `New Payment Submission - ${tierName}`,
      html: `
        <h1>New Crypto Payment Submission</h1>
        <p>A user has submitted a crypto payment that requires review:</p>
        <table style="border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">User Email:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${userEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Tier:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${tierName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Amount:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${amount}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Crypto Type:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${cryptoType.toUpperCase()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Transaction ID:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${transactionId || 'Not provided'}</td>
          </tr>
        </table>
        <p><a href="https://w-0405.lovable.app/admin" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Review in Admin Portal</a></p>
      `,
    });

    console.log("Admin notification email sent:", adminEmailResponse);

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "ChefsCircle <noreply@chefscircle.in>",
      to: [userEmail],
      subject: `Payment Received - ${tierName} Membership`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f97316, #eab308); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #1a1a1a; margin: 0;">Payment Received! 🎉</h1>
          </div>
          
          <div style="background: #1a1a1a; padding: 30px; color: #ffffff; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px; line-height: 1.6;">
              Thank you for submitting your payment for the <strong style="color: #f97316;">${tierName}</strong> membership!
            </p>
            
            <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #f97316; margin-top: 0;">Payment Details</h3>
              <p style="margin: 8px 0;"><strong>Plan:</strong> ${tierName}</p>
              <p style="margin: 8px 0;"><strong>Amount:</strong> ${amount}</p>
              <p style="margin: 8px 0;"><strong>Payment Method:</strong> ${cryptoType.toUpperCase()}</p>
              ${transactionId ? `<p style="margin: 8px 0;"><strong>Transaction ID:</strong> <code style="background: #3a3a3a; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${transactionId}</code></p>` : ''}
            </div>
            
            <div style="background: #2d4a3e; border-left: 4px solid #10b981; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0; color: #6ee7b7;">
                <strong>What's next?</strong><br>
                Our team will verify your transaction and activate your membership within 24 hours. You'll receive another email once your account is upgraded.
              </p>
            </div>
            
            <p style="color: #888; font-size: 14px;">
              If you have any questions, feel free to contact us at <a href="mailto:support@chefscircle.in" style="color: #f97316;">support@chefscircle.in</a>
            </p>
            
            <p style="margin-top: 30px; color: #888;">
              Happy cooking! 🍳<br>
              <strong style="color: #f97316;">The ChefsCircle Team</strong>
            </p>
          </div>
        </div>
      `,
    });

    console.log("User confirmation email sent:", userEmailResponse);

    return new Response(JSON.stringify({ admin: adminEmailResponse, user: userEmailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending payment notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
