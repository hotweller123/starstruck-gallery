import artist01 from "@/assets/artist-01.jpg";
import artist02 from "@/assets/artist-02.jpg";
import artist03 from "@/assets/artist-03.jpg";
import artist04 from "@/assets/artist-04.jpg";
<<<<<<< HEAD
=======
import { RELIABLE_ARTISTS } from "@/hooks/useChicagoArt";
>>>>>>> 49a1b1e (updated)

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
<<<<<<< HEAD
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
=======
    slug: "vincent-van-gogh",
    name: "Vincent van Gogh",
    discipline: "Painting",
    location: "Auvers-sur-Oise, France",
    portrait: artist01,
    short:
      "Dutch Post-Impressionist painter whose bold color and expressive brushwork transformed modern art.",
    bio: "Vincent van Gogh was a Dutch painter whose work had a far-reaching influence on 20th-century art. His bold use of color, dramatic brushwork, and emotional honesty in depicting the natural world and human experience continue to resonate. He created over 2,000 artworks in just a decade, including iconic pieces like The Starry Night and Sunflowers.",
  },
  {
    slug: "henri-de-toulouse-lautrec",
    name: "Henri de Toulouse-Lautrec",
    discipline: "Painting & Printmaking",
    location: "Paris, France",
    portrait: artist02,
    short:
      "French artist celebrated for his vivid depictions of Parisian nightlife and innovative poster designs.",
    bio: "Henri de Toulouse-Lautrec was a French painter, printmaker, and illustrator whose work captured the energy of Montmartre and the Moulin Rouge. Despite physical challenges, he produced an extraordinary body of work including paintings, lithographs, and posters that defined an era. His keen observation of Parisian society remains unmatched.",
  },
  {
    slug: "rembrandt-van-rijn",
    name: "Rembrandt van Rijn",
    discipline: "Painting & Etching",
    location: "Amsterdam, Netherlands",
    portrait: artist03,
    short:
      "Master of the Dutch Golden Age, renowned for his profound portraits and dramatic use of light and shadow.",
    bio: "Rembrandt van Rijn was a Dutch Golden Age painter and etcher whose mastery of light, shadow, and human emotion set him apart. He created hundreds of self-portraits, biblical scenes, and group portraits that explore the depths of the human condition. His innovative techniques in etching and painting continue to influence artists centuries later.",
  },
  {
    slug: "elisabeth-vigee-le-brun",
    name: "Élisabeth Vigée Le Brun",
    discipline: "Portrait Painting",
    location: "Paris, France",
    portrait: artist04,
    short:
      "Acclaimed French portraitist celebrated for her elegant depictions of European nobility and royalty.",
    bio: "Élisabeth Vigée Le Brun was a prominent French portrait painter who became the official portraitist of Marie Antoinette. She created over 600 portraits across Europe, known for her flattering yet insightful depictions of her subjects. Her work offers a rare female perspective on the aristocracy of the late 18th century.",
  },
  {
    slug: "jean-auguste-dominique-ingres",
    name: "Jean Auguste Dominique Ingres",
    discipline: "Painting & Drawing",
    location: "Paris, France",
    portrait: artist01,
    short:
      "French Neoclassical master whose precise line work and idealized forms defined a generation of artists.",
    bio: "Jean-Auguste-Dominique Ingres was a French Neoclassical painter whose emphasis on drawing and form made him one of the most influential artists of the 19th century. His portraits and historical paintings are celebrated for their exquisite draftsmanship, cool clarity, and timeless elegance. He served as a bridge between Neoclassicism and later artistic movements.",
  },
];

export const getArtist = (slug: string) => artists.find((a) => a.slug === slug);
>>>>>>> 49a1b1e (updated)
