import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Mode = "dark" | "light";
const Ctx = createContext<{ mode: Mode; toggle: () => void; setMode: (m: Mode) => void } | null>(
  null,
);
const KEY = "aethelred.wallet.theme";

export function WalletThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("dark");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY) as Mode | null;
      if (stored === "light" || stored === "dark") setMode(stored);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  return (
    <Ctx.Provider
      value={{
        mode,
        setMode,
        toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useWalletTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWalletTheme must be inside WalletThemeProvider");
  return ctx;
}
