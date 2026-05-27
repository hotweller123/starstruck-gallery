import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Aethelred" },
      {
        name: "description",
        content:
          "Contact the gallery for inquiries about artworks, artists, private viewings or acquisitions.",
      },
    ],
  }),
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Inquiries"
        title="Write to us."
        description="For acquisition inquiries, private viewings or general questions about the exhibition. We respond within two working days."
      />

      <section className="mx-auto grid max-w-7xl gap-16 px-6 pb-32 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="flex flex-col gap-8"
        >
          {(
            [
              { id: "name", label: "Your name", type: "text" },
              { id: "email", label: "Email", type: "email" },
              { id: "subject", label: "Subject", type: "text" },
            ] as const
          ).map((f) => (
            <label key={f.id} className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-[0.22em] text-detail">
                {f.label}
              </span>
              <input
                id={f.id}
                name={f.id}
                type={f.type}
                required
                className="border-b border-ink/20 bg-transparent pb-2 text-base outline-none transition-colors focus:border-ink"
              />
            </label>
          ))}
          <label className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-[0.22em] text-detail">
              Message
            </span>
            <textarea
              name="message"
              required
              rows={5}
              className="border-b border-ink/20 bg-transparent pb-2 text-base outline-none transition-colors focus:border-ink"
            />
          </label>

          <button
            type="submit"
            disabled={sent}
            className="mt-4 self-start border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas transition-colors hover:bg-clay hover:border-clay disabled:opacity-50"
          >
            {sent ? "Thank you — we'll be in touch" : "Send inquiry"}
          </button>
        </form>

        <aside className="flex flex-col gap-10 text-sm leading-relaxed text-ink/80">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-detail">
              Gallery
            </p>
            <p className="mt-3 font-display text-2xl italic">
              Aethelred Gallery
            </p>
            <p className="mt-2">
              14 Linen Street
              <br />
              Antwerp, Belgium
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-detail">
              Hours
            </p>
            <p className="mt-3">
              Tuesday &ndash; Saturday
              <br />
              11:00 &ndash; 18:00
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-detail">
              Direct
            </p>
            <p className="mt-3">
              <a
                href="mailto:hello@aethelred.gallery"
                className="underline decoration-detail/30 underline-offset-4 hover:text-clay"
              >
                hello@aethelred.gallery
              </a>
              <br />
              +32 3 000 0000
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
