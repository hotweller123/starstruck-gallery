import type { CategorySlug, Orientation, SizeCategory, DominantColor } from "@/data/artworks";

export interface Filters {
  priceMin: number;
  priceMax: number;
  category: CategorySlug[];
  size: SizeCategory[];
  orientation: Orientation[];
  medium: string[];
  theme: string[];
  style: string[];
  technique: string[];
  country: string[];
  color: DominantColor[];
  highlight: boolean;
}

export const makeDefaultFilters = (priceMin: number, priceMax: number): Filters => ({
  priceMin,
  priceMax,
  category: [],
  size: [],
  orientation: [],
  medium: [],
  theme: [],
  style: [],
  technique: [],
  country: [],
  color: [],
  highlight: false,
});

export const isDefault = (f: Filters, priceMin: number, priceMax: number) =>
  f.priceMin === priceMin &&
  f.priceMax === priceMax &&
  !f.highlight &&
  f.category.length === 0 &&
  f.size.length === 0 &&
  f.orientation.length === 0 &&
  f.medium.length === 0 &&
  f.theme.length === 0 &&
  f.style.length === 0 &&
  f.technique.length === 0 &&
  f.country.length === 0 &&
  f.color.length === 0;

export type MultiKey =
  | "category"
  | "size"
  | "orientation"
  | "medium"
  | "theme"
  | "style"
  | "technique"
  | "country"
  | "color";
