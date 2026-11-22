"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { ToastProvider } from "@/components/admin/ToastContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If on login route, render standalone clean layout without sidebar
  if (pathname === "/admin/login") {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center">
          {children}
        </div>
      </ToastProvider>
    );
  }

  // Map route to title
  const getPageTitle = (path: string) => {
    if (path.includes("/admin/projects")) return "Completed Projects Management";
    if (path.includes("/admin/ongoing-projects")) return "Ongoing Projects & Live Sites";
    if (path.includes("/admin/gallery")) return "Interior Gallery Management";
    if (path.includes("/admin/services")) return "Services Management";
    if (path.includes("/admin/business-info")) return "Business Settings & Profile";
    if (path.includes("/admin/enquiries")) return "Contact Enquiries & Leads";
    if (path.includes("/admin/settings")) return "Admin Account Settings";
    return "Executive Dashboard";
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-stone-900 text-stone-100 flex">
        <AdminSidebar
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader
            title={getPageTitle(pathname)}
            onOpenMobile={() => setMobileOpen(true)}
          />
          <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
