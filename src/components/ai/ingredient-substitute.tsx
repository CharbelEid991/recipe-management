"use client";

import { useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Substitute {
  name: string;
  ratio: string;
  notes: string;
  dietaryInfo: string[];
}

export function IngredientSubstitute() {
  const [ingredient, setIngredient] = useState("");
  const [context, setContext] = useState("");
  const [dietary, setDietary] = useState("");
  const [loading, setLoading] = useState(false);
  const [substitutes, setSubstitutes] = useState<Substitute[]>([]);

  const handleFind = async () => {
    if (!ingredient.trim()) {
      toast.error("Please enter an ingredient.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ai/substitute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredient,
          recipeContext: context || undefined,
          dietary: dietary ? dietary.split(",").map((d) => d.trim()) : [],
        }),
      });

      if (!response.ok) throw new Error("Failed to find substitutes");
      const data = await response.json();
      setSubstitutes(data);
      toast.success("Substitutes found!");
    } catch {
      toast.error("Failed to find substitutes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-primary" />
          Ingredient Substitutes
        </CardTitle>
        <CardDescription>
          Find suitable replacements for any ingredient.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="ingredient">Ingredient *</Label>
          <Input
            id="ingredient"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            placeholder="e.g. Buttermilk"
          />
        </div>
        <div>
          <Label htmlFor="context">Recipe Context</Label>
          <Input
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. Pancakes batter"
          />
        </div>
        <div>
          <Label htmlFor="sub-dietary">Dietary Requirements</Label>
          <Input
            id="sub-dietary"
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            placeholder="vegan, dairy-free..."
          />
        </div>
        <Button onClick={handleFind} disabled={loading} className="w-full">
          {loading ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Finding...</>
          ) : (
            "Find Substitutes"
          )}
        </Button>

        {substitutes.length > 0 && (
          <div className="space-y-3 mt-2">
            {substitutes.map((sub, i) => (
              <div key={i} className="p-3 rounded-lg border">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{sub.name}</span>
                  <Badge variant="outline">{sub.ratio}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{sub.notes}</p>
                {sub.dietaryInfo?.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {sub.dietaryInfo.map((d) => (
                      <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
