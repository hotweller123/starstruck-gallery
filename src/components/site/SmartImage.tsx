import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SmartImageProps {
  src: string;
  alt: string;
  /** Must pass real dimensions — prevents layout shift */
  width: number;
  height: number;
  className?: string;
  imgClassName?: string;
  /** Load immediately (above the fold) */
  priority?: boolean;
  objectFit?: "cover" | "contain";
}

/**
 * Session-level cache of image URLs that have successfully loaded at least once.
 * This survives component remounts (very common in masonry when scrolling).
 */
const loadedImageCache = new Set<string>();

export function SmartImage({
  src,
  alt,
  width,
  height,
  className,
  imgClassName,
  priority = false,
  objectFit = "cover",
}: SmartImageProps) {
  // Check the global cache first. If we've loaded this src before in this session,
  // we start in the final state (no blur, no animation replay).
  const wasPreviouslyLoaded = loadedImageCache.has(src);

  const [isLoaded, setIsLoaded] = useState(wasPreviouslyLoaded);
  const imgRef = useRef<HTMLImageElement>(null);

  // After mount, do a synchronous check in case the browser already has it in cache
  // (even if it wasn't in our Set yet, e.g. hard refresh + back button).
  useEffect(() => {
    if (isLoaded) return;

    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      loadedImageCache.add(src);
      setIsLoaded(true);
    }
  }, [src, isLoaded]);

  const handleLoad = () => {
    loadedImageCache.add(src);
    setIsLoaded(true);
  };

  // If we are (or were) loaded, render sharp with no entrance animation.
  // This is the key fix: once true, we stay in the final visual state forever for this src.
  const showFinalState = isLoaded || wasPreviouslyLoaded;

  return (
    <div
      className={cn("relative overflow-hidden bg-surface", className)}
      style={{ aspectRatio: `${width || 100} / ${height || 100}` }}
    >
      <motion.img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={handleLoad}
        // Only apply the blurred entrance the very first time this specific image loads.
        // After that (including on scroll back or remount), start already sharp.
        initial={showFinalState ? false : { opacity: 0, filter: "blur(18px)", scale: 1.02 }}
        // animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "absolute inset-0 h-full w-full will-change-[filter,opacity,transform]",
          objectFit === "cover" && "object-cover",
          objectFit === "contain" && "object-contain",
          imgClassName,
        )}
      />
    </div>
  );
}
