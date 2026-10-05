/**
 * Tryout Batch URL Encoder & Decoder for Serverless / Database-less Environment
 * Encodes Tryout title, duration, question selection, or custom questions into a compact URL token.
 */

// Helper: Convert Uint8Array to Base64URL string
function uint8ArrayToBase64Url(bytes) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Helper: Convert Base64URL string to Uint8Array
function base64UrlToUint8Array(base64Url) {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Compress and encode a Tryout object into a URL-safe string
 * @param {Object} tryoutData { id, title, duration, questionIds, customQuestions }
 * @returns {Promise<string>}
 */
export async function encodeTryout(tryoutData) {
  try {
    const jsonString = JSON.stringify(tryoutData);
    
    // Check if CompressionStream is available in browser/runtime
    if (typeof CompressionStream !== 'undefined') {
      const stream = new Blob([jsonString]).stream();
      const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
      const response = new Response(compressedStream);
      const buffer = await response.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      return 'gz.' + uint8ArrayToBase64Url(bytes);
    }

    // Fallback: standard URI safe base64
    const utf8Bytes = new TextEncoder().encode(jsonString);
    return 'b64.' + uint8ArrayToBase64Url(utf8Bytes);
  } catch (err) {
    console.error('Error encoding tryout:', err);
    // Utmost fallback: encodeURIComponent
    return 'raw.' + encodeURIComponent(JSON.stringify(tryoutData));
  }
}

/**
 * Decode and decompress a Tryout token into a Tryout object
 * @param {string} token
 * @returns {Promise<Object|null>}
 */
export async function decodeTryout(token) {
  if (!token || typeof token !== 'string') return null;

  try {
    const trimmed = token.trim();

    if (trimmed.startsWith('gz.')) {
      const b64 = trimmed.slice(3);
      const bytes = base64UrlToUint8Array(b64);
      if (typeof DecompressionStream !== 'undefined') {
        const stream = new Blob([bytes]).stream();
        const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
        const response = new Response(decompressedStream);
        const text = await response.text();
        return JSON.parse(text);
      }
    }

    if (trimmed.startsWith('b64.')) {
      const b64 = trimmed.slice(4);
      const bytes = base64UrlToUint8Array(b64);
      const text = new TextDecoder().decode(bytes);
      return JSON.parse(text);
    }

    if (trimmed.startsWith('raw.')) {
      const text = decodeURIComponent(trimmed.slice(4));
      return JSON.parse(text);
    }

    // Direct JSON attempt
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      return JSON.parse(trimmed);
    }

    // Legacy un-prefixed base64 try
    try {
      const bytes = base64UrlToUint8Array(trimmed);
      const text = new TextDecoder().decode(bytes);
      return JSON.parse(text);
    } catch {
      return null;
    }
  } catch (err) {
    console.error('Error decoding tryout token:', err);
    return null;
  }
}

/**
 * Read Tryout token from current browser URL query or hash
 * Example: https://app/?to=gz.xyz or https://app/#to=gz.xyz
 * @returns {string|null}
 */
export function getTryoutTokenFromUrl() {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  const queryToken = urlParams.get('to');
  if (queryToken) return queryToken;

  // Check URL hash fallback
  if (window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#\/?/, ''));
    const hashToken = hashParams.get('to');
    if (hashToken) return hashToken;
  }

  return null;
}

/**
 * Generate full shareable URL with encoded token
 * @param {string} token
 * @returns {string}
 */
export function buildShareableUrl(token) {
  if (typeof window === 'undefined') return `?to=${token}`;
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  return `${origin}${pathname}?to=${encodeURIComponent(token)}`;
}
