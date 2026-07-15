const SUPABASE_URL = 'https://npxzmivuhtazdixurpes.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_v6QagEXcrJW4mEKGOXVqJQ_bEZP1qgbeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5weHptaXZ1aHRhemRpeHVycGVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxMjQzNjYsImV4cCI6MjA5OTcwMDM2Nn0.84C3Rq1wg48soYqYsdz0s3Dd2cp-o3IPrKCo5v7ktfI';

const state = {
  currentLevel: 'olevel',
  currentSubject: 'Mathematics',
  done: JSON.parse(localStorage.getItem('tutord_done') || '[]'),
  bookmarks: JSON.parse(localStorage.getItem('tutord_bookmarks') || '[]'),
  xp: Number(localStorage.getItem('tutord_xp') || 0),
  profile: JSON.parse(localStorage.getItem('tutord_profile') || '{"name":"Student","school":"Your School","grade":"Form 4","bio":"Offline-first learner"}'),
  queue: JSON.parse(localStorage.getItem('tutord_queue') || '[]')
};

const subjects = {
  olevel: [
    { name: 'Mathematics', code: '4004' },
    { name: 'English Language', code: '4005' },
    { name: 'Combined Science', code: '4003' },
    { name: 'Biology', code: '5006' },
    { name: 'Physics', code: '5012' },
    { name: 'Chemistry', code: '5009' },
    { name: 'Computer Science', code: '4008' },
    { name: 'History', code: '4023' }
  ],
  alevel: [
    { name: 'Pure Mathematics', code: '9041' },
    { name: 'Biology', code: '9006' },
    { name: 'Physics', code: '9012' },
    { name: 'Chemistry', code: '9009' },
    { name: 'Computer Science', code: '9007' }
  ],
  grade7: [
    { name: 'Mathematics', code: 'G7-7' },
    { name: 'English Language', code: 'G7-2' },
    { name: 'Social Science', code: 'G7-3' }
  ]
};

const notesSeed = {
  Mathematics: [
    { title: 'Matrices Mastery', body: 'A matrix is a rectangular array arranged in rows and columns. Addition and subtraction require the same order. For a 2×2 matrix, determinant = ad − bc.', level: 'olevel' },
    { title: 'Vectors', body: 'Vectors have both magnitude and direction. Add vectors by combining corresponding components. They are useful in translations and geometry.', level: 'olevel' },
    { title: 'Algebraic Processes & Graphs', body: 'Linear equations use y = mx + c, where m is the gradient and c is the intercept. Plot points carefully and observe trends.', level: 'olevel' }
  ],
  'English Language': [
    { title: 'Speech Writing', body: 'Use a salutation, a strong introduction, clear body points and a conclusion with a call to action.', level: 'olevel' },
    { title: 'Free Composition', body: 'Choose a narrative or descriptive approach. Plan your structure first and keep tense consistent.', level: 'olevel' }
  ],
  'Combined Science': [
    { title: 'Forces & Energy', body: 'Balanced forces give zero resultant force. Energy changes form, for example chemical to electrical or heat.', level: 'olevel' }
  ],
  Biology: [
    { title: 'Cell Structure', body: 'Plant cells contain a cell wall and chloroplasts. Animal cells do not. The nucleus controls activities.', level: 'olevel' }
  ],
  Physics: [
    { title: 'Mechanics', body: 'Newton’s laws describe motion. Force equals mass times acceleration. Momentum is mass times velocity.', level: 'olevel' }
  ],
  Chemistry: [
    { title: 'Atomic Structure', body: 'Atoms contain protons, neutrons and electrons. Atomic number equals number of protons.', level: 'olevel' }
  ],
  'Computer Science': [
    { title: 'The Computer System', body: 'A computer system includes hardware, software, data, users and procedures.', level: 'olevel' }
  ],
  History: [
    { title: 'African Nationalism', body: 'African nationalism promoted self-rule, resistance to colonialism and independence movements.', level: 'olevel' }
  ],
  'Pure Mathematics': [
    { title: 'Functions', body: 'A function maps each input to exactly one output. Study domain, range, inverse and composition.', level: 'alevel' }
  ],
  'Social Science': [
    { title: 'Citizenship', body: 'Citizenship includes rights, duties, respect for law and participation in community life.', level: 'grade7' }
  ]
};

const updatesSeed = [
  { title: 'Offline icons enabled', body: 'All interface icons are rendered from local SVG and app assets are cached by the service worker.', category: 'Feature' },
  { title: 'Backend ready for notes, updates and papers', body: 'The app can read and post content using Supabase REST tables once the database schema is created.', category: 'Backend' }
];

const papersSeed = [2020, 2021, 2022, 2023, 2024].flatMap(year => [
  { level: 'olevel', subject: 'Mathematics', code: '4004', title: `${year} Paper 1`, year, paper_type: 'Question', url: '' },
  { level: 'olevel', subject: 'Mathematics', code: '4004', title: `${year} Paper 2`, year, paper_type: 'Question', url: '' },
  { level: 'olevel', subject: 'English Language', code: '4005', title: `${year} Paper 1`, year, paper_type: 'Question', url: '' }
]);

const icon = {
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" stroke-width="2"></circle><path d="M20 20l-4.2-4.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>',
  book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5A2.5 2.5 0 0 0 17.5 16H4z"></path><path d="M4 6v12.5A2.5 2.5 0 0 0 6.5 21H20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>',
  note: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h8l4 4v14H7z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15 3v5h5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 12h6M10 16h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  upload: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 9l4-4 4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 19h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  paper: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10v18H7z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 8h4M10 12h4M10 16h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  users: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M4 19c0-2.8 2.7-5 6-5s6 2.2 6 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M15 18c.4-1.8 2.1-3.2 4.2-3.2 1.1 0 2.1.3 2.8.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.8 5.6 6.2.9-4.5 4.3 1.1 6.1L12 17l-5.6 2.9 1.1-6.1L3 9.5l6.2-.9z"></path></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
  bookmark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10v16l-5-3-5 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></path></svg>',
  cloud: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9.8 3.5 3.5 0 0 0 7 18z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>'
};

function $(id) { return document.getElementById(id); }
function saveState() {
  localStorage.setItem('tutord_done', JSON.stringify(state.done));
  localStorage.setItem('tutord_bookmarks', JSON.stringify(state.bookmarks));
  localStorage.setItem('tutord_xp', String(state.xp));
  localStorage.setItem('tutord_profile', JSON.stringify(state.profile));
  localStorage.setItem('tutord_queue', JSON.stringify(state.queue));
}
function toast(message) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  $('toastHost').appendChild(el);
  setTimeout(() => el.remove(), 2500);
}
function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function getHeaders(preferReturn = true) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    ...(preferReturn ? { Prefer: 'return=representation' } : {})
  };
}
async function supabase(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, options);
  if (!res.ok) throw new Error(await res.text());
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
function queueInsert(table, payload) {
  state.queue.push({ type: 'insert', table, payload, createdAt: Date.now() });
  saveState();
  updateSyncBadge();
}
async function flushQueue() {
  if (!navigator.onLine || !state.queue.length) return;
  const pending = [...state.queue];
  state.queue = [];
  for (const job of pending) {
    try {
      await supabase(job.table, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(job.payload)
      });
    } catch {
      state.queue.push(job);
    }
  }
  saveState();
  updateSyncBadge();
}
function updateSyncBadge() {
  $('syncBadge').textContent = !navigator.onLine ? 'Offline' : state.queue.length ? `${state.queue.length} queued` : 'Synced';
}
function levelSubjects() { return subjects[state.currentLevel] || subjects.olevel; }
function activeSubjectMeta() { return levelSubjects().find(s => s.name === state.currentSubject) || levelSubjects()[0]; }
function doneKey(title) { return `${state.currentLevel}:${state.currentSubject}:${title}`; }
function isDone(title) { return state.done.includes(doneKey(title)); }
function isBookmarked(title) { return state.bookmarks.includes(doneKey(title)); }
function addXP(amount) { state.xp += amount; saveState(); }

function cacheSet(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function cacheGet(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}

function renderLevelStrip() {
  const levels = [['olevel', 'O Level'], ['alevel', 'A Level'], ['grade7', 'Grade 7']];
  $('levelStrip').innerHTML = levels.map(([id, label]) => `<button class="level-chip ${state.currentLevel === id ? 'active' : ''}" data-level="${id}">${label}</button>`).join('');
  document.querySelectorAll('.level-chip').forEach(btn => {
    btn.onclick = () => {
      state.currentLevel = btn.dataset.level;
      state.currentSubject = levelSubjects()[0].name;
      renderLevelStrip();
      renderSubjectStrip();
      renderActiveTab();
    };
  });
}

function renderSubjectStrip() {
  $('subjectStrip').innerHTML = levelSubjects().map(subject => `<button class="subject-chip ${subject.name === state.currentSubject ? 'active' : ''}">${escapeHtml(subject.name)} <small>${subject.code}</small></button>`).join('');
  [...document.querySelectorAll('.subject-chip')].forEach((btn, index) => {
    btn.onclick = () => {
      state.currentSubject = levelSubjects()[index].name;
      renderSubjectStrip();
      renderActiveTab();
    };
  });
}

async function loadNotes() {
  const cacheKey = `notes_cache_${state.currentLevel}_${state.currentSubject}`;
  const seeded = (notesSeed[state.currentSubject] || []).filter(item => item.level === state.currentLevel || !item.level);
  let remote = [];
  try {
    remote = await supabase(`notes?select=*&level=eq.${encodeURIComponent(state.currentLevel)}&subject=eq.${encodeURIComponent(state.currentSubject)}&order=created_at.desc`, { headers: getHeaders(false) });
    cacheSet(cacheKey, remote);
  } catch {
    remote = cacheGet(cacheKey, []);
  }
  const merged = [...remote, ...seeded.filter(seed => !remote.some(r => r.title === seed.title))];
  return merged;
}

async function loadPapers() {
  const cacheKey = `papers_cache_${state.currentLevel}_${state.currentSubject}`;
  const seeded = papersSeed.filter(item => item.level === state.currentLevel && item.subject === state.currentSubject);
  let remote = [];
  try {
    remote = await supabase(`past_papers?select=*&level=eq.${encodeURIComponent(state.currentLevel)}&subject=eq.${encodeURIComponent(state.currentSubject)}&order=year.desc`, { headers: getHeaders(false) });
    cacheSet(cacheKey, remote);
  } catch {
    remote = cacheGet(cacheKey, []);
  }
  return [...remote, ...seeded.filter(seed => !remote.some(r => `${r.title}|${r.year}` === `${seed.title}|${seed.year}`))];
}

async function loadUpdates() {
  const cacheKey = 'updates_cache';
  let remote = [];
  try {
    remote = await supabase('updates?select=*&order=created_at.desc', { headers: getHeaders(false) });
    cacheSet(cacheKey, remote);
  } catch {
    remote = cacheGet(cacheKey, []);
  }
  return [...remote, ...updatesSeed.filter(seed => !remote.some(r => r.title === seed.title))];
}

async function loadCommunity() {
  const cacheKey = 'community_cache';
  let remote = [];
  try {
    remote = await supabase('community_posts?select=*&order=created_at.desc', { headers: getHeaders(false) });
    cacheSet(cacheKey, remote);
  } catch {
    remote = cacheGet(cacheKey, []);
  }
  return remote;
}

async function renderLearn() {
  const meta = activeSubjectMeta();
  const notes = await loadNotes();
  $('learnTab').innerHTML = `
    <div class="card">
      <div class="row-between">
        <div>
          <h2>${escapeHtml(state.currentSubject)}</h2>
          <div class="meta">Code ${meta.code} · Notes available offline</div>
        </div>
        <span class="tag">${notes.length} topic${notes.length === 1 ? '' : 's'}</span>
      </div>
    </div>
    <div class="card">
      <h3>${icon.note} Subject notes</h3>
      ${notes.length ? notes.map((note, index) => `
        <article class="topic">
          <div class="topic-head">
            <div>
              <h4>${escapeHtml(note.title)}</h4>
              <div class="meta">${isDone(note.title) ? 'Completed' : 'Tap read to study'}${note.author ? ` · by ${escapeHtml(note.author)}` : ''}</div>
            </div>
            <div class="inline-actions">
              <button class="btn btn-outline" data-toggle-note="note-${index}">${icon.book} Read</button>
              <button class="btn ${isBookmarked(note.title) ? 'btn-accent' : ''}" data-bookmark="${escapeHtml(note.title)}">${icon.bookmark} Save</button>
              <button class="btn btn-primary" data-complete="${escapeHtml(note.title)}">${icon.check} Done</button>
            </div>
          </div>
          <div id="note-${index}" class="notes-body">${escapeHtml(note.body)}</div>
        </article>
      `).join('') : '<div class="empty">No notes available for this subject yet.</div>'}
    </div>
    <div class="card">
      <h3>${icon.upload} Add a note</h3>
      <div class="meta">Posts to Supabase when online. Saves to queue when offline.</div>
      <input class="input" id="noteTitle" placeholder="Note title" />
      <textarea id="noteBody" placeholder="Write note content..."></textarea>
      <button class="btn btn-primary" id="postNoteBtn">${icon.upload} Post Note</button>
    </div>`;

  document.querySelectorAll('[data-toggle-note]').forEach(btn => {
    btn.onclick = () => $(btn.dataset.toggleNote).classList.toggle('show');
  });
  document.querySelectorAll('[data-bookmark]').forEach(btn => {
    btn.onclick = () => {
      const key = doneKey(btn.dataset.bookmark);
      if (state.bookmarks.includes(key)) state.bookmarks = state.bookmarks.filter(x => x !== key);
      else state.bookmarks.push(key);
      saveState();
      renderLearn();
    };
  });
  document.querySelectorAll('[data-complete]').forEach(btn => {
    btn.onclick = () => {
      const key = doneKey(btn.dataset.complete);
      if (!state.done.includes(key)) {
        state.done.push(key);
        addXP(25);
        saveState();
        toast('Topic completed. +25 XP');
        renderLearn();
      }
    };
  });
  $('postNoteBtn').onclick = postNote;
}

async function renderPapers() {
  const papers = await loadPapers();
  const meta = activeSubjectMeta();
  $('papersTab').innerHTML = `
    <div class="card">
      <div class="row-between">
        <div>
          <h2>Past Papers</h2>
          <div class="meta">${escapeHtml(state.currentSubject)} · ${meta.code}</div>
        </div>
        <span class="tag">${papers.length} items</span>
      </div>
    </div>
    <div class="card">
      <h3>${icon.paper} Available papers</h3>
      ${papers.length ? papers.map(paper => `
        <div class="paper-item">
          <div class="row-between">
            <div>
              <strong>${escapeHtml(paper.title || `${paper.year} ${paper.paper_type}`)}</strong>
              <div class="meta">${paper.year} · ${escapeHtml(paper.paper_type || 'Paper')} ${paper.code ? `· ${paper.code}` : ''}</div>
            </div>
            ${paper.url ? `<a class="btn btn-outline" href="${escapeHtml(paper.url)}" target="_blank" rel="noreferrer">Open</a>` : `<span class="tag">Offline list</span>`}
          </div>
        </div>`).join('') : '<div class="empty">No past papers found.</div>'}
    </div>
    <div class="card">
      <h3>${icon.upload} Add past paper</h3>
      <input class="input" id="paperTitle" placeholder="Paper title e.g. 2024 Paper 1" />
      <input class="input" id="paperYear" type="number" placeholder="Year" />
      <input class="input" id="paperUrl" placeholder="Public URL (optional)" />
      <button class="btn btn-primary" id="postPaperBtn">${icon.upload} Post Past Paper</button>
    </div>`;
  $('postPaperBtn').onclick = postPaper;
}

async function renderUpdates() {
  const updates = await loadUpdates();
  $('updatesTab').innerHTML = `
    <div class="card">
      <div class="row-between">
        <div>
          <h2>Notes & Updates</h2>
          <div class="meta">Announcements, fixes and learning updates</div>
        </div>
        <span class="tag">${updates.length} posts</span>
      </div>
    </div>
    <div class="card">
      <h3>${icon.cloud} Latest updates</h3>
      ${updates.map(update => `
        <div class="post-item">
          <strong>${escapeHtml(update.title)}</strong>
          <div class="meta">${escapeHtml(update.category || update.kind || 'Update')}</div>
          <p>${escapeHtml(update.body)}</p>
        </div>`).join('')}
    </div>
    <div class="card">
      <h3>${icon.upload} Post update</h3>
      <input class="input" id="updateTitle" placeholder="Update title" />
      <textarea id="updateBody" placeholder="What changed or what should students know?"></textarea>
      <button class="btn btn-primary" id="postUpdateBtn">${icon.upload} Post Update</button>
    </div>`;
  $('postUpdateBtn').onclick = postUpdate;
}

async function renderCommunity() {
  const posts = await loadCommunity();
  $('communityTab').innerHTML = `
    <div class="card">
      <h2>Community</h2>
      <div class="meta">Ask a question, share an update or help other students.</div>
    </div>
    <div class="card">
      <h3>${icon.users} New post</h3>
      <input class="input" id="communityTitle" placeholder="Post title" />
      <textarea id="communityBody" placeholder="Write your post..."></textarea>
      <button class="btn btn-primary" id="postCommunityBtn">${icon.upload} Post</button>
    </div>
    <div class="card">
      <h3>${icon.users} Recent posts</h3>
      ${posts.length ? posts.map(post => `
        <div class="post-item">
          <strong>${escapeHtml(post.title)}</strong>
          <div class="meta">${escapeHtml(post.author || 'Anonymous')} · ${new Date(post.created_at || Date.now()).toLocaleString()}</div>
          <p>${escapeHtml(post.body)}</p>
        </div>`).join('') : '<div class="empty">No community posts yet.</div>'}
    </div>`;
  $('postCommunityBtn').onclick = postCommunity;
}

function renderProfile() {
  const totalTopics = Object.values(notesSeed).reduce((sum, arr) => sum + arr.length, 0);
  const completed = state.done.length;
  const badgeData = [
    { label: 'XP', value: state.xp },
    { label: 'Done', value: completed },
    { label: 'Saved', value: state.bookmarks.length },
    { label: 'Queue', value: state.queue.length }
  ];
  $('profileTab').innerHTML = `
    <div class="card">
      <h2>${escapeHtml(state.profile.name || 'Student')}</h2>
      <div class="meta">${escapeHtml(state.profile.grade || '')} · ${escapeHtml(state.profile.school || '')}</div>
      <p>${escapeHtml(state.profile.bio || '')}</p>
    </div>
    <div class="card">
      <h3>${icon.star} Progress</h3>
      <div class="badge-grid">
        ${badgeData.map(item => `<div class="badge"><strong>${item.value}</strong><div class="meta">${item.label}</div></div>`).join('')}
        <div class="badge"><strong>${totalTopics ? Math.round((completed / totalTopics) * 100) : 0}%</strong><div class="meta">Complete</div></div>
      </div>
    </div>
    <div class="card">
      <h3>Edit profile</h3>
      <input class="input" id="profileName" value="${escapeHtml(state.profile.name || '')}" placeholder="Name" />
      <input class="input" id="profileSchool" value="${escapeHtml(state.profile.school || '')}" placeholder="School" />
      <input class="input" id="profileGrade" value="${escapeHtml(state.profile.grade || '')}" placeholder="Grade" />
      <textarea id="profileBio" placeholder="Short bio">${escapeHtml(state.profile.bio || '')}</textarea>
      <button class="btn btn-primary" id="saveProfileBtn">Save Profile</button>
    </div>`;
  $('saveProfileBtn').onclick = () => {
    state.profile = {
      name: $('profileName').value.trim() || 'Student',
      school: $('profileSchool').value.trim(),
      grade: $('profileGrade').value.trim(),
      bio: $('profileBio').value.trim()
    };
    saveState();
    toast('Profile saved');
    renderProfile();
  };
}

async function postNote() {
  const title = $('noteTitle').value.trim();
  const body = $('noteBody').value.trim();
  if (!title || !body) return toast('Enter a title and note body');
  const payload = {
    title, body,
    level: state.currentLevel,
    subject: state.currentSubject,
    author: state.profile.name || 'Student'
  };
  try {
    await supabase('notes', { method: 'POST', headers: getHeaders(), body: JSON.stringify(payload) });
    toast('Note posted');
  } catch {
    queueInsert('notes', payload);
    toast('Offline or backend not ready. Note queued.');
  }
  $('noteTitle').value = '';
  $('noteBody').value = '';
  renderLearn();
}

async function postUpdate() {
  const title = $('updateTitle').value.trim();
  const body = $('updateBody').value.trim();
  if (!title || !body) return toast('Enter update title and body');
  const payload = { title, body, category: 'General', author: state.profile.name || 'Admin' };
  try {
    await supabase('updates', { method: 'POST', headers: getHeaders(), body: JSON.stringify(payload) });
    toast('Update posted');
  } catch {
    queueInsert('updates', payload);
    toast('Update queued for sync');
  }
  $('updateTitle').value = '';
  $('updateBody').value = '';
  renderUpdates();
}

async function postPaper() {
  const title = $('paperTitle').value.trim();
  const year = Number($('paperYear').value.trim());
  const url = $('paperUrl').value.trim();
  if (!title || !year) return toast('Enter paper title and year');
  const payload = {
    title,
    year,
    url,
    level: state.currentLevel,
    subject: state.currentSubject,
    code: activeSubjectMeta().code,
    paper_type: 'Question'
  };
  try {
    await supabase('past_papers', { method: 'POST', headers: getHeaders(), body: JSON.stringify(payload) });
    toast('Past paper posted');
  } catch {
    queueInsert('past_papers', payload);
    toast('Past paper queued for sync');
  }
  $('paperTitle').value = '';
  $('paperYear').value = '';
  $('paperUrl').value = '';
  renderPapers();
}

async function postCommunity() {
  const title = $('communityTitle').value.trim();
  const body = $('communityBody').value.trim();
  if (!title || !body) return toast('Enter community title and message');
  const payload = { title, body, author: state.profile.name || 'Student' };
  try {
    await supabase('community_posts', { method: 'POST', headers: getHeaders(), body: JSON.stringify(payload) });
    toast('Community post published');
  } catch {
    queueInsert('community_posts', payload);
    toast('Community post queued');
  }
  $('communityTitle').value = '';
  $('communityBody').value = '';
  renderCommunity();
}

function getSearchPool() {
  const notesCache = Object.keys(localStorage).filter(key => key.startsWith('notes_cache_')).flatMap(key => cacheGet(key, []));
  const papersCache = Object.keys(localStorage).filter(key => key.startsWith('papers_cache_')).flatMap(key => cacheGet(key, []));
  return [
    ...notesCache.map(x => ({ section: 'Notes', title: x.title, body: x.body || x.subject || '' })),
    ...cacheGet('updates_cache', []).map(x => ({ section: 'Updates', title: x.title, body: x.body })),
    ...cacheGet('community_cache', []).map(x => ({ section: 'Community', title: x.title, body: x.body })),
    ...papersCache.map(x => ({ section: 'Past papers', title: x.title, body: `${x.subject || ''} ${x.year || ''}` })),
    ...Object.entries(notesSeed).flatMap(([section, items]) => items.map(item => ({ section, title: item.title, body: item.body }))),
    ...updatesSeed.map(item => ({ section: 'Updates', title: item.title, body: item.body }))
  ];
}

function bindSearch() {
  const overlay = $('searchOverlay');
  $('searchBtn').innerHTML = icon.search;
  $('searchBtn').onclick = () => { overlay.hidden = false; $('searchInput').focus(); };
  $('closeSearchBtn').onclick = () => { overlay.hidden = true; $('searchInput').value = ''; $('searchResults').innerHTML = ''; };
  overlay.onclick = event => {
    if (event.target === overlay) $('closeSearchBtn').click();
  };
  $('searchInput').oninput = event => {
    const q = event.target.value.trim().toLowerCase();
    const matches = !q ? [] : getSearchPool().filter(item => `${item.title} ${item.body}`.toLowerCase().includes(q)).slice(0, 20);
    $('searchResults').innerHTML = matches.length
      ? matches.map(match => `<div class="post-item"><strong>${escapeHtml(match.title)}</strong><div class="meta">${escapeHtml(match.section)}</div><p>${escapeHtml(match.body)}</p></div>`).join('')
      : '<div class="empty">No results found.</div>';
  };
}

function renderActiveTab() {
  const active = document.querySelector('.nav-item.active').dataset.tab;
  if (active === 'learnTab') renderLearn();
  if (active === 'papersTab') renderPapers();
  if (active === 'updatesTab') renderUpdates();
  if (active === 'communityTab') renderCommunity();
  if (active === 'profileTab') renderProfile();
}

function bindTabs() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(tab => tab.classList.remove('active'));
      btn.classList.add('active');
      $(btn.dataset.tab).classList.add('active');
      renderActiveTab();
    };
  });
}

async function init() {
  renderLevelStrip();
  renderSubjectStrip();
  bindTabs();
  bindSearch();
  updateSyncBadge();
  window.addEventListener('online', async () => { updateSyncBadge(); await flushQueue(); toast('Back online'); renderActiveTab(); });
  window.addEventListener('offline', () => { updateSyncBadge(); toast('Offline mode enabled'); });
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  await renderLearn();
  flushQueue();
}

init();
