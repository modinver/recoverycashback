/**
 * blog.js — TypingCenterNear.me
 * Blog listing and individual article pages
 */

const BLOG_PAGE_SIZE = 9;
let blogPage = 1;

// ── BLOG LISTING ─────────────────────────────────────────────

async function loadBlogPosts() {
  const grid  = document.getElementById('blog-posts-grid');
  const count = document.getElementById('posts-count');
  if (!grid) return;

  grid.innerHTML = Array(BLOG_PAGE_SIZE).fill('<div class="skeleton skeleton--card" style="border-radius:12px"></div>').join('');

  const from = (blogPage - 1) * BLOG_PAGE_SIZE;
  const to   = from + BLOG_PAGE_SIZE - 1;

  const { data } = await SupabaseClient
    .from('blog_posts')
    .select('slug,title,excerpt,featured_image,published_at')
    .eq('is_published', 'true')
    .order('published_at', { ascending: false })
    .range(from, to);

  if (!data || !data.length) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;color:#6b7280">No articles published yet.</p>';
    return;
  }

  grid.innerHTML = data.map(blogCardHTML).join('');
  if (count) count.textContent = `${data.length} articles`;

  renderBlogPagination(data.length);
}

function renderBlogPagination(fetchedCount) {
  const el = document.getElementById('blog-pagination');
  if (!el) return;

  const hasNext = fetchedCount === BLOG_PAGE_SIZE;
  const hasPrev = blogPage > 1;
  if (!hasNext && !hasPrev) { el.innerHTML = ''; return; }

  el.innerHTML = `
    <button class="pagination__btn" id="prev-blog" ${hasPrev ? '' : 'disabled'}>← Previous</button>
    <span style="padding:0 16px;color:#6b7280">Page ${blogPage}</span>
    <button class="pagination__btn" id="next-blog" ${hasNext ? '' : 'disabled'}>Next →</button>`;

  document.getElementById('prev-blog')?.addEventListener('click', () => { blogPage--; loadBlogPosts(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  document.getElementById('next-blog')?.addEventListener('click', () => { blogPage++; loadBlogPosts(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

// ── INDIVIDUAL POST ──────────────────────────────────────────

async function loadPost() {
  const slug = window.location.pathname.split('/').filter(Boolean).pop() ||
               window.location.pathname.split('/').filter(Boolean).slice(-2)[0];

  const { data: posts } = await SupabaseClient
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', 'true')
    .limit(1);

  if (!posts || !posts.length) {
    document.getElementById('post-content')?.replaceWith(Object.assign(document.createElement('div'), {
      innerHTML: '<div style="text-align:center;padding:80px 20px"><h2>Article not found</h2><p><a href="/blog/">← Back to blog</a></p></div>'
    }));
    return;
  }

  const post = posts[0];
  renderPost(post);
}

function renderPost(p) {
  document.title = p.meta_title || p.title;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && p.meta_description) metaDesc.content = p.meta_description;

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = `https://typingcenternear.me/${p.slug}/`;

  // OG tags
  setMeta('og:title', p.meta_title || p.title);
  setMeta('og:description', p.meta_description || p.excerpt || '');
  if (p.featured_image) setMeta('og:image', p.featured_image);

  // Article elements
  const titleEl = document.getElementById('post-title');
  if (titleEl) titleEl.textContent = p.title;

  const dateEl = document.getElementById('post-date');
  if (dateEl) dateEl.textContent = formatDate(p.published_at);

  const imgEl = document.getElementById('post-image');
  if (imgEl) {
    if (p.featured_image) {
      imgEl.src = p.featured_image;
      imgEl.alt = p.title;
    } else {
      imgEl.style.display = 'none';
    }
  }

  const contentEl = document.getElementById('post-content');
  if (contentEl) contentEl.innerHTML = p.content || '';

  // Schema
  if (p.schema_json) {
    try {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = p.schema_json;
      document.head.appendChild(script);
    } catch (_) {}
  } else {
    injectArticleSchema(p);
  }

  // Breadcrumb
  const bcTitle = document.getElementById('bc-post-title');
  if (bcTitle) bcTitle.textContent = p.title.length > 40 ? p.title.slice(0, 40) + '…' : p.title;
}

function setMeta(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el); }
  el.content = content;
}

function injectArticleSchema(p) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": p.title,
    "description": p.excerpt || p.meta_description || '',
    "datePublished": p.published_at,
    "dateModified": p.updated_at || p.published_at,
    "author": { "@type": "Organization", "name": "TypingCenterNear.me" },
    "publisher": {
      "@type": "Organization",
      "name": "TypingCenterNear.me",
      "url": "https://typingcenternear.me"
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://typingcenternear.me/${p.slug}/` },
    "image": p.featured_image || "https://typingcenternear.me/assets/img/og-default.jpg"
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

// ── INIT ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('blog-posts-grid')) loadBlogPosts();
  if (document.getElementById('post-content'))    loadPost();
});
