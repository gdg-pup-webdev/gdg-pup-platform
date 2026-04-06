import { deleteFileFromGcs, uploadFileToGcs } from "./gcs-storage";

async function main() {
  const keepUploadedFile = process.argv.includes("--keep");
  const sampleContent = `Local GCS upload test at ${new Date().toISOString()}`;
  const arrayBuffer = new TextEncoder().encode(sampleContent).buffer as ArrayBuffer;

  const uploaded = await uploadFileToGcs({
    arrayBuffer,
    fileName: "local-gcs-upload.txt",
    fileType: "text/plain",
  });

  console.log("Upload completed.");
  console.log(JSON.stringify(uploaded, null, 2));

  if (keepUploadedFile) {
    console.log("Skipping delete because --keep was provided.");
    return;
  }

  const deleted = await deleteFileFromGcs(uploaded.reference);
  console.log("Delete completed.");
  console.log(JSON.stringify(deleted, null, 2));
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("GCS local test failed:", message);
  process.exit(1);
});
