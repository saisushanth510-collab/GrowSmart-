import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Droplets, Sun, FlaskConical, Sprout } from "lucide-react";
import { PLANTS, type Plant } from "@/data/plants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/plants")({
  head: () => ({
    meta: [
      { title: "Plant Library — GrowSmart" },
      { name: "description", content: "Browse indoor and outdoor plants with care guides: soil, sunlight, watering, and fertilizer." },
    ],
  }),
  component: PlantsPage,
});

function PlantsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"all" | "indoor" | "outdoor">("all");

  const list = useMemo(() => PLANTS.filter((p) => {
    if (cat !== "all" && p.category !== cat) return false;
    if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [q, cat]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-4xl">Plant library</h1>
        <p className="text-muted-foreground">Care guides for {PLANTS.length} popular indoor and outdoor plants.</p>
      </div>
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search plants…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9 rounded-full" />
        </div>
        {(["all", "indoor", "outdoor"] as const).map((c) => (
          <Button key={c} variant={cat === c ? "default" : "outline"} onClick={() => setCat(c)} className="rounded-full capitalize">
            {c}
          </Button>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => <PlantCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}

function PlantCard({ p }: { p: Plant }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-leaf)]">
      <div className="mb-4 flex h-40 items-center justify-center rounded-2xl bg-[var(--gradient-soft)] text-7xl">{p.emoji}</div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-serif text-xl">{p.name}</div>
          <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{p.category} · {p.difficulty}</div>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{p.description}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Stat icon={Sprout} label="Soil" value={p.soil} />
        <Stat icon={Sun} label="Light" value={p.sunlight} />
        <Stat icon={Droplets} label="Water" value={p.watering} />
        <Stat icon={FlaskConical} label="Feed" value={p.fertilizer} />
      </dl>
      <div className="mt-4 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">Pot: {p.potSize}</div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-xs font-medium text-primary"><Icon className="h-3 w-3" /> {label}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{value}</div>
    </div>
  );
}