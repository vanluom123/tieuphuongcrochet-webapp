import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Utility function to safely convert a File to a Buffer
async function fileToBuffer(file: File): Promise<Buffer> {
  try {
    // Use arrayBuffer for modern browsers
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error("Error converting file to buffer:", error);

    // Fallback for older browsers or if arrayBuffer fails
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(Buffer.from(reader.result));
        } else if (typeof reader.result === "string") {
          resolve(Buffer.from(reader.result, "utf-8"));
        } else {
          reject(new Error("FileReader result is null or invalid type"));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }
}

// Define a type for S3 file responses
export interface FileResponse {
  fileName: string;
  fileContent: string;
  lastModified?: Date;
  order?: number;
}

class CloudflareR2Service {
  private client: S3Client;
  private bucketName: string;
  private env: string;

  constructor() {
    // Get environment variables
    const accessKeyId = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_ACCESS_KEY;
    const secretAccessKey = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_SECRET_KEY;
    const endpoint = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_ENDPOINT;
    this.bucketName =
      process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME || "default-bucket";

    // Default environment to 'prod' if not specified
    this.env = process.env.NEXT_PUBLIC_ENV || "prod";

    // Create S3 client with browser-compatible configuration
    this.client = new S3Client({
      region: "auto",
      credentials: {
        accessKeyId: accessKeyId || "",
        secretAccessKey: secretAccessKey || "",
      },
      endpoint: endpoint,
      // Use path style access for Cloudflare R2
      forcePathStyle: true,
      // Disable chunked encoding to avoid readableStream issues in browser
      // requestHandler: new FetchHttpHandler(),
      // Set maximum attempts to 3 to avoid excessive retries
      maxAttempts: 3,
    });
  }

  /**
   * Upload a file to Cloudflare R2
   * @param file The file to upload
   * @returns Promise with file response
   */
  async uploadFile(file: File): Promise<FileResponse> {
    try {
      // Generate a unique file name
      const fileExtension = this.getFileExtension(file.name);
      console.log("fileExtension", fileExtension);
      const uniqueFileName = this.generateUniqueFileName(fileExtension);
      console.log("uniqueFileName", uniqueFileName);
      const key = `${this.env}/${uniqueFileName}`;
      console.log("key", key);

      // Try the primary upload method first
      try {
        // Convert File to Buffer using our utility function to avoid readableStream issues
        const fileBuffer = await fileToBuffer(file);
        console.log("fileBuffer", fileBuffer);

        // Create command to upload file
        const putCommand = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: fileBuffer,
          ContentType: file.type,
        });

        // Upload the file
        console.log("putCommand", putCommand);
        await this.client.send(putCommand);
        console.log("File uploaded successfully");
      } catch (uploadError) {
        console.warn(
          "Primary upload method failed, trying fallback 1:",
          uploadError
        );

        try {
          // Fallback method 1: using Blob and ArrayBuffer
          const blob = new Blob([await file.arrayBuffer()], {
            type: file.type,
          });
          console.log("blob", blob);
          const arrayBuffer = await blob.arrayBuffer();
          console.log("arrayBuffer", arrayBuffer);

          const putCommand = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: Buffer.from(arrayBuffer),
            ContentType: file.type,
          });

          // Upload with fallback method 1
          console.log("putCommand", putCommand);
          await this.client.send(putCommand);
        } catch (fallbackError) {
          console.warn("Fallback 1 failed, trying fallback 2:", fallbackError);

          // Fallback method 2: using base64 string
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
          });

          reader.readAsDataURL(file);
          const base64Data = await base64Promise;
          console.log("base64Data", base64Data);
          const base64Content = base64Data.split(",")[1];
          console.log("base64Content", base64Content);

          const putCommand = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: Buffer.from(base64Content, "base64"),
            ContentType: file.type,
          });

          // Upload with fallback method 2
          console.log("putCommand", putCommand);
          await this.client.send(putCommand);
        }
      }

      // Generate a public URL for the file
      const cdnUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_CDN_URL;
      let fileUrl = "";

      if (cdnUrl) {
        // Use the CDN URL if available - ensure no double slashes
        const cleanKey = key.startsWith("/") ? key.substring(1) : key;
        fileUrl = `${cdnUrl}/${cleanKey}`;

        // Log the CDN URL for debugging
        console.log("Using CDN URL for file access:", fileUrl);
      } else {
        // Only use presigned URLs as a fallback if CDN is not configured
        console.warn(
          "CDN URL not configured, falling back to presigned URL. This is not recommended for production."
        );
        fileUrl = await this.getPresignedUrl(key);
      }

      // Return file response
      return {
        fileName: key,
        fileContent: fileUrl,
        lastModified: new Date(),
      };
    } catch (error) {
      console.error("Error uploading file to Cloudflare R2:", error);
      throw new Error(
        `Failed to upload file: ${file.name}. ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Upload multiple files to Cloudflare R2
   * @param files Array of files to upload
   * @returns Promise with array of file responses
   */
  async uploadMultipleFiles(files: File[]): Promise<FileResponse[]> {
    try {
      if (!files.length) {
        return [];
      }

      const promises = files.map((file, index) =>
        this.uploadFile(file).then((response) => {
          return { ...response, order: index };
        })
      );

      return await Promise.all(promises);
    } catch (error) {
      console.error("Error uploading multiple files to Cloudflare R2:", error);
      throw new Error(
        `Failed to upload multiple files. ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Delete a file from Cloudflare R2
   * @param fileName Name of the file to delete
   * @returns Promise that resolves when the file is deleted
   */
  async deleteFile(fileName: string): Promise<void> {
    try {
      if (!fileName) {
        console.warn("Attempted to delete a file with an empty file name");
        return;
      }

      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
      });

      await this.client.send(deleteCommand);
    } catch (error) {
      console.error(
        `Error deleting file ${fileName} from Cloudflare R2:`,
        error
      );
      throw new Error(
        `Failed to delete file: ${fileName}. ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Delete multiple files from Cloudflare R2
   * @param fileNames Array of file names to delete
   * @returns Promise with array of files that couldn't be deleted
   */
  async deleteMultipleFiles(fileNames: string[]): Promise<string[]> {
    try {
      if (!fileNames.length) {
        return [];
      }

      // Filter out empty file names
      const validFileNames = fileNames.filter((name) => !!name);

      if (validFileNames.length === 0) {
        return [];
      }

      const results = await Promise.allSettled(
        validFileNames.map((fileName) => this.deleteFile(fileName))
      );

      // Return file names that failed to delete
      const failedFiles = validFileNames.filter(
        (_, index) => results[index].status === "rejected"
      );

      if (failedFiles.length > 0) {
        console.warn(
          `Failed to delete ${failedFiles.length} files from Cloudflare R2`
        );
      }

      return failedFiles;
    } catch (error) {
      console.error("Error deleting multiple files from Cloudflare R2:", error);
      throw new Error(
        `Failed to delete multiple files. ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * List all files in a directory in Cloudflare R2
   * @param directory Optional directory path
   * @returns Promise with array of file names
   */
  async listFiles(directory?: string): Promise<string[]> {
    try {
      const prefix = directory ? `${directory}/` : "";

      const listCommand = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
      });

      const result = await this.client.send(listCommand);
      const files = result.Contents || [];

      return files.map((file) => file.Key || "");
    } catch (error) {
      console.error(
        `Error listing files in directory ${
          directory || "root"
        } from Cloudflare R2:`,
        error
      );
      throw new Error(
        `Failed to list files. ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Generate a public URL for a file in the bucket
   * @param key The file key in the bucket
   * @returns The public URL for the file
   */
  async getPublicUrl(key: string): Promise<string> {
    try {
      if (!key) {
        throw new Error("Key is required to generate a public URL");
      }

      // Clean the key if needed
      const cleanKey = key.startsWith("/") ? key.substring(1) : key;

      // Try to use CDN URL if available
      const cdnUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_CDN_URL;

      if (cdnUrl) {
        return `${cdnUrl}/${cleanKey}`;
      } else {
        // Fall back to presigned URL if CDN is not configured
        return await this.getPresignedUrl(cleanKey);
      }
    } catch (error) {
      console.error(`Error generating public URL for key ${key}:`, error);
      throw new Error(
        `Failed to generate public URL. ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Generate a presigned URL for accessing a private object
   * @param key Object key in the bucket
   * @returns Presigned URL
   */
  private async getPresignedUrl(key: string): Promise<string> {
    try {
      if (!key) {
        throw new Error("Key is required to generate a presigned URL");
      }

      // Use GetObjectCommand for retrieving files, not PutObjectCommand
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      // Generate URL that expires in 7 days
      return await getSignedUrl(this.client, command, { expiresIn: 604800 });
    } catch (error) {
      console.error(`Error generating presigned URL for key ${key}:`, error);
      throw new Error(
        `Failed to generate presigned URL. ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Generate a unique file name with the given extension
   * @param extension File extension including the dot
   * @returns Unique file name
   */
  private generateUniqueFileName(extension: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    return `${timestamp}-${randomString}${extension}`;
  }

  /**
   * Get file extension from file name
   * @param fileName File name
   * @returns File extension including the dot
   */
  private getFileExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf(".");
    return lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : "";
  }

  async uploadImageToR2(file: File): Promise<FileResponse> {
    try {
      // Kiểm tra định dạng hình ảnh
      if (!file.type.startsWith("image/")) {
        throw new Error("File không phải là hình ảnh.");
      }

      // Tạo file name duy nhất
      const fileExtension = this.getFileExtension(file.name);
      const uniqueFileName = this.generateUniqueFileName(fileExtension);
      const key = `${this.env}/images/${uniqueFileName}`;

      // Đọc file thành Uint8Array
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Gửi lệnh upload
      const putCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: uint8Array,
        ContentType: file.type,
      });

      await this.client.send(putCommand);

      // Tạo URL truy cập công khai
      const fileUrl = await this.getPublicUrl(key);

      return {
        fileName: key,
        fileContent: fileUrl,
        lastModified: new Date(),
      };
    } catch (error) {
      console.error("Lỗi khi upload hình ảnh:", error);
      throw new Error(
        `Không thể upload hình ảnh: ${file.name}. ${
          error instanceof Error ? error.message : "Lỗi không xác định"
        }`
      );
    }
  }
}

export default new CloudflareR2Service();
