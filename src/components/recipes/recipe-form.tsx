"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateRecipe, useUpdateRecipe } from "@/hooks/use-recipes";
import type { Recipe, CreateRecipeInput } from "@/types";

interface RecipeFormProps {
  recipe?: Recipe;
  defaultValues?: Partial<CreateRecipeInput>;
}

export function RecipeForm({ recipe, defaultValues }: RecipeFormProps) {
  const router = useRouter();
  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();
  const isEditing = !!recipe;

  const [title, setTitle] = useState(recipe?.title ?? defaultValues?.title ?? "");
  const [description, setDescription] = useState(recipe?.description ?? defaultValues?.description ?? "");
  const [category, setCategory] = useState<string>(recipe?.category ?? defaultValues?.category ?? "other");
  const [difficulty, setDifficulty] = useState<string>(recipe?.difficulty ?? defaultValues?.difficulty ?? "medium");
  const [prepTime, setPrepTime] = useState(recipe?.prepTime ?? defaultValues?.prepTime ?? 0);
  const [cookTime, setCookTime] = useState(recipe?.cookTime ?? defaultValues?.cookTime ?? 0);
  const [servings, setServings] = useState(recipe?.servings ?? defaultValues?.servings ?? 4);
  const [status, setStatus] = useState<string>(recipe?.status ?? defaultValues?.status ?? "to_try");
  const [imageUrl, setImageUrl] = useState(recipe?.imageUrl ?? defaultValues?.imageUrl ?? "");
  const [tags, setTags] = useState((recipe?.tags ?? defaultValues?.tags ?? []).join(", "));

  const [ingredients, setIngredients] = useState(
    recipe?.ingredients ?? defaultValues?.ingredients ?? [{ name: "", amount: 1, unit: "" }]
  );
  const [instructions, setInstructions] = useState(
    recipe?.instructions ?? defaultValues?.instructions ?? [""]
  );

  const addIngredient = () =>
    setIngredients([...ingredients, { name: "", amount: 1, unit: "" }]);

  const removeIngredient = (i: number) =>
    setIngredients(ingredients.filter((_, idx) => idx !== i));

  const updateIngredient = (i: number, field: string, value: string | number) =>
    setIngredients(ingredients.map((ing, idx) => idx === i ? { ...ing, [field]: value } : ing));

  const addInstruction = () => setInstructions([...instructions, ""]);
  const removeInstruction = (i: number) =>
    setInstructions(instructions.filter((_, idx) => idx !== i));
  const updateInstruction = (i: number, value: string) =>
    setInstructions(instructions.map((ins, idx) => idx === i ? value : ins));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: CreateRecipeInput = {
      title,
      description: description || undefined,
      ingredients: ingredients.filter((i) => i.name.trim()),
      instructions: instructions.filter((i) => i.trim()),
      category: category as CreateRecipeInput["category"],
      difficulty: difficulty as CreateRecipeInput["difficulty"],
      prepTime: Number(prepTime),
      cookTime: Number(cookTime),
      servings: Number(servings),
      status: status as CreateRecipeInput["status"],
      imageUrl: imageUrl || undefined,
      isPublic: true,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (isEditing) {
        await updateRecipe.mutateAsync({ id: recipe.id, ...data });
        toast.success("Recipe updated!");
      } else {
        const created = await createRecipe.mutateAsync(data);
        toast.success("Recipe created!");
        router.push(`/recipes/${created.id}`);
        return;
      }
      router.push(`/recipes/${recipe?.id}`);
    } catch {
      toast.error("Failed to save recipe.");
    }
  };

  const isPending = createRecipe.isPending || updateRecipe.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader><CardTitle>Basic Info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["breakfast","lunch","dinner","dessert","snack","beverage","other"].map((c) => (
                    <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Prep Time (min)</Label>
              <Input type="number" min={0} value={prepTime} onChange={(e) => setPrepTime(Number(e.target.value))} />
            </div>
            <div>
              <Label>Cook Time (min)</Label>
              <Input type="number" min={0} value={cookTime} onChange={(e) => setCookTime(Number(e.target.value))} />
            </div>
            <div>
              <Label>Servings</Label>
              <Input type="number" min={1} value={servings} onChange={(e) => setServings(Number(e.target.value))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="to_try">To Try</SelectItem>
                  <SelectItem value="made_before">Made Before</SelectItem>
                  <SelectItem value="favorite">Favorite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="italian, pasta, quick" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ingredients</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input placeholder="Name" value={ing.name} onChange={(e) => updateIngredient(i, "name", e.target.value)} className="flex-1" />
              <Input type="number" placeholder="Amount" value={ing.amount} onChange={(e) => updateIngredient(i, "amount", Number(e.target.value))} className="w-24" />
              <Input placeholder="Unit" value={ing.unit} onChange={(e) => updateIngredient(i, "unit", e.target.value)} className="w-24" />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(i)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Instructions</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addInstruction}>
              <Plus className="h-4 w-4 mr-1" /> Add Step
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {instructions.map((step, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="mt-2 text-sm font-medium text-muted-foreground w-6">{i + 1}.</span>
              <Textarea
                value={step}
                onChange={(e) => updateInstruction(i, e.target.value)}
                placeholder={`Step ${i + 1}`}
                rows={2}
                className="flex-1"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeInstruction(i)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : isEditing ? "Update Recipe" : "Create Recipe"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
