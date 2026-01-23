import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ApprovalNotificationRequest {
  userEmail: string;
  tierName: string;
  status: 'approved' | 'rejected';
  reason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, tierName, status, reason }: ApprovalNotificationRequest = await req.json();

    let emailResponse;

    if (status === 'approved') {
      emailResponse = await resend.emails.send({
        from: "ChefsCircle <noreply@chefscircle.in>",
        to: [userEmail],
        subject: `🎉 Membership Activated - ${tierName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #ffffff; margin: 0;">Welcome to ${tierName}! 🎉</h1>
            </div>
            
            <div style="background: #1a1a1a; padding: 30px; color: #ffffff; border-radius: 0 0 12px 12px;">
              <p style="font-size: 18px; line-height: 1.6;">
                Great news! Your payment has been verified and your <strong style="color: #10b981;">${tierName}</strong> membership is now active!
              </p>
              
              <div style="background: #2d4a3e; border-left: 4px solid #10b981; padding: 20px; border-radius: 4px; margin: 20px 0;">
                <h3 style="color: #6ee7b7; margin-top: 0;">Your Benefits Are Now Unlocked:</h3>
                <ul style="color: #a7f3d0; margin: 0; padding-left: 20px;">
                  <li>Access to exclusive recipes and content</li>
                  <li>Priority support from our team</li>
                  <li>Member-only events and workshops</li>
                  <li>Enhanced AI recipe generation limits</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://w-0405.lovable.app/dashboard" style="background: linear-gradient(135deg, #f97316, #eab308); color: #1a1a1a; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Go to Your Dashboard
                </a>
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
    } else {
      emailResponse = await resend.emails.send({
        from: "ChefsCircle <noreply@chefscircle.in>",
        to: [userEmail],
        subject: `Payment Review Update - ${tierName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #ffffff; margin: 0;">Payment Review Update</h1>
            </div>
            
            <div style="background: #1a1a1a; padding: 30px; color: #ffffff; border-radius: 0 0 12px 12px;">
              <p style="font-size: 16px; line-height: 1.6;">
                We were unable to verify your payment for the <strong style="color: #f97316;">${tierName}</strong> membership.
              </p>
              
              <div style="background: #4a2d2d; border-left: 4px solid #ef4444; padding: 20px; border-radius: 4px; margin: 20px 0;">
                <h3 style="color: #fca5a5; margin-top: 0;">Reason:</h3>
                <p style="color: #fecaca; margin: 0;">${reason || 'The transaction could not be verified. Please ensure you sent the correct amount to the correct wallet address.'}</p>
              </div>
              
              <p style="font-size: 16px; line-height: 1.6;">
                If you believe this is an error, please reply to this email with your transaction details and we'll be happy to investigate further.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://w-0405.lovable.app/membership" style="background: linear-gradient(135deg, #f97316, #eab308); color: #1a1a1a; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Try Again
                </a>
              </div>
              
              <p style="color: #888; font-size: 14px;">
                Need help? Contact us at <a href="mailto:support@chefscircle.in" style="color: #f97316;">support@chefscircle.in</a>
              </p>
              
              <p style="margin-top: 30px; color: #888;">
                Best regards,<br>
                <strong style="color: #f97316;">The ChefsCircle Team</strong>
              </p>
            </div>
          </div>
        `,
      });
    }

    console.log(`${status} email sent:`, emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending approval notification:", error);
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
