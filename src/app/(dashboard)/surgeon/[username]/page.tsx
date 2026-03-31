"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { formatDate, formatViewCount } from "@/lib/utils";
import type { Profile, Video } from "@/types/database";
import { Video as VideoIcon, Eye, MapPin, Award, Users } from "lucide-react";

export default function SurgeonProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const [surgeon, setSurgeon] = useState<Profile | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", username)
        .single();

      if (profile) {
        setSurgeon(profile);
        const { data: vids } = await supabase
          .from("videos")
          .select("*")
          .eq("surgeon_id", profile.id)
          .eq("is_public", true)
          .order("created_at", { ascending: false });
        setVideos(vids || []);
      }
      setLoading(false);
    };
    load();
  }, [username]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="animate-pulse flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-6 w-48 rounded bg-gray-200" />
            <div className="h-4 w-32 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!surgeon) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <Users className="mx-auto h-12 w-12 text-gray-300" />
        <h2 className="mt-4 text-lg font-medium text-gray-900">
          Surgeon not found
        </h2>
      </div>
    );
  }

  const totalViews = videos.reduce((sum, v) => sum + v.view_count, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#4DA8B2]/10 text-2xl font-bold text-[#4DA8B2]">
            {surgeon.full_name?.charAt(0) || "S"}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900">
              {surgeon.full_name}
            </h1>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500 sm:justify-start">
              {surgeon.specialty && (
                <span className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  {surgeon.specialty}
                </span>
              )}
              {surgeon.institution && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {surgeon.institution}
                </span>
              )}
            </div>
            {surgeon.bio && (
              <p className="mt-3 text-sm text-gray-600">{surgeon.bio}</p>
            )}
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-xl font-bold text-gray-900">
                {videos.length}
              </div>
              <div className="text-xs text-gray-500">Videos</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {formatViewCount(totalViews)}
              </div>
              <div className="text-xs text-gray-500">Views</div>
            </div>
          </div>
        </div>
      </div>

      {/* Videos */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">
          Uploaded Videos
        </h2>
        {videos.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">
            No videos uploaded yet.
          </p>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <Link
                key={video.id}
                href={`/video/${video.id}`}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative aspect-video bg-gray-200">
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <VideoIcon className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatViewCount(video.view_count)}
                    </span>
                    <span>{formatDate(video.created_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
