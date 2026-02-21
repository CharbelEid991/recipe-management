import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { z } from "zod";

const createRecipeSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  ingredients: z.array(z.object({
    name: z.string(),
    amount: z.number(),
    unit: z.string(),
    notes: z.string().optional(),
  })),
  instructions: z.array(z.string()),
  category: z.string().default("other"),
  difficulty: z.string().default("medium"),
  prepTime: z.number().min(0).default(0),
  cookTime: z.number().min(0).default(0),
  servings: z.number().min(1).default(4),
  imageUrl: z.string().optional(),
  status: z.string().default("to_try"),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? undefined;
    const ingredient = searchParams.get("ingredient") ?? undefined;
    const cuisine = searchParams.get("cuisine") ?? undefined;
    const maxPrepTime = searchParams.get("maxPrepTime") ? Number(searchParams.get("maxPrepTime")) : undefined;
    const category = searchParams.get("category") ?? undefined;
    const difficulty = searchParams.get("difficulty") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const authorId = searchParams.get("authorId") ?? undefined;

    // Build text search conditions (title, description, ingredient names, tags)
    const textSearchOr = search ? [
      { title: { contains: search, mode: "insensitive" as const } },
      { description: { contains: search, mode: "insensitive" as const } },
      // Search inside the ingredients JSON array cast to text via raw query approach:
      // We use string_contains on the JSON field (PostgreSQL casts JSON to text)
      { ingredients: { string_contains: search } },
    ] : [];

    // Ingredient-specific filter (cast JSON to text search)
    const ingredientOr = ingredient ? [
      { ingredients: { string_contains: ingredient } },
    ] : [];

    // Cuisine search via tags
    const cuisineOr = cuisine ? [
      { tags: { string_contains: cuisine.toLowerCase() } },
      { title: { contains: cuisine, mode: "insensitive" as const } },
    ] : [];

    const allSearchOr = [...textSearchOr, ...ingredientOr, ...cuisineOr];

    const recipes = await db.recipe.findMany({
      where: {
        ...(allSearchOr.length > 0 && { OR: allSearchOr }),
        ...(category && { category }),
        ...(difficulty && { difficulty }),
        ...(status && { status }),
        ...(maxPrepTime !== undefined && { prepTime: { lte: maxPrepTime } }),
        ...(authorId ? { authorId } : { OR: [{ isPublic: true }, { authorId: user?.id }] }),
      },
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const data = createRecipeSchema.parse(body);

    const recipe = await db.recipe.create({
      data: {
        ...data,
        authorId: user.id,
      },
      include: { author: true },
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to create recipe" }, { status: 500 });
  }
}
