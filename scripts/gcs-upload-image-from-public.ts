import fs from "node:fs/promises";
import path from "node:path";

import { uploadFileToGcs } from "./gcs-storage";

const contentTypeFromExtension = (filePath: string): string => {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
};

async function main() {
  const filePathArg = process.argv[2];

  if (!filePathArg) {
    throw new Error(
      "Missing file path argument. Example: tsx --env-file=apps/nexus-api/.env scripts/gcs-upload-image-from-public.ts apps/nexus-web/public/profile-avatar-ring.png",
    );
  }

  const absoluteFilePath = path.resolve(filePathArg);
  const fileBuffer = await fs.readFile(absoluteFilePath);
  const arrayBuffer = fileBuffer.buffer.slice(
    fileBuffer.byteOffset,
    fileBuffer.byteOffset + fileBuffer.byteLength,
  ) as ArrayBuffer;

  const uploadResult = await uploadFileToGcs({
    arrayBuffer,
    fileName: path.basename(absoluteFilePath),
    fileType: contentTypeFromExtension(absoluteFilePath),
  });

  console.log(
    JSON.stringify(
      {
        sourceFile: filePathArg,
        ...uploadResult,
      },
      null,
      2,
    ),
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("GCS image upload failed:", message);
  process.exit(1);
});
