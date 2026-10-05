/**
 * Hash Router utility to support browser back/forward buttons and direct bookmarking
 */

export const HashRouter = {
  getRoute() {
    if (typeof window === 'undefined') return { path: '/', params: {} };
    
    // Check hash first
    const rawHash = window.location.hash.replace(/^#\/?/, '');
    const [pathPart, queryPart] = rawHash.split('?');
    const path = '/' + (pathPart || '');
    const params = {};

    // Merge search params from both query and hash
    const urlParams = new URLSearchParams(window.location.search);
    for (const [k, v] of urlParams.entries()) {
      params[k] = v;
    }
    if (queryPart) {
      const hashParams = new URLSearchParams(queryPart);
      for (const [k, v] of hashParams.entries()) {
        params[k] = v;
      }
    }

    return { path, params };
  },

  navigate(path, params = {}) {
    if (typeof window === 'undefined') return;
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    const q = new URLSearchParams(params).toString();
    const hashTarget = '#' + cleanPath + (q ? '?' + q : '');
    if (window.location.hash !== hashTarget) {
      window.location.hash = hashTarget;
    }
  },

  goBack(fallbackPath = '/') {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      this.navigate(fallbackPath);
    }
  }
};
