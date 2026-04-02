/* eslint-disable @next/next/no-img-element */

/**
 * PlanetCard
 *
 * Reusable "planet sphere + rings" visual used both in the mobile
 * single-card carousel and the desktop infinite-scroll grid.
 */

const PLANET_MASK_STYLE: React.CSSProperties = {
  WebkitMaskImage:
    "radial-gradient(ellipse 50% 50% at 50% 50%, black 50%, rgba(0, 0, 0, 0.35) 85%, rgba(0, 0, 0, 0) 100%)",
  maskImage:
    "radial-gradient(ellipse 50% 50% at 50% 50%, black 50%, rgba(0, 0, 0, 0.35) 85%, rgba(0, 0, 0, 0) 100%)",
};

interface PlanetCardProps {
  image: string;
  alt: string;
  /** Diameter in px. Defaults to 260. Ignored when `style` is provided. */
  size?: number;
  /** Override sizing/positioning via inline style (e.g. for clamp values). */
  style?: React.CSSProperties;
  draggable?: boolean;
}

export function PlanetCard({
  image,
  alt,
  size = 260,
  style,
  draggable = false,
}: PlanetCardProps) {
  return (
    <div className="relative" style={style ?? { width: size, height: size }}>
      {/* Sphere */}
      <div className="relative h-full w-full overflow-hidden rounded-full bg-black">
        <img
          src={image}
          alt={alt}
          draggable={draggable}
          className="h-full w-full object-cover"
          style={PLANET_MASK_STYLE}
        />
        {/* Dark shadow — bottom-left */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_-40%_60%,rgba(0,0,0,0.72)_0%,transparent_65%)]" />
        {/* White specular highlight — top-right */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_110%_22%,rgba(255,255,255,0.70)_0%,rgba(255,255,255,0.28)_28%,transparent_70%)]" />
      </div>

      {/* Rings overlay */}
      <img
        src="/community-showcase/community-showcase-rings.webp"
        alt=""
        draggable={false}
        className="pointer-events-none absolute left-1/2 top-1/2 w-[154%] max-w-none -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}
