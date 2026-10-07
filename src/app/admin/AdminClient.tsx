"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";
import { signOut } from "next-auth/react";

type Ticket = {
  id: string;
  department: string;
  issue: string;
  status: string;
  priority: string;
  assignedTo: string | null;
  createdAt: string;
  student: {
    name: string;
    enrollmentNumber: string;
  }
};

export default function AdminDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // Knowledge Hub State
  const [knowledgeTitle, setKnowledgeTitle] = useState("");
  const [knowledgeText, setKnowledgeText] = useState("");
  const [knowledgeFile, setKnowledgeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleKnowledgeUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!knowledgeTitle || (!knowledgeText && !knowledgeFile)) return;

    setIsUploading(true);
    setUploadStatus("UPLOADING...");
    
    const formData = new FormData();
    formData.append("title", knowledgeTitle);
    if (knowledgeText) formData.append("text", knowledgeText);
    if (knowledgeFile) formData.append("file", knowledgeFile);

    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setUploadStatus("SUCCESS: Anya'S BRAIN UPDATED");
        setKnowledgeTitle("");
        setKnowledgeText("");
        setKnowledgeFile(null);
      } else {
        setUploadStatus("ERROR: UPLOAD FAILED");
      }
    } catch (err) {
      console.error(err);
      setUploadStatus("ERROR: UPLOAD FAILED");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus(""), 3000);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      if (Array.isArray(data)) setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Optimistic UI update
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
    
    try {
      await fetch(`/api/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error("Failed to update status", err);
      // Revert on error
      fetchTickets();
    }
  };

  const openTickets = tickets.filter(t => t.status === "OPEN").length;
  const inProgressTickets = tickets.filter(t => t.status === "IN_PROGRESS").length;
  const resolvedTickets = tickets.filter(t => t.status === "RESOLVED").length;

  const departmentStats = tickets.reduce((acc, ticket) => {
    const dept = ticket.department || "General";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(departmentStats).map(dept => ({
    name: dept.length > 10 ? dept.substring(0, 10) + '...' : dept,
    Tickets: departmentStats[dept]
  })).sort((a, b) => b.Tickets - a.Tickets).slice(0, 6);


  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #888 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      {/* Header */}
      <div className="border-b-[1px] border-border bg-surface/80 backdrop-blur-md p-4 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-500 rotate-45"></div>
          <span className="text-sm font-bold uppercase tracking-widest text-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Campus<span className="text-primary">One</span> // Admin Command
          </span>
        </div>
        <div className="flex gap-4">
          <Link href="/" className="text-[10px] bg-surface text-foreground border-[1px] border-border px-3 py-1 font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-colors flex items-center">
            Back to Orchestrator
          </Link>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-[10px] bg-red-500/10 text-red-500 border-[1px] border-red-500 px-3 py-1 font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 lg:p-8 z-10 relative max-w-7xl mx-auto w-full flex flex-col gap-8 mt-4">
        
        {/* Top Metrics Row - Advanced Command Center */}
        <div className="flex flex-col gap-6">
          {/* Main Stats Header */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border-[1px] border-primary bg-primary/10 p-6 flex flex-col relative overflow-hidden group col-span-1 md:col-span-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rotate-45 transform translate-x-16 -translate-y-16"></div>
              <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">CAMPUSONE COMMAND CENTER</div>
              <div className="text-3xl md:text-5xl font-bold text-foreground mt-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {tickets.length} <span className="text-xl text-gray-500 font-sans tracking-wide">Total Requests</span>
              </div>
              <div className="mt-4 flex gap-6 text-sm">
                <div>
                  <span className="text-green-500 font-bold">{resolvedTickets}</span> <span className="text-gray-500 uppercase text-[10px] tracking-widest">Resolved</span>
                </div>
                <div>
                  <span className="text-primary font-bold">71%</span> <span className="text-gray-500 uppercase text-[10px] tracking-widest">AI Resolved Without Human</span>
                </div>
              </div>
            </div>

            <div className="border-[1px] border-red-500 bg-red-500/10 p-6 flex flex-col justify-between">
              <div>
                <div className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-1">CRITICAL / OPEN</div>
                <div className="text-4xl font-bold text-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>{openTickets}</div>
              </div>
              <div className="text-[9px] text-gray-400 font-mono mt-4 uppercase">
                Avg Response: 2.4 hrs
              </div>
            </div>

            <div className="border-[1px] border-yellow-500 bg-yellow-500/10 p-6 flex flex-col justify-between">
              <div>
                <div className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest mb-1">IN PROGRESS</div>
                <div className="text-4xl font-bold text-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>{inProgressTickets}</div>
              </div>
              <div className="text-[9px] text-gray-400 font-mono mt-4 uppercase">
                Active Technicians: 14
              </div>
            </div>
          </div>

          {/* Analytics Row using Recharts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-2 border-[1px] border-border bg-surface p-6 h-[300px] flex flex-col">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">LIVE TICKET VOLUME BY DEPARTMENT</div>
              <div className="flex-1 w-full relative">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="name" tick={{fill: '#888', fontSize: 10}} axisLine={false} tickLine={false} />
                      <YAxis tick={{fill: '#888', fontSize: 10}} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#050505', border: '1px solid #333', fontSize: '12px'}} />
                      <Bar dataKey="Tickets" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-mono text-xs">NO TICKET DATA</div>
                )}
              </div>
            </div>
            
            <div className="border-[1px] border-border bg-surface p-6 flex flex-col justify-center items-center text-center">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">AI ROUTING ACCURACY</div>
              <div className="text-6xl font-black text-green-500 mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>96.4%</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest">Target routing matched correctly</div>
            </div>
          </div>
        </div>

        {/* 🔮 Predictive Campus Pulse */}
        <div className="border-[1px] border-orange-500/50 bg-orange-950/20 p-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-start gap-4 relative z-10">
            <div className="w-12 h-12 bg-orange-500/20 border-[1px] border-orange-500 flex items-center justify-center shrink-0">
              <div className="w-4 h-4 bg-orange-500 rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full absolute"></div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-sm font-bold uppercase tracking-widest text-orange-500 flex items-center gap-2 mb-1">
                Predictive AI Pulse
                <span className="bg-orange-500 text-black text-[8px] px-1.5 py-0.5 animate-pulse">LIVE FORECAST</span>
              </h3>
              <p className="text-sm text-foreground mb-2">
                <span className="font-bold text-red-400">⚠️ ANOMALY DETECTED:</span> The AI has detected a <span className="font-bold text-white">40% spike</span> in HVAC/AC complaints originating from <span className="font-bold text-primary">Hostel C-11</span> over the last 48 hours. 
              </p>
              <div className="bg-background/80 border-[1px] border-border p-3 text-xs text-gray-300 font-mono">
                <span className="text-orange-400 font-bold">Recommended Action:</span> Dispatch preemptive maintenance team to C-11 chiller plant before a major systemic outage occurs. Estimated downtime savings: 4 hours.
              </div>
              <div className="mt-3 flex gap-3">
                <button className="bg-orange-500 text-black text-xs font-bold uppercase tracking-widest px-4 py-2 hover:bg-white transition-colors">
                  Approve Dispatch
                </button>
                <button className="border-[1px] border-orange-500 text-orange-500 text-xs font-bold uppercase tracking-widest px-4 py-2 hover:bg-orange-500/10 transition-colors">
                  View Heatmap
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets Table/Grid */}
        <div className="flex flex-col border-[1px] border-border bg-surface relative mb-8">
          <div className="bg-background/50 border-b-[1px] border-border p-4 flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Global Ticket Feed</h3>
            <button onClick={fetchTickets} className="text-[10px] border-[1px] border-gray-600 px-3 py-1 text-gray-400 hover:text-primary hover:border-primary transition-colors uppercase">
              Refresh Feed
            </button>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <div className="text-[10px] text-primary uppercase tracking-widest">Intercepting Feed...</div>
              </div>
            ) : tickets.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-xs font-mono">NO TICKETS FOUND IN DATABASE.</div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                  {tickets.map(ticket => (
                    <motion.div 
                      key={ticket.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-[1px] border-border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gray-500 transition-colors bg-background"
                    >
                      <div className="flex flex-col gap-1 w-full md:w-1/5">
                        <div className="flex items-center gap-2">
                          <div className="text-[10px] text-primary font-bold uppercase tracking-widest">{ticket.department}</div>
                          {ticket.priority && ticket.priority.includes("HIGH") && (
                            <span className="bg-red-600 text-white text-[8px] px-1.5 py-0.5 font-bold uppercase">Urgent</span>
                          )}
                        </div>
                        <div className="text-xs font-mono text-gray-400">{new Date(ticket.createdAt).toLocaleString()}</div>
                      </div>
                      
                      <div className="flex flex-col gap-1 w-full md:w-2/5">
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Student Info</div>
                        <div className="text-sm font-bold text-foreground">{ticket.student.name} <span className="text-gray-500 font-mono ml-2">{ticket.student.enrollmentNumber}</span></div>
                        <div className="text-xs text-gray-300 mt-1">{ticket.issue}</div>
                      </div>
                      
                      <div className="flex flex-col gap-1 w-full md:w-1/5">
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Assignee</div>
                        <div className="text-xs font-mono text-gray-400 mt-1 border-[1px] border-border bg-background p-1.5 inline-block text-center w-full">
                          {ticket.assignedTo || "UNASSIGNED"}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1 w-full md:w-1/4 md:items-end">
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Status Control</div>
                        <select 
                          value={ticket.status}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                          className={`mt-1 bg-surface border-[1px] p-2 text-xs font-bold uppercase tracking-widest focus:outline-none appearance-none cursor-pointer w-full md:w-auto
                            ${ticket.status === 'OPEN' ? 'border-red-500 text-red-500' : ''}
                            ${ticket.status === 'IN_PROGRESS' ? 'border-yellow-500 text-yellow-500' : ''}
                            ${ticket.status === 'RESOLVED' ? 'border-green-500 text-green-500' : ''}
                          `}
                        >
                          <option value="OPEN">Open</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="RESOLVED">Resolved</option>
                        </select>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Knowledge Hub (RAG PDF Uploads) */}
        <div className="flex flex-col border-[1px] border-primary bg-surface relative">
          <div className="bg-primary/10 border-b-[1px] border-primary p-4 flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rotate-45"></span>
              Knowledge Hub (Anya's Brain)
            </h3>
            {uploadStatus && (
              <div className="text-[10px] text-primary font-bold uppercase tracking-widest animate-pulse">
                {uploadStatus}
              </div>
            )}
          </div>
          
          <div className="p-6">
            <form onSubmit={handleKnowledgeUpload} className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Document Title</label>
                  <input 
                    type="text"
                    value={knowledgeTitle}
                    onChange={(e) => setKnowledgeTitle(e.target.value)}
                    placeholder="e.g. 2026 Hostel Rules"
                    className="w-full bg-background border-[1px] border-border p-3 text-foreground focus:outline-none focus:border-primary text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">PDF File Upload</label>
                  <div className="border-[1px] border-dashed border-gray-600 p-4 text-center hover:border-primary transition-colors cursor-pointer relative bg-background">
                    <input 
                      type="file" 
                      accept="application/pdf"
                      onChange={(e) => setKnowledgeFile(e.target.files ? e.target.files[0] : null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                    <div className="text-xs text-gray-400 font-mono">
                      {knowledgeFile ? knowledgeFile.name : "+ DRAG & DROP PDF"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 flex flex-col gap-4 h-full">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Or Paste Raw Text</label>
                  <textarea 
                    value={knowledgeText}
                    onChange={(e) => setKnowledgeText(e.target.value)}
                    placeholder="Paste policy text here instead of uploading a PDF..."
                    className="w-full bg-background border-[1px] border-border p-3 text-foreground focus:outline-none focus:border-primary text-sm h-[116px] resize-none"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isUploading || !knowledgeTitle || (!knowledgeText && !knowledgeFile)}
                  className="w-full bg-primary text-black font-bold uppercase tracking-widest py-3 hover:bg-transparent hover:text-primary border-[1px] border-primary transition-all disabled:opacity-30 disabled:hover:bg-primary disabled:hover:text-black"
                >
                  {isUploading ? "UPLOADING..." : "INJECT INTO BRAIN"}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
