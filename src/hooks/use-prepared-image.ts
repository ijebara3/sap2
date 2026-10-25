import { useEffect, useState } from "react";
import { prepareImage, type ResponsiveImage } from "@/lib/responsive-image";

export function usePreparedImage(index: number, images: ResponsiveImage[], sizes: string) {
  const [visibleIndex, setVisibleIndex] = useState(index);

  useEffect(() => {
    if (index === visibleIndex) return;
    let cancelled = false;
    void prepareImage(images[index], sizes).then((loaded) => {
      if (loaded && !cancelled) setVisibleIndex(index);
    });
    return () => { cancelled = true; };
  }, [index, visibleIndex, images, sizes]);

  return visibleIndex;
}
