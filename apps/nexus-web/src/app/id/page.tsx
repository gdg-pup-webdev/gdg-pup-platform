import { IdSection } from "@/features/id";
import { CosmosParticles } from "@/components/shared";

export default function IdPage() {
  return (
    <CosmosParticles
      particleColors={["#43405c"]}
      particleCount={300}
      particleSpread={10}
      speed={0.05}
      particleBaseSize={100}
      moveParticlesOnHover
      alphaParticles={false}
      disableRotation={false}
      className="min-h-screen"
    >
      <IdSection />
    </CosmosParticles>
  );
}
