import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Calendar, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — Spine Endoscopy Education",
  description:
    "Latest articles on endoscopic spine surgery techniques, case studies, and surgical education from EndoSpine Share.",
};

const posts = [
  {
    slug: "percutaneous-endoscopic-lumbar-discectomy-guide",
    title: "A Comprehensive Guide to Percutaneous Endoscopic Lumbar Discectomy (PELD)",
    excerpt:
      "Percutaneous endoscopic lumbar discectomy has revolutionized the treatment of lumbar disc herniation. Learn about the latest techniques, indications, and outcomes in this comprehensive guide.",
    date: "March 28, 2026",
    category: "Techniques",
    readTime: "8 min read",
  },
  {
    slug: "transforaminal-endoscopic-spine-surgery-technique",
    title: "Transforaminal Endoscopic Spine Surgery: Step-by-Step Technique",
    excerpt:
      "Master the transforaminal approach to endoscopic spine surgery with our detailed step-by-step guide, including tips from experienced surgeons worldwide.",
    date: "March 20, 2026",
    category: "Techniques",
    readTime: "12 min read",
  },
  {
    slug: "endoscopic-spine-surgery-learning-curve",
    title: "Overcoming the Learning Curve in Endoscopic Spine Surgery",
    excerpt:
      "Transitioning to endoscopic techniques can be challenging. Discover strategies, training resources, and peer support to accelerate your learning curve.",
    date: "March 15, 2026",
    category: "Education",
    readTime: "6 min read",
  },
  {
    slug: "biportal-endoscopic-spine-surgery-advantages",
    title: "Biportal Endoscopic Spine Surgery: Advantages and Case Studies",
    excerpt:
      "Explore the growing body of evidence supporting biportal endoscopic spine surgery, including comparative outcomes and technical considerations.",
    date: "March 10, 2026",
    category: "Case Studies",
    readTime: "10 min read",
  },
  {
    slug: "patient-safety-video-sharing-platforms",
    title: "Patient Safety and Privacy in Surgical Video Sharing",
    excerpt:
      "How modern platforms like EndoSpine Share ensure patient privacy while enabling powerful surgical education through shared video content.",
    date: "March 5, 2026",
    category: "Best Practices",
    readTime: "5 min read",
  },
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-gray-900">
          Spine Endoscopy Blog
        </h1>
        <p className="mt-3 text-gray-600">
          Latest insights on endoscopic spine surgery techniques and education
        </p>

        <div className="mt-12 space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-[#4DA8B2]/30 hover:shadow-md"
            >
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="rounded-full bg-[#4DA8B2]/10 px-3 py-0.5 font-medium text-[#4DA8B2]">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {post.date}
                </span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="mt-3 text-xl font-semibold text-gray-900 group-hover:text-[#4DA8B2]">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center gap-1 text-sm font-medium text-[#4DA8B2]">
                  Read more
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
