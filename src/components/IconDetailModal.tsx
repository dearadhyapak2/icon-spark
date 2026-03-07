import { icons as lucideIcons } from "lucide-react";
import { createElement, useState } from "react";
import { IconData } from "@/data/icons";
import { downloadIconAsPng } from "@/lib/download-icon";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Heart, HeartOff } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const sizes = [16, 32, 64, 128, 256, 512];

interface IconDetailModalProps {
  icon: IconData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IconDetailModal({ icon, open, onOpenChange }: IconDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState(128);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: isFavorited } = useQuery({
    queryKey: ["favorite", icon?.name, user?.id],
    queryFn: async () => {
      if (!user || !icon) return false;
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("icon_name", icon.name)
        .maybeSingle();
      return !!data;
    },
    enabled: !!user && !!icon,
  });

  const toggleFavorite = useMutation({
    mutationFn: async () => {
      if (!user || !icon) return;
      if (isFavorited) {
        await supabase.from("favorites").delete().eq("user_id", user.id).eq("icon_name", icon.name);
      } else {
        await supabase.from("favorites").insert({ user_id: user.id, icon_name: icon.name });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite", icon?.name] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast(isFavorited ? "Removed from favorites" : "Added to favorites");
    },
  });

  const handleDownload = async () => {
    if (!icon) return;
    await downloadIconAsPng(icon.name, selectedSize);
    if (user) {
      await supabase.from("downloads").insert({
        user_id: user.id,
        icon_name: icon.name,
        size: selectedSize,
      });
    }
    toast("Icon downloaded!");
  };

  if (!icon) return null;

  const LucideIcon = lucideIcons[icon.name as keyof typeof lucideIcons];
  if (!LucideIcon) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{icon.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {/* Preview */}
          <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-muted">
            {createElement(LucideIcon, { size: 80, className: "text-foreground" })}
          </div>

          {/* Size previews */}
          <div className="flex items-end gap-4">
            {[16, 32, 48, 64].map((s) => (
              <div key={s} className="flex flex-col items-center gap-1">
                {createElement(LucideIcon, { size: s, className: "text-foreground" })}
                <span className="text-[10px] text-muted-foreground">{s}px</span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {icon.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Size selector */}
          <div className="w-full">
            <p className="mb-2 text-sm font-medium">Download size</p>
            <div className="grid grid-cols-6 gap-2">
              {sizes.map((s) => (
                <Button
                  key={s}
                  variant={selectedSize === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSize(s)}
                  className="text-xs"
                >
                  {s}px
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex w-full gap-3">
            <Button className="flex-1 gap-2" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              Download PNG
            </Button>
            {user && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleFavorite.mutate()}
              >
                {isFavorited ? (
                  <HeartOff className="h-4 w-4" />
                ) : (
                  <Heart className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
