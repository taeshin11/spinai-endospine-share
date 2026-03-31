import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FeedbackWidget from "@/components/feedback/FeedbackWidget";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <FeedbackWidget />
    </>
  );
}
