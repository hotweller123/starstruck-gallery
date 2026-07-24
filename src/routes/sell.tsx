import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, Trash2 } from "lucide-react";
import { useStore, type UserListing } from "@/lib/store";
import { PageHeader } from "@/components/site/PageHeader";
import Fields, { FieldProps } from "@/components/site/Fields";
import ImageUploader from "@/components/site/ImageUploader";
import { FormProvider, useForm } from "react-hook-form";
import { useAuthStore, useDataStore } from "@/store/zustand";
import { useShallow } from "zustand/shallow";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuctionLot, inHours } from "@/data/auctions";
import { CategorySlug } from "@/data/artworks";
import { getUserName, photoFN } from "@/utils";
import useDoc from "@/hooks/useDoc";
import { toast } from "@/lib/useToast";
import { EMPTY_TEXT } from "@/lib/emptyState";
import { Loader } from "@/components/site/Loader";
import { AuctionImageSwiper } from "@/components/site/AuctionImageSwiper";
import { formatMoney } from "@/lib/wallet";

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
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

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
  images: z
    .array(
      z
        .instanceof(File, { message: "Please upload a valid file." })
        .refine((file) => file.size <= MAX_FILE_SIZE, {
          message: "Max file size is 5MB.",
        })
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
          message: "Only .jpg, .jpeg, and .png formats are supported.",
        }),
    )
    .min(1, { message: "At least one image is required" }),
  estimateLow: z
    .number()
    .positive("Estimated Low Amount must be greater than 0")
    .min(10, { message: "Minimum Amount Must Be Above 10" })
    .max(1_000_000, "Amount must be less than 1,000,000"),
  price: z
    .number()
    .positive("Amount must be greater than 0")
    .max(1_000_000, "Amount must be less than 1,000,000"),
  estimateHigh: z
    .number()
    .positive("Estimated High Amount must be greater than 0")
    .min(10, { message: "Minimum Amount Must Be Above 10" })
    .max(1_000_000, { message: "Maximum Amount is a Million" }),
  startBid: z
    .number()
    .positive("Start Bid Amount must be greater than 0")
    .min(1, { message: "Start Bid is required" })
    .max(1_000_000, { message: "Maximum Amount is a Million" }),
  // currentBid: z
  //   .number()
  //   .positive("Current Bid Amount must be greater than 0")
  //   .min(1, { message: "Current Bid is required" }),
  endsAt: z.number().min(1, { message: "Bid Time Range in hours is required" }),
});

function SellPage() {
  // ================================================================
  // ALL HOOKS MUST BE DECLARED HERE, UNCONDITIONALLY, IN THE SAME ORDER EVERY RENDER.
  // No hooks, no useState, no useEffect, no useForm, nothing after the early returns.
  // ================================================================

  const { listings, addListing, removeListing } = useStore();
  const { auctions } = useDataStore(
    useShallow((s) => ({
      auctions: s.auctions,
    })),
  );

  const { user, loading, isAuthHydrated } = useAuthStore(
    useShallow((s) => ({
      user: s.user,
      loading: s.loading,
      isAuthHydrated: s.isAuthHydrated,
    })),
  );

  const [imagesIndex, setImagesIndex] = useState(1);
  const [loadingForm, setLoadingForm] = useState(false);
  const { addDocToCollection, deleteDocument } = useDoc();

  const formControl = useForm({
    resolver: zodResolver(auctionSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      category: "",
      condition: "",
      // currentBid: 0,
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

  const {
    setValue,
    handleSubmit,
    getValues,
    formState: { isValid, isLoading, isSubmitting },
  } = formControl;

  useEffect(() => {
    formControl.trigger("images");
  }, [formControl]);

  // --- Early returns are now safe ---
  if (loading || !isAuthHydrated) {
    return <Loader message="Loading..." className="min-h-[60vh]" />;
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
      // { fieldType: "input", label: "Current Bid", name: "currentBid", format: "money" as const },
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
    async (data) => {
      setLoadingForm(true);
      const transformedImages = await Promise.all(
        [...getValues("images")].map(async (f) => await photoFN(f)),
      );

      try {
        const payload: Omit<AuctionLot, "id"> = {
          bidCount: 0,
          category: getValues("category").toLowerCase() as CategorySlug,
          categoryLabel: getValues("category") as CategorySlug,
          condition: getValues("condition"),
          currentBid: 0,
          description: getValues("description"),
          dimensions: getValues("dimensions"),
          endsAt: inHours(isNaN(getValues("endsAt")) ? 0 : Number(getValues("endsAt"))),
          estimateHigh: getValues("estimateHigh"),
          estimateLow: getValues("estimateLow"),
          images: transformedImages,
          lotNumber: "",
          medium: getValues("medium"),
          provenance: getValues("provenance"),
          reserveMet: false,
          sellerSlug: getUserName(user?.email),
          slug: crypto.randomUUID(),
          startBid: getValues("startBid"),
          status: "pending",
          title: getValues("title"),
          year: getValues("year"),

          // added props
          userID: user?.userID,
          price: getValues("price"),
        };

        formControl.reset();
        setImagesIndex(1);

        // console.log(payload);

        await addDocToCollection({
          collections: "auctions",
          document: payload,
        });

        setTimeout(() => {
          toast.success({
            title: "Success",
            description: "Your Auction Lot Have Been Submitted For Review",
          });
        }, 3100);
      } catch (error) {
        toast.error({
          title: "Error Message",
          description: error.message,
        });
      } finally {
        setTimeout(() => {
          setLoadingForm(false);
        }, 3000);
      }
    },
    (invalidate) => {
      console.log(invalidate);

      Object.keys(invalidate).forEach((k) => {
        toast.reserved({
          title: invalidate[k as keyof typeof invalidate]?.message || EMPTY_TEXT,
          description: "Invalid Form Fields",
          position: "top-left",
        });
      });
    },
  );

  return (
    <>
      <PageHeader
        eyebrow="Consign"
        title="Sell your artwork"
        description="Upload a work to be reviewed for the next exhibition. Provide the most accurate details you can."
      />

      {loadingForm && (
        <Loader
          message="Please Hold As We Process This Request..."
          variant="dots"
          size="xs"
          fullScreen
          className="flex flex-col"
        />
      )}

      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-32 pt-6 lg:grid-cols-[1.4fr_1fr]">
        <FormProvider {...formControl}>
          <form onSubmit={submit} className="flex flex-col gap-6">
            {/* Image Uploader */}
            <ImageUploader slotCount={imagesIndex} onSlotCountChange={setImagesIndex} />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Fields fields={fields} />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loadingForm}
                className="self-start border border-ink bg-ink px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay disabled:opacity-50 disabled:pointer-events-none"
              >
                {loadingForm || isLoading || isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Submit For Review"
                )}
              </button>
              <button
                disabled={loadingForm}
                className="self-start border border-ink bg-canvas px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-ink hover:text-clay hover:bg-clay/5 hover:border-clay/80 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => {
                  formControl.reset();
                  setImagesIndex(1);
                }}
                type="reset"
              >
                Reset
              </button>
            </div>
          </form>

          <aside className="self-start lg:sticky lg:top-32">
            <h2 className="font-display text-2xl italic">Your listings</h2>
            <p className="mt-2 text-xs text-detail">Drafts you've submitted so far.</p>
            {auctions.length === 0 ? (
              <div className="mt-6 border border-dashed border-ink/15 p-8 text-center text-sm text-detail">
                No listings yet.
              </div>
            ) : (
              <ul className="mt-6 flex flex-col gap-4">
                {auctions.map((a) => (
                  <li key={a.id!} className="flex gap-4 border border-ink/10 p-3">
                    {/* <img src={l.image} alt={l.title} className="size-20 shrink-0 object-cover" /> */}
                    <div className="flex-1 ">
                      <AuctionImageSwiper
                        images={a.images}
                        alt="Auctions Drafts"
                        aspect="aspect-[5/5]"
                      />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-detail">
                        {a.category}
                      </p>
                      <p className="font-display text-lg italic">{a.title}</p>
                      <p className="text-xs text-detail">{a.sellerSlug}</p>
                      <p className="mt-auto text-sm">{formatMoney(a.price)}</p>
                    </div>
                    <button
                      onClick={async () => {
                        setLoadingForm(true);
                        setTimeout(() => {
                          setLoadingForm(false);
                        }, 2000);
                        await deleteDocument({
                          collectionName: "auctions",
                          id: a.id!,
                          message: `${a.title} Has Been Deleted Successfully From Your Draft`,
                        });
                      }}
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
  "w-full border border-ink/20 bg-canvas px-4 py-2.5 text-base text-ink placeholder:text-detail/50 focus:border-ink focus:outline-none";

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
