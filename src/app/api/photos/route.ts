import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

export async function GET() {
  const { error, user } = await requireAuth();
  if (error) return error;

  const photos = await prisma.photo.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(photos);
}

export async function POST(req: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const body = await req.json();
  const photo = await prisma.photo.create({
    data: {
      userId: user.id,
      filename: body.filename,
      url: body.url,
      isPrimary: body.isPrimary || false,
    },
  });

  // If marked primary, unmark others
  if (body.isPrimary) {
    await prisma.photo.updateMany({
      where: { userId: user.id, id: { not: photo.id } },
      data: { isPrimary: false },
    });
  }

  return NextResponse.json(photo);
}
