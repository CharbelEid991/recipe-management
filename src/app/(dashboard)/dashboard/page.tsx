"use client";

import Link from "next/link";
import { Plus, BookOpen, BookMarked, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecipeList } from "@/components/recipes/recipe-list";
import { MealPlanner } from "@/components/ai/meal-planner";
import { IngredientSubstitute } from "@/components/ai/ingredient-substitute";
import { useRecipes } from "@/hooks/use-recipes";
import { useUser } from "@/hooks/use-user";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user } = useUser();
  const { data: myRecipes, isLoading } = useRecipes({ authorId: user?.id });
  const { data: allRecipes } = useRecipes({ isPublic: true });
  const [sharedCount, setSharedCount] = useState(0);

  useEffect(() => {
    fetch("/api/shared")
      .then((r) => r.json())
      .then((data) => setSharedCount(Array.isArray(data) ? data.length : 0))
      .catch(() => setSharedCount(0));
  }, []);

  const stats = [
    { label: "My Recipes", value: myRecipes?.length ?? 0, icon: BookMarked, href: "/my-recipes", iconClass: "text-orange-500", cardClass: "border-orange-100 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:border-orange-900/30" },
    { label: "Public Recipes", value: allRecipes?.length ?? 0, icon: BookOpen, href: "/recipes", iconClass: "text-emerald-500", cardClass: "border-emerald-100 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:border-emerald-900/30" },
    { label: "Shared With Me", value: sharedCount, icon: Share2, href: "/shared", iconClass: "text-violet-500", cardClass: "border-violet-100 bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20 dark:border-violet-900/30" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
          </p>
        </div>
        <Button asChild>
          <Link href="/recipes/new">
            <Plus className="h-4 w-4 mr-2" /> New Recipe
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, href, iconClass, cardClass }) => (
          <Link key={label} href={href}>
            <Card className={`hover:shadow-md transition-shadow cursor-pointer ${cardClass}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>{label}</CardDescription>
                <Icon className={`h-4 w-4 ${iconClass}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">Recent Recipes</TabsTrigger>
          <TabsTrigger value="meal-plan">Meal Planner</TabsTrigger>
          <TabsTrigger value="substitute"><Sparkles className="h-3.5 w-3.5 mr-1" />AI Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="mt-4">
          <RecipeList
            recipes={(myRecipes ?? []).slice(0, 6)}
            loading={isLoading}
            showStatus
            emptyMessage="No recipes yet. Create your first one!"
          />
        </TabsContent>

        <TabsContent value="meal-plan" className="mt-4 max-w-xl">
          <MealPlanner />
        </TabsContent>

        <TabsContent value="substitute" className="mt-4 max-w-xl">
          <IngredientSubstitute />
        </TabsContent>
      </Tabs>
    </div>
  );
}
