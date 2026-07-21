import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, Sparkles, List, Loader2 } from "lucide-react";
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CURRENCIES, getCurrencySymbol } from "@/utils";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "../ui/toast";

type Mode = "signin" | "register";
export interface FormField {
  fullName: string;
  email: string;
  password: string;
  currency: string;
}
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export function AuthForms() {
  const [mode, setMode] = useState<Mode>("register");
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();
  const { registerUser, loginUser } = useAuth();
  const { toast } = useToast();

  const registerSchema = z.object({
    fullName: z.string().min(1, { message: "FullName is required" }),
    email: z.string().email({ message: "Enter a valid Email Address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(
        strongPasswordRegex,
        "Password must contain uppercase, lowercase, number and special character",
      ),
    // currency: z.string().min(1, { message: "Currency is required" }),
  });

  const loginSchema = z.object({
    email: z.string().email({ message: "Enter a valid Email Address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  });

  const partSchema = mode == "register" ? registerSchema : loginSchema;

  const formControl = useForm({
    resolver: zodResolver(partSchema),
    mode: "onChange",
    defaultValues: {
      ...(mode == "register"
        ? {
            fullName: "",
            email: "",
            password: "",
            // currency: "",
          }
        : {
            email: "",
            password: "",
          }),
    },
  });

  const handleSubmission = formControl.handleSubmit(async (user) => {
    try {
      if (mode === "register") {
        await registerUser(user as FormField);
      } else {
        const { email, password } = user as Pick<FormField, "email" | "password">;
        await loginUser(email, password);
      }
      // navigate({ to: "/wallet" });
      await toast({
        title: mode == "register" ? "Registration Successful" : "Welcome Back",
        position: "bottom-left",
        variant: "collection",
        duration: 4000,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed Operation";
      console.log(message);
      toast({
        title: "Error Message",
        description: message,
        position: "bottom-left",
        variant: "error",
        duration: 4000,
      });
    }
  });

  const loading = formControl.formState.isSubmitting;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative"
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-7 shadow-2xl wallet-ring">
        <div className="absolute inset-x-0 top-0 h-32 wallet-dotgrid opacity-30" aria-hidden />

        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-[var(--w-brand)] text-[var(--w-brand-contrast)]">
              <ShieldCheck className="size-4" strokeWidth={2.4} />
            </span>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--w-muted)]">
              Secured locally
            </p>
          </div>

          <div className="mt-5 flex gap-1 rounded-full border border-[var(--w-border)] bg-[var(--w-input)] p-1 pt-2 px-3 md:px-4">
            {(["register", "signin"] as const).map((m) => (
              <span key={m} className="relative  w-full">
                <button
                  type="button"
                  onClick={() => setMode(m)}
                  className={`relative w-full flex-1 rounded-full px-3 py-2.5 text-xs font-semibold transition overflow-clip z-20 ${
                    mode === m ? "" : "text-[var(--w-muted)] hover:text-[var(--w-fg)]"
                  }`}
                >
                  {m === "register" ? "Create wallet" : "Sign in"}
                </button>

                <motion.div
                  animate={mode == m ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 12 }}
                  className={`absolute inset-0 rounded-full ${mode == m && "bg-[var(--w-brand)] text-[var(--w-brand-contrast)]"} `}
                ></motion.div>
              </span>
            ))}
          </div>

          <FormProvider {...formControl}>
            <form onSubmit={handleSubmission} className="mt-6 flex flex-col gap-2">
              {mode === "register" && (
                <Field
                  fieldName="fullName"
                  label="Full name"
                  placeholder="Eloise Marchand"
                  icon={<User className="size-4" />}
                />
              )}
              <Field
                fieldName="email"
                label="Email"
                type="text"
                placeholder="you@aethelred.gallery"
                icon={<Mail className="size-4" />}
              />
              <div>
                <Field
                  fieldName="password"
                  label="Password"
                  type={showPw ? "text" : "password"}
                  placeholder="At least 6 characters"
                  icon={<Lock className="size-4" />}
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="text-[var(--w-muted)] transition hover:text-[var(--w-fg)]"
                      aria-label="Toggle password"
                    >
                      {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  }
                />
                {/* {mode === "register" && (
                  <SelectField
                    label="Currencies"
                    fieldName="currency"
                    icon={<List className="size-4" />}
                    placeholder="Select A Currency"
                  />
                )} */}
              </div>

              <motion.button
                whileTap={{ scale: 0.98, opacity: 0.8 }}
                whileHover={{ y: -1 }}
                type="submit"
                disabled={loading}
                className={`mt-2 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-extrabold uppercase tracking-[0.16em] shadow-lg  ${loading ? "pointer-events-none opacity-40" : ""}`}
                style={{ background: "var(--w-brand)", color: "var(--w-brand-contrast)" }}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    {mode === "register" ? "Create my wallet" : "Sign in"}
                  </>
                )}
              </motion.button>
            </form>
          </FormProvider>

          <p className="mt-5 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
            Your Data is stored with us
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function Field({
  label,
  fieldName,
  type = "text",
  placeholder,
  icon,
  suffix,
}: {
  label: string;
  fieldName: keyof FormField;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const options = {};

  return (
    <>
      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
          {label}
        </span>
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--w-muted)]">
              {icon}
            </span>
          )}
          <input
            type={type}
            {...register(fieldName, { ...options })}
            placeholder={placeholder}
            className={`w-full rounded-xl border border-[var(--w-border)] bg-[var(--w-input)] py-2 ${icon ? "pl-11" : "pl-4"} ${suffix ? "pr-11" : "pr-4"} text-base font-medium text-[var(--w-fg)] placeholder:text-[var(--w-muted)]/60 transition focus:border-[var(--w-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--w-brand-ring)]`}
          />
          {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</span>}
        </div>
      </label>
      {typeof errors[fieldName]?.message === "string" && (
        <motion.p
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl border border-[var(--w-danger)]/40 bg-[var(--w-danger)]/10 px-3 py-2 text-xs text-[var(--w-danger)] animate__animated animate__headShake"
        >
          {errors[fieldName]?.message}
        </motion.p>
      )}
    </>
  );
}

interface SelectFieldProp {
  label: string;
  fieldName: keyof FormField;
  placeholder?: string;
  icon?: React.ReactNode;
}

function SelectField({ label, fieldName, placeholder, icon }: SelectFieldProp) {
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext();

  const options = {};

  return (
    <>
      <label className="flex flex-col mt-1.5 gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)] flex justify-between mt-1.5">
          {label}
          <span className="text-[var(--w-brand)]">{getCurrencySymbol(watch("currency"))}</span>
        </span>
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--w-muted)]">
              {icon}
            </span>
          )}

          <Controller
            control={control}
            name="currency"
            render={({ field }) => (
              <>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger
                    className={`w-full rounded-xl border border-[var(--w-border)] bg-[var(--w-input)] py-3 ${icon ? "pl-11" : "pl-4"} text-base font-medium text-[var(--w-fg)] placeholder:text-[var(--w-muted)]/60! transition focus:border-[var(--w-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--w-brand-ring)]`}
                  >
                    <SelectValue
                      placeholder={placeholder}
                      className="*:placeholder:text-[var(--w-muted)]/60!"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {CURRENCIES.map((c) => (
                        <SelectItem
                          value={c.code}
                          key={c.code}
                          className={
                            c.code === watch("currency")
                              ? "!bg-slate-600 z-10 text-white"
                              : "hover:bg-slate-600/30! z-10"
                          }
                        >
                          {c.code}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </>
            )}
          />
        </div>
      </label>
      {typeof errors[fieldName]?.message === "string" && (
        <motion.p
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl border border-[var(--w-danger)]/40 bg-[var(--w-danger)]/10 px-3 py-2 text-xs text-[var(--w-danger)] animate__animated animate__headShake"
        >
          {errors[fieldName]?.message}
        </motion.p>
      )}
    </>
  );
}
