import { icons as lucideIcons } from "lucide-react";
import { IconData } from "@/data/icons";
import { createElement } from "react";

interface IconCardProps {
  icon: IconData;
  onClick: (icon: IconData) => void;
}

export function IconCard({ icon, onClick }: IconCardProps) {
  const LucideIcon = lucideIcons[icon.name as keyof typeof lucideIcons];

  if (!LucideIcon) return null;

  return (
    <button
      onClick={() => onClick(icon)}
      className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10">
        {createElement(LucideIcon, { size: 28, className: "text-foreground" })}
      </div>
      <span className="text-xs font-medium text-muted-foreground truncate w-full text-center">
        {icon.name}
      </span>
    </button>
  );
}
