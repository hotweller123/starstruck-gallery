---
alwaysApply: true
---

Use <AdminLoader fullscreen variant="page" /> for initial dashboard/route readiness (when store data is hydrating or currentUser/auctions etc are not yet available).

Use <AdminLoader fullscreen variant="action" /> for blocking async operations triggered by buttons (approve, delete, close auction, update, etc). Set a dedicated actionLoading state before the async work and clear in finally.

Never use WalletLoader inside admin routes. Always prefer AdminLoader for consistent admin aesthetic.

For partial / non-blocking loading inside cards, use AdminLoader partial or AdminSpinner.