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
    <Stack gap="xl">
      <Text
        variant="heading-1"
        gradient="white-green"
        align="center"
        weight="bold"
      >
        Resource Library
      </Text>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-10 mt-10 lg:mt-25">
        {RESOURCE_LIBRARY.map((item) => (
          <TiltCard key={item.href} className="relative block w-full">
            <Link href={item.href} className="block w-full">
              <Card className="relative w-full aspect-[286/390] overflow-hidden rounded-[30px]">
                <Image
                  src={item.image}
                  alt={item.body}
                  fill
                  className="object-cover scale-125 opacity-40 bg-white/10 backdrop-blur-xl"
                />

                <CardHeader className="absolute top-3 md:top-6 left-2 md:left-4 z-10 p-0">
                  <div className="flex items-center gap-1.5 md:gap-3 px-2 md:px-5 h-[28px] md:h-[50px] rounded-full backdrop-blur-xl border border-white/20">
                    <div
                      className="w-3 h-3 md:w-6 md:h-6 rounded-full shrink-0"
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
                    <CardTitle className="text-[10px] sm:text-xs md:text-lg font-medium tracking-wide">
                      <Text gradient="white-blue">
                        {item.header.toUpperCase()}
                      </Text>
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="absolute left-3 md:left-6 right-3 md:right-6 bottom-3 md:bottom-6 z-10 p-0">
                  <Text
                    gradient={item.gradient}
                    className={`font-bold line-clamp-2 leading-tight ${
                      item.variant === "heading-1" ? "text-xl sm:text-2xl md:text-[3.5rem] lg:text-[4.5rem] tracking-tight" :
                      item.variant === "heading-2" ? "text-lg sm:text-xl md:text-[3rem] lg:text-[3.75rem]" :
                      "text-base sm:text-lg md:text-[2.5rem] lg:text-[3rem]"
                    }`}
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
