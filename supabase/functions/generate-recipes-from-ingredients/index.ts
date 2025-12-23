// Version 2.0 - Using Lovable AI Gateway (not Cohere)
// Last updated: 2025-11-29
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { ingredients } = await req.json()
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Ingredients array is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')
    if (!lovableApiKey) {
      return new Response(
        JSON.stringify({ error: 'Lovable API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Create a detailed prompt for recipe generation
    const ingredientsList = ingredients.join(', ')
    const prompt = `You are a professional chef AI assistant. Generate 3 unique and delicious recipes using primarily these available ingredients: ${ingredientsList}.

Requirements:
- Each recipe should use at least 3 of the provided ingredients as main components
- You can suggest common pantry staples (salt, pepper, oil, etc.) if needed
- Provide practical recipes that a home cook can actually make
- Include cooking time, difficulty level, and serving size
- Make the recipes diverse in style (e.g., different cuisines or cooking methods)

For each recipe, provide the response in this exact JSON format:
{
  "recipes": [
    {
      "title": "Recipe Name",
      "description": "Brief appetizing description of the dish",
      "ingredients": ["ingredient 1", "ingredient 2", "etc."],
      "instructions": ["step 1", "step 2", "etc."],
      "cookTime": "X minutes",
      "difficulty": "Easy/Medium/Hard",
      "servings": "X servings"
    }
  ]
}

Make sure the JSON is valid and properly formatted. Only return the JSON, no additional text.`

    console.log('Generating recipes for ingredients:', ingredientsList)
    console.log('Using Lovable AI Gateway')

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${lovableApiKey}`
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Lovable AI error:', response.status, errorText)
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
        )
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 402 }
        )
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to generate recipes', details: errorText }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
      )
    }

    const data = await response.json()
    const generatedContent = data.choices?.[0]?.message?.content || ''

    console.log('Raw AI response:', generatedContent)

    // Parse the JSON response from AI
    let parsedRecipes
    try {
      // Clean up the response and try multiple parsing strategies
      let cleanedContent = generatedContent.trim()
      
      // Try to find JSON between code blocks if present
      const codeBlockMatch = cleanedContent.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
      if (codeBlockMatch) {
        cleanedContent = codeBlockMatch[1]
      }
      
      // Try to find the JSON object
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : cleanedContent
      
      // Parse the JSON
      parsedRecipes = JSON.parse(jsonString)
      
      // Validate the structure
      if (!parsedRecipes.recipes || !Array.isArray(parsedRecipes.recipes)) {
        throw new Error('Invalid recipe structure - missing recipes array')
      }
      
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError)
      console.error('Raw content length:', generatedContent.length)
      console.error('Raw content preview:', generatedContent.substring(0, 500))
      
      // Return a more helpful error
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse recipe data from AI response',
          details: 'The AI response was not in the expected JSON format. Please try again.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Successfully generated recipes:', parsedRecipes)

    return new Response(
      JSON.stringify(parsedRecipes),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating recipes:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
