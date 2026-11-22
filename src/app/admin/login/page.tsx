"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/admin/ToastContext";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const fromUrl = searchParams.get("from") || "/admin/dashboard";
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed");
      }

      showToast("Welcome back. Authentication verified.", "success");
      router.push(fromUrl);
      router.refresh();
    } catch (err: unknown) {
      console.error("Login error:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-6 py-12">
      {/* Brand Identity */}
      <div className="text-center mb-10">
        <span className="text-2xl font-light tracking-[0.25em] uppercase text-white block">
          RAJSHILA
        </span>
        <span className="text-[10px] tracking-[0.3em] uppercase text-amber-400 font-mono mt-1 block">
          ADMINISTRATION PORTAL • BHOPAL
        </span>
        <p className="mt-3 text-xs text-stone-400 font-light">
          Private access for Rajshila Construction engineering leadership.
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-stone-900 border border-stone-800 p-8 shadow-2xl relative">
        <div className="border-b border-stone-800 pb-4 mb-6">
          <h2 className="text-lg font-light text-stone-100">
            Sign In to Dashboard
          </h2>
          <span className="text-xs text-stone-500 font-mono">
            Authorized personnel only
          </span>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-950/60 border border-rose-900 text-rose-300 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5" noValidate>
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2 font-mono">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rajshilaconstruction.com"
                required
                className="w-full bg-stone-950 border border-stone-800 pl-10 pr-4 py-3 text-stone-100 text-xs focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2 font-mono">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-stone-950 border border-stone-800 pl-10 pr-4 py-3 text-stone-100 text-xs focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#B58D54] hover:bg-[#A37B43] text-stone-950 font-medium text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer shadow-lg mt-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Authenticate Session</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[11px] text-stone-500 font-mono">
          Security standard: HTTP-only encrypted session • Rate-limited protection
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-950 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
