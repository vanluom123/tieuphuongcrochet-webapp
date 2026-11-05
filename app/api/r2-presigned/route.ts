import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { FileUpload } from "@/app/lib/definitions";
import { v4 as uuidv4 } from "uuid";
import { extname } from "path";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY || "",
    secretAccessKey: process.env.R2_SECRET_KEY || "",
  },
  forcePathStyle: true,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const page = formData.get("page")?.toString().trim().toLowerCase() || "general";
    const category = formData.get("category")?.toString().trim().toLowerCase() || "uncategorized";

    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const videoTypes = new Set(["video/mp4", "video/webm"]);
    const maxVideoBytes = 100 * 1024 * 1024;
    for (const file of files) {
      if (!file.type.startsWith("video/")) continue;
      if (!videoTypes.has(file.type) || file.size > maxVideoBytes) {
        return NextResponse.json(
          { error: "Video must be mp4 or webm and at most 100MB" },
          { status: 400 },
        );
      }
    }

    const uploadedUrls: FileUpload[] = [];

    for (const file of files) {

      const uniqueFileName = `${uuidv4()}${extname(file.name)}`;
      const env = process.env.NEXT_PUBLIC_ENV || "development"; // fallback nếu chưa khai báo
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
        body: file
      });

      if (!uploadRes.ok) {
        console.error(`Upload failed for ${file.name}`, await uploadRes.text());
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
    const { keys } = await req.json();

    if (!Array.isArray(keys) || keys.length === 0) {
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
