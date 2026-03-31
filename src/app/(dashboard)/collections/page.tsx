"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import type { Collection } from "@/types/database";
import { FolderOpen, Plus, X } from "lucide-react";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("collections")
      .select("*, collection_videos(video_id)")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    setCollections(data || []);
    setLoading(false);
  };

  const createCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("collections").insert({
      owner_id: user.id,
      name: newName,
      description: newDesc,
    });

    setNewName("");
    setNewDesc("");
    setShowCreate(false);
    loadCollections();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Collections</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-[#4DA8B2] px-4 py-2 text-sm font-medium text-white hover:bg-[#3d8a93]"
        >
          <Plus className="h-4 w-4" />
          New Collection
        </button>
      </div>

      {showCreate && (
        <form
          onSubmit={createCollection}
          className="mt-4 rounded-xl border border-gray-200 bg-white p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">New Collection</h3>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Collection name"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4DA8B2] focus:outline-none"
          />
          <textarea
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="mt-3 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4DA8B2] focus:outline-none"
          />
          <button
            type="submit"
            className="mt-3 rounded-lg bg-[#4DA8B2] px-4 py-2 text-sm font-medium text-white hover:bg-[#3d8a93]"
          >
            Create
          </button>
        </form>
      )}

      {loading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : collections.length === 0 ? (
        <div className="mt-16 text-center">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No collections yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Create collections to organize your favorite videos.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {collections.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-gray-200 bg-white p-6 hover:border-[#4DA8B2]/30 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">{c.name}</h3>
              {c.description && (
                <p className="mt-1 text-sm text-gray-500">{c.description}</p>
              )}
              <div className="mt-3 text-xs text-gray-400">
                {(c.collection_videos as unknown[])?.length || 0} videos
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
