import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";
import { useWallet } from "@/lib/wallet";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
type Mode = "signin" | "register";
export interface FormField {
  fullName: string;
  email: string;
  password: string;
}

export function AuthForms() {
  const [mode, setMode] = useState<Mode>("register");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const { register, signIn } = useWallet();

  const formControl = useForm<FormField>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    // const res =
    //   mode === "register" ? register({ fullName, email, password }) : signIn({ email, password });
    // if (!res.ok) setError(res.error ?? "Something went wrong.");
  };

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
            <form
              onSubmit={formControl.handleSubmit((data) => {
                console.log(data);
              })}
              className="mt-6 flex flex-col gap-4"
            >
              {mode === "register" && (
                <Field
                  name="fullName"
                  label="Full name"
                  placeholder="Eloise Marchand"
                  icon={<User className="size-4" />}
                />
              )}
              <Field
                name="email"
                label="Email"
                type="email"
                placeholder="you@aethelred.gallery"
                icon={<Mail className="size-4" />}
              />
              <div>
                <Field
                  name="password"
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
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-xl border border-[var(--w-danger)]/40 bg-[var(--w-danger)]/10 px-3 py-2 text-xs text-[var(--w-danger)] animate__animated animate__headShake"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                whileTap={{ scale: 0.98, opacity: 0.8 }}
                whileHover={{ y: -1 }}
                type="submit"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-extrabold uppercase tracking-[0.16em] shadow-lg"
                style={{ background: "var(--w-brand)", color: "var(--w-brand-contrast)" }}
              >
                <Sparkles className="size-4" />
                {mode === "register" ? "Create my wallet" : "Sign in"}
              </motion.button>
            </form>
          </FormProvider>

          <p className="mt-5 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
            Demo wallet · data stored locally
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  icon,
  suffix,
}: {
  label: string;
  name: keyof FormField;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const options = {
    required: {
      message: `${name} is required`,
      value: true,
    },
  };

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
            {...register(name, { ...options })}
            placeholder={placeholder}
            className={`w-full rounded-xl border border-[var(--w-border)] bg-[var(--w-input)] py-3 ${icon ? "pl-11" : "pl-4"} ${suffix ? "pr-11" : "pr-4"} text-base font-medium text-[var(--w-fg)] placeholder:text-[var(--w-muted)]/60 transition focus:border-[var(--w-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--w-brand-ring)]`}
          />
          {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</span>}
        </div>
      </label>
      {typeof errors[name]?.message === "string" && (
        <p className="text-red-500 capitalize">{errors[name]?.message}</p>
      )}
    </>
  );
}
