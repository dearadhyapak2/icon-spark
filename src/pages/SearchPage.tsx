import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { IconCard } from "@/components/IconCard";
import { IconDetailModal } from "@/components/IconDetailModal";
import { searchIcons, type IconData } from "@/data/icons";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(query);
  const [selectedIcon, setSelectedIcon] = useState<IconData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const results = searchIcons(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: inputValue });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="h-4 w-4" />
          Back to all icons
        </Link>

        <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search icons..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <h1 className="text-2xl font-bold mb-2">
          {query ? `Results for "${query}"` : "Search Icons"}
        </h1>
        <p className="text-muted-foreground mb-6">{results.length} icons found</p>

        {results.length === 0 ? (
          <p className="text-center py-16 text-muted-foreground">No icons match your search.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {results.map((icon) => (
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
        )}
      </div>

      <IconDetailModal icon={selectedIcon} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
