/**
 * Pose Cropper — Extracts individual poses from character sheet composites.
 *
 * Character sheets are generated as composite images:
 * - Poses sheet: 3×3 grid (9 poses, each ~1/9 of the image)
 * - 360 sheet: 2×3 grid (6 angles, each ~1/6 of the image)
 *
 * This module downloads the composite, crops to a specific grid cell
 * using Sharp, uploads the cropped image to Supabase storage, and
 * returns a permanent URL for the individual pose.
 *
 * Cropped images are cached — if the same cell has been cropped before,
 * we return the existing URL instead of re-cropping.
 */

import sharp from "sharp";
import {
  isStorageConfigured,
  uploadFile,
  croppedPoseKey,
} from "@/lib/storage";

// ─── Types ────────────────────────────────────────────────────────

export interface CropResult {
  url: string;
  source: "cropped" | "cached" | "fallback";
}

interface GridSpec {
  rows: number;
  cols: number;
}

const GRID_SPECS: Record<string, GridSpec> = {
  poses: { rows: 3, cols: 3 },
  "3d_360": { rows: 2, cols: 3 },
};

// In-memory cache for cropped URLs (cleared on server restart)
const cropCache = new Map<string, string>();

// ─── Core Cropper ─────────────────────────────────────────────────

/**
 * Crop a specific cell from a character sheet composite image.
 *
 * @param compositeUrl - URL of the full composite image
 * @param sheetType - "poses" (3×3) or "3d_360" (2×3)
 * @param row - Row index (0-based)
 * @param col - Column index (0-based)
 * @param userId - For storage path
 * @param sheetId - Character sheet ID for cache key
 * @returns Permanent URL of the cropped image
 */
export async function cropPoseFromComposite(
  compositeUrl: string,
  sheetType: string,
  row: number,
  col: number,
  userId: string,
  sheetId: string
): Promise<CropResult> {
  const cacheKey = `${sheetId}:${row}:${col}`;

  // Check cache first
  const cached = cropCache.get(cacheKey);
  if (cached) {
    return { url: cached, source: "cached" };
  }

  const spec = GRID_SPECS[sheetType];
  if (!spec) {
    console.error(`[pose-cropper] Unknown sheet type: ${sheetType}`);
    return { url: compositeUrl, source: "fallback" };
  }

  if (row < 0 || row >= spec.rows || col < 0 || col >= spec.cols) {
    console.error(`[pose-cropper] Invalid grid position ${row},${col} for ${sheetType} (${spec.rows}×${spec.cols})`);
    return { url: compositeUrl, source: "fallback" };
  }

  try {
    // Download the composite image
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000);

    let imageBuffer: Buffer;
    try {
      const res = await fetch(compositeUrl, { signal: controller.signal });
      if (!res.ok) throw new Error(`Failed to download: ${res.status}`);
      imageBuffer = Buffer.from(await res.arrayBuffer());
    } finally {
      clearTimeout(timeoutId);
    }

    // Get image dimensions
    const metadata = await sharp(imageBuffer).metadata();
    const imgWidth = metadata.width || 1024;
    const imgHeight = metadata.height || 1024;

    // Calculate cell dimensions
    const cellWidth = Math.floor(imgWidth / spec.cols);
    const cellHeight = Math.floor(imgHeight / spec.rows);

    // Crop to the specific cell
    const left = col * cellWidth;
    const top = row * cellHeight;

    const croppedBuffer = await sharp(imageBuffer)
      .extract({
        left,
        top,
        width: cellWidth,
        height: cellHeight,
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Upload to storage if configured
    if (isStorageConfigured()) {
      const storageKey = croppedPoseKey(userId, sheetId, `${row}-${col}`);
      const url = await uploadFile(croppedBuffer, storageKey, "image/jpeg");
      cropCache.set(cacheKey, url);
      return { url, source: "cropped" };
    }

    // No storage — return as data URL (temporary, but works)
    const dataUrl = `data:image/jpeg;base64,${croppedBuffer.toString("base64")}`;
    cropCache.set(cacheKey, dataUrl);
    return { url: dataUrl, source: "cropped" };
  } catch (e: any) {
    console.error(`[pose-cropper] Failed to crop ${sheetType} [${row},${col}]:`, e.message);
    return { url: compositeUrl, source: "fallback" };
  }
}

/**
 * Crop ALL cells from a 360 character sheet and return them as
 * an array of URLs. Used as `referenceImageUrls` for Kling 3.0.
 *
 * Returns 6 URLs: [front, 3/4 right, right profile, back, 3/4 left, left profile]
 */
export async function cropAll360Angles(
  compositeUrl: string,
  userId: string,
  sheetId: string
): Promise<string[]> {
  const positions = [
    { row: 0, col: 0 }, // front
    { row: 0, col: 1 }, // 3/4 right
    { row: 0, col: 2 }, // right profile
    { row: 1, col: 0 }, // back
    { row: 1, col: 1 }, // 3/4 left
    { row: 1, col: 2 }, // left profile
  ];

  const results = await Promise.all(
    positions.map((pos) =>
      cropPoseFromComposite(compositeUrl, "3d_360", pos.row, pos.col, userId, sheetId)
    )
  );

  return results.map((r) => r.url);
}
