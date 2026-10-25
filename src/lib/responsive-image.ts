import type { SyntheticEvent } from "react";

export interface ResponsiveImage {
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

const failedSources = new WeakMap<HTMLImageElement, Set<string>>();

function retryImage(element: HTMLImageElement, image: ResponsiveImage) {
  const failed = failedSources.get(element) ?? new Set<string>();
  failed.add(element.currentSrc || element.src);
  failedSources.set(element, failed);
  const candidates = [image.src, ...image.srcSet.split(", ").map((source) => source.split(" ")[0])];
  const next = candidates.find((source) => !failed.has(new URL(source, document.baseURI).href));
  if (!next) return false;
  failed.add(new URL(next, document.baseURI).href);
  element.removeAttribute("srcset");
  element.src = next;
  return true;
}

export function responsiveImage(url: (width: number) => string, height = 1280) {
  const image: ResponsiveImage = {
    src: url(1280),
    srcSet: [640, 1280, 1920].map((width) => `${url(width)} ${width}w`).join(", "),
    width: 1920,
    height,
  };
  return {
    ...image,
    onError: (event: SyntheticEvent<HTMLImageElement>) => { retryImage(event.currentTarget, image); },
  };
}

const pendingImages = new Map<string, Promise<boolean>>();

// Decode before replacing a visible photo, and share requests with autoplay.
export function prepareImage(image: ResponsiveImage, sizes: string) {
  const key = `${image.srcSet}|${sizes}|${window.innerWidth}|${window.devicePixelRatio}`;
  const pending = pendingImages.get(key);
  if (pending) return pending;
  const request = new Promise<boolean>((resolve) => {
    const preview = new Image();
    preview.onload = () => { void preview.decode().catch(() => {}).then(() => resolve(true)); };
    preview.onerror = () => { if (!retryImage(preview, image)) resolve(false); };
    preview.sizes = sizes;
    preview.srcset = image.srcSet;
    preview.src = image.src;
  });
  pendingImages.set(key, request);
  void request.then((loaded) => { if (!loaded) pendingImages.delete(key); });
  return request;
}
