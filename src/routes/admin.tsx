import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({
    meta: [
      { title: "Console — Aethelred Admin" },
<<<<<<< HEAD
      { name: "description", content: "Operational control center for the Aethelred exhibition and wallet." },
=======
      {
        name: "description",
        content: "Operational control center for the Aethelred exhibition and wallet.",
      },
>>>>>>> 49a1b1e (updated)
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function AdminLayout() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
