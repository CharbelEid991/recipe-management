"use client";

import { RecipeCard } from "./recipe-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Recipe } from "@/types";

interface RecipeListProps {
  recipes: Recipe[];
  loading?: boolean;
  showStatus?: boolean;
  emptyMessage?: string;
}

function RecipeCardSkeleton() {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <Skeleton className="h-48 w-full rounded-md" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <div className="flex gap-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-14" />
      </div>
    </div>
  );
}

export function RecipeList({ recipes, loading, showStatus, emptyMessage }: RecipeListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {emptyMessage ?? "No recipes found."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} showStatus={showStatus} />
      ))}
    </div>
  );
}
