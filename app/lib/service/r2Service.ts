import { API_ROUTES } from "../constant";
import { FileUpload } from "../definitions";

export async function uploadImageToR2(
  file: File, 
  page: string,
  category: string = ''
): Promise<FileUpload[]> {
  try {
    const formData = new FormData();
    formData.append("page", page);
    formData.append("category", category);
    formData.append("files", file); 

    const res = await fetch(API_ROUTES.R2_PRESIGNED, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      console.error("Multi-upload failed:", await res.text());
      return [];
    }

    const { publicUrls } = await res.json();
    return publicUrls;
  } catch (err) {
    console.error("Upload error:", err);
    return [];
  }
}

export async function uploadMultipleImagesToR2(
  files: FileUpload[], 
  page: string,
  category: string = ''
): Promise<FileUpload[]> {
  try {
    const formData = new FormData();
    formData.append("page", page);
    formData.append("category", category);

    for (const file of files) {
      formData.append("files", file.originFileObj as File); // same key for multiple files
    }

    const res = await fetch(API_ROUTES.R2_PRESIGNED, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      console.error("Multi-upload failed:", await res.text());
      return [];
    }

    const { publicUrls } = await res.json();
    return publicUrls;
  } catch (err) {
    console.error("Upload error:", err);
    return [];
  }
}

export async function deleteMultipleFilesToR2(keys: string[]): Promise<boolean> {
  try {
    const response = await fetch(API_ROUTES.R2_PRESIGNED, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keys }),
    });

    if (!response.ok) {
      console.error("Failed to delete files:", await response.text());
      return false;
    }

    const result = await response.json();
    return Array.isArray(result.deleted) && result.deleted.length > 0;
  } catch (error) {
    console.error("Error deleting files:", error);
    return false;
  }
}