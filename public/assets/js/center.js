/**
 * center.js — TypingCenterNear.me
 * Individual center page: info, Leaflet map, services, reviews
 */

let map = null;

function getSlugFromPath() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  return parts[parts.length - 1] || parts[parts.length - 2] || '';
}

function getEmirateFromPath() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  for (const part of parts) {
    if (part.startsWith('typing-center-')) {
      return part.replace('typing-center-', '');
    }
  }
  return 'dubai';
}

async function loadCenter() {
  const slug = getSlugFromPath();
  const emirate = getEmirateFromPath();

  const { data: centers, error } = await SupabaseClient
    .from('typing_centers')
    .select('*')
    .eq('slug', slug)
    .eq('emirate', emirate)
    .eq('is_published', 'true')
    .limit(1);

  if (error || !centers || !centers.length) {
    document.getElementById('center-main').innerHTML = `
      <div style="text-align:center;padding:80px 20px">
        <h2>Center not found</h2>
        <p><a href="/typing-center-${emirate}/">← Back to ${slugToTitle(emirate)} listing</a></p>
      </div>`;
    return;
  }

  const c = centers[0];
  renderCenter(c);
  await loadReviews(c.id);
}

function renderCenter(c) {
  // Update page metadata
  document.title = `${c.name} — Typing Center in ${slugToTitle(c.emirate)} | TypingCenterNear.me`;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = c.meta_description || `${c.name} in ${c.area || c.emirate}. Typing center services: ${(c.services || []).map(serviceLabel).join(', ')}.`;

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = `https://typingcenternear.me/typing-center-${c.emirate}/${c.slug}/`;

  // JSON-LD
  injectSchema(c);

  // Hero
  const nameEl = document.getElementById('center-name');
  if (nameEl) nameEl.textContent = c.name;

  const addrEl = document.getElementById('center-address');
  if (addrEl) addrEl.textContent = c.address || '';

  const ratingEl = document.getElementById('center-rating');
  if (ratingEl) ratingEl.innerHTML = `
    <span class="stars">${starsHTML(c.rating)}</span>
    <strong>${parseFloat(c.rating || 0).toFixed(1)}</strong>
    <span>(${c.review_count || 0} reviews)</span>`;

  if (c.is_featured) {
    const badge = document.getElementById('featured-badge');
    if (badge) badge.style.display = 'inline-flex';
  }

  // Breadcrumb
  const bcCity = document.getElementById('bc-city');
  const bcCityLink = document.getElementById('bc-city-link');
  if (bcCity) bcCity.textContent = slugToTitle(c.emirate);
  if (bcCityLink) {
    bcCityLink.textContent = slugToTitle(c.emirate);
    bcCityLink.href = `/typing-center-${c.emirate}/`;
  }

  // Photos gallery
  const gallery = document.getElementById('photo-gallery');
  if (gallery) {
    if (c.photos && c.photos.length) {
      gallery.innerHTML = c.photos.map((url, i) =>
        `<img src="${url}" alt="${c.name} photo ${i+1}" loading="lazy" width="400" height="250" style="border-radius:8px;object-fit:cover;width:100%;height:250px">`
      ).join('');
    } else {
      gallery.innerHTML = `<div style="height:250px;background:linear-gradient(135deg,#f1f5f9,#e2e8f0);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:4rem">🖨️</div>`;
    }
  }

  // Info rows
  setInfoRow('info-phone',   c.phone    ? `<a href="tel:${c.phone}">${c.phone}</a>` : '—');
  setInfoRow('info-whatsapp',c.whatsapp ? `<a href="https://wa.me/${c.whatsapp.replace(/\D/g,'')}" target="_blank">WhatsApp</a>` : '—');
  setInfoRow('info-email',   c.email    ? `<a href="mailto:${c.email}">${c.email}</a>` : '—');
  setInfoRow('info-website', c.website  ? `<a href="${c.website}" target="_blank" rel="noopener">${c.website}</a>` : '—');
  setInfoRow('info-area',    c.area || '—');
  setInfoRow('info-price',   c.price_range || '—');

  // Opening hours
  const hoursEl = document.getElementById('opening-hours');
  if (hoursEl && c.opening_hours && Object.keys(c.opening_hours).length) {
    const days = ['mon','tue','wed','thu','fri','sat','sun'];
    const dayNames = { mon:'Monday', tue:'Tuesday', wed:'Wednesday', thu:'Thursday', fri:'Friday', sat:'Saturday', sun:'Sunday' };
    hoursEl.innerHTML = days.map(d => {
      const val = c.opening_hours[d];
      if (!val) return '';
      return `<div class="info-row">
        <span class="info-row__label">${dayNames[d]}</span>
        <span class="info-row__value">${val === 'closed' ? '❌ Closed' : val}</span>
      </div>`;
    }).join('');
  }

  // Services
  const servicesEl = document.getElementById('services-list');
  if (servicesEl && c.services && c.services.length) {
    servicesEl.innerHTML = c.services.map(s =>
      `<span class="tag tag--primary" style="font-size:0.875rem;padding:6px 14px">${serviceLabel(s)}</span>`
    ).join('');
  }

  // Description
  const descEl = document.getElementById('center-description');
  if (descEl && c.description) descEl.innerHTML = `<p>${c.description}</p>`;

  // Map
  if (c.lat && c.lng) {
    initMap(c);
  } else {
    const mapEl = document.getElementById('map');
    if (mapEl) mapEl.innerHTML = `<div style="height:300px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;color:#94a3b8;border-radius:8px">📍 Location not available</div>`;
  }

  // Contact sidebar buttons
  const callBtn = document.getElementById('btn-call');
  const waBtn   = document.getElementById('btn-whatsapp');
  if (callBtn && c.phone) {
    callBtn.href = `tel:${c.phone}`;
    callBtn.style.display = 'inline-flex';
  }
  if (waBtn && c.whatsapp) {
    waBtn.href = `https://wa.me/${c.whatsapp.replace(/\D/g,'')}`;
    waBtn.style.display = 'inline-flex';
  }
}

function setInfoRow(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function initMap(c) {
  const mapEl = document.getElementById('map');
  if (!mapEl || typeof L === 'undefined') return;

  if (map) { map.remove(); map = null; }

  map = L.map('map').setView([c.lat, c.lng], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  const icon = L.divIcon({
    html: `<div style="background:#0e7c6b;color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.3)">🖨️</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    className: ''
  });

  L.marker([c.lat, c.lng], { icon })
    .addTo(map)
    .bindPopup(`<strong>${c.name}</strong><br>${c.address || ''}`)
    .openPopup();

  // Directions button
  const dirBtn = document.getElementById('btn-directions');
  if (dirBtn) {
    dirBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`;
    dirBtn.style.display = 'inline-flex';
  }
}

async function loadReviews(centerId) {
  const el = document.getElementById('reviews-list');
  if (!el) return;

  const { data } = await SupabaseClient
    .from('reviews')
    .select('*')
    .eq('center_id', centerId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (!data || !data.length) {
    el.innerHTML = '<p style="color:#94a3b8;font-size:0.875rem">No reviews yet. Be the first to review!</p>';
    return;
  }

  el.innerHTML = data.map(r => `
    <div style="padding:16px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:12px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <strong style="font-size:0.9rem">${r.author_name || 'Anonymous'}</strong>
        <span class="stars" style="font-size:0.875rem">${starsHTML(r.rating)}</span>
      </div>
      <p style="font-size:0.875rem;color:#4b5563;line-height:1.6">${r.comment || ''}</p>
      <small style="color:#9ca3af">${formatDate(r.created_at)}</small>
    </div>`).join('');
}

function injectSchema(c) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": c.name,
    "url": `https://typingcenternear.me/typing-center-${c.emirate}/${c.slug}/`,
    "telephone": c.phone || undefined,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": c.address || '',
      "addressLocality": slugToTitle(c.emirate),
      "addressRegion": slugToTitle(c.emirate),
      "addressCountry": "AE"
    },
    "image": c.photos && c.photos[0] ? [c.photos[0]] : undefined,
    "priceRange": c.price_range || undefined,
    "aggregateRating": parseFloat(c.rating) > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": parseFloat(c.rating).toFixed(1),
      "reviewCount": c.review_count || 1
    } : undefined
  };

  if (c.lat && c.lng) {
    schema.geo = { "@type": "GeoCoordinates", "latitude": c.lat, "longitude": c.lng };
  }

  if (c.services && c.services.length) {
    schema.hasOfferCatalog = {
      "@type": "OfferCatalog",
      "name": "Services",
      "itemListElement": c.services.map(s => ({ "@type": "Offer", "name": serviceLabel(s) }))
    };
  }

  // Remove undefined keys
  const clean = JSON.parse(JSON.stringify(schema));
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(clean, null, 2);
  document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', loadCenter);
