import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { optimize } from "svgo";

type RasterAssetConfig = {
  source: string;
  target: string;
  maxWidth: number;
  maxHeight: number;
  quality: number;
};

const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");

const rasterAssets: RasterAssetConfig[] = [
  { source: "products/project-management-logo.png", target: "products/project-management-logo.webp", maxWidth: 1600, maxHeight: 1600, quality: 76 },
  { source: "products/ui-ux-logo.png", target: "products/ui-ux-logo.webp", maxWidth: 1600, maxHeight: 1600, quality: 76 },
  { source: "products/data-ml-logo.png", target: "products/data-ml-logo.webp", maxWidth: 1600, maxHeight: 1600, quality: 76 },
  { source: "products/web-development-logo.png", target: "products/web-development-logo.webp", maxWidth: 1600, maxHeight: 1600, quality: 76 },
  { source: "products/cloud-solutions-logo.png", target: "products/cloud-solutions-logo.webp", maxWidth: 1600, maxHeight: 1600, quality: 76 },
  { source: "products/iot-logo.png", target: "products/iot-logo.webp", maxWidth: 1600, maxHeight: 1600, quality: 76 },
  { source: "products/cybersecurity-logo.png", target: "products/cybersecurity-logo.webp", maxWidth: 1600, maxHeight: 1600, quality: 76 },
  { source: "products/star-bubble.png", target: "products/star-bubble.webp", maxWidth: 1920, maxHeight: 1920, quality: 74 },
  { source: "products/cross-bubble.png", target: "products/cross-bubble.webp", maxWidth: 1920, maxHeight: 1920, quality: 74 },
  { source: "products/RL-gold-2.png", target: "products/RL-gold-2.webp", maxWidth: 1920, maxHeight: 1920, quality: 74 },
  { source: "products/gold-2.png", target: "products/gold-2.webp", maxWidth: 1920, maxHeight: 1920, quality: 74 },
  { source: "about/history/your-chapter.jpg", target: "about/history/your-chapter.webp", maxWidth: 1920, maxHeight: 1920, quality: 78 },
  { source: "about/history/the-living-community.jpg", target: "about/history/the-living-community.webp", maxWidth: 1920, maxHeight: 1920, quality: 78 },
  { source: "about/history/year-one-everything.png", target: "about/history/year-one-everything.webp", maxWidth: 1920, maxHeight: 1920, quality: 78 },
  { source: "about/history/bg-star.png", target: "about/history/bg-star.webp", maxWidth: 2048, maxHeight: 2048, quality: 72 },
  { source: "partners/decor-asset-1.png", target: "partners/decor-asset-1.webp", maxWidth: 1920, maxHeight: 1920, quality: 74 },
  { source: "auth/auth-horizon.png", target: "auth/auth-horizon.webp", maxWidth: 1920, maxHeight: 1920, quality: 76 },
  { source: "auth/auth-sparky.png", target: "auth/auth-sparky.webp", maxWidth: 1600, maxHeight: 1600, quality: 78 },
  { source: "pages/events/event-cover.png", target: "pages/events/event-cover.webp", maxWidth: 1920, maxHeight: 1920, quality: 78 },
];

const svgAssets = [
  "about/about-benefits-decor-right.svg",
  "member-showcase/member-showcase-spotlight-placeholder.svg",
  "member-showcase/member-showcase-sparky-leaderboard-1.svg",
  "pages/events/event-cover.svg",
  "pages/events/gallery-preview-year.svg",
];

function toAbsolutePublicPath(relativePath: string): string {
  return path.join(PUBLIC_DIR, relativePath);
}

function formatBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

async function optimizeRaster(asset: RasterAssetConfig) {
  const inputPath = toAbsolutePublicPath(asset.source);
  const outputPath = toAbsolutePublicPath(asset.target);

  if (!fs.existsSync(inputPath)) {
    throw new Error(`Missing source file: ${asset.source}`);
  }

  const beforeSize = fs.statSync(inputPath).size;

  await sharp(inputPath)
    .rotate()
    .resize(asset.maxWidth, asset.maxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: asset.quality,
      effort: 6,
      smartSubsample: true,
    })
    .toFile(outputPath);

  const afterSize = fs.statSync(outputPath).size;

  return {
    source: asset.source,
    target: asset.target,
    beforeSize,
    afterSize,
  };
}

function optimizeSvg(relativePath: string) {
  const absolutePath = toAbsolutePublicPath(relativePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Missing SVG file: ${relativePath}`);
  }

  const beforeSize = fs.statSync(absolutePath).size;
  const raw = fs.readFileSync(absolutePath, "utf8");

  const result = optimize(raw, {
    path: absolutePath,
    multipass: true,
  });

  if (!("data" in result)) {
    throw new Error(`SVGO failed for: ${relativePath}`);
  }

  fs.writeFileSync(absolutePath, result.data, "utf8");

  const afterSize = fs.statSync(absolutePath).size;

  return {
    path: relativePath,
    beforeSize,
    afterSize,
  };
}

async function main() {
  console.log("Optimizing raster assets...");

  const rasterResults = [];
  for (const asset of rasterAssets) {
    const result = await optimizeRaster(asset);
    rasterResults.push(result);
  }

  console.log("Optimizing SVG assets...");

  const svgResults = svgAssets.map((svg) => optimizeSvg(svg));

  console.log("\nRaster summary:");
  for (const item of rasterResults) {
    console.log(
      `- ${item.source} -> ${item.target}: ${formatBytes(item.beforeSize)} -> ${formatBytes(item.afterSize)}`,
    );
  }

  console.log("\nSVG summary:");
  for (const item of svgResults) {
    console.log(
      `- ${item.path}: ${formatBytes(item.beforeSize)} -> ${formatBytes(item.afterSize)}`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
