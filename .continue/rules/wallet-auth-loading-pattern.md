---
description: Centralized Firebase auth + Firestore user doc loading pattern for
  the wallet section. Uses onAuthStateChanged once, fetches users/{uid}, writes
  to useAuthStore via setUser, and drives the WalletLoader.
alwaysApply: true
---

Use the centralized useAuthListener() (mounted once in \_\_root) + useAuthStore for all wallet auth state.

- Never call onAuthStateChanged in multiple places.
- After login/register, call setUser(user) from the store (not setState).
- For initial wallet route protection, block on (loading || !isAuthHydrated) and render <WalletLoader fullscreen>.
- For subsequent data fetches inside the wallet, you can also use <WalletLoader isLoading={query.isLoading} partial />.

The single source of truth for "is the user fully loaded from Firestore" is isAuthHydrated in the auth store.
