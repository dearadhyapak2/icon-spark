import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { IconCard } from "@/components/IconCard";
import { IconDetailModal } from "@/components/IconDetailModal";
import { icons as allIcons, type IconData } from "@/data/icons";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Download } from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [selectedIcon, setSelectedIcon] = useState<IconData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("favorites")
        .select("icon_name")
        .eq("user_id", user!.id);
      return data?.map((f) => f.icon_name) || [];
    },
    enabled: !!user,
  });

  const { data: downloads = [] } = useQuery({
    queryKey: ["downloads", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("downloads")
        .select("icon_name, size, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50);
      return data || [];
    },
    enabled: !!user,
  });

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" />;

  const favoriteIcons = allIcons.filter((i) => favorites.includes(i.name));
  const downloadIconNames = [...new Set(downloads.map((d) => d.icon_name))];
  const downloadedIcons = allIcons.filter((i) => downloadIconNames.includes(i.name));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>

        <Tabs defaultValue="favorites">
          <TabsList>
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="h-4 w-4" /> Favorites ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="downloads" className="gap-2">
              <Download className="h-4 w-4" /> Downloads ({downloads.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="favorites" className="mt-6">
            {favoriteIcons.length === 0 ? (
              <p className="text-center py-16 text-muted-foreground">No favorites yet. Browse icons and click the heart to save them!</p>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {favoriteIcons.map((icon) => (
                  <IconCard
                    key={icon.name}
                    icon={icon}
                    onClick={(i) => { setSelectedIcon(i); setModalOpen(true); }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="downloads" className="mt-6">
            {downloadedIcons.length === 0 ? (
              <p className="text-center py-16 text-muted-foreground">No downloads yet.</p>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {downloadedIcons.map((icon) => (
                  <IconCard
                    key={icon.name}
                    icon={icon}
                    onClick={(i) => { setSelectedIcon(i); setModalOpen(true); }}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <IconDetailModal icon={selectedIcon} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
