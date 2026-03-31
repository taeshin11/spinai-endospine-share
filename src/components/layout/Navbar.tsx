"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bell, User, LogOut, Video, Search } from "lucide-react";
import { createClient } from "@/lib/supabase";
import type { Profile } from "@/types/database";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();
        setUser(data);
      }
      setLoading(false);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
      } else if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setUser(data);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const navLinks = user
    ? [
        { href: "/gallery", label: "Gallery", icon: Video },
        { href: "/dashboard", label: "My Videos", icon: User },
        { href: "/upload", label: "Upload", icon: Video },
      ]
    : [];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4DA8B2] text-white font-bold text-sm">
              ES
            </div>
            <span className="text-lg font-bold text-gray-900">
              EndoSpine <span className="text-[#4DA8B2]">Share</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-[#4DA8B2]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="h-8 w-20 animate-pulse rounded-lg bg-gray-200" />
            ) : user ? (
              <>
                <Link
                  href="/gallery"
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  <Search className="h-5 w-5" />
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  <Bell className="h-5 w-5" />
                </Link>
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4DA8B2] text-xs font-bold text-white">
                    {user.full_name?.charAt(0) || "U"}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.full_name?.split(" ")[0] || "User"}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-[#4DA8B2] px-4 py-2 text-sm font-medium text-white hover:bg-[#3d8a93] transition-colors"
                >
                  Join the Community
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname === link.href
                    ? "bg-[#4DA8B2]/10 text-[#4DA8B2]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
            {!user && !loading && (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg bg-[#4DA8B2] px-3 py-2 text-center text-sm font-medium text-white"
                >
                  Join the Community
                </Link>
              </>
            )}
            {user && (
              <button
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
