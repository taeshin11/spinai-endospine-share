import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "EndoSpine Share terms of service — usage guidelines, content policies, and user responsibilities.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-gray-900">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Last updated: March 31, 2026
        </p>

        <div className="mt-8 space-y-8">
          {[
            {
              title: "1. Acceptance of Terms",
              content:
                "By accessing or using EndoSpine Share, you agree to be bound by these Terms of Service. If you do not agree, you may not use the platform.",
            },
            {
              title: "2. Eligibility",
              content:
                "EndoSpine Share is intended for licensed medical professionals. By creating an account, you represent that you are a qualified medical professional with valid credentials. All accounts are subject to verification before full platform access is granted.",
            },
            {
              title: "3. User Responsibilities",
              content:
                "You are responsible for maintaining the confidentiality of your account credentials. You must ensure all uploaded videos are fully de-identified and contain no Protected Health Information (PHI). You must confirm that proper patient consent has been obtained for all uploaded content. You must not share your account credentials or allow unauthorized access.",
            },
            {
              title: "4. Content Guidelines",
              content:
                "All uploaded videos must be surgical/educational in nature. Content must be de-identified with no patient information visible. You retain ownership of your uploaded content but grant EndoSpine Share a license to host, display, and distribute it within the platform. Content that violates these guidelines may be removed without notice.",
            },
            {
              title: "5. Prohibited Uses",
              content:
                "You may not: upload content containing PHI or patient-identifying information; use the platform for commercial advertising; attempt to download or redistribute videos without permission; harass, abuse, or harm other users; attempt to bypass security measures or access controls; use automated tools to scrape or collect data from the platform.",
            },
            {
              title: "6. Intellectual Property",
              content:
                "Videos uploaded to EndoSpine Share remain the intellectual property of the uploading surgeon. The platform name, logo, and design are the property of SPINAI. All videos are watermarked for educational use only.",
            },
            {
              title: "7. Privacy",
              content:
                "Your use of EndoSpine Share is also governed by our Privacy Policy. Please review it to understand how we handle your information.",
            },
            {
              title: "8. Disclaimers",
              content:
                "EndoSpine Share is an educational platform and does not provide medical advice. Surgical techniques shown in videos should not be replicated without proper training. The platform is provided 'as is' without warranties of any kind.",
            },
            {
              title: "9. Limitation of Liability",
              content:
                "EndoSpine Share and SPINAI shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform.",
            },
            {
              title: "10. Termination",
              content:
                "We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time through your account settings.",
            },
            {
              title: "11. Contact",
              content:
                "For questions about these terms, contact us at taeshinkim11@gmail.com.",
            },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-gray-900">
                {section.title}
              </h2>
              <p className="mt-2 text-gray-600 leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
