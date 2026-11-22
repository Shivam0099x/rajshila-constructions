"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Activity,
  Image as ImageIcon,
  Briefcase,
  Building2,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  X,
} from "lucide-react";
import { useToast } from "./ToastContext";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Completed Projects", icon: CheckSquare },
  { href: "/admin/ongoing-projects", label: "Ongoing Projects", icon: Activity },
  { href: "/admin/gallery", label: "Interior Gallery", icon: ImageIcon },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/business-info", label: "Business Information", icon: Building2 },
  { href: "/admin/enquiries", label: "Contact Enquiries", icon: Inbox },
  { href: "/admin/settings", label: "Account Settings", icon: Settings },
];

export function AdminSidebar({ mobileOpen = false, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      showToast("Logged out successfully");
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      router.push("/admin/login");
    }
  };

  const content = (
    <div className="h-full flex flex-col justify-between bg-stone-950 border-r border-stone-800 text-stone-300 w-64 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-stone-800/80 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex flex-col">
            <span className="text-lg font-light tracking-[0.2em] uppercase text-white">
              RAJSHILA
            </span>
            <span className="text-[10px] tracking-[0.25em] uppercase text-amber-400 font-mono">
              MANAGEMENT PORTAL
            </span>
          </Link>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center px-3.5 py-2.5 text-xs tracking-wider uppercase transition-colors group",
                  isActive
                    ? "bg-stone-900 text-amber-300 font-medium border-l-2 border-amber-400"
                    : "text-stone-400 hover:bg-stone-900/60 hover:text-stone-100"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 mr-3 transition-colors",
                    isActive
                      ? "text-amber-400"
                      : "text-stone-500 group-hover:text-stone-300"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation: Live Site & Logout */}
      <div className="p-4 border-t border-stone-800/80 space-y-2">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-3.5 py-2 text-xs text-stone-400 hover:text-white hover:bg-stone-900/60 transition-colors uppercase tracking-wider"
        >
          <ExternalLink className="w-3.5 h-3.5 mr-3 text-stone-500" />
          <span>View Public Site</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center px-3.5 py-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors uppercase tracking-wider cursor-pointer text-left"
        >
          <LogOut className="w-3.5 h-3.5 mr-3" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:block h-screen sticky top-0 shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer (Overlay) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
