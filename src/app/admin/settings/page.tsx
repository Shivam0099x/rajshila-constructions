"use client";

import React, { useState, useEffect } from "react";
import { KeyRound, Loader2, User } from "lucide-react";
import { AdminUser } from "@/types";
import { formatDate } from "@/lib/project-utils";
import { useToast } from "@/components/admin/ToastContext";

export default function AdminSettingsPage() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [lastLogin, setLastLogin] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { showToast } = useToast();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    async function loadMe() {
      try {
        const res = await fetch("/api/admin/auth/me");
        const json = await res.json();
        if (res.ok && json.success) {
          setUser(json.user);
          setLastLogin(json.user.lastLogin);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMe();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("New password and confirmation do not match.", "error");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      showToast("New password must be at least 8 characters.", "error");
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to change password");
      }

      showToast("Password updated successfully", "success");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Change password error:", err);
      showToast(err instanceof Error ? err.message : "Error changing password", "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Top Header */}
      <div className="border-b border-stone-800 pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-1">
          Identity & Security
        </span>
        <h2 className="text-2xl font-light text-stone-100">
          Account Settings
        </h2>
        <p className="text-xs text-stone-400 font-light mt-1">
          Manage administrative credentials and authentication security.
        </p>
      </div>

      {/* Account Profile Card */}
      <div className="bg-stone-950 border border-stone-800 p-6 space-y-4">
        <h3 className="text-xs uppercase tracking-widest text-amber-400 font-mono flex items-center">
          <User className="w-4 h-4 mr-2" />
          Administrator Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 bg-stone-900 border border-stone-800">
            <span className="text-stone-500 block mb-1">Username</span>
            <span className="text-stone-200 font-medium">{user?.username}</span>
          </div>

          <div className="p-3 bg-stone-900 border border-stone-800">
            <span className="text-stone-500 block mb-1">Email Address</span>
            <span className="text-stone-200 font-medium">{user?.email}</span>
          </div>

          <div className="p-3 bg-stone-900 border border-stone-800">
            <span className="text-stone-500 block mb-1">Role & Permissions</span>
            <span className="text-amber-400 font-bold uppercase">{user?.role}</span>
          </div>

          <div className="p-3 bg-stone-900 border border-stone-800">
            <span className="text-stone-500 block mb-1">Last Active Session</span>
            <span className="text-stone-200">
              {lastLogin ? formatDate(lastLogin, true) : "Current Session"}
            </span>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-stone-950 border border-stone-800 p-6 space-y-4">
        <h3 className="text-xs uppercase tracking-widest text-amber-400 font-mono flex items-center">
          <KeyRound className="w-4 h-4 mr-2" />
          Update Security Password
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
              Current Password *
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              required
              placeholder="••••••••••••"
              className="w-full bg-stone-900 border border-stone-800 px-3 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
              New Password (Min. 8 characters) *
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              required
              placeholder="••••••••••••"
              className="w-full bg-stone-900 border border-stone-800 px-3 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
              Confirm New Password *
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
              }
              required
              placeholder="••••••••••••"
              className="w-full bg-stone-900 border border-stone-800 px-3 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-6 py-2.5 bg-[#B58D54] hover:bg-[#A37B43] text-stone-950 text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer disabled:opacity-50 flex items-center"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
