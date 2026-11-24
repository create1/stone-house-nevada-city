#!/bin/bash
# ──────────────────────────────────────────────────
# Stonehouse Website — One-Command Setup
# ──────────────────────────────────────────────────
# This script handles everything after you create a Sanity account.
#
# Prerequisites:
#   1. Node.js 18+ installed
#   2. Sanity account created at https://www.sanity.io
#   3. Sanity project created (you'll be prompted for project ID)
#
# Usage:
#   chmod +x scripts/setup.sh && ./scripts/setup.sh
# ──────────────────────────────────────────────────

set -e

echo ""
echo "🏛️  Stonehouse Website Setup"
echo "──────────────────────────────────────"
echo ""

# ── Check Node.js ────────────────────────────────
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed. Please install Node.js 18+ first."
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js 18+ required. You have $(node -v)."
  exit 1
fi

echo "✅ Node.js $(node -v) detected"

# ── Install Dependencies ─────────────────────────
echo ""
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps
echo "✅ Dependencies installed"

# ── Collect Sanity Config ────────────────────────
echo ""
echo "🔧 Sanity CMS Setup"
echo "──────────────────────────────────────"
echo ""
echo "Go to https://www.sanity.io/manage and create a new project."
echo "Then find your Project ID in the project dashboard."
echo ""
read -p "Sanity Project ID: " SANITY_PROJECT_ID

if [ -z "$SANITY_PROJECT_ID" ]; then
  echo "❌ Project ID is required."
  exit 1
fi

echo ""
echo "Now create an API token:"
echo "  1. Go to your project at sanity.io/manage"
echo "  2. Settings → API → Tokens → Add API token"
echo "  3. Name: 'Stonehouse Website'"
echo "  4. Permissions: Editor"
echo "  5. Copy the token"
echo ""
read -p "Sanity Write Token: " SANITY_WRITE_TOKEN

if [ -z "$SANITY_WRITE_TOKEN" ]; then
  echo "❌ Write token is required for content seeding."
  exit 1
fi

# ── Collect Notion API Key ───────────────────────
echo ""
echo "🔧 Notion Setup"
echo "──────────────────────────────────────"
echo ""
echo "Create a Notion integration:"
echo "  1. Go to https://www.notion.so/my-integrations"
echo "  2. Click 'New integration'"
echo "  3. Name: 'Stonehouse Website'"
echo "  4. Capabilities: Read content, Insert content"
echo "  5. Copy the Internal Integration Secret"
echo ""
echo "Then share the 'Stonehouse Leads' database with the integration:"
echo "  1. Open Stonehouse Leads in Notion"
echo "  2. Click ••• → Connections → Add connection → Stonehouse Website"
echo ""
read -p "Notion API Key (secret_...): " NOTION_API_KEY

# ── Collect Resend API Key ───────────────────────
echo ""
echo "🔧 Resend Email Setup"
echo "──────────────────────────────────────"
echo ""
echo "Get your API key from https://resend.com/api-keys"
echo "(Skip if you don't have one yet — emails just won't send)"
echo ""
read -p "Resend API Key (re_...): " RESEND_API_KEY

# ── Write .env.local ─────────────────────────────
echo ""
echo "📝 Writing .env.local..."

cat > .env.local << EOF
# ── Sanity CMS ──────────────────────────────────
NEXT_PUBLIC_SANITY_PROJECT_ID=$SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_WRITE_TOKEN=$SANITY_WRITE_TOKEN

# ── Notion (leads database) ─────────────────────
NOTION_API_KEY=$NOTION_API_KEY
NOTION_LEADS_DATABASE_ID=d1865abcb33a4a14872e22bc49cb4fb1

# ── Resend (transactional email) ─────────────────
RESEND_API_KEY=$RESEND_API_KEY
EOF

echo "✅ .env.local written"

# ── Add CORS Origin to Sanity ────────────────────
echo ""
echo "📡 Adding CORS origin to Sanity..."
npx sanity cors add http://localhost:3000 --no-credentials 2>/dev/null || true
echo "✅ CORS configured"

# ── Seed Sanity Content ──────────────────────────
echo ""
echo "🌱 Seeding content into Sanity..."
SANITY_PROJECT_ID=$SANITY_PROJECT_ID \
SANITY_DATASET=production \
SANITY_WRITE_TOKEN=$SANITY_WRITE_TOKEN \
npx tsx scripts/seed-sanity.ts

# ── Deploy Sanity Studio ─────────────────────────
echo ""
echo "🎨 Deploying Sanity Studio..."
npx sanity deploy 2>/dev/null || echo "⚠️  Studio deploy skipped (run 'npx sanity deploy' manually)"

# ── Done ─────────────────────────────────────────
echo ""
echo "──────────────────────────────────────"
echo "✅ Setup complete!"
echo "──────────────────────────────────────"
echo ""
echo "  Start dev server:    npm run dev"
echo "  Open site:           http://localhost:3000"
echo "  Sanity Studio:       https://$SANITY_PROJECT_ID.sanity.studio"
echo ""
echo "  Next steps:"
echo "  1. Upload venue images in Sanity Studio"
echo "  2. Push to GitHub to trigger Vercel deploy"
echo "  3. Set env vars in Vercel dashboard"
echo ""
