// import { Result, State, TxType, WalletAccount, WalletTx } from "@/types";
// import { Timestamp } from "firebase/firestore";
// import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// interface Wallet extends State {
//   currentAccount: WalletAccount | null;
//   signedIn: boolean;
//   register: (input: { fullName: string; email: string; password: string }) => Result;
//   signIn: (input: { email: string; password: string }) => Result;
//   signOut: () => void;
//   deposit: (amount: number, note?: string) => Result;
//   withdraw: (amount: number, note?: string) => Result;
//   transfer: (toToken: string, amount: number, note?: string) => Result;
//   // Used by the site (requires a connected wallet account, debits its balance)
//   debitAccount: (accountId: string, amount: number, type: TxType, note?: string) => Result;
//   creditAccount: (accountId: string, amount: number, type: TxType, note?: string) => Result;
//   getAccount: (id: string | null) => WalletAccount | null;
//   getAccountByToken: (token: string) => WalletAccount | null;
//   txsFor: (accountId: string) => WalletTx[];
//   regenerateToken: () => Result;
// }

// const Ctx = createContext<Wallet | null>(null);
// const KEY = "aethelred.wallet.v1";
// const empty: State = { accounts: [], currentAccountId: null, transactions: [] };

// function load(): State {
//   if (typeof window === "undefined") return empty;
//   try {
//     const raw = localStorage.getItem(KEY);
//     if (!raw) return empty;
//     return { ...empty, ...JSON.parse(raw) };
//   } catch {
//     return empty;
//   }
// }

// // Demo-only hash. Clearly labelled in UI as not production-grade.
// function hash(s: string): string {
//   let h = 5381;
//   for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
//   return (h >>> 0).toString(36) + s.length.toString(36);
// }

// export function makeToken(): string {
//   const part = () =>
//     Math.random()
//       .toString(36)
//       .replace(/[^a-z0-9]/g, "")
//       .slice(0, 4)
//       .toUpperCase()
//       .padEnd(4, "X");
//   return `AET-${part()}-${part()}-${part()}`;
// }

// function uid(): string {
//   return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
// }

// export function WalletProvider({ children }: { children: ReactNode }) {
//   const [state, setState] = useState<State>(empty);
//   const [hydrated, setHydrated] = useState(false);

//   useEffect(() => {
//     setState(load());
//     setHydrated(true);
//   }, []);

//   useEffect(() => {
//     if (!hydrated) return;
//     try {
//       localStorage.setItem(KEY, JSON.stringify(state));
//     } catch {
//       /* ignore */
//     }
//   }, [state, hydrated]);

//   const currentAccount = state.accounts.find((a) => a.id === state.currentAccountId) ?? null;

//   const pushTx = ({
//     s,
//     userID,
//     type,
//     amount,
//     balanceAfter,
//     note,
//     counterparty,
//   }: {
//     s: State;
//     userID: string;
//     type: TxType;
//     amount: number;
//     balanceAfter: number;
//     note?: string;
//     counterparty?: string;
//   }): WalletTx => ({
//     id: uid(),
//     userID,
//     type,
//     amount,
//     balanceAfter,
//     note,
//     counterparty,
//     createdAt: new Date().toISOString(),
//   });

//   const value: Wallet = {
//     ...state,
//     currentAccount,
//     signedIn: !!currentAccount,

//     register: ({ fullName, email, password }) => {
//       const e = email.trim().toLowerCase();
//       if (!fullName.trim() || !e || password.length < 6)
//         return { ok: false, error: "Fill all fields. Password ≥ 6 chars." };
//       if (state.accounts.some((a) => a.email === e))
//         return { ok: false, error: "An account with that email exists." };
//       const acc: WalletAccount = {
//         id: uid(),
//         userID: "",
//         blocked: false,
//         role: "user",
//         status: "active",
//         currency: "USD",
//         category: "users",
//         symbol: "$",
//         email: e,
//         fullName: fullName.trim(),
//         password: password,
//         token: makeToken(),
//         wallet: {
//           balance: 0,
//           bidBalance: 0,
//         },
//         createdAt: new Date().toISOString(),
//       };
//       setState((s) => ({
//         ...s,
//         accounts: [...s.accounts, acc],
//         currentAccountId: acc.id,
//       }));
//       return { ok: true };
//     },

//     signIn: ({ email, password }) => {
//       const e = email.trim().toLowerCase();
//       const acc = state.accounts.find((a) => a.email === e);
//       if (!acc || acc.password !== password)
//         return { ok: false, error: "Invalid email or password." };
//       setState((s) => ({ ...s, currentAccountId: acc.id }));
//       return { ok: true };
//     },

//     signOut: () => setState((s) => ({ ...s, currentAccountId: null })),

//     deposit: (amount, note) => {
//       if (!currentAccount) return { ok: false, error: "Sign in first." };
//       if (amount <= 0) return { ok: false, error: "Amount must be positive." };
//       setState((s) => {
//         const acc = s.accounts.find((a) => a.id === currentAccount.id);
//         if (!acc) return s;
//         const newBal = acc.wallet.balance + amount;
//         return {
//           ...s,
//           accounts: s.accounts.map((a) =>
//             a.id === acc.id ? { ...a, wallet: { ...a.wallet, balance: newBal } } : a,
//           ),
//           transactions: [
//             pushTx({
//               s,
//               userID: acc.id,
//               type: "deposit",
//               amount,
//               balanceAfter: newBal,
//               note: note ?? "Card deposit",
//               counterparty: undefined,
//             }),
//             ...s.transactions,
//           ],
//         };
//       });
//       return { ok: true };
//     },

//     withdraw: (amount, note) => {
//       if (!currentAccount) return { ok: false, error: "Sign in first." };
//       if (amount <= 0) return { ok: false, error: "Amount must be positive." };
//       if (currentAccount.wallet.balance < amount)
//         return { ok: false, error: "Insufficient funds." };
//       setState((s) => {
//         const acc = s.accounts.find((a) => a.id === currentAccount.id);
//         if (!acc) return s;
//         const newBal = acc.wallet.balance - amount;
//         return {
//           ...s,
//           accounts: s.accounts.map((a) =>
//             a.id === acc.id ? { ...a, wallet: { ...a.wallet, balance: newBal } } : a,
//           ),
//           transactions: [
//             pushTx({
//               s,
//               userID: acc.id,
//               type: "withdraw",
//               amount,
//               balanceAfter: newBal,
//               note: note ?? "Bank withdrawal",
//             }),
//             ...s.transactions,
//           ],
//         };
//       });
//       return { ok: true };
//     },

//     transfer: (toToken, amount, note) => {
//       if (!currentAccount) return { ok: false, error: "Sign in first." };
//       if (amount <= 0) return { ok: false, error: "Amount must be positive." };
//       const to = state.accounts.find((a) => a.token === toToken.trim().toUpperCase());
//       if (!to) return { ok: false, error: "Recipient token not found." };
//       if (to.id === currentAccount.id) return { ok: false, error: "Can't transfer to yourself." };
//       if (currentAccount.wallet.balance < amount)
//         return { ok: false, error: "Insufficient funds." };
//       setState((s) => {
//         const from = s.accounts.find((a) => a.id === currentAccount.id);
//         const recipient = s.accounts.find((a) => a.id === to.id);
//         if (!from || !recipient) return s;
//         const fromBal = from.wallet.balance - amount;
//         const toBal = recipient.wallet.balance + amount;
//         return {
//           ...s,
//           accounts: s.accounts.map((a) =>
//             a.id === from.id
//               ? { ...a, wallet: { ...a.wallet, balance: fromBal } }
//               : a.id === recipient.id
//                 ? { ...a, wallet: { ...a.wallet, balance: toBal } }
//                 : a,
//           ),
//           transactions: [
//             pushTx({
//               s,
//               userID: from.id,
//               type: "transfer_out",
//               amount,
//               balanceAfter: fromBal,
//               note,
//               counterparty: recipient.fullName,
//             }),
//             pushTx({
//               s,
//               userID: recipient.id,
//               type: "transfer_in",
//               amount,
//               balanceAfter: toBal,
//               note,
//               counterparty: from.fullName,
//             }),
//             ...s.transactions,
//           ],
//         };
//       });
//       return { ok: true };
//     },

//     debitAccount: (accountId, amount, type, note) => {
//       const acc = state.accounts.find((a) => a.id === accountId);
//       if (!acc) return { ok: false, error: "Wallet not found." };
//       if (acc.wallet.balance < amount) return { ok: false, error: "Insufficient wallet balance." };
//       setState((s) => {
//         const a = s.accounts.find((x) => x.id === accountId);
//         if (!a) return s;
//         const newBal = a.wallet.balance - amount;
//         return {
//           ...s,
//           accounts: s.accounts.map((x) =>
//             x.id === a.id ? { ...x, wallet: { ...x.wallet, balance: newBal } } : x,
//           ),
//           transactions: [
//             pushTx({
//               s,
//               userID: a.id,
//               type,
//               amount,
//               balanceAfter: newBal,
//               note,
//             }),
//             ...s.transactions,
//           ],
//         };
//       });
//       return { ok: true };
//     },

//     creditAccount: (accountId, amount, type, note) => {
//       const acc = state.accounts.find((a) => a.id === accountId);
//       if (!acc) return { ok: false, error: "Wallet not found." };
//       setState((s) => {
//         const a = s.accounts.find((x) => x.id === accountId);
//         if (!a) return s;
//         const newBal = a.wallet.balance + amount;
//         return {
//           ...s,
//           accounts: s.accounts.map((x) =>
//             x.id === a.id ? { ...x, wallet: { ...x.wallet, balance: newBal } } : x,
//           ),
//           transactions: [
//             pushTx({
//               s,
//               userID: a.id,
//               type,
//               amount,
//               balanceAfter: newBal,
//               note,
//             }),
//             ...s.transactions,
//           ],
//         };
//       });
//       return { ok: true };
//     },

//     getAccount: (id) => (id ? (state.accounts.find((a) => a.id === id) ?? null) : null),
//     getAccountByToken: (token) =>
//       state.accounts.find((a) => a.token === token.trim().toUpperCase()) ?? null,
//     txsFor: (accountId) => state.transactions.filter((t) => t.userID === accountId),

//     regenerateToken: () => {
//       if (!currentAccount) return { ok: false, error: "Sign in first." };
//       setState((s) => ({
//         ...s,
//         accounts: s.accounts.map((a) =>
//           a.id === currentAccount.id ? { ...a, token: makeToken() } : a,
//         ),
//       }));
//       return { ok: true };
//     },
//   };

//   return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
// }

// export function useWallet() {
//   const ctx = useContext(Ctx);
//   if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
//   return ctx;
// }

// export function formatMoney(n: number) {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     maximumFractionDigits: 0,
//   }).format(n);
// }

// export const TX_LABEL: Record<TxType, string> = {
//   deposit: "Deposit",
//   withdraw: "Withdrawal",
//   transfer_out: "Sent",
//   transfer_in: "Received",
//   purchase: "Purchase",
//   bid_hold: "Bid placed",
//   bid_release: "Bid released",
//   sale: "Sale",
// };

// export function txSign(type: TxType): 1 | -1 {
//   return type === "deposit" || type === "transfer_in" || type === "bid_release" || type === "sale"
//     ? 1
//     : -1;
// }

// todo
// <Field label="Title">
// <input
//   required
//   value={form.title}
//   onChange={(e) => setForm({ ...form, title: e.target.value })}
//   className={inputCls}
// />
// </Field>
// <Field label="Artist">
// <input
//   required
//   value={form.artist}
//   onChange={(e) => setForm({ ...form, artist: e.target.value })}
//   className={inputCls}
// />
// </Field>
// <Field label="Medium">
// <input
//   value={form.medium}
//   onChange={(e) => setForm({ ...form, medium: e.target.value })}
//   placeholder="e.g. Oil on linen"
//   className={inputCls}
// />
// </Field>
// <Field label="Dimensions">
// <input
//   value={form.dimensions}
//   onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
//   placeholder="e.g. 80 × 60 cm"
//   className={inputCls}
// />
// </Field>
// <Field label="Year">
// <input
//   type="number"
//   value={form.year}
//   onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
//   className={inputCls}
// />
// </Field>
// <Field label="Price (USD)">
// <input
//   type="number"
//   required
//   min={0}
//   value={form.price || ""}
//   onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
//   className={inputCls}
// />
// </Field>
// <Field label="Category" className="md:col-span-2">
// <Select
//   value={form.category}
//   onValueChange={(e) => setForm((f) => ({ ...f, category: e }))}
// >
//   <SelectTrigger
//     className={`focus:border-0 focus:border-ink transition-all shadow-none ${inputCls}`}
//   >
//     <SelectValue />
//   </SelectTrigger>
//   <SelectContent>
//     <SelectGroup>
//       {categories.map((c) => (
//         <SelectItem value={c} key={c}>
//           {c}
//         </SelectItem>
//       ))}
//     </SelectGroup>
//   </SelectContent>
// </Select>
// </Field>
// <Field label="Description" className="md:col-span-2">
// <textarea
//   rows={4}
//   value={form.description}
//   onChange={(e) => setForm({ ...form, description: e.target.value })}
//   placeholder="A few sentences about the work, its materials, and its making."
//   className={inputCls}
// />
// </Field>

{
  /* Balance chart */
}
{
  /* <BentoCard
          className="lg:col-span-8"
          eyebrow="Last 14 days"
          title="Wallet balance trend"
          delay={0.1}
          action={
            <button className="inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-muted)] hover:text-[var(--a-fg)]">
              <Download className="size-3" /> Export
            </button>
          }
        >
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="u-bal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--a-accent)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--a-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--a-border)" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="var(--a-faint)"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--a-faint)"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={48}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--a-bg-2)",
                    border: "1px solid var(--a-border-hi)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "var(--a-muted)" }}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="var(--a-accent)"
                  strokeWidth={2}
                  fill="url(#u-bal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </BentoCard> */
}

{
  /* Security & account */
}
{
  /* <BentoCard
          className="lg:col-span-4"
          eyebrow="Security"
          title="Account integrity"
          delay={0.14}
        >
          <ul className="space-y-3 text-xs">
            <SecRow icon={ShieldCheck} label="KYC" value={wallet.kycLevel} good />
            <SecRow
              icon={KeyRound}
              label="2FA"
              value={wallet.twoFactor ? "Enabled" : "Disabled"}
              good={wallet.twoFactor}
            />
            <SecRow icon={Smartphone} label="Active devices" value={`${wallet.devices} trusted`} />
            <SecRow icon={WalletIcon} label="Lifetime inflow" value={fmtMoney(wallet.lifetimeIn)} />
            <SecRow
              icon={RefreshCw}
              label="Lifetime outflow"
              value={fmtMoney(wallet.lifetimeOut)}
            />
          </ul>
        </BentoCard> */
}

{
  /* <WalletStat label="In escrow" value={fmtMoney(wallet.inEscrow)} />
        <WalletStat label="Lifetime fees" value={fmtMoney(wallet.feesPaid)} /> */
}
{
  /* Favourites */
}
{
  /* <BentoCard
          className="lg:col-span-4"
          eyebrow="Exhibition · Watchlist"
          title="Favourited works"
          delay={0.3}
          action={
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--a-accent-2)]">
              <Heart className="size-3" /> {favourites.length}
            </span>
          }
        >
          <ul className="grid grid-cols-2 gap-2">
            {favRows.slice(0, 6).map((f) => (
              <li key={f.slug}>
                <button
                  onClick={() => setTarget({ kind: "fav", row: f })}
                  className="block w-full overflow-hidden rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] text-left transition hover:border-[var(--a-border-hi)]"
                >
                  <img src={f.image} alt={f.title} className="aspect-square w-full object-cover" />
                  <div className="p-2">
                    <p className="truncate text-[10px] font-semibold text-[var(--a-fg)]">
                      {f.title}
                    </p>
                    <p className="a-mono text-[10px] text-[var(--a-accent)]">{fmtMoney(f.price)}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </BentoCard> */
}

{
  /* Admin notes */
}
{
  /* <BentoCard
          className="lg:col-span-12"
          eyebrow="Internal"
          title="Admin notes"
          delay={0.34}
          action={
            <button
              onClick={() => {
                const id = `n_${Date.now().toString(36)}`;

                const userNotes: UserNote = {
                  id,
                  at: new Date().toISOString(),
                  author: "",
                  body: "",
                };

                setTarget({ kind: "note", row: userNotes });
              }}
              className="inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]"
            >
              <FileText className="size-3" /> Add note
            </button>
          }
        >
          <ul className="space-y-2.5">
            {notes.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => setTarget({ kind: "note", row: n })}
                  className="flex w-full items-start gap-3 rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] p-3 text-left transition hover:border-[var(--a-border-hi)]"
                >
                  <span className="grid size-8 place-items-center rounded bg-[var(--a-accent-2-soft)] text-[10px] font-bold text-[var(--a-accent-2)]">
                    {n.author
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-[var(--a-fg)]">{n.author}</p>
                      <p className="text-[10px] text-[var(--a-faint)]">{fmtDateTime(n.at)}</p>
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--a-fg-2)]">
                      {n.body || "(empty — click to edit)"}
                    </p>
                  </div>
                  <span className="grid size-7 place-items-center rounded text-[var(--a-muted)] hover:bg-[var(--a-surface-2)] hover:text-[var(--a-fg)]">
                    <MoreHorizontal className="size-3.5" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </BentoCard> */
}

{
  /* {target?.kind === "order" && (
        <RecordSheet<UserOrder>
          open
          onOpenChange={(o) => !o && close()}
          eyebrow="Order"
          title={target.row.artworkTitle}
          subtitle={`Order ${target.row.id}`}
          record={target.row}
          fields={orderFields}
          extra={
            <div>
              <p className="a-eyebrow mb-2">Artwork</p>
              <img
                src={target.row.image}
                alt={target.row.artworkTitle}
                className="w-full rounded-md border border-[var(--a-border)] object-cover"
              />
            </div>
          }
          onSave={(patch) => {
            setOrders((prev) => prev.map((o) => (o.id === target.row.id ? { ...o, ...patch } : o)));
            close();
          }}
          operations={[
            {
              id: "ship",
              label: "Mark shipped",
              icon: Truck,
              tone: "primary",
              onRun: () => {
                setOrders((prev) =>
                  prev.map((o) => (o.id === target.row.id ? { ...o, status: "shipped" } : o)),
                );
                close();
              },
            },
            {
              id: "deliver",
              label: "Mark delivered",
              icon: CheckCircle2,
              tone: "success",
              onRun: () => {
                setOrders((prev) =>
                  prev.map((o) => (o.id === target.row.id ? { ...o, status: "delivered" } : o)),
                );
                close();
              },
            },
            {
              id: "refund",
              label: "Refund",
              icon: RotateCcw,
              tone: "danger",
              confirm: "Refund this order?",
              onRun: () => {
                setOrders((prev) =>
                  prev.map((o) => (o.id === target.row.id ? { ...o, status: "refunded" } : o)),
                );
                close();
              },
            },
          ]}
        />
      )} */
}

{
  /* Orders */
}
{
  /* <BentoCard
          className="lg:col-span-5"
          eyebrow="Exhibition · Purchases"
          title="Orders"
          delay={0.22}
          action={
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--a-accent-2)]">
              <Package className="size-3" /> {orders.length} total
            </span>
          }
        >
          <ul className="space-y-2.5">
            {orders.map((o) => (
              <li key={o.id}>
                <button
                  onClick={() => setTarget({ kind: "order", row: o })}
                  className="flex w-full items-center gap-3 rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] p-2.5 text-left transition hover:border-[var(--a-border-hi)] hover:bg-[var(--a-surface)]"
                >
                  <img
                    src={o.image}
                    alt={o.artworkTitle}
                    className="size-12 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-[var(--a-fg)]">
                      {o.artworkTitle}
                    </p>
                    <p className="a-mono text-[10px] text-[var(--a-muted)]">
                      {o.id} · {fmtDateTime(o.at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="a-mono text-xs font-bold text-[var(--a-fg)]">
                      {fmtMoney(o.amount)}
                    </p>
                    <div className="mt-1">
                      <StatusChip value={o.status} />
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </BentoCard> */
}

{
  /* {target?.kind === "fav" && (
        <RecordSheet
          open
          onOpenChange={(o) => !o && close()}
          eyebrow="Watchlist"
          title={target.row.title}
          subtitle={target.row.artist}
          record={target.row}
          fields={favFields}
          extra={
            <div>
              <p className="a-eyebrow mb-2">Preview</p>
              <img
                src={target.row.image}
                alt={target.row.title}
                className="w-full rounded-md border border-[var(--a-border)] object-cover"
              />
            </div>
          }
          onSave={(patch) => {
            setFavourites((prev) =>
              prev.map((f) => (f.slug === target.row.slug ? { ...f, ...patch } : f)),
            );
            close();
          }}
          operations={[
            {
              id: "remove",
              label: "Remove from watchlist",
              icon: Trash2,
              tone: "danger",
              confirm: "Remove this artwork from the user's watchlist?",
              onRun: () => {
                setFavourites((prev) => prev.filter((f) => f.slug !== target.row.slug));
                close();
              },
            },
          ]}
        />
      )} */
}

{
  /* {target?.kind === "note" && (
        <RecordSheet<UserNote>
          open
          onOpenChange={(o) => !o && close()}
          eyebrow="Admin note"
          title={target.row.author}
          subtitle={fmtDateTime(target.row.at)}
          record={target.row}
          fields={noteFields}
          onSave={(patch) => {
            setNotes((prev) => prev.map((n) => (n.id === target.row.id ? { ...n, ...patch } : n)));
            close();
          }}
          operations={[
            {
              id: "delete",
              label: "Delete note",
              icon: Trash2,
              tone: "danger",
              confirm: "Delete this note?",
              onRun: () => {
                setNotes((prev) => prev.filter((n) => n.id !== target.row.id));
                close();
              },
            },
          ]}
        />
      )} */
}
