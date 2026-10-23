<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# time4laptop.com

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies with `pnpm install` (or `npm install`).
2. Create a Supabase project and copy its project URL and publishable key.
3. Create `.env.local` in the project root with:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

   The older Supabase anon key can be used in `VITE_SUPABASE_ANON_KEY` if your project still shows that key name. Never put a Supabase secret or `service_role` key in a `VITE_` variable.

4. In Supabase Authentication settings, enable Email sign-ups and add the local app URL (for example `http://localhost:3000`) to the allowed redirect URLs.
5. Start the app with `pnpm dev` (or `npm run dev`). Restart it after changing `.env.local`.

New customers sign up with email and password. When email confirmation is enabled in Supabase, they must confirm their email before signing in. Customer passwords are handled by Supabase Auth; the app does not save passwords in browser storage.
"# time4laptop" 
