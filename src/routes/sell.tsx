import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useStore, type UserListing } from "@/lib/store";
import { PageHeader } from "@/components/site/PageHeader";
import Fields, { FieldProps } from "@/components/site/Fields";
import ImageUploader from "@/components/site/ImageUploader";
import { FormProvider, useForm } from "react-hook-form";
import { useAuthStore } from "@/store/zustand";
import { useShallow } from "zustand/shallow";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

const auctionSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  category: z.string().min(1, { message: "Select A Category" }),
  year: z
    .number()
    .min(1950, { message: "Year Must Not Go Below 1950" })
    .max(new Date().getFullYear(), { message: "Current Year Is The Year Of Upload" }),
  medium: z.string().min(1, { message: "Medium is required" }),
  dimensions: z.string().min(1, { message: "Dimensions is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  provenance: z.string().min(1, { message: "Provenance is requred" }),
  condition: z.string().min(1, { message: "Condition is required" }),
  images: z.array(z.string()).min(1, { message: "At least one image is required" }),
  estimateLow: z.number().positive().min(10, { message: "Minimum Amount Must Be Above 10" }),
  price: z
    .number()
    .positive("Amount must be greater than 0")
    .max(1_000_000, "Amount must be less than 1,000,000"),
  estimateHigh: z.number().positive().max(1_000_000, { message: "Maximum Amount is a Million" }),
  startBid: z.number().positive().min(1, { message: "Start Bid is required" }),
  currentBid: z.number().positive().min(1, { message: "Current Bid is required" }),
  endsAt: z.number().min(1, { message: "Bid Time Range in hours is required" }),
});

function SellPage() {
  // ================================================================
  // ALL HOOKS MUST BE DECLARED HERE, UNCONDITIONALLY, IN THE SAME ORDER EVERY RENDER.
  // No hooks, no useState, no useEffect, no useForm, nothing after the early returns.
  // ================================================================

  const { listings, addListing, removeListing } = useStore();

  const { user, loading, isAuthHydrated } = useAuthStore(
    useShallow((s) => ({
      user: s.user,
      loading: s.loading,
      isAuthHydrated: s.isAuthHydrated,
    })),
  );

  const [submitting, setSubmitting] = useState(false);
  const [imagesIndex, setImagesIndex] = useState(1);

  const formControl = useForm({
    resolver: zodResolver(auctionSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      category: "",
      condition: "",
      currentBid: 0,
      description: "",
      dimensions: "",
      endsAt: 0,
      estimateHigh: 0,
      images: [],
      estimateLow: 0,
      medium: "",
      provenance: "",
      price: 0,
      startBid: 0,
      year: 0,
    },
  });

  const { setValue, handleSubmit } = formControl;

  useEffect(() => {
    formControl.trigger("images");
  }, [formControl]);

  // --- Early returns are now safe ---
  if (loading || !isAuthHydrated) {
    return <div className="min-h-[60vh]" />;
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-detail">Consign</p>
          <h1 className="mt-3 font-display text-4xl italic text-ink">Sign in to sell</h1>
          <p className="mt-3 text-sm text-detail">
            You need an account to list artwork for exhibition.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/connect"
              className="inline-block border border-ink bg-ink px-6 py-2 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay"
            >
              Sign in
            </Link>
            <Link
              to="/"
              className="inline-block border border-ink px-6 py-2 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas"
            >
              Browse
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Non-hook code only below this line.
  const fields = (
    [
      { fieldType: "input", label: "Title", name: "title" },
      {
        fieldType: "input",
        label: "Medium",
        name: "medium",
        attrs: { placeholder: "e.g. Oil on linen" },
      },
      {
        fieldType: "input",
        label: "Dimensions",
        name: "dimensions",
        attrs: { placeholder: "e.g. 80 × 60 cm" },
      },
      {
        fieldType: "input",
        label: "Provenance",
        name: "provenance",
        attrs: { placeholder: "Authenticity of the artwork" },
      },
      {
        fieldType: "input",
        label: "Condition",
        name: "condition",
        attrs: { placeholder: "Condition of the artwork" },
      },
      {
        fieldType: "input",
        label: "Year",
        name: "year",
        attrs: { type: "number", placeholder: "Year" },
      },
      {
        fieldType: "input",
        label: "Price",
        name: "price",
        format: "money" as const,
      },
      { fieldType: "input", label: "Estimate Low", name: "estimateLow", format: "money" as const },
      {
        fieldType: "input",
        label: "Estimate High",
        name: "estimateHigh",
        format: "money" as const,
      },
      { fieldType: "input", label: "Start Bid", name: "startBid", format: "money" as const },
      { fieldType: "input", label: "Current Bid", name: "currentBid", format: "money" as const },
      {
        fieldType: "select",
        label: "Category",
        name: "category",
        options: categories.map((c) => ({ label: c, value: c.toLowerCase() })),
      },
      {
        fieldType: "input",
        label: "Ends At",
        name: "endsAt",
        attrs: {
          type: "number",
          placeholder: "In hours",
        },
      },
      {
        fieldType: "textarea",
        label: "Description",
        name: "description",
        attrs: { placeholder: "A few sentences about the work, its materials, and its making." },
      },
    ] as FieldProps["fields"]
  ).map((f) => ({
    ...f,
    attrs: { ...f.attrs, className: inputCls },
  })) as FieldProps["fields"];

  const submit = handleSubmit(
    (data) => console.log(data),
    (invalidate) => console.log(invalidate),
  );

  return (
    <>
      <PageHeader
        eyebrow="Consign"
        title="Sell your artwork"
        description="Upload a work to be reviewed for the next exhibition. Provide the most accurate details you can."
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-32 pt-6 lg:grid-cols-[1.4fr_1fr]">
        <FormProvider {...formControl}>
          <form onSubmit={submit} className="flex flex-col gap-6">
            {/* Image Uploader */}
            <ImageUploader slotCount={imagesIndex} onSlotCountChange={setImagesIndex} />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Fields fields={fields} />
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
                  <li key={l.id} className="flex gap-4 border border-ink/10 p-3">
                    <img src={l.image} alt={l.title} className="size-20 shrink-0 object-cover" />
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
        </FormProvider>
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
