import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

export async function GET() {
  const { error, user } = await requireAuth();
  if (error) return error;

  const voices = await prisma.voiceSample.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(voices);
}

export async function POST(req: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const body = await req.json();
  const voice = await prisma.voiceSample.create({
    data: {
      userId: user.id,
      filename: body.filename,
      url: body.url,
      duration: body.duration || 0,
      isDefault: body.isDefault || false,
    },
  });

  if (body.isDefault) {
    await prisma.voiceSample.updateMany({
      where: { userId: user.id, id: { not: voice.id } },
      data: { isDefault: false },
    });
  }

  return NextResponse.json(voice);
}
