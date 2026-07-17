import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { MegaNav } from "@/components/site/MegaNav";
import { Footer } from "@/components/site/Footer";
import { StoreProvider } from "@/lib/store";
import { WalletProvider } from "@/lib/wallet";
import ArtWorkProvider from "@/lib/useMetArtworksStore";
import { ToastProvider } from "@/components/ui/toast";
import { FirebaseProvider } from "@/providers/FirebaseProvider";
import { AnimatePresence, motion } from "motion/react";
import { useAuthListener } from "@/hooks/useAuthListener";
import { useAuthStore } from "@/store/zustand";
import { useShallow } from "zustand/shallow";
import { WalletLoader } from "@/components/wallet/WalletLoader";
import { WalletError } from "@/components/wallet/WalletError";
import type { WalletAccount } from "@/types/walletTypes";
// IMPORTANT: Do NOT import or call React Query hooks directly in this file.
// All useQuery / useFirebaseQueryCollection calls must happen inside components rendered *after* <QueryClientProvider>.

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <MegaNav /> */}
      <div className="flex flex-1 items-center justify-center px-6 py-32">
        <div className="max-w-md text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-detail">404</p>
          <h1 className="mt-6 font-display text-6xl italic text-ink">Lost in the gallery</h1>
          <p className="mt-6 text-detail">
            The page you're looking for doesn't exist, or has been moved to another wall.
          </p>
          <Link
            to="/"
            className="mt-10 inline-block border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas"
          >
            Return home
          </Link>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isWallet = pathname === "/wallet" || pathname.startsWith("/wallet/");

  // Use the beautiful wallet-themed error page inside the wallet section
  if (isWallet) {
    return <WalletError error={error} reset={reset} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-4xl italic text-ink">This page didn't load</h1>
        <p className="mt-4 text-sm text-detail">Something went wrong on our end.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="border border-ink bg-ink px-5 py-2 text-[11px] uppercase tracking-[0.22em] text-canvas"
          >
            Try again
          </button>
          <a
            href="/"
            className="border border-ink px-5 py-2 text-[11px] uppercase tracking-[0.22em]"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Aethelred — A Curated Exhibition of Contemporary Artworks" },
      {
        name: "description",
        content:
          "A curated digital exhibition of paintings, sculpture, photography and digital works from a small circle of contemporary artists.",
      },
      { name: "author", content: "Aethelred Gallery" },
      {
        property: "og:title",
        content: "Aethelred — A Curated Exhibition",
      },
      {
        property: "og:description",
        content: "Quiet, considered works from a small circle of contemporary artists.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const userKey = "authStore";

export const getLocalUserData = () => {
  try {
    if (typeof document === "undefined") return undefined;
    const raw = localStorage.getItem(userKey);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : undefined;
  } catch {
    return undefined;
  }
};

export const saveUserDataLocally = (data: WalletAccount) => {
  try {
    localStorage.setItem(userKey, JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isWallet = pathname === "/wallet" || pathname.startsWith("/wallet/");
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  // Initialize the single source-of-truth Firebase auth listener.
  // It uses onAuthStateChanged + getDoc(db, "users", uid) and writes to useAuthStore.
  useAuthListener();

  const { loading, isAuthHydrated } = useAuthStore(
    useShallow((s) => ({
      loading: s.loading,
      isAuthHydrated: s.isAuthHydrated,
    })),
  );

  // Block wallet subtree until we have resolved the user from Auth + Firestore.
  const showWalletLoader = isWallet && (loading || !isAuthHydrated);

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <FirebaseProvider>
          <WalletProvider>
            <ToastProvider>
              {/* FirebaseProvider must wrap everything that uses useFirebaseQueryCollection */}
              {isAdmin ? (
                <div className="admin-theme min-h-screen">
                  <Outlet />
                </div>
              ) : isWallet ? (
                <div className="wallet-theme flex min-h-screen flex-col">
                  {showWalletLoader ? (
                    <WalletLoader fullscreen message="Loading your wallet" showSkeleton />
                  ) : (
                    <Outlet />
                  )}
                </div>
              ) : (
                <ArtWorkProvider>
                  <div className="flex min-h-screen flex-col bg-canvas">
                    <MegaNav />
                    <main className="flex-1">
                      <AnimatePresence mode="wait" key={pathname}>
                        <motion.div
                          key={pathname}
                          initial={{ opacity: 0, y: 12, filter: "blur(100px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: 0, filter: "blur(2000px)" }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <Outlet />
                        </motion.div>
                      </AnimatePresence>
                    </main>
                    <Footer />
                  </div>
                </ArtWorkProvider>
              )}
            </ToastProvider>
          </WalletProvider>
        </FirebaseProvider>
      </StoreProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
