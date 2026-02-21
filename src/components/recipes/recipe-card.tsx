import Link from "next/link";
import Image from "next/image";
import { Clock, Users, ChefHat } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./status-badge";
import { formatTime, capitalize } from "@/lib/utils";
import type { Recipe } from "@/types";

interface RecipeCardProps {
  recipe: Recipe;
  showStatus?: boolean;
}

const difficultyColor: Record<string, string> = {
  easy: "text-green-600",
  medium: "text-yellow-600",
  hard: "text-red-600",
};

export function RecipeCard({ recipe, showStatus = false }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        {recipe.imageUrl && (
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight line-clamp-2">{recipe.title}</h3>
            {showStatus && <StatusBadge status={recipe.status} />}
          </div>
          {recipe.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
          )}
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatTime(recipe.prepTime + recipe.cookTime)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {recipe.servings}
            </span>
            <span className={`flex items-center gap-1 ${difficultyColor[recipe.difficulty]}`}>
              <ChefHat className="h-3.5 w-3.5" />
              {capitalize(recipe.difficulty)}
            </span>
          </div>
        </CardContent>
        {recipe.tags.length > 0 && (
          <CardFooter className="flex flex-wrap gap-1 pt-0">
            {recipe.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
