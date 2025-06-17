
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

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional chef AI that creates practical, delicious recipes. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API error:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to generate recipes', details: errorData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
      )
    }

    const data = await response.json()
    const generatedContent = data.choices[0].message.content

    console.log('Raw AI response:', generatedContent)

    // Parse the JSON response from AI
    let parsedRecipes
    try {
      parsedRecipes = JSON.parse(generatedContent)
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError)
      console.error('Raw content:', generatedContent)
      return new Response(
        JSON.stringify({ error: 'Failed to parse recipe data' }),
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
