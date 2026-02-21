import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await db.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email!,
        name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
        avatarUrl: user.user_metadata?.avatar_url ?? null,
      },
      create: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
        avatarUrl: user.user_metadata?.avatar_url ?? null,
      },
    });

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}
