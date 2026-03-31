"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { Profile, Video, AuditLog, Report } from "@/types/database";
import { formatDate } from "@/lib/utils";
import {
  Users,
  Video as VideoIcon,
  Eye,
  Shield,
  Check,
  X,
  Trash2,
  Clock,
  BarChart3,
  FileText,
  AlertTriangle,
} from "lucide-react";

type Tab = "users" | "videos" | "audit" | "reports" | "analytics";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("users");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production use proper auth
    if (password === "endospine_admin_2024") {
      setAuthed(true);
      loadData();
    }
  };

  const loadData = async () => {
    setLoading(true);
    const [profilesRes, videosRes, auditRes, reportsRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("videos").select("*, profiles(full_name)").order("created_at", { ascending: false }),
      supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("reports").select("*, profiles:reporter_id(full_name), videos(title)").order("created_at", { ascending: false }),
    ]);
    setProfiles(profilesRes.data || []);
    setVideos(videosRes.data || []);
    setAuditLogs(auditRes.data || []);
    setReports(reportsRes.data || []);
    setLoading(false);
  };

  const updateUserStatus = async (userId: string, status: "approved" | "rejected") => {
    await supabase.from("profiles").update({ status, is_verified: status === "approved" }).eq("id", userId);
    setProfiles(profiles.map((p) => (p.id === userId ? { ...p, status, is_verified: status === "approved" } : p)));
  };

  const deleteVideo = async (videoId: string) => {
    await supabase.from("videos").delete().eq("id", videoId);
    setVideos(videos.filter((v) => v.id !== videoId));
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <form onSubmit={handleAuth} className="w-full max-w-sm rounded-2xl border bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-center">
            <Shield className="h-10 w-10 text-[#4DA8B2]" />
          </div>
          <h1 className="text-center text-xl font-bold text-gray-900">Admin Panel</h1>
          <p className="mt-2 text-center text-sm text-gray-500">Enter admin password to continue</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#4DA8B2] focus:outline-none focus:ring-1 focus:ring-[#4DA8B2]"
            placeholder="Admin password"
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-[#4DA8B2] py-2.5 text-sm font-semibold text-white hover:bg-[#3d8a93]"
          >
            Sign In
          </button>
        </form>
      </div>
    );
  }

  const pendingUsers = profiles.filter((p) => p.status === "pending");
  const totalViews = videos.reduce((s, v) => s + v.view_count, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#4DA8B2]" />
            <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
          </div>
          <button
            onClick={() => setAuthed(false)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "Total Users", value: profiles.length, icon: Users, color: "text-blue-600 bg-blue-50" },
            { label: "Pending Approvals", value: pendingUsers.length, icon: Clock, color: "text-yellow-600 bg-yellow-50" },
            { label: "Total Videos", value: videos.length, icon: VideoIcon, color: "text-green-600 bg-green-50" },
            { label: "Total Views", value: totalViews, icon: Eye, color: "text-purple-600 bg-purple-50" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border bg-white p-5">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-1 rounded-lg bg-gray-100 p-1">
          {(["users", "videos", "audit", "reports", "analytics"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium capitalize transition-colors ${
                tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {tab === "users" && (
            <div className="rounded-xl border bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Specialty</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Institution</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {profiles.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{p.full_name}</td>
                      <td className="px-4 py-3 text-gray-500">{p.email}</td>
                      <td className="px-4 py-3 text-gray-500">{p.specialty}</td>
                      <td className="px-4 py-3 text-gray-500">{p.institution}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          p.status === "approved" ? "bg-green-100 text-green-700" :
                          p.status === "rejected" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.status === "pending" && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => updateUserStatus(p.id, "approved")}
                              className="rounded p-1 text-green-600 hover:bg-green-50"
                              title="Approve"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => updateUserStatus(p.id, "rejected")}
                              className="rounded p-1 text-red-600 hover:bg-red-50"
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "videos" && (
            <div className="rounded-xl border bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Title</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Surgeon</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Views</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {videos.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{v.title}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {(v.profiles as unknown as { full_name: string })?.full_name}
                      </td>
                      <td className="px-4 py-3 text-gray-500 max-w-[150px] truncate">{v.procedure_type}</td>
                      <td className="px-4 py-3 text-gray-500">{v.view_count}</td>
                      <td className="px-4 py-3 text-gray-500">{formatDate(v.created_at)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteVideo(v.id)}
                          className="rounded p-1 text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "audit" && (
            <div className="rounded-xl border bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Action</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">User ID</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Video ID</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{log.action}</td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{log.user_id?.slice(0, 8)}...</td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{log.video_id?.slice(0, 8)}...</td>
                      <td className="px-4 py-3 text-gray-500">{formatDate(log.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "reports" && (
            <div className="rounded-xl border bg-white overflow-hidden">
              {reports.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No reports yet</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Reporter</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Video</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Reason</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {reports.map((r) => (
                      <tr key={r.id}>
                        <td className="px-4 py-3">{r.reporter_id}</td>
                        <td className="px-4 py-3">{r.video_id}</td>
                        <td className="px-4 py-3">{r.reason}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            r.status === "resolved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }`}>{r.status}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{formatDate(r.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {tab === "analytics" && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border bg-white p-6">
                <h3 className="font-semibold text-gray-900">Registration Over Time</h3>
                <div className="mt-4 space-y-2">
                  {Object.entries(
                    profiles.reduce((acc, p) => {
                      const month = new Date(p.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" });
                      acc[month] = (acc[month] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).slice(0, 6).map(([month, count]) => (
                    <div key={month} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{month}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 rounded-full bg-[#4DA8B2]" style={{ width: `${count * 20}px` }} />
                        <span className="font-medium text-gray-900">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border bg-white p-6">
                <h3 className="font-semibold text-gray-900">Top Procedure Types</h3>
                <div className="mt-4 space-y-2">
                  {Object.entries(
                    videos.reduce((acc, v) => {
                      acc[v.procedure_type] = (acc[v.procedure_type] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 truncate max-w-[200px]">{type}</span>
                      <span className="font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
