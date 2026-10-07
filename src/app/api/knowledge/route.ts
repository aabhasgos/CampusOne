import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import pdfParse from "pdf-parse";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const file = formData.get("file") as File | null;
    const rawText = formData.get("text") as string | null;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    let content = "";

    if (file && file.name.endsWith(".pdf")) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const data = await pdfParse(buffer);
      content = data.text;
    } else if (rawText) {
      content = rawText;
    } else {
      return NextResponse.json({ error: "Either a PDF file or text content is required" }, { status: 400 });
    }

    const knowledge = await prisma.knowledge.create({
      data: {
        title,
        content: content.trim()
      }
    });

    return NextResponse.json(knowledge);
  } catch (error) {
    console.error("Failed to upload knowledge:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const knowledgeBase = await prisma.knowledge.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(knowledgeBase);
  } catch (error) {
    console.error("Failed to fetch knowledge:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
