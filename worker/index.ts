const PORTAL_ORIGIN = 'https://fsd.teslaandroid.com';
const PORTAL_URL = new URL(PORTAL_ORIGIN);
const PORTAL_BOOTSTRAP_PATH = '/__portal__';
const YOUTUBE_PLAYER_PATH = '/yt/player/';
const YOUTUBE_WRAPPER_ORIGIN = 'https://yt.tslap.store';

type Env = {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
};

function isPortalProxyPath(pathname: string): boolean {
  return pathname === '/api' || pathname.startsWith('/api/') || pathname === PORTAL_BOOTSTRAP_PATH || pathname.startsWith(`${PORTAL_BOOTSTRAP_PATH}/`);
}

function isYouTubePlayerPath(pathname: string): boolean {
  return pathname.startsWith(YOUTUBE_PLAYER_PATH);
}

function toPortalUrl(requestUrl: URL): URL {
  if (requestUrl.pathname === PORTAL_BOOTSTRAP_PATH || requestUrl.pathname === `${PORTAL_BOOTSTRAP_PATH}/`) {
    return new URL('/', PORTAL_URL);
  }

  if (requestUrl.pathname.startsWith(`${PORTAL_BOOTSTRAP_PATH}/`)) {
    const proxyPath = requestUrl.pathname.slice(PORTAL_BOOTSTRAP_PATH.length);
    return new URL(`${proxyPath}${requestUrl.search}`, PORTAL_URL);
  }

  return new URL(`${requestUrl.pathname}${requestUrl.search}`, PORTAL_URL);
}

async function proxyPortalRequest(request: Request): Promise<Response> {
  const sourceUrl = new URL(request.url);
  const portalUrl = toPortalUrl(sourceUrl);
  const upstreamRequest = new Request(portalUrl.toString(), request);

  return fetch(upstreamRequest, {
    redirect: 'manual',
  });
}

function redirectToYouTubeWorker(requestUrl: URL): Response {
  const videoId = requestUrl.pathname.slice(YOUTUBE_PLAYER_PATH.length).replace(/\/+$/, '');

  if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return new Response('Invalid YouTube video ID', {
      status: 400,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
      },
    });
  }

  const location = new URL(`/player/${videoId}${requestUrl.search}`, YOUTUBE_WRAPPER_ORIGIN).toString();

  return new Response(null, {
    status: 302,
    headers: {
      location,
      'cache-control': 'no-store',
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (isPortalProxyPath(url.pathname)) {
      return proxyPortalRequest(request);
    }

    if (isYouTubePlayerPath(url.pathname)) {
      return redirectToYouTubeWorker(url);
    }

    return env.ASSETS.fetch(request);
  },
};
