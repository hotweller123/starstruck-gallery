<<<<<<< HEAD
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getArtist } from "@/data/artists";
import { getArtworksByArtist } from "@/data/artworks";
import { ArtworkCard } from "@/components/site/ArtworkCard";
import { SmartImage } from "@/components/site/SmartImage";

export const Route = createFileRoute("/artists/$slug")({
  component: ArtistPage,
  loader: ({ params }) => {
    const artist = getArtist(params.slug);
    if (!artist) throw notFound();
    return { artist };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.artist.name ?? "Artist"} — Aethelred` },
      { name: "description", content: loaderData?.artist.short ?? "" },
    ],
  }),
});

function ArtistPage() {
  const { artist } = Route.useLoaderData();
  const works = getArtworksByArtist(artist.slug);
=======
import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { getArtist } from "@/data/artists";
import { changeChicagoToMod, changeMetArtWorkProps, getArtworksByArtist } from "@/data/artworks";
import { ArtworkCard } from "@/components/site/ArtworkCard";
import { SmartImage } from "@/components/site/SmartImage";
import { useArtworkContext } from "@/lib/useMetArtworksStore";
import { useMetArtist } from "@/hooks/useMetArtist";
import { Loader } from "@/components/site/Loader";
import { useArtInstitute } from "@/hooks/useChicagoArt";
import { useEffect, useState } from "react";
import { convert } from "html-to-text";
import { useToast } from "@/lib/useToast";

export const Route = createFileRoute("/artists/$slug")({
  component: ArtistPage,
  // loader: ({ params }) => {
  //   const artist = getArtist(params.slug);
  //   if (!artist) throw notFound();
  //   return { artist };
  // },
  // head: ({ loaderData }) => ({
  //   meta: [
  //     { title: `${loaderData?.artist.name ?? "Artist"} — Aethelred` },
  //     { name: "description", content: loaderData?.artist.short ?? "" },
  //   ],
  // }),
});

function ArtistPage() {
  const { slug } = useParams({ from: "/artists/$slug" });
  const [showFullText, setShowFullText] = useState(false);

  const {
    artworks,
    selectedArtist: artist,
    fetchArtistByName,
    searchByArtist,
    loading,
  } = useArtInstitute();

  useEffect(() => {
    fetchArtistByName(slug);
    searchByArtist(slug);
    setShowFullText(false);
  }, [fetchArtistByName, searchByArtist, slug]);

  const works = changeChicagoToMod(artworks);
  const converted = convert(artist?.description, {
    wordwrap: true, // or 80 for line wrapping
    selectors: [
      { selector: "h1", format: "heading" },
      { selector: "strong", format: "inline" },
      { selector: "p", format: "paragraph" },
      { selector: "a", format: "inline" },
    ],
    linkHrefBaseUrl: "", // optional
  });
  if (loading) {
    return <Loader message="Loading..." className="flex flex-col gap-3 py-16 md:py-24" />;
  }
>>>>>>> 49a1b1e (updated)

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-12">
        <Link
          to="/artists"
          className="text-[11px] uppercase tracking-[0.22em] text-detail hover:text-ink"
        >
          &larr; All artists
        </Link>
      </section>

<<<<<<< HEAD
      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-16 md:py-24 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        <div className="bg-surface">
          <SmartImage
            src={artist.portrait}
            alt={`Portrait of ${artist.name}`}
            width={800}
            height={1000}
            priority
            className="block aspect-[4/5] w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-8 lg:pt-8">
          <p className="text-[11px] uppercase tracking-[0.3em] text-detail">
            {artist.discipline} &middot; {artist.location}
          </p>
          <h1 className="font-display text-6xl italic leading-[0.95] md:text-7xl">
            {artist.name}
          </h1>
          <p className="font-display text-2xl italic text-ink/80">
            {artist.short}
          </p>
          <p className="text-lg leading-relaxed text-ink/75">{artist.bio}</p>
          <Link
            to="/contact"
            className="inline-block self-start border-b border-ink pb-1 text-[11px] uppercase tracking-[0.22em] hover:text-clay hover:border-clay"
          >
            Inquire about this artist
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-32">
=======
      {artist && (
        <section className="mx-auto grid max-w-7xl gap-16 px-6 py-16 md:py-24 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          {/* <div className="bg-surface">
            <SmartImage
              src={artist?.portrait || ""}
              alt={`Portrait of ${artist?.name}`}
              width={800}
              height={1000}
              priority
              className="block aspect-[4/5] w-full object-cover"
            />
          </div> */}
          <div className="flex flex-col gap-8 lg:pt-8">
            <p className="text-[11px] uppercase tracking-[0.3em] text-detail">
              Birth Date{artist?.birth_date} &middot; Death Date {artist?.death_date}
            </p>
            <h1 className="font-display text-6xl italic leading-[0.95] md:text-7xl">
              {artist?.title}
            </h1>
            <p
              className={`font-display text-2xl italic text-ink/80 ${showFullText ? "line-clamp-none" : "line-clamp-5"}`}
              onClick={() => setShowFullText(!showFullText)}
            >
              {converted || ""}
            </p>
            {/* <p className="text-lg leading-relaxed text-ink/75">{artist?.totalWorks}</p> */}
            <Link
              to="/contact"
              className="inline-block self-start border-b border-ink pb-1 text-[11px] uppercase tracking-[0.22em] hover:text-clay hover:border-clay"
            >
              Inquire about this artist
            </Link>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 pb-32 md:pb-64">
>>>>>>> 49a1b1e (updated)
        <h2 className="mb-12 border-b border-ink/10 pb-6 font-display text-3xl italic">
          Works in the exhibition
        </h2>
        <div className="columns-1 gap-8 md:columns-2 lg:columns-3">
<<<<<<< HEAD
          {works.map((a) => (
            <ArtworkCard key={a.slug} artwork={a} />
          ))}
=======
          {works
            .slice(0, 5)
            .filter((w) => w.image)
            .map((w) => (
              // <ArtworkCard key={a.id} artwork={a} />
              <section key={w.id} className="group">
                <div className="overflow-hidden bg-surface outline outline-1 -outline-offset-1 outline-ink/5">
                  <SmartImage
                    src={w.image}
                    alt={w.title}
                    width={w.width}
                    height={w.height}
                    priority={true}
                    className="w-full"
                    imgClassName="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-detail">
                    {artist?.title}
                  </p>
                  <h3 className="mt-1 font-display text-2xl italic leading-tight text-ink">
                    {artist?.bio}
                  </h3>
                  {/* <p className="mt-1.5 text-xs text-detail">{artwork.medium}</p> */}
                  {/* <div className="mt-2 flex items-baseline gap-3 justify-between border-t border-ink/10 pt-2.5">
                    <span className="text-xs text-detail line-clamp-1">{artwork.dimensions}</span>
                    <span className="text-sm text-ink">{formatPrice(artwork.price)}</span>
                  </div> */}
                </div>
              </section>
            ))}
>>>>>>> 49a1b1e (updated)
        </div>
      </section>
    </>
  );
}
