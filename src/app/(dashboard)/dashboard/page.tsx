"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { formatDate, formatViewCount } from "@/lib/utils";
import type { Profile, Video } from "@/types/database";
import {
  Video as VideoIcon,
  Upload,
  Eye,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, videosRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase
          .from("videos")
          .select("*")
          .eq("surgeon_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      setProfile(profileRes.data);
      setVideos(videosRes.data || []);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalViews = videos.reduce((sum, v) => sum + v.view_count, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Verification Banner */}
      {profile?.status === "pending" && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3">
          <Clock className="h-5 w-5 text-yellow-600" />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Verification Pending
            </p>
            <p className="text-xs text-yellow-600">
              Your account is awaiting admin verification. You&apos;ll have full
              access once approved.
            </p>
          </div>
        </div>
      )}
      {profile?.status === "rejected" && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <div>
            <p className="text-sm font-medium text-red-800">
              Verification Rejected
            </p>
            <p className="text-xs text-red-600">
              Please contact support at taeshinkim11@gmail.com for assistance.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <Link
          href="/upload"
          className="flex items-center gap-2 rounded-lg bg-[#4DA8B2] px-4 py-2 text-sm font-medium text-white hover:bg-[#3d8a93] transition-colors"
        >
          <Upload className="h-4 w-4" />
          Upload Video
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4DA8B2]/10 text-[#4DA8B2]">
              <VideoIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {videos.length}
              </div>
              <div className="text-sm text-gray-500">Videos Uploaded</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatViewCount(totalViews)}
              </div>
              <div className="text-sm text-gray-500">Total Views</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {profile?.status === "approved" ? "Verified" : "Pending"}
              </div>
              <div className="text-sm text-gray-500">Account Status</div>
            </div>
          </div>
        </div>
      </div>

      {/* Videos List */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">My Videos</h2>
        {videos.length === 0 ? (
          <div className="mt-4 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
            <VideoIcon className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No videos yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Upload your first surgical video to share with the community.
            </p>
            <Link
              href="/upload"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#4DA8B2] px-4 py-2 text-sm font-medium text-white hover:bg-[#3d8a93]"
            >
              <Upload className="h-4 w-4" />
              Upload Video
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="h-20 w-32 flex-shrink-0 rounded-lg bg-gray-200 overflow-hidden">
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <VideoIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/video/${video.id}`}
                    className="font-medium text-gray-900 hover:text-[#4DA8B2]"
                  >
                    {video.title}
                  </Link>
                  <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                    <span>{video.procedure_type}</span>
                    <span>{formatViewCount(video.view_count)} views</span>
                    <span>{formatDate(video.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
