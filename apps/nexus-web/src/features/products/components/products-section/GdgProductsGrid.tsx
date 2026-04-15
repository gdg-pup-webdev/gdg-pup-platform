"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Card, CardTitle, Stack, Text } from "@packages/spark-ui";
import {
  GDG_PRODUCTS_MOCK,
  PRODUCT_FALLBACK_THUMBNAIL,
  type GdgProduct,
} from "./products.mock";
import { ProductDetailsModal } from "./ProductDetailsModal";
import { CarouselArrowIcon } from "../../../community-showcase/components/CarouselArrowIcon";

export function GdgProductsGrid() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<GdgProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    function syncItemsPerPage() {
      const mobile = window.innerWidth < 640;
      const next = mobile ? 4 : 6;
      setIsMobile(mobile);
      setItemsPerPage(next);
    }

    syncItemsPerPage();
    window.addEventListener("resize", syncItemsPerPage);
    return () => window.removeEventListener("resize", syncItemsPerPage);
  }, []);

  const totalPages = Math.max(1, Math.ceil(GDG_PRODUCTS_MOCK.length / itemsPerPage));

  const paginatedProducts = useMemo(() => {
    if (isMobile) {
      return GDG_PRODUCTS_MOCK.slice(0, currentPage * itemsPerPage);
    }

    const start = (currentPage - 1) * itemsPerPage;
    return GDG_PRODUCTS_MOCK.slice(start, start + itemsPerPage);
  }, [currentPage, isMobile, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function handleCardClick(product: GdgProduct) {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }

  return (
    <Stack gap="xl" className="mt-30">
      <Text
        variant="heading-1"
        gradient="white-green"
        align="center"
        weight="bold"
        className="text-3xl leading-none sm:text-4xl md:text-5xl"
      >
        GDG Products
      </Text>

      <div
        className="grid grid-cols-1 mt-8 md:grid-cols-2 lg:grid-cols-3 md:mt-10"
        style={{ gap: "clamp(1.5rem, 3vw, 2.5rem)" }}
      >
        {paginatedProducts.map((product) => (
          <Card
            key={product.id}
            className="relative h-72 overflow-hidden rounded-[30px] bg-transparent"
          >
            <button
              type="button"
              onClick={() => handleCardClick(product)}
              className="group relative h-full w-full text-left"
              aria-label={`View product details for ${product.title}`}
            >
              <div className="flex h-full flex-col">
                <div className="relative min-h-0 flex-1 overflow-hidden rounded-t-[30px]">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(event) => {
                      if (event.currentTarget.src.includes(PRODUCT_FALLBACK_THUMBNAIL)) return;
                      event.currentTarget.src = PRODUCT_FALLBACK_THUMBNAIL;
                    }}
                  />
                </div>

                <div
                  className="h-px w-full"
                  style={{
                    background:
                      "linear-gradient(90deg,#EA4335,#F9AB00,#34A853,#4285F4)",
                  }}
                />

                <div
                  className="flex min-h-24 items-center rounded-b-[30px] px-6 py-4"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(0,0,0,0.7), rgba(115,115,115,0.7), rgba(0,0,0,0.7))",
                  }}
                >
                  <CardTitle className="text-white text-lg sm:text-xl lg:text-2xl font-semibold leading-tight">
                    {product.title}
                  </CardTitle>
                </div>
              </div>

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
            </button>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        isMobile ? (
          <div className="mt-4 flex justify-center">
            <Button
              variant="colored"
              subVariant="blue"
              className="px-8"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
            >
              Load More
            </Button>
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-center gap-4 sm:gap-8">
            <Button
              variant="colored"
              subVariant="blue"
              aria-label="Previous products page"
              className="h-12 w-12 shrink-0 rounded-full disabled:opacity-45 sm:h-15 sm:w-15"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <CarouselArrowIcon direction="left" />
            </Button>

            <Text
              variant="body"
              color="on-secondary"
              className="min-w-24 text-center font-semibold"
            >
              {currentPage} / {totalPages}
            </Text>

            <Button
              variant="colored"
              subVariant="blue"
              aria-label="Next products page"
              className="h-12 w-12 shrink-0 rounded-full disabled:opacity-45 sm:h-15 sm:w-15"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <CarouselArrowIcon direction="right" />
            </Button>
          </div>
        )
      )}

      <ProductDetailsModal
        open={isModalOpen}
        product={selectedProduct}
        onOpenChange={setIsModalOpen}
      />
    </Stack>
  );
}
