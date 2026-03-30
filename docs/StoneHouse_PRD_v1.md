# Stone House Nevada City — PRD v1 (Marketing Analytics Dashboard)

**Canonical source:** [`StoneHouse_PRD_v1.docx`](./StoneHouse_PRD_v1.docx) — edit that file; this markdown is the searchable export.

After you change the Word file, refresh the markdown body by running from the repo root: `textutil -convert txt -stdout docs/StoneHouse_PRD_v1.docx | perl -pe 's/\f/\n\n---\n\n/g'` and replace everything below the next line.

---

STONE HOUSE NEVADA CITY
Marketing Analytics Dashboard

Product Requirements Document  |  v1.0
March 2026  |  Confidential — Internal Use Only


Document Purpose
This PRD is the single source of truth for building the Stone House Nevada City Marketing
Analytics Dashboard. It is written to be complete and unambiguous — a developer should be
able to build the entire application from this document alone, without clarifying questions.

Stack: Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase · NextAuth.js · Vercel


---


1. Executive Summary

Stone House Nevada City is a historic Gold Country wedding venue operating as a solo business. Marketing efforts are currently spread across eight platforms — Google, Instagram, Pinterest, TikTok, Facebook, Google Ads, Meta Ads, and three wedding directories — each with its own analytics portal, login, and data format. The owner spends significant time each week logging into multiple platforms to piece together a picture of overall marketing performance, often making budget and strategy decisions without a unified view of what is actually working.

This application is a private, single-user internal dashboard that automatically aggregates data from all marketing platforms into one Stone House-branded interface, refreshed nightly. It tracks the complete lead funnel from first website visit through to signed contract and revenue booked, enabling data-driven decisions about where to spend time and marketing budget. The application is a personal tool — not a SaaS product — and will be built and maintained by the venue owner.

Success Looks Like
• Owner spends < 5 minutes per week reviewing marketing performance (vs. 45+ min currently)
• Every marketing dollar's ROI is visible in one place
• Low-performing channels are identified and cut; high-ROI channels get more budget
• Lead pipeline is always visible — no inquiry slips through without follow-up
• Token refresh and data sync happen automatically with zero manual intervention


---


2. Problem Statement

2.1 — Current State
The venue owner currently tracks marketing performance by logging into each platform individually: Google Analytics for website traffic, Google Business Profile for local search metrics, Meta Business Suite for Instagram and Facebook, Pinterest Analytics, TikTok Studio, Google Ads Manager, and The Knot/WeddingWire portals. Each platform uses different date ranges, different metric definitions, and different UI conventions.

The lead pipeline — inquiries, tour bookings, and contracts — lives in HoneyBook CRM but is completely disconnected from the marketing data. There is no way to see, for example, that $780 in Google Ads spend generated 24 leads, 9 of which toured, and 3 of which signed contracts worth $17,400, yielding a 22x ROAS in actual revenue terms.

2.2 — Specific Pain Points
	•	45+ minutes per week aggregating data across platforms manually
	•	No cross-platform attribution — impossible to know which channel drives the best-quality leads
	•	Directory spend ($440/month) cannot be compared to ad spend ROI
	•	Lead response time is not tracked — the single highest-conversion-rate factor
	•	Pipeline revenue by season is unknown, making booking strategy guesswork
	•	Meta and Pinterest tokens expire silently, causing invisible data gaps
	•	No mobile access to key metrics while owner is on-site during events

2.3 — Why Build vs. Buy
Factor
Build Decision
Cost
Off-the-shelf tools (Databox, DashThis, AgencyAnalytics) cost $100–$350/month. A custom build is a one-time investment that pays for itself in 4–8 months.
Fit
No existing tool covers the exact combination of wedding CRM data + directory metrics + social + Google in one UI with Stone House branding.
Control
API changes, pricing changes, and feature removals by third-party tools are outside the owner's control. A custom build is owned permanently.
Skill match
Owner is an intermediate developer comfortable with Next.js. Build time estimated at 2–3 days with AI-assisted coding.
Scale
The application will never need multi-tenancy, complex permissions, or enterprise features. Simple is better.


---


3. Goals & Success Metrics

Goal
Metric
Target
Unified data view
All 8 platforms visible on one screen
100% platform coverage at launch
Automation
Time spent on manual data collection
< 5 min/week (from 45+ min)
Data freshness
Age of data on dashboard
< 24 hours always
Reliability
Data sync success rate
> 95% nightly syncs succeed
Token uptime
Platforms showing stale data
0 — auto-refresh prevents expiry
Lead visibility
Pipeline leads visible in dashboard
100% of HoneyBook leads synced
Performance
Dashboard page load time
< 2 seconds (reads from Supabase, not APIs)
Attribution
Cross-channel ROAS visible
Revenue per lead source tracked
Uptime
Dashboard availability
> 99.5% (Vercel SLA)
Setup time
Time from clone to live dashboard
< 4 hours with this PRD


---


4. User Persona

The Owner — Solo Operator & Builder
Name: Stone House Nevada City Owner
Role: Venue owner, operator, marketer, and developer of this application

Technical level: Intermediate. Comfortable with Next.js, React, TypeScript, and Tailwind.
Uses AI-assisted coding ('vibe-coding') to accelerate development. Can debug API responses
and read documentation but is not a professional engineer.

Usage pattern: Checks dashboard 2–3 times per week on desktop. Occasionally checks on iPad
while on-site. Primary use case is a weekly 5-minute review of key numbers, not deep analysis.

Pain tolerance: Low for complexity, high for setup investment. Will spend 4 hours setting up
correctly once in exchange for zero ongoing maintenance burden.

Decision-making style: Data-driven but intuitive. Wants to see the numbers that matter,
quickly identify what is working and what is not, and act on that immediately.


---


5. Technical Architecture

5.1 — Stack Overview
Layer
Technology & Rationale
Framework
Next.js 14 with App Router. Server Components for data fetching from Supabase. API Routes for cron jobs, webhooks, and CSV upload. Single repository for everything.
Language
TypeScript throughout. Strict mode enabled. All API responses and database types fully typed.
Styling
Tailwind CSS with custom Stone House color tokens defined in tailwind.config.ts. No UI component library — custom components only for full design control.
Database
Supabase (Postgres). Serves two purposes: persistent metric storage (queried by dashboard) and token storage. Free tier is sufficient. Row Level Security disabled (single user, server-side only access via service role key).
Auth
NextAuth.js v5 with Credentials provider. Single hardcoded user (owner). Email + bcrypt-hashed password in environment variables. No database user table needed.
Deployment
Vercel. Free Hobby tier is sufficient. Automatic deploys from GitHub main branch. Environment variables set in Vercel dashboard.
Cron Jobs
Vercel Cron (defined in vercel.json). Two jobs: nightly data sync at 2am PT, weekly token refresh at 1am PT Sunday. Protected by CRON_SECRET header.
Email alerts
Resend (free tier, 100 emails/day). Used only for token refresh failure alerts. npm install resend.

5.2 — Data Flow Architecture
The dashboard NEVER calls external APIs at page load time. All data flows through Supabase. This ensures fast page loads, resilience to API downtime, and zero rate limit issues on the dashboard itself.

Nightly Data Flow (2am PT)
Vercel Cron triggers → /api/cron/refresh
  ↓
For each platform (GA4, GBP, Search Console, Google Ads, Instagram,
Facebook, Pinterest, TikTok):
  1. Fetch data from platform API using stored credentials
  2. Transform to { platform, metric_key, metric_value, recorded_date }
  3. Upsert into metrics_daily table (ON CONFLICT DO UPDATE)
  4. Log result to sync_log table
  ↓
Dashboard reads from metrics_daily → renders charts and KPIs
User sees data that is always < 24 hours old

Token Refresh Flow (1am PT Sunday)
Vercel Cron triggers → /api/cron/tokens
  ↓
For Meta: GET graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token
For Pinterest: GET api.pinterest.com/v5/oauth/token (if expires_at < 14 days away)
  ↓
UPDATE tokens SET access_token, expires_at, updated_at
  ↓
On failure: send email via Resend → owner@stonehouse.com
On success: update tokens.last_refreshed_at

5.3 — File Structure
stonehouse-dashboard/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx          ← Topbar + tab nav, auth check
│   │   ├── page.tsx            ← Redirects to /dashboard/overview
│   │   ├── overview/page.tsx
│   │   ├── seo/page.tsx
│   │   ├── social/page.tsx
│   │   ├── ads/page.tsx
│   │   ├── directories/page.tsx
│   │   ├── pipeline/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── cron/
│   │   │   ├── refresh/route.ts   ← Nightly data sync
│   │   │   └── tokens/route.ts    ← Weekly token refresh
│   │   ├── webhooks/
│   │   │   └── crm/route.ts       ← HoneyBook via Zapier
│   │   └── upload/
│   │       └── csv/route.ts       ← Directory CSV import
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/
│   │   ├── KpiCard.tsx
│   │   ├── ChartCard.tsx
│   │   ├── DataTable.tsx
│   │   ├── FunnelChart.tsx
│   │   ├── StaleIndicator.tsx
│   │   ├── DateRangePicker.tsx
│   │   └── CsvUploadModal.tsx
│   ├── charts/
│   │   ├── LineChart.tsx
│   │   ├── BarChart.tsx
│   │   ├── DonutChart.tsx
│   │   └── HorizontalBarChart.tsx
│   ├── layout/
│   │   ├── Topbar.tsx
│   │   └── TabNav.tsx
│   └── sections/
│       ├── overview/
│       ├── seo/
│       ├── social/
│       ├── ads/
│       ├── directories/
│       ├── pipeline/
│       └── settings/
├── lib/
│   ├── supabase/
│   │   ├── client.ts           ← Browser client
│   │   └── server.ts           ← Server-side client (service role)
│   ├── integrations/
│   │   ├── google/
│   │   │   ├── ga4.ts
│   │   │   ├── gbp.ts
│   │   │   ├── searchConsole.ts
│   │   │   └── ads.ts
│   │   ├── meta/
│   │   │   ├── instagram.ts
│   │   │   └── facebook.ts
│   │   ├── pinterest.ts
│   │   └── tiktok.ts
│   ├── queries/                ← All Supabase read queries
│   │   ├── overview.ts
│   │   ├── seo.ts
│   │   ├── social.ts
│   │   ├── ads.ts
│   │   ├── directories.ts
│   │   └── pipeline.ts
│   ├── tokens.ts               ← Token read/write/refresh helpers
│   ├── dateRange.ts            ← Date range calculations
│   └── types.ts                ← All shared TypeScript types
├── hooks/
│   └── useDateRange.ts
├── tailwind.config.ts
├── vercel.json
└── .env.local


---


6. Database Schema

Run the following SQL in Supabase SQL Editor to create all tables. Execute in order — no foreign keys between tables to keep it simple and resilient to partial failures.

6.1 — Complete SQL
-- ================================================
-- TOKENS TABLE
-- Stores OAuth tokens for all platforms
-- ================================================
CREATE TABLE tokens (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform     TEXT NOT NULL UNIQUE,  -- 'meta', 'pinterest', 'tiktok', 'google'
  access_token TEXT NOT NULL,
  refresh_token TEXT,                 -- NULL for long-lived tokens
  expires_at   TIMESTAMPTZ,           -- NULL = never expires (Google)
  last_refreshed_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- METRICS_DAILY TABLE
-- Core storage for all platform metrics
-- One row per platform + metric_key + date
-- ================================================
CREATE TABLE metrics_daily (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform     TEXT NOT NULL,
  metric_key   TEXT NOT NULL,
  metric_value NUMERIC,
  metric_text  TEXT,    -- for non-numeric values (e.g. top keyword)
  recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(platform, metric_key, recorded_date)
);

CREATE INDEX idx_metrics_platform_date
  ON metrics_daily(platform, recorded_date DESC);
CREATE INDEX idx_metrics_key
  ON metrics_daily(metric_key, recorded_date DESC);

-- ================================================
-- KEYWORD_RANKINGS TABLE
-- SEO keyword tracking from Google Search Console
-- ================================================
CREATE TABLE keyword_rankings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword      TEXT NOT NULL,
  position     NUMERIC,           -- avg position (lower = better)
  impressions  INTEGER,
  clicks       INTEGER,
  ctr          NUMERIC,           -- as decimal e.g. 0.039 = 3.9%
  recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(keyword, recorded_date)
);

-- ================================================
-- PIPELINE TABLE
-- Lead pipeline synced from HoneyBook via Zapier
-- ================================================
CREATE TABLE pipeline (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  honeybook_id    TEXT UNIQUE,   -- HoneyBook's internal ID
  lead_name       TEXT NOT NULL,
  email           TEXT,
  source          TEXT,          -- 'Google Organic', 'Google Ads', etc.
  status          TEXT NOT NULL DEFAULT 'new',
  -- status values: new | tour_scheduled | proposal_sent |
  --               contract_signed | lost
  inquiry_date    DATE,
  tour_date       DATE,
  proposal_date   DATE,
  contract_date   DATE,
  event_date      DATE,
  booking_value   NUMERIC,       -- total contract value
  event_type      TEXT,          -- 'wedding', 'corporate', 'other'
  season          TEXT,          -- 'peak', 'shoulder', 'off_peak'
  notes           TEXT,
  response_time_minutes INTEGER, -- time from inquiry to first response
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pipeline_status ON pipeline(status);
CREATE INDEX idx_pipeline_event_date ON pipeline(event_date);

-- ================================================
-- DIRECTORY_METRICS TABLE
-- Populated via monthly CSV upload
-- ================================================
CREATE TABLE directory_metrics (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform       TEXT NOT NULL,
  -- platform values: 'the_knot', 'weddingwire', 'zola', 'here_comes_guide'
  profile_views  INTEGER,
  inquiries      INTEGER,
  review_count   INTEGER,
  review_rating  NUMERIC,        -- e.g. 4.9
  award_status   TEXT,           -- e.g. 'Best of Weddings 2025'
  monthly_cost   NUMERIC,        -- USD
  recorded_month DATE NOT NULL,  -- first day of month: 2026-03-01
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(platform, recorded_month)
);

-- ================================================
-- SYNC_LOG TABLE
-- Audit log for every cron job run
-- ================================================
CREATE TABLE sync_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform    TEXT NOT NULL,
  status      TEXT NOT NULL,   -- 'success' | 'error' | 'stale'
  message     TEXT,
  records_written INTEGER,
  duration_ms INTEGER,
  synced_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sync_log_platform ON sync_log(platform, synced_at DESC);

-- ================================================
-- CSV_UPLOAD_HISTORY TABLE
-- Track directory CSV imports
-- ================================================
CREATE TABLE csv_upload_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename    TEXT NOT NULL,
  platform    TEXT NOT NULL,
  rows_parsed INTEGER,
  rows_written INTEGER,
  errors      TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

6.2 — Metric Key Reference
The metrics_daily table uses string keys. The following is the complete canonical list of all metric_key values used in the application. These must be used consistently across all integration files and query files.

Platform
metric_key
Description
ga4
sessions
Total sessions
ga4
users
Total users
ga4
pageviews
Total pageviews
ga4
bounce_rate
Bounce rate (decimal)
ga4
inquiry_form_completions
Goal conversion count
ga4
venue_guide_downloads
Lead magnet downloads
ga4
organic_sessions
Sessions from organic search
ga4
paid_sessions
Sessions from paid ads
ga4
social_sessions
Sessions from social media
ga4
direct_sessions
Sessions from direct traffic
gbp
profile_views
GBP profile views
gbp
search_views
Views from Google Search
gbp
map_views
Views from Google Maps
gbp
calls
Phone calls from GBP
gbp
direction_requests
Direction requests
gbp
website_clicks
Clicks to website from GBP
gbp
photo_views
Photo views on GBP
gbp
review_count
Total review count
gbp
review_rating
Average star rating
gsc
total_impressions
Search impressions
gsc
total_clicks
Search clicks
gsc
avg_ctr
Average CTR (decimal)
gsc
avg_position
Average search position
google_ads
spend
Total spend (USD)
google_ads
impressions
Ad impressions
google_ads
clicks
Ad clicks
google_ads
ctr
Click-through rate
google_ads
avg_cpc
Average cost per click
google_ads
conversions
Conversion count
google_ads
cost_per_conversion
Cost per lead
instagram
followers
Follower count
instagram
reach
Accounts reached
instagram
impressions
Total impressions
instagram
profile_views
Profile views
instagram
link_clicks
Link clicks from bio
instagram
reel_views
Reel video views
instagram
engagement_rate
Engagement rate (decimal)
facebook
page_followers
Page follower count
facebook
organic_reach
Organic reach
facebook
post_engagement
Total post engagements
facebook
messages_received
Inbox messages received
facebook
page_rating
Average page rating
pinterest
monthly_impressions
Monthly impressions
pinterest
total_audience
Total monthly audience
pinterest
outbound_clicks
Outbound link clicks
pinterest
saves
Pin saves
tiktok
followers
Follower count
tiktok
video_views
Total video views
tiktok
profile_visits
Profile visits
tiktok
likes
Total likes
tiktok
shares
Total shares
meta_ads
spend
Total Meta ad spend
meta_ads
reach
Ad reach
meta_ads
impressions
Ad impressions
meta_ads
clicks
Link clicks
meta_ads
ctr
Click-through rate
meta_ads
leads
Lead form completions
meta_ads
cost_per_lead
Cost per lead
meta_ads
cpm
Cost per 1000 impressions


---


7. API Integration Specifications

7.1 — Google (GA4, GBP, Search Console, Google Ads)
Authentication
All four Google services use a single OAuth 2.0 client. The owner completes a one-time OAuth flow to generate a refresh token, which is stored in GOOGLE_REFRESH_TOKEN. The application exchanges this for short-lived access tokens automatically on each API call.

// lib/integrations/google/auth.ts
import { google } from 'googleapis'

export const getGoogleAuth = () => {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  auth.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  })
  return auth
}

GA4 — Key Endpoints
Operation
Endpoint & Parameters
Run report
POST https://analyticsdata.googleapis.com/v1beta/properties/{GA4_PROPERTY_ID}:runReport
Body: { dateRanges: [{startDate, endDate}], metrics: [{name:'sessions'},{name:'users'},...], dimensions: [{name:'sessionDefaultChannelGroup'}] }
Realtime data
POST /properties/{id}:runRealtimeReport (not used — historical only)
Required scopes
https://www.googleapis.com/auth/analytics.readonly
Rate limits
50,000 tokens per project per day. Nightly batch is well within limits.
npm package
npm install googleapis

Google Business Profile — Key Endpoints
Base URL: https://mybusinessbusinessinformation.googleapis.com/v1
Base URL (insights): https://mybusiness.googleapis.com/v4

// Get location metrics
GET /accounts/{accountId}/locations/{locationId}/reportInsights
Body: {
  locationNames: ['accounts/.../locations/...'],
  basicRequest: {
    metricRequests: [
      { metric: 'QUERIES_DIRECT' },
      { metric: 'QUERIES_INDIRECT' },
      { metric: 'ACTIONS_PHONE' },
      { metric: 'ACTIONS_DRIVING_DIRECTIONS' },
      { metric: 'ACTIONS_WEBSITE' },
      { metric: 'VIEWS_MAPS' },
      { metric: 'VIEWS_SEARCH' }
    ],
    timeRange: { startTime: '...', endTime: '...' }
  }
}

Required scope: https://www.googleapis.com/auth/business.manage

Google Search Console — Key Endpoints
Base URL: https://searchconsole.googleapis.com/webmasters/v3

// Get search analytics
POST /sites/{siteUrl}/searchAnalytics/query
Body: {
  startDate: 'YYYY-MM-DD',
  endDate: 'YYYY-MM-DD',
  dimensions: ['query'],
  rowLimit: 50,
  dataState: 'final'
}

Required scope: https://www.googleapis.com/auth/webmasters.readonly

Note: siteUrl must be URL-encoded. Use 'sc-domain:stonehouse-wedding-cart.vercel.app'
or the exact URL as registered in Search Console.

Google Ads — Key Endpoints
npm install google-ads-api

// lib/integrations/google/ads.ts
import { GoogleAdsApi } from 'google-ads-api'

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_CLIENT_ID!,
  client_secret: process.env.GOOGLE_CLIENT_SECRET!,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!
})

const customer = client.Customer({
  customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID!,
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN!
})

// GAQL Query for campaign performance
const query = `
  SELECT
    campaign.name,
    metrics.impressions,
    metrics.clicks,
    metrics.ctr,
    metrics.average_cpc,
    metrics.conversions,
    metrics.cost_micros,
    metrics.cost_per_conversion
  FROM campaign
  WHERE segments.date DURING LAST_30_DAYS
    AND campaign.status = 'ENABLED'
`

7.2 — Meta (Instagram + Facebook)
Authentication — Development Mode, No App Review Required
Because this dashboard only accesses the owner's own business account data, full App Review is not required. The app runs in Development Mode, which provides full access to the connected account's data.

// ONE-TIME SETUP (do in browser, not code)
// 1. Create app at developers.facebook.com
// 2. Add Instagram Basic Display product
// 3. Add Facebook Login product
// 4. In Graph API Explorer:
//    - Select your app
//    - Add permissions: instagram_basic, instagram_manage_insights,
//      pages_read_engagement, pages_show_list
//    - Click 'Generate Access Token'
//    - Copy the short-lived token

// EXCHANGE FOR LONG-LIVED TOKEN (one API call)
const res = await fetch(
  `https://graph.facebook.com/oauth/access_token` +
  `?grant_type=fb_exchange_token` +
  `&client_id=${META_APP_ID}` +
  `&client_secret=${META_APP_SECRET}` +
  `&fb_exchange_token=${shortLivedToken}`
)
// Returns token valid for 60 days
// Store in: tokens table WHERE platform = 'meta'
// AND in NEXT_PUBLIC_META_LONG_LIVED_TOKEN env var as backup

Instagram — Endpoints
const BASE = 'https://graph.facebook.com/v19.0'
const token = process.env.META_LONG_LIVED_TOKEN
const IG_ID = process.env.IG_ACCOUNT_ID

// Account summary
GET /{IG_ID}?fields=followers_count,media_count,profile_picture_url&access_token={token}

// Account-level insights (last 30 days)
GET /{IG_ID}/insights
  ?metric=reach,impressions,profile_views,follower_count,website_clicks
  &period=days_28
  &access_token={token}

// Media (post) insights — get last 20 posts
GET /{IG_ID}/media
  ?fields=id,timestamp,media_type,like_count,comments_count
  &access_token={token}

// Per-post insights (loop through media IDs)
GET /{mediaId}/insights
  ?metric=reach,impressions,engagement
  &access_token={token}

// Reels insights
GET /{mediaId}/insights
  ?metric=plays,reach,likes,comments,shares,saved
  &access_token={token}

Token Auto-Refresh
// lib/tokens.ts
export async function refreshMetaToken() {
  const { data: tokenRow } = await supabase
    .from('tokens')
    .select('access_token, expires_at')
    .eq('platform', 'meta')
    .single()

  if (!tokenRow) throw new Error('No Meta token found')

  const res = await fetch(
    `https://graph.facebook.com/oauth/access_token` +
    `?grant_type=fb_exchange_token` +
    `&client_id=${process.env.META_APP_ID}` +
    `&client_secret=${process.env.META_APP_SECRET}` +
    `&fb_exchange_token=${tokenRow.access_token}`
  )
  const { access_token, expires_in } = await res.json()

  const expires_at = new Date()
  expires_at.setSeconds(expires_at.getSeconds() + expires_in)

  await supabase.from('tokens').update({
    access_token,
    expires_at: expires_at.toISOString(),
    last_refreshed_at: new Date().toISOString()
  }).eq('platform', 'meta')
}

7.3 — Pinterest
// Auth: Pinterest API v5, OAuth 2.0
// One-time setup: developers.pinterest.com
// Scopes needed: user_accounts:read, pins:read, boards:read

const BASE = 'https://api.pinterest.com/v5'
const token = await getTokenFromSupabase('pinterest')

// Account analytics
GET /user_account/analytics
  ?start_date=YYYY-MM-DD
  &end_date=YYYY-MM-DD
  &metric_types=IMPRESSION,ENGAGEMENT,OUTBOUND_CLICK,PIN_CLICK,SAVE
  Authorization: Bearer {token}

// Top performing pins
GET /user_account/analytics/top_pins
  ?start_date=YYYY-MM-DD
  &end_date=YYYY-MM-DD
  &sort_by=IMPRESSION
  &num_of_pins=5

// Pinterest token expires every 365 days (refreshable)
// Refresh when expires_at < 14 days away

7.4 — TikTok
TikTok Note
TikTok requires Business API approval even for reading your own account data.
This is different from Meta's Development Mode. Apply at business.tiktok.com/portal.
Approval typically takes 3–7 business days.
Build TikTok integration AFTER other platforms are working.
In the interim, show TikTok card in UI with 'Manual entry' fallback.

// Once approved:
Base URL: https://business-api.tiktok.com/open_api/v1.3

// Account info
GET /bc/user/info/
  ?business_id={BUSINESS_ID}
  Access-Token: {TIKTOK_ACCESS_TOKEN}

// Profile analytics
GET /business/get/
  ?business_id={BUSINESS_ID}
  &fields=['profile_views','follower_count','likes_count','video_views']
  &start_date=YYYY-MM-DD
  &end_date=YYYY-MM-DD

Rate limits: 1000 requests/day (sufficient for nightly batch)

7.5 — HoneyBook (Zapier Webhook)
HoneyBook does not have a public API for reading pipeline data. Integration uses Zapier: trigger on HoneyBook project status change → POST to Stone House webhook endpoint.

// app/api/webhooks/crm/route.ts
export async function POST(request: Request) {
  // Verify webhook signature
  const signature = request.headers.get('x-webhook-secret')
  if (signature !== process.env.WEBHOOK_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  // Expected Zapier payload shape:
  // {
  //   honeybook_id: string,
  //   lead_name: string,
  //   email: string,
  //   status: 'new'|'tour_scheduled'|'proposal_sent'|
  //           'contract_signed'|'lost',
  //   inquiry_date: 'YYYY-MM-DD',
  //   tour_date: 'YYYY-MM-DD' | null,
  //   booking_value: number | null,
  //   event_date: 'YYYY-MM-DD' | null,
  //   source: string
  // }

  await supabase.from('pipeline').upsert({
    honeybook_id: body.honeybook_id,
    lead_name: body.lead_name,
    email: body.email,
    status: body.status,
    inquiry_date: body.inquiry_date,
    tour_date: body.tour_date,
    booking_value: body.booking_value,
    event_date: body.event_date,
    source: body.source,
    updated_at: new Date().toISOString()
  }, { onConflict: 'honeybook_id' })

  return Response.json({ success: true })
}

// Zapier setup:
// Trigger: HoneyBook 'Project Stage Changed'
// Action: Webhooks by Zapier → POST
// URL: https://your-vercel-url.vercel.app/api/webhooks/crm
// Header: x-webhook-secret: {WEBHOOK_SECRET value}

7.6 — Directory CSV Import
// app/api/upload/csv/route.ts
// Expected CSV columns (exactly in this order):
// platform, profile_views, inquiries, review_count,
// review_rating, award_status, monthly_cost

// platform values must be one of:
// 'the_knot', 'weddingwire', 'zola', 'here_comes_guide'

// recorded_month: extracted from form field (not CSV)
// Format: YYYY-MM (e.g. '2026-03')

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  const month = formData.get('month') as string // 'YYYY-MM'

  const text = await file.text()
  const rows = parseCSV(text) // custom parser

  for (const row of rows) {
    await supabase.from('directory_metrics').upsert({
      platform: row.platform,
      profile_views: parseInt(row.profile_views),
      inquiries: parseInt(row.inquiries),
      review_count: parseInt(row.review_count),
      review_rating: parseFloat(row.review_rating),
      award_status: row.award_status,
      monthly_cost: parseFloat(row.monthly_cost),
      recorded_month: `${month}-01`
    }, { onConflict: 'platform,recorded_month' })
  }
}


---


8. Feature Specifications

8.1 — Global Layout & Navigation
Topbar
	•	Left: Stone House diamond icon (SVG, #C8A96E on #3E2723 bg, 32×32px) + 'Stone House Nevada City' (Georgia, 14px, #3E2723) + 'Marketing Dashboard' (Arial, 11px, #9E9085)
	•	Right: Live indicator pill (green dot + 'Live', #2E7D32 bg), date range selector dropdown
	•	Topbar height: 56px, border-bottom: 0.5px solid #E8D5B0

Date Range Selector
	•	Options: Last 7 days | Last 30 days | Last 90 days | This year | Custom range
	•	Default: Last 30 days
	•	Stored in React Context (DateRangeContext) — all tabs consume from context
	•	Custom range: two date inputs, apply button
	•	On change: all Supabase queries re-run with new date range params

Tab Navigation
	•	Tabs: Overview | SEO & Google | Social Media | Paid Ads | Directories | Pipeline | Settings
	•	Active tab: border-bottom 2px solid #8B6914, text #8B6914
	•	Inactive tab: text #9E9085, hover text #3E2723
	•	Tab bar: height 44px, border-bottom 0.5px solid #E8D5B0
	•	Routing: each tab = separate Next.js route (not JS-only tabs)
	•	Stale indicator: if any platform has not synced in > 26 hours, show amber warning in topbar

8.2 — Tab 1: Overview
KPI Cards — Row of 6
Card
Data Source
Calculation
Total Inquiries
pipeline table
COUNT(*) WHERE inquiry_date IN range AND status != 'lost'
Tours Booked
pipeline table
COUNT(*) WHERE tour_date IN range
Conversion Rate
pipeline table
tours_booked / total_inquiries * 100
Contracts Signed
pipeline table
COUNT(*) WHERE contract_date IN range
Google Rating
metrics_daily (gbp)
Latest review_rating + review_count
Avg Response Time
pipeline table
AVG(response_time_minutes) formatted as hrs/min

Lead Funnel
	•	Stages in order: Website Visits (ga4.sessions) → Venue Guide Downloads (ga4.venue_guide_downloads) → Inquiries (pipeline count) → Tours Booked (pipeline count) → Contracts Signed (pipeline count)
	•	Each stage: label left (90px fixed width), horizontal bar (flex-1), count + % conversion right
	•	Bar colors: darkest (#3E2723) to lightest (#C8A96E) as stages progress
	•	Conversion % = this stage count / previous stage count

Charts — 2 Column
	•	LEFT: Grouped bar chart — Monthly inquiries (gold #8B6914) vs tours (tan #C8A96E), last 6 months. X-axis: month names. Y-axis: count. Library: Chart.js via react-chartjs-2.
	•	RIGHT: Donut chart — Lead source breakdown. Sources: Google Organic, Google Ads, Meta Ads, Instagram Organic, Pinterest, Directories, Referrals, Direct. Data from: pipeline.source column. Colors: use Stone House palette cycling. Legend on right side.

8.3 — Tab 2: SEO & Google
KPI Cards — Row of 6
Card
metric_key
Notes
Organic Sessions
ga4.organic_sessions
Sum for date range
GBP Profile Views
gbp.profile_views
Sum for date range
GBP Calls
gbp.calls
Sum for date range
Direction Requests
gbp.direction_requests
Sum for date range
Keywords Top 3
keyword_rankings table
COUNT where position <= 3 on latest date
Total Backlinks
manual input or Ahrefs API v3
Latest value, updated weekly

Charts — 2 Column
	•	LEFT: Line chart — Organic sessions over time (last 6 months data points). Smooth curve, gold fill beneath line. Show 30-day moving average if > 3 months of data.
	•	RIGHT: Dual-axis bar chart — GBP profile views (left Y axis, dark bars) + GBP calls (right Y axis, tan line). Last 6 months. Two Y-axes with different scales.

Keyword Rankings Table
	•	Columns: Keyword | Position | △ vs 30 days ago | Monthly Searches | Clicks | CTR
	•	Default sort: position ascending (best rankings first)
	•	Click any column header to sort ascending/descending
	•	Position badge: green background if ≤ 3, gold if 4–10, gray if 11+
	•	Delta: green with ↑ for improvement (lower number), red with ↓ for decline
	•	Data source: keyword_rankings table, compared to recorded_date 30 days prior
	•	Row limit: 25. Show 'Load more' button if > 25 rows.

8.4 — Tab 3: Social Media
Platform Cards — 2×2 Grid
Each platform gets a card with a colored dot indicator, platform name, and 6 key metrics displayed as label/value pairs. All values from metrics_daily for selected date range.

Platform
Color
6 Key Metrics (label: metric_key)
Instagram
#E1306C
Followers: instagram.followers | Growth: delta vs 30d ago | Engagement: instagram.engagement_rate | Reel Views: instagram.reel_views | Profile Visits: instagram.profile_views | Link Clicks: instagram.link_clicks
Pinterest
#E60023
Monthly Impressions: pinterest.monthly_impressions | Audience: pinterest.total_audience | Outbound Clicks: pinterest.outbound_clicks | Saves: pinterest.saves | Top Board: manual/text field | Traffic Trend: % change vs prior period
TikTok
#000000
Followers: tiktok.followers | Avg Views: tiktok.video_views / post count | Best Video: max single video view (text) | Profile Visits: tiktok.profile_visits | Posts This Month: count | Growth: follower delta
Facebook
#1877F2
Followers: facebook.page_followers | Organic Reach: facebook.organic_reach | Engagement Rate: facebook.post_engagement | Messages: facebook.messages_received | Events RSVPs: manual | Rating: facebook.page_rating

Charts — 2 Column
	•	LEFT: Multi-line chart — Follower count over last 6 months for Instagram (pink #E1306C), TikTok (black #222), Facebook (blue #1877F2). Legend below chart. Y-axis uses left scale for Instagram/Facebook, note TikTok scale difference if large.
	•	RIGHT: Horizontal bar chart — Engagement rate per platform. Bars sorted by rate descending. Values displayed at end of each bar. Color per platform.

8.5 — Tab 4: Paid Ads
Two Side-by-Side Cards
Google Ads card (left) and Meta Ads card (right). Each card contains a 2×2 KPI mini-grid plus a metrics detail table.

Field
Google Ads Source
Meta Ads Source
Spend
google_ads.spend
meta_ads.spend
Leads
google_ads.conversions
meta_ads.leads
Cost per Lead
google_ads.cost_per_conversion
meta_ads.cost_per_lead
ROAS
calculated: revenue from contracts attributed / spend
calculated same
Impressions
google_ads.impressions
meta_ads.impressions
Clicks
google_ads.clicks
meta_ads.clicks
CTR
google_ads.ctr (format as %)
meta_ads.ctr (format as %)
CPC / CPM
google_ads.avg_cpc
meta_ads.cpm
Top keyword
gsc top clicked keyword
Pipeline source 'Meta Ads' most common city
Top audience
manual text field
manual text field

Full-Width CPL Comparison Chart
	•	Horizontal bar chart: Google Ads | Meta Ads | The Knot | WeddingWire
	•	Value = (monthly cost) / (inquiries generated)
	•	X-axis: $ cost per lead. Lower = better.
	•	Color: Google Ads (#3E2723), Meta Ads (#1877F2), The Knot (#C8A96E), WeddingWire (#888)
	•	Show dollar value at end of each bar

8.6 — Tab 5: Directories
KPI Cards — Row of 4
	•	Total Directory Inquiries: SUM(inquiries) from directory_metrics for current month
	•	Avg CPL: AVG(monthly_cost / inquiries) across all platforms with inquiries > 0
	•	Best Performing Directory: platform with lowest cost_per_lead this month
	•	Total Monthly Spend: SUM(monthly_cost) from directory_metrics current month

Directory Cards — 2×2 Grid
	•	The Knot | WeddingWire | Zola | Here Comes the Guide
	•	Each card: platform name header, then metric rows: Profile Views | Inquiries | Reviews | Award Status | Monthly Cost | Cost per Lead
	•	Cost per Lead = monthly_cost / inquiries (show '—' if inquiries = 0)
	•	Award status: gold badge if award exists, gray if none

CSV Upload
	•	'Upload Monthly Data' button opens modal
	•	Modal contains: month picker (YYYY-MM), file upload input (.csv only), preview table showing first 3 rows after file selected, Upload button
	•	On upload: POST to /api/upload/csv with file + month form data
	•	Success: show 'X rows imported successfully' toast, close modal, refresh data
	•	Error: show specific row/column that failed parsing

8.7 — Tab 6: Pipeline
KPI Cards — Row of 6
	•	Dates Booked This Year: COUNT pipeline WHERE contract_date in current year AND status = 'contract_signed'
	•	Revenue Booked: SUM(booking_value) WHERE contract_date in current year
	•	Avg Booking Value: revenue_booked / dates_booked
	•	Peak Dates Remaining: logic — calculate peak dates in current year minus booked peak dates
	•	Leads in Active Nurture: COUNT pipeline WHERE status IN ('new', 'tour_scheduled', 'proposal_sent')
	•	Projected Close Rate: historical close rate (contracts_signed / inquiries) over last 12 months

Bookings by Season
	•	Season definitions: Off-Peak = Jan/Feb, Shoulder = Mar/Apr/Nov, Peak = May–Oct/Dec
	•	For each season: horizontal bar showing bookings count, revenue (formatted $XK), dates remaining
	•	Bar color: Off-Peak (#C8A96E), Shoulder (#A07830), Peak (#8B6914)
	•	Data: group pipeline rows by event_date month, then by season tier

Revenue & Timeline Charts
	•	LEFT: Line chart — Monthly revenue trend (contract_date month, SUM booking_value). Current year all 12 months. Fill beneath line in gold tint.
	•	RIGHT: Horizontal bar — Avg days per pipeline stage. Inquiry→Response (response_time_minutes/1440), Response→Tour (tour_date - inquiry_date), Tour→Proposal (proposal_date - tour_date), Proposal→Contract (contract_date - proposal_date). Calculate AVG from all historical pipeline rows.

Pipeline Table
	•	Columns: Lead Name | Source | Status (badge) | Days in Pipeline | Inquiry Date | Tour Date | Est. Value
	•	Status badges: New (gray), Tour Scheduled (blue), Proposal Sent (gold), Contract Signed (green), Lost (red)
	•	Filter bar above table: All | New | Tour Scheduled | Proposal Sent | Contract Signed | Lost
	•	Sort: default by inquiry_date descending (newest first)
	•	Row limit: 50. Paginate if more.
	•	Click row: expand to show full lead details (email, notes, event date, all stage dates)

8.8 — Tab 7: Settings
Section 1: Integration Status
Shows a card per platform. Each card: platform name, colored status dot, last sync time, and 'Reconnect' button if status is error. Data from sync_log table (most recent row per platform).

Status
Indicator
Condition
Connected
Green dot
Latest sync_log.status = 'success' AND synced_at < 26 hours ago
Stale
Amber dot
Latest synced_at > 26 hours ago but < 72 hours
Error
Red dot + Reconnect button
Latest sync_log.status = 'error' OR synced_at > 72 hours ago
Not configured
Gray dot
No rows in sync_log for this platform

Section 2: Token Status
	•	Table showing: Platform | Token expires | Days remaining | Last refreshed | Status
	•	Meta token: show exact expiry date. Red if < 7 days, amber if < 14 days, green otherwise
	•	Pinterest token: show exact expiry date. Same color logic.
	•	'Force Refresh' button: manually triggers token refresh for that platform

Section 3: Manual Sync
	•	'Sync All Now' button: triggers POST to /api/cron/refresh with CRON_SECRET header
	•	Shows progress: each platform animates from pending → success/error in real time (polling)
	•	Last full sync time shown

Section 4: CSV Upload History
	•	Table of all past uploads from csv_upload_history: Date | File | Platform | Rows | Status
	•	Most recent first. Limit 20 rows.


---


9. Component Architecture

9.1 — Complete Component List
Component
Path
Purpose
DateRangeContext
lib/context/DateRange.tsx
Global date range state, consumed by all tab pages
Topbar
components/layout/Topbar.tsx
Logo, live badge, date range selector
TabNav
components/layout/TabNav.tsx
Tab links with active state styling
KpiCard
components/ui/KpiCard.tsx
Props: label, value, delta, deltaDir ('up'|'down'|'neutral')
KpiMiniCard
components/ui/KpiMiniCard.tsx
Smaller version for 2×2 grids inside Ads cards
ChartCard
components/ui/ChartCard.tsx
Card wrapper with title, optional legend slot, chart slot
StaleIndicator
components/ui/StaleIndicator.tsx
Amber badge 'Last updated Xh ago' shown on stale data
FunnelChart
components/charts/FunnelChart.tsx
Custom horizontal funnel, not Chart.js
LineChart
components/charts/LineChart.tsx
Wrapper for Chart.js line chart with Stone House defaults
BarChart
components/charts/BarChart.tsx
Wrapper for Chart.js bar chart (vertical)
HorizontalBarChart
components/charts/HorizontalBarChart.tsx
Wrapper for Chart.js horizontal bar
DonutChart
components/charts/DonutChart.tsx
Wrapper for Chart.js doughnut
DualAxisChart
components/charts/DualAxisChart.tsx
Chart.js with two Y axes
MultiLineChart
components/charts/MultiLineChart.tsx
Chart.js with multiple datasets
DataTable
components/ui/DataTable.tsx
Sortable, filterable table. Props: columns, data, filterOptions
StatusBadge
components/ui/StatusBadge.tsx
Colored pill badge for pipeline status
PlatformCard
components/ui/PlatformCard.tsx
Social media platform stats card
MetricRow
components/ui/MetricRow.tsx
Label/value pair row used inside platform cards
CsvUploadModal
components/ui/CsvUploadModal.tsx
Modal for directory CSV import
IntegrationStatusCard
components/settings/IntegrationStatusCard.tsx
Per-platform connection status card
TokenStatusTable
components/settings/TokenStatusTable.tsx
Meta + Pinterest token expiry table
SyncNowButton
components/settings/SyncNowButton.tsx
Triggers manual sync with progress feedback

9.2 — Shared Types (lib/types.ts)
export type Platform =
  | 'ga4' | 'gbp' | 'gsc' | 'google_ads'
  | 'instagram' | 'facebook' | 'meta_ads'
  | 'pinterest' | 'tiktok'

export type PipelineStatus =
  | 'new' | 'tour_scheduled' | 'proposal_sent'
  | 'contract_signed' | 'lost'

export type DateRange = {
  startDate: string  // YYYY-MM-DD
  endDate: string    // YYYY-MM-DD
  label: string      // 'Last 30 days' etc.
}

export type MetricRow = {
  platform: Platform
  metric_key: string
  metric_value: number | null
  metric_text: string | null
  recorded_date: string
}

export type PipelineLead = {
  id: string
  honeybook_id: string | null
  lead_name: string
  email: string | null
  source: string | null
  status: PipelineStatus
  inquiry_date: string | null
  tour_date: string | null
  proposal_date: string | null
  contract_date: string | null
  event_date: string | null
  booking_value: number | null
  response_time_minutes: number | null
}

export type SyncStatus = 'success' | 'error' | 'stale' | 'not_configured'

export type IntegrationStatus = {
  platform: Platform
  status: SyncStatus
  last_synced: string | null
  error_message: string | null
}


---


10. Authentication

// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const { handlers, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string
          password: string
        }
        if (email !== process.env.OWNER_EMAIL) return null

        const valid = await bcrypt.compare(
          password,
          process.env.OWNER_PASSWORD_HASH!
        )
        if (!valid) return null

        return { id: '1', email, name: 'Stone House Owner' }
      }
    })
  ],
  pages: { signIn: '/login' },
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 7 } // 7 days
})

// Generate password hash (run once in terminal):
// node -e "const b=require('bcryptjs');
//   console.log(b.hashSync('your_password', 12))"

// Protect routes in app/(dashboard)/layout.tsx:
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }) {
  const session = await auth()
  if (!session) redirect('/login')
  return <>{children}</>
}


---


11. Cron Job Implementation

11.1 — vercel.json
{
  "crons": [
    {
      "path": "/api/cron/refresh",
      "schedule": "0 10 * * *"
      // 10:00 UTC = 2:00 AM PT (standard) / 3:00 AM PT (daylight)
    },
    {
      "path": "/api/cron/tokens",
      "schedule": "0 9 * * 0"
      // 9:00 UTC Sunday = 1:00 AM PT Sunday
    }
  ]
}

11.2 — Nightly Sync Handler
// app/api/cron/refresh/route.ts
export async function GET(request: Request) {
  // Verify this is called by Vercel Cron or manual trigger
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: Record<string, 'success' | 'error'> = {}
  const startTime = Date.now()

  // Run each platform sync in sequence (not parallel)
  // Sequential = easier to debug, avoids rate limit spikes
  const platforms = [
    { name: 'ga4', fn: syncGA4 },
    { name: 'gbp', fn: syncGBP },
    { name: 'gsc', fn: syncSearchConsole },
    { name: 'google_ads', fn: syncGoogleAds },
    { name: 'instagram', fn: syncInstagram },
    { name: 'facebook', fn: syncFacebook },
    { name: 'meta_ads', fn: syncMetaAds },
    { name: 'pinterest', fn: syncPinterest },
    { name: 'tiktok', fn: syncTikTok },
  ]

  for (const { name, fn } of platforms) {
    const t = Date.now()
    try {
      const count = await fn()
      results[name] = 'success'
      await logSync(name, 'success', count, Date.now() - t)
    } catch (error) {
      results[name] = 'error'
      const msg = error instanceof Error ? error.message : 'Unknown'
      await logSync(name, 'error', 0, Date.now() - t, msg)
      // Don't throw — continue to next platform
    }
  }

  return Response.json({
    results,
    duration_ms: Date.now() - startTime
  })
}

async function logSync(
  platform: string,
  status: string,
  records: number,
  duration_ms: number,
  message?: string
) {
  await supabaseServer.from('sync_log').insert({
    platform, status, records_written: records,
    duration_ms, message
  })
}

11.3 — upsertMetrics Helper
// lib/supabase/metrics.ts
// Used by every platform sync function
export async function upsertMetrics(
  platform: string,
  metrics: Array<{ key: string; value?: number; text?: string }>,
  date: string = new Date().toISOString().split('T')[0]
): Promise<number> {
  const rows = metrics.map(m => ({
    platform,
    metric_key: m.key,
    metric_value: m.value ?? null,
    metric_text: m.text ?? null,
    recorded_date: date
  }))

  const { error, count } = await supabaseServer
    .from('metrics_daily')
    .upsert(rows, {
      onConflict: 'platform,metric_key,recorded_date',
      ignoreDuplicates: false
    })
    .select()

  if (error) throw new Error(`Supabase upsert failed: ${error.message}`)
  return count ?? rows.length
}


---


12. Environment Setup Guide

12.1 — Complete .env.local
# ─── AUTH ─────────────────────────────────────────
NEXTAUTH_SECRET=          # openssl rand -base64 32
NEXTAUTH_URL=             # http://localhost:3000 (dev) | https://your-vercel-url (prod)
OWNER_EMAIL=              # your email address
OWNER_PASSWORD_HASH=      # bcrypt hash (see Section 10 for generation command)

# ─── SUPABASE ──────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=        # https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # eyJh... (from Supabase dashboard > API)
SUPABASE_SERVICE_ROLE_KEY=       # eyJh... (from Supabase dashboard > API)

# ─── GOOGLE ───────────────────────────────────────
# Single OAuth 2.0 client covers GA4, GBP, Search Console, Ads
GOOGLE_CLIENT_ID=         # From Google Cloud Console > Credentials
GOOGLE_CLIENT_SECRET=     # From Google Cloud Console > Credentials
GOOGLE_REFRESH_TOKEN=     # Generated via OAuth playground (see setup guide below)
GA4_PROPERTY_ID=          # From GA4 > Admin > Property Settings (numeric, e.g. 123456789)
GBP_ACCOUNT_ID=           # From GBP API: accounts/{accountId}
GBP_LOCATION_ID=          # From GBP API: accounts/{id}/locations/{locationId}
GOOGLE_ADS_CUSTOMER_ID=   # 10-digit number without dashes
GOOGLE_ADS_DEVELOPER_TOKEN= # From Google Ads API Center

# ─── META ─────────────────────────────────────────
META_APP_ID=              # From developers.facebook.com > App Settings
META_APP_SECRET=          # From developers.facebook.com > App Settings
META_LONG_LIVED_TOKEN=    # Generated via Graph API Explorer (60-day, auto-refreshed)
IG_ACCOUNT_ID=            # Your Instagram Business Account ID (numeric)
FB_PAGE_ID=               # Your Facebook Page ID (numeric)

# ─── PINTEREST ────────────────────────────────────
PINTEREST_APP_ID=         # From developers.pinterest.com
PINTEREST_APP_SECRET=     # From developers.pinterest.com
PINTEREST_ACCESS_TOKEN=   # Generated via Pinterest OAuth flow

# ─── TIKTOK ───────────────────────────────────────
TIKTOK_APP_ID=            # From TikTok Developer Portal (apply first)
TIKTOK_APP_SECRET=        # From TikTok Developer Portal
TIKTOK_ACCESS_TOKEN=      # Generated after Business API approval

# ─── INTERNAL ─────────────────────────────────────
CRON_SECRET=              # openssl rand -base64 32  (protects cron endpoints)
WEBHOOK_SECRET=           # openssl rand -base64 32  (protects HoneyBook webhook)

# ─── EMAIL ALERTS (token refresh failures) ────────
RESEND_API_KEY=           # From resend.com (free tier)
ALERT_EMAIL=              # Email to receive token expiry alerts

12.2 — Google Refresh Token Generation
Do this once. Uses Google OAuth 2.0 Playground to generate a refresh token with all required scopes.

	•	Go to https://developers.google.com/oauthplayground
	•	Click gear icon (top right) → check 'Use your own OAuth credentials' → enter your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
	•	In Step 1, add these scopes (one per line):
https://www.googleapis.com/auth/analytics.readonly
https://www.googleapis.com/auth/business.manage
https://www.googleapis.com/auth/webmasters.readonly
https://www.googleapis.com/auth/adwords
	•	Click 'Authorize APIs' → sign in with the Google account that owns GA4, GBP, Search Console, and Ads
	•	Click 'Exchange authorization code for tokens'
	•	Copy the refresh_token value → paste into GOOGLE_REFRESH_TOKEN

12.3 — Initial Project Setup
npx create-next-app@latest stonehouse-dashboard \
  --typescript --tailwind --app --src-dir false --import-alias '@/*'

cd stonehouse-dashboard

npm install \
  @supabase/supabase-js \
  next-auth@beta \
  bcryptjs \
  @types/bcryptjs \
  googleapis \
  google-ads-api \
  react-chartjs-2 chart.js \
  papaparse @types/papaparse \
  resend \
  date-fns

# Copy .env.local and fill in all values
# Run Supabase SQL schema (Section 6.1)
# Deploy to Vercel: npx vercel


---


13. Deployment Checklist

Pre-Deployment
	•	All environment variables set in Vercel dashboard (Settings > Environment Variables)
	•	Supabase database schema fully created (all 6 tables from Section 6.1)
	•	GOOGLE_REFRESH_TOKEN generated and tested (make a test API call to GA4)
	•	META_LONG_LIVED_TOKEN generated, stored in tokens table AND env var
	•	PINTEREST_ACCESS_TOKEN generated and stored in tokens table
	•	CRON_SECRET and WEBHOOK_SECRET generated (both 32+ character random strings)
	•	OWNER_PASSWORD_HASH generated and set
	•	vercel.json committed to repo with cron schedules
	•	All integration functions tested locally: npm run dev → trigger /api/cron/refresh manually

Post-Deployment
	•	Visit https://your-app.vercel.app → confirm redirect to /login
	•	Log in with owner credentials → confirm redirect to /dashboard/overview
	•	Trigger manual sync from Settings tab → confirm all platforms sync successfully
	•	Verify Vercel Cron jobs appear in Vercel dashboard (Settings > Crons)
	•	Set up Zapier: HoneyBook trigger → webhook to /api/webhooks/crm → test with one lead
	•	Upload first directory CSV → confirm data appears on Directories tab
	•	Set a calendar reminder for Sunday to confirm token refresh cron ran successfully (check sync_log)
	•	Bookmark the dashboard URL


---


14. Error Handling & Edge Cases

Scenario
Behavior
Implementation
Platform API down during nightly sync
Use last successful data. Show amber 'Last updated Xh ago' indicator on affected platform cards.
sync_log records error. Dashboard queries: if latest sync_log.status = 'error', show StaleIndicator component on that card.
Meta token expired (not refreshed in time)
Show red 'Reconnect' badge on Instagram and Facebook cards. All Meta data shows last known values.
Check tokens.expires_at on dashboard load. If < NOW(), show error state. Settings tab shows token status table.
Token refresh fails (cron job)
Send email via Resend to ALERT_EMAIL. Dashboard continues showing last data.
In /api/cron/tokens: catch error → resend.emails.send({to: ALERT_EMAIL, subject: 'Stone House Dashboard: Token refresh failed', ...})
No data in database (fresh install)
Each tab shows empty state with setup instructions. No broken charts.
All query functions return empty arrays/nulls gracefully. Charts show empty state message if data array length = 0.
CSV parse error
Show specific failing row and column. Rows before the error are still imported.
Papa.parse with step callback. Collect errors array. Return { imported: N, errors: [{row, field, message}] }
Webhook signature invalid
Return 401. Log attempt to sync_log. Do not process body.
Constant-time string comparison to prevent timing attacks.
Supabase connection failure
All dashboard queries fail gracefully. Show generic error state.
Wrap all Supabase calls in try/catch. Return null/[] from query functions, never throw to page.
TikTok not yet approved
TikTok card shows 'Pending API access' state with a note.
Check if TIKTOK_ACCESS_TOKEN is set. If not, render TikTok card with 'Not connected' state and link to apply.
Date range with no data
Charts render with empty datasets. KPI cards show '—'.
Query functions return empty array if no rows match date range. Chart components handle empty data array.


---


15. Tailwind Design Tokens

// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        stone: {
          dark:    '#3E2723',  // Primary dark brown
          gold:    '#8B6914',  // Primary gold
          tan:     '#C8A96E',  // Accent tan
          mid:     '#A07830',  // Mid gold
          light:   '#F5EFE0',  // Light background
          medium:  '#E8D5B0',  // Medium tan
          warm:    '#9E9085',  // Warm gray
          border:  '#C8B89A',  // Border color
        }
      },
      fontFamily: {
        heading: ['Georgia', 'serif'],
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
      borderWidth: {
        'half': '0.5px',
      }
    }
  }
}

// Common Tailwind class patterns used throughout:
// Card:       bg-white border-half border-stone-border rounded-lg shadow-sm
// KPI Card:   bg-stone-light rounded-md p-4
// Heading:    font-heading text-stone-dark
// Tab active: border-b-2 border-stone-gold text-stone-gold
// Button:     bg-stone-dark text-stone-tan hover:bg-stone-gold
// Badge good: bg-green-100 text-green-800
// Badge warn: bg-amber-100 text-amber-800
// Badge error: bg-red-100 text-red-800


---


16. Future Enhancements (v2)

These features are explicitly OUT OF SCOPE for v1. They are documented here to ensure v1 architecture does not block them.

Feature
Value
V1 Prerequisite
AI weekly summary
Claude analyzes the week's data and emails a 3-sentence plain-English summary every Monday: what improved, what declined, one recommended action.
All metrics in Supabase consistently
Lead scoring
Automatically score each pipeline lead 1–10 based on source quality, date flexibility, budget signals, and response speed. Alert owner when score drops (going cold).
Pipeline table + source attribution
Competitor keyword tracking
Track rankings for competitor venue keywords from Search Console to identify where Stone House is gaining or losing ground.
keyword_rankings table + GSC integration
Mobile PWA
Progressive Web App so the dashboard works offline and installs on the owner's phone. Show 5 key KPIs on the home screen.
Existing app structure supports this
Booking calendar view
Visual calendar showing available/booked dates by season tier. Drag to mark dates as held/blocked.
Pipeline table event_date
Automated review requests
After event_date passes, automatically trigger a review request email to the couple via Resend.
Pipeline table + Resend already installed
Budget pacing alerts
Alert when monthly ad spend is on track to exceed budget before month end. Show pacing bar on Ads tab.
Google Ads + Meta Ads integration
Vendor referral tracking
Add vendor_referral field to pipeline. Track which photographers, planners, caterers are sending the most referrals.
Pipeline table schema addition
Annual benchmarking
Year-over-year comparison view for all key metrics. Compare Jan 2026 vs Jan 2025.
12+ months of data in metrics_daily



---


Stone House Nevada City
Marketing Analytics Dashboard — PRD v1.0
This document is the complete specification. Build from this. Nothing is missing.