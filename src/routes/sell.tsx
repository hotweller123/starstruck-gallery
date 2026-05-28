import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Upload, Trash2 } from "lucide-react";
import { useStore, type UserListing } from "@/lib/store";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/sell")({
  component: SellPage,
  head: () => ({ meta: [{ title: "Sell your work — Aethelred" }] }),
});

const categories = [
  "Painting",
  "Sculpture",
  "Photography",
  "Drawing",
  "Mixed Media",
  "Ceramics",
  "Digital",
];

const empty = {
  title: "",
  artist: "",
  medium: "",
  dimensions: "",
  year: new Date().getFullYear(),
  price: 0,
  category: categories[0],
  description: "",
  image: "",
};

function SellPage() {
  const { listings, addListing, removeListing } = useStore();
  const [form, setForm] = useState<Omit<UserListing, "id" | "createdAt">>(empty);
  const [submitting, setSubmitting] = useState(false);

  const handleImage = (file: File) => {
    if (file.size > 4_000_000) {
      alert("Please choose an image under 4 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.image) {
      alert("Please upload an image of the work.");
      return;
    }
    if (!form.title || !form.artist || !form.price) {
      alert("Title, artist and price are required.");
      return;
    }
    setSubmitting(true);
    addListing(form);
    setForm(empty);
    setSubmitting(false);
  };

  return (
    <>
      <PageHeader
        eyebrow="Consign"
        title="Sell your artwork"
        description="Upload a work to be reviewed for the next exhibition. Provide the most accurate details you can."
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-32 pt-6 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={submit} className="flex flex-col gap-6">
          {/* Image */}
          <label className="group flex aspect-[4/3] cursor-pointer flex-col items-center justify-center border-2 border-dashed border-ink/20 bg-surface/30 transition-colors hover:border-ink/40">
            {form.image ? (
              <img
                src={form.image}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-center">
                <Upload className="size-8 text-detail" strokeWidth={1.25} />
                <p className="text-[11px] uppercase tracking-[0.22em] text-detail">
                  Upload image of the work
                </p>
                <p className="text-xs text-detail/70">JPG or PNG · up to 4 MB</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImage(f);
              }}
            />
          </label>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Title">
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Artist">
              <input
                required
                value={form.artist}
                onChange={(e) => setForm({ ...form, artist: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Medium">
              <input
                value={form.medium}
                onChange={(e) => setForm({ ...form, medium: e.target.value })}
                placeholder="e.g. Oil on linen"
                className={inputCls}
              />
            </Field>
            <Field label="Dimensions">
              <input
                value={form.dimensions}
                onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                placeholder="e.g. 80 × 60 cm"
                className={inputCls}
              />
            </Field>
            <Field label="Year">
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                className={inputCls}
              />
            </Field>
            <Field label="Price (USD)">
              <input
                type="number"
                required
                min={0}
                value={form.price || ""}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className={inputCls}
              />
            </Field>
            <Field label="Category" className="md:col-span-2">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputCls}
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Description" className="md:col-span-2">
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="A few sentences about the work, its materials, and its making."
                className={inputCls}
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="self-start border border-ink bg-ink px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay disabled:opacity-50"
          >
            Submit for review
          </button>
        </form>

        <aside className="self-start lg:sticky lg:top-32">
          <h2 className="font-display text-2xl italic">Your listings</h2>
          <p className="mt-2 text-xs text-detail">
            Drafts you've submitted. Held locally on this device.
          </p>
          {listings.length === 0 ? (
            <div className="mt-6 border border-dashed border-ink/15 p-8 text-center text-sm text-detail">
              No listings yet.
            </div>
          ) : (
            <ul className="mt-6 flex flex-col gap-4">
              {listings.map((l) => (
                <li
                  key={l.id}
                  className="flex gap-4 border border-ink/10 p-3"
                >
                  <img
                    src={l.image}
                    alt={l.title}
                    className="size-20 shrink-0 object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-detail">
                      {l.category}
                    </p>
                    <p className="font-display text-lg italic">{l.title}</p>
                    <p className="text-xs text-detail">{l.artist}</p>
                    <p className="mt-auto text-sm">${l.price.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => removeListing(l.id)}
                    className="self-start text-detail hover:text-clay"
                    aria-label="Remove"
                  >
                    <Trash2 className="size-4" strokeWidth={1.25} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </section>
    </>
  );
}

const inputCls =
  "w-full border border-ink/20 bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-detail/50 focus:border-ink focus:outline-none";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-[10px] uppercase tracking-[0.22em] text-detail">{label}</span>
      {children}
    </label>
  );
}
