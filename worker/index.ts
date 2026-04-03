const PORTAL_ORIGIN = 'https://fsd.teslaandroid.com';
const PORTAL_URL = new URL(PORTAL_ORIGIN);
const PORTAL_BOOTSTRAP_PATH = '/__portal__';
const YOUTUBE_EMBED_ORIGIN = 'https://www.youtube.com';
const YOUTUBE_PLAYER_PATH = '/yt/player/';

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

function renderYouTubePlayerPage(requestUrl: URL): Response {
  const videoId = requestUrl.pathname.slice(YOUTUBE_PLAYER_PATH.length).replace(/\/+$/, '');

  if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return new Response('Invalid YouTube video ID', {
      status: 400,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
      },
    });
  }

  const wrapperOrigin = requestUrl.origin;
  const wrapperUrl = `${wrapperOrigin}${requestUrl.pathname}${requestUrl.search}`;
  const youtubeUrl = new URL(`/embed/${videoId}`, YOUTUBE_EMBED_ORIGIN);

  youtubeUrl.searchParams.set('rel', '0');
  youtubeUrl.searchParams.set('playsinline', '1');
  youtubeUrl.searchParams.set('modestbranding', '1');
  youtubeUrl.searchParams.set('origin', wrapperOrigin);
  youtubeUrl.searchParams.set('widget_referrer', wrapperUrl);

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
    <meta name="referrer" content="origin-when-cross-origin">
    <title>YouTube player</title>
    <style>
      :root { color-scheme: dark; }
      html, body {
        margin: 0;
        width: 100%;
        height: 100%;
        background: #000;
      }
      body {
        overflow: hidden;
      }
      iframe {
        display: block;
        width: 100%;
        height: 100%;
        border: 0;
        background: #000;
      }
    </style>
  </head>
  <body>
    <iframe
      src="${youtubeUrl.toString()}"
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      referrerpolicy="origin-when-cross-origin"
    ></iframe>
  </body>
</html>`;

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=300',
      'referrer-policy': 'origin-when-cross-origin',
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
      return renderYouTubePlayerPage(url);
    }

    return env.ASSETS.fetch(request);
  },
};
