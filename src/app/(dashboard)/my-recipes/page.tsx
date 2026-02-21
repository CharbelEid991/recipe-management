"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeSearch } from "@/components/recipes/recipe-search";
import { RecipeList } from "@/components/recipes/recipe-list";
import { useRecipes } from "@/hooks/use-recipes";
import { useUser } from "@/hooks/use-user";
import type { RecipeFilters } from "@/types";

export default function MyRecipesPage() {
  const { user } = useUser();
  const [filters, setFilters] = useState<RecipeFilters>({});
  const { data: recipes, isLoading } = useRecipes({ ...filters, authorId: user?.id });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Recipes</h1>
        <Button asChild>
          <Link href="/recipes/new">
            <Plus className="h-4 w-4 mr-2" /> New Recipe
          </Link>
        </Button>
      </div>
      <RecipeSearch onFiltersChange={setFilters} />
      <RecipeList
        recipes={recipes ?? []}
        loading={isLoading}
        showStatus
        emptyMessage="You haven't created any recipes yet."
      />
    </div>
  );
}
