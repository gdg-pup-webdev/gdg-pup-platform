import { CosmosParticles } from "@/components/shared";

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#010B1D]">
      <CosmosParticles particleColors={["#ffffff"]} particleCount={40} className="min-h-screen">
        <div className="relative z-10">{children}</div>
      </CosmosParticles>
    </div>
  );
}
