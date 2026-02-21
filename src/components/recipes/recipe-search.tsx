"use client";

import { useState } from "react";
import { Search, UtensilsCrossed, Globe, Timer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { RecipeFilters } from "@/types";

interface RecipeSearchProps {
  onFiltersChange: (filters: RecipeFilters) => void;
}

export function RecipeSearch({ onFiltersChange }: RecipeSearchProps) {
  const [search, setSearch] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [maxPrepTime, setMaxPrepTime] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [status, setStatus] = useState("");

  const emit = (overrides: Partial<RecipeFilters>) => {
    onFiltersChange({
      search: search || undefined,
      ingredient: ingredient || undefined,
      cuisine: cuisine || undefined,
      maxPrepTime: maxPrepTime ? Number(maxPrepTime) : undefined,
      category: category as RecipeFilters["category"] || undefined,
      difficulty: difficulty as RecipeFilters["difficulty"] || undefined,
      status: status as RecipeFilters["status"] || undefined,
      ...overrides,
    });
  };

  return (
    <div className="space-y-3">
      {/* Row 1: text searches */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            className="pl-8"
            value={search}
            onChange={(e) => { setSearch(e.target.value); emit({ search: e.target.value || undefined }); }}
          />
        </div>
        <div className="relative flex-1 min-w-[180px]">
          <UtensilsCrossed className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ingredient..."
            className="pl-8"
            value={ingredient}
            onChange={(e) => { setIngredient(e.target.value); emit({ ingredient: e.target.value || undefined }); }}
          />
        </div>
        <div className="relative flex-1 min-w-[160px]">
          <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cuisine (e.g. italian)..."
            className="pl-8"
            value={cuisine}
            onChange={(e) => { setCuisine(e.target.value); emit({ cuisine: e.target.value || undefined }); }}
          />
        </div>
        <div className="relative min-w-[150px]">
          <Timer className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="number"
            placeholder="Max prep time (min)"
            className="pl-8"
            min={0}
            value={maxPrepTime}
            onChange={(e) => { setMaxPrepTime(e.target.value); emit({ maxPrepTime: e.target.value ? Number(e.target.value) : undefined }); }}
          />
        </div>
      </div>

      {/* Row 2: dropdowns */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-[140px]">
          <Label className="text-xs whitespace-nowrap text-muted-foreground">Category</Label>
          <Select value={category || "all"} onValueChange={(v) => { const val = v === "all" ? "" : v; setCategory(val); emit({ category: val as RecipeFilters["category"] || undefined }); }}>
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {["breakfast","lunch","dinner","dessert","snack","beverage","other"].map((c) => (
                <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 min-w-[130px]">
          <Label className="text-xs whitespace-nowrap text-muted-foreground">Difficulty</Label>
          <Select value={difficulty || "all"} onValueChange={(v) => { const val = v === "all" ? "" : v; setDifficulty(val); emit({ difficulty: val as RecipeFilters["difficulty"] || undefined }); }}>
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 min-w-[140px]">
          <Label className="text-xs whitespace-nowrap text-muted-foreground">Status</Label>
          <Select value={status || "all"} onValueChange={(v) => { const val = v === "all" ? "" : v; setStatus(val); emit({ status: val as RecipeFilters["status"] || undefined }); }}>
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="favorite">Favorite</SelectItem>
              <SelectItem value="to_try">To Try</SelectItem>
              <SelectItem value="made_before">Made Before</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
