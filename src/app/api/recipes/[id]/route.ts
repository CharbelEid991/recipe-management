import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { z } from "zod";

const updateRecipeSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  ingredients: z.array(z.object({
    name: z.string(),
    amount: z.number(),
    unit: z.string(),
    notes: z.string().optional(),
  })).optional(),
  instructions: z.array(z.string()).optional(),
  category: z.string().optional(),
  difficulty: z.string().optional(),
  prepTime: z.number().min(0).optional(),
  cookTime: z.number().min(0).optional(),
  servings: z.number().min(1).optional(),
  imageUrl: z.string().optional(),
  status: z.string().optional(),
  isPublic: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const recipe = await db.recipe.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const isOwner = recipe.authorId === user?.id;

    if (!recipe.isPublic && !isOwner) {
      const share = user
        ? await db.sharedRecipe.findUnique({
            where: { recipeId_sharedWithId: { recipeId: id, sharedWithId: user.id } },
          })
        : null;
      if (!share) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      return NextResponse.json({ ...recipe, canEdit: share.canEdit });
    }

    // For public recipes, still check if the user has an explicit canEdit share
    if (!isOwner && user) {
      const share = await db.sharedRecipe.findUnique({
        where: { recipeId_sharedWithId: { recipeId: id, sharedWithId: user.id } },
      });
      return NextResponse.json({ ...recipe, canEdit: share?.canEdit ?? false });
    }

    return NextResponse.json({ ...recipe, canEdit: isOwner });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch recipe" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const recipe = await db.recipe.findUnique({ where: { id } });
    if (!recipe) return NextResponse.json({ error: "Recipe not found" }, { status: 404 });

    const isOwner = recipe.authorId === user.id;
    if (!isOwner) {
      const share = await db.sharedRecipe.findUnique({
        where: { recipeId_sharedWithId: { recipeId: id, sharedWithId: user.id } },
      });
      if (!share?.canEdit) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = updateRecipeSchema.parse(body);

    const updated = await db.recipe.update({
      where: { id },
      data,
      include: { author: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to update recipe" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const recipe = await db.recipe.findUnique({ where: { id } });
    if (!recipe) return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    if (recipe.authorId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await db.recipe.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete recipe" }, { status: 500 });
  }
}
