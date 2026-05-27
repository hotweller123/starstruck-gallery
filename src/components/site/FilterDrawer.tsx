import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { filterOptions, formatPrice } from "@/data/artworks";
import { categories } from "@/data/categories";
import {
  type Filters,
  type MultiKey,
  makeDefaultFilters,
} from "./filters-types";

interface Props {
  value: Filters;
  onChange: (f: Filters) => void;
  totalCount: number;
  matchCount: number;
}

const labelize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function FilterDrawer({ value, onChange, totalCount, matchCount }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Filters>(value);

  const openSheet = (o: boolean) => {
    if (o) setDraft(value);
    setOpen(o);
  };

  const toggle = <T extends string>(key: MultiKey, item: T) => {
    setDraft((d) => {
      const arr = d[key] as unknown as T[];
      const next = arr.includes(item)
        ? arr.filter((x) => x !== item)
        : [...arr, item];
      return { ...d, [key]: next } as Filters;
    });
  };

  const apply = () => {
    onChange(draft);
    setOpen(false);
  };

  const reset = () => {
    const d = makeDefaultFilters(filterOptions.priceMin, filterOptions.priceMax);
    setDraft(d);
    onChange(d);
  };

  const ChipList = <T extends string>({
    options,
    selected,
    onToggle,
    transform,
  }: {
    options: readonly T[];
    selected: readonly T[];
    onToggle: (v: T) => void;
    transform?: (v: T) => string;
  }) => (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`border px-3 py-1.5 text-xs transition-colors ${
              active
                ? "border-ink bg-ink text-canvas"
                : "border-ink/20 text-detail hover:border-ink hover:text-ink"
            }`}
          >
            {transform ? transform(opt) : opt}
          </button>
        );
      })}
    </div>
  );

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <section className="border-t border-ink/10 py-6 first:border-t-0 first:pt-0">
      <h3 className="mb-4 text-[10px] uppercase tracking-[0.22em] text-detail">
        {title}
      </h3>
      {children}
    </section>
  );

  return (
    <Sheet open={open} onOpenChange={openSheet}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 border border-ink px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-ink hover:bg-ink hover:text-canvas"
        >
          <SlidersHorizontal className="size-3.5" />
          Filters
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex h-full w-full max-w-none flex-col gap-0 overflow-hidden bg-canvas p-0 sm:w-[440px] sm:max-w-[440px]"
      >
        <SheetHeader className="flex flex-row items-center justify-between border-b border-ink/10 px-6 py-5">
          <SheetTitle className="font-display text-2xl italic">
            Refine the view
          </SheetTitle>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="text-detail hover:text-ink"
          >
            <X className="size-5" />
          </button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <Section title={`Price · ${formatPrice(draft.priceMin)} — ${formatPrice(draft.priceMax)}`}>
            <Slider
              value={[draft.priceMin, draft.priceMax]}
              min={filterOptions.priceMin}
              max={filterOptions.priceMax}
              step={100}
              onValueChange={([min, max]) =>
                setDraft((d) => ({ ...d, priceMin: min, priceMax: max }))
              }
            />
          </Section>

          <Section title="Category">
            <ChipList
              options={categories.map((c) => c.slug)}
              selected={draft.category}
              onToggle={(v) => toggle("category", v)}
              transform={(v) =>
                categories.find((c) => c.slug === v)?.label ?? v
              }
            />
          </Section>

          <Section title="Size">
            <ChipList
              options={filterOptions.size}
              selected={draft.size}
              onToggle={(v) => toggle("size", v)}
              transform={labelize}
            />
          </Section>

          <Section title="Orientation">
            <ChipList
              options={filterOptions.orientation}
              selected={draft.orientation}
              onToggle={(v) => toggle("orientation", v)}
              transform={labelize}
            />
          </Section>

          <Section title="Medium">
            <ChipList
              options={filterOptions.medium}
              selected={draft.medium}
              onToggle={(v) => toggle("medium", v)}
            />
          </Section>

          <Section title="Theme">
            <ChipList
              options={filterOptions.theme}
              selected={draft.theme}
              onToggle={(v) => toggle("theme", v)}
            />
          </Section>

          <Section title="Style">
            <ChipList
              options={filterOptions.style}
              selected={draft.style}
              onToggle={(v) => toggle("style", v)}
            />
          </Section>

          <Section title="Technique">
            <ChipList
              options={filterOptions.technique}
              selected={draft.technique}
              onToggle={(v) => toggle("technique", v)}
            />
          </Section>

          <Section title="Country">
            <ChipList
              options={filterOptions.country}
              selected={draft.country}
              onToggle={(v) => toggle("country", v)}
            />
          </Section>

          <Section title="Colour">
            <ChipList
              options={filterOptions.color}
              selected={draft.color}
              onToggle={(v) => toggle("color", v)}
            />
          </Section>

          <Section title="Highlights">
            <label className="flex items-center justify-between gap-4">
              <span className="text-sm text-ink">Show curator's picks only</span>
              <Switch
                checked={draft.highlight}
                onCheckedChange={(v) =>
                  setDraft((d) => ({ ...d, highlight: !!v }))
                }
              />
            </label>
          </Section>
        </div>

        <footer className="flex items-center gap-3 border-t border-ink/10 bg-surface/60 px-6 py-4">
          <button
            type="button"
            onClick={reset}
            className="text-[11px] uppercase tracking-[0.22em] text-detail hover:text-ink"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={apply}
            className="ml-auto border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay"
          >
            Show {matchCount} of {totalCount}
          </button>
        </footer>
      </SheetContent>
    </Sheet>
  );
}
