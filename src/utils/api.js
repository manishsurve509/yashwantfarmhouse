/**
 * Safe fetch wrapper to avoid "Unexpected token '<', '<!DOCTYPE '... is not valid JSON"
 * when the backend server is offline or returning HTML error/redirect pages.
 */
export async function safeFetch(url, options = {}) {
  try {
    const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
    const targetUrl = url.startsWith('/') && BASE_URL ? `${BASE_URL}${url}` : url;

    const res = await fetch(targetUrl, options);
    const contentType = res.headers.get('content-type') || '';


    // If response is not JSON (e.g. index.html or 404/502/504 HTML page)
    if (!contentType.includes('application/json')) {
      const text = await res.text();
      if (text.trim().startsWith('<')) {
        return {
          ok: false,
          status: res.status,
          error: 'Backend API is currently offline. Please ensure the Node.js backend server is running.',
          isHtml: true,
          data: null
        };
      }
      return {
        ok: false,
        status: res.status,
        error: text || 'Non-JSON server response',
        isHtml: false,
        data: null
      };
    }

    const data = await res.json();
    return {
      ok: res.ok,
      status: res.status,
      error: res.ok ? null : (data.message || 'API request failed'),
      isHtml: false,
      data
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err.message || 'Network error connecting to backend API',
      isHtml: false,
      data: null
    };
  }
}
