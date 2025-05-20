import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

    // Create S3 client
    this.client = new S3Client({
      region: "auto",
      credentials: {
        accessKeyId: accessKeyId || "",
        secretAccessKey: secretAccessKey || "",
      },
      endpoint: endpoint,
      // Use path style access for Cloudflare R2
      forcePathStyle: true,
    });
  }

  /**
   * Upload a file to Cloudflare R2
   * @param file The file to upload
   * @returns Promise with file response
   */
  async uploadFile(file: File): Promise<FileResponse> {
    // Generate a unique file name
    const fileExtension = this.getFileExtension(file.name);
    const uniqueFileName = this.generateUniqueFileName(fileExtension);
    const key = `${this.env}/${uniqueFileName}`;

    // Create command to upload file
    const putCommand = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: file.type,
    });

    // Upload the file
    await this.client.send(putCommand);

    // Generate a public URL for the file
    const cdnUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_CDN_URL;
    let fileUrl = "";

    if (cdnUrl) {
      // Use the CDN URL if available
      fileUrl = `${cdnUrl}/${key}`;
    } else {
      // Generate a presigned URL
      fileUrl = await this.getPresignedUrl(key);
    }

    // Return file response
    return {
      fileName: key,
      fileContent: fileUrl,
      lastModified: new Date(),
    };
  }

  /**
   * Upload multiple files to Cloudflare R2
   * @param files Array of files to upload
   * @returns Promise with array of file responses
   */
  async uploadMultipleFiles(files: File[]): Promise<FileResponse[]> {
    const promises = files.map((file, index) =>
      this.uploadFile(file).then((response) => {
        return { ...response, order: index };
      })
    );

    return Promise.all(promises);
  }

  /**
   * Delete a file from Cloudflare R2
   * @param fileName Name of the file to delete
   * @returns Promise that resolves when the file is deleted
   */
  async deleteFile(fileName: string): Promise<void> {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
    });

    await this.client.send(deleteCommand);
  }

  /**
   * Delete multiple files from Cloudflare R2
   * @param fileNames Array of file names to delete
   * @returns Promise with array of files that couldn't be deleted
   */
  async deleteMultipleFiles(fileNames: string[]): Promise<string[]> {
    const results = await Promise.allSettled(
      fileNames.map((fileName) => this.deleteFile(fileName))
    );

    // Return file names that failed to delete
    return fileNames.filter(
      (fileName, index) => results[index].status === "rejected"
    );
  }

  /**
   * List all files in a directory in Cloudflare R2
   * @param directory Optional directory path
   * @returns Promise with array of file names
   */
  async listFiles(directory?: string): Promise<string[]> {
    const prefix = directory ? `${directory}/` : "";

    const listCommand = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: prefix,
    });

    const result = await this.client.send(listCommand);
    const files = result.Contents || [];

    return files.map((file) => file.Key || "");
  }

  /**
   * Generate a presigned URL for accessing a private object
   * @param key Object key in the bucket
   * @returns Presigned URL
   */
  private async getPresignedUrl(key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    // Generate URL that expires in 7 days
    return await getSignedUrl(this.client, command, { expiresIn: 604800 });
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
}

export default new CloudflareR2Service();
