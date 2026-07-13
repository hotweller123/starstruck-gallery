import { useEffect, useState } from "react";
import { cn } from "@/utils/gen";

interface Props {
  endsAt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function diff(endsAt: string) {
  const ms = Math.max(0, new Date(endsAt).getTime() - Date.now());
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { ms, days, hours, minutes, seconds };
}

export function Countdown({ endsAt, size = "md", className }: Props) {
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff(endsAt));
    const id = setInterval(() => setT(diff(endsAt)), 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (!t) {
    return (
      <div className={cn("inline-flex items-end gap-3 opacity-0", className)} aria-hidden>
        <span className="font-display italic text-2xl">00:00:00:00</span>
      </div>
    );
  }

  const ended = t.ms === 0;
  const closing = t.ms > 0 && t.ms < 3_600_000; // < 1h

  const numCls = size === "lg" ? "text-3xl md:text-4xl" : size === "sm" ? "text-base" : "text-2xl";
  const labelCls = "text-[9px] uppercase tracking-[0.22em] text-detail";

  if (ended) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 border border-ink/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-detail",
          className,
        )}
      >
        <span className="size-1.5 rounded-full bg-detail" />
        Bidding closed
      </span>
    );
  }

  const Cell = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span
        key={value}
        className={cn(
          "font-display italic tabular-nums leading-none animate-in fade-in slide-in-from-bottom-1 duration-300",
          numCls,
          closing && "text-clay",
        )}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className={cn("mt-1", labelCls)}>{label}</span>
    </div>
  );

  return (
    <div className={cn("inline-flex items-end gap-3", closing && "[&_.dot]:bg-clay", className)}>
      {closing && <span className="dot mb-2 size-2 animate-pulse rounded-full bg-clay" />}
      <Cell value={t.days} label="Days" />
      <span className={cn("font-display italic text-ink/30", numCls)}>:</span>
      <Cell value={t.hours} label="Hrs" />
      <span className={cn("font-display italic text-ink/30", numCls)}>:</span>
      <Cell value={t.minutes} label="Min" />
      <span className={cn("font-display italic text-ink/30", numCls)}>:</span>
      <Cell value={t.seconds} label="Sec" />
    </div>
  );
}
