/**
 * main.js — TypingCenterNear.me
 * Homepage logic + shared utilities
 */

// ── UTILITIES ───────────────────────────────────────────────

function starsHTML(rating) {
  const r = parseFloat(rating) || 0;
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (r >= i)        html += '★';
    else if (r >= i - 0.5) html += '½';
    else               html += '☆';
  }
  return html;
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' });
}

function slugToTitle(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function toast(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.innerHTML = `<span>${msg}</span>`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

function debounce(fn, ms = 300) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

function serviceLabel(key) {
  const map = {
    'emirates-id':    'Emirates ID',
    'visa':           'Visa',
    'ejari':          'Ejari',
    'dha-medical':    'DHA Medical',
    'dha':            'DHA',
    'tasheel':        'Tasheel',
    'labour':         'Labour',
    'adha':           'ADHA',
    'mohre':          'MOHRE',
    'immigration':    'Immigration',
    'typing':         'Typing',
    'translation':    'Translation',
    'notary':         'Notary'
  };
  return map[key] || key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function centerCardHTML(c) {
  const imgHtml = c.photos && c.photos[0]
    ? `<img src="${c.photos[0]}" alt="${c.name}" class="center-card__img" loading="lazy" width="300" height="180">`
    : `<div class="center-card__img-placeholder">🖨️</div>`;

  const services = (c.services || []).slice(0, 4).map(s =>
    `<span class="tag tag--primary">${serviceLabel(s)}</span>`
  ).join('');

  const rating = parseFloat(c.rating) || 0;
  const slug = `/typing-center-${c.emirate}/${c.slug}/`;

  return `
    <article class="center-card">
      <a href="${slug}">
        ${imgHtml}
      </a>
      <div class="center-card__body">
        <h3 class="center-card__name">
          <a href="${slug}">${c.name}</a>
        </h3>
        <p class="center-card__area">📍 ${c.area || c.emirate}</p>
        <div class="center-card__rating">
          <span class="stars">${starsHTML(rating)}</span>
          <span class="center-card__rating-score">${rating.toFixed(1)}</span>
          <span class="center-card__rating-count">(${c.review_count || 0})</span>
        </div>
        <div class="center-card__services">${services}</div>
        <div class="center-card__footer">
          ${c.is_featured ? '<span class="badge-featured">⭐ Top Rated</span>' : '<span></span>'}
          <a href="${slug}" class="btn btn--primary btn--sm">View →</a>
        </div>
      </div>
    </article>`;
}

function blogCardHTML(p) {
  const imgHtml = p.featured_image
    ? `<img src="${p.featured_image}" alt="${p.title}" class="blog-card__img" loading="lazy" width="280" height="160">`
    : `<div class="blog-card__img-placeholder">📝</div>`;

  const postSlug = p.slug.startsWith('/') ? p.slug : `/${p.slug}/`;

  return `
    <article class="blog-card">
      <a href="${postSlug}">${imgHtml}</a>
      <div class="blog-card__body">
        <h3 class="blog-card__title">
          <a href="${postSlug}">${p.title}</a>
        </h3>
        <p class="blog-card__excerpt">${p.excerpt || ''}</p>
        <div class="blog-card__meta">
          <span>${formatDate(p.published_at)}</span>
          <a href="${postSlug}" class="btn btn--sm">Read →</a>
        </div>
      </div>
    </article>`;
}

// ── EMIRATE DATA ─────────────────────────────────────────────

const EMIRATES = [
  { slug: 'dubai',         name: 'Dubai',           icon: '🌆' },
  { slug: 'abu-dhabi',     name: 'Abu Dhabi',        icon: '🕌' },
  { slug: 'sharjah',       name: 'Sharjah',          icon: '🏛️' },
  { slug: 'ajman',         name: 'Ajman',            icon: '🏖️' },
  { slug: 'ras-al-khaimah',name: 'Ras Al Khaimah',   icon: '⛰️' },
  { slug: 'fujairah',      name: 'Fujairah',         icon: '🌊' },
  { slug: 'umm-al-quwain', name: 'Umm Al Quwain',    icon: '🛶' }
];

// ── HOMEPAGE ─────────────────────────────────────────────────

async function initHomepage() {
  renderEmirateGrid();
  await Promise.all([
    loadFeaturedCenters(),
    loadRecentPosts()
  ]);
  initSearch();
  updateStats();
}

function renderEmirateGrid() {
  const el = document.getElementById('emirate-grid');
  if (!el) return;
  el.innerHTML = EMIRATES.map(e => `
    <a href="/typing-center-${e.slug}/" class="emirate-card">
      <span class="icon">${e.icon}</span>
      <span>${e.name}</span>
      <span class="count" id="count-${e.slug}">— centers</span>
    </a>`).join('');
}

async function loadFeaturedCenters() {
  const el = document.getElementById('featured-centers');
  if (!el) return;

  // Show skeletons
  el.innerHTML = Array(3).fill('<div class="skeleton skeleton--card"></div>').join('');

  const { data, error } = await SupabaseClient
    .from('typing_centers')
    .select('id,slug,name,emirate,area,rating,review_count,services,photos,is_featured')
    .eq('is_featured', 'true')
    .eq('is_published', 'true')
    .order('rating', { ascending: false })
    .limit(6);

  if (error || !data) { el.innerHTML = '<p class="text-muted">No centers available.</p>'; return; }
  el.innerHTML = data.map(centerCardHTML).join('');
}

async function updateStats() {
  // Get counts per emirate for emirate cards
  for (const em of EMIRATES) {
    SupabaseClient
      .from('typing_centers')
      .select('id', { head: true })
      .eq('emirate', em.slug)
      .eq('is_published', 'true')
      .then(({ data }) => {
        const el = document.getElementById(`count-${em.slug}`);
        if (el && data) el.textContent = `${data.length} centers`;
      });
  }
}

async function loadRecentPosts() {
  const el = document.getElementById('blog-grid');
  if (!el) return;

  el.innerHTML = Array(3).fill('<div class="skeleton skeleton--card"></div>').join('');

  const { data } = await SupabaseClient
    .from('blog_posts')
    .select('slug,title,excerpt,featured_image,published_at')
    .eq('is_published', 'true')
    .order('published_at', { ascending: false })
    .limit(3);

  if (!data || !data.length) { el.innerHTML = ''; return; }
  el.innerHTML = data.map(blogCardHTML).join('');
}

function initSearch() {
  const input = document.getElementById('search-input');
  const btn   = document.getElementById('search-btn');
  if (!input) return;

  function doSearch() {
    const q = input.value.trim();
    if (!q) return;
    window.location.href = `/search/?q=${encodeURIComponent(q)}`;
  }

  btn && btn.addEventListener('click', doSearch);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
}

// ── NAVBAR MOBILE ─────────────────────────────────────────────

function initNavbar() {
  const hamburger = document.querySelector('.navbar__hamburger');
  const nav       = document.querySelector('.navbar__nav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

// ── INIT ──────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  if (document.getElementById('featured-centers')) initHomepage();
});
