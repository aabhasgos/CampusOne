import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const listings = await prisma.marketplaceListing.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(listings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as any;
    const body = await req.json();
    
    const postedBy = session?.user?.studentId || "Guest";

    const listing = await prisma.marketplaceListing.create({
      data: {
        type: body.type,
        title: body.title,
        price: body.price,
        details: body.details,
        postedBy: body.postedBy || postedBy,
      }
    });

    return NextResponse.json(listing);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
