import artist01 from "@/assets/artist-01.jpg";
import artist02 from "@/assets/artist-02.jpg";
import artist03 from "@/assets/artist-03.jpg";
import artist04 from "@/assets/artist-04.jpg";

export interface Artist {
  slug: string;
  name: string;
  discipline: string;
  location: string;
  portrait: string;
  short: string;
  bio: string;
}

export const artists: Artist[] = [
  {
    slug: "elena-vos",
    name: "Elena Vos",
    discipline: "Ceramics & Sculpture",
    location: "Antwerp, Belgium",
    portrait: artist01,
    short:
      "A Belgian ceramicist whose architectural approach to clay produces objects that feel inevitable.",
    bio: "Elena Vos is a Belgian ceramicist known for her architectural approach to functional objects. Her work is rooted in locally sourced clays and experimental firing techniques, producing pieces that feel both ancient and immediate. She lives and works in a converted workshop on the edge of Antwerp.",
  },
  {
    slug: "marcus-thorne",
    name: "Marcus Thorne",
    discipline: "Sculpture & Photography",
    location: "Glasgow, Scotland",
    portrait: artist02,
    short:
      "Sculptural and photographic works that treat material weight as a kind of language.",
    bio: "Marcus Thorne moves between cast bronze, polished metal and large-format photography. His sculptures are made to be circled; his photographs are made to be sat with. He teaches a yearly residency in the Hebrides.",
  },
  {
    slug: "sachi-tanaka",
    name: "Sachi Tanaka",
    discipline: "Photography & Textile",
    location: "Kyoto, Japan",
    portrait: artist03,
    short:
      "Photographs and textile assemblages in which fabric becomes a way of measuring light.",
    bio: "Sachi Tanaka's practice spans photography, weaving and mixed media. Working in a converted machiya in Kyoto, she returns repeatedly to a small vocabulary of materials — silk, rust, sunlight — and asks how much can be said with how little.",
  },
  {
    slug: "amara-osei",
    name: "Amara Osei",
    discipline: "Digital & Minimalism",
    location: "Lisbon, Portugal",
    portrait: artist04,
    short:
      "Digital compositions and quiet line drawings released in small, considered editions.",
    bio: "Amara Osei works in code, ink and editioned print. Her digital practice is concerned with the smallest amount of pattern that can still be called an image; her drawings, with the smallest amount of mark that can still be called a portrait.",
  },
  {
    slug: "soren-kjeldsen",
    name: "Søren Kjeldsen",
    discipline: "Painting & Drawing",
    location: "Copenhagen, Denmark",
    portrait: artist01,
    short:
      "Large oil paintings and charcoal drawings made over months of slow looking.",
    bio: "Søren Kjeldsen paints and draws from a north-facing studio in Copenhagen. He works at the scale of the body and at the pace of a season — a single linen canvas may take half a year to find its surface.",
  },
];

export const getArtist = (slug: string) =>
  artists.find((a) => a.slug === slug);
