import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { formatMoney, parseMoney, formatMoneyInput } from "@/utils";
import { useAuthStore } from "@/store/zustand";
import { useShallow } from "zustand/shallow";

export type InputProps = React.JSX.IntrinsicElements["input"];
export type SelectProps = React.JSX.IntrinsicElements["select"];
export type TextareaProps = React.JSX.IntrinsicElements["textarea"];

// export type InputType = React.HTMLAttributes<HTMLInputElement>;
// export type SelectType = React.HTMLAttributes<HTMLSelectElement>;
// export type TextareaType = React.HTMLAttributes<HTMLTextAreaElement>;

// export type InputType = React.ComponentPropsWithoutRef<"input">;
// export type SelectType = React.ComponentPropsWithoutRef<"select">;
// export type TextareaType = React.ComponentPropsWithoutRef<"textarea">;

export interface InputField {
  fieldType: "input";
  name: string;
  label: string;
  labelClass?: string;
  /**
   * Special display formatting.
   * "money" will format the displayed value using the current user's currency.
   * The form value itself stays as a plain number.
   */
  format?: "money";
  attrs?: InputProps;
}

export interface SelectField {
  fieldType: "select";
  name: string;
  label: string;
  options: { label: string; value: string }[];
  labelClass?: string;
  attrs?: SelectProps;
}

export interface TextareaField {
  fieldType: "textarea";
  name: string;
  label: string;
  labelClass?: string;
  attrs?: TextareaProps;
}

export interface FieldProps {
  fields: (InputField | SelectField | TextareaField)[];
}

export default function Fields({ fields }: FieldProps) {
  const formControl = useFormContext();
  const {
    register,
    control,
    formState: { errors },
  } = formControl;

  // Currency from the centralized auth store (for format="money")
  const { user } = useAuthStore(useShallow((s) => ({ user: s.user })));
  const currency = user?.currency || "USD";

  // Track which money field is focused so we can show raw number while the user is typing
  const [focusedMoneyField, setFocusedMoneyField] = useState<string | null>(null);

  return (
    <>
      {fields.map((f) => {
        const inputType = f.fieldType == "input";
        const selectType = f.fieldType == "select";
        const textareaType = f.fieldType == "textarea";

        const error = errors[f.name]?.message;

        const errorMessage = typeof error == "string" && (
          <p className="mt-1.5 border border-clay/40 bg-clay/5 px-1.5 py-2 text-xs text-clay">
            {error}
          </p>
        );

        return (
          <div key={f.name}>
            {inputType && (
              <>
                <Controller
                  name={f.name}
                  control={control}
                  render={({ field }) => {
                    const isMoney = f.format === "money";
                    const isNumber = !isMoney && f.attrs?.type === "number";
                    const isFocused = focusedMoneyField === f.name;

                    // Compute display value for the input
                    let displayValue = "";

                    if (isMoney) {
                      const raw = field.value;
                      if (isFocused) {
                        // Focused money: show comma-formatted number (no symbol) for readability while editing
                        displayValue =
                          raw != null && raw !== "" ? formatMoneyInput(String(raw)) : "";
                      } else {
                        // Blurred: show full formatted value with currency symbol (empty if 0)
                        const num = raw != null && raw !== "" ? Number(raw) : 0;
                        displayValue =
                          num > 0 ? formatMoney(num, currency, { withSymbol: true }) : "";
                      }
                    } else if (isNumber) {
                      // Plain numeric input: keep the raw value (number or empty)
                      const raw = field.value;
                      displayValue = raw != null ? String(raw) : "";
                    } else {
                      // Text input
                      const raw = field.value;
                      displayValue = raw != null ? String(raw) : "";
                    }

                    // Force text input for money so formatted strings (commas + symbol) work
                    const inputTypeAttr = isMoney ? "text" : (f.attrs?.type ?? undefined);

                    // For money, don't pass type="number" down
                    const { type: _droppedType, ...restAttrs } = f.attrs ?? {};
                    const passAttrs = isMoney ? restAttrs : (f.attrs ?? {});

                    return (
                      <>
                        <label className={`flex flex-col gap-2 ${f.labelClass}`}>
                          <span className={`text-[10px] uppercase tracking-[0.22em] text-detail`}>
                            {f.label}
                          </span>
                          <input
                            type={inputTypeAttr}
                            value={displayValue}
                            onFocus={() => {
                              if (isMoney) setFocusedMoneyField(f.name);
                            }}
                            onBlur={() => {
                              if (isMoney) {
                                setFocusedMoneyField(null);
                                // normalize empty money value to 0 so schema validation is consistent
                                const current = field.value;
                                if (current === "" || current == null || current === undefined) {
                                  field.onChange(0);
                                }
                              }
                            }}
                            onChange={(e) => {
                              const v = e.target.value;

                              if (isMoney) {
                                // Always store a number for money fields
                                field.onChange(parseMoney(v));
                                return;
                              }

                              if (isNumber) {
                                const parsed = parseMoney(v);
                                // Keep explicit 0, turn empty input into empty string (allows UX + schema)
                                field.onChange(parsed === 0 && v.trim() !== "0" ? "" : parsed);
                                return;
                              }

                              // plain text
                              field.onChange(v);
                            }}
                            {...passAttrs}
                            className={f.attrs?.className}
                          />
                        </label>
                        {errorMessage}
                      </>
                    );
                  }}
                />
              </>
            )}
            {selectType && (
              <>
                <Controller
                  control={control}
                  name={f.name}
                  render={({ field }) => {
                    return (
                      <label className={`flex flex-col gap-2 ${f.labelClass}`}>
                        <span className={`text-[10px] uppercase tracking-[0.22em] text-detail `}>
                          {f.label}
                        </span>
                        <Select onValueChange={(e) => field.onChange(e)}>
                          <SelectTrigger>
                            <SelectValue {...f.attrs} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {f.options.map((o) => (
                                <SelectItem key={o.value} value={o.value}>
                                  {o.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </label>
                    );
                  }}
                />
                {errorMessage}
              </>
            )}
            {textareaType && (
              <>
                <label className={`flex flex-col gap-2 ${f.labelClass}`}>
                  <span className={`text-[10px] uppercase tracking-[0.22em] text-detail`}>
                    {f.label}
                  </span>
                  <textarea {...register(f.name, { required: true })} {...f.attrs} />
                </label>
                {errorMessage}
              </>
            )}
          </div>
        );
      })}
    </>
  );
}
