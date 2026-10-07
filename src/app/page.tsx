"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import Chatbot from "../components/Chatbot";
import LegacyTimeline from "../components/LegacyTimeline";

const ThreeCanvas = dynamic(() => import("../components/ThreeCanvas"), { ssr: false });

// Marquee component for "crazy" dynamic UI text
const Marquee = ({ text, reverse = false }: { text: string; reverse?: boolean }) => {
  return (
    <div className="flex w-full overflow-hidden bg-primary text-background border-y-[1px] border-border py-3">
      <motion.div
        className="flex whitespace-nowrap text-xs font-bold uppercase tracking-widest"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
      >
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
      </motion.div>
    </div>
  );
};

import { useSession } from "next-auth/react";
import Link from "next/link";

const AuthButtons = () => {
  const { data: session, status } = useSession();
  
  if (status === "loading" || session) return null; // Don't show if logged in
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1 }}
      className="mt-6 flex flex-col sm:flex-row gap-4 relative z-20 pt-6 border-t-[1px] border-border/50 max-w-lg"
    >
      <Link href="/login?type=student" className="flex-1 bg-transparent text-gray-400 font-bold uppercase tracking-widest py-3 px-6 border-[1px] border-gray-600 hover:border-orange-500 hover:text-orange-500 transition-colors duration-300 text-center text-xs flex items-center justify-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        Student Login
      </Link>
      <Link href="/login?type=admin" className="flex-1 bg-transparent text-gray-400 font-bold uppercase tracking-widest py-3 px-6 border-[1px] border-gray-600 hover:border-primary hover:text-primary transition-colors duration-300 text-center text-xs flex items-center justify-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        Admin Portal Login
      </Link>
    </motion.div>
  );
};

export default function Home() {
  const chatbotRef = useRef<HTMLElement>(null);
  const architectureRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const scrollToChat = () => {
    chatbotRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToArchitecture = () => {
    architectureRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col w-full relative bg-background overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative w-full h-screen min-h-[800px] flex items-center border-b-[1px] border-border overflow-hidden">
        {/* 3D Canvas Background */}
        <ThreeCanvas />
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #333 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>

        <motion.div 
          className="z-10 px-6 md:px-12 w-full max-w-7xl mx-auto flex flex-col gap-6"
          style={{ y: yHero }}
        >
          {/* Staggered Text Reveal */}
          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter text-foreground"
              style={{ fontFamily: "var(--font-space-grotesk)", lineHeight: 0.9 }}
            >
              Ask once.
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
              className="text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter text-primary"
              style={{ fontFamily: "var(--font-space-grotesk)", lineHeight: 0.9 }}
            >
              Get routed
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
              className="text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter text-foreground"
              style={{ fontFamily: "var(--font-space-grotesk)", lineHeight: 0.9 }}
            >
              Correctly.
            </motion.h1>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            className="text-xl md:text-2xl max-w-2xl text-gray-400 mt-6 border-l-4 border-primary pl-4"
          >
            A unified, confidence-aware conversational orchestration platform for campus services.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-8 flex flex-col sm:flex-row gap-6 relative z-20"
          >
            <button 
              onClick={scrollToChat}
              className="group relative bg-primary text-background font-bold uppercase tracking-widest py-5 px-10 border-[1px] border-primary hover:bg-transparent hover:text-primary transition-all duration-300 rounded-none overflow-hidden"
            >
              <span className="relative z-10">Start Orchestration</span>
              <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300 ease-in-out mix-blend-difference"></div>
            </button>
            <button 
              onClick={scrollToArchitecture}
              className="bg-transparent text-foreground font-bold uppercase tracking-widest py-5 px-10 border-[1px] border-border hover:bg-foreground hover:text-background transition-colors duration-300 rounded-none cursor-pointer"
            >
              View Architecture
            </button>
          </motion.div>
          
          <AuthButtons />

        </motion.div>
      </section>

      <Marquee text="SYSTEM ONLINE // MULTI-INTENT ROUTING ACTIVE // CONFIDENCE THRESHOLD 90% // DOMAINS: ACADEMICS, IT, FINANCE, FACILITIES, HOSTELS // " />

      {/* CHATBOT SECTION */}
      <section ref={chatbotRef} id="chatbot" className="relative w-full border-b-[1px] border-border bg-background py-24 px-6 md:px-12">
        <div className="absolute top-10 right-10 text-9xl font-bold text-foreground opacity-[0.03] pointer-events-none select-none" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          01
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col gap-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4 text-center items-center justify-center mb-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>The Main Front Door</h2>
            <p className="text-gray-400 max-w-2xl text-lg">
              Type a complex query. The Orchestration Layer dynamically detects intents across 15+ departments, providing a unified, grounded response.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Chatbot />
          </motion.div>
        </div>
      </section>

      <Marquee text="ARCHITECTURE // GROUNDED CITATIONS // ZERO-HALLUCINATION POLICY // ACTION-CAPABLE WORKFLOWS // " reverse={true} />

      {/* ARCHITECTURE SECTION */}
      <section ref={architectureRef} id="features" className="relative w-full border-b-[1px] border-border bg-background">
        <div className="absolute top-10 right-10 text-9xl font-bold text-foreground opacity-[0.03] pointer-events-none select-none" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          02
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row relative z-10">
          <div className="md:w-1/3 p-8 md:p-16 border-b-[1px] md:border-b-0 md:border-r-[1px] border-border flex flex-col justify-center bg-surface">
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>Intelligent<br/><span className="text-primary">Routing</span></h2>
            <p className="mt-6 text-gray-400 text-lg leading-relaxed">
              The student should not have to understand the university&apos;s organizational structure in order to get help. CampusOne understands the structure for them.
            </p>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2">
            {[
              { title: "Multi-Topic", desc: "Support questions containing multiple independent intents in a single pass." },
              { title: "Grounded", desc: "Every domain uses its own approved knowledge source. Answers with citations." },
              { title: "Confidence", desc: "The assistant does not confidently guess. Uncertain routing triggers clarification." },
              { title: "Action-Capable", desc: "Initiates workflows and ticket generation securely when APIs are supported." },
            ].map((feature, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`p-8 md:p-12 border-border flex flex-col gap-4 group hover:bg-[#111] transition-colors
                  ${idx % 2 === 0 ? "border-r-[1px]" : ""}
                  ${idx < 2 ? "border-b-[1px]" : ""}
                `}
              >
                {/* Crazy UI Indicator */}
                <div className="w-10 h-10 border-[1px] border-primary flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform">
                  <div className="w-full h-[1px] bg-primary absolute top-1/2 left-0 -translate-y-1/2 rotate-45 group-hover:rotate-0 transition-transform duration-500"></div>
                  <div className="w-full h-[1px] bg-primary absolute top-1/2 left-0 -translate-y-1/2 -rotate-45 group-hover:rotate-90 transition-transform duration-500"></div>
                </div>
                <h3 className="text-2xl font-bold uppercase text-foreground mt-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>{feature.title}</h3>
                <p className="text-gray-400 text-base leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LEGACY & LEADERSHIP SECTION */}
      <section id="legacy" className="relative w-full border-b-[1px] border-border bg-background py-24 px-6 md:px-12">
        <div className="absolute top-10 right-10 text-9xl font-bold text-primary opacity-[0.05] pointer-events-none select-none" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          03
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col gap-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4 text-center items-center justify-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>Legacy of <span className="text-primary">Bennett</span></h2>
            <p className="text-gray-500 max-w-3xl text-lg dark:text-gray-400">
              Established by the Times Group, India&apos;s largest media conglomerate, Bennett University carries forward a 180+ year legacy of leadership, truth, and excellence.
            </p>
          </motion.div>

          <LegacyTimeline />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Chancellor",
                name: "Vineet Jain",
                desc: "Managing Director of the Times Group, guiding Bennett University's vision to become a center of excellence in education.",
                image: "/leaders/leader1.png"
              },
              {
                title: "Vice Chancellor",
                name: "Prof. (Dr.) Prabhu Kumar Aggarwal",
                desc: "Leading the academic and administrative affairs with a strong focus on research and global partnerships.",
                image: "/leaders/leader2.png"
              },
              {
                title: "Dean of Academics",
                name: "Prof. (Dr.) Sanjeev Singh",
                desc: "Ensuring academic rigor, curriculum innovation, and student success across all engineering and management programs.",
                image: "/leaders/leader3.png"
              }
            ].map((leader, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.2 }}
                className="border-[1px] border-border bg-surface p-8 group hover:border-primary transition-colors flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 mb-6 rounded-full border-2 border-primary overflow-hidden bg-background flex items-center justify-center relative">
                  <img src={leader.image} alt={leader.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {leader.title}
                </h3>
                <h4 className="text-xl font-bold text-foreground mb-4">{leader.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {leader.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MAPS SECTION */}
      <section id="maps" className="relative w-full p-6 md:p-16 bg-surface">
        <div className="absolute top-10 right-10 text-9xl font-bold text-foreground opacity-[0.03] pointer-events-none select-none" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          04
        </div>

        <div className="max-w-7xl mx-auto flex flex-col gap-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 text-center items-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>Campus Maps</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-3xl text-lg">
              Navigate spatial grounding directly inside CampusOne. Our live satellite feed provides an integrated top-down view of all connected facilities.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full h-[700px] border-[1px] border-border bg-background relative shadow-2xl p-2 md:p-4 group"
          >
            <div className="absolute top-6 left-6 z-10 bg-background/90 border-[1px] border-primary px-4 py-2 pointer-events-none hidden md:block">
              <span className="text-primary font-bold tracking-widest uppercase text-xs">Live Satellite Feed — Bennett University</span>
            </div>
            
            <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20"></div>
            
            <iframe 
              src="https://maps.google.com/maps?q=Bennett%20University,%20Greater%20Noida&t=k&z=17&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-[1px] border-border filter contrast-125 grayscale-[10%] group-hover:grayscale-0 transition-all duration-700"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bennett Satellite View"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
