import { Currency } from "@/types";

export const CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "MXN", name: "Mexican Peso", symbol: "Mex$" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
];

export function getCurrencySymbol(code: string | undefined | null): string {
  if (!code) return "$";
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code;
}

export function formatMoney(
  amount: number,
  code: string | undefined | null,
  opts?: { withSymbol?: boolean; decimals?: number },
): string {
  const decimals = opts?.decimals ?? 2;
  const symbol = opts?.withSymbol === false ? "" : getCurrencySymbol(code);
  const value = (amount ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return symbol ? `${symbol}${value}` : value;
}

/** Parse a money string ("1,234.56") to a number. */
export function parseMoney(input: string): number {
  if (!input) return 0;
  const cleaned = input.replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return isNaN(n) ? 0 : n;
}

/** Format raw user input into a thousands-separated string while typing. */
export function formatMoneyInput(input: string): string {
  if (!input) return "";
  // Allow only digits and at most one dot
  const cleaned = input.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  const intPart = parts[0].replace(/^0+(?=\d)/, "") || "0";
  const withCommas = Number(intPart).toLocaleString();
  if (parts.length === 1) return withCommas;
  const decPart = parts.slice(1).join("").slice(0, 2);
  console.log({
    withCommas,
    decPart,
  });
  return `${withCommas}.${decPart}`;
}
