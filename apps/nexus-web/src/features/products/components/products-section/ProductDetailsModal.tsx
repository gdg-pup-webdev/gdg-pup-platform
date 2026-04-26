import { Modal, Text } from "@packages/spark-ui";
import { PRODUCT_FALLBACK_THUMBNAIL, type GdgProduct } from "./products.mock";

interface ProductDetailsModalProps {
  open: boolean;
  product: GdgProduct | null;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailsModal({
  open,
  product,
  onOpenChange,
}: ProductDetailsModalProps) {
  if (!product) return null;

  const isDeployed = product.status === "deployed";

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
      size="md"
      className="bg-transparent border-none p-0 shadow-none! isolate max-w-[95vw] sm:max-w-2xl"
    >
      <div className="relative overflow-hidden w-full rounded-3xl bg-[#010B1D]/95 backdrop-blur-2xl px-6 py-6 sm:px-8 sm:py-8 border border-white/15 shadow-[0_0_80px_rgba(0,0,0,0.6),inset_0px_4px_16px_rgba(255,255,255,0.05)]">
        <div className="mb-5 overflow-hidden rounded-2xl border border-white/15">
          <img
            src={product.image}
            alt={product.title}
            className="h-auto w-full object-cover"
            onError={(event) => {
              if (event.currentTarget.src.includes(PRODUCT_FALLBACK_THUMBNAIL)) return;
              event.currentTarget.src = PRODUCT_FALLBACK_THUMBNAIL;
            }}
          />
        </div>

        <div className="space-y-4">
          <Text variant="heading-5" gradient="white-blue" weight="bold" className="text-2xl sm:text-3xl">
            {product.title}
          </Text>

          <Text variant="body" className="text-white/90 leading-relaxed">
            {product.description}
          </Text>

          {isDeployed && product.website ? (
            <a
              href={product.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Visit Website
            </a>
          ) : (
            <Text variant="body-sm" className="text-yellow-100/90">
              This product is currently in development and has no public website yet.
            </Text>
          )}
        </div>
      </div>
    </Modal>
  );
}
