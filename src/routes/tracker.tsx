import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Sprout } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/tracker")({
  head: () => ({ meta: [{ title: "My Garden — GrowSmart" }] }),
  component: TrackerPage,
});

type UserPlant = { id: string; nickname: string; species: string | null; location: string | null; notes: string | null; created_at: string };

function TrackerPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [plants, setPlants] = useState<UserPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ nickname: "", species: "", location: "", notes: "" });

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("user_plants").select("*").order("created_at", { ascending: false }).then(({ data, error }) => {
      if (error) toast.error(error.message); else setPlants(data ?? []);
      setLoading(false);
    });
  }, [user]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { data, error } = await supabase.from("user_plants").insert({ ...form, user_id: user.id }).select().single();
    if (error) return toast.error(error.message);
    setPlants([data as UserPlant, ...plants]);
    setForm({ nickname: "", species: "", location: "", notes: "" });
    setShowAdd(false);
    toast.success("Plant added 🌱");
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("user_plants").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setPlants((p) => p.filter((x) => x.id !== id));
  };

  if (authLoading || !user) return <div className="p-12 text-center text-muted-foreground">Loading…</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">My garden</h1>
          <p className="text-muted-foreground">Track and care for your plants over time.</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} className="rounded-full"><Plus className="mr-1 h-4 w-4" /> Add plant</Button>
      </div>

      {showAdd && (
        <form onSubmit={add} className="mb-8 grid gap-3 rounded-3xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)] md:grid-cols-2">
          <div><Label>Nickname *</Label><Input required value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} /></div>
          <div><Label>Species</Label><Input value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })} placeholder="Monstera deliciosa" /></div>
          <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Living room window" /></div>
          <div className="md:col-span-2"><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          <Button type="submit" className="md:col-span-2 rounded-full">Save plant</Button>
        </form>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading your garden…</p>
      ) : plants.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center">
          <Sprout className="mx-auto mb-3 h-10 w-10 text-primary/50" />
          <p className="font-serif text-xl">Your garden is empty.</p>
          <p className="text-sm text-muted-foreground">Add your first plant to start tracking.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plants.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-serif text-lg">{p.nickname}</div>
                  {p.species && <div className="text-xs italic text-muted-foreground">{p.species}</div>}
                </div>
                <Button variant="ghost" size="icon" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
              {p.location && <div className="mt-2 text-xs text-muted-foreground">📍 {p.location}</div>}
              {p.notes && <p className="mt-2 text-sm text-foreground/80">{p.notes}</p>}
              <div className="mt-3 text-xs text-muted-foreground">Added {new Date(p.created_at).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 rounded-3xl bg-[var(--gradient-soft)] p-6 text-sm text-muted-foreground">
        Tip: <Link to="/scan" className="font-medium text-primary hover:underline">Scan a leaf</Link> if anything looks off, or <Link to="/chat" className="font-medium text-primary hover:underline">ask the AI coach</Link> for personalized care advice.
      </div>
    </div>
  );
}