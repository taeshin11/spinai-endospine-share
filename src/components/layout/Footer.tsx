"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4DA8B2] text-white font-bold text-sm">
                ES
              </div>
              <span className="text-lg font-bold text-gray-900">
                EndoSpine <span className="text-[#4DA8B2]">Share</span>
              </span>
            </Link>
            <p className="mt-3 max-w-md text-sm text-gray-500">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t("footer.platform")}</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/about" className="text-sm text-gray-500 hover:text-[#4DA8B2]">{t("footer.about")}</Link></li>
              <li><Link href="/gallery" className="text-sm text-gray-500 hover:text-[#4DA8B2]">{t("footer.videoGallery")}</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-500 hover:text-[#4DA8B2]">{t("footer.blog")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t("footer.legal")}</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/privacy-policy" className="text-sm text-gray-500 hover:text-[#4DA8B2]">{t("footer.privacyPolicy")}</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-gray-500 hover:text-[#4DA8B2]">{t("footer.termsOfService")}</Link></li>
              <li><a href="mailto:taeshinkim11@gmail.com?subject=Business Inquiry — EndoSpine Share" className="text-sm text-gray-500 hover:text-[#4DA8B2]">{t("footer.businessInquiries")}</a></li>
              <li><a href="mailto:taeshinkim11@gmail.com?subject=Improvement Suggestion — EndoSpine Share" className="text-sm text-gray-500 hover:text-[#4DA8B2]">{t("footer.suggestImprovement")}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:flex-row">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            {t("footer.builtBy")}{" "}
            <span className="font-semibold text-gray-600">SPINAI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
