import Image from "next/image";
import { Text } from "@packages/spark-ui";
import { ASSETS } from "@/lib/constants/assets";

export function ComingSoonPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-16 rounded-2xl">
      <div className="relative h-60 w-60 drop-shadow-[0_0_20px_rgba(43,127,255,0.4)]">
        <Image
          src={ASSETS.SPARKY_POINTS.CIRBY_DENIED}
          alt="Coming Soon"
          fill
          className="object-contain"
        />
      </div>
      <Text variant="body" className="mt-4 text-[#C1C7CD]" weight="medium">
        Coming Soon!
      </Text>
    </div>
  );
}
