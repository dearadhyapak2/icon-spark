import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { icons as lucideIcons } from "lucide-react";
import { createElement } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { IconCard } from "@/components/IconCard";
import { IconDetailModal } from "@/components/IconDetailModal";
import { categories, icons, searchIcons, type IconData } from "@/data/icons";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<IconData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const filteredIcons = searchQuery ? searchIcons(searchQuery) : icons.slice(0, 40);

  const handleIconClick = (icon: IconData) => {
    setSelectedIcon(icon);
    setModalOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-muted/30">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Unlimited Free{" "}
            <span className="text-primary">PNG Icons</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Browse 200+ high-quality icons. Download in any size, completely free.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-md gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search icons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-6 text-2xl font-semibold">Browse by Category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((cat) => {
            const CatIcon = lucideIcons[cat.icon as keyof typeof lucideIcons];
            return (
              <button
                key={cat.slug}
                onClick={() => navigate(`/category/${cat.slug}`)}
                className="group flex flex-col items-center gap-2 rounded-xl border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10">
                  {CatIcon && createElement(CatIcon, { size: 20, className: "text-foreground" })}
                </div>
                <span className="text-sm font-medium">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Icons grid */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="mb-6 text-2xl font-semibold">
          {searchQuery ? `Results for "${searchQuery}"` : "Popular Icons"}
        </h2>
        {filteredIcons.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No icons found.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {filteredIcons.map((icon) => (
              <IconCard key={icon.name} icon={icon} onClick={handleIconClick} />
            ))}
          </div>
        )}
      </section>

       <IconDetailModal icon={selectedIcon} open={modalOpen} onOpenChange={setModalOpen} />
       <Footer />
     </div>
   );
 };
 
 export default Index;
