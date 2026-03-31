import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FeedbackWidget from "@/components/feedback/FeedbackWidget";
import {
  Shield,
  Video,
  Users,
  Globe,
  Play,
  ArrowRight,
  CheckCircle,
  Lock,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#f0fafb] via-white to-[#f0f4f8] py-20 sm:py-28">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#4DA8B2]/20 bg-[#4DA8B2]/5 px-4 py-1.5 text-sm text-[#4DA8B2]">
                <Shield className="h-4 w-4" />
                HIPAA-Aware &bull; Secure &bull; Verified Surgeons Only
              </div>
              <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                The Global Platform for{" "}
                <span className="text-[#4DA8B2]">Spine Endoscopy</span>{" "}
                Education
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-gray-600">
                Share, discover, and learn from spinal endoscopy surgical videos
                with verified medical professionals worldwide. Advance your
                technique through peer-reviewed case studies.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/signup"
                  className="flex items-center gap-2 rounded-xl bg-[#4DA8B2] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#4DA8B2]/25 transition-all hover:bg-[#3d8a93] hover:shadow-xl"
                >
                  Join the Community
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/about"
                  className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Play className="h-4 w-4" />
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-y border-gray-200 bg-white py-8">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8 px-4 sm:gap-16">
            {[
              { value: "500+", label: "Videos Shared" },
              { value: "200+", label: "Verified Surgeons" },
              { value: "30+", label: "Countries" },
              { value: "50K+", label: "Video Views" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-[#4DA8B2] sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-gray-900">
                How It Works
              </h2>
              <p className="mt-3 text-gray-600">
                Get started in three simple steps
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  icon: Users,
                  title: "Sign Up & Verify",
                  description:
                    "Create your account and verify your medical credentials. Only verified spine surgeons can access the platform.",
                },
                {
                  step: "02",
                  icon: Video,
                  title: "Upload Your Cases",
                  description:
                    "Share de-identified surgical videos with detailed procedure metadata. Patient privacy is our top priority.",
                },
                {
                  step: "03",
                  icon: Globe,
                  title: "Share & Learn",
                  description:
                    "Browse techniques from surgeons worldwide, comment on cases, and build your professional network.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-[#4DA8B2]/30 hover:shadow-md"
                >
                  <div className="absolute -top-3 left-6 rounded-full bg-[#4DA8B2] px-3 py-0.5 text-xs font-bold text-white">
                    Step {item.step}
                  </div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#4DA8B2]/10 text-[#4DA8B2] group-hover:bg-[#4DA8B2] group-hover:text-white transition-colors">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Videos Preview */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-gray-900">
                Featured Surgical Videos
              </h2>
              <p className="mt-3 text-gray-600">
                Preview our growing library of endoscopic spine surgery cases
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "L4-L5 PELD — Transforaminal Approach",
                  surgeon: "Dr. James Park",
                  views: "2.3K views",
                },
                {
                  title: "Cervical Endoscopic Foraminotomy",
                  surgeon: "Dr. Sarah Chen",
                  views: "1.8K views",
                },
                {
                  title: "L5-S1 Interlaminar Discectomy",
                  surgeon: "Dr. Marco Rossi",
                  views: "3.1K views",
                },
              ].map((video, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300">
                    <div className="absolute inset-0 backdrop-blur-xl" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <Lock className="h-8 w-8 text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">
                        Sign in to watch
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900">{video.title}</h3>
                    <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                      <span>{video.surgeon}</span>
                      <span>{video.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-[#4DA8B2] font-medium hover:underline"
              >
                Sign up to access the full video library
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Security & Privacy */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-gray-900">
                Security & Patient Privacy First
              </h2>
              <p className="mt-3 text-gray-600">
                Built with medical compliance in mind from day one
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "HIPAA-aware platform design",
                "Mandatory de-identification",
                "Verified surgeons only",
                "Educational watermarks",
                "No patient data stored",
                "Encrypted video delivery",
                "Download protection",
                "Complete audit trail",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4"
                >
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-gray-900">
                Trusted by Spine Surgeons Worldwide
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                {
                  quote:
                    "EndoSpine Share has transformed how I learn new techniques. Seeing real cases from colleagues across the globe is invaluable.",
                  name: "Dr. Yong Kim",
                  role: "Spine Surgeon, Seoul National University Hospital",
                },
                {
                  quote:
                    "The platform's focus on patient privacy gives me confidence to share my cases. The verification process ensures quality discussions.",
                  name: "Dr. Elena Vasquez",
                  role: "Neurosurgeon, Hospital Universitario La Paz",
                },
                {
                  quote:
                    "As a fellowship-trained endoscopic spine surgeon, I finally have a platform where I can showcase and learn advanced techniques.",
                  name: "Dr. Rajesh Patel",
                  role: "Orthopedic Spine Surgeon, AIIMS New Delhi",
                },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-sm leading-relaxed text-gray-600 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4DA8B2]/10 text-sm font-bold text-[#4DA8B2]">
                      {testimonial.name.split(" ").pop()?.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-[#4DA8B2] to-[#3d8a93] p-12 text-center text-white shadow-xl sm:p-16">
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold sm:text-4xl">
                Ready to Advance Your Practice?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
                Join a growing community of spine endoscopy surgeons sharing
                knowledge and advancing the field together.
              </p>
              <Link
                href="/signup"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-base font-semibold text-[#4DA8B2] shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl"
              >
                Request Access
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FeedbackWidget />
    </>
  );
}
