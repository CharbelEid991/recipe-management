"use client";

import { useState, useEffect } from "react";
import { Share2, Trash2, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ShareEntry {
  id: string;
  canEdit: boolean;
  sharedWith: { id: string; email: string; name: string | null };
}

interface ShareDialogProps {
  recipeId: string;
  recipeTitle: string;
}

export function ShareDialog({ recipeId, recipeTitle }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shares, setShares] = useState<ShareEntry[]>([]);
  const [loadingShares, setLoadingShares] = useState(false);

  const fetchShares = async () => {
    setLoadingShares(true);
    try {
      const res = await fetch(`/api/recipes/${recipeId}/share`);
      if (res.ok) setShares(await res.json());
    } catch {
      // ignore
    } finally {
      setLoadingShares(false);
    }
  };

  useEffect(() => {
    if (open) fetchShares();
  }, [open]);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/recipes/${recipeId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), canEdit }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to share recipe");
      } else {
        toast.success(`Recipe shared with ${email}!`);
        setEmail("");
        setCanEdit(false);
        await fetchShares();
      }
    } catch {
      toast.error("Failed to share recipe.");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (sharedWithId: string, userEmail: string) => {
    try {
      const res = await fetch(`/api/recipes/${recipeId}/share`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sharedWithId }),
      });
      if (res.ok) {
        toast.success(`Sharing revoked for ${userEmail}`);
        setShares((prev) => prev.filter((s) => s.sharedWith.id !== sharedWithId));
      } else {
        toast.error("Failed to revoke sharing.");
      }
    } catch {
      toast.error("Failed to revoke sharing.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Share recipe">
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Recipe</DialogTitle>
          <DialogDescription>
            Share &ldquo;{recipeTitle}&rdquo; with other users by their email address.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleShare} className="space-y-3 mt-2">
          <div>
            <Label htmlFor="share-email">Email address</Label>
            <Input
              id="share-email"
              type="email"
              placeholder="friend@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="can-edit"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              checked={canEdit}
              onChange={(e) => setCanEdit(e.target.checked)}
            />
            <Label htmlFor="can-edit" className="font-normal cursor-pointer">
              Allow editing
            </Label>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sharing...</>
            ) : (
              <><UserPlus className="h-4 w-4 mr-2" />Share</>
            )}
          </Button>
        </form>

        {loadingShares ? (
          <div className="text-center py-4 text-sm text-muted-foreground">Loading...</div>
        ) : shares.length > 0 ? (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase">Shared with</p>
            {shares.map((share) => (
              <div key={share.id} className="flex items-center justify-between gap-2 p-2 rounded-lg border">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="text-xs">
                      {share.sharedWith.email.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {share.sharedWith.name ?? share.sharedWith.email}
                    </p>
                    {share.sharedWith.name && (
                      <p className="text-xs text-muted-foreground truncate">{share.sharedWith.email}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={share.canEdit ? "default" : "secondary"} className="text-xs">
                    {share.canEdit ? "Can edit" : "View only"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleRevoke(share.sharedWith.id, share.sharedWith.email)}
                    title="Revoke access"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
