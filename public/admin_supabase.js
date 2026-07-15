// public/admin_supabase.js
// Admin UI that signs in via Supabase Auth and creates posts in the 'posts' table.

(function () {
  if (!window.supabase) {
    console.error('Supabase library not found. Include the UMD script from CDN.');
    return;
  }

  const SUPABASE_URL = window.SUPABASE_URL;
  const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY;
  const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('loginBtn');
  const loginMsg = document.getElementById('loginMsg');

  const panelEl = document.getElementById('panel');
  const postBtn = document.getElementById('postBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const postMsg = document.getElementById('postMsg');

  const titleInput = document.getElementById('title');
  const contentInput = document.getElementById('content');
  const subjectNumberInput = document.getElementById('subjectNumber');
  const postTypeSelect = document.getElementById('postType');

  const postsContainer = document.getElementById('postsContainer');

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async function renderPosts() {
    try {
      const { data, error } = await client.from('posts').select('*').order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      if (!data || data.length === 0) {
        postsContainer.innerHTML = '<p>No posts yet.</p>';
        return;
      }
      postsContainer.innerHTML = data.map(p => `\n        <div style="border:1px solid #eee;padding:10px;margin:6px 0;background:#fff">\n          <div style="font-size:0.95em;color:#666;margin-bottom:6px">\n            <strong>${escapeHtml(p.type)}</strong> · ${p.subject_number ? `<strong>Subject #${p.subject_number}</strong> — ` : ''}<span style="color:#999">${new Date(p.created_at).toLocaleString()}</span>\n          </div>\n          <h3 style="margin:4px 0">${escapeHtml(p.title)}</h3>\n          <div style="white-space:pre-wrap;color:#222">${escapeHtml(p.content)}</div>\n          <div style="font-size:0.85em;color:#777;margin-top:8px">By ${escapeHtml(p.author_email)}</div>\n        </div>`).join('\n');
    } catch (err) {
      console.error('Failed to load posts', err);
      postsContainer.innerHTML = '<p>Error loading posts.</p>';
    }
  }

  async function checkSession() {
    const { data } = await client.auth.getSession();
    return data.session;
  }

  async function updateUi() {
    const session = await checkSession();
    if (session && session.user) {
      panelEl.style.display = '';
      loginMsg.textContent = '';
    } else {
      panelEl.style.display = 'none';
    }
  }

  loginBtn.addEventListener('click', async () => {
    const email = (emailInput.value || '').trim();
    const pass = (passwordInput.value || '').trim();
    loginMsg.textContent = 'Signing in...';
    try {
      const { data, error } = await client.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      loginMsg.style.color = 'green';
      loginMsg.textContent = 'Signed in as ' + (data.user?.email || 'admin');
      await updateUi();
      await renderPosts();
    } catch (err) {
      loginMsg.style.color = 'red';
      loginMsg.textContent = 'Sign-in error: ' + (err.message || err.error_description || err);
    }
  });

  logoutBtn.addEventListener('click', async () => {
    await client.auth.signOut();
    loginMsg.textContent = 'Signed out.';
    await updateUi();
  });

  postBtn.addEventListener('click', async () => {
    const title = (titleInput.value || '').trim();
    const content = (contentInput.value || '').trim();
    const type = postTypeSelect.value;
    const subjectNumberRaw = subjectNumberInput.value;
    const subjectNumber = subjectNumberRaw ? parseInt(subjectNumberRaw, 10) : null;

    if (!title || !content) {
      postMsg.style.color = 'red';
      postMsg.textContent = 'Please provide a title and content.';
      return;
    }

    try {
      const userResp = await client.auth.getUser();
      const author = userResp.data.user?.email || 'unknown';
      const { data, error } = await client.from('posts').insert([{ title, content, type, subject_number: subjectNumber, author_email: author }]);
      if (error) throw error;
      postMsg.style.color = 'green';
      postMsg.textContent = 'Post created.';
      titleInput.value = '';
      contentInput.value = '';
      subjectNumberInput.value = '';
      await renderPosts();
    } catch (err) {
      postMsg.style.color = 'red';
      postMsg.textContent = 'Post error: ' + (err.message || err.error_description || err);
      console.error(err);
    }
  });

  // initial render
  updateUi();
  renderPosts();

})();
