"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CreateRecipeInput } from "@/types";

interface AIGeneratorProps {
  onGenerated?: (recipe: Partial<CreateRecipeInput>) => void;
}

export function AIGenerator({ onGenerated }: AIGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [dietary, setDietary] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Partial<CreateRecipeInput> | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a recipe description.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          dietary: dietary ? dietary.split(",").map((d) => d.trim()) : [],
          cuisine: cuisine || undefined,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate recipe");
      const data = await response.json();
      setResult(data);
      onGenerated?.(data);
      toast.success("Recipe generated!");
    } catch {
      toast.error("Failed to generate recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Recipe Generator
        </CardTitle>
        <CardDescription>
          Describe a recipe and AI will generate it for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="prompt">Recipe Description *</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A creamy mushroom risotto with parmesan and fresh herbs"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dietary">Dietary Requirements</Label>
            <Input
              id="dietary"
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              placeholder="vegan, gluten-free..."
            />
          </div>
          <div>
            <Label htmlFor="cuisine">Cuisine Style</Label>
            <Input
              id="cuisine"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              placeholder="Italian, Asian..."
            />
          </div>
        </div>
        <Button onClick={handleGenerate} disabled={loading} className="w-full">
          {loading ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="h-4 w-4 mr-2" /> Generate Recipe</>
          )}
        </Button>

        {result && (
          <div className="mt-4 p-4 rounded-lg border bg-muted/50">
            <h4 className="font-semibold mb-1">{result.title}</h4>
            <p className="text-sm text-muted-foreground">{result.description}</p>
            <p className="text-xs mt-2 text-muted-foreground">
              Recipe generated — review and save it using the form above.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
