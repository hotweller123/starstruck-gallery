import { motion } from "motion/react";
import { cn } from "@/utils/gen";

export interface LoaderProps {
  /** Size of the loader */
  size?: "xs" | "sm" | "md" | "lg";
  /** Optional message below the loader */
  message?: string;
  /** Additional classes */
  className?: string;
  /** If true, centers the loader in a full-viewport overlay */
  fullScreen?: boolean;
  /** Subtle variant that feels more "art gallery" than mechanical */
  variant?: "default" | "soft" | "dots";
}

/**
 * Elegant, quiet loading component designed for this gallery project.
 *
 * Usage examples:
 *
 *   <Loader />                                    // default soft spinner
 *   <Loader size="lg" message="Loading exhibition..." />
 *   <Loader fullScreen message="Preparing gallery" />  // overlay
 *   <InlineLoader />                              // tiny inline version
 *
 * Variants:
 *   - "soft"   → refined pulsing ring (recommended)
 *   - "dots"   → three subtle dots
 *   - "default" → slightly stronger ring
 */
export function Loader({
  size = "md",
  message,
  className,
  fullScreen = false,
  variant = "soft",
}: LoaderProps) {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-7 w-7",
  };

  const baseContainer = "flex flex-col items-center justify-center gap-3";
  const containerClasses = fullScreen
    ? cn(
        "fixed inset-0 z-[60] flex items-center justify-center bg-canvas/70 backdrop-blur-[2px]",
        className,
      )
    : cn(baseContainer, className);

  if (variant === "dots") {
    return (
      <div className={containerClasses}>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn("rounded-full bg-ink/60", sizeClasses[size])}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.85, 1, 0.85],
              }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                delay: i * 0.18,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        {message && <p className="text-[10px] uppercase tracking-[0.3em] text-detail">{message}</p>}
      </div>
    );
  }

  // Default "soft" elegant loader (recommended for this project)
  return (
    <div className={containerClasses}>
      <motion.div
        className={cn(
          "rounded-full border border-ink/15",
          sizeClasses[size],
          variant === "default" && "border-ink/30",
        )}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.4, 0.9, 0.4],
          borderColor: ["rgba(0,0,0,0.08)", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.08)"],
        }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: [0.4, 0, 0.2, 1],
        }}
      />

      {message && <p className="text-[10px] uppercase tracking-[0.3em] text-detail">{message}</p>}
    </div>
  );
}

/**
 * Tiny inline version — useful inside cards or small areas.
 */
export function InlineLoader({ className }: { className?: string }) {
  return <Loader size="xs" variant="soft" className={cn("py-1", className)} />;
}

/**
 * Slightly larger, more prominent loader with a default message.
 * Good for sections while fetching artworks.
 */
export function GalleryLoader({
  message = "Loading works...",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <Loader size="lg" variant="soft" />
      {message && (
        <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-detail">{message}</p>
      )}
    </div>
  );
}

/**
 * Full-screen overlay loader.
 * Use when the whole view is waiting for data.
 */
export function FullScreenLoader({ message }: { message?: string }) {
  return <Loader fullScreen variant="soft" message={message} />;
}
