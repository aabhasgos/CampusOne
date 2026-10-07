"use client";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfileClient({ initialTickets, session, enrollmentNumber }: any) {
  const [tickets, setTickets] = useState(initialTickets);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const openTickets = tickets.filter((t: any) => t.status === 'OPEN' || t.status === 'IN_PROGRESS');

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to cancel and delete this request?")) return;
    
    // Optimistic UI update
    setTickets(tickets.filter((t: any) => t.id !== id));

    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
    } catch (err) {
      console.error(err);
      // Revert if error
      setTickets(initialTickets);
      alert("Failed to delete the ticket. Please try again.");
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-[90vh] bg-background text-foreground font-sans">
      <div className="max-w-4xl mx-auto p-4 md:p-8 pt-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-widest text-primary" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Student Profile
          </h1>
          <button 
            onClick={handleLogout}
            className="border-[1px] border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            Log Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="col-span-1 md:col-span-2 border-[1px] border-border bg-surface p-6 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rotate-45 transform translate-x-16 -translate-y-16 pointer-events-none"></div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Enrolled Identity</div>
            <div className="text-2xl font-bold text-white mb-1">{session.user.name}</div>
            <div className="text-primary font-mono">{enrollmentNumber}</div>
            <div className="text-sm text-gray-400 mt-4 border-t-[1px] border-border pt-4 flex justify-between items-center">
              <span>Official Email: {session.user.email}</span>
              <span className="bg-green-500/20 text-green-500 px-2 py-0.5 text-[10px] uppercase font-bold border-[1px] border-green-500/50">Active Student</span>
            </div>
          </div>
          
          <div className="border-[1px] border-border bg-surface p-6 flex flex-col justify-center text-center">
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Active Requests</div>
            <div className="text-5xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {openTickets.length}
            </div>
            <div className="text-xs text-gray-400">Total Lifetime: {tickets.length}</div>
          </div>
        </div>

        <h2 className="text-xl font-bold uppercase tracking-widest text-white border-b-[1px] border-border pb-2 mb-6" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          My Service Requests
        </h2>

        {tickets.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm font-mono border-[1px] border-dashed border-gray-600 bg-surface">
            You have not requested any campus services yet.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {tickets.map((ticket: any) => (
              <div key={ticket.id} className={`border-[1px] ${ticket.status === 'RESOLVED' ? 'border-green-900/50 bg-green-950/10' : 'border-primary/50 bg-primary/5'} p-4 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center group`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{ticket.department}</span>
                    {ticket.priority.includes('HIGH') && <span className="bg-red-600 text-white text-[8px] px-1.5 py-0.5 font-bold uppercase">URGENT</span>}
                  </div>
                  <div className="text-sm text-white font-medium">{ticket.issue}</div>
                  <div className="text-xs text-gray-500 font-mono mt-2">
                    {mounted ? new Date(ticket.createdAt).toLocaleString() : "Loading time..."}
                  </div>
                </div>
                <div className="shrink-0 flex items-center justify-center gap-4">
                  <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border-[1px] 
                    ${ticket.status === 'OPEN' ? 'border-red-500 text-red-500 bg-red-500/10' : ''}
                    ${ticket.status === 'IN_PROGRESS' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : ''}
                    ${ticket.status === 'RESOLVED' ? 'border-green-500 text-green-500 bg-green-500/10' : ''}
                  `}>
                    {ticket.status.replace("_", " ")}
                  </div>
                  
                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDelete(ticket.id)}
                    className="text-gray-500 hover:text-red-500 p-2 border-[1px] border-transparent hover:border-red-500/50 hover:bg-red-500/10 transition-all rounded-sm"
                    title="Cancel Request"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
