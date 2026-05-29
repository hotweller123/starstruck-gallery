import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import { WalletThemeProvider } from "@/lib/wallet-theme";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <MegaNav />
      <div className="flex flex-1 items-center justify-center px-6 py-32">
        <div className="max-w-md text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-detail">
            404
          </p>
          <h1 className="mt-6 font-display text-6xl italic text-ink">
            Lost in the gallery
          </h1>
          <p className="mt-6 text-detail">
            The page you're looking for doesn't exist, or has been moved to
            another wall.
          </p>
          <Link
            to="/"
            className="mt-10 inline-block border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas"
          >
            Return home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-4xl italic text-ink">
          This page didn't load
        </h1>
        <p className="mt-4 text-sm text-detail">
          Something went wrong on our end.
        </p>
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
        content:
          "Quiet, considered works from a small circle of contemporary artists.",
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

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isWallet = pathname === "/wallet" || pathname.startsWith("/wallet/");

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <WalletProvider>
          <WalletThemeProvider>
            {isWallet ? (
              <WalletRoot>
                <Outlet />
              </WalletRoot>
            ) : (
              <div className="flex min-h-screen flex-col bg-canvas">
                <MegaNav />
                <main className="flex-1">
                  <Outlet />
                </main>
                <Footer />
              </div>
            )}
          </WalletThemeProvider>
        </WalletProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

function WalletRoot({ children }: { children: React.ReactNode }) {
  const { useWalletTheme } = require("@/lib/wallet-theme") as typeof import("@/lib/wallet-theme");
  const { mode } = useWalletTheme();
  return (
    <div className={`wallet-theme ${mode === "light" ? "wallet-light" : ""} flex min-h-screen flex-col`}>
      {children}
    </div>
  );
}
