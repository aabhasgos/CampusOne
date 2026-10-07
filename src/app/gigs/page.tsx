"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

type Gig = {
  id: string;
  type: string;
  title: string;
  postedBy: string;
  details: string;
  status: "OPEN" | "CLAIMED";
  claimedBy?: string;
  claimCount: number;
};

export default function GigsPage() {
  const { data: session } = useSession();
  const studentId = (session?.user as any)?.studentId || "Guest";

  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGigs = async () => {
    try {
      const res = await fetch("/api/gigs");
      const data = await res.json();
      if (Array.isArray(data)) {
        setGigs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newType, setNewType] = useState("Ride Share");
  const [newTitle, setNewTitle] = useState("");
  const [newDetails, setNewDetails] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDetails) return;
    
    const res = await fetch("/api/gigs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: newType,
        title: newTitle,
        details: newDetails,
        postedBy: studentId === "Guest" ? "S21CSEU0000" : studentId,
      })
    });

    if (res.ok) {
      fetchGigs();
      setIsModalOpen(false);
      setNewTitle("");
      setNewDetails("");
    }
  };

  const handleClaim = async (id: string) => {
    // Optimistic UI update
    setGigs(gigs.map(g => g.id === id ? { ...g, status: "CLAIMED", claimedBy: studentId, claimCount: g.claimCount + 1 } : g));
    
    await fetch(`/api/gigs/${id}`, {
      method: "PATCH"
    });
    
    fetchGigs();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-6 relative overflow-x-hidden pt-20">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #888 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="max-w-2xl w-full bg-surface border-[1px] border-green-500 p-8 z-10 text-center relative mb-12">
        <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rotate-45 transform translate-x-8 -translate-y-8 pointer-events-none"></div>
        
        <h1 className="text-3xl font-bold uppercase tracking-widest text-green-400 mb-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          Active Gigs
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          The central hub for student collaboration. Need a ride to the airport or a quick tutoring session? Connect directly with peers to share resources and complete tasks together.
        </p>
        
        <div className="flex flex-col gap-4 text-left">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading gigs...</div>
          ) : gigs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No active gigs. Be the first to post one!</div>
          ) : gigs.map((gig) => (
            <div key={gig.id} className="border-[1px] border-border p-4 hover:border-green-500 transition-colors bg-background flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest block mb-1">{gig.type}</span>
                  <h3 className="text-sm font-bold text-foreground">{gig.title}</h3>
                </div>
                {gig.status === "OPEN" ? (
                  <button onClick={() => handleClaim(gig.id)} className="text-[10px] bg-green-500/10 text-green-500 border-[1px] border-green-500 px-3 py-1 font-bold uppercase tracking-widest hover:bg-green-500 hover:text-black transition-colors shrink-0 ml-4">
                    Claim
                  </button>
                ) : (
                  <span className="text-[10px] bg-gray-800 text-gray-400 border-[1px] border-gray-600 px-3 py-1 font-bold uppercase tracking-widest shrink-0 ml-4">
                    Claimed
                  </span>
                )}
              </div>
              <div className="border-t-[1px] border-border/50 pt-2 flex flex-col gap-1">
                <p className="text-xs text-gray-400"><span className="text-gray-500 font-bold">POSTED BY:</span> {gig.postedBy}</p>
                <p className="text-xs text-gray-400"><span className="text-gray-500 font-bold">MEETUP DETAILS:</span> {gig.details}</p>
                {gig.status === "CLAIMED" && gig.claimedBy && (
                  <p className="text-xs text-green-500 mt-2 font-bold bg-green-500/10 p-2 inline-block w-fit">
                    CLAIMED BY: {gig.claimedBy} {gig.claimCount > 1 ? `(+${gig.claimCount - 1} others applied)` : ''}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-8 bg-green-500 text-black font-bold uppercase tracking-widest px-6 py-3 hover:bg-transparent hover:text-green-500 border-[1px] border-green-500 transition-colors text-xs"
        >
          + Post a Gig
        </button>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-surface border-[1px] border-green-500 w-full max-w-md p-6 relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold uppercase tracking-widest text-green-500" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  Post New Gig
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-green-500 transition-colors">
                  ✕
                </button>
              </div>
              <form onSubmit={handleCreate} className="flex flex-col gap-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Gig Type</label>
                  <select value={newType} onChange={e => setNewType(e.target.value)} className="w-full bg-background border-[1px] border-border p-3 text-sm text-foreground focus:outline-none focus:border-green-500">
                    <option>Ride Share</option>
                    <option>Tutoring</option>
                    <option>Campus Task</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Title (What do you need?)</label>
                  <input type="text" required value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="E.g. Delhi Airport (T3) - Friday 5PM" className="w-full bg-background border-[1px] border-border p-3 text-sm text-foreground focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Timings & Meetup Details</label>
                  <textarea required value={newDetails} onChange={e => setNewDetails(e.target.value)} placeholder="Where should they meet you and at what time?" className="w-full bg-background border-[1px] border-border p-3 text-sm text-foreground focus:outline-none focus:border-green-500 min-h-[80px]" />
                </div>
                <button type="submit" className="w-full bg-green-500 text-black font-bold uppercase tracking-widest p-4 hover:bg-transparent hover:text-green-500 border-[1px] border-green-500 transition-all mt-2">
                  Publish Gig
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
