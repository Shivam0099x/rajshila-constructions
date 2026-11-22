"use client";

import React from "react";
import { Menu, ShieldCheck } from "lucide-react";

interface AdminHeaderProps {
  title?: string;
  onOpenMobile?: () => void;
}

export function AdminHeader({ title = "Administration", onOpenMobile }: AdminHeaderProps) {
  return (
    <header className="bg-stone-950/80 backdrop-blur-md border-b border-stone-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        {onOpenMobile && (
          <button
            type="button"
            onClick={onOpenMobile}
            className="lg:hidden p-2 text-stone-400 hover:text-white"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-lg font-light text-stone-100 tracking-wide">
          {title}
        </h1>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center bg-stone-900 border border-stone-800 px-3 py-1.5 text-xs text-stone-300 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400 mr-2" />
          <span>Admin Portal</span>
        </div>
      </div>
    </header>
  );
}
