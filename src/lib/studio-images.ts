import { responsiveImage } from "./responsive-image";

// WebP variants retain the original photos while avoiding full-resolution downloads.
const sources = import.meta.glob<string>("../assets/responsive/studio-[1-4]-*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

const image = (number: number) => {
  const url = (width: number) => sources[`../assets/responsive/studio-${number}-${width}.webp`];
  return responsiveImage(url);
};

export const studioImages = Array.from({ length: 4 }, (_, i) => image(i + 1));

export const fullWidthImageSizes = "(min-width: 1400px) 1320px, (min-width: 1024px) calc(100vw - 80px), calc(100vw - 48px)";
