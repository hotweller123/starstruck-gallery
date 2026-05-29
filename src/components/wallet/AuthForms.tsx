import { useState, type FormEvent } from "react";
import { useWallet } from "@/lib/wallet";

type Mode = "signin" | "register";

export function AuthForms() {
  const [mode, setMode] = useState<Mode>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { register, signIn } = useWallet();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const res =
      mode === "register"
        ? register({ name, email, password })
        : signIn({ email, password });
    if (!res.ok) setError(res.error ?? "Something went wrong.");
  };

  return (
    <div className="relative">
      <div
        className="absolute -inset-1 rounded-3xl opacity-50 blur-2xl"
        style={{ background: "var(--w-grad-brand)" }}
        aria-hidden
      />
      <div className="relative rounded-3xl border border-[var(--w-border)] bg-[var(--w-surface)] p-7 shadow-2xl">
        <div className="flex gap-1 rounded-full bg-[var(--w-input)] p-1">
          {(["register", "signin"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 rounded-full px-3 py-2.5 text-xs font-semibold transition ${
                mode === m
                  ? "text-white shadow"
                  : "text-[var(--w-muted)] hover:text-[var(--w-fg)]"
              }`}
              style={mode === m ? { background: "var(--w-grad-brand)" } : undefined}
            >
              {m === "register" ? "Create wallet" : "Sign in"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          {mode === "register" && (
            <Field label="Full name" value={name} onChange={setName} placeholder="Eloise Marchand" required />
          )}
          <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@aethelred.gallery" required />
          <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 6 characters" required />

          {error && (
            <p className="rounded-xl border border-[var(--w-danger)]/40 bg-[var(--w-danger)]/10 px-3 py-2 text-xs text-[var(--w-danger)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 rounded-full px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02]"
            style={{ background: "var(--w-grad-brand)" }}
          >
            {mode === "register" ? "Create my wallet" : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--w-muted)]">
          Demo wallet · data stored locally
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--w-muted)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="rounded-xl border border-[var(--w-border)] bg-[var(--w-input)] px-4 py-3 text-sm font-medium text-[var(--w-fg)] placeholder:text-[var(--w-muted)]/60 focus:border-[var(--w-brand-2)] focus:outline-none focus:ring-2 focus:ring-[var(--w-brand-2)]/30"
      />
    </label>
  );
}
