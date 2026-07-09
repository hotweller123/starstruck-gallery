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
  {
    slug: "calligraphy",
    label: "Calligraphy",
    description:
      "The disciplined art of beautiful writing — ink, breath and gesture held in perfect tension on the page.",
  },
  {
    slug: "drawings",
    label: "Drawings",
    description:
      "Works on paper that privilege line, mark and the directness of the hand above all else.",
  },
  {
    slug: "horology",
    label: "Horology",
    description:
      "Timepieces and instruments that turn the measurement of duration into mechanical poetry.",
  },
  {
    slug: "codices",
    label: "Codices",
    description:
      "Hand-bound books and manuscripts in which image, text and material form a single contemplative object.",
  },
  {
    slug: "wallpaper",
    label: "Wallpaper",
    description:
      "Large-scale printed and painted surfaces made to transform the room rather than merely decorate it.",
  },
  {
    slug: "paintings",
    label: "Paintings",
    description:
      "Works in oil, pigment and mixed media that explore surface, colour, light and the long patience of the hand.",
  },
  {
    slug: "ceramics-porcelain",
    label: "Porcelain",
    description:
      "Fine porcelain vessels and objects fired to translucency, precision and quiet luminosity.",
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
