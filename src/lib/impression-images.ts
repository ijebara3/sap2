import { responsiveImage } from "./responsive-image";

const sources = import.meta.glob<string>("../assets/impressie/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

// Preserve each photograph's intrinsic proportions; the gallery uses object-cover.
const heights = [1281, 2879, 1281, 2879, 1280, 1280, 1281, 1280, 1281, 1281];

export const impressionImages = heights.map((height, index) => {
  const url = (width: number) => sources[`../assets/impressie/impressie-${index + 1}-${width}.webp`];
  return responsiveImage(url, height);
});
