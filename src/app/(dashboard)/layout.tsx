"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FeedbackWidget from "@/components/feedback/FeedbackWidget";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useInactivityLogout();

  return (
    <>
      <Navbar />
      <main className="min-h-screen dark:bg-[#1A1D2E]">{children}</main>
      <Footer />
      <FeedbackWidget />
    </>
  );
}
