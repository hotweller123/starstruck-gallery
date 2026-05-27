import { X } from "lucide-react";
import { filterOptions, formatPrice } from "@/data/artworks";
import { categories } from "@/data/categories";
import { type Filters, type MultiKey, isDefault } from "./filters-types";

interface Props {
  value: Filters;
  onChange: (f: Filters) => void;
}

interface Chip {
  label: string;
  onRemove: () => void;
}

export function ActiveFilterChips({ value, onChange }: Props) {
  if (isDefault(value, filterOptions.priceMin, filterOptions.priceMax)) {
    return null;
  }

  const removeFromMulti = <T extends string>(key: MultiKey, item: T) => {
    onChange({
      ...value,
      [key]: (value[key] as T[]).filter((x) => x !== item),
    } as Filters);
  };

  const chips: Chip[] = [];

  if (
    value.priceMin !== filterOptions.priceMin ||
    value.priceMax !== filterOptions.priceMax
  ) {
    chips.push({
      label: `${formatPrice(value.priceMin)} — ${formatPrice(value.priceMax)}`,
      onRemove: () =>
        onChange({
          ...value,
          priceMin: filterOptions.priceMin,
          priceMax: filterOptions.priceMax,
        }),
    });
  }

  for (const c of value.category) {
    chips.push({
      label: categories.find((x) => x.slug === c)?.label ?? c,
      onRemove: () => removeFromMulti("category", c),
    });
  }
  const simple: { key: MultiKey; values: readonly string[] }[] = [
    { key: "size", values: value.size },
    { key: "orientation", values: value.orientation },
    { key: "medium", values: value.medium },
    { key: "theme", values: value.theme },
    { key: "style", values: value.style },
    { key: "technique", values: value.technique },
    { key: "country", values: value.country },
    { key: "color", values: value.color },
  ];
  for (const s of simple) {
    for (const v of s.values) {
      chips.push({
        label: v.charAt(0).toUpperCase() + v.slice(1),
        onRemove: () => removeFromMulti(s.key, v as never),
      });
    }
  }
  if (value.highlight) {
    chips.push({
      label: "Curator's picks",
      onRemove: () => onChange({ ...value, highlight: false }),
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[10px] uppercase tracking-[0.22em] text-detail">
        Filtered by
      </span>
      {chips.map((c, i) => (
        <button
          key={i}
          type="button"
          onClick={c.onRemove}
          className="group inline-flex items-center gap-2 border border-ink/20 bg-canvas px-3 py-1.5 text-xs text-ink hover:border-clay hover:text-clay"
        >
          {c.label}
          <X className="size-3 text-detail group-hover:text-clay" />
        </button>
      ))}
    </div>
  );
}
