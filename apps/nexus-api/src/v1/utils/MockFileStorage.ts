import { vol } from "memfs";

export interface MockFile {
  buffer: ArrayBuffer;
  name: string;
  type: string;
}

export interface MockUploadedFile {
  storageReference: string;
  publicUrl: string;
}

/**
 * Independent Mock file storage that uses memfs for in-memory storage.
 * Acts as a general-purpose storage client shared across the application.
 */
class MockFileStorage {
  private readonly rootDir = "/uploads";

  constructor() {
    if (!vol.existsSync(this.rootDir)) {
      vol.mkdirSync(this.rootDir, { recursive: true });
    }
  }

  async upload(file: MockFile): Promise<MockUploadedFile> {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${this.rootDir}/${fileName}`;
    
    vol.writeFileSync(filePath, Buffer.from(file.buffer));

    return {
      storageReference: filePath,
      publicUrl: `https://mock-storage.com${filePath}`,
    };
  }

  async delete(storageReference: string): Promise<boolean> {
    try {
      if (vol.existsSync(storageReference)) {
        vol.unlinkSync(storageReference);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  exists(storageReference: string): boolean {
    return vol.existsSync(storageReference);
  }

  /**
   * Resets the entire in-memory filesystem.
   * Useful for testing isolation.
   */
  reset(): void {
    vol.reset();
    vol.mkdirSync(this.rootDir, { recursive: true });
  }
}

// Export a singleton instance
export const mockFileStorage = new MockFileStorage();
