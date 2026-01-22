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

    const emailResponse = await resend.emails.send({
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

    console.log("Payment notification email sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
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
