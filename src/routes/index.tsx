import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Camera, Cloud, Droplets, Leaf, MessageCircle, Sparkles, Sun } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { PLANTS } from "@/data/plants";
import { fetchWeather, getLocation, weatherLabel, type Weather } from "@/lib/weather";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [weather, setWeather] = useState<Weather | null>(null);
  useEffect(() => {
    getLocation().then(({ lat, lon }) => fetchWeather(lat, lon).then(setWeather).catch(() => {}));
  }, []);
  const featured = PLANTS.slice(0, 4);

  const quick = [
    { icon: Camera, label: "Scan a leaf", to: "/scan", desc: "AI disease detection" },
    { icon: Droplets, label: "Care guide", to: "/plants", desc: "Watering & soil tips" },
    { icon: MessageCircle, label: "Ask GrowSmart", to: "/chat", desc: "AI gardening coach" },
    { icon: Leaf, label: "My garden", to: "/tracker", desc: "Track your plants" },
  ] as const;

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-90" style={{ backgroundImage: "var(--gradient-soft)" }} />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" /> AI-powered home gardening
            </span>
            <h1 className="font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl">
              Grow happier plants <em className="text-primary">at home.</em>
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              GrowSmart turns your windowsill into a thriving little jungle — with weather-aware watering, AI disease detection, and a personal plant coach.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/scan"><Button size="lg" className="rounded-full shadow-[var(--shadow-leaf)]"><Camera className="mr-2 h-4 w-4" /> Scan a leaf</Button></Link>
              <Link to="/plants"><Button size="lg" variant="outline" className="rounded-full">Browse plants</Button></Link>
            </div>
            {weather && (
              <div className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-card px-4 py-2 text-sm shadow-[var(--shadow-soft)]">
                <Sun className="h-4 w-4 text-accent" />
                <span>{Math.round(weather.temp)}°C · {weatherLabel(weather.code)}</span>
                <span className="text-muted-foreground">·</span>
                <Droplets className="h-4 w-4 text-primary" />
                <span>{weather.humidity}% humidity</span>
              </div>
            )}
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-primary/20 blur-3xl" />
            <img src={heroImg} alt="Indoor potted plants by sunlit window" width={1600} height={1024} className="rounded-[2rem] shadow-[var(--shadow-leaf)]" />
          </div>
        </div>
      </section>

      {/* QUICK ACCESS */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quick.map((q) => (
            <Link key={q.to} to={q.to} className="group rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-leaf)]">
              <q.icon className="mb-4 h-6 w-6 text-primary transition group-hover:scale-110" />
              <div className="font-serif text-lg">{q.label}</div>
              <div className="text-sm text-muted-foreground">{q.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PLANTS */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl">Featured plants</h2>
            <p className="text-muted-foreground">Beginner-friendly favorites to start with.</p>
          </div>
          <Link to="/plants" className="text-sm font-medium text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
              <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-[var(--gradient-soft)] text-6xl">{p.emoji}</div>
              <div className="font-serif text-lg">{p.name}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{p.category} · {p.difficulty}</div>
              <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground"><Droplets className="h-3 w-3" /> {p.watering}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WEATHER ADVICE */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="rounded-3xl bg-[var(--gradient-hero)] p-10 text-primary-foreground shadow-[var(--shadow-leaf)]">
          <div className="flex items-center gap-2 text-sm opacity-90"><Cloud className="h-4 w-4" /> Today's care tip</div>
          <p className="mt-2 font-serif text-2xl md:text-3xl">
            {weather
              ? `It's ${Math.round(weather.temp)}°C with ${weather.humidity}% humidity — perfect time to check on your green friends.`
              : "Get personalized watering recommendations based on your local weather."}
          </p>
          <Link to="/tracker"><Button size="lg" variant="secondary" className="mt-6 rounded-full">Open my garden →</Button></Link>
        </div>
      </section>
    </div>
  );
}
