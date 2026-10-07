import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { department, issue, priority = "NORMAL" } = await req.json();
    const enrollmentNumber = (session.user as any).studentId;
    const name = session.user?.name || "Bennett Student";
    const email = session.user?.email || "student@bennett.edu.in";

    // Upsert the student record since we are using Mock SSO
    let student = await prisma.student.findUnique({
      where: { enrollmentNumber }
    });

    if (!student) {
      student = await prisma.student.create({
        data: { enrollmentNumber, name, email }
      });
    }

    // Create the ticket
    const ticket = await prisma.ticket.create({
      data: {
        studentId: student.id,
        department,
        issue,
        priority
      }
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Failed to create ticket:", error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tickets = await prisma.ticket.findMany({
      include: { student: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await req.json();

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("Failed to update ticket:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
