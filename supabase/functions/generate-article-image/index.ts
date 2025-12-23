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
      console.warn("HUGGING_FACE_ACCESS_TOKEN not configured; using fallback images");
      return new Response(
        JSON.stringify({
          success: false,
          imageUrl: null,
          usesFallback: true,
          error: "Image generation is temporarily unavailable",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
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
        usesFallback: false,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating image with HuggingFace:", error);
    
    // Return success with fallback flag - don't throw errors for image generation failures
    return new Response(
      JSON.stringify({ 
        success: false,
        imageUrl: null,
        usesFallback: true
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  }
});
