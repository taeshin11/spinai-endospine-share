# PRD.md — EndoSpine Share: Spinal Endoscopy Video Sharing Platform

## Project Overview

**Product Name:** EndoSpine Share
**Brand:** Built by SPINAI
**Contact Email (Feedback):** taeshinkim11@gmail.com
**Contact Email (Business Inquiries):** taeshinkim11@gmail.com
**Description:** A secure, HIPAA-aware video sharing platform where spine endoscopy surgeons can upload, organize, and share their surgical procedure videos with verified medical professionals. The platform enables peer learning, technique comparison, and professional collaboration — all while maintaining strict patient privacy and data protection.

---

## Harness Design Architecture

This project follows the **Anthropic Harness Design** methodology with four agent roles:

### Agent Roles

| Role | Responsibility |
|------|---------------|
| **Planner Agent** | Expands this PRD into a full product spec. Focuses on WHAT to build, not HOW. Defines user stories, acceptance criteria, and feature scope. |
| **Initializer Agent** | Creates handoff files (`feature_list.json`, `claude-progress.txt`, `init.sh`) in the first session. Sets up project scaffolding, repo, and deployment pipeline. |
| **Builder Agent** | Implements features one at a time per session cycle. Reads progress files at session start, picks the next feature, implements, tests, commits, and updates progress. |
| **Reviewer Agent** | Reviews code quality, security, accessibility, SEO, and UX after each feature. Acts as QA. Flags issues before merge. |

### Session Cycle (Every Session)

1. Read `claude-progress.txt` → understand current state
2. Read `feature_list.json` → identify next feature
3. Run existing tests → confirm nothing is broken
4. Implement ONE feature end-to-end
5. Run tests again → confirm new feature works
6. Git commit with descriptive message
7. Update `claude-progress.txt`
8. If milestone reached → `git push` + Vercel auto-deploy
9. Move to next feature or end session

### Handoff Files

- **`feature_list.json`** — Full feature backlog with status (`pending`, `in-progress`, `done`), priority, and dependencies
- **`claude-progress.txt`** — Human-readable log of what's been done, what's next, any blockers
- **`init.sh`** — Project setup script (install deps, env config, dev server start command)

---

## Standing Constraints

### Cost
- **ZERO cost infrastructure.** Use Vercel free tier for hosting and deployment.
- Free-tier services only: no paid APIs, no paid databases, no paid video hosting.
- Video storage: use Cloudinary free tier (25GB bandwidth/month) or similar free CDN. If limits are tight, implement upload size limits (e.g., max 500MB per video) and compression.
- Database: use Supabase free tier (PostgreSQL + Auth + Storage) or Firebase free tier.
- Authentication: Supabase Auth or Firebase Auth (free).

### SEO & Traffic Maximization
- Server-side rendering (SSR) or Static Site Generation (SSG) via Next.js for all public pages.
- Implement comprehensive `<meta>` tags: title, description, Open Graph (og:title, og:description, og:image, og:url), Twitter Card tags.
- Generate `sitemap.xml` and `robots.txt` automatically.
- Add JSON-LD structured data (MedicalOrganization, VideoObject schema).
- Create SEO-optimized landing pages: "Spinal Endoscopy Video Library", "Endoscopic Spine Surgery Techniques", "Spine Surgery Case Studies".
- Implement canonical URLs, breadcrumb navigation, and internal linking strategy.
- Page speed optimization: lazy loading, image/video optimization, code splitting.
- Create a `/blog` section with placeholder articles targeting long-tail keywords (e.g., "percutaneous endoscopic lumbar discectomy video", "transforaminal endoscopic spine surgery technique").
- Add an `/about` page, `/privacy-policy` page, `/terms-of-service` page for search engine trust signals.
- Implement Open Graph images auto-generated per video page for social sharing.

### Responsive Design
- Mobile-first responsive design using Tailwind CSS.
- Breakpoints: mobile (< 640px), tablet (640px–1024px), desktop (> 1024px).
- Touch-friendly video player controls on mobile.
- Collapsible navigation on mobile.
- All forms and modals must be fully usable on mobile.

### UI/UX Design Direction
- **Color Palette:** Soft, clinical, trustworthy tones. Primary: soft teal/blue (#4DA8B2 range). Background: warm off-white (#F8F9FA) or soft gray (#F0F2F5). Accents: muted green for success, soft coral for alerts. Dark mode option with deep navy (#1A1D2E) background.
- **Typography:** Use a clean, professional serif or sans-serif. Suggestions: "DM Sans" for body, "Fraunces" or "Playfair Display" for headings — convey medical authority with warmth.
- **Layout:** Clean card-based layout for video gallery. Generous whitespace. Subtle shadows (box-shadow with low opacity). Rounded corners (8-12px).
- **Motion:** Subtle fade-in animations on scroll. Smooth hover transitions on cards. Loading skeletons for video thumbnails.
- **Overall Feel:** Modern, comfortable, professional — like a premium medical journal meets Netflix for surgeons. NOT sterile hospital white. Warm, inviting, trustworthy.
- **Accessibility:** WCAG 2.1 AA compliance. Proper contrast ratios, focus indicators, alt text, aria labels.

### Deployment & Git Workflow
- **Create the GitHub repo using `gh` CLI.** Do NOT manually create via browser.
  ```bash
  gh repo create spinai-endospine-share --public --description "EndoSpine Share - Spinal Endoscopy Video Sharing Platform by SPINAI" --source=. --remote=origin
  ```
- Push at every major milestone (see Milestone section below).
- **Deploy to Vercel** using Vercel CLI. Do NOT just write a guide — actually deploy:
  ```bash
  npm i -g vercel
  vercel --prod
  ```
- Link the Vercel deployment URL (not the GitHub URL) in all public-facing references to avoid exposing GitHub username.
- Use Vercel environment variables for any secrets (Supabase keys, webhook URLs, etc.).

### Data Collection (Silent)
- Integrate **Google Sheets webhook via Google Apps Script** for silent data collection.
- When a surgeon registers, uploads a video, or performs key actions → automatically POST user metadata to Google Sheets.
- **Google Apps Script Webhook Code** (deploy as web app, set to "Anyone" access):

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById('YOUR_GOOGLE_SHEET_ID').getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    var timestamp = new Date().toISOString();
    sheet.appendRow([
      timestamp,
      data.event || '',
      data.email || '',
      data.name || '',
      data.specialty || '',
      data.institution || '',
      data.videoTitle || '',
      data.videoCategory || '',
      data.userAgent || '',
      data.referrer || '',
      data.page || ''
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({status: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

- On the frontend, fire POST requests on key events (registration, video upload, video view, search queries):
```javascript
const trackEvent = async (eventData) => {
  try {
    await fetch(process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: eventData.event,
        email: eventData.email || '',
        name: eventData.name || '',
        specialty: eventData.specialty || '',
        institution: eventData.institution || '',
        videoTitle: eventData.videoTitle || '',
        videoCategory: eventData.videoCategory || '',
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        page: window.location.pathname
      })
    });
  } catch (e) {
    // Silent fail — do not disrupt UX
  }
};
```

### CLI-First Automation
- If blocked by any issue, resolve via CLI. Do NOT ask the user to do manual browser actions.
- Use `gh` CLI for GitHub operations.
- Use `vercel` CLI for deployment.
- Use `npx` / `npm` for package management and scaffolding.
- Use `curl` for API testing.
- Use `supabase` CLI for database setup if using Supabase.

### Feedback & Contact Mechanisms
- **User Feedback:** A subtle, non-intrusive floating feedback button (bottom-right corner) that opens a small modal. Users can type improvement suggestions. Submissions are sent to `taeshinkim11@gmail.com` via a serverless function (or mailto fallback). Also silently logged to Google Sheets.
- **Business Inquiries:** A dedicated "Partner With Us" or "Business Inquiries" link in the footer. Opens a clean contact form or mailto link to `taeshinkim11@gmail.com`. Professional but not pushy.
- **SPINAI Branding:** Small "Built by SPINAI" badge in the footer with the SPINAI logo/text. Subtle, professional — like "Powered by Vercel" style. Link to SPINAI website if available, otherwise just text.

### App-Readiness
- Structure the codebase for future React Native / Expo conversion:
  - Separate business logic from UI components.
  - Use a `/lib` or `/services` folder for API calls, auth, and data logic.
  - Keep components modular and self-contained.
  - Use React hooks and context patterns (not Next.js-specific features) for state management where possible.
  - Store API endpoints in environment variables for easy swapping.

---

## Core Features

### 1. Authentication & Surgeon Verification
- Email/password signup + login via Supabase Auth (or Firebase Auth).
- **Surgeon verification flow:** After signup, users must provide:
  - Full name
  - Medical license number (or equivalent credential)
  - Institution/hospital affiliation
  - Specialty (dropdown: Spine Surgery, Neurosurgery, Orthopedic Surgery, Pain Medicine, etc.)
  - Profile photo (optional)
- Admin approval queue: new accounts are "pending" until verified. Show a "Verification Pending" banner on their dashboard.
- For MVP: implement a simple admin panel (password-protected route `/admin`) where you can approve/reject signups.
- **Session management:** JWT tokens with refresh. Auto-logout after 30 minutes of inactivity (medical compliance).

### 2. Video Upload & Management
- Drag-and-drop video upload with progress bar.
- Accepted formats: MP4, MOV, WebM. Max size: 500MB per video.
- **Required metadata on upload:**
  - Video title
  - Procedure type (dropdown: Percutaneous Endoscopic Lumbar Discectomy, Transforaminal Endoscopic, Interlaminar Endoscopic, Cervical Endoscopic, etc.)
  - Spine level (dropdown: L1-L2 through L5-S1, Cervical, Thoracic)
  - Brief description / surgical notes
  - Tags (free-form, comma-separated)
  - **Patient consent confirmation checkbox** (required — "I confirm all patient identifying information has been removed and proper consent has been obtained")
- Auto-generate video thumbnail from the first frame.
- Video compression/transcoding on upload (use client-side compression or Cloudinary transformations).
- Each surgeon's "My Videos" dashboard to manage uploads (edit metadata, delete, toggle visibility).

### 3. Patient Privacy & Security
- **De-identification requirement:** Mandatory checkbox confirming patient data has been de-identified before upload.
- **No patient data fields anywhere** — the platform never asks for or stores patient names, DOB, MRN, or any PHI.
- **Watermark overlay** on all videos: subtle semi-transparent text showing the uploader's name and "For Educational Use Only — EndoSpine Share".
- **Download prevention:** Disable right-click save, remove download button from video player. (Note: not foolproof, but adds friction.)
- **Access control:** Only verified/approved surgeons can view videos. Public visitors see landing page, about page, and sample blurred thumbnails only.
- **Audit log:** Log all video views (who watched what, when) in the database. Accessible from admin panel.
- **HTTPS only** — enforced via Vercel.
- **Content Security Policy headers** configured in `next.config.js`.
- Display a `/privacy-policy` page detailing how data is handled, HIPAA awareness, and de-identification requirements.

### 4. Video Gallery & Discovery
- Grid-based video gallery with card layout (thumbnail, title, procedure type, surgeon name, view count, upload date).
- **Filter sidebar:**
  - Procedure type
  - Spine level
  - Surgeon / institution
  - Date range
  - Most viewed / newest / highest rated
- **Search bar** with full-text search across titles, descriptions, tags.
- **Video detail page:**
  - Full video player (use Plyr.js or Video.js for custom-styled, accessible player)
  - Video metadata display
  - Surgeon profile card (name, institution, specialty)
  - Comments/discussion section (threaded)
  - Like/bookmark button
  - "Report" button for inappropriate content
  - Related videos sidebar

### 5. Surgeon Profiles
- Public profile page per surgeon: `/surgeon/[username]`
- Display: name, institution, specialty, bio, total videos uploaded, total views.
- List of their uploaded videos.
- "Follow" button to get notifications on new uploads (store in DB, implement later or via email).

### 6. Interaction & Community
- **Comments:** Threaded comments on each video. Only verified surgeons can comment. Markdown support for formatting.
- **Likes/Bookmarks:** Surgeons can like and bookmark videos for later reference.
- **Collections:** Surgeons can create named collections (e.g., "Best L4-L5 PELD Cases") and add videos to them.
- **Notifications:** In-app notification bell for new comments on your videos, new followers, admin messages.

### 7. Admin Panel (`/admin`)
- Protected route (hardcoded admin credentials or specific Supabase role).
- **Features:**
  - View/approve/reject pending surgeon registrations
  - View all uploaded videos, delete if needed
  - View audit log (video views)
  - View reported content
  - Basic analytics: total users, total videos, total views, registrations over time
  - View Google Sheets data summary (or link to the Sheet)

### 8. Landing Page & Public Pages
- **Hero section:** Bold headline — "The Global Platform for Spine Endoscopy Education". Subtext explaining the value. CTA: "Join the Community" / "Request Access".
- **How It Works** section (3 steps: Sign Up → Upload → Share & Learn).
- **Featured Videos** preview (blurred thumbnails for non-logged-in users with "Sign in to watch" overlay).
- **Statistics bar:** "500+ Videos Shared | 200+ Verified Surgeons | 30+ Countries" (start with placeholder numbers, make dynamic later).
- **Testimonials** section (placeholder quotes from fictional surgeons for MVP).
- **Footer:** Privacy Policy, Terms of Service, About, Contact, Business Inquiries (taeshinkim11@gmail.com), "Built by SPINAI" badge.

---

## Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | Next.js 14 (App Router) | SSR/SSG for SEO, React ecosystem, Vercel-native |
| Styling | Tailwind CSS | Rapid responsive design, utility-first |
| Auth | Supabase Auth | Free tier, built-in email auth, role-based |
| Database | Supabase PostgreSQL | Free tier, relational, Row Level Security |
| Video Storage | Supabase Storage or Cloudinary (free tier) | Free video hosting with CDN |
| Video Player | Plyr.js or Video.js | Customizable, accessible, no-download option |
| Deployment | Vercel (free tier) | Zero-config Next.js deployment |
| Data Collection | Google Sheets + Apps Script webhook | Free, no-code analytics |
| Email/Feedback | Mailto + serverless function | Free, simple |
| CLI Tools | gh, vercel, npx, supabase | Full CLI automation |

---

## Feature List (for `feature_list.json`)

```json
[
  { "id": 1, "feature": "Project scaffolding (Next.js + Tailwind + Supabase)", "status": "pending", "priority": "P0", "milestone": "M1" },
  { "id": 2, "feature": "Supabase setup (Auth, Database tables, Storage buckets)", "status": "pending", "priority": "P0", "milestone": "M1" },
  { "id": 3, "feature": "Landing page (Hero, How It Works, Stats, Footer)", "status": "pending", "priority": "P0", "milestone": "M1" },
  { "id": 4, "feature": "SEO setup (meta tags, OG tags, sitemap, robots.txt, JSON-LD)", "status": "pending", "priority": "P0", "milestone": "M1" },
  { "id": 5, "feature": "Auth flow (signup, login, logout, session management)", "status": "pending", "priority": "P0", "milestone": "M2" },
  { "id": 6, "feature": "Surgeon verification form + pending state", "status": "pending", "priority": "P0", "milestone": "M2" },
  { "id": 7, "feature": "Admin panel (approve/reject users, basic dashboard)", "status": "pending", "priority": "P0", "milestone": "M2" },
  { "id": 8, "feature": "Video upload with metadata form + patient consent checkbox", "status": "pending", "priority": "P0", "milestone": "M3" },
  { "id": 9, "feature": "Video storage integration (Supabase Storage or Cloudinary)", "status": "pending", "priority": "P0", "milestone": "M3" },
  { "id": 10, "feature": "Video gallery page with filters and search", "status": "pending", "priority": "P0", "milestone": "M3" },
  { "id": 11, "feature": "Video detail page with custom player (no download)", "status": "pending", "priority": "P0", "milestone": "M3" },
  { "id": 12, "feature": "Surgeon profile pages", "status": "pending", "priority": "P1", "milestone": "M4" },
  { "id": 13, "feature": "Comments system (threaded)", "status": "pending", "priority": "P1", "milestone": "M4" },
  { "id": 14, "feature": "Likes and bookmarks", "status": "pending", "priority": "P1", "milestone": "M4" },
  { "id": 15, "feature": "Video collections", "status": "pending", "priority": "P2", "milestone": "M5" },
  { "id": 16, "feature": "Notification system (in-app)", "status": "pending", "priority": "P2", "milestone": "M5" },
  { "id": 17, "feature": "Google Sheets webhook integration (silent tracking)", "status": "pending", "priority": "P1", "milestone": "M2" },
  { "id": 18, "feature": "Feedback widget (floating button + modal → email)", "status": "pending", "priority": "P1", "milestone": "M4" },
  { "id": 19, "feature": "Business inquiry contact form in footer", "status": "pending", "priority": "P1", "milestone": "M4" },
  { "id": 20, "feature": "SPINAI branding badge in footer", "status": "pending", "priority": "P1", "milestone": "M1" },
  { "id": 21, "feature": "Privacy policy + Terms of Service pages", "status": "pending", "priority": "P1", "milestone": "M1" },
  { "id": 22, "feature": "Dark mode toggle", "status": "pending", "priority": "P2", "milestone": "M5" },
  { "id": 23, "feature": "Blog/SEO content pages", "status": "pending", "priority": "P2", "milestone": "M5" },
  { "id": 24, "feature": "Audit log (video view tracking)", "status": "pending", "priority": "P1", "milestone": "M3" },
  { "id": 25, "feature": "Watermark overlay on videos", "status": "pending", "priority": "P1", "milestone": "M3" },
  { "id": 26, "feature": "Content Security Policy + security headers", "status": "pending", "priority": "P1", "milestone": "M2" },
  { "id": 27, "feature": "Responsive design polish + cross-browser testing", "status": "pending", "priority": "P0", "milestone": "M4" },
  { "id": 28, "feature": "Live site QA — check all functions, find improvements", "status": "pending", "priority": "P0", "milestone": "M5" },
  { "id": 29, "feature": "Performance optimization (Lighthouse 90+)", "status": "pending", "priority": "P1", "milestone": "M5" },
  { "id": 30, "feature": "Report inappropriate content flow", "status": "pending", "priority": "P2", "milestone": "M5" }
]
```

---

## Milestones & Git Push Schedule

| Milestone | Features | Git Push Trigger |
|-----------|----------|-----------------|
| **M1 — Foundation** | Project scaffold, landing page, SEO setup, legal pages, SPINAI branding | `git push` after landing page renders correctly on Vercel |
| **M2 — Auth & Security** | Auth flow, surgeon verification, admin panel, Google Sheets webhook, security headers | `git push` after a user can sign up and appear in admin panel |
| **M3 — Core Video** | Video upload, storage, gallery, detail page, watermark, audit log | `git push` after a video can be uploaded and played back |
| **M4 — Community** | Profiles, comments, likes/bookmarks, feedback widget, business inquiry, responsive polish | `git push` after comments work end-to-end |
| **M5 — Polish & Launch** | Collections, notifications, dark mode, blog, QA, performance, report flow | `git push` after full QA pass on live site |

**At each milestone push:**
```bash
git add -A
git commit -m "Milestone [X]: [description]"
git push origin main
```

Vercel auto-deploys on push to `main`.

---

## Initialization Script (`init.sh`)

```bash
#!/bin/bash

# EndoSpine Share - Initialization Script
echo "🔧 Setting up EndoSpine Share..."

# 1. Create Next.js project
npx create-next-app@latest endospine-share --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm

cd endospine-share

# 2. Install dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install plyr plyr-react
npm install lucide-react
npm install clsx tailwind-merge
npm install next-seo
npm install -D @types/node

# 3. Create project structure
mkdir -p src/app/(auth)/login
mkdir -p src/app/(auth)/signup
mkdir -p src/app/(auth)/verify
mkdir -p src/app/(dashboard)/dashboard
mkdir -p src/app/(dashboard)/upload
mkdir -p src/app/(dashboard)/gallery
mkdir -p src/app/(dashboard)/video/[id]
mkdir -p src/app/(dashboard)/surgeon/[username]
mkdir -p src/app/(dashboard)/collections
mkdir -p src/app/admin
mkdir -p src/app/blog
mkdir -p src/app/about
mkdir -p src/app/privacy-policy
mkdir -p src/app/terms-of-service
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/components/video
mkdir -p src/components/auth
mkdir -p src/components/admin
mkdir -p src/components/feedback
mkdir -p src/lib
mkdir -p src/services
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/utils
mkdir -p public/images

# 4. Create environment template
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=your_apps_script_webhook_url
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
ADMIN_PASSWORD=your_admin_password
EOF

# 5. Initialize Git and create GitHub repo
git init
git add -A
git commit -m "Initial commit: EndoSpine Share project scaffold"
gh repo create spinai-endospine-share --public --description "EndoSpine Share - Spinal Endoscopy Video Sharing Platform by SPINAI" --source=. --remote=origin
git push -u origin main

# 6. Deploy to Vercel
npm i -g vercel
vercel --prod --yes

echo "✅ EndoSpine Share initialized and deployed!"
echo "📝 Next steps:"
echo "   1. Set up Supabase project and update .env.local"
echo "   2. Deploy Google Apps Script webhook and update .env.local"
echo "   3. Run: npm run dev"
```

---

## Database Schema (Supabase PostgreSQL)

```sql
-- Users / Surgeons
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  license_number TEXT,
  institution TEXT,
  specialty TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Videos
CREATE TABLE videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  surgeon_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  procedure_type TEXT NOT NULL,
  spine_level TEXT,
  tags TEXT[],
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  patient_consent_confirmed BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Likes
CREATE TABLE likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- Bookmarks
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- Collections
CREATE TABLE collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE collection_videos (
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (collection_id, video_id)
);

-- Audit Log
CREATE TABLE audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  video_id UUID REFERENCES videos(id),
  action TEXT NOT NULL,
  metadata JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (Builder Agent should expand these)
CREATE POLICY "Public profiles are viewable by verified users" ON profiles
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Verified users can view public videos" ON videos
  FOR SELECT USING (
    is_public = TRUE
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND status = 'approved')
  );

CREATE POLICY "Surgeons can insert own videos" ON videos
  FOR INSERT WITH CHECK (auth.uid() = surgeon_id);

CREATE POLICY "Surgeons can update own videos" ON videos
  FOR UPDATE USING (auth.uid() = surgeon_id);
```

---

## Security Checklist

- [x] HTTPS enforced (Vercel default)
- [ ] Supabase Row Level Security on ALL tables
- [ ] No patient identifiable information stored ANYWHERE
- [ ] Mandatory de-identification consent checkbox
- [ ] Video watermarks ("Educational Use Only")
- [ ] Right-click / download disabled on video player
- [ ] 30-minute inactivity auto-logout
- [ ] Content Security Policy headers
- [ ] Admin panel password-protected
- [ ] Audit log for all video views
- [ ] Rate limiting on auth endpoints
- [ ] Input sanitization on all forms
- [ ] XSS protection headers

---

## Final QA Checklist (Milestone M5)

After deployment, the Reviewer Agent must verify:

1. **Landing page** loads fast (< 3s), all sections render, CTA works
2. **Signup/Login** flow works end-to-end
3. **Surgeon verification** form submits, shows pending state
4. **Admin panel** can approve/reject users
5. **Video upload** works with all required fields, consent checkbox enforced
6. **Video playback** works on desktop + mobile, no download button
7. **Gallery** filters and search return correct results
8. **Comments** can be posted and threaded
9. **Likes/Bookmarks** toggle correctly
10. **Feedback widget** sends email successfully
11. **Business inquiry** form works
12. **SPINAI badge** visible in footer
13. **SEO** — run Lighthouse audit, verify meta tags, test OG tags with social debuggers
14. **Responsive** — test on iPhone SE, iPad, desktop at 1920px
15. **Google Sheets** webhook receives data on key events
16. **Privacy policy** and **Terms** pages accessible
17. **Dark mode** toggles correctly (if implemented)
18. **Watermark** appears on all video playback
19. **Security headers** present (check via securityheaders.com)
20. **All links** work, no 404s

---

*This PRD is the single source of truth. The Builder Agent reads this document and the handoff files to autonomously implement EndoSpine Share feature by feature.*
