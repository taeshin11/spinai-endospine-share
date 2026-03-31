"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { formatDate, formatViewCount } from "@/lib/utils";
import { PROCEDURE_TYPES, SPINE_LEVELS } from "@/types/database";
import type { Video } from "@/types/database";
import {
  Search,
  Filter,
  Video as VideoIcon,
  Eye,
  ChevronDown,
  X,
} from "lucide-react";

export default function GalleryPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    procedureType: "",
    spineLevel: "",
    sortBy: "newest",
  });
  const supabase = createClient();

  useEffect(() => {
    loadVideos();
  }, [filters]);

  const loadVideos = async () => {
    setLoading(true);
    let query = supabase
      .from("videos")
      .select("*, profiles(full_name, institution, specialty)")
      .eq("is_public", true);

    if (filters.procedureType) {
      query = query.eq("procedure_type", filters.procedureType);
    }
    if (filters.spineLevel) {
      query = query.eq("spine_level", filters.spineLevel);
    }

    if (filters.sortBy === "newest") {
      query = query.order("created_at", { ascending: false });
    } else if (filters.sortBy === "most_viewed") {
      query = query.order("view_count", { ascending: false });
    } else if (filters.sortBy === "most_liked") {
      query = query.order("like_count", { ascending: false });
    }

    const { data } = await query;
    setVideos(data || []);
    setLoading(false);
  };

  const filteredVideos = videos.filter(
    (v) =>
      !searchQuery ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Video Gallery</h1>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-[#4DA8B2] focus:outline-none focus:ring-1 focus:ring-[#4DA8B2]"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              showFilters
                ? "border-[#4DA8B2] bg-[#4DA8B2]/5 text-[#4DA8B2]"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mt-4 flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <select
            value={filters.procedureType}
            onChange={(e) =>
              setFilters({ ...filters, procedureType: e.target.value })
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4DA8B2] focus:outline-none"
          >
            <option value="">All Procedures</option>
            {PROCEDURE_TYPES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            value={filters.spineLevel}
            onChange={(e) =>
              setFilters({ ...filters, spineLevel: e.target.value })
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4DA8B2] focus:outline-none"
          >
            <option value="">All Spine Levels</option>
            {SPINE_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters({ ...filters, sortBy: e.target.value })
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4DA8B2] focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="most_viewed">Most Viewed</option>
            <option value="most_liked">Most Liked</option>
          </select>

          {(filters.procedureType || filters.spineLevel) && (
            <button
              onClick={() =>
                setFilters({ procedureType: "", spineLevel: "", sortBy: filters.sortBy })
              }
              className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200"
            >
              <X className="h-3 w-3" />
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Video Grid */}
      {loading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-gray-200 bg-white overflow-hidden"
            >
              <div className="aspect-video bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="mt-16 text-center">
          <VideoIcon className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No videos found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchQuery
              ? "Try adjusting your search or filters."
              : "Be the first to upload a surgical video!"}
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVideos.map((video) => (
            <Link
              key={video.id}
              href={`/video/${video.id}`}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:border-[#4DA8B2]/30 hover:shadow-md"
            >
              <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300">
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <VideoIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                  {video.procedure_type?.split("(")[0]?.trim()}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 group-hover:text-[#4DA8B2] line-clamp-2">
                  {video.title}
                </h3>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {(video.profiles as unknown as { full_name: string })
                      ?.full_name || "Unknown Surgeon"}
                  </span>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {formatViewCount(video.view_count)}
                  </div>
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  {formatDate(video.created_at)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
