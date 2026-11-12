import { API_ROUTES } from "../constant";
import type { FileUpload } from "../definitions";

export async function uploadImageToR2(
  file: File,
  page: string,
  category: string = ''
): Promise<FileUpload[]> {
  return uploadFiles([file], page, category);
}

export async function uploadMultipleImagesToR2(
  files: FileUpload[],
  page: string,
  category: string = ''
): Promise<FileUpload[]> {
  const originals = files.map((file) => {
    if (!(file.originFileObj instanceof File)) {
      throw new Error(`Missing upload file: ${file.name}`);
    }
    return file.originFileObj;
  });
  return uploadFiles(originals, page, category);
}

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return typeof body?.error === "string" ? body.error : "";
  } catch {
    return "";
  }
}

type UploadedFile = FileUpload & { fileName: string };
export type UploadedVideo = UploadedFile;

function isUploadedFile(value: unknown): value is UploadedFile {
  if (typeof value !== "object" || value === null) return false;
  const file = value as Record<string, unknown>;
  return ["uid", "name", "url", "fileContent", "fileName"].every(
    (key) => typeof file[key] === "string" && file[key].trim().length > 0
  );
}

function parseUploadedFiles(body: unknown, expectedCount: number): UploadedFile[] {
  const publicUrls = (body as { publicUrls?: unknown } | null)?.publicUrls;
  if (!Array.isArray(publicUrls) || publicUrls.length !== expectedCount || !publicUrls.every(isUploadedFile)) {
    throw new Error(`Upload returned invalid or incomplete files (expected ${expectedCount})`);
  }
  return publicUrls;
}

async function uploadFiles(files: File[], page: string, category: string): Promise<UploadedFile[]> {
  if (files.length === 0 || files.some((file) => !(file instanceof File))) {
    throw new Error("No valid files selected for upload");
  }
  const formData = new FormData();
  formData.append("page", page);
  formData.append("category", category);
  for (const file of files) formData.append("files", file);

  let res: Response;
  try {
    res = await fetch(API_ROUTES.R2_PRESIGNED, { method: "POST", body: formData });
  } catch {
    throw new Error("Upload request failed. Please try again.");
  }
  if (!res.ok) {
    const message = await readErrorMessage(res);
    throw new Error(message || `Upload failed with status ${res.status}`);
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    throw new Error("Upload returned an invalid response");
  }
  return parseUploadedFiles(body, files.length);
}

export async function uploadVideoToR2(file: File): Promise<UploadedVideo> {
  const uploaded = await uploadFiles([file], "settings", "video-popups");
  return uploaded[0];
}