import type { CategorySlug } from "./artworks";

export interface Category {
  slug: CategorySlug;
  label: string;
  description: string;
}

export const categories: Category[] = [
  {
    slug: "abstract",
    label: "Abstract",
    description:
      "Painting and works on canvas that refuse representation in favour of pure material, gesture and field.",
  },
  {
    slug: "figurative",
    label: "Figurative",
    description:
      "Drawings and paintings that return, again and again, to the architecture of the human body.",
  },
  {
    slug: "minimalism",
    label: "Minimalism",
    description:
      "Works built from the smallest possible vocabulary — a line, a mark, a single resolved decision.",
  },
  {
    slug: "sculpture",
    label: "Sculpture",
    description:
      "Three-dimensional works in plaster, stone, bronze and clay, occupying space rather than picturing it.",
  },
  {
    slug: "photography",
    label: "Photography",
    description:
      "Photographs that treat light as their primary subject and architecture as their willing collaborator.",
  },
  {
    slug: "digital",
    label: "Digital",
    description:
      "Digital and generative compositions, released in small editions and printed with archival care.",
  },
  {
    slug: "mixed-media",
    label: "Mixed Media",
    description:
      "Assemblages of found and worked material — iron, silk, thread, paper — held together by attention.",
  },
  {
    slug: "ceramics",
    label: "Ceramics",
    description:
      "Vessels and ceramic objects that sit between the functional and the contemplative.",
  },
];

export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);
