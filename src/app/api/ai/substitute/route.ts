import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getIngredientSubstitutes } from "@/lib/ai";
import { z } from "zod";

const schema = z.object({
  ingredient: z.string().min(1),
  recipeContext: z.string().optional(),
  dietary: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { ingredient, recipeContext, dietary } = schema.parse(body);

    const substitutes = await getIngredientSubstitutes(ingredient, { recipeContext, dietary });
    return NextResponse.json(substitutes);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to find substitutes" }, { status: 500 });
  }
}
