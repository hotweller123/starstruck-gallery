export interface Milestone {
  year: string;
  title: string;
  body: string;
}

export const history: Milestone[] = [
  {
    year: "2019",
    title: "An accidental beginning",
    body: "The first exhibition was assembled in a shared studio in Antwerp, almost by accident — six artists, twelve works and a single hand-printed broadsheet.",
  },
  {
    year: "2021",
    title: "The first season",
    body: "Aethelred moved from one-off shows to a seasonal rhythm — four exhibitions a year, each held for a full quarter and accompanied by a printed catalogue.",
  },
  {
    year: "2023",
    title: "Permanent rotation",
    body: "A small group of twelve artists were invited into permanent rotation. Each agreed to release a limited body of work each year, on the gallery's slow calendar.",
  },
  {
    year: "2025",
    title: "Aethelred Digital",
    body: "The exhibition moves online — but on our terms: one hang at a time, no algorithm, no infinite scroll. The same quiet, in a different room.",
  },
];
