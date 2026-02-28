 import { configs } from "@/v1/configs/configs";
import { FileBuffer } from "../domain/FileBuffer";
import { IFileStorage } from "../domain/IFileStorage";
import { UploadedFileBuffer } from "../domain/UploadedFileBuffer";
import { supabase } from "@/v1/lib/supabase";
 
export class SupabaseFileStorage implements IFileStorage {
  private readonly BUCKET_NAME = configs.supabase.storageBucket;

  async uploadFileBuffer(file: FileBuffer): Promise<UploadedFileBuffer> {
    // 1. Generate a unique path/reference for the storage
    // Using a timestamp prefix to avoid naming collisions
    const fileExtension = file.name.split(".").pop();
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
    const storagePath = `uploads/${fileName}`;

    // 2. Upload the ArrayBuffer to Supabase Storage
    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .upload(storagePath, file.arraybuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      throw new Error(`Failed to upload file to Supabase: ${error.message}`);
    }

    // 3. Get the Public URL
    const { data: publicUrlData } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(data.path);

    // 4. Return the domain object
    return new UploadedFileBuffer(
      data.path, // storage_reference
      publicUrlData.publicUrl, // public_url
    );
  }

  async deleteFile(storageReference: string): Promise<boolean> {
    const { error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .remove([storageReference]);

    if (error) {
      throw new Error(`Failed to delete file from Supabase: ${error.message}`);
    }

    return true;
  }
}
