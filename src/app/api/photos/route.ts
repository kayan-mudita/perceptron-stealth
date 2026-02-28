import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";
import {
  uploadFile,
  isStorageConfigured,
  photoKey,
  deleteFile,
} from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const { error, user } = await requireAuth();
  if (error) return error;

  const photos = await prisma.photo.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(photos);
}

/**
 * POST /api/photos
 *
 * Accepts either:
 *   1. multipart/form-data with a "file" field (+ optional "isPrimary")
 *      — uploads to S3 and creates the DB record
 *   2. JSON body with { filename, url, isPrimary }
 *      — legacy / fallback path that stores the provided URL directly
 */
export async function POST(req: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const contentType = req.headers.get("content-type") || "";

  let filename: string;
  let url: string;
  let isPrimary = false;
  let s3Key: string | null = null;

  if (contentType.includes("multipart/form-data")) {
    // ---- Multipart upload path ----
    if (!isStorageConfigured()) {
      return NextResponse.json(
        { error: "File storage is not configured on the server." },
        { status: 503 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    isPrimary = formData.get("isPrimary") === "true";

    if (!file) {
      return NextResponse.json(
        { error: 'Missing "file" in form data' },
        { status: 400 }
      );
    }

    const mime = file.type || "application/octet-stream";
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
    ];
    if (!allowedTypes.includes(mime)) {
      return NextResponse.json(
        { error: `Unsupported image type: ${mime}` },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Photo must be under 10 MB" },
        { status: 400 }
      );
    }

    const fileId = uuidv4();
    const ext = mime.split("/")[1] === "jpeg" ? "jpg" : mime.split("/")[1];
    s3Key = photoKey(user.id, fileId, ext);
    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      url = await uploadFile(buffer, s3Key, mime);
    } catch (err) {
      console.error("[Photos] S3 upload failed:", err);
      return NextResponse.json(
        { error: "Upload failed. Please try again." },
        { status: 500 }
      );
    }

    filename = file.name || `${fileId}.${ext}`;
  } else {
    // ---- JSON body path (legacy) ----
    const body = await req.json();
    filename = body.filename;
    url = body.url;
    isPrimary = body.isPrimary || false;

    if (!filename || !url) {
      return NextResponse.json(
        { error: "filename and url are required" },
        { status: 400 }
      );
    }
  }

  const photo = await prisma.photo.create({
    data: {
      userId: user.id,
      filename,
      url,
      isPrimary,
    },
  });

  // If marked primary, unmark others
  if (isPrimary) {
    await prisma.photo.updateMany({
      where: { userId: user.id, id: { not: photo.id } },
      data: { isPrimary: false },
    });
  }

  return NextResponse.json(photo);
}

/**
 * DELETE /api/photos?id=...
 *
 * Deletes a photo record and its S3 object (if the URL looks like an S3 key).
 */
export async function DELETE(req: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const photoId = req.nextUrl.searchParams.get("id");
  if (!photoId) {
    return NextResponse.json(
      { error: "id query parameter is required" },
      { status: 400 }
    );
  }

  const photo = await prisma.photo.findFirst({
    where: { id: photoId, userId: user.id },
  });
  if (!photo) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  // Attempt to delete from S3 if the URL contains a recognizable key
  if (isStorageConfigured() && photo.url.includes("photos/")) {
    try {
      // Extract the S3 key from the URL
      const match = photo.url.match(/(photos\/[^\s?]+)/);
      if (match) {
        await deleteFile(match[1]);
      }
    } catch (err) {
      console.error("[Photos] S3 delete failed:", err);
      // Continue with DB deletion even if S3 delete fails
    }
  }

  await prisma.photo.delete({ where: { id: photoId } });
  return NextResponse.json({ success: true });
}
