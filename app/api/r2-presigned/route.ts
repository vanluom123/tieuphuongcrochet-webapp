import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { extname } from "path";
import { v4 as uuidv4 } from "uuid";
import { FileUpload } from "@/app/lib/definitions";
import { USER_ROLES, VIDEO_UPLOAD } from "@/app/lib/constant";
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY || "",
    secretAccessKey: process.env.R2_SECRET_KEY || "",
  },
  forcePathStyle: true,
});

const LONG_UPLOAD_TIMEOUT_MS = 120_000;
const SAFE_SEGMENT = /^[a-z0-9_-]{1,64}$/;
const VIDEO_TYPE_ERROR = "Video must be mp4 or webm";
const VIDEO_SIZE_ERROR = "Video must be at most 100MB";

interface VideoValidation {
  valid: boolean;
  error?: string;
}

function readSegment(value: FormDataEntryValue | null, fallback: string): string {
  const raw = value?.toString().trim().toLowerCase() ?? "";
  return SAFE_SEGMENT.test(raw) ? raw : fallback;
}

function readFiles(formData: FormData): File[] {
  return formData.getAll("files").filter((entry): entry is File => entry instanceof File);
}

function validateVideoFile(file: File): VideoValidation {
  const extension = extname(file.name).toLowerCase();
  if (!VIDEO_UPLOAD.MIME_TYPES.includes(file.type) || !VIDEO_UPLOAD.EXTENSIONS.includes(extension)) {
    return { valid: false, error: VIDEO_TYPE_ERROR };
  }
  if (file.size > VIDEO_UPLOAD.MAX_BYTES) {
    return { valid: false, error: VIDEO_SIZE_ERROR };
  }
  return { valid: true };
}

async function getSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

function parseDeleteKeys(body: unknown): string[] | null {
  if (typeof body !== "object" || body === null) return null;
  const { keys } = body as { keys?: unknown };
  if (!Array.isArray(keys) || keys.length === 0) return null;
  if (!keys.every((key): key is string => typeof key === "string" && key.length > 0)) return null;
  return keys;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = readFiles(formData);
    const page = readSegment(formData.get("page"), "general");
    const category = readSegment(formData.get("category"), "uncategorized");

    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const isVideoPopupUpload = page === "settings" && category === "video-popups";

    if (isVideoPopupUpload) {
      const user = await getSessionUser();
      if (user?.role !== USER_ROLES.ADMIN) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (files.length !== 1) {
        return NextResponse.json({ error: "Upload one video at a time" }, { status: 400 });
      }
      const validation = validateVideoFile(files[0]);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
    }

    const uploadedUrls: FileUpload[] = [];

    for (const file of files) {

      const uniqueFileName = `${uuidv4()}${extname(file.name)}`;
      const env = process.env.NEXT_PUBLIC_ENV || "local"; // fallback nếu chưa khai báo
      const key = `${env}/${page}/${category}/${uniqueFileName}`;

      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        ContentType: file.type,
      });

      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
        signal: isVideoPopupUpload ? AbortSignal.timeout(LONG_UPLOAD_TIMEOUT_MS) : undefined,
      });

      if (!uploadRes.ok) {
        console.error(`Upload failed for ${file.name}`, await uploadRes.text());
        if (isVideoPopupUpload) {
          return NextResponse.json({ error: "Video upload failed" }, { status: 502 });
        }
        continue;
      }

      uploadedUrls.push({
        url: `${process.env.R2_CDN_URL}/${key}`,
        fileContent: `${process.env.R2_CDN_URL}/${key}`,
        name: file.name, // Tên file gốc
        fileName: key, // Tên file sau khi đã uploaded
        uid: uniqueFileName,
      });
    }

    return NextResponse.json({ publicUrls: uploadedUrls });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await getSessionUser())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const keys = parseDeleteKeys(await req.json());
    if (!keys) {
      return NextResponse.json(
        { error: "Missing or invalid keys" },
        { status: 400 }
      );
    }

    const command = new DeleteObjectsCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
      },
    });

    const result = await s3.send(command);
    
    const deleted = result.Deleted?.map((d) => d.Key) ?? [];
    const errors =
      result.Errors?.map((e) => ({
        key: e.Key,
        message: e.Message,
      })) ?? [];
    return NextResponse.json({
      success: errors.length === 0,
      deleted,
      errors,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
