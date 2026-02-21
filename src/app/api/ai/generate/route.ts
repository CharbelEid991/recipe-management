import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateRecipe } from "@/lib/ai";
import { z } from "zod";

const schema = z.object({
  prompt: z.string().min(1),
  servings: z.number().optional(),
  dietary: z.array(z.string()).optional(),
  cuisine: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { prompt, servings, dietary, cuisine } = schema.parse(body);

    const recipe = await generateRecipe(prompt, { servings, dietary, cuisine });
    return NextResponse.json(recipe);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to generate recipe" }, { status: 500 });
  }
}
