/**
 * listing.js — TypingCenterNear.me
 * City listing pages with filters, search, and pagination
 */

const PAGE_SIZE = 12;
let currentPage = 1;
let totalCount  = 0;
let activeFilters = { service: '', area: '', search: '' };

const EMIRATE_NAMES = {
  'dubai':          'Dubai',
  'abu-dhabi':      'Abu Dhabi',
  'sharjah':        'Sharjah',
  'ajman':          'Ajman',
  'ras-al-khaimah': 'Ras Al Khaimah',
  'fujairah':       'Fujairah',
  'umm-al-quwain':  'Umm Al Quwain'
};

function getEmirateFromPath() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  for (const part of parts) {
    if (part.startsWith('typing-center-')) {
      return part.replace('typing-center-', '');
    }
  }
  return 'dubai';
}

async function loadCenters() {
  const grid = document.getElementById('centers-grid');
  const countEl = document.getElementById('results-count');
  if (!grid) return;

  // Skeletons
  grid.innerHTML = Array(PAGE_SIZE).fill(`
    <div style="border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <div class="skeleton skeleton--image"></div>
      <div style="padding:16px">
        <div class="skeleton skeleton--title"></div>
        <div class="skeleton skeleton--text"></div>
        <div class="skeleton skeleton--text" style="width:60%"></div>
      </div>
    </div>`).join('');

  const emirate = getEmirateFromPath();
  const from    = (currentPage - 1) * PAGE_SIZE;
  const to      = from + PAGE_SIZE - 1;

  let query = SupabaseClient
    .from('typing_centers')
    .select('id,slug,name,emirate,area,address,rating,review_count,services,photos,is_featured,price_range')
    .eq('emirate', emirate)
    .eq('is_published', 'true')
    .order('is_featured', { ascending: false })
    .order('rating', { ascending: false })
    .range(from, to);

  if (activeFilters.service) query = query.contains('services', activeFilters.service);
  if (activeFilters.area)    query = query.ilike('area', `%${activeFilters.area}%`);
  if (activeFilters.search)  query = query.ilike('name', `%${activeFilters.search}%`);

  const { data, error } = await query;

  if (error || !data) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#6b7280;padding:40px">No typing centers found. Try adjusting filters.</p>';
    return;
  }

  if (!data.length) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#6b7280;padding:40px">No typing centers found in this area yet.</p>';
    if (countEl) countEl.textContent = '0 centers found';
    renderPagination(0);
    return;
  }

  grid.innerHTML = data.map(centerCardHTML).join('');
  if (countEl) countEl.textContent = `${data.length < PAGE_SIZE && currentPage === 1 ? data.length : (from + data.length)} centers found`;
  renderPagination(data.length);
}

function renderPagination(fetchedCount) {
  const el = document.getElementById('pagination');
  if (!el) return;

  const hasNext = fetchedCount === PAGE_SIZE;
  const hasPrev = currentPage > 1;

  if (!hasNext && !hasPrev) { el.innerHTML = ''; return; }

  el.innerHTML = `
    <button class="pagination__btn" id="prev-btn" ${hasPrev ? '' : 'disabled'}>← Prev</button>
    <span style="padding:0 12px;font-size:0.9rem;color:#6b7280">Page ${currentPage}</span>
    <button class="pagination__btn" id="next-btn" ${hasNext ? '' : 'disabled'}>Next →</button>`;

  document.getElementById('prev-btn')?.addEventListener('click', () => { currentPage--; loadCenters(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  document.getElementById('next-btn')?.addEventListener('click', () => { currentPage++; loadCenters(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

function initFilters() {
  // Service filter buttons
  document.querySelectorAll('.filter-btn[data-service]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.service;
      if (activeFilters.service === val) {
        activeFilters.service = '';
        btn.classList.remove('active');
      } else {
        document.querySelectorAll('.filter-btn[data-service]').forEach(b => b.classList.remove('active'));
        activeFilters.service = val;
        btn.classList.add('active');
      }
      currentPage = 1;
      loadCenters();
    });
  });

  // Search input
  const searchInput = document.getElementById('listing-search');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(e => {
      activeFilters.search = e.target.value.trim();
      currentPage = 1;
      loadCenters();
    }, 400));
  }

  // Area filter
  const areaSelect = document.getElementById('area-filter');
  if (areaSelect) {
    areaSelect.addEventListener('change', e => {
      activeFilters.area = e.target.value;
      currentPage = 1;
      loadCenters();
    });
  }
}

function setPageMeta() {
  const emirate = getEmirateFromPath();
  const emirateName = EMIRATE_NAMES[emirate] || slugToTitle(emirate);
  const titleEl = document.getElementById('page-title');
  const subtitleEl = document.getElementById('page-subtitle');
  const breadcrumbEl = document.getElementById('breadcrumb-city');

  if (titleEl) titleEl.textContent = `Typing Centers in ${emirateName}`;
  if (subtitleEl) subtitleEl.textContent = `Find official government typing services in ${emirateName}, UAE`;
  if (breadcrumbEl) breadcrumbEl.textContent = emirateName;

  // Update document title
  document.title = `Typing Centers in ${emirateName} — TypingCenterNear.me`;

  // Update canonical and meta description
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = `https://typingcenternear.me/typing-center-${emirate}/`;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = `Find and compare typing centers in ${emirateName} UAE. Emirates ID, visa, Ejari and government document services. Verified locations, ratings and contact info.`;
}

document.addEventListener('DOMContentLoaded', () => {
  setPageMeta();
  initFilters();
  loadCenters();
});
