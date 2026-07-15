// posts.js — render posts stored in localStorage (used by admin preview and public pages)

(function () {
  const POSTS_KEY = 'tutord_posts';
  const container = document.getElementById('postsContainer');

  function getPosts() {
    try {
      const raw = localStorage.getItem(POSTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to load posts', e);
      return [];
    }
  }

  function timeAgo(iso) {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + 'm';
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + 'h';
    const days = Math.floor(hours / 24);
    return days + 'd';
  }

  function renderPosts() {
    if (!container) return;
    const posts = getPosts();
    if (!posts.length) {
      container.innerHTML = '<p>No posts yet.</p>';
      return;
    }

    const html = posts
      .map(p => {
        const sn = p.subjectNumber ? `<strong>Subject #${p.subjectNumber}</strong> — ` : '';
        return `
          <div style="border:1px solid #eee;padding:10px;margin:6px 0;background:#fff">
            <div style="font-size:0.95em;color:#666;margin-bottom:6px">
              <strong>${escapeHtml(p.type || 'update')}</strong> · ${sn}<span style="color:#999">${timeAgo(p.createdAt)}</span>
            </div>
            <h3 style="margin:4px 0">${escapeHtml(p.title)}</h3>
            <div style="white-space:pre-wrap;color:#222">${escapeHtml(p.content)}</div>
            <div style="font-size:0.85em;color:#777;margin-top:8px">By ${escapeHtml(p.author || 'admin')}</div>
          </div>`;
      })
      .join('\n');

    container.innerHTML = html;
  }

  // small escape util for rendered HTML (same as admin.js)
  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Render initially
  renderPosts();

  // Make renderPosts available for admin.js to call after saves
  window.renderPosts = renderPosts;

  // Re-render on storage events so multiple tabs stay in sync
  window.addEventListener('storage', function (e) {
    if (e.key === POSTS_KEY) renderPosts();
    if (e.key === null) renderPosts(); // generic change
  });
})();
