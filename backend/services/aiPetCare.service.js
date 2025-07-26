const { GoogleGenAI } = require("@google/genai");
// const dotenv = require("dotenv");
// dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

async function main(petData) {
  // Format the petData object into a readable string for the prompt
  const petInfo = Object.entries(petData)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  // Compose the prompt and system instructions
//   my pat age ${petage}
//   my pat breader ${petbreade}
 
//   my pat weight ${petweight}
 
 
//   my  city ${petcity}
 
//   my area temprature ${temperature}
 
//   my pat age ${petage}
const prompt = `
You are a smart and concise pet care assistant.

Below is my pet's profile:

Pet Profile:
${petInfo}

${petData.additionalDetails ? `Additional Details: ${petData.additionalDetails}` : ''}

Analyze the information and return personalized care recommendations for my pet. Keep answers **short and specific** — prefer **one-word or minimal phrases**. Avoid full sentences. ${petData.additionalDetails ? 'Pay special attention to the additional details provided.' : ''}

Respond strictly in **valid JSON format** with the following keys:

{
  "petType": "Ideal food type (1-3 words)",
  "food_brands": ["Top 2-4 food brands specialy for india"],
  "food_brand_products_links": ["Direct URLs for the brands above"],
  "workout": "Workout type (e.g. 'Fetch', 'Run')",
  "walking_km_per_day": Number,
  "meal_grams": Number,
  "meals_per_day": Number,
  "baths_per_month": Number,
  "bath_time": "When to bathe (e.g. 'Morning', 'Weekend')",
  "daily_activities": ["1-3 fun or stimulating activities"],
  "other_recommendations": "Short tip for health/happiness",
  "additional_info": "Specific advice based on additional details provided"
}

Ensure your output is **only valid JSON**. Do not include any text outside the JSON.
`;



  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    system: `
      You are a helpful pet care assistant. 
      Always respond in JSON format as specified in the prompt.
    `,
  });

  // Try to parse the AI's response as JSON, even if it's inside a code block
  let result;
  let text = response.text.trim();

  // Remove code block if present
  if (text.startsWith("```")) {
    text = text.replace(/^```json|^```/i, "").replace(/```$/, "").trim();
  }

  try {
    result = JSON.parse(text);
  } catch (e) {
    result = { error: "Could not parse AI response", raw: response.text };
  }
  return result;
}

module.exports = main;