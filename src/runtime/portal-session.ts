import { Capacitor } from '@capacitor/core';

const PORTAL_ORIGIN = 'https://fsd.teslaandroid.com';
const PORTAL_URL = new URL(PORTAL_ORIGIN);

let bridgeInstalled = false;
let baseFetch: typeof window.fetch | null = null;

function isLocalOrigin(url: URL): boolean {
  return url.origin === window.location.origin;
}

function isPortalOrigin(url: URL): boolean {
  return url.origin === PORTAL_ORIGIN;
}

function resolveInputUrl(input: RequestInfo | URL): URL {
  if (typeof input === 'string' || input instanceof URL) {
    return new URL(String(input), window.location.href);
  }

  return new URL(input.url, window.location.href);
}

function toPortalUrl(url: URL): string {
  return new URL(`${url.pathname}${url.search}${url.hash}`, PORTAL_URL).toString();
}

function createPortalInit(init?: RequestInit): RequestInit {
  return {
    ...init,
    cache: init?.cache ?? 'no-store',
    credentials: 'include',
  };
}

function updateMetaTag(name: string, content: string): void {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

  if (!tag) {
    tag = document.createElement('meta');
    tag.name = name;
    document.head.append(tag);
  }

  tag.content = content;
}

export function installPortalFetchBridge(): void {
  if (!Capacitor.isNativePlatform() || bridgeInstalled) {
    return;
  }

  baseFetch = window.fetch.bind(window);
  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const resolved = resolveInputUrl(input);
    const targetsPortal = isLocalOrigin(resolved) || isPortalOrigin(resolved);

    if (!targetsPortal) {
      return baseFetch!(input, init);
    }

    const portalUrl = isPortalOrigin(resolved) ? resolved.toString() : toPortalUrl(resolved);

    if (input instanceof Request) {
      return baseFetch!(new Request(portalUrl, input), createPortalInit(init));
    }

    return baseFetch!(portalUrl, createPortalInit(init));
  }) as typeof window.fetch;

  bridgeInstalled = true;
}

export async function bootstrapPortalSession(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  if (!bridgeInstalled) {
    installPortalFetchBridge();
  }

  const response = await (baseFetch ?? window.fetch)(`${PORTAL_ORIGIN}/`, {
    cache: 'no-store',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const html = await response.text();
  const remoteDocument = new DOMParser().parseFromString(html, 'text/html');
  const csrfToken = remoteDocument.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
  const turnstileSiteKey =
    remoteDocument.querySelector<HTMLMetaElement>('meta[name="turnstile-site-key"]')?.content ?? '';

  if (!csrfToken) {
    throw new Error('Missing CSRF token from portal bootstrap');
  }

  updateMetaTag('csrf-token', csrfToken);
  updateMetaTag('turnstile-site-key', turnstileSiteKey);
}
