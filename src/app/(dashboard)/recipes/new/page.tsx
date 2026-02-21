"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecipeForm } from "@/components/recipes/recipe-form";
import { AIGenerator } from "@/components/ai/ai-generator";
import type { CreateRecipeInput } from "@/types";

function NewRecipeContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("ai") === "true" ? "ai" : "manual";
  const [aiDefaults, setAiDefaults] = useState<Partial<CreateRecipeInput> | undefined>();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Recipe</h1>
      <Tabs defaultValue={defaultTab}>
        <TabsList>
          <TabsTrigger value="manual">Manual</TabsTrigger>
          <TabsTrigger value="ai">AI Assisted</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="mt-4">
          <RecipeForm defaultValues={aiDefaults} />
        </TabsContent>

        <TabsContent value="ai" className="mt-4 space-y-6">
          <AIGenerator
            onGenerated={(recipe) => setAiDefaults(recipe as Partial<CreateRecipeInput>)}
          />
          {aiDefaults && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Review & Save</h2>
              <RecipeForm defaultValues={aiDefaults} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function NewRecipePage() {
  return (
    <Suspense fallback={<div className="space-y-6"><h1 className="text-2xl font-bold">New Recipe</h1><div>Loading...</div></div>}>
      <NewRecipeContent />
    </Suspense>
  );
}
