// public/public-posts-supabase.js
// Public posts renderer using Supabase anon key (read-only)

(function () {
  if (!window.supabase) {
    console.error('Supabase library not found. Include the UMD script from CDN.');
    return;
  }
  const SUPABASE_URL = window.SUPABASE_URL || 'https://your-project-ref.supabase.co';
  const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'eyJ...your_anon_key_here';
  const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  async function fetchAndRender(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '<p>Loading posts…</p>';
    try {
      const { data, error } = await client.from('posts').select('*').order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      if (!data || data.length === 0) {
        container.innerHTML = '<p>No posts yet.</p>';
        return;
      }
      container.innerHTML = data.map(p => `\n        <div style="border:1px solid #eee;padding:10px;margin:6px 0;background:#fff">\n          <div style="font-size:0.95em;color:#666;margin-bottom:6px">\n            <strong>${escapeHtml(p.type)}</strong> · ${p.subject_number ? `<strong>Subject #${p.subject_number}</strong> — ` : ''}<span style="color:#999">${new Date(p.created_at).toLocaleString()}</span>\n          </div>\n          <h3 style="margin:4px 0">${escapeHtml(p.title)}</h3>\n          <div style="white-space:pre-wrap;color:#222">${escapeHtml(p.content)}</div>\n          <div style="font-size:0.85em;color:#777;margin-top:8px">By ${escapeHtml(p.author_email)}</div>\n        </div>`).join('\n');
    } catch (err) {
      console.error('Failed to fetch posts', err);
      container.innerHTML = '<p>Error loading posts.</p>';
    }
  }

  function escapeHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // auto-render any container with data-posts-container attribute
  document.addEventListener('DOMContentLoaded', function () {
    const els = document.querySelectorAll('[data-posts-container]');
    els.forEach(el => fetchAndRender(el.id || el.getAttribute('data-posts-container')));
  });

  // expose function
  window.renderSupabasePosts = fetchAndRender;
})();
