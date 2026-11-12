import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { extname } from "path";
import type { FileUpload } from "@/app/lib/definitions";
import { USER_ROLES, VIDEO_UPLOAD } from "@/app/lib/constant";
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";

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

function readFiles(formData: FormData): File[] | null {
  const entries = formData.getAll("files");
  return entries.every((entry): entry is File => entry instanceof File) ? entries : null;
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

interface UploadReservation {
  objectKey: string;
  publicUrl: string;
  signedUrl: string;
}

function parseReservation(body: unknown): UploadReservation | null {
  if (typeof body !== "object" || body === null) return null;
  const { success, data } = body as { success?: unknown; data?: unknown };
  if (success !== true || typeof data !== "object" || data === null) return null;
  const reservation = data as Partial<UploadReservation>;
  if (
    typeof reservation.objectKey !== "string" || !reservation.objectKey.split("/").pop() ||
    typeof reservation.publicUrl !== "string" || !reservation.publicUrl.trim() ||
    typeof reservation.signedUrl !== "string" || !reservation.signedUrl.trim()
  ) return null;
  return reservation as UploadReservation;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user?.accessToken || session?.error) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const formData = await req.formData();
    const files = readFiles(formData);
    const page = readSegment(formData.get("page"), "general");
    const category = readSegment(formData.get("category"), "uncategorized");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Missing or invalid files" }, { status: 400 });
    }

    const isVideoPopupUpload = page === "settings" && category === "video-popups";

    if (isVideoPopupUpload) {
      if (user.role !== USER_ROLES.ADMIN) {
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

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
    if (!apiUrl) {
      return NextResponse.json({ error: "Upload service is not configured" }, { status: 500 });
    }

    const uploadedUrls: FileUpload[] = [];
    for (const file of files) {
      const contentType = file.type || "application/octet-stream";
      const reservationRes = await fetch(`${apiUrl}/api/v1/uploads/presigned`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ module: page, category, fileName: file.name, contentType, size: file.size }),
        cache: "no-store",
        signal: AbortSignal.timeout(LONG_UPLOAD_TIMEOUT_MS),
      });
      if (!reservationRes.ok) {
        const status = reservationRes.status >= 400 && reservationRes.status < 500 ? reservationRes.status : 502;
        return NextResponse.json({ error: `Upload reservation failed with status ${reservationRes.status}` }, { status });
      }
      const reservation = parseReservation(await reservationRes.json());
      if (!reservation) {
        return NextResponse.json({ error: "Invalid upload reservation response" }, { status: 502 });
      }

      const uploadRes = await fetch(reservation.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: file,
        signal: AbortSignal.timeout(LONG_UPLOAD_TIMEOUT_MS),
      });
      if (!uploadRes.ok) {
        return NextResponse.json({ error: "Upload failed" }, { status: 502 });
      }

      uploadedUrls.push({
        url: reservation.publicUrl,
        fileContent: reservation.publicUrl,
        name: file.name,
        fileName: reservation.objectKey,
        uid: reservation.objectKey.split("/").pop()!,
      });
    }

    return NextResponse.json({ publicUrls: uploadedUrls });
  } catch {
    // Network errors can contain signed URLs; do not log or expose their details.
    return NextResponse.json({ error: "Upload failed" }, { status: 502 });
  }
}
