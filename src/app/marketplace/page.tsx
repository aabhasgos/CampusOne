"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

type Listing = {
  id: string;
  type: "Looking for" | "Selling";
  title: string;
  price: string;
  postedBy: string;
  details: string;
  status: "OPEN" | "CLAIMED";
  claimedBy?: string;
  claimCount: number;
};

export default function MarketplacePage() {
  const { data: session } = useSession();
  const studentId = (session?.user as any)?.studentId || "Guest";

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      const res = await fetch("/api/marketplace");
      const data = await res.json();
      if (Array.isArray(data)) {
        setListings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newType, setNewType] = useState<"Looking for" | "Selling">("Selling");
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDetails, setNewDetails] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newDetails) return;
    
    const res = await fetch("/api/marketplace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: newType,
        title: newTitle,
        price: newPrice.startsWith("₹") ? newPrice : `₹${newPrice}`,
        details: newDetails,
        postedBy: studentId === "Guest" ? "S21CSEU0000" : studentId,
      })
    });

    if (res.ok) {
      fetchListings();
      setIsModalOpen(false);
      setNewTitle("");
      setNewPrice("");
      setNewDetails("");
    }
  };

  const handleClaim = async (id: string) => {
    // Optimistic UI update
    setListings(listings.map(l => l.id === id ? { ...l, status: "CLAIMED", claimedBy: studentId, claimCount: l.claimCount + 1 } : l));
    
    await fetch(`/api/marketplace/${id}`, {
      method: "PATCH"
    });
    
    fetchListings();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-6 relative overflow-x-hidden pt-20">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #888 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="max-w-3xl w-full bg-surface border-[1px] border-blue-500 p-8 z-10 text-center relative mb-12">
        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rotate-45 transform translate-x-8 -translate-y-8 pointer-events-none"></div>
        
        <h1 className="text-3xl font-bold uppercase tracking-widest text-blue-400 mb-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          Campus Marketplace
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          The centralized peer-to-peer micro-economy. Buy and sell textbooks, electronics, and dorm supplies directly with verified Bennett University students. 
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {loading ? (
            <div className="text-center text-gray-500 py-8 col-span-1 md:col-span-2">Loading marketplace...</div>
          ) : listings.length === 0 ? (
            <div className="text-center text-gray-500 py-8 col-span-1 md:col-span-2">No active listings.</div>
          ) : listings.map((listing) => (
            <div key={listing.id} className="border-[1px] border-border p-4 hover:border-blue-500 transition-colors bg-background flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">{listing.type}</span>
                  <h3 className="text-lg font-bold text-foreground">{listing.title}</h3>
                  <p className="text-blue-400 font-bold mt-1">{listing.price}</p>
                </div>
                {listing.status === "OPEN" ? (
                  <button onClick={() => handleClaim(listing.id)} className="text-[10px] bg-blue-500/10 text-blue-500 border-[1px] border-blue-500 px-3 py-1 font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-black transition-colors shrink-0 ml-4">
                    {listing.type === "Selling" ? "Buy" : "Fulfill"}
                  </button>
                ) : (
                  <span className="text-[10px] bg-gray-800 text-gray-400 border-[1px] border-gray-600 px-3 py-1 font-bold uppercase tracking-widest shrink-0 ml-4">
                    {listing.type === "Selling" ? "Sold" : "Fulfilled"}
                  </span>
                )}
              </div>
              <div className="border-t-[1px] border-border/50 pt-2 flex flex-col gap-1 mt-auto">
                <p className="text-xs text-gray-400"><span className="text-gray-500 font-bold">POSTED BY:</span> {listing.postedBy}</p>
                <p className="text-xs text-gray-400"><span className="text-gray-500 font-bold">MEETUP:</span> {listing.details}</p>
                {listing.status === "CLAIMED" && listing.claimedBy && (
                  <p className="text-xs text-blue-500 mt-2 font-bold bg-blue-500/10 p-2 inline-block w-fit">
                    CLAIMED BY: {listing.claimedBy}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-8 bg-blue-500 text-black font-bold uppercase tracking-widest px-6 py-3 hover:bg-transparent hover:text-blue-500 border-[1px] border-blue-500 transition-colors text-xs"
        >
          + Create Listing
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
              className="bg-surface border-[1px] border-blue-500 w-full max-w-md p-6 relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold uppercase tracking-widest text-blue-500" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  New Marketplace Listing
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-blue-500 transition-colors">
                  ✕
                </button>
              </div>
              <form onSubmit={handleCreate} className="flex flex-col gap-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Listing Type</label>
                  <select value={newType} onChange={e => setNewType(e.target.value as any)} className="w-full bg-background border-[1px] border-border p-3 text-sm text-foreground focus:outline-none focus:border-blue-500">
                    <option>Selling</option>
                    <option>Looking for</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Item Title</label>
                  <input type="text" required value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="E.g. Engineering Drawing Kit" className="w-full bg-background border-[1px] border-border p-3 text-sm text-foreground focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Price (₹)</label>
                  <input type="text" required value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="E.g. 500" className="w-full bg-background border-[1px] border-border p-3 text-sm text-foreground focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Timings & Meetup Details</label>
                  <textarea required value={newDetails} onChange={e => setNewDetails(e.target.value)} placeholder="Where and when can you meet to exchange this item?" className="w-full bg-background border-[1px] border-border p-3 text-sm text-foreground focus:outline-none focus:border-blue-500 min-h-[80px]" />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-black font-bold uppercase tracking-widest p-4 hover:bg-transparent hover:text-blue-500 border-[1px] border-blue-500 transition-all mt-2">
                  Publish Listing
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
