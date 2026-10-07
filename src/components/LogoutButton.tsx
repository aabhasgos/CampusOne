"use client";
import React from "react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-[10px] text-gray-400 border-[1px] border-gray-600 px-3 py-1.5 font-bold uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-colors ml-4"
      title="Log out of CampusOne"
    >
      Log Out
    </button>
  );
}
