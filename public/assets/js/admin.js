/**
 * admin.js — TypingCenterNear.me
 * Admin SPA: auth, dashboard, CRUD, WYSIWYG editor, AI generator, import, SEO, sitemap
 * ~800 lines — no external dependencies
 */

// ── STATE ────────────────────────────────────────────────────
const State = {
  currentModule: 'dashboard',
  centers: [],
  posts: [],
  editingCenter: null,
  editingPost: null,
  centersPage: 1,
  postsPage: 1,
  aiWorking: false,
  editorMode: 'visual' // 'visual' | 'html'
};

const PAGE_SIZE = 20;

// ── ROUTER ───────────────────────────────────────────────────
function navigate(module) {
  State.currentModule = module;
  document.querySelectorAll('.module-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-nav__item').forEach(b => b.classList.remove('active'));

  const page = document.getElementById(`page-${module}`);
  if (page) page.classList.add('active');

  const navItem = document.querySelector(`.sidebar-nav__item[data-module="${module}"]`);
  if (navItem) navItem.classList.add('active');

  const title = document.getElementById('header-title');
  const titles = {
    dashboard: '📊 Dashboard',
    centers:   '🏢 Typing Centers',
    blog:      '📝 Blog & Articles',
    ai:        '🤖 AI Generator',
    import:    '📥 Import Data',
    seo:       '🔍 SEO Manager',
    sitemap:   '🗺️ Sitemap',
    settings:  '⚙️ Settings'
  };
  if (title) title.textContent = titles[module] || module;

  window.location.hash = module;
  loadModule(module);
}

function loadModule(module) {
  switch (module) {
    case 'dashboard': loadDashboard(); break;
    case 'centers':   loadCentersTable(); break;
    case 'blog':      loadBlogTable(); break;
    case 'ai':        initAiPanel(); break;
    case 'seo':       loadSeoAudit(); break;
    case 'settings':  loadSettings(); break;
  }
}

// ── AUTH ─────────────────────────────────────────────────────
function checkAuth() {
  const session = SupabaseClient.getSession();
  if (!session) {
    showLogin();
    return false;
  }
  const emailEl = document.getElementById('user-email');
  if (emailEl) emailEl.textContent = session.user?.email || 'Admin';
  return true;
}

function showLogin() {
  document.getElementById('admin-app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
}

function showApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('admin-app').style.display = 'flex';
}

async function handleLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const btn      = document.getElementById('login-btn');
  const errEl    = document.getElementById('login-error');

  btn.disabled = true;
  btn.textContent = 'Signing in…';
  errEl.style.display = 'none';

  const { session, error } = await SupabaseClient.signIn(email, password);

  if (error || !session) {
    errEl.textContent = 'Invalid email or password.';
    errEl.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Sign In';
    return;
  }

  showApp();
  navigate(window.location.hash.replace('#', '') || 'dashboard');
}

async function handleLogout() {
  await SupabaseClient.signOut();
  showLogin();
}

// ── DASHBOARD ─────────────────────────────────────────────────
async function loadDashboard() {
  const [centers, posts] = await Promise.all([
    SupabaseClient.from('typing_centers').select('id,emirate,is_published,is_featured'),
    SupabaseClient.from('blog_posts').select('id,is_published')
  ]);

  const cd = centers.data || [];
  const pd = posts.data   || [];

  setStat('stat-total',     cd.length);
  setStat('stat-published', cd.filter(c => c.is_published).length);
  setStat('stat-featured',  cd.filter(c => c.is_featured).length);
  setStat('stat-posts',     pd.filter(p => p.is_published).length);

  // Emirate distribution
  const dist = {};
  cd.forEach(c => { dist[c.emirate] = (dist[c.emirate] || 0) + 1; });
  const distEl = document.getElementById('emirate-dist');
  if (distEl) {
    const max = Math.max(...Object.values(dist), 1);
    distEl.innerHTML = Object.entries(dist).sort((a,b) => b[1]-a[1]).map(([em, n]) => `
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:4px">
          <span>${slugToTitle(em)}</span><strong>${n}</strong>
        </div>
        <div style="height:6px;background:#e2e8f0;border-radius:99px;overflow:hidden">
          <div style="height:100%;width:${(n/max)*100}%;background:#0e7c6b;border-radius:99px"></div>
        </div>
      </div>`).join('');
  }
}

function setStat(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ── CENTERS TABLE ─────────────────────────────────────────────
async function loadCentersTable(search = '', emirate = '') {
  const tbody = document.getElementById('centers-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:#6b7280">Loading…</td></tr>';

  const from = (State.centersPage - 1) * PAGE_SIZE;
  let q = SupabaseClient.from('typing_centers')
    .select('id,slug,name,emirate,area,rating,review_count,is_published,is_featured,services')
    .order('is_featured', { ascending: false })
    .order('name', { ascending: true })
    .range(from, from + PAGE_SIZE - 1);

  if (search)  q = q.ilike('name', `%${search}%`);
  if (emirate) q = q.eq('emirate', emirate);

  const { data } = await q;
  State.centers = data || [];

  tbody.innerHTML = (data || []).map(c => `
    <tr>
      <td>
        <a href="/typing-center-${c.emirate}/${c.slug}/" target="_blank" style="font-weight:600;color:#0e7c6b">${c.name}</a>
        <div style="font-size:0.75rem;color:#94a3b8">${c.slug}</div>
      </td>
      <td><span class="badge badge--blue">${slugToTitle(c.emirate)}</span></td>
      <td style="font-size:0.875rem">${c.area || '—'}</td>
      <td><span style="color:#f59e0b">★</span> ${parseFloat(c.rating||0).toFixed(1)} <small style="color:#94a3b8">(${c.review_count||0})</small></td>
      <td>
        <label style="cursor:pointer;display:flex;align-items:center;gap:6px">
          <input type="checkbox" ${c.is_published ? 'checked' : ''} onchange="togglePublished('${c.id}', this.checked)">
          <span class="badge ${c.is_published ? 'badge--green' : 'badge--red'}">${c.is_published ? 'Live' : 'Draft'}</span>
        </label>
      </td>
      <td>
        <label style="cursor:pointer;display:flex;align-items:center;gap:6px">
          <input type="checkbox" ${c.is_featured ? 'checked' : ''} onchange="toggleFeatured('${c.id}', this.checked)">
          <span style="font-size:0.8rem">${c.is_featured ? '⭐' : '—'}</span>
        </label>
      </td>
      <td>
        <div class="table-actions">
          <button class="adm-btn adm-btn--outline adm-btn--sm" onclick="editCenter('${c.id}')">✏️ Edit</button>
          <button class="adm-btn adm-btn--ghost adm-btn--sm" onclick="generateCenterDesc('${c.id}')">🤖</button>
          <button class="adm-btn adm-btn--danger adm-btn--sm" onclick="deleteCenter('${c.id}', '${c.name.replace(/'/g,"\\'")}')">🗑️</button>
        </div>
      </td>
    </tr>`).join('') || '<tr><td colspan="7" style="text-align:center;padding:40px;color:#6b7280">No centers found.</td></tr>';
}

async function togglePublished(id, val) {
  await SupabaseClient.update('typing_centers', { is_published: val }, { id });
  toast(`Center ${val ? 'published' : 'unpublished'}`, 'success');
}

async function toggleFeatured(id, val) {
  await SupabaseClient.update('typing_centers', { is_featured: val }, { id });
  toast(`Featured ${val ? 'enabled' : 'disabled'}`, 'success');
}

async function deleteCenter(id, name) {
  if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
  const { error } = await SupabaseClient.delete('typing_centers', { id });
  if (error) { toast('Delete failed', 'error'); return; }
  toast('Center deleted', 'success');
  loadCentersTable();
}

function editCenter(id) {
  const c = State.centers.find(c => c.id === id);
  if (!c) { loadFullCenter(id); return; }
  openCenterModal(c);
}

async function loadFullCenter(id) {
  const { data } = await SupabaseClient.from('typing_centers').select('*').eq('id', id).single();
  if (data) openCenterModal(data.data || data);
}

function openCenterModal(c = null) {
  State.editingCenter = c;
  const isNew  = !c;
  const modal  = document.getElementById('center-modal');
  const titleEl = document.getElementById('center-modal-title');

  if (titleEl) titleEl.textContent = isNew ? 'Add Typing Center' : 'Edit Typing Center';

  const fields = ['slug','name','emirate','address','phone','whatsapp','email','website','lat','lng','area','price_range','description','meta_title','meta_description'];
  fields.forEach(f => {
    const el = document.getElementById(`cf-${f}`);
    if (el) el.value = c ? (c[f] || '') : '';
  });

  if (c) {
    const services = document.getElementById('cf-services');
    if (services) services.value = (c.services || []).join(', ');
    const published = document.getElementById('cf-published');
    if (published) published.checked = c.is_published !== false;
    const featured = document.getElementById('cf-featured');
    if (featured) featured.checked = !!c.is_featured;
  }

  modal.style.display = 'flex';
}

async function saveCenterModal() {
  const c = State.editingCenter;
  const fields = ['slug','name','emirate','address','phone','whatsapp','email','website','area','price_range','description','meta_title','meta_description'];
  const row = {};
  fields.forEach(f => {
    const el = document.getElementById(`cf-${f}`);
    if (el) row[f] = el.value.trim() || null;
  });
  ['lat','lng'].forEach(f => {
    const el = document.getElementById(`cf-${f}`);
    if (el && el.value) row[f] = parseFloat(el.value);
  });
  const svcEl = document.getElementById('cf-services');
  row.services = svcEl ? svcEl.value.split(',').map(s => s.trim()).filter(Boolean) : [];
  const pubEl = document.getElementById('cf-published');
  row.is_published = pubEl ? pubEl.checked : true;
  const featEl = document.getElementById('cf-featured');
  row.is_featured = featEl ? featEl.checked : false;

  if (!row.name || !row.emirate || !row.slug) {
    toast('Name, emirate and slug are required.', 'error'); return;
  }

  const { error } = c
    ? await SupabaseClient.update('typing_centers', row, { id: c.id })
    : await SupabaseClient.insert('typing_centers', row);

  if (error) { toast('Save failed: ' + JSON.stringify(error), 'error'); return; }
  toast(c ? 'Center updated' : 'Center created', 'success');
  closeModal('center-modal');
  loadCentersTable();
}

// ── BLOG TABLE ────────────────────────────────────────────────
async function loadBlogTable() {
  const tbody = document.getElementById('blog-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:40px;color:#6b7280">Loading…</td></tr>';

  const { data } = await SupabaseClient.from('blog_posts')
    .select('id,slug,title,is_published,ai_generated,published_at,created_at')
    .order('created_at', { ascending: false })
    .range(0, 49);

  State.posts = data || [];

  tbody.innerHTML = (data || []).map(p => `
    <tr>
      <td>
        <a href="/${p.slug}/" target="_blank" style="font-weight:600;color:#0e7c6b">${p.title}</a>
        <div style="font-size:0.75rem;color:#94a3b8">${p.slug}</div>
      </td>
      <td><span class="badge ${p.is_published ? 'badge--green' : 'badge--amber'}">${p.is_published ? 'Published' : 'Draft'}</span></td>
      <td>${p.ai_generated ? '<span class="badge badge--blue">🤖 AI</span>' : '<span class="badge badge--gray">Manual</span>'}</td>
      <td style="font-size:0.8rem;color:#64748b">${formatDate(p.published_at || p.created_at)}</td>
      <td>
        <div class="table-actions">
          <button class="adm-btn adm-btn--outline adm-btn--sm" onclick="editPost('${p.id}')">✏️ Edit</button>
          <button class="adm-btn adm-btn--danger adm-btn--sm" onclick="deletePost('${p.id}', '${p.title.replace(/'/g,"\\'")}')">🗑️</button>
        </div>
      </td>
    </tr>`).join('') || '<tr><td colspan="5" style="text-align:center;padding:40px">No posts yet.</td></tr>';
}

async function editPost(id) {
  const { data } = await SupabaseClient.from('blog_posts').select('*').eq('id', id).limit(1);
  const post = data && data[0];
  if (post) openPostModal(post);
}

async function deletePost(id, title) {
  if (!confirm(`Delete "${title}"?`)) return;
  const { error } = await SupabaseClient.delete('blog_posts', { id });
  if (error) { toast('Delete failed', 'error'); return; }
  toast('Post deleted', 'success');
  loadBlogTable();
}

function openPostModal(p = null) {
  State.editingPost = p;
  const modal = document.getElementById('post-modal');
  const titleEl = document.getElementById('post-modal-title');
  if (titleEl) titleEl.textContent = p ? 'Edit Article' : 'New Article';

  const fields = ['slug','title','excerpt','featured_image','meta_title','meta_description'];
  fields.forEach(f => {
    const el = document.getElementById(`pf-${f}`);
    if (el) el.value = p ? (p[f] || '') : '';
  });

  const pubEl = document.getElementById('pf-published');
  if (pubEl) pubEl.checked = p ? !!p.is_published : false;

  // Load content into editor
  const visual = document.getElementById('editor-visual');
  const html   = document.getElementById('editor-html');
  const content = p ? (p.content || '') : '';
  if (visual) visual.innerHTML = content;
  if (html)   html.value = content;

  // Auto-slug from title
  const pTitle = document.getElementById('pf-title');
  const pSlug  = document.getElementById('pf-slug');
  if (pTitle && pSlug) {
    pTitle.addEventListener('input', () => {
      if (!State.editingPost) {
        pSlug.value = pTitle.value.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim();
      }
    });
  }

  updateSnippetPreview();
  modal.style.display = 'flex';
}

async function savePost(publish = false) {
  const p = State.editingPost;
  const fields = ['slug','title','excerpt','featured_image','meta_title','meta_description'];
  const row = {};
  fields.forEach(f => {
    const el = document.getElementById(`pf-${f}`);
    if (el) row[f] = el.value.trim() || null;
  });

  // Get content from active editor mode
  const visual = document.getElementById('editor-visual');
  const html   = document.getElementById('editor-html');
  row.content = State.editorMode === 'html' ? html?.value : visual?.innerHTML;

  const pubEl = document.getElementById('pf-published');
  row.is_published = publish || (pubEl?.checked) || false;
  if (row.is_published && !p?.published_at) row.published_at = new Date().toISOString();

  if (!row.title || !row.slug) { toast('Title and slug are required', 'error'); return; }

  const { error } = p
    ? await SupabaseClient.update('blog_posts', row, { id: p.id })
    : await SupabaseClient.insert('blog_posts', row);

  if (error) { toast('Save failed', 'error'); return; }
  toast(publish ? 'Post published!' : 'Draft saved', 'success');
  closeModal('post-modal');
  loadBlogTable();
}

// ── WYSIWYG ──────────────────────────────────────────────────
function editorCmd(cmd, val = null) {
  const visual = document.getElementById('editor-visual');
  if (!visual) return;
  visual.focus();
  document.execCommand(cmd, false, val);
}

function toggleEditorMode() {
  const visual   = document.getElementById('editor-visual');
  const html     = document.getElementById('editor-html');
  const toggleBtn = document.getElementById('toggle-html-btn');
  if (!visual || !html) return;

  if (State.editorMode === 'visual') {
    html.value = visual.innerHTML;
    visual.classList.add('hidden');
    html.classList.add('visible');
    State.editorMode = 'html';
    if (toggleBtn) { toggleBtn.textContent = '< Visual'; toggleBtn.classList.add('active'); }
  } else {
    visual.innerHTML = html.value;
    html.classList.remove('visible');
    visual.classList.remove('hidden');
    State.editorMode = 'visual';
    if (toggleBtn) { toggleBtn.textContent = '<> HTML'; toggleBtn.classList.remove('active'); }
  }
}

function insertEditorImage() {
  const url = prompt('Image URL (Supabase Storage or external):');
  if (url) editorCmd('insertImage', url);
}

function insertEditorLink() {
  const url = prompt('Link URL:');
  if (url) editorCmd('createLink', url);
}

function updateSnippetPreview() {
  const title = document.getElementById('pf-meta_title')?.value || document.getElementById('pf-title')?.value || '';
  const desc  = document.getElementById('pf-meta_description')?.value || '';
  const slug  = document.getElementById('pf-slug')?.value || '';

  const previewTitle = document.getElementById('snippet-title');
  const previewDesc  = document.getElementById('snippet-desc');
  const previewUrl   = document.getElementById('snippet-url');

  if (previewTitle) previewTitle.textContent = title || 'Article title here…';
  if (previewDesc)  previewDesc.textContent  = desc  || 'Meta description here…';
  if (previewUrl)   previewUrl.textContent   = `typingcenternear.me/${slug || 'article-slug'}/`;
}

// ── AI GENERATOR ──────────────────────────────────────────────
function initAiPanel() {
  const provider = loadSetting('ai_provider') || 'claude';
  const model    = loadSetting('ai_model')    || 'claude-sonnet-4-20250514';
  const modeEl   = document.getElementById('ai-provider-display');
  if (modeEl) modeEl.textContent = `${provider} / ${model}`;
}

async function runAiGenerate() {
  if (State.aiWorking) return;

  const mode        = document.querySelector('.ai-mode-tab.active')?.dataset.mode || 'keyword';
  const keyword     = document.getElementById('ai-keyword')?.value?.trim() || '';
  const length      = document.getElementById('ai-length')?.value || '1200';
  const tone        = document.getElementById('ai-tone')?.value || 'informative-guide';
  const transcript  = document.getElementById('ai-transcript')?.value?.trim() || '';
  const notes       = document.getElementById('ai-notes')?.value?.trim() || '';
  const videoUrl    = document.getElementById('ai-video-url')?.value?.trim() || '';

  if (!keyword) { toast('Enter a keyword', 'error'); return; }

  const apiKey  = loadSetting('ai_api_key');
  if (!apiKey)  { toast('Set your AI API key in Settings first', 'error'); return; }

  const provider = loadSetting('ai_provider') || 'claude';
  const model    = loadSetting('ai_model')    || 'claude-sonnet-4-20250514';

  State.aiWorking = true;
  const resultEl = document.getElementById('ai-result');
  const genBtn   = document.getElementById('ai-gen-btn');
  if (genBtn) { genBtn.disabled = true; genBtn.textContent = '⏳ Generating…'; }
  if (resultEl) resultEl.innerHTML = '<div class="ai-thinking"><span>Generating</span><div class="ai-thinking-dots"><span></span><span></span><span></span></div></div>';

  const prompt = buildArticlePrompt({ keyword, length, tone, videoUrl, transcript, notes });

  try {
    let resultText = '';

    if (provider === 'claude') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model, max_tokens: 4096, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await res.json();
      resultText = data.content?.[0]?.text || JSON.stringify(data);
    } else {
      const endpoint = provider === 'openrouter' ? 'https://openrouter.ai/api/v1/chat/completions'
                     : provider === 'ollama'     ? 'http://localhost:11434/v1/chat/completions'
                     : 'https://api.openai.com/v1/chat/completions';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model, max_tokens: 4096, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await res.json();
      resultText = data.choices?.[0]?.message?.content || JSON.stringify(data);
    }

    // Parse JSON result
    let parsed = null;
    try {
      const match = resultText.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    } catch (_) {}

    if (parsed) {
      if (resultEl) resultEl.innerHTML = `
        <strong style="color:#0e7c6b">✅ Article generated successfully!</strong><br><br>
        <strong>Title:</strong> ${parsed.title || ''}<br>
        <strong>Slug:</strong> ${parsed.slug || ''}<br>
        <strong>Meta title:</strong> ${parsed.meta_title || ''}<br>
        <strong>Meta desc:</strong> ${parsed.meta_description || ''}<br><br>
        <button class="adm-btn adm-btn--primary" onclick="openPostFromAI(${JSON.stringify(parsed).replace(/"/g,'&quot;')})">📝 Open in Editor</button>`;
    } else {
      if (resultEl) resultEl.textContent = resultText;
    }

    // Log to ai_log
    SupabaseClient.insert('ai_log', {
      entity_type: 'blog',
      provider, model,
      prompt_used: prompt.slice(0, 500)
    });

  } catch (err) {
    if (resultEl) resultEl.textContent = 'Error: ' + err.message;
    toast('AI generation failed', 'error');
  } finally {
    State.aiWorking = false;
    if (genBtn) { genBtn.disabled = false; genBtn.textContent = '🚀 Generate'; }
  }
}

function openPostFromAI(parsed) {
  closeModal('any');
  navigate('blog');
  setTimeout(() => {
    openPostModal(null);
    setTimeout(() => {
      const fields = { title: parsed.title, slug: parsed.slug, excerpt: parsed.excerpt, meta_title: parsed.meta_title, meta_description: parsed.meta_description };
      Object.entries(fields).forEach(([k, v]) => {
        const el = document.getElementById(`pf-${k}`);
        if (el && v) el.value = v;
      });
      const visual = document.getElementById('editor-visual');
      if (visual && parsed.content) visual.innerHTML = parsed.content;
      const htmlEl = document.getElementById('editor-html');
      if (htmlEl && parsed.content) htmlEl.value = parsed.content;
    }, 100);
  }, 300);
}

async function generateCenterDesc(centerId) {
  const { data } = await SupabaseClient.from('typing_centers').select('name,emirate,area,services').eq('id', centerId).limit(1);
  const c = data && data[0];
  if (!c) return;

  const apiKey  = loadSetting('ai_api_key');
  if (!apiKey)  { toast('Set AI API key in Settings', 'error'); return; }

  const provider = loadSetting('ai_provider') || 'claude';
  const model    = loadSetting('ai_model') || 'claude-sonnet-4-20250514';

  const prompt = `Write a professional 200-250 word description for a typing center business in the UAE.
Center name: ${c.name}
Location: ${c.area || c.emirate}, UAE
Services: ${(c.services || []).map(serviceLabel).join(', ')}

Return ONLY valid JSON (no markdown):
{
  "description": "200-250 word description...",
  "meta_title": "max 60 chars",
  "meta_description": "max 155 chars"
}`;

  toast('Generating description…', 'info');

  try {
    let text = '';
    if (provider === 'claude') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model, max_tokens: 800, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await res.json();
      text = data.content?.[0]?.text || '';
    } else {
      const endpoint = provider === 'openai' ? 'https://api.openai.com/v1/chat/completions' : 'https://openrouter.ai/api/v1/chat/completions';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model, max_tokens: 800, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await res.json();
      text = data.choices?.[0]?.message?.content || '';
    }

    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      await SupabaseClient.update('typing_centers', {
        description: parsed.description,
        meta_title: parsed.meta_title,
        meta_description: parsed.meta_description,
        ai_generated: true
      }, { id: centerId });
      toast('Description generated and saved!', 'success');
      loadCentersTable();
    }
  } catch (err) {
    toast('AI error: ' + err.message, 'error');
  }
}

function buildArticlePrompt({ keyword, length, tone, videoUrl, transcript, notes }) {
  return `You are an expert SEO writer for UAE government services and expat guides.
Write a complete, optimized article for the UAE audience.

TARGET KEYWORD: "${keyword}"
APPROXIMATE LENGTH: ~${length} words
TONE: ${tone} (informative-guide | conversational | step-by-step)
${videoUrl    ? `\nREFERENCE VIDEO: ${videoUrl}`                                   : ''}
${transcript  ? `\nBASE YOUR ARTICLE ON THIS TRANSCRIPT:\n${transcript.slice(0,4000)}` : ''}
${notes       ? `\nADDITIONAL NOTES:\n${notes}`                                    : ''}

REQUIREMENTS:
- Include keyword naturally in: title, first paragraph, 2-3 H2 headings, conclusion
- Use H2 and H3 subheadings (never H1 in content)
- Include practical step-by-step sections where relevant
- Reference official UAE portals: ICA, GDRFA, MOHRE, DHA where appropriate
- End with a call-to-action to find a typing center near them

Return ONLY valid JSON (no markdown, no backticks):
{
  "title": "Article title with keyword",
  "slug": "url-friendly-hyphenated-slug",
  "meta_title": "Max 60 chars — include keyword + UAE",
  "meta_description": "Max 155 chars — compelling, includes keyword",
  "excerpt": "2-3 sentence summary for listing pages",
  "content": "<h2>Section</h2><p>Text...</p>"
}`;
}

// ── SEO AUDIT ─────────────────────────────────────────────────
async function loadSeoAudit() {
  const el = document.getElementById('seo-issues');
  if (!el) return;
  el.innerHTML = '<p style="color:#6b7280">Running SEO audit…</p>';

  const { data: centers } = await SupabaseClient.from('typing_centers').select('id,name,slug,emirate,meta_title,meta_description,description').eq('is_published', 'true');
  const { data: posts }   = await SupabaseClient.from('blog_posts').select('id,title,slug,meta_title,meta_description').eq('is_published', 'true');

  const issues = [];

  (centers || []).forEach(c => {
    if (!c.meta_title)        issues.push({ type: 'center', name: c.name, issue: 'Missing meta title',       url: `/typing-center-${c.emirate}/${c.slug}/` });
    if (!c.meta_description)  issues.push({ type: 'center', name: c.name, issue: 'Missing meta description', url: `/typing-center-${c.emirate}/${c.slug}/` });
    if (!c.description)       issues.push({ type: 'center', name: c.name, issue: 'Missing description',      url: `/typing-center-${c.emirate}/${c.slug}/` });
    if (c.meta_title && c.meta_title.length > 60)  issues.push({ type: 'center', name: c.name, issue: `Meta title too long (${c.meta_title.length} chars)`, url: `/typing-center-${c.emirate}/${c.slug}/` });
    if (c.meta_description && c.meta_description.length > 155) issues.push({ type: 'center', name: c.name, issue: `Meta description too long (${c.meta_description.length} chars)`, url: `/typing-center-${c.emirate}/${c.slug}/` });
  });

  (posts || []).forEach(p => {
    if (!p.meta_title)       issues.push({ type: 'post', name: p.title, issue: 'Missing meta title',       url: `/${p.slug}/` });
    if (!p.meta_description) issues.push({ type: 'post', name: p.title, issue: 'Missing meta description', url: `/${p.slug}/` });
  });

  if (!issues.length) {
    el.innerHTML = '<div style="color:#22c55e;font-size:1.1rem;padding:20px">✅ No SEO issues found! All pages look good.</div>';
    return;
  }

  el.innerHTML = `<p style="margin-bottom:12px;color:#64748b">${issues.length} issue${issues.length > 1 ? 's' : ''} found:</p>` +
    issues.map(i => `
      <div style="display:flex;align-items:start;gap:12px;padding:10px;border:1px solid #fde68a;border-radius:8px;background:#fffbeb;margin-bottom:8px">
        <span style="font-size:1rem">⚠️</span>
        <div>
          <strong style="font-size:0.875rem">${i.name}</strong>
          <div style="font-size:0.8rem;color:#92400e">${i.issue}</div>
          <a href="${i.url}" target="_blank" style="font-size:0.75rem;color:#3b82f6">${i.url}</a>
        </div>
      </div>`).join('');
}

// ── IMPORT ────────────────────────────────────────────────────
function initImport() {
  const dropzone = document.getElementById('import-dropzone');
  const fileInput = document.getElementById('import-file');

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('dragover'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) processImportFile(file);
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) processImportFile(file);
  });
}

async function processImportFile(file) {
  const text = await file.text();
  let rows = [];

  if (file.name.endsWith('.csv')) {
    rows = parseCSV(text);
  } else if (file.name.endsWith('.json')) {
    try { rows = JSON.parse(text); } catch (_) { toast('Invalid JSON', 'error'); return; }
  }

  if (!rows.length) { toast('No data found in file', 'error'); return; }

  // Preview
  const preview = document.getElementById('import-preview');
  if (preview) {
    preview.innerHTML = `<p><strong>${rows.length} rows</strong> detected. Preview (first 5):</p>
      <div style="overflow-x:auto;margin-top:8px">
        <table class="data-table">
          <thead><tr>${Object.keys(rows[0]).slice(0,6).map(k => `<th>${k}</th>`).join('')}</tr></thead>
          <tbody>${rows.slice(0,5).map(r =>
            `<tr>${Object.values(r).slice(0,6).map(v => `<td>${v||''}</td>`).join('')}</tr>`
          ).join('')}</tbody>
        </table>
      </div>
      <button class="adm-btn adm-btn--primary" style="margin-top:12px" onclick="confirmImport(${JSON.stringify(rows).replace(/"/g,'&quot;')})">
        ✅ Import ${rows.length} rows
      </button>`;
  }
}

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const row = {};
    headers.forEach((h, i) => { row[h] = vals[i] || ''; });
    return row;
  }).filter(r => r.name && r.slug);
}

async function confirmImport(rows) {
  const bar    = document.getElementById('import-progress');
  const countEl = document.getElementById('import-count');
  if (bar) bar.style.display = 'block';

  let done = 0;
  const BATCH = 50;

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH).map(r => ({
      ...r,
      services:    r.services ? r.services.split(',').map(s => s.trim()) : [],
      lat:         r.lat ? parseFloat(r.lat) : null,
      lng:         r.lng ? parseFloat(r.lng) : null,
      rating:      r.rating ? parseFloat(r.rating) : 0,
      review_count:r.review_count ? parseInt(r.review_count) : 0,
      is_published: true,
      import_source: 'csv'
    }));

    await SupabaseClient.insert('typing_centers', batch, { upsert: true });
    done += batch.length;
    const pct = Math.round((done / rows.length) * 100);
    const fill = document.getElementById('import-progress-fill');
    if (fill) fill.style.width = pct + '%';
    if (countEl) countEl.textContent = `${done} / ${rows.length}`;
  }

  toast(`Imported ${done} typing centers!`, 'success');
}

// ── SITEMAP ────────────────────────────────────────────────────
async function generateSitemap() {
  const btn = document.getElementById('gen-sitemap-btn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Generating…'; }

  const [centers, posts] = await Promise.all([
    SupabaseClient.from('typing_centers').select('slug,emirate,updated_at').eq('is_published', 'true'),
    SupabaseClient.from('blog_posts').select('slug,updated_at').eq('is_published', 'true')
  ]);

  const EMIRATE_LIST = ['dubai','abu-dhabi','sharjah','ajman','ras-al-khaimah','fujairah','umm-al-quwain'];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Homepage
  xml += `  <url><loc>https://typingcenternear.me/</loc><priority>1.0</priority><changefreq>daily</changefreq></url>\n`;

  // Cities
  EMIRATE_LIST.forEach(em => {
    xml += `  <url><loc>https://typingcenternear.me/typing-center-${em}/</loc><priority>0.9</priority><changefreq>daily</changefreq></url>\n`;
  });

  // Centers
  (centers.data || []).forEach(c => {
    const lastmod = c.updated_at ? c.updated_at.split('T')[0] : '';
    xml += `  <url><loc>https://typingcenternear.me/typing-center-${c.emirate}/${c.slug}/</loc><lastmod>${lastmod}</lastmod><priority>0.8</priority><changefreq>weekly</changefreq></url>\n`;
  });

  // Blog
  xml += `  <url><loc>https://typingcenternear.me/blog/</loc><priority>0.7</priority><changefreq>daily</changefreq></url>\n`;
  (posts.data || []).forEach(p => {
    const lastmod = p.updated_at ? p.updated_at.split('T')[0] : '';
    const slug = p.slug.startsWith('/') ? p.slug.slice(1) : p.slug;
    xml += `  <url><loc>https://typingcenternear.me/${slug}/</loc><lastmod>${lastmod}</lastmod><priority>0.7</priority><changefreq>monthly</changefreq></url>\n`;
  });

  xml += `</urlset>`;

  const el = document.getElementById('sitemap-preview');
  if (el) el.textContent = xml.slice(0, 1200) + (xml.length > 1200 ? '\n…' : '');

  // Download
  const blob = new Blob([xml], { type: 'application/xml' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = 'sitemap.xml';
  a.click();

  toast('Sitemap downloaded! Upload it to /public/sitemap.xml', 'success');
  if (btn) { btn.disabled = false; btn.textContent = '🗺️ Generate Sitemap'; }
}

// ── SETTINGS ──────────────────────────────────────────────────
function loadSettings() {
  const keys = ['supabase_url','supabase_anon_key','ai_api_key','ai_provider','ai_model','site_url'];
  keys.forEach(k => {
    const el = document.getElementById(`setting-${k}`);
    if (el) el.value = loadSetting(k) || '';
  });
}

function saveSettings() {
  const keys = ['supabase_url','supabase_anon_key','ai_api_key','ai_provider','ai_model','site_url'];
  keys.forEach(k => {
    const el = document.getElementById(`setting-${k}`);
    if (el) localStorage.setItem(`tcn_${k}`, el.value.trim());
  });

  // Re-init Supabase with new credentials
  const url = loadSetting('supabase_url');
  const key = loadSetting('supabase_anon_key');
  if (url && key) SupabaseClient.init(url, key);

  toast('Settings saved!', 'success');
}

function loadSetting(key) {
  return localStorage.getItem(`tcn_${key}`) || '';
}

// ── MODAL HELPERS ─────────────────────────────────────────────
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'flex';
}

function closeModal(id) {
  if (id === 'any') {
    document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
    return;
  }
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

// Close modal on backdrop click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.style.display = 'none';
  }
});

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Init Supabase from settings
  const url = loadSetting('supabase_url') || window.SUPABASE_URL || '';
  const key = loadSetting('supabase_anon_key') || window.SUPABASE_ANON_KEY || '';
  if (url && key) SupabaseClient.init(url, key);

  if (!checkAuth()) return;
  showApp();

  // Sidebar navigation
  document.querySelectorAll('.sidebar-nav__item[data-module]').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.module));
  });

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', handleLogout);

  // Login form
  document.getElementById('login-form')?.addEventListener('submit', handleLogin);

  // Initial module
  const hash = window.location.hash.replace('#', '');
  navigate(hash || 'dashboard');

  // Import
  initImport();

  // Centers search
  const centerSearch = document.getElementById('center-search');
  if (centerSearch) {
    centerSearch.addEventListener('input', debounce(e => {
      const emirate = document.getElementById('center-emirate-filter')?.value || '';
      loadCentersTable(e.target.value, emirate);
    }, 400));
  }

  const emirateFilter = document.getElementById('center-emirate-filter');
  if (emirateFilter) {
    emirateFilter.addEventListener('change', e => {
      const search = document.getElementById('center-search')?.value || '';
      loadCentersTable(search, e.target.value);
    });
  }

  // AI mode tabs
  document.querySelectorAll('.ai-mode-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ai-mode-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // SEO snippet live preview
  ['pf-meta_title','pf-meta_description','pf-slug'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateSnippetPreview);
  });
});
