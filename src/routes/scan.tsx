import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, Loader2, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/scan")({
  head: () => ({ meta: [
    { title: "AI Plant Disease Scanner — GrowSmart" },
    { name: "description", content: "Upload a leaf photo and get instant AI-powered disease detection with treatment and prevention." },
  ] }),
  component: ScanPage,
});

type Result = {
  is_healthy: boolean;
  disease_name: string;
  confidence: number;
  symptoms: string;
  treatment: string;
  prevention: string;
};

function ScanPage() {
  const { user } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const onFile = async (file: File) => {
    setResult(null);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      const base64 = dataUrl.split(",")[1];
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("detect-disease", { body: { imageBase64: base64 } });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        setResult(data as Result);
        if (user) {
          await supabase.from("disease_scans").insert({
            user_id: user.id,
            disease_name: data.disease_name,
            confidence: data.confidence,
            is_healthy: data.is_healthy,
            symptoms: data.symptoms,
            treatment: data.treatment,
            prevention: data.prevention,
            raw: data,
          });
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Scan failed");
      } finally { setLoading(false); }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-4xl">AI disease scanner</h1>
        <p className="text-muted-foreground">Upload a clear photo of a plant leaf — we'll diagnose it in seconds.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border-2 border-dashed border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <label className="flex h-72 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl bg-muted text-center transition hover:bg-muted/70">
            {preview ? (
              <img src={preview} alt="leaf" className="h-full w-full rounded-2xl object-cover" />
            ) : (
              <>
                <Upload className="h-10 w-10 text-primary" />
                <div className="font-medium">Click or drop a leaf photo</div>
                <div className="text-xs text-muted-foreground">JPG / PNG — well-lit, leaf in focus</div>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          </label>
          {preview && (
            <Button variant="outline" className="mt-3 w-full rounded-full" onClick={() => { setPreview(null); setResult(null); }}>Try another photo</Button>
          )}
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
          {loading && (
            <div className="flex h-72 flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              Analyzing your leaf…
            </div>
          )}
          {!loading && !result && (
            <div className="flex h-72 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <ShieldCheck className="h-10 w-10 text-primary/40" />
              Your AI diagnosis will appear here.
            </div>
          )}
          {result && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {result.is_healthy
                  ? <CheckCircle2 className="h-8 w-8 text-primary" />
                  : <AlertTriangle className="h-8 w-8 text-destructive" />}
                <div>
                  <div className="font-serif text-2xl">{result.disease_name}</div>
                  <div className="text-sm text-muted-foreground">Confidence: {Math.round(result.confidence)}%</div>
                </div>
              </div>
              <Section title="Symptoms" body={result.symptoms} />
              <Section title="Treatment" body={result.treatment} />
              <Section title="Prevention" body={result.prevention} />
              {!user && <p className="text-xs text-muted-foreground">Sign in to save scans to your history.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-primary">{title}</div>
      <p className="mt-1 text-sm text-foreground/90">{body}</p>
    </div>
  );
}