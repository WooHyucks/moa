import MoaApp from "@/components/moa-app";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default function LandingPage() {
  return (
    <MoaApp
      amplitudeApiKey={process.env.AMPLITUDE_API_KEY ?? ""}
      storageReady={isSupabaseConfigured()}
    />
  );
}
