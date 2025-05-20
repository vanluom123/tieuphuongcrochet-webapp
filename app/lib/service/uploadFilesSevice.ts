import cloudflareR2Service from "./cloudflareR2Service";

const uploadFile = {
  /**
   * Upload a file to the storage service
   * @param formData The form data containing the files to upload
   * @returns The uploaded file data
   */
  async upload(formData: FormData): Promise<any> {
    // Extract files from form data
    const files: File[] = [];
    formData.getAll("files").forEach((item) => {
      if (item instanceof File) {
        files.push(item);
      }
    });

    // Use direct Cloudflare R2 upload
    return await cloudflareR2Service.uploadMultipleFiles(files);
  },

  /**
   * Delete files from the storage service
   * @param fileNames Array of file names to delete
   * @returns Result of the delete operation
   */
  async delete(fileNames: string[]): Promise<any> {
    // Use direct Cloudflare R2 delete
    return await cloudflareR2Service.deleteMultipleFiles(fileNames);
  }
};

export default uploadFile;
