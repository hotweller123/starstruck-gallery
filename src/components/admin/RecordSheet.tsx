import { type ReactNode, useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "motion/react";
import { X, Pencil, Save, RotateCcw, type LucideIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectGroup,
} from "../ui/select";

/**
 * Generic admin record viewer / editor.
 * - Fullscreen on mobile, centered panel on md+
 * - View mode renders read-only field rows
 * - Edit mode renders inputs and emits onSave(patch)
 * - Operations are type-specific quick actions (approve, suspend, etc.)
 */

export type FieldKind = "text" | "number" | "textarea" | "select" | "readonly" | "money";

export interface FieldDef<T> {
  key: keyof T & string;
  label: string;
  kind?: FieldKind;
  options?: { value: string; label: string }[];
  hint?: string;
  span?: 1 | 2;
  render?: (value: unknown, row: T) => ReactNode; // override in view mode
  editable?: boolean;
}

export interface OperationDef {
  id: string;
  label: string;
  icon?: LucideIcon;
  tone?: "default" | "primary" | "danger" | "success";
  confirm?: string;
  onRun: () => void;
}

interface RecordSheetProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  record: T | null;
  fields: FieldDef<T>[];
  operations?: OperationDef[];
  extra?: ReactNode; // extra panel (e.g. preview)
  onSave?: (patch: Partial<T>) => void;
}

export function RecordSheet<T extends { id: string }>({
  open,
  onOpenChange,
  title,
  subtitle,
  eyebrow,
  record,
  fields,
  operations,
  extra,
  onSave,
}: RecordSheetProps<T>) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Partial<T>>({});

  useEffect(() => {
    if (open) {
      setEditing(false);
      setDraft({});
    }
  }, [open, record?.id]);

  if (!record) return null;

  function update<K extends keyof T>(key: K, value: T[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function getValue<K extends keyof T>(key: K): T[K] {
    return (draft[key] !== undefined ? draft[key] : record![key]) as T[K];
  }

  function handleSave() {
    if (onSave && Object.keys(draft).length) onSave(draft);
    setEditing(false);
    setDraft({});
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="admin-theme fixed inset-0 z-50 flex flex-col bg-[#0f0f10] text-[var(--a-fg)] md:inset-auto md:left-1/2 md:top-1/2 md:max-h-[88vh] md:w-[min(960px,94vw)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl md:border md:border-[var(--a-border-hi)] md:shadow-2xl"
              >
                <DialogPrimitive.Description className="sr-only">
                  {title} details panel
                </DialogPrimitive.Description>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-[var(--a-border)] px-5 py-4 md:px-6">
                  <div className="min-w-0">
                    {eyebrow && <p className="a-eyebrow">{eyebrow}</p>}
                    <DialogPrimitive.Title className="font-display mt-0.5 truncate text-xl font-extrabold tracking-tight md:text-2xl">
                      {title}
                    </DialogPrimitive.Title>
                    {subtitle && (
                      <p className="mt-0.5 truncate text-xs text-[var(--a-muted)]">{subtitle}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {onSave && !editing && (
                      <button
                        onClick={() => setEditing(true)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-2.5 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]"
                      >
                        <Pencil className="size-3.5" /> Edit
                      </button>
                    )}
                    <DialogPrimitive.Close
                      className="grid size-8 place-items-center rounded-md text-[var(--a-muted)] hover:bg-[var(--a-surface)] hover:text-[var(--a-fg)]"
                      aria-label="Close"
                    >
                      <X className="size-4" />
                    </DialogPrimitive.Close>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto a-scrollbar px-5 py-5 md:px-6">
                  <div className="grid gap-5 md:grid-cols-3">
                    <div className={extra ? "md:col-span-2" : "md:col-span-3"}>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {fields.map((f) => {
                          const value = getValue(f.key);
                          const isEditing =
                            editing && f.editable !== false && f.kind !== "readonly";
                          return (
                            <div key={f.key} className={f.span === 2 ? "sm:col-span-2" : undefined}>
                              <label className="a-eyebrow mb-1.5 block">{f.label}</label>
                              {isEditing ? (
                                <EditField
                                  kind={f.kind ?? "text"}
                                  value={value}
                                  options={f.options}
                                  onChange={(v) => update(f.key, v as T[typeof f.key])}
                                />
                              ) : (
                                <ViewField field={f} value={value} row={record} />
                              )}
                              {f.hint && (
                                <p className="mt-1 text-[10px] text-[var(--a-faint)]">{f.hint}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {extra && (
                      <aside className="md:col-span-1">
                        <div className="rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] p-4">
                          {extra}
                        </div>
                      </aside>
                    )}
                  </div>

                  {/* Operations */}
                  {operations && operations.length > 0 && (
                    <div className="mt-6">
                      <p className="a-eyebrow mb-2">Operations</p>
                      <div className="flex flex-wrap gap-2">
                        {operations.map((op) => {
                          const Icon = op.icon;
                          const tone =
                            op.tone === "danger"
                              ? "border-[var(--a-neg)]/30 bg-[var(--a-neg)]/10 text-[var(--a-neg)] hover:bg-[var(--a-neg)]/20"
                              : op.tone === "success"
                                ? "border-[var(--a-pos)]/30 bg-[var(--a-pos)]/10 text-[var(--a-pos)] hover:bg-[var(--a-pos)]/20"
                                : op.tone === "primary"
                                  ? "border-transparent bg-[var(--a-accent)] text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]"
                                  : "border-[var(--a-border)] bg-[var(--a-surface)] text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]";
                          return (
                            <button
                              key={op.id}
                              onClick={() => {
                                if (op.confirm && !confirm(op.confirm)) return;
                                op.onRun();
                              }}
                              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition ${tone}`}
                            >
                              {Icon && <Icon className="size-3.5" />} {op.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {editing && (
                  <div className="flex items-center justify-end gap-2 border-t border-[var(--a-border)] bg-[var(--a-bg-2)] px-5 py-3 md:px-6">
                    <button
                      onClick={() => {
                        setEditing(false);
                        setDraft({});
                      }}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]"
                    >
                      <RotateCcw className="size-3.5" /> Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]"
                    >
                      <Save className="size-3.5" /> Save changes
                    </button>
                  </div>
                )}
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}

function ViewField<T>({ field, value, row }: { field: FieldDef<T>; value: unknown; row: T }) {
  if (field.render) {
    return (
      <div className="rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] px-3 py-2 text-sm text-[var(--a-fg)]">
        {field.render(value, row)}
      </div>
    );
  }
  const display =
    value === null || value === undefined || value === ""
      ? "—"
      : field.kind === "money" && typeof value === "number"
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(value)
        : String(value);
  return (
    <div className="break-words rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] px-3 py-2 text-sm text-[var(--a-fg)]">
      {display}
    </div>
  );
}

function EditField({
  kind,
  value,
  options,
  onChange,
}: {
  kind: FieldKind;
  value: unknown;
  options?: { value: string; label: string }[];
  onChange: (value: unknown) => void;
}) {
  const cls =
    "w-full rounded-md border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-sm text-[var(--a-fg)] outline-none focus:border-[var(--a-border-hi)]";
  if (kind === "textarea") {
    return (
      <textarea
        className={`${cls} min-h-[88px]`}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (kind === "select" && options) {
    return (
      <Select onValueChange={(e) => onChange(e)} value={(value as string) ?? ""}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
  return (
    <input
      type={kind === "number" || kind === "money" ? "number" : "text"}
      className={cls}
      value={(value as string | number) ?? ""}
      onChange={(e) =>
        onChange(
          kind === "number" || kind === "money"
            ? e.target.value === ""
              ? 0
              : Number(e.target.value)
            : e.target.value,
        )
      }
    />
  );
}
