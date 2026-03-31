"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { trackEvent } from "@/lib/tracking";
import { PROCEDURE_TYPES, SPINE_LEVELS } from "@/types/database";
import { Upload, X, Video, CheckCircle, AlertCircle } from "lucide-react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    procedureType: "",
    spineLevel: "",
    description: "",
    tags: "",
    consent: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const validateAndSetFile = (f: File) => {
    const validTypes = ["video/mp4", "video/quicktime", "video/webm"];
    if (!validTypes.includes(f.type)) {
      setError("Please upload an MP4, MOV, or WebM file.");
      return;
    }
    if (f.size > 500 * 1024 * 1024) {
      setError("File size must be under 500MB.");
      return;
    }
    setFile(f);
    setError("");
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a video file.");
      return;
    }
    if (!formData.consent) {
      setError(
        "You must confirm patient de-identification and consent before uploading."
      );
      return;
    }

    setUploading(true);
    setProgress(10);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload video to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      setProgress(30);

      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      setProgress(70);

      const {
        data: { publicUrl },
      } = supabase.storage.from("videos").getPublicUrl(fileName);

      // Create video record
      const { error: insertError } = await supabase.from("videos").insert({
        surgeon_id: user.id,
        title: formData.title,
        procedure_type: formData.procedureType,
        spine_level: formData.spineLevel,
        description: formData.description,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        video_url: publicUrl,
        patient_consent_confirmed: formData.consent,
      });

      if (insertError) throw insertError;

      setProgress(100);

      await trackEvent({
        event: "video_upload",
        videoTitle: formData.title,
        videoCategory: formData.procedureType,
      });

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Upload Video</h1>
      <p className="mt-2 text-sm text-gray-500">
        Share a de-identified surgical video with the community
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* File Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
            dragOver
              ? "border-[#4DA8B2] bg-[#4DA8B2]/5"
              : file
              ? "border-green-300 bg-green-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
            className="hidden"
          />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <Video className="h-8 w-8 text-green-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-3 text-sm font-medium text-gray-700">
                Drag & drop your video here, or click to browse
              </p>
              <p className="mt-1 text-xs text-gray-500">
                MP4, MOV, or WebM. Max 500MB.
              </p>
            </>
          )}
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Uploading...</span>
              <span className="font-medium text-[#4DA8B2]">{progress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-[#4DA8B2] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Video Metadata */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Video Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#4DA8B2] focus:outline-none focus:ring-1 focus:ring-[#4DA8B2]"
              placeholder="e.g., L4-L5 PELD — Transforaminal Approach"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Procedure Type *
              </label>
              <select
                name="procedureType"
                value={formData.procedureType}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#4DA8B2] focus:outline-none focus:ring-1 focus:ring-[#4DA8B2]"
              >
                <option value="">Select procedure</option>
                {PROCEDURE_TYPES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Spine Level
              </label>
              <select
                name="spineLevel"
                value={formData.spineLevel}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#4DA8B2] focus:outline-none focus:ring-1 focus:ring-[#4DA8B2]"
              >
                <option value="">Select level</option>
                {SPINE_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description / Surgical Notes
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#4DA8B2] focus:outline-none focus:ring-1 focus:ring-[#4DA8B2]"
              placeholder="Describe the case, key surgical steps, and notable findings..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#4DA8B2] focus:outline-none focus:ring-1 focus:ring-[#4DA8B2]"
              placeholder="disc herniation, minimally invasive, revision (comma-separated)"
            />
          </div>
        </div>

        {/* Patient Consent */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-[#4DA8B2] focus:ring-[#4DA8B2]"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">
                Patient De-identification & Consent Confirmation *
              </span>
              <p className="mt-1 text-xs text-gray-500">
                I confirm that all patient identifying information has been
                removed from this video and that proper consent has been obtained
                for educational sharing.
              </p>
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4DA8B2] px-6 py-3 text-base font-semibold text-white hover:bg-[#3d8a93] disabled:opacity-50 transition-colors"
        >
          {uploading ? (
            "Uploading..."
          ) : (
            <>
              <CheckCircle className="h-5 w-5" />
              Upload Video
            </>
          )}
        </button>
      </form>
    </div>
  );
}
