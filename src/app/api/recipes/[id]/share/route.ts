import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { z } from "zod";

const shareSchema = z.object({
  email: z.string().email(),
  canEdit: z.boolean().default(false),
});

// GET /api/recipes/[id]/share — list everyone this recipe is shared with
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const recipe = await db.recipe.findUnique({ where: { id } });
    if (!recipe) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (recipe.authorId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const shares = await db.sharedRecipe.findMany({
      where: { recipeId: id },
      include: { sharedWith: true },
    });

    return NextResponse.json(shares);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch shares" }, { status: 500 });
  }
}

// POST /api/recipes/[id]/share — share with a user by email
export async function POST(
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
    if (recipe.authorId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { email, canEdit } = shareSchema.parse(body);

    if (email === user.email) {
      return NextResponse.json({ error: "You cannot share a recipe with yourself" }, { status: 400 });
    }

    const targetUser = await db.user.findUnique({ where: { email } });
    if (!targetUser) {
      return NextResponse.json({ error: "No user found with that email address" }, { status: 404 });
    }

    const share = await db.sharedRecipe.upsert({
      where: { recipeId_sharedWithId: { recipeId: id, sharedWithId: targetUser.id } },
      update: { canEdit },
      create: {
        recipeId: id,
        sharedById: user.id,
        sharedWithId: targetUser.id,
        canEdit,
      },
      include: { sharedWith: true },
    });

    return NextResponse.json(share, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to share recipe" }, { status: 500 });
  }
}

// DELETE /api/recipes/[id]/share — revoke share (pass sharedWithId in body)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { sharedWithId } = body as { sharedWithId: string };

    const recipe = await db.recipe.findUnique({ where: { id } });
    if (!recipe || recipe.authorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.sharedRecipe.delete({
      where: { recipeId_sharedWithId: { recipeId: id, sharedWithId } },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to remove share" }, { status: 500 });
  }
}
