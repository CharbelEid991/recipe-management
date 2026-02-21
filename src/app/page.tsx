import Link from "next/link";
import { ChefHat, Sparkles, Share2, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: ChefHat,
    title: "Recipe Management",
    description: "Create, organize, and manage all your recipes in one place.",
    iconClass: "text-orange-500",
    cardClass: "border-orange-100 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:border-orange-900/30",
  },
  {
    icon: Sparkles,
    title: "AI Generation",
    description: "Generate new recipes from a simple text prompt using Claude AI.",
    iconClass: "text-violet-500",
    cardClass: "border-violet-100 bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20 dark:border-violet-900/30",
  },
  {
    icon: Share2,
    title: "Sharing",
    description: "Share your recipes with friends and the community.",
    iconClass: "text-emerald-500",
    cardClass: "border-emerald-100 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:border-emerald-900/30",
  },
  {
    icon: CalendarDays,
    title: "Meal Planning",
    description: "Plan your weekly meals with AI-powered suggestions.",
    iconClass: "text-amber-500",
    cardClass: "border-amber-100 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:border-amber-900/30",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <ChefHat className="h-6 w-6 text-primary" />
          RecipeHub
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" asChild><Link href="/login">Sign in</Link></Button>
          <Button asChild><Link href="/signup">Get started</Link></Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 space-y-12">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Your AI-Powered Recipe Hub
          </h1>
          <p className="text-lg text-muted-foreground">
            Create, organize, and discover recipes. Generate new dishes with AI,
            find ingredient substitutes, and plan your meals for the week.
          </p>
          <div className="flex justify-center gap-3 pt-4">
            <Button size="lg" asChild><Link href="/signup">Start for free</Link></Button>
            <Button size="lg" variant="outline" asChild><Link href="/login">Sign in</Link></Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl w-full">
          {features.map(({ icon: Icon, title, description, iconClass, cardClass }) => (
            <div key={title} className={`rounded-xl border p-5 text-left space-y-2 ${cardClass}`}>
              <Icon className={`h-6 w-6 ${iconClass}`} />
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t px-6 py-4 text-center text-sm text-muted-foreground">
        Built with Next.js, Supabase, Prisma & Claude AI
      </footer>
    </div>
  );
}
