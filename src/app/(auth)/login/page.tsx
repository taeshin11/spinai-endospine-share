"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { trackEvent } from "@/lib/tracking";
import { useTranslation } from "@/i18n";
import { Eye, EyeOff, LogIn, Clock } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { t } = useTranslation();

  const inactivity = searchParams.get("reason") === "inactivity";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    await trackEvent({ event: "login", email });
    router.push("/dashboard");
    router.refresh();
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(t("auth.email") + " is required");
      return;
    }
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (resetError) {
      setError(resetError.message);
    } else {
      setResetSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f0fafb] via-white to-[#f0f4f8] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4DA8B2] text-white font-bold">
              ES
            </div>
            <span className="text-xl font-bold text-gray-900">
              EndoSpine <span className="text-[#4DA8B2]">Share</span>
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            {t("auth.welcomeBack")}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {t("auth.signInAccess")}
          </p>
        </div>

        {inactivity && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-700">
            <Clock className="h-4 w-4 flex-shrink-0" />
            Session expired due to inactivity. Please sign in again.
          </div>
        )}

        <form
          onSubmit={showReset ? handleResetPassword : handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
        >
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {resetSent ? (
            <div className="py-4 text-center">
              <p className="text-sm font-medium text-green-600">
                Password reset email sent!
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Check your inbox for a reset link.
              </p>
              <button
                type="button"
                onClick={() => { setShowReset(false); setResetSent(false); }}
                className="mt-4 text-sm text-[#4DA8B2] hover:underline"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("auth.email")}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#4DA8B2] focus:outline-none focus:ring-1 focus:ring-[#4DA8B2]"
                    placeholder="you@hospital.edu"
                  />
                </div>

                {!showReset && (
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        {t("auth.password")}
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowReset(true)}
                        className="text-xs text-[#4DA8B2] hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative mt-1">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm focus:border-[#4DA8B2] focus:outline-none focus:ring-1 focus:ring-[#4DA8B2]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4DA8B2] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3d8a93] disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  showReset ? "Sending..." : t("auth.signingIn")
                ) : showReset ? (
                  "Send Reset Link"
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    {t("nav.signIn")}
                  </>
                )}
              </button>

              {showReset && (
                <button
                  type="button"
                  onClick={() => setShowReset(false)}
                  className="mt-3 w-full text-center text-sm text-gray-500 hover:text-gray-700"
                >
                  Back to sign in
                </button>
              )}

              {!showReset && (
                <p className="mt-4 text-center text-sm text-gray-500">
                  {t("auth.noAccount")}{" "}
                  <Link href="/signup" className="text-[#4DA8B2] hover:underline">
                    {t("auth.signUp")}
                  </Link>
                </p>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
}
