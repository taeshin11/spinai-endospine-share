"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { formatDate, formatViewCount } from "@/lib/utils";
import { trackEvent } from "@/lib/tracking";
import type { Video, Profile, Comment } from "@/types/database";
import {
  ThumbsUp,
  Bookmark,
  Flag,
  Eye,
  Calendar,
  MapPin,
  Send,
  ChevronDown,
  AlertCircle,
  User,
} from "lucide-react";

export default function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [video, setVideo] = useState<Video | null>(null);
  const [surgeon, setSurgeon] = useState<Profile | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadVideo();
  }, [id]);

  const loadVideo = async () => {
    const { data: videoData } = await supabase
      .from("videos")
      .select("*, profiles(id, full_name, institution, specialty, avatar_url)")
      .eq("id", id)
      .single();

    if (videoData) {
      setVideo(videoData);
      setSurgeon(videoData.profiles as unknown as Profile);

      // Increment view count
      await supabase
        .from("videos")
        .update({ view_count: (videoData.view_count || 0) + 1 })
        .eq("id", id);

      // Log audit
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("audit_log").insert({
          user_id: user.id,
          video_id: id,
          action: "video_view",
        });

        // Check likes/bookmarks
        const [likeRes, bookmarkRes] = await Promise.all([
          supabase
            .from("likes")
            .select("id")
            .eq("user_id", user.id)
            .eq("video_id", id)
            .single(),
          supabase
            .from("bookmarks")
            .select("id")
            .eq("user_id", user.id)
            .eq("video_id", id)
            .single(),
        ]);
        setLiked(!!likeRes.data);
        setBookmarked(!!bookmarkRes.data);
      }

      await trackEvent({
        event: "video_view",
        videoTitle: videoData.title,
        videoCategory: videoData.procedure_type,
      });

      // Load comments
      const { data: commentsData } = await supabase
        .from("comments")
        .select("*, profiles(full_name, institution, avatar_url)")
        .eq("video_id", id)
        .order("created_at", { ascending: true });

      setComments(commentsData || []);

      // Load related videos
      const { data: related } = await supabase
        .from("videos")
        .select("*, profiles(full_name)")
        .eq("procedure_type", videoData.procedure_type)
        .neq("id", id)
        .limit(4);

      setRelatedVideos(related || []);
    }
    setLoading(false);
  };

  const handleLike = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (liked) {
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("video_id", id);
      setLiked(false);
      if (video) setVideo({ ...video, like_count: video.like_count - 1 });
    } else {
      await supabase.from("likes").insert({ user_id: user.id, video_id: id });
      setLiked(true);
      if (video) setVideo({ ...video, like_count: video.like_count + 1 });
    }
  };

  const handleBookmark = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (bookmarked) {
      await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("video_id", id);
      setBookmarked(false);
    } else {
      await supabase
        .from("bookmarks")
        .insert({ user_id: user.id, video_id: id });
      setBookmarked(true);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("comments")
      .insert({
        video_id: id,
        author_id: user.id,
        content: newComment.trim(),
      })
      .select("*, profiles(full_name, institution, avatar_url)")
      .single();

    if (data) {
      setComments([...comments, data]);
      setNewComment("");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="animate-pulse">
          <div className="aspect-video w-full rounded-xl bg-gray-200" />
          <div className="mt-4 h-6 w-2/3 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-1/3 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-300" />
        <h2 className="mt-4 text-lg font-medium text-gray-900">
          Video not found
        </h2>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="relative overflow-hidden rounded-xl bg-black">
            <video
              controls
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              className="w-full aspect-video"
              src={video.video_url}
              poster={video.thumbnail_url || undefined}
            />
            {/* Watermark */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <p className="text-white/20 text-lg font-bold rotate-[-20deg] select-none">
                For Educational Use Only — EndoSpine Share
              </p>
            </div>
          </div>

          {/* Video Info */}
          <div className="mt-4">
            <h1 className="text-xl font-bold text-gray-900">{video.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {formatViewCount(video.view_count)} views
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(video.created_at)}
              </span>
              {video.spine_level && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {video.spine_level}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  liked
                    ? "bg-[#4DA8B2]/10 text-[#4DA8B2]"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <ThumbsUp className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                {video.like_count}
              </button>
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  bookmarked
                    ? "bg-yellow-50 text-yellow-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`}
                />
                {bookmarked ? "Saved" : "Save"}
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                <Flag className="h-4 w-4" />
                Report
              </button>
            </div>

            {/* Description */}
            {video.description && (
              <div className="mt-4 rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {video.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {video.tags && video.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {video.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#4DA8B2]/10 px-3 py-1 text-xs font-medium text-[#4DA8B2]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Surgeon Card */}
            {surgeon && (
              <Link
                href={`/surgeon/${surgeon.id}`}
                className="mt-6 flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:border-[#4DA8B2]/30 transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4DA8B2]/10 text-lg font-bold text-[#4DA8B2]">
                  {surgeon.full_name?.charAt(0) || "S"}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {surgeon.full_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {surgeon.specialty} &bull; {surgeon.institution}
                  </div>
                </div>
              </Link>
            )}

            {/* Comments */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900">
                Discussion ({comments.length})
              </h3>

              <form onSubmit={handleComment} className="mt-4 flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#4DA8B2] focus:outline-none focus:ring-1 focus:ring-[#4DA8B2]"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="flex items-center gap-2 rounded-lg bg-[#4DA8B2] px-4 py-2 text-sm font-medium text-white hover:bg-[#3d8a93] disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-4 space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-3 rounded-lg bg-white p-4"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                      {(
                        comment.profiles as unknown as { full_name: string }
                      )?.full_name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {(
                            comment.profiles as unknown as {
                              full_name: string;
                            }
                          )?.full_name || "Unknown"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-700">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900">
            Related Videos
          </h3>
          <div className="mt-4 space-y-3">
            {relatedVideos.length === 0 ? (
              <p className="text-sm text-gray-500">No related videos found.</p>
            ) : (
              relatedVideos.map((rv) => (
                <Link
                  key={rv.id}
                  href={`/video/${rv.id}`}
                  className="flex gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-[#4DA8B2]/30 transition-colors"
                >
                  <div className="h-16 w-24 flex-shrink-0 rounded bg-gray-200 flex items-center justify-center">
                    <Eye className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {rv.title}
                    </h4>
                    <p className="mt-1 text-xs text-gray-500">
                      {(rv.profiles as unknown as { full_name: string })
                        ?.full_name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatViewCount(rv.view_count)} views
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
