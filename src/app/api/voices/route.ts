import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";
import {
  uploadFile,
  isStorageConfigured,
  voiceKey,
  deleteFile,
} from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const { error, user } = await requireAuth();
  if (error) return error;

  const voices = await prisma.voiceSample.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(voices);
}

/**
 * POST /api/voices
 *
 * Accepts either:
 *   1. multipart/form-data with a "file" field (+ optional "isDefault", "duration")
 *      — uploads to S3 and creates the DB record
 *   2. JSON body with { filename, url, duration, isDefault }
 *      — legacy / fallback path that stores the provided URL directly
 */
export async function POST(req: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const contentType = req.headers.get("content-type") || "";

  let filename: string;
  let url: string;
  let duration = 0;
  let isDefault = false;

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
    isDefault = formData.get("isDefault") === "true";
    const durationStr = formData.get("duration") as string | null;
    if (durationStr) duration = parseInt(durationStr, 10) || 0;

    if (!file) {
      return NextResponse.json(
        { error: 'Missing "file" in form data' },
        { status: 400 }
      );
    }

    const mime = file.type || "application/octet-stream";
    const allowedTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/x-wav",
      "audio/webm",
      "audio/ogg",
      "audio/mp4",
      "audio/aac",
    ];
    if (!allowedTypes.includes(mime)) {
      return NextResponse.json(
        { error: `Unsupported audio type: ${mime}` },
        { status: 400 }
      );
    }

    const maxSize = 50 * 1024 * 1024; // 50 MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Voice sample must be under 50 MB" },
        { status: 400 }
      );
    }

    const fileId = uuidv4();
    const extMap: Record<string, string> = {
      "audio/mpeg": "mp3",
      "audio/mp3": "mp3",
      "audio/wav": "wav",
      "audio/x-wav": "wav",
      "audio/webm": "webm",
      "audio/ogg": "ogg",
      "audio/mp4": "m4a",
      "audio/aac": "aac",
    };
    const ext = extMap[mime] || "bin";
    const key = voiceKey(user.id, fileId, ext);
    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      url = await uploadFile(buffer, key, mime);
    } catch (err) {
      console.error("[Voices] S3 upload failed:", err);
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
    duration = body.duration || 0;
    isDefault = body.isDefault || false;

    if (!filename || !url) {
      return NextResponse.json(
        { error: "filename and url are required" },
        { status: 400 }
      );
    }
  }

  const voice = await prisma.voiceSample.create({
    data: {
      userId: user.id,
      filename,
      url,
      duration,
      isDefault,
    },
  });

  if (isDefault) {
    await prisma.voiceSample.updateMany({
      where: { userId: user.id, id: { not: voice.id } },
      data: { isDefault: false },
    });
  }

  return NextResponse.json(voice);
}

/**
 * DELETE /api/voices?id=...
 *
 * Deletes a voice sample record and its S3 object.
 */
export async function DELETE(req: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const voiceId = req.nextUrl.searchParams.get("id");
  if (!voiceId) {
    return NextResponse.json(
      { error: "id query parameter is required" },
      { status: 400 }
    );
  }

  const voice = await prisma.voiceSample.findFirst({
    where: { id: voiceId, userId: user.id },
  });
  if (!voice) {
    return NextResponse.json(
      { error: "Voice sample not found" },
      { status: 404 }
    );
  }

  // Attempt to delete from S3
  if (isStorageConfigured() && voice.url.includes("voices/")) {
    try {
      const match = voice.url.match(/(voices\/[^\s?]+)/);
      if (match) {
        await deleteFile(match[1]);
      }
    } catch (err) {
      console.error("[Voices] S3 delete failed:", err);
    }
  }

  await prisma.voiceSample.delete({ where: { id: voiceId } });
  return NextResponse.json({ success: true });
}
