import { icons as lucideIcons } from "lucide-react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

export async function downloadIconAsPng(
  iconName: string,
  size: number = 64
): Promise<void> {
  const IconComponent = lucideIcons[iconName as keyof typeof lucideIcons];
  if (!IconComponent) return;

  const svgString = renderToStaticMarkup(
    createElement(IconComponent, {
      size,
      strokeWidth: 2,
      color: "#000000",
    })
  );

  const canvas = document.createElement("canvas");
  const padding = Math.round(size * 0.15);
  canvas.width = size + padding * 2;
  canvas.height = size + padding * 2;
  const ctx = canvas.getContext("2d")!;

  const img = new window.Image();
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve) => {
    img.onload = () => {
      ctx.drawImage(img, padding, padding, size, size);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `${iconName}-${size}px.png`;
          link.click();
          URL.revokeObjectURL(link.href);
        }
        resolve();
      }, "image/png");
    };
    img.src = url;
  });
}
