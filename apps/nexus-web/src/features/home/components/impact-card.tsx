import Image, { type StaticImageData } from "next/image";

interface ImpactCardProps {
  color: string;
  corner: string | StaticImageData;
  title: string;
  logo: string | StaticImageData;
  logoAlt: string;
  description: string;
  image: string | StaticImageData;
  imageAlt: string;
  className?: string;
}

export function ImpactCard({
  color,
  corner,
  title,
  logo,
  logoAlt,
  description,
  image,
  imageAlt,
  className = "",
}: ImpactCardProps) {
  return (
    <article
      className={`hidden md:flex relative h-full w-full max-w-75 rounded-[28px] flex-col gap-6 border bg-[#1a2539] p-6 ${className}`}
      style={{ borderColor: color }}
    >
      <div className="pointer-events-none absolute -inset-1 rounded-[30px]">
        <Image
          src={corner}
          alt=""
          aria-hidden
          fill
          className="rounded-[30px] object-fill"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl leading-8 font-bold text-white">{title}</h3>
          <Image
            src={logo}
            alt={logoAlt}
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
          />
        </div>

        <p className="font-normal text-lg leading-7 text-white">
          {description}
        </p>
      </div>

      <div className="relative h-47.5 overflow-hidden rounded-3xl">
        <Image src={image} alt={imageAlt} fill className="object-cover" />
      </div>
    </article>
  );
}
