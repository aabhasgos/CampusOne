"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const searchParams = useSearchParams();
  const defaultMode = searchParams.get("type") === "admin" ? "ADMIN" : "STUDENT";
  
  const [mode, setMode] = useState<"STUDENT" | "ADMIN">(defaultMode);
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-fill logic for demo ease
  useEffect(() => {
    if (mode === "ADMIN") {
      setEnrollmentNumber("admin");
      setPassword("admin");
    } else {
      setEnrollmentNumber("S21CSEU0000");
      setPassword("bennett");
    }
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      enrollmentNumber,
      password,
    });

    if (res?.error) {
      setError("Invalid credentials. Hint: For student use 'S21CSEU0000' and 'bennett'.");
      setLoading(false);
    } else {
      window.location.href = "/";
    }
  };

  const isStudent = mode === "STUDENT";
  const themeColor = isStudent ? "var(--orange-500)" : "var(--primary)";
  const themeClass = isStudent ? "text-orange-500" : "text-primary";
  const borderClass = isStudent ? "border-orange-500" : "border-primary";
  const bgClass = isStudent ? "bg-orange-500" : "bg-primary";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden transition-colors duration-500">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #888 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface border-[1px] border-border p-8 z-10"
      >
        <div className="mb-6 text-center">
          <div className={`w-16 h-16 border-[1px] ${borderClass} bg-[#050505] flex items-center justify-center mx-auto mb-6 transition-colors duration-500`}>
            <div className={`w-6 h-6 ${bgClass} rotate-45 transition-colors duration-500`}></div>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            CampusOne
          </h1>
          <p className={`${themeClass} text-xs font-bold uppercase tracking-widest mt-2 transition-colors duration-500`}>
            {isStudent ? "Student Portal" : "Admin Command"} Login
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex w-full mb-8 border-[1px] border-border bg-background p-1">
          <button
            type="button"
            onClick={() => setMode("STUDENT")}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-all ${isStudent ? 'bg-orange-500 text-black' : 'text-gray-500 hover:text-white'}`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setMode("ADMIN")}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-all ${!isStudent ? 'bg-primary text-black' : 'text-gray-500 hover:text-white'}`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              {isStudent ? "Enrollment Number" : "Admin ID"}
            </label>
            <input 
              type="text" 
              value={enrollmentNumber}
              onChange={(e) => setEnrollmentNumber(e.target.value)}
              className={`w-full bg-background border-[1px] border-border p-3 text-foreground focus:outline-none focus:border-b-2 transition-colors text-sm uppercase ${isStudent ? 'focus:border-orange-500' : 'focus:border-primary'}`}
              placeholder={isStudent ? "E.g. S21CSEU0000" : "admin"}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-background border-[1px] border-border p-3 text-foreground focus:outline-none focus:border-b-2 transition-colors text-sm ${isStudent ? 'focus:border-orange-500' : 'focus:border-primary'}`}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="text-red-500 text-xs font-bold bg-red-950/30 border border-red-900 p-3">{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full text-black font-bold uppercase tracking-widest p-4 hover:bg-transparent transition-all disabled:opacity-50 mt-4 border-[1px] ${bgClass} ${borderClass} ${isStudent ? 'hover:text-orange-500' : 'hover:text-primary'}`}
          >
            {loading ? "Authenticating..." : `Login as ${isStudent ? 'Student' : 'Admin'}`}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background text-primary">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
