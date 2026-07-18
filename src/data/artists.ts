import { RELIABLE_ARTISTS } from "@/hooks/useChicagoArt";
import vincent from "@/assets/Self-Portrait-artist-panel-board-Vincent-van-Gogh-1887.jpg";
import jean from "@/assets/Self-portrait-oil-canvas-J-A-D-Ingres-Conde-Museum.jpg";
import marie from "@/assets/Marie-Antoinette-canvas.jpg";
import rembrant from "@/assets/Self-Portrait-canvas-Rembrandt-van-Rijn-Washington-DC.jpg";
import henrique from "@/assets/Moulin-Rouge-oil-canvas-Henri-de-Toulouse-Lautrec(3).jpg";
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
    slug: "vincent-van-gogh",
    name: "Vincent van Gogh",
    discipline: "Painting",
    location: "Auvers-sur-Oise, France",
    portrait: vincent,
    short:
      "Dutch Post-Impressionist painter whose bold color and expressive brushwork transformed modern art.",
    bio: "Vincent van Gogh was a Dutch painter whose work had a far-reaching influence on 20th-century art. His bold use of color, dramatic brushwork, and emotional honesty in depicting the natural world and human experience continue to resonate. He created over 2,000 artworks in just a decade, including iconic pieces like The Starry Night and Sunflowers.",
  },
  {
    slug: "henri-de-toulouse-lautrec",
    name: "Henri de Toulouse-Lautrec",
    discipline: "Painting & Printmaking",
    location: "Paris, France",
    portrait: henrique,
    short:
      "French artist celebrated for his vivid depictions of Parisian nightlife and innovative poster designs.",
    bio: "Henri de Toulouse-Lautrec was a French painter, printmaker, and illustrator whose work captured the energy of Montmartre and the Moulin Rouge. Despite physical challenges, he produced an extraordinary body of work including paintings, lithographs, and posters that defined an era. His keen observation of Parisian society remains unmatched.",
  },
  {
    slug: "rembrandt-van-rijn",
    name: "Rembrandt van Rijn",
    discipline: "Painting & Etching",
    location: "Amsterdam, Netherlands",
    portrait: rembrant,
    short:
      "Master of the Dutch Golden Age, renowned for his profound portraits and dramatic use of light and shadow.",
    bio: "Rembrandt van Rijn was a Dutch Golden Age painter and etcher whose mastery of light, shadow, and human emotion set him apart. He created hundreds of self-portraits, biblical scenes, and group portraits that explore the depths of the human condition. His innovative techniques in etching and painting continue to influence artists centuries later.",
  },
  {
    slug: "elisabeth-vigee-le-brun",
    name: "Élisabeth Vigée Le Brun",
    discipline: "Portrait Painting",
    location: "Paris, France",
    portrait: marie,
    short:
      "Acclaimed French portraitist celebrated for her elegant depictions of European nobility and royalty.",
    bio: "Élisabeth Vigée Le Brun was a prominent French portrait painter who became the official portraitist of Marie Antoinette. She created over 600 portraits across Europe, known for her flattering yet insightful depictions of her subjects. Her work offers a rare female perspective on the aristocracy of the late 18th century.",
  },
  {
    slug: "jean-auguste-dominique-ingres",
    name: "Jean Auguste Dominique Ingres",
    discipline: "Painting & Drawing",
    location: "Paris, France",
    portrait: jean,
    short:
      "French Neoclassical master whose precise line work and idealized forms defined a generation of artists.",
    bio: "Jean-Auguste-Dominique Ingres was a French Neoclassical painter whose emphasis on drawing and form made him one of the most influential artists of the 19th century. His portraits and historical paintings are celebrated for their exquisite draftsmanship, cool clarity, and timeless elegance. He served as a bridge between Neoclassicism and later artistic movements.",
  },
];

export const getArtist = (slug: string) => artists.find((a) => a.slug === slug);
