import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import AdminClient from "./AdminClient";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions) as any;
  if (!session || session?.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-[80vh] bg-background flex flex-col items-center justify-center p-4">
        <div className="border-[1px] border-red-500 bg-red-950/20 p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4 uppercase tracking-widest" style={{ fontFamily: "var(--font-space-grotesk)" }}>Access Denied</h1>
          <p className="text-sm text-white mb-6">This portal is strictly restricted to University Administrators. Your current role is: {session?.user?.role || 'UNAUTHENTICATED'}.</p>
          <Link href="/" className="bg-red-500 text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors">Return to Home</Link>
        </div>
      </div>
    );
  }

  return <AdminClient />;
}
