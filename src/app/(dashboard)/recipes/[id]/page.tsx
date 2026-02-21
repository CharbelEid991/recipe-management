"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, Users, ChefHat, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/recipes/status-badge";
import { ShareDialog } from "@/components/recipes/share-dialog";
import { RecipeForm } from "@/components/recipes/recipe-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecipe, useDeleteRecipe } from "@/hooks/use-recipes";
import { useUser } from "@/hooks/use-user";
import { formatTime, capitalize } from "@/lib/utils";

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: recipe, isLoading } = useRecipe(id);
  const { user } = useUser();
  const deleteRecipe = useDeleteRecipe();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get("edit") === "true";

  const isOwner = user?.id === recipe?.authorId;
  const canEdit = isOwner || recipe?.canEdit === true;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await deleteRecipe.mutateAsync(id);
      toast.success("Recipe deleted.");
      router.push("/my-recipes");
    } catch {
      toast.error("Failed to delete recipe.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!recipe) {
    return <div className="text-muted-foreground">Recipe not found.</div>;
  }

  if (isEditing && canEdit) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/recipes/${id}`}><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <h1 className="text-2xl font-bold">Edit Recipe</h1>
        </div>
        <RecipeForm recipe={recipe} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/recipes"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="text-2xl font-bold flex-1">{recipe.title}</h1>
        {canEdit && (
          <div className="flex gap-2">
            {isOwner && <ShareDialog recipeId={id} recipeTitle={recipe?.title ?? ""} />}
            <Button variant="outline" size="icon" asChild>
              <Link href={`/recipes/${id}?edit=true`}><Pencil className="h-4 w-4" /></Link>
            </Button>
            {isOwner && (
              <Button variant="destructive" size="icon" onClick={handleDelete} disabled={deleteRecipe.isPending}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {recipe.imageUrl && (
        <div className="relative h-64 w-full rounded-xl overflow-hidden">
          <Image src={recipe.imageUrl} alt={recipe.title} fill className="object-cover" />
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <StatusBadge status={recipe.status} />
        <Badge variant="outline">{capitalize(recipe.category)}</Badge>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {formatTime(recipe.prepTime + recipe.cookTime)}
        </span>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          {recipe.servings} servings
        </span>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <ChefHat className="h-4 w-4" />
          {capitalize(recipe.difficulty)}
        </span>
      </div>

      {recipe.description && (
        <p className="text-muted-foreground">{recipe.description}</p>
      )}

      {recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {recipe.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      )}

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-3">Ingredients</h2>
        <ul className="space-y-2">
          {(recipe.ingredients as { name: string; amount: number; unit: string; notes?: string }[]).map((ing, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="font-medium">{ing.amount} {ing.unit}</span>
              <span>{ing.name}</span>
              {ing.notes && <span className="text-muted-foreground">({ing.notes})</span>}
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-3">Instructions</h2>
        <ol className="space-y-3">
          {(recipe.instructions as string[]).map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="font-semibold text-primary shrink-0">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
