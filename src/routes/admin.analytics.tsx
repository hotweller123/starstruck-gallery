import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { BentoCard, SectionHeader, TabBar } from "@/components/admin/primitives";
import { revenueSeries, trafficSeries } from "@/data/admin-mock";

export const Route = createFileRoute("/admin/analytics")({
  component: AnalyticsAdmin,
});

const split = [
  { name: "Auctions", value: 48 },
  { name: "Direct sales", value: 32 },
  { name: "Commissions", value: 14 },
  { name: "Fees", value: 6 },
];
const COLORS = ["var(--a-accent)", "var(--a-info)", "var(--a-pos)", "var(--a-warn)"];

function AnalyticsAdmin() {
  const [tab, setTab] = useState<"revenue" | "traffic" | "engagement">("revenue");

  return (
    <div className="mx-auto max-w-[1440px]">
      <SectionHeader title="Analytics" description="Trends and breakdowns across the exhibition and wallet." />

      <TabBar
        tabs={[
          { id: "revenue", label: "Revenue" },
          { id: "traffic", label: "Traffic" },
          { id: "engagement", label: "Engagement" },
        ]}
        active={tab}
        onChange={(id) => setTab(id as typeof tab)}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <BentoCard className="lg:col-span-8" eyebrow="30 days" title={tab === "revenue" ? "Daily revenue" : tab === "traffic" ? "Site visits" : "Daily bids"}>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {tab === "revenue" ? (
                <AreaChart data={revenueSeries} margin={{ left: -16, right: 8, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ga-rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--a-accent)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="var(--a-accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--a-border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--a-faint)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--a-faint)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={48} />
                  <Tooltip contentStyle={{ background: "var(--a-bg-2)", border: "1px solid var(--a-border-hi)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="var(--a-accent)" strokeWidth={2} fill="url(#ga-rev)" />
                </AreaChart>
              ) : (
                <BarChart data={trafficSeries} margin={{ left: -16, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke="var(--a-border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--a-faint)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--a-faint)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={48} />
                  <Tooltip contentStyle={{ background: "var(--a-bg-2)", border: "1px solid var(--a-border-hi)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey={tab === "traffic" ? "visits" : "bids"} fill="var(--a-accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </BentoCard>

        <BentoCard className="lg:col-span-4" eyebrow="Mix" title="Revenue split">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={split} dataKey="value" innerRadius={56} outerRadius={88} paddingAngle={3} stroke="var(--a-bg)">
                  {split.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--a-bg-2)", border: "1px solid var(--a-border-hi)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5">
            {split.map((s, i) => (
              <li key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-[var(--a-fg-2)]">
                  <span className="size-2 rounded-sm" style={{ background: COLORS[i] }} />
                  {s.name}
                </span>
                <span className="a-mono font-bold text-[var(--a-fg)]">{s.value}%</span>
              </li>
            ))}
          </ul>
        </BentoCard>
      </div>
    </div>
  );
}
