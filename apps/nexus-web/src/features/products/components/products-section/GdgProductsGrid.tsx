import { Stack, Text, Card, CardTitle } from "@packages/spark-ui";
import { GDG_PRODUCTS } from "./products.data";

export function GdgProductsGrid() {
  return (
    <Stack gap="xl" className="mt-30">
      <Text
        variant="heading-1"
        gradient="white-green"
        align="center"
        weight="bold"
      >
        GDG Products
      </Text>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-15 mt-10">
        {GDG_PRODUCTS.map((name, i) => (
          <Card
            key={i}
            className="relative h-80 lg:h-120 overflow-hidden rounded-[30px] bg-transparent"
          >
            {/* Gradient border */}
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

            {/* Bottom content panel */}
            <div
              className="absolute inset-x-0 bottom-0 flex items-center px-6 lg:px-9 py-6 lg:py-9 rounded-b-[30px] overflow-hidden"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.7), rgba(115,115,115,0.7), rgba(0,0,0,0.7))",
              }}
            >
              {/* Top gradient border */}
              <div
                className="absolute top-0 left-0 w-full h-px pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg,#EA4335,#F9AB00,#34A853,#4285F4)",
                }}
              />
              <CardTitle className="relative z-10 text-white text-2xl lg:text-4xl font-semibold leading-tight lg:leading-10">
                {name}
              </CardTitle>
            </div>
          </Card>
        ))}
      </div>
    </Stack>
  );
}
