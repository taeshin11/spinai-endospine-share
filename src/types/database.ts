export interface Profile {
  id: string
  email: string
  full_name: string
  license_number: string | null
  institution: string | null
  specialty: string | null
  bio: string | null
  avatar_url: string | null
  is_verified: boolean
  is_admin: boolean
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface Video {
  id: string
  surgeon_id: string
  title: string
  description: string | null
  procedure_type: string
  spine_level: string | null
  tags: string[] | null
  video_url: string
  thumbnail_url: string | null
  duration_seconds: number | null
  view_count: number
  like_count: number
  patient_consent_confirmed: boolean
  is_public: boolean
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Comment {
  id: string
  video_id: string
  author_id: string
  parent_id: string | null
  content: string
  created_at: string
  updated_at: string
  profiles?: Profile
  replies?: Comment[]
}

export interface Like {
  id: string
  user_id: string
  video_id: string
  created_at: string
}

export interface Bookmark {
  id: string
  user_id: string
  video_id: string
  created_at: string
}

export interface Collection {
  id: string
  owner_id: string
  name: string
  description: string | null
  is_public: boolean
  created_at: string
  collection_videos?: CollectionVideo[]
}

export interface CollectionVideo {
  collection_id: string
  video_id: string
  added_at: string
  videos?: Video
}

export interface AuditLog {
  id: string
  user_id: string | null
  video_id: string | null
  action: string
  metadata: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string | null
  is_read: boolean
  link: string | null
  created_at: string
}

export interface Report {
  id: string
  reporter_id: string
  video_id: string
  reason: string
  status: 'pending' | 'reviewed' | 'resolved'
  created_at: string
}

export const PROCEDURE_TYPES = [
  'Percutaneous Endoscopic Lumbar Discectomy (PELD)',
  'Transforaminal Endoscopic Spine Surgery (TESS)',
  'Interlaminar Endoscopic Spine Surgery (IESS)',
  'Cervical Endoscopic Spine Surgery',
  'Endoscopic Foraminotomy',
  'Endoscopic Laminotomy',
  'Endoscopic Spinal Fusion',
  'Biportal Endoscopic Spine Surgery',
  'Other',
] as const

export const SPINE_LEVELS = [
  'C1-C2', 'C2-C3', 'C3-C4', 'C4-C5', 'C5-C6', 'C6-C7', 'C7-T1',
  'T1-T2', 'T2-T3', 'T3-T4', 'T4-T5', 'T5-T6', 'T6-T7', 'T7-T8',
  'T8-T9', 'T9-T10', 'T10-T11', 'T11-T12', 'T12-L1',
  'L1-L2', 'L2-L3', 'L3-L4', 'L4-L5', 'L5-S1',
  'Multiple Levels',
] as const

export const SPECIALTIES = [
  'Spine Surgery',
  'Neurosurgery',
  'Orthopedic Surgery',
  'Pain Medicine',
  'Interventional Radiology',
  'Physical Medicine & Rehabilitation',
  'Other',
] as const
