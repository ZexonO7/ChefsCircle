import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { HfInference } from "https://esm.sh/@huggingface/inference@2.3.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description } = await req.json();

    if (!title || !description) {
      return new Response(
        JSON.stringify({ error: "Title and description are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const hfToken = Deno.env.get("HUGGING_FACE_ACCESS_TOKEN");
    if (!hfToken) {
      return new Response(
        JSON.stringify({ error: "HuggingFace API token not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Create a detailed prompt for culinary image generation
    const prompt = `Professional culinary photography: ${title}. ${description}. High-quality food photography, professional kitchen setting, vibrant colors, appetizing presentation, restaurant quality, natural lighting, depth of field, culinary artistry.`;

    console.log("Generating image with HuggingFace for prompt:", prompt);

    const hf = new HfInference(hfToken);

    const image = await hf.textToImage({
      inputs: prompt,
      model: "black-forest-labs/FLUX.1-schnell",
    });

    // Convert the blob to a base64 string
    const arrayBuffer = await image.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const imageUrl = `data:image/png;base64,${base64}`;

    console.log("Successfully generated image with HuggingFace");

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating image with HuggingFace:", error);
    
    // Check if it's a payment/credits error from HuggingFace
    const errorMessage = (error as Error).message || '';
    if (errorMessage.includes('payment') || errorMessage.includes('credits') || errorMessage.includes('402')) {
      return new Response(
        JSON.stringify({ 
          error: "HuggingFace API credits exhausted", 
          details: "Please add credits to your HuggingFace account or use fallback images",
          usesFallback: true
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 402 }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to generate image", 
        details: (error as Error).message,
        usesFallback: true
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
