// Client-side admin guard for Tutord Study App
// WARNING: credentials are visible in the client. Not secure for production.

(function () {
  const ADMIN_EMAIL = 'tadiwasare@gmail.com';
  const ADMIN_PASSWORD = 'tadiwasare';

  const loginEl = document.getElementById('login');
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

  const POSTS_KEY = 'tutord_posts';
  const LOGIN_KEY = 'tutord_admin_logged_in';

  // Simple HTML escape to reduce accidental injection in preview
  function escapeHTML(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getPosts() {
    try {
      const raw = localStorage.getItem(POSTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to load posts', e);
      return [];
    }
  }

  function savePosts(posts) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    // If posts.js is loaded it listens to storage events, otherwise we'll call render directly
    if (window.renderPosts) window.renderPosts();
  }

  function setLoggedIn(flag) {
    localStorage.setItem(LOGIN_KEY, flag ? '1' : '0');
    updateUi();
  }

  function isLoggedIn() {
    return localStorage.getItem(LOGIN_KEY) === '1';
  }

  function updateUi() {
    if (isLoggedIn()) {
      loginEl.style.display = 'none';
      panelEl.style.display = '';
      loginMsg.textContent = '';
    } else {
      loginEl.style.display = '';
      panelEl.style.display = 'none';
    }
  }

  loginBtn.addEventListener('click', function () {
    const email = (emailInput.value || '').trim();
    const pass = (passwordInput.value || '').trim();

    if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
      setLoggedIn(true);
      postMsg.style.color = 'green';
      postMsg.textContent = 'Login successful. You can now post.';
      // keep email field for record if needed
    } else {
      postMsg.textContent = '';
      loginMsg.style.color = 'red';
      loginMsg.textContent = 'Invalid admin credentials.';
    }
  });

  logoutBtn.addEventListener('click', function () {
    setLoggedIn(false);
    loginMsg.textContent = 'Logged out.';
  });

  postBtn.addEventListener('click', function () {
    if (!isLoggedIn()) {
      postMsg.style.color = 'red';
      postMsg.textContent = 'You must be logged in as admin to post.';
      return;
    }

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

    if (subjectNumber !== null && (subjectNumber < 1 || subjectNumber > 40)) {
      postMsg.style.color = 'red';
      postMsg.textContent = 'Subject number must be between 1 and 40 (or leave blank).';
      return;
    }

    const posts = getPosts();
    const newPost = {
      id: Date.now(),
      type,
      subjectNumber,
      title: escapeHTML(title),
      content: escapeHTML(content),
      createdAt: new Date().toISOString(),
      author: ADMIN_EMAIL
    };

    posts.unshift(newPost); // newest first
    savePosts(posts);

    // clear form
    titleInput.value = '';
    contentInput.value = '';
    subjectNumberInput.value = '';
    postMsg.style.color = 'green';
    postMsg.textContent = 'Post saved locally (client-side).';
  });

  // initialize UI state on load
  updateUi();
})();
