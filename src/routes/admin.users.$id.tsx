import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState, useMemo, MouseEvent, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ArrowLeft,
  Mail,
  Calendar,
  MapPin,
  ShieldCheck,
  KeyRound,
  Smartphone,
  Wallet as WalletIcon,
  Gavel,
  Heart,
  Package,
  FileText,
  Ban,
  RefreshCw,
  Download,
  MoreHorizontal,
  ExternalLink,
  CheckCircle2,
  Trash2,
  Crown,
  XCircle,
  Truck,
  RotateCcw,
  NotebookIcon,
  Hammer,
  Check,
  X,
  Pause,
} from "lucide-react";
import { BentoCard, DataTable, StatusChip } from "@/components/admin/primitives";
import { RecordSheet, type FieldDef } from "@/components/admin/RecordSheet";
import {
  getUserActivity,
  fmtMoney,
  fmtDateTime,
  type UserBid,
  type UserOrder,
  type UserFavourite,
  type UserNote,
  type AdminTx,
} from "@/data/admin-mock";
import { useDataStore } from "@/store/zustand";
import { useShallow } from "zustand/shallow";
import { Bid, WalletAccount, WalletTx } from "@/types";
import { AuctionLot, getAuctionBySlug, inHours } from "@/data/auctions";
import { AuctionImageSwiper } from "@/components/site/AuctionImageSwiper";
import { useToast } from "@/lib/useToast";
import useDoc from "@/hooks/useDoc";
import { ToastPosition } from "@/components/ui/toast";
import { doc, getDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/services/firebase";
import { AdminLoader } from "@/components/admin/AdminLoader";

export const Route = createFileRoute("/admin/users/$id")({
  component: UserDetail,
});

type SheetTarget =
  | { kind: "bid"; row: Bid }
  // | { kind: "order"; row: UserOrder }
  | { kind: "tx"; row: WalletTx }
  | { kind: "auction"; row: AuctionLot }
  // | { kind: "fav"; row: UserFavourite & { id: string } }
  // | { kind: "note"; row: UserNote }
  | null;

function UserDetail() {
  const { users, userAuctions, transactions, userBids } = useDataStore(
    useShallow((s) => ({
      users: s.users,
      userAuctions: s.auctions,
      transactions: s.transactions,
      userBids: s.bids,
    })),
  );
  const { id } = useParams({ from: "/admin/users/$id" });
  const currentUser = users.find((u) => u.id == id);

  // Local mutable copies so edits from the sheet reflect immediately.
  const [bids, setBids] = useState<Bid[]>(userBids ?? []);
  // const [orders, setOrders] = useState<UserOrder[]>(currentUser?.orders ?? []);
  const [txs, setTxs] = useState<WalletTx[]>(transactions ?? []);
  const [auctions, setAuctions] = useState<AuctionLot[]>(userAuctions ?? []);
  // const [favourites, setFavourites] = useState<UserFavourite[]>(currentUser?.favourites ?? []);
  // const [notes, setNotes] = useState<UserNote[]>(currentUser?.notes ?? []);
  const [target, setTarget] = useState<SheetTarget>(null);

  // const favRows = useMemo(() => favourites.map((f) => ({ ...f, id: f.slug })), [favourites]);

  const [open, setOpen] = useState(false);

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-[1440px]">
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--a-muted)] hover:text-[var(--a-fg)]"
        >
          <ArrowLeft className="size-3.5" /> Back to users
        </Link>
        <p className="mt-6 text-sm text-[var(--a-muted)]">User not found.</p>
      </div>
    );
  }

  // const { user, wallet, series } = currentUser;
  const initials = currentUser.fullName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
  const close = () => setTarget(null);

  const accFields: FieldDef<WalletAccount>[] = [
    { key: "fullName", label: "Name", span: 2, editable: false },
    { key: "email", label: "Email", editable: false },
    {
      key: "token",
      label: "Token",
      editable: false,
    },
    { key: "userName", label: "User Name/Seller Slug" },

    {
      key: "status",
      label: "Status",
      kind: "select",
      options: ["active", "pending", "suspended"].map((v) => ({ value: v, label: v })),
    },
    { key: "wallet.balance", label: "Wallet balance", kind: "money" },
    { key: "wallet.bidBalance", label: "Wallet Bid Balance", kind: "money" },
    {
      key: "joinedDate",
      label: "Joined",
      editable: false,
      render: (v) => fmtDateTime(v as string),
    },
  ];

  const { toast } = useToast();
  const { updateDocument, addDocToCollection, deleteDocument } = useDoc();

  const errorToast = (error: any, position?: ToastPosition, description?: string, action?: any) => {
    toast({
      title: "Error",
      description: description || error.message,
      action: action ?? undefined,
      variant: "error",
      position,
    });
  };

  const modToast = () => {
    toast({
      title: "Success",
      description: "Changes Made",
      variant: "info",
      duration: 40000,
    });
  };

  const warnToast = () => {
    toast({
      title: "Error",
      description: "Error In Selection",
      variant: "warning",
      duration: 40000,
    });
  };

  const [imagesHover, setImagesHover] = useState<string[]>([]);
  const [uniqueImageID, setUniqueImageID] = useState<string | null>(null);

  const openImages = (
    e: MouseEvent<HTMLDivElement>,
    { id, images }: { id: string; images: string[] },
  ) => {
    if (images.length) setImagesHover(images);
    if (id) {
      setUniqueImageID(id);
    }
  };

  const scheduleClose = () => {
    setUniqueImageID(null);
  };

  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("Processing...");

  // Page readiness loader (when store hasn't hydrated yet)
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (users && users.length > 0) {
      setPageLoading(false);
    }
  }, [users?.length]);

  return (
    <div className="mx-auto max-w-[1440px]">
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--a-muted)] hover:text-[var(--a-fg)]"
      >
        <ArrowLeft className="size-3.5" /> Back to users
      </Link>

      <AdminLoader
        fullscreen
        variant="page"
        isLoading={pageLoading}
        message="Loading user"
        subMessage="Fetching profile & activity"
      />

      <AdminLoader fullscreen variant="action" isLoading={actionLoading} message={actionMessage} />

      {/* Identity card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="a-card-elev mt-4 flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-6"
      >
        <div className="flex items-center gap-4">
          <span
            className="grid size-16 place-items-center rounded-xl text-lg font-extrabold text-[var(--a-accent-ink)] shadow-lg"
            style={{ background: "orange" }}
          >
            {initials}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-[var(--a-fg)]">
                {currentUser.fullName}
              </h1>
              <StatusChip value={currentUser.status} />
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--a-border-hi)] bg-[var(--a-accent-soft)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--a-accent)]">
                <ShieldCheck className="size-3" /> {currentUser.role}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--a-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-3" /> {currentUser.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3" /> Joined {fmtDateTime(currentUser.joinedDate)}
              </span>
              {/* <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3" /> Lisbon, PT
              </span> */}
              <span className="a-mono">{currentUser.token}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* todo: add href link for mail */}
          <button className="inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]">
            <Mail className="size-3.5" /> Message
          </button>
          {/* <button className="inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]">
            <KeyRound className="size-3.5" /> Reset password
          </button> */}

          <button
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]"
            onClick={() => setOpen(true)}
          >
            <CheckCircle2 className="size-3.5" /> View Details
          </button>
        </div>
      </motion.div>

      <RecordSheet<WalletAccount>
        open={open}
        onOpenChange={setOpen}
        fields={accFields}
        record={currentUser}
        title={currentUser.fullName + " Information"}
        subtitle={""}
        eyebrow={fmtMoney(currentUser.wallet.balance)}
        onSave={async (p) => {
          if (!currentUser) {
            warnToast();
            return;
          }

          setActionMessage("Saving user details...");
          setActionLoading(true);

          try {
            await updateDocument({
              collections: "users",
              document: {
                ...currentUser,
                ...p,
              },
            });

            modToast();
          } catch (error) {
            errorToast(error);
          } finally {
            close();
            setActionLoading(false);
          }
        }}
        operations={[
          {
            id: "activate",
            label: "Activate User",
            icon: Check,
            tone: "success",
            onRun: async () => {
              if (!currentUser) {
                warnToast();
                return;
              }

              setActionMessage("Activating user...");
              setActionLoading(true);
              try {
                await updateDocument({
                  collections: "users",
                  document: {
                    ...currentUser,
                    status: "active",
                  },
                });
                modToast();
              } catch (error) {
                errorToast(error);
              } finally {
                close();
                setActionLoading(false);
              }
            },
          },
          {
            id: "suspend",
            label: "Suspend User",
            icon: X,
            tone: "danger",
            onRun: async () => {
              if (!currentUser) {
                warnToast();
                return;
              }

              setActionMessage("Suspending user...");
              setActionLoading(true);
              try {
                await updateDocument({
                  collections: "users",
                  document: {
                    ...currentUser,
                    status: "suspended",
                  },
                });
                modToast();
              } catch (error) {
                errorToast(error);
              } finally {
                close();
                setActionLoading(false);
              }
            },
          },
        ]}
      />

      {/* Wallet KPIs */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <WalletStat label="Balance" value={fmtMoney(currentUser.wallet.balance)} accent />
        <WalletStat label="Bid Balance" value={fmtMoney(currentUser.wallet.bidBalance)} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Bids */}
        <BentoCard
          className="lg:col-span-7"
          eyebrow="Exhibition · Auctions"
          title={`Listed Auctions From ${currentUser.fullName}`}
          delay={0.12}
          action={
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--a-accent)]">
              <Gavel className="size-3" /> {auctions.length} total
            </span>
          }
        >
          <DataTable
            rows={auctions.filter((a) => a.userID == currentUser.userID)}
            onRowClick={(r) => setTarget({ kind: "auction", row: r })}
            columns={[
              {
                key: "title",
                header: "Lot",
                render: (r) => (
                  <div className="flex items-center gap-3 relative">
                    <div
                      className="absolute -top-[105%] w-auto h-auto ml-1 p-2 flex gap-2 "
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        openImages(e, { id: r.id, images: r.images });
                      }}
                      onMouseLeave={() => {
                        scheduleClose();
                      }}
                    >
                      <AnimatePresence mode="wait">
                        {r.id === uniqueImageID &&
                          imagesHover.length > 0 &&
                          imagesHover.map((i, num) => (
                            <motion.div
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              // transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                              <img
                                key={i}
                                src={i}
                                className="size-16 transition object-cover aspect-auto rounded transition"
                              />
                            </motion.div>
                          ))}
                      </AnimatePresence>
                    </div>
                    {r.images?.[0] && (
                      <img
                        onMouseEnter={(e) => {
                          e.stopPropagation();
                          openImages(e, { id: r.id, images: r.images });
                        }}
                        onMouseLeave={() => {
                          scheduleClose();
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openImages(e, { id: r.id, images: r.images });
                        }}
                        src={r.images[0]}
                        alt={r.title}
                        className="size-12 border rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="text-xs font-semibold text-[var(--a-fg)]">{r.title}</p>
                      <p className="a-mono text-[10px] text-[var(--a-muted)]">{r.sellerSlug}</p>
                    </div>
                  </div>
                ),
              },
              {
                key: "estimate",
                header: "Estimate",
                render: (r) => (
                  <span className="a-mono text-xs text-[var(--a-fg-2)]">
                    {fmtMoney(r.estimateLow)} – {fmtMoney(r.estimateHigh)}
                  </span>
                ),
              },
              {
                key: "bid",
                header: "Current bid",
                render: (r) => (
                  <span className="a-mono text-xs font-bold text-[var(--a-accent)]">
                    {fmtMoney(r.currentBid ?? 0)}
                  </span>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (r) => <StatusChip value={r.status ?? "active"} />,
              },
            ]}
          />
        </BentoCard>
        <BentoCard
          className="lg:col-span-5"
          eyebrow="Exhibition · Bidding"
          title="Active & past bids"
          delay={0.18}
          action={
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--a-accent)]">
              <Hammer className="size-3" /> {bids.length} total
            </span>
          }
        >
          <DataTable
            rows={bids.filter((b) => b.userID == currentUser.userID)}
            onRowClick={(r) => setTarget({ kind: "bid", row: r })}
            columns={[
              {
                key: "lot",
                header: "Lot",
                render: (r) => (
                  <div className="flex items-center gap-2">
                    <span className="grid size-7 place-items-center rounded bg-[var(--a-surface-2)] text-[var(--a-accent)]">
                      <Hammer className="size-3" />
                    </span>
                    <span className="text-xs font-semibold text-[var(--a-fg)]">{r.lotTitle}</span>
                  </div>
                ),
              },
              {
                key: "amount",
                header: "Bid",
                render: (r) => (
                  <span className="a-mono text-xs font-bold text-[var(--a-fg)]">
                    {fmtMoney(r.bidAmount)}
                  </span>
                ),
              },
              { key: "status", header: "Status", render: (r) => <StatusChip value={"Leading"} /> },
              {
                key: "at",
                header: "When",
                render: (r) => (
                  <span className="text-xs text-[var(--a-muted)]">{fmtDateTime(r.placedAt)}</span>
                ),
              },
            ]}
          />
        </BentoCard>

        {/* Wallet transactions */}
        <BentoCard
          className="lg:col-span-8"
          eyebrow="Wallet · Ledger"
          title="Recent transactions"
          delay={0.26}
          action={
            <Link
              to="/admin/wallet"
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-accent)] hover:underline"
            >
              Open ledger <ExternalLink className="size-3" />
            </Link>
          }
        >
          <DataTable
            rows={txs.filter((t) => t.userID == currentUser.userID)}
            onRowClick={(r) => setTarget({ kind: "tx", row: r })}
            columns={[
              {
                key: "fullName",
                header: "Full Name",
                render: (r) => (
                  <span className="a-mono text-xs text-[var(--a-muted)]">{r.fullName}</span>
                ),
              },
              {
                key: "type",
                header: "Type",
                render: (r) => (
                  <span className="inline-flex rounded bg-[var(--a-surface-2)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--a-fg-2)]">
                    {r.type}
                  </span>
                ),
              },
              {
                key: "method",
                header: "Method",
                render: (r) => <span className="text-xs text-[var(--a-fg-2)]">{r.channel}</span>,
              },
              {
                key: "amount",
                header: "Amount",
                render: (r) => (
                  <span className="a-mono text-xs font-bold text-[var(--a-fg)]">
                    {fmtMoney(r.amount)}
                  </span>
                ),
              },
              { key: "status", header: "Status", render: (r) => <StatusChip value={r.status} /> },
              {
                key: "at",
                header: "When",
                render: (r) => (
                  <span className="text-xs text-[var(--a-muted)]">{fmtDateTime(r.createdAt)}</span>
                ),
              },
            ]}
          />
        </BentoCard>
      </div>

      {/* -------- Record sheets -------- */}

      {target?.kind === "bid" && (
        <RecordSheet<Bid>
          open
          onOpenChange={(o) => !o && close()}
          eyebrow="Bid"
          title={target.row.lotTitle!}
          subtitle={`Lot ${target.row.lotTitle}`}
          record={target.row}
          fields={bidFields}
          // onSave={async (patch) => {
          //   return;
          // }}
          operations={[
            {
              id: "delete",
              label: "Delete Bid",
              tone: "danger",
              icon: Pause,
              onRun: async () => {
                if (!target.row) {
                  toast({
                    title: "Error",
                    description: "Error In Selections",
                    variant: "warning",
                    position: "bottom",
                  });
                  return;
                }

                setActionMessage("Deleting bid and returning funds...");
                setActionLoading(true);

                try {
                  await updateDocument({
                    collections: "users",
                    document: {
                      id: target.row.userID,
                      wallet: {
                        balance: currentUser.wallet.balance + target.row.bidAmount,
                        bidBalance: Math.max(
                          0,
                          currentUser.wallet.bidBalance - target.row.bidAmount,
                        ),
                      },
                    },
                  });

                  await deleteDocument({
                    collectionName: "bids",
                    id: target.row.id,
                    message:
                      "Bid Successfully Deleted, And Funds Has Been Returned To User Who Bidded",
                  });
                } catch (error) {
                  toast({
                    title: "Error",
                    description: error.message || error.code,
                    variant: "error",
                    position: "bottom",
                  });
                } finally {
                  setTarget(null);
                  setActionLoading(false);
                }
              },
            },
            {
              id: "close",
              label: "Close & award winner",
              icon: Hammer,
              tone: "primary",
              onRun: async () => {
                const Lot = await getAuctionBySlug(target.row.slug);
                if (!target.row || !Lot) {
                  toast({
                    title: "Error",
                    description: "Error In Selections",
                    variant: "warning",
                    position: "bottom",
                  });

                  return;
                }

                setActionMessage("Closing auction and transferring ownership...");
                setActionLoading(true);
                try {
                  //for current Bidder..deduct from bidding balance
                  await updateDocument({
                    collections: "users",
                    document: {
                      id: target.row.userID,
                      wallet: {
                        balance: currentUser.wallet.balance,
                        bidBalance: Math.max(
                          0,
                          currentUser.wallet.bidBalance - target.row.bidAmount,
                        ),
                      },
                    },
                  });

                  //for original owner...add to the wallet balance
                  const originalUser = await getDoc(doc(db, "users", Lot.userID));

                  if (originalUser.exists()) {
                    const data = originalUser.data() as WalletAccount;
                    const topbal = data.wallet.balance + target.row.bidAmount;

                    await updateDocument({
                      collections: "users",
                      document: {
                        id: Lot.userID,
                        wallet: {
                          balance: topbal,
                          bidBalance: data.wallet.bidBalance,
                        },
                      },
                    });
                  }

                  await addDocToCollection({
                    collections: "listings",
                    document: {
                      title: Lot?.title,
                      userName: currentUser.userName,
                      userID: target.row.userID,
                      bidAmount: target.row.bidAmount,
                      year: Lot?.year,
                      category: Lot?.category,
                      description: Lot?.description,
                      images: Lot?.images,
                      createdAt: new Date().toISOString(),
                      dimensions: Lot?.dimensions,
                      status: Lot?.status,
                      medium: Lot?.medium,
                      slug: crypto.randomUUID(),
                      provenance: Lot?.provenance,
                      condition: Lot?.condition,
                      totalBidCounts: Lot?.bidCount,
                      placedAt: target.row.placedAt,
                      timeStamp: serverTimestamp() as unknown as Timestamp,
                    },
                  });

                  await updateDocument({
                    collections: "auctions",
                    document: {
                      id: target.row.id,
                      endsAt: inHours(12),
                      status: "closed",
                    },
                  });

                  await deleteDocument({
                    collectionName: "bids",
                    id: target.row.id,
                    message:
                      "Bid Has Ended, Thus Added To The User Listing List And Deleted From Auctions In 12 hours From Now",
                  });
                } catch (error) {
                  toast({
                    title: "Error",
                    description: error.message || error.code,
                    variant: "error",
                    position: "bottom",
                  });
                } finally {
                  setTarget(null);
                  setActionLoading(false);
                }
              },
            },
          ]}
        />
      )}

      {target?.kind === "tx" && (
        <RecordSheet<WalletTx>
          open
          onOpenChange={(o) => !o && close()}
          eyebrow="Wallet ledger"
          title={`${target.row.type.toUpperCase()} · ${fmtMoney(target.row.amount)}`}
          subtitle={`Tx ${target.row.id}`}
          record={target.row}
          fields={txFields}
          onSave={async (p) => {
            if (!target.row) {
              toast({
                title: "Error",
                description: "Error in Selection",
                variant: "warning",
              });
              return;
            }

            setActionMessage("Updating transaction...");
            setActionLoading(true);

            try {
              await updateDocument({
                collections: "transactions",
                document: {
                  ...target.row,
                  ...p,
                },
              });

              modToast();
            } catch (error) {
              errorToast(error);
            } finally {
              setTarget(null);
              setActionLoading(false);
            }
          }}
          operations={[
            {
              id: "approve",
              label: "Approve",
              icon: CheckCircle2,
              tone: "success",
              onRun: async () => {
                if (!target.row) {
                  warnToast();
                  return;
                }
                setActionMessage("Approving transaction...");
                setActionLoading(true);
                try {
                  await updateDocument({
                    collections: "transactions",
                    document: {
                      status: "Approved",
                      id: target.row.id,
                    },
                  });
                  modToast();
                } catch (error) {
                  errorToast(error);
                } finally {
                  setTarget(null);
                  setActionLoading(false);
                }
              },
            },
            {
              id: "decline",
              label: "Decline",
              icon: XCircle,
              tone: "danger",
              onRun: async () => {
                if (!target.row) {
                  warnToast();
                  return;
                }
                setActionMessage("Declining transaction...");
                setActionLoading(true);

                try {
                  await updateDocument({
                    collections: "transactions",
                    document: {
                      status: "Failed",
                      id: target.row.id,
                    },
                  });
                  modToast();
                } catch (error) {
                  errorToast(error);
                } finally {
                  setTarget(null);
                  setActionLoading(false);
                }
              },
            },
          ]}
        />
      )}
      {target?.kind === "auction" && (
        <RecordSheet<AuctionLot>
          open
          onOpenChange={(o) => !o && close()}
          eyebrow="Auctioned ArtWork Details"
          title={`${target.row.title.toUpperCase()} · ${target.row.sellerSlug}`}
          subtitle={` ${target.row.category}`}
          record={target.row}
          fields={auctionFields}
          onSave={async (p) => {
            if (!target.row) {
              warnToast();
              return;
            }

            setActionMessage("Updating auction lot...");
            setActionLoading(true);
            try {
              await updateDocument({
                collections: "auctions",
                document: {
                  ...target.row,
                  id: target.row.id,
                  ...p,
                },
              });

              toast({
                title: "Success",
                description: "Lot Modified Successfully",
                position: "top",
                variant: "info",
                duration: 50000,
              });
            } catch (error) {
              toast({
                title: "Error",
                description: error.code || error.message,
                position: "top",
                variant: "error",
                duration: 50000,
              });
            } finally {
              setTarget(null);
              setActionLoading(false);
            }
            // patch(selected.slug, p);
            // setSelected({ ...selected, ...p } as LotRow);
          }}
          extra={
            target.row.images.length && (
              <AuctionImageSwiper images={target.row.images} alt={currentUser.fullName} />
            )
          }
          // operations={}
        />
      )}
    </div>
  );
}

/* ------------- Field definitions ------------- */

const bidFields: FieldDef<Bid>[] = [
  { key: "id", label: "Bid ID", kind: "readonly" },
  { key: "lotTitle", label: "Lot title", editable: true },
  { key: "bidAmount", label: "Bid amount", kind: "money", editable: true },
  // {
  //   key: "status",
  //   label: "Status",
  //   kind: "select",
  //   editable: true,
  //   options: [
  //     { value: "leading", label: "Leading" },
  //     { value: "outbid", label: "Outbid" },
  //     { value: "won", label: "Won" },
  //     { value: "lost", label: "Lost" },
  //   ],
  // },
  { key: "placedAt", label: "Placed at", kind: "readonly", render: (v) => fmtDateTime(String(v)) },
];

const orderFields: FieldDef<UserOrder>[] = [
  { key: "id", label: "Order ID", kind: "readonly" },
  { key: "artworkTitle", label: "Artwork", editable: true },
  { key: "artworkSlug", label: "Slug", kind: "readonly" },
  { key: "amount", label: "Amount", kind: "money", editable: true },
  {
    key: "status",
    label: "Status",
    kind: "select",
    editable: true,
    options: [
      { value: "processing", label: "Processing" },
      { value: "shipped", label: "Shipped" },
      { value: "delivered", label: "Delivered" },
      { value: "refunded", label: "Refunded" },
    ],
  },
  { key: "at", label: "Placed at", kind: "readonly", render: (v) => fmtDateTime(String(v)) },
];

const txFields: FieldDef<WalletTx>[] = [
  // { key: "id", label: "Tx ID", kind: "readonly" },
  { key: "fullName", label: "FullName", kind: "readonly" },
  { key: "email", label: "Email", kind: "readonly" },
  {
    key: "type",
    label: "Type",
    kind: "select",
    editable: false,
    options: [
      { value: "deposit", label: "Deposit" },
      { value: "withdraw", label: "Withdraw" },
      { value: "transfer", label: "Transfer" },
      { value: "purchase", label: "Purchase" },
      { value: "sale", label: "Sale" },
    ],
  },
  { key: "channel", label: "Method", editable: false },
  { key: "amount", label: "Amount", kind: "money", editable: true },
  {
    key: "status",
    label: "Status",
    kind: "select",
    editable: true,
    options: [
      { value: "Approved", label: "Approved" },
      { value: "Pending", label: "Pending" },
      { value: "Failed", label: "Failed" },
      { value: "On Hold", label: "On Hold" },
    ],
  },
  { key: "createdAt", label: "Created", kind: "readonly", render: (v) => fmtDateTime(String(v)) },
];
const auctionFields: FieldDef<AuctionLot>[] = [
  { key: "title", label: "Lot title", span: 2 },
  // { key: "lotNumber", label: "Lot #" },
  { key: "categoryLabel", label: "Category" },
  { key: "medium", label: "Medium" },
  { key: "dimensions", label: "Dimensions" },
  { key: "year", label: "Year", kind: "number" },
  { key: "estimateLow", label: "Estimate low", kind: "money" },
  { key: "estimateHigh", label: "Estimate high", kind: "money" },
  { key: "currentBid", label: "Current bid", kind: "money" },
  { key: "startBid", label: "Start bid", kind: "money" },
  { key: "condition", label: "Condition" },
  { key: "provenance", label: "Provenance", kind: "textarea" },
  { key: "description", label: "Description", kind: "textarea", span: 2 },
  // {
  //   key: "status",
  //   label: "Status",
  //   kind: "select",
  //   render(value, row) {
  //     return (
  //       <>
  //         <span className="capitalize">{value as string}</span>
  //       </>
  //     );
  //   },
  //   options: [
  //     {
  //       label: "Active",
  //       value: "active",
  //     },
  //     {
  //       label: "Pending",
  //       value: "pending",
  //     },
  //     {
  //       label: "Suspended",
  //       value: "suspended",
  //     },
  //   ],
  // },
];

const favFields: FieldDef<UserFavourite & { id: string }>[] = [
  { key: "slug", label: "Slug", kind: "readonly" },
  { key: "title", label: "Title", editable: true },
  { key: "artist", label: "Artist", editable: true },
  { key: "price", label: "Listed price", kind: "money", editable: true },
];

const noteFields: FieldDef<UserNote>[] = [
  { key: "id", label: "Note ID", kind: "readonly" },
  { key: "author", label: "Author", editable: true },
  { key: "at", label: "Created", kind: "readonly", render: (v) => fmtDateTime(String(v)) },
  { key: "body", label: "Body", kind: "textarea", editable: true, span: 2 },
];

function WalletStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`a-card-elev p-4 ${accent ? "ring-1 ring-[var(--a-accent)]/40" : ""}`}>
      <p className="a-eyebrow">{label}</p>
      <p
        className={`font-display mt-1.5 text-2xl font-extrabold tracking-tight ${accent ? "text-[var(--a-accent)]" : "text-[var(--a-fg)]"}`}
      >
        {value}
      </p>
    </div>
  );
}

function SecRow({
  icon: Icon,
  label,
  value,
  good,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
  good?: boolean;
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] p-2.5">
      <span className="inline-flex items-center gap-2 text-[var(--a-muted)]">
        <Icon className="size-3.5" />
        <span className="font-semibold text-[var(--a-fg-2)]">{label}</span>
      </span>
      <span
        className={`a-mono text-xs font-bold ${good ? "text-[var(--a-pos)]" : "text-[var(--a-fg)]"}`}
      >
        {value}
      </span>
    </li>
  );
}

export default UserDetail;
