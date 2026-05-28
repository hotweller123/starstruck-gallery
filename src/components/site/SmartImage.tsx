import { UnLazyImage } from "@unlazy/react";
import { useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  priority?: boolean;
  thumbhash?: string;
  blurhash?: string;
  placeholderSrc?: string;
}

/**
 * Site-wide image primitive.
 * - Lazy-loads off-screen images via IntersectionObserver (unlazy)
 * - Decodes async, fades in on load
 * - Pass `priority` for above-the-fold hero images (eager + high priority)
 */
export function SmartImage({
  src,
  alt,
  priority,
  thumbhash,
  blurhash,
  placeholderSrc,
  className,
  onLoad,
  ...rest
}: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <UnLazyImage
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      // @ts-expect-error - valid HTML attribute, types lag
      fetchpriority={priority ? "high" : "auto"}
      thumbhash={thumbhash}
      blurhash={blurhash}
      placeholderSrc={placeholderSrc}
      onImageLoad={(img) => {
        setLoaded(true);
        onLoad?.({ currentTarget: img } as never);
      }}
      className={cn(
        "transition-opacity duration-700 ease-out",
        loaded || priority ? "opacity-100" : "opacity-0",
        className,
      )}
      {...rest}
    />
  );
}
