// Initialize official Supabase JS Client
if (!window.supabase) {
  console.error("Supabase client library not loaded. Verify CDN in index.html.");
}

window.db = window.supabase.createClient(
  window.DAYBREAK_CONFIG.SUPABASE_URL,
  window.DAYBREAK_CONFIG.SUPABASE_ANON_KEY
);