"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, BookMarked, Share2, Sparkles, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/recipes", label: "All Recipes", icon: BookOpen },
  { href: "/my-recipes", label: "My Recipes", icon: BookMarked },
  { href: "/shared", label: "Shared With Me", icon: Share2 },
];

const aiItems = [
  { href: "/recipes/new?ai=true", label: "AI Generator", icon: Sparkles },
  { href: "/dashboard?tab=meal-plan", label: "Meal Planner", icon: CalendarDays },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r bg-background min-h-[calc(100vh-3.5rem)] p-4">
      <nav className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase px-2 mb-2">Navigation</p>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
              pathname === href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}

        <div className="pt-4">
          <p className="text-xs font-medium text-muted-foreground uppercase px-2 mb-2">AI Tools</p>
          {aiItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}
