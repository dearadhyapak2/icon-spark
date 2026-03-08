// Thin wrapper around gtag for custom event tracking

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function track(event: string, params?: Record<string, string | number>) {
  if (window.gtag) {
    window.gtag("event", event, params);
  }
}

export function trackIconDownload(iconName: string, size: number, color: string) {
  track("icon_download", {
    icon_name: iconName,
    icon_size: size,
    icon_color: color,
  });
}

export function trackFavoriteToggle(iconName: string, action: "add" | "remove") {
  track("favorite_toggle", {
    icon_name: iconName,
    action,
  });
}

export function trackIconView(iconName: string) {
  track("icon_view", { icon_name: iconName });
}

export function trackCategoryView(categorySlug: string, categoryName: string) {
  track("category_view", {
    category_slug: categorySlug,
    category_name: categoryName,
  });
}

export function trackSearch(query: string, resultCount: number) {
  track("icon_search", {
    search_term: query,
    results_count: resultCount,
  });
}
