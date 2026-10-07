"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TicketSkeleton } from "./SkeletonLoader";
import { TicketCard } from "./TicketCard";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

// Geometric Avatar for Anya
const AnyaAvatar = () => (
  <div className="w-10 h-10 border-[1px] border-primary bg-[#050505] flex items-center justify-center relative overflow-hidden shrink-0">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_70%)]"></div>
    {/* Abstract Bindi/Star motif for 'Anya' */}
    <div className="w-4 h-4 bg-primary rotate-45 flex items-center justify-center">
      <div className="w-1 h-1 bg-black rounded-full"></div>
    </div>
  </div>
);

export default function Chatbot() {
  const [myInput, setMyInput] = useState("");
  const { messages, setMessages, append, isLoading, error } = useChat({
    initialMessages: [
      {
        id: "welcome-msg",
        role: "assistant",
        content: "Hello! I am **Anya**, your proactive CampusOne assistant. I'm here to help you get things done. You can ask me to **report maintenance issues**, track your tickets, find **lost items**, or search across all verified **Bennett University** knowledge. \n\n*What can I help you with today?*"
      }
    ]
  });
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const processedTicketsRef = useRef<Set<string>>(new Set());
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketDept, setTicketDept] = useState("Facilities");
  const [ticketIssue, setTicketIssue] = useState("");

  // Phase 8: Vision & Voice State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [messageImages, setMessageImages] = useState<Record<string, string>>({});
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Watch messages and save newly generated tickets to the database
  useEffect(() => {
    const saveTicket = async (department: string, issue: string, priority: string, msgId: string) => {
      try {
        await fetch("/api/tickets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ department, issue, priority })
        });
      } catch (err) {
        console.error("Failed to save ticket", err);
      }
    };

    messages.forEach(msg => {
      if (msg.role === "assistant" && !processedTicketsRef.current.has(msg.id)) {
        let hasTicket = false;
        const ticketRegex = /\[TICKET_ROUTING:\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\]/g;
        let match;
        while ((match = ticketRegex.exec(msg.content)) !== null) {
          hasTicket = true;
          saveTicket(match[1], match[2], match[3], msg.id);
        }
        
        if (hasTicket) {
          processedTicketsRef.current.add(msg.id);
        }

        const lostMatch = msg.content.match(/\[LOST_REPORT:\s*(LOST|FOUND)\s*\|\s*(.+?)\s*\|\s*(.+?)\]/);
        if (lostMatch && !processedTicketsRef.current.has(msg.id + "-lost")) {
          processedTicketsRef.current.add(msg.id + "-lost");
          fetch("/api/lost-found", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: lostMatch[1], item: lostMatch[2], location: lostMatch[3], description: "Reported via Anya AI" })
          }).catch(err => console.error("Failed to save lost report", err));
        }
      }
    });
  }, [messages]);

  // Proactive Notifications (Live Polling)
  const knownTicketsRef = useRef<Record<string, string>>({});
  
  useEffect(() => {
    const pollTickets = async () => {
      try {
        const res = await fetch("/api/tickets");
        const tickets = await res.json();
        
        if (Array.isArray(tickets)) {
          let shouldUpdateMessages = false;
          let fakeMessages: any[] = [];
          
          tickets.forEach((ticket: any) => {
            const lastStatus = knownTicketsRef.current[ticket.id];
            
            // If we already tracked this ticket and its status changed!
            if (lastStatus && lastStatus !== ticket.status) {
              const statusText = ticket.status === "RESOLVED" ? "RESOLVED! 🎉" : "IN PROGRESS! 🚀";
              const alertMsg = {
                id: Math.random().toString(36),
                role: "assistant" as const,
                content: `**SYSTEM ALERT:** Good news! Your ticket for **${ticket.department}** was just marked as **${statusText}** by the campus administration.`
              };
              fakeMessages.push(alertMsg);
              shouldUpdateMessages = true;
            }
            
            // Track the new status
            knownTicketsRef.current[ticket.id] = ticket.status;
          });
          
          if (shouldUpdateMessages) {
            setMessages(prev => [...prev, ...fakeMessages]);
          }
        }
      } catch (err) {
        // Silently ignore polling errors
      }
    };

    // Poll every 10 seconds
    const interval = setInterval(pollTickets, 10000);
    // Initial fetch to seed known status
    pollTickets();
    
    return () => clearInterval(interval);
  }, []);

  const [isOcrProcessing, setIsOcrProcessing] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        setSelectedImage(base64Image);
        
        // Start OCR
        try {
          setIsOcrProcessing(true);
          const Tesseract = (await import('tesseract.js')).default;
          const result = await Tesseract.recognize(base64Image, 'eng', {
            logger: m => console.log(m)
          });
          
          if (result.data.text.trim().length > 0) {
            setMyInput(prev => prev + (prev ? "\n" : "") + `[SCANNED DOCUMENT TEXT]:\n"${result.data.text.trim()}"`);
          }
        } catch (error) {
          console.error("OCR Failed:", error);
        } finally {
          setIsOcrProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support the Web Speech API. Please try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join("");
      setMyInput(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myInput.trim() && !selectedImage) return;
    
    const msgId = Math.random().toString(36).substring(7);
    let finalContent = myInput;

    if (selectedImage) {
      // Store image locally tied to this message ID to avoid crashing the LLM context window with huge base64 strings
      setMessageImages(prev => ({ ...prev, [msgId]: selectedImage }));
      if (myInput.trim().length === 0) {
        finalContent = "[IMAGE UPLOADED BUT NO TEXT DETECTED. ASK THE USER TO CLARIFY THE DOCUMENT.]";
      }
      setSelectedImage(null);
    }

    append({ id: msgId, role: "user", content: finalContent });
    setMyInput("");
  };

  const handleManualTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketIssue.trim()) return;
    
    // Create a local system message (pseudo assistant) to render the ticket
    const fakeMsg = {
      id: Math.random().toString(36),
      role: "assistant" as const,
      content: `I have manually logged a ticket for you.\n\n[TICKET_ROUTING: ${ticketDept} | ${ticketIssue}]`
    };
    
    setMessages([...messages, fakeMsg]);
    setIsTicketModalOpen(false);
    setTicketIssue("");
  };

  const suggestions = [
    "What are the hostel curfew rules?",
    "How do I connect to campus Wi-Fi?",
    "When is the central library open?",
  ];

  return (
    <div className="w-full max-w-4xl mx-auto h-[750px] border-[1px] border-border bg-background flex flex-col relative overflow-hidden" id="chatbot-container">
      
      {/* Background Grid Accent */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #888 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      {/* Header */}
      <div className="border-b-[1px] border-border bg-surface/80 backdrop-blur-md p-4 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-primary animate-pulse"></div>
          <span className="text-sm font-bold uppercase tracking-widest text-primary" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Anya // AI Orchestrator
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/map"
            className="text-[10px] bg-transparent text-foreground border-[1px] border-border px-3 py-1 font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-colors hidden sm:block"
          >
            Live Map
          </Link>
          <Link 
            href="/profile"
            className="text-[10px] bg-transparent text-foreground border-[1px] border-border px-3 py-1 font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-colors hidden sm:block"
          >
            Profile
          </Link>
          <Link 
            href="/admin"
            className="text-[10px] bg-red-500/10 text-red-500 border-[1px] border-red-500 px-3 py-1 font-bold uppercase tracking-widest hover:bg-red-500 hover:text-black transition-colors hidden sm:block"
          >
            Admin Panel
          </Link>
          <button 
            onClick={() => setIsTicketModalOpen(true)}
            className="text-[10px] bg-surface text-primary border-[1px] border-primary px-3 py-1 font-bold uppercase tracking-widest hover:bg-primary hover:text-black transition-colors"
          >
            + Create Ticket
          </button>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden sm:block">
            {error ? "SYSTEM FAULT" : "SYSTEM ONLINE"}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6 scrollbar-thin z-10 relative">
        
        {/* EMPTY STATE */}
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center -mt-10">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <div className="w-20 h-20 border-[1px] border-primary bg-surface flex items-center justify-center relative overflow-hidden shrink-0 mx-auto mb-6 group">
                <div className="absolute inset-0 bg-primary/10 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="w-6 h-6 bg-primary rotate-45 flex items-center justify-center group-hover:rotate-180 transition-transform duration-700">
                  <div className="w-1.5 h-1.5 bg-background rounded-full"></div>
                </div>
              </div>
              <h2 className="text-3xl font-bold uppercase tracking-widest text-foreground mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>Ask Anya Anything</h2>
              <p className="text-gray-500 max-w-md mx-auto text-sm uppercase tracking-widest">Advanced Bennett University Intelligence</p>
            </motion.div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg) => {
            let contentToRender = msg.content;
            let ticketMatches = [];
            let sources = [];
            let isEmergency = false;

            // Extract all ticket routings (Multi-Intent)
            const ticketRegex = /\[TICKET_ROUTING:\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\]/g;
            let match;
            while ((match = ticketRegex.exec(msg.content)) !== null) {
              ticketMatches.push({ 
                department: match[1], 
                issue: match[2],
                priority: match[3],
                reason: match[4],
                confidence: match[5]
              });
            }
            contentToRender = contentToRender.replace(ticketRegex, "");

            // Extract Sources
            const sourceRegex = /\[SOURCE:\s*(.+?)\]/g;
            while ((match = sourceRegex.exec(contentToRender)) !== null) {
              sources.push(match[1]);
            }
            contentToRender = contentToRender.replace(sourceRegex, "");

            // Extract Emergency
            const emergencyRegex = /\[EMERGENCY\]/g;
            if (emergencyRegex.test(contentToRender)) {
              isEmergency = true;
              contentToRender = contentToRender.replace(emergencyRegex, "");
            }

            let lostMatch = null;
            const lostRegex = /\[LOST_REPORT:\s*(LOST|FOUND)\s*\|\s*(.+?)\s*\|\s*(.+?)\]/;
            const lMatch = contentToRender.match(lostRegex);
            
            if (lMatch) {
              lostMatch = { type: lMatch[1], item: lMatch[2], location: lMatch[3] };
              contentToRender = contentToRender.replace(lostRegex, "");
            }

            // Extract Marketplace
            const marketplaceMatches: any[] = [];
            const marketRegex = /\[MARKETPLACE:\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\]/g;
            while ((match = marketRegex.exec(contentToRender)) !== null) {
              marketplaceMatches.push({
                type: match[1],
                item: match[2],
                time: match[3]
              });
            }
            contentToRender = contentToRender.replace(marketRegex, "");

            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="mr-4 mt-1 hidden sm:block">
                    <AnyaAvatar />
                  </div>
                )}
                
                <div className={`
                  max-w-[95%] sm:max-w-[85%] p-5
                  ${msg.role === "user" ? "bg-primary text-white" : "bg-surface border-[1px] border-border text-foreground"}
                `}>
                  <div className={`text-[10px] font-bold mb-3 uppercase tracking-widest ${msg.role === "user" ? "text-white/70" : "text-primary"}`}>
                    {msg.role === "user" ? "You" : "Anya"}
                  </div>
                  {msg.role === "user" && messageImages[msg.id] && (
                    <div className="mb-4 bg-black/20 p-2 max-w-xs border-[1px] border-white/20">
                      <img src={messageImages[msg.id]} alt="User Upload" className="w-full h-auto object-contain" />
                    </div>
                  )}
                  <div className="leading-relaxed text-sm md:text-base font-medium markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {contentToRender.replace(/\[SYSTEM:.*?\]\n\n/, '')}
                    </ReactMarkdown>
                  </div>
                  {ticketMatches.map((ticket, idx) => (
                    <TicketCard 
                      key={idx} 
                      department={ticket.department} 
                      issue={ticket.issue} 
                      priority={ticket.priority}
                      reason={ticket.reason}
                      confidence={ticket.confidence}
                    />
                  ))}
                  
                  {isEmergency && (
                    <div className="mt-4 border-[1px] border-red-600 bg-red-950/30 p-4">
                      <div className="text-red-500 font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        URGENT ISSUE DETECTED
                      </div>
                      <p className="text-white text-sm">This may require immediate human assistance.</p>
                      <div className="mt-4 flex gap-3">
                        <button className="bg-red-600 text-white text-xs font-bold px-4 py-2 hover:bg-red-700 transition-colors">
                          Contact Campus Security
                        </button>
                      </div>
                    </div>
                  )}

                  {sources.length > 0 && (
                    <div className="mt-4 border-t-[1px] border-border pt-3">
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Sources</div>
                      {sources.map((source, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-400 bg-surface border-[1px] border-border p-2 mb-1">
                          📄 {source}
                        </div>
                      ))}
                    </div>
                  )}
                  {lostMatch && (
                    <div className="mt-4 border-[1px] border-orange-500 bg-orange-950/20 p-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 rotate-45 transform translate-x-8 -translate-y-8"></div>
                      <div className="text-[10px] text-orange-500 font-bold tracking-widest uppercase mb-1">
                        {lostMatch.type} ITEM REPORTED
                      </div>
                      <div className="text-white font-bold text-lg">{lostMatch.item}</div>
                      <div className="text-gray-400 text-sm mt-1">Location: {lostMatch.location}</div>
                      <div className="mt-3 flex items-center justify-between text-xs text-orange-400 font-mono">
                        <span>STATUS: LOGGED IN DATABASE</span>
                        <span>[ SYSTEM ACTIVE ]</span>
                      </div>
                    </div>
                  )}

                  {marketplaceMatches && marketplaceMatches.length > 0 && marketplaceMatches.map((market, idx) => (
                    <div key={idx} className="mt-4 border-[1px] border-blue-500 bg-blue-950/20 p-4 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rotate-45 transform translate-x-8 -translate-y-8 pointer-events-none"></div>
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-[10px] text-blue-500 font-bold tracking-widest uppercase flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                          CAMPUS MARKETPLACE // {market.type}
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 border-[1px] border-blue-500/30 flex items-center justify-center shrink-0 bg-background text-blue-500 font-bold">
                          {market.type.substring(0,1)}
                        </div>
                        <div>
                          <div className="text-white text-sm font-bold">{market.item}</div>
                          <div className="text-xs text-blue-200 mt-1 font-mono">{market.time}</div>
                        </div>
                      </div>

                      <div className="mt-4 border-t-[1px] border-blue-500/30 pt-3 flex justify-between items-center">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Status: Searching...</span>
                        <button className="bg-blue-600 text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                          Join & Match
                        </button>
                      </div>
                    </div>
                  ))}

                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full justify-start">
             <div className="mr-4 mt-1 hidden sm:block">
                <AnyaAvatar />
              </div>
            <div className="max-w-[95%] sm:max-w-[85%] p-5 bg-surface border-[1px] border-border w-full">
              <div className="text-[10px] font-bold mb-3 uppercase tracking-widest text-primary">Anya is thinking...</div>
              <TicketSkeleton />
            </div>
          </motion.div>
        )}
        
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full justify-start mt-4">
             <div className="mr-4 mt-1 hidden sm:block">
                <AnyaAvatar />
              </div>
            <div className="max-w-[95%] sm:max-w-[85%] p-5 bg-red-950/20 border-[1px] border-red-900 w-full text-red-500">
              <div className="text-[10px] font-bold mb-3 uppercase tracking-widest text-red-500">SYSTEM FAULT // ERROR</div>
              <div className="text-sm">
                Anya is unable to respond. Please ensure you have added a valid GROQ_API_KEY to your .env.local file.
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={endOfMessagesRef} />
      </div>

      {/* Suggestion Chips & Input Area */}
      <div className="p-4 md:p-8 pt-0 z-10 relative">
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => setMyInput(suggestion)}
                className="text-xs bg-surface border-[1px] border-border text-gray-400 px-4 py-2 uppercase tracking-wider hover:border-primary hover:text-primary transition-colors text-left"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Image Preview Area */}
        {selectedImage && (
          <div className="mb-2 relative w-24 h-24 border-[1px] border-primary bg-surface p-1">
            <img src={selectedImage} alt="Upload preview" className="w-full h-full object-cover" />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs hover:bg-red-700 transition-colors"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleCustomSubmit} className="relative flex items-center">
          <input 
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageUpload}
          />
          <input 
            type="text" 
            value={myInput}
            onChange={(e) => setMyInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Query Anya or upload an image..."}
            className={`w-full bg-surface border-[1px] border-border text-foreground p-5 pr-32 focus:outline-none focus:border-primary transition-colors rounded-none placeholder-gray-600 text-sm md:text-base ${isListening ? 'border-primary shadow-[0_0_10px_rgba(239,68,68,0.5)]' : ''}`}
            disabled={isLoading}
          />
          <div className="absolute right-2 top-2 bottom-2 flex items-center gap-2">
            {/* Camera Upload Button */}
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isOcrProcessing}
              className={`bg-transparent p-2 flex items-center justify-center transition-colors ${isOcrProcessing ? 'text-primary' : 'text-gray-400 hover:text-primary cursor-pointer'}`}
              title="Upload Image for OCR Diagnostic"
            >
              {isOcrProcessing ? (
                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              )}
            </button>
            {/* Voice Dictation Button */}
            <button 
              type="button"
              onClick={toggleListen}
              className={`text-gray-400 hover:text-primary transition-colors p-2 flex items-center justify-center cursor-pointer ${isListening ? 'text-primary animate-pulse' : ''}`}
              title="Voice Input"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>
            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading || (!myInput.trim() && !selectedImage)}
              className="bg-primary text-black font-bold flex items-center justify-center w-12 h-full hover:bg-transparent hover:text-primary border-[1px] border-primary transition-all disabled:opacity-30 disabled:hover:bg-primary disabled:hover:text-black cursor-pointer"
            >
              {/* Minimalist Arrow Icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Manual Ticket Modal */}
      <AnimatePresence>
        {isTicketModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface border-[1px] border-primary w-full max-w-md p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rotate-45 transform translate-x-8 -translate-y-8 pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold uppercase tracking-widest text-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  Manual Override
                </h3>
                <button 
                  onClick={() => setIsTicketModalOpen(false)}
                  className="text-gray-500 hover:text-primary transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleManualTicket} className="flex flex-col gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Target Department</label>
                  <select 
                    value={ticketDept}
                    onChange={(e) => setTicketDept(e.target.value)}
                    className="w-full bg-background border-[1px] border-border p-3 text-foreground focus:outline-none focus:border-primary transition-colors text-sm appearance-none"
                  >
                    <option value="Facilities">Facilities & Maintenance</option>
                    <option value="IT Support">IT & Network Support</option>
                    <option value="Hostel Admin">Hostel Administration</option>
                    <option value="Academics">Academic Registry</option>
                    <option value="Examinations">Examinations Department</option>
                    <option value="Finance">Finance & Accounts</option>
                    <option value="Sports">Sports & Wellness</option>
                    <option value="Library">Library Services (LRC)</option>
                    <option value="Security">Security & Gate Pass</option>
                    <option value="Career Services">Career Services & Placements</option>
                    <option value="Student Welfare">Student Welfare & Clubs</option>
                    <option value="Mess">Cafeteria & Mess</option>
                    <option value="Transport">Transport Services</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Issue Description</label>
                  <textarea 
                    value={ticketIssue}
                    onChange={(e) => setTicketIssue(e.target.value)}
                    className="w-full bg-background border-[1px] border-border p-3 text-foreground focus:outline-none focus:border-primary transition-colors text-sm h-32 resize-none"
                    placeholder="Describe the issue in detail..."
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={!ticketIssue.trim()}
                  className="w-full bg-primary text-black font-bold uppercase tracking-widest p-4 hover:bg-transparent hover:text-primary border-[1px] border-primary transition-all disabled:opacity-50 mt-2"
                >
                  Generate Ticket
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
