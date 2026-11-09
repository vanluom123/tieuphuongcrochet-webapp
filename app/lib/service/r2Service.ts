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

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return typeof body?.error === "string" ? body.error : "";
  } catch {
    return "";
  }
}

export async function uploadVideoToR2(
  file: File
): Promise<FileUpload & { fileName: string }> {
  const formData = new FormData();
  formData.append("page", "settings");
  formData.append("category", "video-popups");
  formData.append("files", file);

  const res = await fetch(API_ROUTES.R2_PRESIGNED, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const message = await readErrorMessage(res);
    throw new Error(message || `Video upload failed with status ${res.status}`);
  }

  const { publicUrls } = await res.json();
  const uploaded = publicUrls?.[0];
  if (!uploaded?.fileContent || !uploaded.fileName) {
    throw new Error("Video upload returned no file");
  }
  return uploaded;
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