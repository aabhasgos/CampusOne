"use client";
import dynamic from "next/dynamic";
import Link from "next/link";

const DynamicMap = dynamic(() => import("../../components/RestrictedMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-background border-[1px] border-border text-primary font-bold uppercase tracking-widest text-sm">
      <div className="w-4 h-4 bg-primary rotate-45 mb-4 animate-pulse"></div>
      Calibrating Satellite Feed...
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #888 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      {/* Header */}
      <div className="border-b-[1px] border-border bg-surface/80 backdrop-blur-md p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-primary rotate-45"></div>
          <span className="text-sm font-bold uppercase tracking-widest text-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Campus<span className="text-primary">One</span> // Campus Cartography
          </span>
        </div>
        <div className="flex gap-4">
          <Link href="/" className="text-[10px] bg-surface text-foreground border-[1px] border-border px-3 py-1 font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-colors">
            Back to Orchestrator
          </Link>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative p-4 lg:p-8 z-10 flex flex-col">

        <div className="w-full flex-1 min-h-[70vh] border-[1px] border-primary relative overflow-hidden group">
          
          {/* Decorative Corner Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary z-20"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary z-20"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary z-20"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary z-20"></div>
          
          {/* HUD Overlay */}
          <div className="absolute top-4 left-4 z-20 bg-background/90 border-[1px] border-border p-3 backdrop-blur-md">
             <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
               Satellite Feed Active
             </div>
             <div className="text-xs text-foreground font-mono">
               LAT: 28.4506 N<br />LNG: 77.5842 E
             </div>
          </div>

          <div className="absolute inset-0 w-full h-full grayscale-[50%] contrast-125 sepia-[20%] hue-rotate-[-10deg]">
            <DynamicMap />
          </div>
        </div>
      </div>
    </div>
  );
}
