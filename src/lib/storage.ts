// S3-compatible storage layer
// Works with AWS S3, Cloudflare R2, MinIO, or any S3-compatible provider

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl as s3GetSignedUrl } from "@aws-sdk/s3-request-presigner";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const bucket = process.env.S3_BUCKET || "";
const region = process.env.S3_REGION || "us-east-1";
const endpoint = process.env.S3_ENDPOINT || undefined;
const publicUrl = process.env.S3_PUBLIC_URL || undefined; // optional CDN / public bucket URL

function getS3Client(): S3Client {
  return new S3Client({
    region,
    endpoint,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
    // For path-style access (needed for MinIO / some R2 configs)
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
  });
}

// Lazy singleton
let _client: S3Client | null = null;
function client(): S3Client {
  if (!_client) _client = getS3Client();
  return _client;
}

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

/**
 * Check whether S3 storage is configured. When it is not, callers should fall
 * back to local / placeholder behaviour.
 */
export function isStorageConfigured(): boolean {
  return !!(
    bucket &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY
  );
}

/**
 * Upload a file buffer to S3 and return its URL.
 *
 * @param buffer  - File content
 * @param key     - S3 object key (e.g. "photos/user123/abc.jpg")
 * @param contentType - MIME type
 * @returns The public / presigned URL of the uploaded object
 */
export async function uploadFile(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  await client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  // If a public URL base is configured, return a direct URL.
  // Otherwise fall back to a presigned URL.
  if (publicUrl) {
    const base = publicUrl.endsWith("/") ? publicUrl.slice(0, -1) : publicUrl;
    return `${base}/${key}`;
  }

  return getSignedUrl(key);
}

/**
 * Generate a presigned download URL valid for the given duration.
 *
 * @param key       - S3 object key
 * @param expiresIn - Seconds until the URL expires (default: 1 hour)
 */
export async function getSignedUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return s3GetSignedUrl(client(), command, { expiresIn });
}

/**
 * Delete a file from S3.
 */
export async function deleteFile(key: string): Promise<void> {
  await client().send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
}

/**
 * Download a file from an external URL and upload it to S3.
 * Useful for persisting AI-generated video results.
 *
 * @param sourceUrl   - The URL to download from
 * @param key         - Destination S3 key
 * @param contentType - MIME type for the stored object
 * @returns The S3 URL of the stored file
 */
export async function downloadAndStore(
  sourceUrl: string,
  key: string,
  contentType = "video/mp4"
): Promise<string> {
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to download from ${sourceUrl}: ${response.status} ${response.statusText}`
    );
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return uploadFile(buffer, key, contentType);
}

// ---------------------------------------------------------------------------
// Key helpers — organise objects by type and user
// ---------------------------------------------------------------------------

export function photoKey(userId: string, fileId: string, ext: string): string {
  return `photos/${userId}/${fileId}.${ext}`;
}

export function voiceKey(userId: string, fileId: string, ext: string): string {
  return `voices/${userId}/${fileId}.${ext}`;
}

export function videoKey(userId: string, fileId: string, ext: string): string {
  return `videos/${userId}/${fileId}.${ext}`;
}
