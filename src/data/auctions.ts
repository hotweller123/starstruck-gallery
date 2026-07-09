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
import type { CategorySlug } from "./artworks";
import { artists, type Artist } from "./artists";

export interface AuctionLot {
  slug: string;
  lotNumber: string;
  title: string;
  sellerSlug: string;
  category: CategorySlug;
  categoryLabel: string;
  year: number;
  medium: string;
  dimensions: string;
  description: string;
  provenance: string;
  condition: string;
  images: string[];
  estimateLow: number;
  estimateHigh: number;
  startBid: number;
  currentBid: number;
  bidCount: number;
  reserveMet: boolean;
  status?: "active" | "pending" | "suspended";
  endsAt: string; // ISO
}

const now = Date.now();
const inHours = (h: number) => new Date(now + h * 3_600_000).toISOString();

export const auctionCategories: { slug: CategorySlug | "all"; label: string }[] = [
  { slug: "all", label: "All Lots" },
  { slug: "abstract", label: "Abstract" },
  { slug: "figurative", label: "Figurative" },
  { slug: "sculpture", label: "Sculpture" },
  { slug: "photography", label: "Photography" },
  { slug: "ceramics", label: "Ceramics" },
  { slug: "mixed-media", label: "Mixed Media" },
  { slug: "digital", label: "Digital" },
  { slug: "minimalism", label: "Minimalism" },
];

export const auctionLots: AuctionLot[] = [
  {
    slug: "lot-001-linen-meridian",
    lotNumber: "001",
    title: "Linen Meridian",
    sellerSlug: "soren-kjeldsen",
    status: "suspended",
    category: "abstract",
    categoryLabel: "Abstract",
    year: 2024,
    medium: "Oil and pigment on raw linen",
    dimensions: "160 × 120 cm",
    description:
      "A late-afternoon meditation in warm grey and bone — pigment built in twelve slow layers across raw linen, the horizon set just above the mid-line.",
    provenance: "Studio of the artist, Copenhagen. Signed verso.",
    condition: "Excellent. Edges unframed; gallery wrap.",
    images: [art01, art09, art05],
    estimateLow: 9000,
    estimateHigh: 12000,
    startBid: 7500,
    currentBid: 10400,
    bidCount: 17,
    reserveMet: true,
    endsAt: inHours(46),
  },
  {
    slug: "lot-002-vessel-iii",
    lotNumber: "002",
    title: "Vessel III",
    sellerSlug: "elena-vos",
    status: "suspended",
    category: "ceramics",
    categoryLabel: "Ceramics",
    year: 2024,
    medium: "Hand-thrown porcelain, iron wash",
    dimensions: "44 × 26 × 26 cm",
    description:
      "The third in a continuing study of containment — porcelain thrown at the wheel, then dressed in a slow iron wash that settles in the throwing rings.",
    provenance: "Vos Studio, Antwerp. Inventory mark to base.",
    condition: "Pristine. No restoration.",
    images: [art02, art07],
    estimateLow: 2800,
    estimateHigh: 3800,
    startBid: 2200,
    currentBid: 3100,
    bidCount: 9,
    reserveMet: true,
    endsAt: inHours(14),
  },
  {
    slug: "lot-003-descent",
    lotNumber: "003",
    title: "Descent (Stair Study)",
    sellerSlug: "marcus-thorne",
    status: "suspended",
    category: "photography",
    categoryLabel: "Photography",
    year: 2023,
    medium: "Archival pigment print, edition 2 of 6",
    dimensions: "90 × 100 cm",
    description:
      "A photograph of a curved stairwell taken at the moment a single shaft of January light folds itself against the wall.",
    provenance: "From the Architecture of Light series. Signed and numbered.",
    condition: "Mint. Sealed in archival sleeve.",
    images: [art03, art11],
    estimateLow: 2200,
    estimateHigh: 2800,
    startBid: 1800,
    currentBid: 2050,
    bidCount: 6,
    reserveMet: false,
    endsAt: inHours(72),
  },
  {
    slug: "lot-004-tracing-breath",
    lotNumber: "004",
    title: "Tracing Breath",
    sellerSlug: "amara-osei",
    status: "suspended",
    category: "minimalism",
    categoryLabel: "Minimalism",
    year: 2024,
    medium: "Ink on cream paper",
    dimensions: "70 × 70 cm",
    description:
      "A single unbroken line drawn at first light — a record of looking, kept exactly as it was made.",
    provenance: "Drawn in the artist's Lisbon studio, March 2024.",
    condition: "Excellent; floated in archival mat.",
    images: [art04, art06, art12],
    estimateLow: 1600,
    estimateHigh: 2200,
    startBid: 1200,
    currentBid: 1750,
    bidCount: 11,
    reserveMet: true,
    endsAt: inHours(5),
  },
  {
    slug: "lot-005-study-of-drape",
    lotNumber: "005",
    title: "Study of Drape",
    sellerSlug: "soren-kjeldsen",
    status: "active",
    category: "figurative",
    categoryLabel: "Figurative",
    year: 2023,
    medium: "Charcoal on warm linen paper",
    dimensions: "100 × 70 cm",
    description:
      "A charcoal study from the artist's long-running figure series — weight, cloth, and the architecture of the silhouette.",
    provenance: "Studio of the artist, Copenhagen.",
    condition: "Very good. Light handling at upper edge.",
    images: [art05, art01],
    estimateLow: 2400,
    estimateHigh: 3200,
    startBid: 1900,
    currentBid: 2600,
    bidCount: 8,
    reserveMet: true,
    endsAt: inHours(96),
  },
  {
    slug: "lot-006-oxidised-grace",
    lotNumber: "006",
    title: "Oxidised Grace",
    sellerSlug: "elena-vos",
    status: "active",
    category: "ceramics",
    categoryLabel: "Ceramics",
    year: 2024,
    medium: "Black stoneware, raw sand base",
    dimensions: "38 × 30 × 30 cm",
    description: "A matte black vessel that refuses the pedestal and chooses the ground instead.",
    provenance: "Vos Studio, Antwerp.",
    condition: "Excellent.",
    images: [art07, art02],
    estimateLow: 3800,
    estimateHigh: 5000,
    startBid: 3000,
    currentBid: 4200,
    bidCount: 13,
    reserveMet: true,
    endsAt: inHours(28),
  },
  {
    slug: "lot-007-fragile-archive",
    lotNumber: "007",
    title: "Fragile Archive",
    sellerSlug: "sachi-tanaka",
    status: "pending",
    category: "mixed-media",
    categoryLabel: "Mixed Media",
    year: 2023,
    medium: "Rusted iron, indigo silk, waxed thread",
    dimensions: "85 × 70 cm",
    description:
      "A composition assembled from a year of small findings — silk, rust, and waxed thread arranged with the care of a botanist's catalogue.",
    provenance: "From the artist's Kyoto machiya.",
    condition: "Excellent; framed under museum glass.",
    images: [art08, art10],
    estimateLow: 3400,
    estimateHigh: 4400,
    startBid: 2800,
    currentBid: 3600,
    bidCount: 7,
    reserveMet: true,
    endsAt: inHours(60),
  },
  {
    slug: "lot-008-horizon-field",
    lotNumber: "008",
    title: "Horizon Field",
    sellerSlug: "soren-kjeldsen",
    status: "pending",
    category: "abstract",
    categoryLabel: "Abstract",
    year: 2024,
    medium: "Oil on canvas",
    dimensions: "180 × 160 cm",
    description:
      "A colour-field painting in the slow tradition — bands of clay, sand and bone, layered until the horizon becomes a question rather than a line.",
    provenance: "Studio of the artist, Copenhagen.",
    condition: "Pristine.",
    images: [art09, art01],
    estimateLow: 11000,
    estimateHigh: 14000,
    startBid: 9000,
    currentBid: 12500,
    bidCount: 22,
    reserveMet: true,
    endsAt: inHours(120),
  },
  {
    slug: "lot-009-breathable-space",
    lotNumber: "009",
    title: "Breathable Space",
    sellerSlug: "sachi-tanaka",
    status: "pending",
    category: "photography",
    categoryLabel: "Photography",
    year: 2024,
    medium: "Archival pigment print, edition 1 of 5",
    dimensions: "100 × 140 cm",
    description:
      "A still life of sunlit linen — how much room a single fabric can take up before it stops being a thing and becomes a quality of light.",
    provenance: "Direct from the artist.",
    condition: "Mint.",
    images: [art10, art08],
    estimateLow: 2600,
    estimateHigh: 3400,
    startBid: 2000,
    currentBid: 2800,
    bidCount: 5,
    reserveMet: false,
    endsAt: inHours(8),
  },
  {
    slug: "lot-010-monolith-i",
    lotNumber: "010",
    title: "Monolith I",
    sellerSlug: "marcus-thorne",
    status: "active",
    category: "sculpture",
    categoryLabel: "Sculpture",
    year: 2023,
    medium: "Polished bronze on travertine",
    dimensions: "48 × 40 × 40 cm",
    description:
      "A polished bronze sphere on a travertine plinth — a sculpture that gathers the room into its surface and returns it, softer.",
    provenance: "Thorne Studio, Glasgow.",
    condition: "Excellent.",
    images: [art11, art03],
    estimateLow: 7500,
    estimateHigh: 9500,
    startBid: 6000,
    currentBid: 8400,
    bidCount: 15,
    reserveMet: true,
    endsAt: inHours(36),
  },
  {
    slug: "lot-011-concentric",
    lotNumber: "011",
    title: "Concentric",
    sellerSlug: "amara-osei",
    status: "active",
    category: "digital",
    categoryLabel: "Digital",
    year: 2024,
    medium: "Generative print, edition 3 of 8",
    dimensions: "80 × 80 cm",
    description:
      "A generative composition rendered in two grains of sand — the smallest possible amount of pattern.",
    provenance: "From the Concentric series.",
    condition: "Mint.",
    images: [art12, art04, art06],
    estimateLow: 1400,
    estimateHigh: 2000,
    startBid: 1100,
    currentBid: 1600,
    bidCount: 4,
    reserveMet: true,
    endsAt: inHours(20),
  },
  {
    slug: "lot-012-evening-pigment",
    lotNumber: "012",
    title: "Evening Pigment",
    sellerSlug: "soren-kjeldsen",
    status: "active",
    category: "abstract",
    categoryLabel: "Abstract",
    year: 2025,
    medium: "Pigment and wax on board",
    dimensions: "60 × 50 cm",
    description:
      "Three layers of dusk-coloured pigment, sealed under wax — a small panel that holds the whole evening.",
    provenance: "Studio of the artist, Copenhagen.",
    condition: "Pristine.",
    images: [art01, art09, art05],
    estimateLow: 2000,
    estimateHigh: 2800,
    startBid: 1600,
    currentBid: 2200,
    bidCount: 6,
    reserveMet: true,
    endsAt: inHours(54),
  },
];

export const formatBid = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export const getAuctionBySlug = (slug: string) => auctionLots.find((l) => l.slug === slug);

export const getLotsBySeller = (sellerSlug: string) =>
  auctionLots.filter((l) => l.sellerSlug === sellerSlug);

export const getSeller = (slug: string): Artist | undefined => artists.find((a) => a.slug === slug);

export const auctionPriceMin =
  Math.floor(Math.min(...auctionLots.map((l) => l.currentBid)) / 100) * 100;
export const auctionPriceMax =
  Math.ceil(Math.max(...auctionLots.map((l) => l.currentBid)) / 100) * 100;
