import crypto from "node:crypto";
import sharp from "sharp";
import { FileBuffer } from "../domain/FileBuffer";
import {
  IMAGE_VARIANT_SIZES,
  IImageResizer,
  ImageVariantSize,
  ImageVariantUploads,
} from "../domain/IImageResizer";
import { IFileStorage } from "../domain/IFileStorage";

type UploadedVariant = {
  size: ImageVariantSize;
  uploaded: Awaited<ReturnType<IFileStorage["uploadFileBuffer"]>>;
};

export class SharpImageResizer implements IImageResizer {
  constructor(private readonly fileStorage: IFileStorage) {}

  private sanitizeBaseName(fileName: string): string {
    const withoutExtension = fileName.replace(/\.[^./\\]+$/, "").trim();
    const fallbackName = withoutExtension || "image";
    return fallbackName.replace(/[^a-zA-Z0-9._-]/g, "_");
  }

  private toArrayBuffer(buffer: Buffer): ArrayBuffer {
    const view = Uint8Array.from(buffer);
    return view.buffer;
  }

  async resizeAndUpload(file: FileBuffer): Promise<ImageVariantUploads | null> {
    if (!file.type.startsWith("image/")) {
      return null;
    }

    const imageBuffer = Buffer.from(new Uint8Array(file.arraybuffer));
    const metadata = await sharp(imageBuffer).metadata();
    const originalWidth = metadata.width || 0;
    const originalHeight = metadata.height || 0;
    const baseName = `${Date.now()}-${crypto.randomUUID()}-${this.sanitizeBaseName(file.name)}`;

    const settled = await Promise.allSettled(
      IMAGE_VARIANT_SIZES.map(async (size): Promise<UploadedVariant> => {
        let pipeline = sharp(imageBuffer);

        if (Math.max(originalWidth, originalHeight) > size) {
          const isLandscape = originalWidth >= originalHeight;
          pipeline = pipeline.resize({
            width: isLandscape ? size : undefined,
            height: !isLandscape ? size : undefined,
            withoutEnlargement: true,
          });
        }

        const webpBuffer = await pipeline.webp({ quality: 90 }).toBuffer();
        const resizedFile = new FileBuffer(
          this.toArrayBuffer(webpBuffer),
          `${baseName}_${size}.webp`,
          "image/webp",
        );

        const uploaded = await this.fileStorage.uploadFileBuffer(resizedFile);
        return { size, uploaded };
      }),
    );

    const variants: ImageVariantUploads = {};
    settled.forEach((result) => {
      if (result.status === "fulfilled") {
        variants[result.value.size] = result.value.uploaded;
      }
    });

    return Object.keys(variants).length > 0 ? variants : null;
  }
}
