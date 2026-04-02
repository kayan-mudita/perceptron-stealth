import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();
    const { industry, company } = body as {
      industry?: string;
      company?: string;
    };

    const data: Record<string, string> = {};
    if (industry) data.industry = industry;
    if (company) data.company = company;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
      select: { id: true, industry: true, company: true },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    console.error("Profile update failed:", err);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
