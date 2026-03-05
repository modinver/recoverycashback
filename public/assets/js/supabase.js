/**
 * supabase.js — TypingCenterNear.me
 * Lightweight Supabase REST client — no npm, no build step
 * ~120 lines — covers: select, insert, update, delete, auth
 */

const SupabaseClient = (() => {
  let _url = '';
  let _anonKey = '';
  let _token = null; // JWT from auth session

  function init(url, anonKey) {
    _url = url.replace(/\/$/, '');
    _anonKey = anonKey;
    // Restore session from localStorage
    const saved = localStorage.getItem('sb_session');
    if (saved) {
      try { _token = JSON.parse(saved).access_token; } catch (_) {}
    }
  }

  function getHeaders(extra = {}) {
    const h = {
      'Content-Type':  'application/json',
      'apikey':        _anonKey,
      'Authorization': `Bearer ${_token || _anonKey}`,
      ...extra
    };
    return h;
  }

  // ── REST API ──────────────────────────────────────────────

  function from(table) {
    const base = `${_url}/rest/v1/${table}`;
    let _select = '*';
    let _filters = [];
    let _order   = '';
    let _range   = '';
    let _limit   = '';
    let _single  = false;

    const q = {
      select(cols) { _select = cols; return q; },

      eq(col, val)     { _filters.push(`${col}=eq.${encodeURIComponent(val)}`);     return q; },
      neq(col, val)    { _filters.push(`${col}=neq.${encodeURIComponent(val)}`);    return q; },
      ilike(col, val)  { _filters.push(`${col}=ilike.${encodeURIComponent(val)}`);  return q; },
      contains(col, val){ _filters.push(`${col}=cs.{${val}}`);                       return q; },
      in(col, vals)    { _filters.push(`${col}=in.(${vals.map(v=>encodeURIComponent(v)).join(',')})`); return q; },
      is(col, val)     { _filters.push(`${col}=is.${val}`);                          return q; },
      gt(col, val)     { _filters.push(`${col}=gt.${encodeURIComponent(val)}`);      return q; },
      gte(col, val)    { _filters.push(`${col}=gte.${encodeURIComponent(val)}`);     return q; },
      lt(col, val)     { _filters.push(`${col}=lt.${encodeURIComponent(val)}`);      return q; },
      lte(col, val)    { _filters.push(`${col}=lte.${encodeURIComponent(val)}`);     return q; },

      order(col, { ascending = true } = {}) {
        _order = `${col}.${ascending ? 'asc' : 'desc'}`;
        return q;
      },

      range(from, to) { _range = `${from}-${to}`; return q; },
      limit(n)        { _limit = n; return q; },
      single()        { _single = true; return q; },

      async then(resolve, reject) {
        let url = `${base}?select=${encodeURIComponent(_select)}`;
        if (_filters.length) url += '&' + _filters.join('&');
        if (_order)  url += `&order=${_order}`;
        if (_limit)  url += `&limit=${_limit}`;

        const headers = getHeaders();
        if (_range) headers['Range'] = _range;
        if (_single) headers['Accept'] = 'application/vnd.pgrst.object+json';

        try {
          const res = await fetch(url, { headers });
          const data = await res.json();
          if (!res.ok) return reject({ error: data });
          resolve({ data, error: null });
        } catch (err) {
          reject({ error: err });
        }
      }
    };
    return q;
  }

  async function insert(table, row, { upsert = false } = {}) {
    const url = `${_url}/rest/v1/${table}`;
    const headers = getHeaders({ Prefer: upsert ? 'resolution=merge-duplicates,return=representation' : 'return=representation' });
    const res = await fetch(url, {
      method: upsert ? 'POST' : 'POST',
      headers,
      body: JSON.stringify(Array.isArray(row) ? row : [row])
    });
    const data = await res.json();
    return { data: res.ok ? data : null, error: res.ok ? null : data };
  }

  async function update(table, row, filters = {}) {
    let url = `${_url}/rest/v1/${table}?`;
    url += Object.entries(filters).map(([k,v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&');
    const headers = getHeaders({ Prefer: 'return=representation' });
    const res = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(row)
    });
    const data = await res.json();
    return { data: res.ok ? data : null, error: res.ok ? null : data };
  }

  async function del(table, filters = {}) {
    let url = `${_url}/rest/v1/${table}?`;
    url += Object.entries(filters).map(([k,v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&');
    const res = await fetch(url, { method: 'DELETE', headers: getHeaders() });
    return { error: res.ok ? null : await res.json() };
  }

  // ── AUTH ─────────────────────────────────────────────────

  async function signIn(email, password) {
    const url = `${_url}/auth/v1/token?grant_type=password`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': _anonKey },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.access_token) {
      _token = data.access_token;
      localStorage.setItem('sb_session', JSON.stringify(data));
      return { session: data, error: null };
    }
    return { session: null, error: data };
  }

  async function signOut() {
    const url = `${_url}/auth/v1/logout`;
    await fetch(url, { method: 'POST', headers: getHeaders() });
    _token = null;
    localStorage.removeItem('sb_session');
  }

  function getSession() {
    const saved = localStorage.getItem('sb_session');
    if (!saved) return null;
    try {
      const s = JSON.parse(saved);
      // Check expiry
      if (s.expires_at && Date.now() / 1000 > s.expires_at) {
        localStorage.removeItem('sb_session');
        _token = null;
        return null;
      }
      return s;
    } catch (_) { return null; }
  }

  function isAuthenticated() {
    return !!getSession();
  }

  // ── STORAGE ──────────────────────────────────────────────

  function storageUrl(bucket, path) {
    return `${_url}/storage/v1/object/public/${bucket}/${path}`;
  }

  async function uploadFile(bucket, path, file) {
    const url = `${_url}/storage/v1/object/${bucket}/${path}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${_token || _anonKey}`,
        'apikey': _anonKey,
        'Content-Type': file.type
      },
      body: file
    });
    const data = await res.json();
    return { data: res.ok ? data : null, error: res.ok ? null : data };
  }

  return { init, from, insert, update, delete: del, signIn, signOut, getSession, isAuthenticated, storageUrl, uploadFile };
})();

// Auto-init from config embedded in HTML or window globals
document.addEventListener('DOMContentLoaded', () => {
  const url = window.SUPABASE_URL || '';
  const key = window.SUPABASE_ANON_KEY || '';
  if (url && key) SupabaseClient.init(url, key);
});
