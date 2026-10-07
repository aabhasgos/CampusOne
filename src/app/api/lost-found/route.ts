import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { type, item, location, description } = await req.json();

    const newItem = await prisma.lostItem.create({
      data: {
        type, // "LOST" or "FOUND"
        item,
        location,
        description,
        status: "OPEN"
      }
    });

    return NextResponse.json({ success: true, data: newItem });
  } catch (error: any) {
    console.error("Lost & Found Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
