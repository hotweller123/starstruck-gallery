---
alwaysApply: true
---

Use the centralized Fields component with format="money" for currency inputs.

- Add format: "money" to InputField definitions (not type="number").
- Fields.tsx will:
  - Render as type="text"
  - On focus: show comma-separated number (no symbol) via formatMoneyInput
  - On blur: show full formatted value with currency symbol via formatMoney (from user's currency in auth store)
  - Always store a number in react-hook-form state
- For plain numbers (year, count, etc.): use attrs: { type: "number" } without format="money"
- For text: no special props needed

Never manually format money values inside individual routes. Keep formatting logic in Fields.tsx + utils.