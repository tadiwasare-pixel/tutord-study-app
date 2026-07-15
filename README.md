# TutorD 2026 Study Hub

Offline-ready single-page study app with:
- local SVG icons that work offline
- service worker caching
- subject notes
- past papers list
- updates feed
- community posting
- Supabase backend integration
- offline posting queue

## Files
- `index.html` - app shell
- `styles.css` - UI styling
- `app.js` - all client logic
- `sw.js` - service worker for offline shell caching
- `manifest.json` - installable PWA manifest
- `icons/` - local offline icons
- `supabase_schema.sql` - SQL to create backend tables and policies

## Supabase setup
1. Open your Supabase project.
2. Go to SQL Editor.
3. Run the contents of `supabase_schema.sql`.
4. Open the app.

## Backend tables used
- `notes`
- `updates`
- `past_papers`
- `community_posts`

## Offline behaviour
- App shell is cached by the service worker.
- Icons are local SVG files, so they do not depend on Font Awesome or internet access.
- If posting fails or the user is offline, the action is stored in localStorage queue and retried when connectivity returns.
