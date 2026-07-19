import { Upload, Plus, Minus } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { toast } from "@/lib/useToast";

interface ImageUploaderProps {
  name?: string;
  slotCount: number;
  onSlotCountChange: (count: number) => void;
  maxSlots?: number;
}

export default function ImageUploader({
  name = "images",
  slotCount,
  onSlotCountChange,
  maxSlots = 6,
}: ImageUploaderProps) {
  const {
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const images: string[] = getValues(name) || [];

  const handleFile = (file: File, index: number) => {
    if (file.size > 4_000_000) {
      toast.info({
        title: "Info",
        description: "Please choose an image under 4 MB.",
      });
      return;
    }
    const url = URL.createObjectURL(file);
    const next = [...images];
    next[index] = url;
    const cleaned = next.filter(Boolean).slice(0, slotCount);
    setValue(name, cleaned, { shouldValidate: true });
  };

  const addSlot = () => {
    if (slotCount < maxSlots) onSlotCountChange(slotCount + 1);
  };

  const removeSlot = () => {
    const nextCount = Math.max(1, slotCount - 1);
    onSlotCountChange(nextCount);
    const trimmed = images.slice(0, nextCount);
    setValue(name, trimmed, { shouldValidate: true });
  };

  const errorMessage =
    typeof errors[name]?.message === "string" ? (errors[name]?.message as string) : null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1 justify-end">
        <button
          type="button"
          onClick={addSlot}
          className="flex gap-1 text-canvas p-2 text-xs bg-clay font-medium hover:bg-clay/90"
        >
          Add Image Slot <Plus className="size-4" />
        </button>
        {slotCount >= 2 && (
          <button
            type="button"
            onClick={removeSlot}
            className="flex gap-1 text-canvas p-2 text-xs bg-clay font-medium hover:bg-clay/90"
          >
            <Minus className="size-4" /> Remove Image Slot
          </button>
        )}
      </div>

      <div className={`grid ${slotCount > 1 ? "grid-cols-2 gap-px" : "grid-cols-1"}`}>
        {Array.from({ length: slotCount }).map((_, i) => {
          const hasImage = !!images[i];
          return (
            <label
              key={i}
              className="group relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center border-2 border-dashed border-ink/20 bg-surface/30 transition-colors hover:border-ink/40"
            >
              {hasImage ? (
                <img
                  src={images[i]}
                  alt={`Upload ${i + 1}`}
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
                  if (f) handleFile(f, i);
                }}
              />
            </label>
          );
        })}
      </div>

      {errorMessage && (
        <p className="mt-1.5 border border-clay/40 bg-clay/5 px-1.5 py-2 text-xs text-clay">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
