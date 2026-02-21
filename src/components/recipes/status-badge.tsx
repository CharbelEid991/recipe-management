import { Badge } from "@/components/ui/badge";
import { Heart, BookMarked, CheckCircle } from "lucide-react";
import type { RecipeStatus } from "@/types";

const statusConfig: Record<RecipeStatus, {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  icon: React.ElementType;
  className: string;
}> = {
  favorite:     { label: "Favorite",     variant: "default",   icon: Heart,       className: "bg-rose-500 hover:bg-rose-600 border-rose-500" },
  to_try:       { label: "To Try",       variant: "secondary", icon: BookMarked,  className: "" },
  made_before:  { label: "Made Before",  variant: "outline",   icon: CheckCircle, className: "border-green-500 text-green-700" },
};

export function StatusBadge({ status }: { status: RecipeStatus }) {
  const config = statusConfig[status] ?? statusConfig.to_try;
  const Icon = config.icon;
  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}
