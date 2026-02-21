"use client";

import { useState } from "react";
import { CalendarDays, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

interface MealPlanResult {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
  notes?: string;
}

export function MealPlanner() {
  const [preferences, setPreferences] = useState("");
  const [dietary, setDietary] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<MealPlanResult | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: preferences ? preferences.split(",").map((p) => p.trim()) : [],
          dietary: dietary ? dietary.split(",").map((d) => d.trim()) : [],
          daysCount: 7,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate meal plan");
      const data = await response.json();
      setPlan(data);
      toast.success("Meal plan generated!");
    } catch {
      toast.error("Failed to generate meal plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          AI Meal Planner
        </CardTitle>
        <CardDescription>
          Generate a personalized weekly meal plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="preferences">Meal Preferences</Label>
          <Input
            id="preferences"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="Mediterranean, high-protein..."
          />
        </div>
        <div>
          <Label htmlFor="mp-dietary">Dietary Requirements</Label>
          <Input
            id="mp-dietary"
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            placeholder="vegetarian, nut-free..."
          />
        </div>
        <Button onClick={handleGenerate} disabled={loading} className="w-full">
          {loading ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
          ) : (
            "Generate Weekly Plan"
          )}
        </Button>

        {plan && (
          <div className="mt-2 space-y-2">
            {DAYS.map((day) => plan[day] && (
              <div key={day} className="flex gap-3 p-2 rounded-lg border">
                <span className="text-sm font-medium w-24 capitalize shrink-0">{day}</span>
                <span className="text-sm text-muted-foreground">{plan[day]}</span>
              </div>
            ))}
            {plan.notes && (
              <p className="text-xs text-muted-foreground pt-2 italic">{plan.notes}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
