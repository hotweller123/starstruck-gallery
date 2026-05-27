export interface Sponsor {
  name: string;
  tier: "Principal" | "Supporting" | "Programme";
  blurb: string;
}

export const sponsors: Sponsor[] = [
  {
    name: "North & Field",
    tier: "Principal",
    blurb: "Independent paper mill, est. 1894. Supplier of all exhibition print editions.",
  },
  {
    name: "Hagen Linen Co.",
    tier: "Principal",
    blurb: "Family-run linen weavers from West Flanders supporting our painting commissions.",
  },
  {
    name: "Maison Verre",
    tier: "Supporting",
    blurb: "Hand-blown glass plinths and display vitrines for our sculpture programme.",
  },
  {
    name: "Studio Arboreal",
    tier: "Supporting",
    blurb: "Sustainable framing and crating, working exclusively with FSC-certified timber.",
  },
  {
    name: "The Slow Press",
    tier: "Programme",
    blurb: "Letterpress catalogues and exhibition broadsheets, printed in editions of 200.",
  },
  {
    name: "Caferra Roasters",
    tier: "Programme",
    blurb: "Single-origin coffee served at every opening and private view.",
  },
];
