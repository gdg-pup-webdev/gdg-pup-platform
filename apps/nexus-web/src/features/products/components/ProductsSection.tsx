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

const RESOURCE_LIBRARY = [
  { header: "Technology", body: "IoT", href: "/products/iot" },
  { header: "Technology", body: "Cybersecurity", href: "/products/cybersecurity" },
  { header: "Technology", body: "Data / ML", href: "/products/data-ml" },
  { header: "Technology", body: "UI/UX", href: "/products/ui-ux" },
  { header: "Technology", body: "Cloud Solutions", href: "/products/cloud-solutions" },
  { header: "Technology", body: "Project Management", href: "/products/project-management" },
  { header: "Technology", body: "Web Development", href: "/products/web-development" },
  { header: "Executives", body: "Executives", href: "/products/executives" },
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
    <div className="relative overflow-x-hidden pt-60 pb-48 px-4 md:px-8 lg:px-16">
      {/* Decorative blob \u2014 top left */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(1000px, 70vw)",
          height: "min(900px, 75vh)",
          top: "calc(4rem - 350px)",
          left: "max(calc((100vw - 80rem) / 2), 0px)",
          background: "#34A85333",
          filter: "blur(579px)",
          zIndex: 0,
        }}
      />
      {/* Decorative blob \u2014 right */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(800px, 60vw)",
          height: "min(850px, 70vh)",
          top: "calc(4rem + 300px)",
          right: "max(calc((100vw - 80rem) / 2 - 300px), -150px)",
          background: "#4285F433",
          filter: "blur(579px)",
          zIndex: 0,
        }}
      />

      <Container>
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

            <div className="grid grid-cols-2 gap-6">
              {RESOURCE_LIBRARY.map((item) => (
                <Link key={item.href} href={item.href} className="block">
                  <Card className="h-full transition-opacity hover:opacity-80">
                    <CardHeader>
                      <CardTitle>{item.header}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Text variant="body" color="secondary">
                        {item.body}
                      </Text>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </Stack>

          {/* \u2500\u2500 GDG Products \u2500\u2500 */}
          <Stack gap="xl">
            <Text
              variant="heading-1"
              gradient="white-green"
              align="center"
              weight="bold"
            >
              GDG Products
            </Text>

            <div className="grid grid-cols-3 gap-6">
              {GDG_PRODUCTS.map((name, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>{name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Text variant="body" color="secondary">
                      Coming soon
                    </Text>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
