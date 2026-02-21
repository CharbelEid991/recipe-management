"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Recipe, RecipeFilters, CreateRecipeInput, UpdateRecipeInput } from "@/types";

async function fetchRecipes(filters?: RecipeFilters): Promise<Recipe[]> {
  const params = new URLSearchParams();
  if (filters?.search) params.set("search", filters.search);
  if (filters?.ingredient) params.set("ingredient", filters.ingredient);
  if (filters?.cuisine) params.set("cuisine", filters.cuisine);
  if (filters?.maxPrepTime !== undefined) params.set("maxPrepTime", String(filters.maxPrepTime));
  if (filters?.category) params.set("category", filters.category);
  if (filters?.difficulty) params.set("difficulty", filters.difficulty);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.authorId) params.set("authorId", filters.authorId);

  const response = await fetch(`/api/recipes?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch recipes");
  return response.json();
}

async function fetchRecipe(id: string): Promise<Recipe> {
  const response = await fetch(`/api/recipes/${id}`);
  if (!response.ok) throw new Error("Failed to fetch recipe");
  return response.json();
}

async function createRecipe(data: CreateRecipeInput): Promise<Recipe> {
  const response = await fetch("/api/recipes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create recipe");
  return response.json();
}

async function updateRecipe({ id, ...data }: UpdateRecipeInput): Promise<Recipe> {
  const response = await fetch(`/api/recipes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update recipe");
  return response.json();
}

async function deleteRecipe(id: string): Promise<void> {
  const response = await fetch(`/api/recipes/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete recipe");
}

export function useRecipes(filters?: RecipeFilters) {
  return useQuery({
    queryKey: ["recipes", filters],
    queryFn: () => fetchRecipes(filters),
  });
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: ["recipe", id],
    queryFn: () => fetchRecipe(id),
    enabled: !!id,
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRecipe,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recipes"] }),
  });
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRecipe,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipe", variables.id] });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRecipe,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recipes"] }),
  });
}
