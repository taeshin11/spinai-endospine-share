import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Shield, Users, Globe, Award, Heart, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about EndoSpine Share — the global platform for spine endoscopy education built by SPINAI.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-gray-900">
          About EndoSpine Share
        </h1>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          EndoSpine Share is a secure, HIPAA-aware video sharing platform
          designed exclusively for spine endoscopy surgeons. Our mission is to
          democratize access to surgical education and foster global
          collaboration among medical professionals.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {[
            {
              icon: Shield,
              title: "Patient Privacy First",
              description:
                "Every video uploaded must be fully de-identified. We never store patient data, and all content is watermarked for educational use only.",
            },
            {
              icon: Users,
              title: "Verified Community",
              description:
                "Only verified medical professionals with confirmed credentials can access the platform, ensuring high-quality discussions and content.",
            },
            {
              icon: Globe,
              title: "Global Reach",
              description:
                "Surgeons from over 30 countries share their techniques, enabling cross-cultural learning and advancing the field worldwide.",
            },
            {
              icon: Award,
              title: "Excellence in Education",
              description:
                "Our curated library covers the full spectrum of endoscopic spine procedures, from basic techniques to advanced cases.",
            },
            {
              icon: Heart,
              title: "Built by Surgeons, for Surgeons",
              description:
                "EndoSpine Share was created by spine professionals who understand the unique needs of surgical video education.",
            },
            {
              icon: BookOpen,
              title: "Continuous Learning",
              description:
                "With threaded discussions, collections, and notifications, the platform supports ongoing professional development.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-200 bg-white p-6"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#4DA8B2]/10 text-[#4DA8B2]">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-gradient-to-r from-[#4DA8B2]/5 to-[#4DA8B2]/10 p-8">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-gray-900">
            Built by SPINAI
          </h2>
          <p className="mt-3 text-gray-600 leading-relaxed">
            SPINAI is dedicated to advancing spinal surgery through technology
            and innovation. EndoSpine Share is our flagship platform for surgical
            education, combining cutting-edge web technology with medical
            expertise to create a safe, effective learning environment.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            For business inquiries, please contact us at{" "}
            <a
              href="mailto:taeshinkim11@gmail.com"
              className="text-[#4DA8B2] hover:underline"
            >
              taeshinkim11@gmail.com
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
