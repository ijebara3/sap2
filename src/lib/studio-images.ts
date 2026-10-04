// WebP variants retain the original photos while avoiding full-resolution downloads.
const sources = import.meta.glob<string>("../assets/responsive/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

const image = (number: number) => {
  const url = (width: number) => sources[`../assets/responsive/studio-${number}-${width}.webp`];
  return {
    src: url(1280),
    srcSet: [640, 1280, 1920].map((width) => `${url(width)} ${width}w`).join(", "),
    width: 1920,
    height: 1280,
  };
};

export const studioImages = Array.from({ length: 10 }, (_, i) => image(i + 1));

export const fullWidthImageSizes = "(min-width: 1400px) 1320px, (min-width: 1024px) calc(100vw - 80px), calc(100vw - 48px)";
