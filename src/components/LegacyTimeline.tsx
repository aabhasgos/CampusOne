"use client";

import { motion } from "framer-motion";

const timelineEvents = [
  {
    year: "1838",
    title: "The Times Group Founded",
    description: "India's largest media conglomerate begins its 180+ year legacy of leadership, truth, and excellence.",
  },
  {
    year: "2016",
    title: "Bennett University Established",
    description: "Founded in Greater Noida by Chancellor Vineet Jain to bring Ivy League quality education to India.",
  },
  {
    year: "Today",
    title: "14,000+ Strong Community",
    description: "A thriving multidisciplinary campus across 68 acres, featuring 8 academic schools and state-of-the-art NVIDIA & Dell labs.",
  }
];

export default function LegacyTimeline() {
  return (
    <div className="py-12 w-full max-w-5xl mx-auto relative px-6 md:px-0">
      
      {/* Central Line (Desktop) / Left Line (Mobile) */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-primary/30 md:-ml-[1px]" />

      <div className="flex flex-col gap-16 relative z-10">
        {timelineEvents.map((event, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col md:flex-row items-center w-full ${isEven ? 'md:flex-row-reverse' : ''}`}
            >
              
              {/* Content Side */}
              <div className="w-full md:w-1/2 flex pl-12 md:pl-0">
                <div className={`w-full flex flex-col ${isEven ? 'md:items-start md:pl-16' : 'md:items-end md:pr-16 text-left md:text-right'}`}>
                  <span className="text-5xl md:text-6xl font-bold text-primary opacity-20 absolute -z-10 -mt-6 -ml-4 md:ml-0" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    {event.year}
                  </span>
                  <span className="text-3xl font-bold text-primary mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    {event.year}
                  </span>
                  <h4 className="text-xl font-bold text-foreground uppercase tracking-widest mb-3">
                    {event.title}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Center Node */}
              <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-background border-2 border-primary rotate-45 -translate-x-1/2" />
              
              {/* Empty Side (For Desktop Layout) */}
              <div className="hidden md:block w-1/2" />
              
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
