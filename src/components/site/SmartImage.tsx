import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, "loading"> {
  src: string;
  alt: string;
  /** Eager-load + high fetchpriority for above-the-fold images. */
  priority?: boolean;
}

/**
 * Site-wide image primitive.
 * - Native lazy-loading + async decoding
 * - Fades in on load (skips fade if cached / already complete)
 * - `priority` flag for above-the-fold (eager + fetchPriority="high")
 */
export function SmartImage({
  src,
  alt,
  priority,
  className,
  onLoad,
  style,
  ...rest
}: Props) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  // If the browser already has the image cached, the load event may have
  // fired before React attached its handler — sync state on mount.
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      className={cn(
        "transition-opacity duration-700 ease-out",
        loaded || priority ? "opacity-100" : "opacity-0",
        className,
      )}
      style={style}
      {...rest}
    />
  );
}
