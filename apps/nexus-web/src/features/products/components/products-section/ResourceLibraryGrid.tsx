"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Stack,
  Text,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@packages/spark-ui";
import { TiltCard } from "./TiltCard";
import { RESOURCE_LIBRARY } from "./products.data";

export function ResourceLibraryGrid() {
  return (
    <Stack gap="sm">
      <Text
        variant="heading-1"
        gradient="white-green"
        align="center"
        weight="bold"
        className="text-3xl leading-none sm:text-4xl md:text-5xl"
      >
        Resource Library
      </Text>

      <div className="grid grid-cols-2 gap-4 mt-6 sm:gap-5 md:grid-cols-3 md:gap-6 md:mt-4 lg:grid-cols-4 lg:gap-8 lg:mt-6">
        {RESOURCE_LIBRARY.map((item, index) => (
          <TiltCard key={item.href} className="relative block w-full">
            <Link prefetch={false} href={item.href} className="block w-full">
              <Card className="relative w-full aspect-[286/390] overflow-hidden rounded-[30px] @container">
                <Image
                  src={item.image}
                  alt={item.body}
                  fill
                  priority={index < 4}
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover scale-125 opacity-40 bg-white/10"
                />

                <CardHeader className="absolute top-2 sm:top-3 md:top-6 left-2 md:left-4 z-10 p-0 max-w-[calc(100%-16px)]">
                  <div className="flex items-center gap-1 sm:gap-1.5 md:gap-3 px-1.5 sm:px-2 md:px-5 h-[20px] sm:h-[28px] md:h-[50px] rounded-full border border-white/20">
                    <div
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-6 md:h-6 rounded-full shrink-0"
                      style={{
                        padding: "2px",
                        background:
                          "linear-gradient(135deg, #EA4335, #F9AB00, #34A853, #4285F4)",
                        WebkitMask:
                          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                      }}
                    />
                    <CardTitle
                      className="font-medium tracking-wide text-[0.45rem] xs:text-[0.55rem] sm:text-xs md:text-sm lg:text-[1.125rem] whitespace-nowrap overflow-hidden text-ellipsis leading-none"
                    >
                      <Text gradient="white-blue">
                        {item.header.toUpperCase()}
                      </Text>
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="absolute left-3 right-3 bottom-3 z-10 p-0 overflow-hidden">
                  <Text
                    gradient={item.gradient}
                    className="font-bold line-clamp-2 leading-tight"
                    style={{
                      fontSize:
                        item.variant === "heading-1"
                          ? "clamp(0.95rem, 13cqw, 2.5rem)"
                          : item.variant === "heading-2"
                            ? "clamp(0.85rem, 11cqw, 2rem)"
                            : "clamp(0.8rem, 9.5cqw, 1.75rem)",
                    }}
                  >
                    {item.body}
                  </Text>
                </CardContent>
              </Card>
            </Link>
          </TiltCard>
        ))}
      </div>
    </Stack>
  );
}
