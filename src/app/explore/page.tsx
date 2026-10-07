"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const schools = [
  { name: "School of Computer Science (SCSET)", specs: ["Artificial Intelligence", "Cyber Security", "Gaming & VR", "Drones & IoT", "Cloud Computing"] },
  { name: "School of Management", specs: ["Finance", "Marketing", "Business Analytics", "Entrepreneurship"] },
  { name: "School of Law", specs: ["BA LLB (Hons)", "BBA LLB (Hons)", "Cyber Law", "Corporate Law"] },
  { name: "School of Media", specs: ["Journalism", "Digital Media", "Film & TV Production", "Advertising"] },
  { name: "School of Design", specs: ["UI/UX", "Product Design", "Animation", "Visual Communication"] },
  { name: "School of Liberal Arts", specs: ["Psychology", "Economics", "English", "Political Science"] },
];

const partners = ["NVIDIA", "DELL", "IBM", "APPLE", "AWS", "MICROSOFT", "CISCO", "RED HAT"];

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-12 px-6 md:px-12">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #888 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="max-w-7xl mx-auto flex flex-col gap-24 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 border-b-2 border-primary/20 pb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-4 bg-primary rotate-45"></div>
            <span className="text-sm font-bold uppercase tracking-widest text-primary font-mono">
              Dataset: BU_INFRA_2026
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Explore <span className="text-primary">Bennett</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            A comprehensive overview of Bennett University's academic schools, industry-backed research labs, and world-class sports facilities.
          </p>
        </motion.div>

        {/* 1. Academic Schools Explorer */}
        <section>
          <h2 className="text-3xl font-bold uppercase tracking-widest text-foreground mb-8 flex items-center gap-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            <span className="text-primary border-[1px] border-primary p-2 text-sm">01</span>
            Academic Schools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group border-[1px] border-border bg-surface p-6 hover:border-primary hover:bg-primary/5 transition-all cursor-crosshair relative overflow-hidden h-48"
              >
                <h3 className="text-xl font-bold text-foreground uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {school.name}
                </h3>
                <div className="absolute bottom-0 left-0 w-full h-full bg-surface p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col justify-center border-t-[1px] border-primary">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-widest mb-2">Specializations</span>
                  <ul className="text-sm text-gray-300 flex flex-col gap-1">
                    {school.specs.map((spec, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-primary rounded-full"></span> {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 2. Industry Partners & Tech Labs */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold uppercase tracking-widest text-foreground mb-8 flex items-center gap-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            <span className="text-primary border-[1px] border-primary p-2 text-sm">02</span>
            Industry Partners & Labs
          </h2>
          <div className="border-[1px] border-border bg-surface p-8 overflow-hidden relative">
            <div className="absolute inset-0 bg-primary/5"></div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 relative z-10">
              {partners.map((partner, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.1, color: "var(--primary)" }}
                  className="text-3xl md:text-5xl font-bold text-gray-700 uppercase tracking-tighter cursor-default transition-colors"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {partner}
                </motion.div>
              ))}
            </div>
            <p className="text-center text-gray-400 mt-8 text-sm uppercase tracking-widest font-mono">
              Powering 121+ advanced teaching and research laboratories across campus.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
