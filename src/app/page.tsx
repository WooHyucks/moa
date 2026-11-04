import PrototypeApp from "@/components/prototype-app";

export default function LandingPage() {
  return (
    <PrototypeApp amplitudeApiKey={process.env.AMPLITUDE_API_KEY ?? ""} />
  );
}
