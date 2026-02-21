import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";

// GET /api/shared — recipes shared with the current user
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const shares = await db.sharedRecipe.findMany({
      where: { sharedWithId: user.id },
      include: {
        recipe: { include: { author: true } },
        sharedBy: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(shares);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch shared recipes" }, { status: 500 });
  }
}
