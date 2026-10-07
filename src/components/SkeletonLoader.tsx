"use client";
import React from "react";

export function TicketSkeleton() {
  return (
    <div className="border-[1px] border-border bg-surface p-6 flex flex-col gap-4 rounded-none h-full">
      <div className="skeleton h-6 w-1/3 mb-2"></div>
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-5/6"></div>
      <div className="skeleton h-4 w-4/6"></div>
      
      <div className="mt-auto pt-4 flex gap-4 border-t-[1px] border-border">
        <div className="skeleton h-8 w-24"></div>
        <div className="skeleton h-8 w-24"></div>
      </div>
    </div>
  );
}
