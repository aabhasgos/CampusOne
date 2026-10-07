import React, { useState } from "react";
import { motion } from "framer-motion";

export const TicketCard = ({ department, issue, priority = "NORMAL", reason = "", confidence = "90" }: { department: string, issue: string, priority?: string, reason?: string, confidence?: string }) => {
  const isHigh = priority.toUpperCase().includes("HIGH");
  const [resolved, setResolved] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`mt-4 border-[1px] ${resolved ? 'border-green-600 bg-green-950/20' : (isHigh ? 'border-red-600 bg-red-950/20' : 'border-primary bg-surface')} overflow-hidden relative`}
    >
      <div className={`absolute top-0 right-0 w-16 h-16 ${resolved ? 'bg-green-600/20' : (isHigh ? 'bg-red-600/20' : 'bg-primary/10')} rotate-45 transform translate-x-8 -translate-y-8 pointer-events-none`}></div>
      
      <div className={`${resolved ? 'bg-green-600' : (isHigh ? 'bg-red-600' : 'bg-primary')} px-4 py-2 flex justify-between items-center transition-colors`}>
        <span className="text-black font-bold uppercase tracking-widest text-xs flex items-center gap-2">
          {resolved ? '✓ TICKET RESOLVED' : `TICKET ROUTED ${isHigh ? '⚠️ URGENT' : ''}`}
        </span>
        <span className="text-black/70 font-mono text-[10px]">
          CONFIDENCE: {confidence}%
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Confidence Meter */}
        <div className="mb-2">
           <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400 mb-1">
             <span>Routing Confidence</span>
             <span className={resolved ? 'text-green-400' : (isHigh ? 'text-red-400' : 'text-primary')}>{confidence}%</span>
           </div>
           <div className="w-full bg-black h-1.5 overflow-hidden">
             <div 
               className={`h-full transition-all duration-1000 ${resolved ? 'bg-green-600 w-full' : (isHigh ? 'bg-red-600' : 'bg-primary')}`} 
               style={{ width: resolved ? '100%' : `${confidence}%` }}
             ></div>
           </div>
        </div>

        <div className="flex gap-4 items-start mt-2">
          <div className={`w-10 h-10 border-[1px] border-border flex items-center justify-center shrink-0 bg-background ${resolved ? 'text-green-500' : (isHigh ? 'text-red-500' : 'text-primary')} font-bold transition-colors`}>
            {department.substring(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              TARGET DEPARTMENT
            </div>
            <div className="text-foreground text-sm font-bold">
              {department}
            </div>
          </div>
        </div>

        <div className="mt-1 pl-14">
           <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              ISSUE
            </div>
            <div className="text-foreground text-sm">
              {issue}
            </div>
            
            {reason && !resolved && (
              <div className="mt-2 text-xs text-gray-400 border-l-2 border-gray-600 pl-2">
                <span className="font-bold text-gray-300">AI Priority Reason:</span> {reason}
              </div>
            )}
        </div>
      </div>
      
      {/* Visual Tracking Stepper */}
      <div className="border-t-[1px] border-border bg-background p-3 flex flex-col gap-3">
         <div className="flex justify-between text-[9px] uppercase font-bold text-gray-500 mb-1">
           <span className={resolved ? 'text-green-500' : (isHigh ? 'text-red-500' : 'text-primary')}>Submitted</span>
           <span className={resolved ? 'text-green-500' : ''}>Assigned</span>
           <span className={resolved ? 'text-green-500' : ''}>In Progress</span>
           <span className={resolved ? 'text-green-500' : ''}>Resolved</span>
         </div>
         <div className="flex items-center w-full px-2">
           <div className={`w-3 h-3 rounded-full ${resolved ? 'bg-green-600' : (isHigh ? 'bg-red-600 animate-pulse' : 'bg-primary')}`}></div>
           <div className={`flex-1 h-[1px] mx-2 ${resolved ? 'bg-green-600' : 'bg-border'}`}></div>
           <div className={`w-2 h-2 rounded-full ${resolved ? 'bg-green-600' : 'bg-border'}`}></div>
           <div className={`flex-1 h-[1px] mx-2 ${resolved ? 'bg-green-600' : 'bg-border'}`}></div>
           <div className={`w-2 h-2 rounded-full ${resolved ? 'bg-green-600' : 'bg-border'}`}></div>
           <div className={`flex-1 h-[1px] mx-2 ${resolved ? 'bg-green-600' : 'bg-border'}`}></div>
           <div className={`w-2 h-2 rounded-full ${resolved ? 'bg-green-600' : 'bg-border'}`}></div>
         </div>
         
         {!resolved && (
           <div className="mt-2 flex justify-end">
             <button 
               onClick={() => setResolved(true)}
               className="text-[10px] border-[1px] border-green-600 text-green-500 hover:bg-green-600 hover:text-black font-bold uppercase tracking-widest px-3 py-1 transition-colors"
             >
               Mark as Resolved
             </button>
           </div>
         )}
      </div>
    </motion.div>
  );
};
