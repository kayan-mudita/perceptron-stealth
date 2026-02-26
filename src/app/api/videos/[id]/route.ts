import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const body = await req.json();
  const video = await prisma.video.updateMany({
    where: { id: params.id, userId: user.id },
    data: body,
  });

  if (video.count === 0) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  const updated = await prisma.video.findUnique({ where: { id: params.id } });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = await requireAuth();
  if (error) return error;

  await prisma.video.deleteMany({ where: { id: params.id, userId: user.id } });
  return NextResponse.json({ success: true });
}
