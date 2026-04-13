import { FileBuffer } from "./FileBuffer";
import { UploadedFileBuffer } from "./UploadedFileBuffer";

export const IMAGE_VARIANT_SIZES = [64, 128, 256, 512, 1024] as const;

export type ImageVariantSize = (typeof IMAGE_VARIANT_SIZES)[number];

export type ImageVariantUploads = Partial<
  Record<ImageVariantSize, UploadedFileBuffer>
>;

export abstract class IImageResizer {
  abstract resizeAndUpload(file: FileBuffer): Promise<ImageVariantUploads | null>;
}
