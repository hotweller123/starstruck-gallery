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
import { ChicagoArtwork } from "@/hooks/useChicagoArt";
import { ModChicagoArtwork } from "@/routes";
import { MetArtwork } from "@/types/metTypes";

export type CategorySlug =
  | "abstract"
  | "figurative"
  | "minimalism"
  | "sculpture"
  | "photography"
  | "digital"
  | "mixed-media"
  | "calligraphy"
  | "drawings"
  | "horology"
  | "codices"
  | "ceramics"
  | "wallpaper"
  | "paintings"
  | "ceramics-porcelain";

export type SizeCategory = "small" | "medium" | "large";
export type Orientation = "portrait" | "landscape" | "square";
export type DominantColor = "Warm" | "Cool" | "Neutral" | "Monochrome" | "Earth";

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
  measurement: any;
  // Extended filterable metadata
  price: number; // USD
  sizeCategory: SizeCategory;
  orientation: Orientation;
  theme: string;
  style: string;
  technique: string;
  country: string;
  dominantColor: DominantColor;
  highlight: boolean;
}

const getImageUrl = (imageId?: string) => {
  if (!imageId) return "";
  return `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
};

export const orientationFrom = (w: number, h: number): Orientation =>
  w === h ? "square" : h > w ? "portrait" : "landscape";

export const changeChicagoToMod = <T extends ChicagoArtwork>(arr: T[]): ModChicagoArtwork[] =>
  arr
    .map((ca) => ({
      image: getImageUrl(ca.image_id),
      title: ca.title,
      id: ca.id,
      name: ca.artist_display,
      width: ca.thumbnail?.width || 100,
      height: ca.thumbnail?.height || 100,
      medium: ca.medium_display,
      price: ca.id / 100,
    }))
    .filter(
      (img): img is ModChicagoArtwork =>
        !!img.image &&
        !!img.title &&
        !!img.id &&
        !!img.name &&
        !!img.width &&
        !!img.height &&
        img.medium !== undefined &&
        !!img.price,
    );

export const changeMetArtWorkProps = <T extends MetArtwork>(arr: T[] = []) =>
  arr.map((a) => ({
    artist: a.artistDisplayName,
    category: a.classification?.toLowerCase() as CategorySlug,
    title: a.title,
    country: a.country,
    medium: a.medium,
    slug: String(a.objectID),
    height: a?.measurements[0]?.elementMeasurements?.Height || 100,
    width: a?.measurements[0]?.elementMeasurements?.Width || 100,
    measurement: a.measurements,
    description: a.artistDisplayBio,
    sizeCategory: "large" as SizeCategory,
    theme: a.department,
    orientation: orientationFrom(
      a?.measurements[0]?.elementMeasurements?.Width || 100,
      a?.measurements[0]?.elementMeasurements?.Height || 100,
    ),
    style: a.artistNationality,
    dominantColor: "Cool" as DominantColor,
    highlight: a.isHighlight,
    artistSlug: a.artistDisplayName,
    categoryLabel: "",
    year: Number(a.accessionYear),
    image: a.primaryImage,
    price: (9 * a.objectID) / 1000,
    dimensions: a.dimensions || "Unknown", // Added dimensions
    technique: "Unknown", // Added technique
  }));

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const seed: Omit<Artwork, "orientation" | "measurement">[] = [
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
    price: 9800,
    sizeCategory: "large",
    theme: "Abstract Form",
    style: "Colour Field",
    technique: "Oil",
    country: "Denmark",
    dominantColor: "Warm",
    highlight: true,
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
    price: 3200,
    sizeCategory: "medium",
    theme: "Still Life",
    style: "Minimal",
    technique: "Hand-thrown",
    country: "Belgium",
    dominantColor: "Neutral",
    highlight: false,
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
    price: 2400,
    sizeCategory: "medium",
    theme: "Architecture",
    style: "Documentary",
    technique: "Pigment print",
    country: "Scotland",
    dominantColor: "Monochrome",
    highlight: true,
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
    price: 1800,
    sizeCategory: "small",
    theme: "Gesture",
    style: "Minimal",
    technique: "Ink",
    country: "Portugal",
    dominantColor: "Neutral",
    highlight: false,
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
    price: 2600,
    sizeCategory: "medium",
    theme: "Portrait",
    style: "Romantic",
    technique: "Charcoal",
    country: "Denmark",
    dominantColor: "Monochrome",
    highlight: false,
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
    price: 1400,
    sizeCategory: "small",
    theme: "Nature",
    style: "Surreal",
    technique: "Digital print",
    country: "Portugal",
    dominantColor: "Cool",
    highlight: true,
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
    price: 4200,
    sizeCategory: "medium",
    theme: "Still Life",
    style: "Brutalist",
    technique: "Hand-thrown",
    country: "Belgium",
    dominantColor: "Monochrome",
    highlight: true,
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
    price: 3600,
    sizeCategory: "medium",
    theme: "Memory",
    style: "Assemblage",
    technique: "Mixed materials",
    country: "Japan",
    dominantColor: "Earth",
    highlight: false,
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
    price: 12500,
    sizeCategory: "large",
    theme: "Landscape",
    style: "Colour Field",
    technique: "Oil",
    country: "Denmark",
    dominantColor: "Earth",
    highlight: true,
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
    price: 2800,
    sizeCategory: "medium",
    theme: "Still Life",
    style: "Impressionist",
    technique: "Pigment print",
    country: "Japan",
    dominantColor: "Warm",
    highlight: false,
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
    price: 8400,
    sizeCategory: "large",
    theme: "Abstract Form",
    style: "Minimal",
    technique: "Cast bronze",
    country: "Scotland",
    dominantColor: "Warm",
    highlight: true,
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
    price: 1600,
    sizeCategory: "small",
    theme: "Pattern",
    style: "Generative",
    technique: "Digital print",
    country: "Portugal",
    dominantColor: "Neutral",
    highlight: false,
  },
  // — 12 new works (cycle imagery) —
  {
    slug: "quiet-meridian",
    title: "Quiet Meridian",
    artistSlug: "soren-kjeldsen",
    artist: "Søren Kjeldsen",
    category: "abstract",
    categoryLabel: "Abstract",
    year: 2025,
    medium: "Oil on raw linen",
    dimensions: "140 × 110 cm",
    image: art09,
    width: 800,
    height: 896,
    description:
      "A long, slow band of warm grey laid across raw linen — the painting equivalent of an afternoon held very still.",
    price: 7400,
    sizeCategory: "large",
    theme: "Landscape",
    style: "Colour Field",
    technique: "Oil",
    country: "Denmark",
    dominantColor: "Neutral",
    highlight: false,
  },
  {
    slug: "second-vessel",
    title: "Second Vessel",
    artistSlug: "elena-vos",
    artist: "Elena Vos",
    category: "ceramics",
    categoryLabel: "Ceramics",
    year: 2025,
    medium: "Porcelain with iron wash",
    dimensions: "30 × 22 × 22 cm",
    image: art02,
    width: 800,
    height: 1216,
    description:
      "A porcelain piece whose iron wash settles in the throwing rings — a record of the hands that made it.",
    price: 2900,
    sizeCategory: "small",
    theme: "Still Life",
    style: "Minimal",
    technique: "Hand-thrown",
    country: "Belgium",
    dominantColor: "Earth",
    highlight: false,
  },
  {
    slug: "north-window",
    title: "North Window",
    artistSlug: "marcus-thorne",
    artist: "Marcus Thorne",
    category: "photography",
    categoryLabel: "Photography",
    year: 2024,
    medium: "Silver gelatin print, edition of 6",
    dimensions: "60 × 50 cm",
    image: art03,
    width: 800,
    height: 896,
    description:
      "Three hours of overcast January, photographed through the artist's studio window — printed darkly, then darker still.",
    price: 1900,
    sizeCategory: "small",
    theme: "Architecture",
    style: "Documentary",
    technique: "Silver gelatin",
    country: "Scotland",
    dominantColor: "Monochrome",
    highlight: false,
  },
  {
    slug: "small-script",
    title: "Small Script",
    artistSlug: "amara-osei",
    artist: "Amara Osei",
    category: "minimalism",
    categoryLabel: "Minimalism",
    year: 2025,
    medium: "Pencil on toned paper",
    dimensions: "40 × 30 cm",
    image: art04,
    width: 800,
    height: 800,
    description:
      "Eleven short marks made on the morning of the spring equinox — kept exactly as they were made.",
    price: 950,
    sizeCategory: "small",
    theme: "Gesture",
    style: "Minimal",
    technique: "Pencil",
    country: "Portugal",
    dominantColor: "Neutral",
    highlight: true,
  },
  {
    slug: "weight-of-water",
    title: "Weight of Water",
    artistSlug: "sachi-tanaka",
    artist: "Sachi Tanaka",
    category: "mixed-media",
    categoryLabel: "Mixed Media",
    year: 2025,
    medium: "Indigo-dyed silk, river stone",
    dimensions: "120 × 90 cm",
    image: art08,
    width: 800,
    height: 1024,
    description:
      "Indigo silk pulled taut around a single river stone — a study of how little material is required to hold a feeling.",
    price: 4100,
    sizeCategory: "medium",
    theme: "Nature",
    style: "Assemblage",
    technique: "Textile",
    country: "Japan",
    dominantColor: "Cool",
    highlight: true,
  },
  {
    slug: "field-recording",
    title: "Field Recording",
    artistSlug: "soren-kjeldsen",
    artist: "Søren Kjeldsen",
    category: "figurative",
    categoryLabel: "Figurative",
    year: 2024,
    medium: "Charcoal and pastel on paper",
    dimensions: "80 × 60 cm",
    image: art05,
    width: 800,
    height: 1120,
    description:
      "A figure half-turning, drawn at the speed of memory rather than the speed of life.",
    price: 2100,
    sizeCategory: "medium",
    theme: "Portrait",
    style: "Romantic",
    technique: "Charcoal",
    country: "Denmark",
    dominantColor: "Warm",
    highlight: false,
  },
  {
    slug: "soft-grid",
    title: "Soft Grid",
    artistSlug: "amara-osei",
    artist: "Amara Osei",
    category: "digital",
    categoryLabel: "Digital",
    year: 2025,
    medium: "Generative composition, edition of 10",
    dimensions: "60 × 60 cm",
    image: art12,
    width: 800,
    height: 800,
    description:
      "A grid that has forgotten the rule of the grid — released slowly, ten copies only.",
    price: 1100,
    sizeCategory: "small",
    theme: "Pattern",
    style: "Generative",
    technique: "Digital print",
    country: "Portugal",
    dominantColor: "Cool",
    highlight: false,
  },
  {
    slug: "bowl-for-an-empty-table",
    title: "Bowl for an Empty Table",
    artistSlug: "elena-vos",
    artist: "Elena Vos",
    category: "ceramics",
    categoryLabel: "Ceramics",
    year: 2024,
    medium: "Wood-fired stoneware",
    dimensions: "18 × 32 × 32 cm",
    image: art07,
    width: 800,
    height: 1184,
    description:
      "A wide wood-fired bowl with a single ash mark across the lip — the kiln, signing its own work.",
    price: 1700,
    sizeCategory: "small",
    theme: "Still Life",
    style: "Wabi-sabi",
    technique: "Wood-fired",
    country: "Belgium",
    dominantColor: "Earth",
    highlight: false,
  },
  {
    slug: "longform-light",
    title: "Longform Light",
    artistSlug: "sachi-tanaka",
    artist: "Sachi Tanaka",
    category: "photography",
    categoryLabel: "Photography",
    year: 2025,
    medium: "Archival pigment print, edition of 5",
    dimensions: "120 × 90 cm",
    image: art10,
    width: 800,
    height: 1120,
    description:
      "A six-hour exposure of an unmoving room — a photograph that confuses the difference between presence and patience.",
    price: 3400,
    sizeCategory: "large",
    theme: "Architecture",
    style: "Documentary",
    technique: "Pigment print",
    country: "Japan",
    dominantColor: "Warm",
    highlight: true,
  },
  {
    slug: "second-monolith",
    title: "Second Monolith",
    artistSlug: "marcus-thorne",
    artist: "Marcus Thorne",
    category: "sculpture",
    categoryLabel: "Sculpture",
    year: 2024,
    medium: "Brushed steel on basalt",
    dimensions: "60 × 22 × 22 cm",
    image: art11,
    width: 800,
    height: 1024,
    description:
      "An upright in brushed steel, balanced on a single block of basalt — a sculpture that earns its quietness through weight.",
    price: 6800,
    sizeCategory: "large",
    theme: "Abstract Form",
    style: "Brutalist",
    technique: "Welded steel",
    country: "Scotland",
    dominantColor: "Cool",
    highlight: false,
  },
  {
    slug: "evening-pigment",
    title: "Evening Pigment",
    artistSlug: "soren-kjeldsen",
    artist: "Søren Kjeldsen",
    category: "abstract",
    categoryLabel: "Abstract",
    year: 2025,
    medium: "Pigment and wax on board",
    dimensions: "60 × 50 cm",
    image: art01,
    width: 800,
    height: 1088,
    description:
      "Three layers of dusk-coloured pigment, sealed under wax — a small panel that holds the whole evening.",
    price: 2200,
    sizeCategory: "small",
    theme: "Landscape",
    style: "Colour Field",
    technique: "Mixed materials",
    country: "Denmark",
    dominantColor: "Warm",
    highlight: true,
  },
  {
    slug: "the-small-room",
    title: "The Small Room",
    artistSlug: "marcus-thorne",
    artist: "Marcus Thorne",
    category: "photography",
    categoryLabel: "Photography",
    year: 2025,
    medium: "Archival pigment print",
    dimensions: "70 × 70 cm",
    image: art06,
    width: 800,
    height: 992,
    description:
      "A photograph of a corner of an unfurnished room, lit only by the door left slightly open behind the camera.",
    price: 2050,
    sizeCategory: "medium",
    theme: "Architecture",
    style: "Documentary",
    technique: "Pigment print",
    country: "Scotland",
    dominantColor: "Neutral",
    highlight: false,
  },
];

export const artworks: Omit<Artwork, "measurement">[] = seed.map((a) => ({
  ...a,
  orientation: orientationFrom(a.width, a.height),
}));

export const getArtworkBySlug = (slug: string, list: Artwork[] = []) => {
  if (!slug || !Array.isArray(list) || list.length === 0) {
    return undefined;
  }

  // Normalize the value we're searching for (handles both string slugs and numeric objectIDs)
  const target = String(slug).trim().toLowerCase();

  return list.find((a) => a.slug.toLowerCase() === target);

  // return list.find((item) => {
  //   if (!item || typeof item !== "object") return false;

  // Collect every possible identifier the item might use.
  // Local data usually has "slug".
  // Met Museum API data usually has "objectID" (number).
  //   const possibleIds = [
  //     item.slug,
  //     item.objectID,
  //     item.id,
  //     item._id,
  //     item.artworkId,
  //     item.artworkSlug,
  //   ];

  //   console.log(possibleIds, target);

  //   return possibleIds.some((value) => {
  //     if (value == null) return false;

  //     const normalized = String(value).trim().toLowerCase();

  //     // Also support direct match if someone stored the ID as a stringified number
  //     return normalized === target;
  //   });
  // });
};

export const getArtworksByCategory = (slug: CategorySlug, artworks: Artwork[] = []) =>
  artworks.filter((a) => a.category === slug);

export const getArtworksByArtist = (artistSlug: string) =>
  artworks.filter((a, i, arr) => a.category.includes(artistSlug));

// Filter option enumerations (derived for the FilterDrawer)
const uniq = <T>(arr: T[]) => Array.from(new Set(arr)).sort();
export const filterOptions = {
  size: ["small", "medium", "large"] as SizeCategory[],
  orientation: ["portrait", "landscape", "square"] as Orientation[],
  medium: uniq(artworks.map((a) => a.medium)),
  theme: uniq(artworks.map((a) => a.theme)),
  style: uniq(artworks.map((a) => a.style)),
  technique: uniq(artworks.map((a) => a.technique)),
  country: uniq(artworks.map((a) => a.country)),
  color: uniq(artworks.map((a) => a.dominantColor)),
  category: uniq(artworks.map((a) => a.category)) as CategorySlug[],
  priceMin: Math.floor(Math.min(...artworks.map((a) => a.price)) / 100) * 100,
  priceMax: Math.ceil(Math.max(...artworks.map((a) => a.price)) / 100) * 100,
};
