import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Search, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { IconCard } from "@/components/IconCard";
import { IconDetailModal } from "@/components/IconDetailModal";
import { getIconsByCategory, getCategoryBySlug, type IconData } from "@/data/icons";
import { trackCategoryView, trackIconView } from "@/lib/analytics";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<IconData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const category = getCategoryBySlug(slug || "");
  const allIcons = getIconsByCategory(slug || "");
  const filteredIcons = searchQuery
    ? allIcons.filter(
        (i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.tags.some((t) => t.includes(searchQuery.toLowerCase()))
      )
    : allIcons;

  useEffect(() => {
    if (category) {
      trackCategoryView(slug || "", category.name);
    }
  }, [slug, category]);

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Category not found.</p>
          <Link to="/" className="text-primary underline mt-4 inline-block">Go back</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="h-4 w-4" />
          Back to all icons
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground">{allIcons.length} icons</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search in category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {filteredIcons.map((icon) => (
            <IconCard
              key={icon.name}
              icon={icon}
              onClick={(i) => {
                setSelectedIcon(i);
                setModalOpen(true);
              }}
            />
          ))}
        </div>
      </div>

       <IconDetailModal icon={selectedIcon} open={modalOpen} onOpenChange={setModalOpen} />
       <Footer />
     </div>
   );
 }
