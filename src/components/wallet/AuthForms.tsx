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
    <div className="rounded-2xl border border-white/5 bg-[var(--w-surface)] p-7 shadow-2xl shadow-black/40">
      <div className="flex gap-1 rounded-lg bg-black/30 p-1">
        {(["register", "signin"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 rounded-md px-3 py-2 text-[11px] uppercase tracking-[0.22em] transition-colors ${
              mode === m
                ? "bg-[var(--w-accent)] text-black"
                : "text-[var(--w-muted)] hover:text-[var(--w-fg)]"
            }`}
          >
            {m === "register" ? "Create wallet" : "Sign in"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
        {mode === "register" && (
          <Field
            label="Full name"
            value={name}
            onChange={setName}
            placeholder="Eloise Marchand"
            required
          />
        )}
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@aethelred.gallery"
          required
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="At least 6 characters"
          required
        />

        {error && (
          <p className="rounded-md border border-[var(--w-danger)]/40 bg-[var(--w-danger)]/10 px-3 py-2 text-xs text-[var(--w-danger)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-2 rounded-lg bg-[var(--w-accent)] px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-black hover:brightness-110"
        >
          {mode === "register" ? "Create my wallet" : "Sign in"}
        </button>
      </form>

      <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-[var(--w-muted)]">
        Demo wallet · data stored locally in this browser
      </p>
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
      <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--w-muted)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--w-fg)] placeholder:text-[var(--w-muted)]/50 focus:border-[var(--w-accent)] focus:outline-none"
      />
    </label>
  );
}
