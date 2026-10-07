import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions) as any;
    const studentId = session?.user?.studentId || "Guest";

    const existingGig = await prisma.gig.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!existingGig) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.gig.update({
      where: { id: resolvedParams.id },
      data: {
        status: "CLAIMED",
        claimedBy: studentId,
        claimCount: { increment: 1 }
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to claim gig" }, { status: 500 });
  }
}
