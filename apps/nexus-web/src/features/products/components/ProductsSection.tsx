import Link from "next/link";
import {
  Container,
  Stack,
  Grid,
  Text,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@packages/spark-ui";
import Image from "next/image";

const RESOURCE_LIBRARY = [
  {
    header: "Technology",
    body: "IoT",
    variant: "heading-1",
    gradient: "white-red",
    href: "/products/iot",
    image: "/products/iot-logo.png",
  },
  {
    header: "Technology",
    body: "Cybersecurity",
    variant: "heading-3",
    gradient: "white-green",
    href: "/products/cybersecurity",
    image: "/products/cybersecurity-logo.png",
  },
  {
    header: "Technology",
    body: "Data/ML",
    variant: "heading-2",
    gradient: "white-blue",
    href: "/products/data-ml",
    image: "/products/data-ml-logo.png",
  },
  {
    header: "Technology",
    body: "UI/UX",
    variant: "heading-1",
    gradient: "white-yellow",
    href: "/products/ui-ux",
    image: "/products/ui-ux-logo.png",
  },
  {
    header: "Technology",
    body: "Cloud Solutions",
    variant: "heading-3",
    gradient: "white-red",
    href: "/products/cloud-solutions",
    image: "/products/cloud-solutions-logo.png",
  },
  {
    header: "Technology",
    body: "Project Management",
    variant: "heading-3",
    gradient: "white-green",
    href: "/products/project-management ",
    image: "/products/project-management-logo.png",
  },
  {
    header: "Technology",
    body: "Web Development",
    variant: "heading-3",
    gradient: "white-blue",
    href: "/products/web-development",
    image: "/products/web-development-logo.png",
  },
  {
    header: "Executives",
    body: "Executives",
    variant: "heading-2",
    gradient: "white-yellow",
    href: "/products/executives",
    image: "/products/executives-logo.png",
  },
];

const GDG_PRODUCTS = [
  "GDG ID Platform",
  "GDG Sparky Fortune",
  "GDG Photobooth",
  "Product Name",
  "Product Name",
  "Product Name",
];

export function ProductsSection() {
  return (
    <div className="relative overflow-x-hidden overflow-y-hidden pt-60 pb-48 px-4 md:px-8 lg:px-16">
      {/* Bottom layer */}
      <img
        src="/products/SPACE_BG_3_3.png"
        alt=""
        className="absolute top-250 left-1/2 -translate-x-1/2 w-full h-auto pointer-events-none"
      />

      {/* Middle layer (partially under top) */}
      <img
        src="/products/SPACE_BG_3_2.png"
        alt=""
        className="absolute top-135 left-1/2 -translate-x-1/2 w-full h-auto pointer-events-none"
      />

      {/* Top layer */}
      <img
        src="/products/SPACE_BG_3_1.png"
        alt=""
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-auto pointer-events-none"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, black 70%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
        }}
      />

      <div className="absolute w-[1000.28px] h-[1000.28px] origin-top-left rotate-[7.71deg] opacity-10 mix-blend-hard-light bg-white/80 rounded-full blur-[200px] -translate-x-1/3"></div>
      <div className="absolute w-[792px] h-[640px] opacity-60 bg-blue-500/20 rounded-full blur-[289.55px] translate-y-9/10"></div>
      <img
        src="/products/gold-1.jpg"
        alt=""
        className="absolute -top-40 -left-40 w-[1200px] h-[1600px] rotate-[-162deg] mix-blend-screen blur-[150px] pointer-events-none z-0 -translate-x-3/5 -translate-y-1/10 opacity-30"
      />
      <img
        className="w-155 h-auto absolute top-90 -left-125 opacity-25 translate-x-1/3"
        src="/products/cogwheel-asset.png"
        alt=""
      />
      <img
        className="w-140 h-auto absolute bottom-235 -right-25 opacity-25 translate-x-1/3 rotate-[-18.99deg] z-10"
        src="/products/star-bubble.png"
        alt=""
      />
      <img
        className="w-500 h-auto absolute bottom-0 right-150 translate-x-1/3"
        src="/products/gold-2.png"
        alt=""
      />
      <img
        className="w-140 h-auto absolute bottom-10 -left-105 translate-x-1/3 rotate-[158.50deg] opacity-40"
        src="/products/cross-bubble.png"
        alt=""
      />

      <Container className="max-w-[1700px]">
        <Stack gap="2xl" className="relative z-10">
          {/* \u2500\u2500 Page heading \u2500\u2500 */}
          <Text
            variant="heading-1"
            gradient="white-blue"
            align="center"
            weight="bold"
          >
            PRODUCTS
          </Text>

          {/* \u2500\u2500 Resource Library \u2500\u2500 */}
          <Stack gap="xl">
            <Text
              variant="heading-1"
              gradient="white-green"
              align="center"
              weight="bold"
            >
              Resource Library
            </Text>

            {/*Resource Library*/}
            <div className="grid grid-cols-4 gap-10 mt-25">
              {RESOURCE_LIBRARY.map((item) => (
                <Link key={item.href} href={item.href} className="block w-full">
                  <Card className="relative w-full aspect-[286/390] overflow-hidden transition-opacity hover:opacity-80 rounded-[30px]">
                    <Image
                      src={item.image}
                      alt={item.body}
                      fill
                      className="object-cover scale-125 opacity-40 bg-white/10 backdrop-blur-xl"
                    />

                    <CardHeader className="absolute top-6 left-4 z-10 p-0">
                      <div className="flex items-center gap-3 px-5 h-[50px] rounded-full backdrop-blur-xl border border-white/20">
                        <div
                          className="w-6 h-6 rounded-full shrink-0"
                          style={{
                            padding: "1px",
                            background:
                              "linear-gradient(135deg, #EA4335, #F9AB00, #34A853, #4285F4)",
                            WebkitMask:
                              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            WebkitMaskComposite: "xor",
                            maskComposite: "exclude",
                          }}
                        />

                        <CardTitle className="text-lg font-medium tracking-wide">
                          <Text gradient="white-blue">
                            {item.header.toUpperCase()}
                          </Text>
                        </CardTitle>
                      </div>
                    </CardHeader>

                    <CardContent className="absolute left-6 right-6 bottom-6 z-10 p-0">
                      <Text
                        variant={item.variant}
                        gradient={item.gradient}
                        className="line-clamp-2 leading-tight"
                      >
                        {item.body}
                      </Text>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </Stack>

          {/* \u2500\u2500 GDG Products \u2500\u2500 */}
          <Stack gap="xl" className="mt-30">
            <Text
              variant="heading-1"
              gradient="white-green"
              align="center"
              weight="bold"
            >
              GDG Products
            </Text>

            <div className="grid grid-cols-3 gap-15 mt-10">
              {GDG_PRODUCTS.map((name, i) => (
                <Card
                  key={i}
                  className="relative h-120 overflow-hidden rounded-[30px] bg-transparent"
                >
                  {/* Gradient border (REPLACED) */}
                  <div
                    className="absolute inset-0 rounded-[30px] pointer-events-none"
                    style={{
                      padding: "1px",
                      background:
                        "linear-gradient(90deg,#EA4335,#F9AB00,#34A853,#4285F4)",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                  />

                  {/* bottom content panel */}
                  <div
                    className="absolute inset-x-0 bottom-0 flex items-center px-9 py-9 rounded-b-[30px] overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(0,0,0,0.7), rgba(115,115,115,0.7), rgba(0,0,0,0.7))",
                    }}
                  >
                    {/* ✅ Top gradient border (NEW) */}
                    <div
                      className="absolute top-0 left-0 w-full h-[1px] pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(135deg,#EA4335,#F9AB00,#34A853,#4285F4)",
                      }}
                    />

                    <CardTitle className="relative z-10 text-white text-4xl font-semibold leading-10">
                      {name}
                    </CardTitle>
                  </div>
                </Card>
              ))}
            </div>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
