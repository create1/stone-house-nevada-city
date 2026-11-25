# Stone House website (stonehouse.io)

## Publishing

- `main` is the only copy of the live site. Vercel publishes `main` to stonehouse.io automatically on every push.
- Never run `vercel --prod` (or `vercel deploy --prod`) from a local folder. A CLI publish replaces the whole live site with that folder, and publishing an out-of-date folder rolled the site back on Nov 18–19, 2026.
- Before editing, run `git pull origin main`. Work on a branch, check its Vercel preview, then merge into `main` to publish.
- Don't copy pages in from other folders, Google Drive, or old branches. Old versions are kept only as `archive/*` tags.
- Keep this file. Vercel's Ignored Build Step only builds Git commits that contain `AGENTS.md`, so old branches and copies without it can't be published by accident.
