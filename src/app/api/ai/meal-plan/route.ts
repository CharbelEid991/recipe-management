import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateMealPlan } from "@/lib/ai";
import { z } from "zod";

const schema = z.object({
  preferences: z.array(z.string()).optional(),
  dietary: z.array(z.string()).optional(),
  servings: z.number().optional(),
  daysCount: z.number().min(1).max(7).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const options = schema.parse(body);

    const plan = await generateMealPlan(options);
    return NextResponse.json(plan);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to generate meal plan" }, { status: 500 });
  }
}
