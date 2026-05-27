import art01 from "@/assets/art-01.jpg";
import art02 from "@/assets/art-02.jpg";
import art03 from "@/assets/art-03.jpg";
import art04 from "@/assets/art-04.jpg";
import art05 from "@/assets/art-05.jpg";
import art06 from "@/assets/art-06.jpg";
import art07 from "@/assets/art-07.jpg";
import art08 from "@/assets/art-08.jpg";
import art09 from "@/assets/art-09.jpg";
import art10 from "@/assets/art-10.jpg";
import art11 from "@/assets/art-11.jpg";
import art12 from "@/assets/art-12.jpg";

export type CategorySlug =
  | "abstract"
  | "figurative"
  | "minimalism"
  | "sculpture"
  | "photography"
  | "digital"
  | "mixed-media"
  | "ceramics";

export interface Artwork {
  slug: string;
  title: string;
  artistSlug: string;
  artist: string;
  category: CategorySlug;
  categoryLabel: string;
  year: number;
  medium: string;
  dimensions: string;
  image: string;
  width: number;
  height: number;
  description: string;
}

export const artworks: Artwork[] = [
  {
    slug: "linen-study-no-4",
    title: "Linen Study No. 4",
    artistSlug: "soren-kjeldsen",
    artist: "Søren Kjeldsen",
    category: "abstract",
    categoryLabel: "Abstract",
    year: 2024,
    medium: "Oil and pigment on linen",
    dimensions: "160 × 120 cm",
    image: art01,
    width: 800,
    height: 1088,
    description:
      "An extended meditation on light moving across a linen surface — pigment built up in slow strata until the canvas becomes a quiet topography of warmth.",
  },
  {
    slug: "vessel-i",
    title: "Vessel I",
    artistSlug: "elena-vos",
    artist: "Elena Vos",
    category: "sculpture",
    categoryLabel: "Sculpture",
    year: 2024,
    medium: "Hand-thrown plaster",
    dimensions: "42 × 24 × 24 cm",
    image: art02,
    width: 800,
    height: 1216,
    description:
      "The opening work in a study of containment — a hand-thrown plaster vessel whose proportions echo the silence of an empty room.",
  },
  {
    slug: "descent",
    title: "Descent",
    artistSlug: "marcus-thorne",
    artist: "Marcus Thorne",
    category: "photography",
    categoryLabel: "Photography",
    year: 2023,
    medium: "Archival pigment print",
    dimensions: "90 × 100 cm",
    image: art03,
    width: 800,
    height: 896,
    description:
      "A photograph of a curved stairwell at the moment a single shaft of afternoon light folds itself against the wall.",
  },
  {
    slug: "tracing-breath",
    title: "Tracing Breath",
    artistSlug: "amara-osei",
    artist: "Amara Osei",
    category: "minimalism",
    categoryLabel: "Minimalism",
    year: 2024,
    medium: "Ink on cream paper",
    dimensions: "70 × 70 cm",
    image: art04,
    width: 800,
    height: 800,
    description:
      "A single continuous line — drawn without lifting the pen — that records the act of looking as quietly as it can.",
  },
  {
    slug: "study-of-drape",
    title: "Study of Drape",
    artistSlug: "soren-kjeldsen",
    artist: "Søren Kjeldsen",
    category: "figurative",
    categoryLabel: "Figurative",
    year: 2023,
    medium: "Charcoal on warm linen paper",
    dimensions: "100 × 70 cm",
    image: art05,
    width: 800,
    height: 1120,
    description:
      "A charcoal study from the artist's long-running figure series, exploring weight, cloth, and the architecture of the body's silhouette.",
  },
  {
    slug: "equilibrium",
    title: "Equilibrium",
    artistSlug: "amara-osei",
    artist: "Amara Osei",
    category: "digital",
    categoryLabel: "Digital",
    year: 2024,
    medium: "Digital composition, edition of 12",
    dimensions: "Variable",
    image: art06,
    width: 800,
    height: 992,
    description:
      "A digital still in which a smooth stone hovers above the sea — composed entirely in shades of dawn.",
  },
  {
    slug: "oxidized-grace",
    title: "Oxidised Grace",
    artistSlug: "elena-vos",
    artist: "Elena Vos",
    category: "ceramics",
    categoryLabel: "Ceramics",
    year: 2024,
    medium: "Black stoneware, raw clay base",
    dimensions: "38 × 30 × 30 cm",
    image: art07,
    width: 800,
    height: 1184,
    description:
      "A matte black vessel resting on its own bed of raw sand — a piece that refuses the pedestal and chooses the ground instead.",
  },
  {
    slug: "fragile-archive",
    title: "Fragile Archive",
    artistSlug: "sachi-tanaka",
    artist: "Sachi Tanaka",
    category: "mixed-media",
    categoryLabel: "Mixed Media",
    year: 2023,
    medium: "Rusted iron, silk, found thread",
    dimensions: "85 × 70 cm",
    image: art08,
    width: 800,
    height: 1024,
    description:
      "A composition assembled from a year of small findings — silk, rust, and waxed thread arranged with the care of a botanist's catalogue.",
  },
  {
    slug: "horizon-field",
    title: "Horizon Field",
    artistSlug: "soren-kjeldsen",
    artist: "Søren Kjeldsen",
    category: "abstract",
    categoryLabel: "Abstract",
    year: 2024,
    medium: "Oil on canvas",
    dimensions: "180 × 160 cm",
    image: art09,
    width: 800,
    height: 896,
    description:
      "A colour-field painting in the slow tradition — bands of clay, sand and bone, layered until the horizon becomes a question rather than a line.",
  },
  {
    slug: "breathable-space",
    title: "Breathable Space",
    artistSlug: "sachi-tanaka",
    artist: "Sachi Tanaka",
    category: "photography",
    categoryLabel: "Photography",
    year: 2024,
    medium: "Archival pigment print",
    dimensions: "100 × 140 cm",
    image: art10,
    width: 800,
    height: 1120,
    description:
      "A still life of sunlit linen — a study of how much room a single fabric can take up before it stops being a thing and becomes a quality of light.",
  },
  {
    slug: "monolith-i",
    title: "Monolith I",
    artistSlug: "marcus-thorne",
    artist: "Marcus Thorne",
    category: "sculpture",
    categoryLabel: "Sculpture",
    year: 2023,
    medium: "Polished bronze on travertine",
    dimensions: "48 × 40 × 40 cm",
    image: art11,
    width: 800,
    height: 1024,
    description:
      "A polished bronze sphere on a travertine plinth — a sculpture that gathers the room into its own surface and returns it, softer.",
  },
  {
    slug: "concentric",
    title: "Concentric",
    artistSlug: "amara-osei",
    artist: "Amara Osei",
    category: "digital",
    categoryLabel: "Digital",
    year: 2024,
    medium: "Generative print, edition of 8",
    dimensions: "80 × 80 cm",
    image: art12,
    width: 800,
    height: 800,
    description:
      "A generative composition rendered in two grains of sand — a quiet meditation on the smallest possible amount of pattern.",
  },
];

export const getArtworkBySlug = (slug: string) =>
  artworks.find((a) => a.slug === slug);

export const getArtworksByCategory = (slug: CategorySlug) =>
  artworks.filter((a) => a.category === slug);

export const getArtworksByArtist = (artistSlug: string) =>
  artworks.filter((a) => a.artistSlug === artistSlug);
