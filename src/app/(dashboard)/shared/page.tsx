"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Share2, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/recipes/status-badge";
import { formatTime, capitalize } from "@/lib/utils";
import type { Recipe, User, RecipeStatus } from "@/types";

interface SharedEntry {
  id: string;
  canEdit: boolean;
  createdAt: string;
  recipe: Recipe & { author: User };
  sharedBy: User;
}

function SharedRecipeCard({ entry }: { entry: SharedEntry }) {
  const { recipe, sharedBy, canEdit } = entry;
  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight line-clamp-2">{recipe.title}</h3>
            <StatusBadge status={recipe.status as RecipeStatus} />
          </div>
          {recipe.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-2 pb-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatTime(recipe.prepTime + recipe.cookTime)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {recipe.servings} servings
            </span>
            <Badge variant="outline" className="text-xs">{capitalize(recipe.category)}</Badge>
          </div>
          <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground border-t">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-[10px]">
                {sharedBy.email.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>
              Shared by <span className="font-medium text-foreground">{sharedBy.name ?? sharedBy.email}</span>
            </span>
            {canEdit && (
              <Badge variant="default" className="ml-auto text-xs">Can edit</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function SharedSkeleton() {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <div className="flex gap-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

export default function SharedPage() {
  const [entries, setEntries] = useState<SharedEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/shared")
      .then((r) => r.json())
      .then((data) => setEntries(Array.isArray(data) ? data : []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Share2 className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold">Shared With Me</h1>
        {!loading && entries.length > 0 && (
          <Badge variant="secondary">{entries.length}</Badge>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <SharedSkeleton key={i} />)}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Share2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No shared recipes yet</p>
          <p className="text-sm mt-1">When someone shares a recipe with you, it will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry) => (
            <SharedRecipeCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
