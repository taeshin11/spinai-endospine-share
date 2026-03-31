import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "EndoSpine Share privacy policy — how we handle data, ensure HIPAA awareness, and protect patient privacy.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-gray-900">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Last updated: March 31, 2026
        </p>

        <div className="prose prose-gray mt-8 max-w-none">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-gray-900 mt-8">
            1. Overview
          </h2>
          <p className="text-gray-600 mt-2 leading-relaxed">
            EndoSpine Share (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;the Platform&rdquo;) is a secure
            video sharing platform for spine endoscopy professionals. We are
            committed to protecting the privacy of our users and ensuring
            compliance with applicable data protection regulations, including
            HIPAA awareness requirements.
          </p>

          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-gray-900 mt-8">
            2. Patient Data & De-identification
          </h2>
          <p className="text-gray-600 mt-2 leading-relaxed">
            <strong>EndoSpine Share does NOT collect, store, or process any
            Protected Health Information (PHI).</strong> All surgical videos
            uploaded to the platform must be fully de-identified before upload.
            Uploading surgeons must confirm that all patient identifying
            information has been removed and proper consent has been obtained
            before uploading any video content.
          </p>

          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-gray-900 mt-8">
            3. Information We Collect
          </h2>
          <p className="text-gray-600 mt-2 leading-relaxed">
            We collect the following types of information from registered users:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mt-2 space-y-1">
            <li>Account information: name, email address, professional credentials</li>
            <li>Profile information: institution, specialty, biography</li>
            <li>Video metadata: titles, descriptions, procedure types, tags</li>
            <li>Usage data: video views, interactions, platform activity</li>
            <li>Technical data: browser type, IP address, device information</li>
          </ul>

          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-gray-900 mt-8">
            4. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 text-gray-600 mt-2 space-y-1">
            <li>To verify your medical credentials and approve your account</li>
            <li>To display your profile and uploaded videos to other verified users</li>
            <li>To provide platform features (comments, likes, bookmarks, notifications)</li>
            <li>To maintain audit logs for compliance and security purposes</li>
            <li>To improve the platform through analytics and usage patterns</li>
          </ul>

          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-gray-900 mt-8">
            5. Data Security
          </h2>
          <p className="text-gray-600 mt-2 leading-relaxed">
            We implement industry-standard security measures including HTTPS
            encryption, secure authentication with JWT tokens, automatic session
            timeouts, Content Security Policy headers, and Row-Level Security on
            our database. All video content is served through encrypted CDN
            channels.
          </p>

          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-gray-900 mt-8">
            6. Video Content Protection
          </h2>
          <p className="text-gray-600 mt-2 leading-relaxed">
            All videos on the platform are watermarked with &ldquo;For Educational Use
            Only — EndoSpine Share&rdquo; to prevent unauthorized redistribution.
            Download controls are implemented to add friction against
            unauthorized copying. All video views are logged in our audit system.
          </p>

          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-gray-900 mt-8">
            7. Third-Party Services
          </h2>
          <p className="text-gray-600 mt-2 leading-relaxed">
            We use the following third-party services: Supabase (authentication
            and database), Vercel (hosting), and standard analytics tools. These
            services have their own privacy policies and data handling practices.
          </p>

          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-gray-900 mt-8">
            8. Your Rights
          </h2>
          <p className="text-gray-600 mt-2 leading-relaxed">
            You may request access to, correction of, or deletion of your
            personal data at any time by contacting us. You may also delete your
            account and all associated data through your account settings.
          </p>

          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-gray-900 mt-8">
            9. Contact
          </h2>
          <p className="text-gray-600 mt-2 leading-relaxed">
            For privacy-related inquiries, please contact us at{" "}
            <a
              href="mailto:taeshinkim11@gmail.com"
              className="text-[#4DA8B2] hover:underline"
            >
              taeshinkim11@gmail.com
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
