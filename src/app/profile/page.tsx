import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import ProfileClient from "./ProfileClient";

const prisma = new PrismaClient();

export default async function StudentProfile() {
  const session = await getServerSession(authOptions) as any;
  
  if (!session || session?.user?.role !== 'STUDENT') {
    return (
      <div className="min-h-[80vh] bg-background flex flex-col items-center justify-center p-4">
        <div className="border-[1px] border-orange-500 bg-orange-950/20 p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-orange-500 mb-4 uppercase tracking-widest" style={{ fontFamily: "var(--font-space-grotesk)" }}>Student Only</h1>
          <p className="text-sm text-white mb-6">This portal is for active Bennett University students. Your role is: {session?.user?.role || 'UNAUTHENTICATED'}.</p>
          <Link href="/" className="bg-orange-500 text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors">Return to Home</Link>
        </div>
      </div>
    );
  }

  // Fetch student's specific tickets
  const enrollmentNumber = session.user.studentId || (session.user.email ? session.user.email.split('@')[0].toUpperCase() : "");
  
  const studentDb = await prisma.student.findUnique({
    where: { enrollmentNumber: enrollmentNumber },
    include: {
      tickets: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  const tickets = studentDb?.tickets || [];
  return <ProfileClient initialTickets={tickets} session={session} enrollmentNumber={enrollmentNumber} />;
}
