
/**
 * Raw file buffer containing byte files that makes the file.
 * - the buffer is required to upload data to storage
 */
export class FileBuffer {
  constructor(
    public arraybuffer: ArrayBuffer,
    public name: string,
    public type: string,
  ) {}
}
