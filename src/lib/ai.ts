import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function generateRecipe(prompt: string, options?: {
  servings?: number;
  dietary?: string[];
  cuisine?: string;
}) {
  const systemPrompt = `You are a professional chef and recipe creator. Generate detailed, practical recipes in valid JSON format.
Always respond with a single JSON object matching this structure:
{
  "title": string,
  "description": string,
  "ingredients": [{ "name": string, "amount": number, "unit": string, "notes"?: string }],
  "instructions": string[],
  "category": "breakfast"|"lunch"|"dinner"|"dessert"|"snack"|"beverage"|"other",
  "difficulty": "easy"|"medium"|"hard",
  "prepTime": number (minutes),
  "cookTime": number (minutes),
  "servings": number,
  "tags": string[]
}`;

  const userMessage = [
    `Generate a recipe for: ${prompt}`,
    options?.servings ? `Servings: ${options.servings}` : "",
    options?.dietary?.length ? `Dietary requirements: ${options.dietary.join(", ")}` : "",
    options?.cuisine ? `Cuisine style: ${options.cuisine}` : "",
  ].filter(Boolean).join("\n");

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in response");

  return JSON.parse(jsonMatch[0]);
}

export async function getIngredientSubstitutes(
  ingredient: string,
  options?: { recipeContext?: string; dietary?: string[] }
) {
  const systemPrompt = `You are a culinary expert specializing in ingredient substitutions.
Respond with a JSON array of substitutes:
[{ "name": string, "ratio": string, "notes": string, "dietaryInfo": string[] }]`;

  const userMessage = [
    `Find substitutes for: ${ingredient}`,
    options?.recipeContext ? `Recipe context: ${options.recipeContext}` : "",
    options?.dietary?.length ? `Dietary requirements: ${options.dietary.join(", ")}` : "",
  ].filter(Boolean).join("\n");

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const jsonMatch = content.text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("No JSON found in response");

  return JSON.parse(jsonMatch[0]);
}

export async function generateMealPlan(options?: {
  preferences?: string[];
  dietary?: string[];
  servings?: number;
  daysCount?: number;
}) {
  const days = options?.daysCount ?? 7;
  const systemPrompt = `You are a professional nutritionist and meal planner.
Generate a ${days}-day meal plan in JSON format:
{
  "monday"?: string (meal description),
  "tuesday"?: string,
  "wednesday"?: string,
  "thursday"?: string,
  "friday"?: string,
  "saturday"?: string,
  "sunday"?: string,
  "notes": string
}`;

  const userMessage = [
    `Generate a ${days}-day meal plan.`,
    options?.preferences?.length ? `Preferences: ${options.preferences.join(", ")}` : "",
    options?.dietary?.length ? `Dietary requirements: ${options.dietary.join(", ")}` : "",
    options?.servings ? `Servings per meal: ${options.servings}` : "",
  ].filter(Boolean).join("\n");

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in response");

  return JSON.parse(jsonMatch[0]);
}
