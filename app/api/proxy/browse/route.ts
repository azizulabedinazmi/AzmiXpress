import { NextRequest, NextResponse } from 'next/server';

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
];

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function resolveRelativeUrl(href: string, baseUrl: string): string {
  try {
    return new URL(href, baseUrl).href;
  } catch {
    return href;
  }
}

function isProxyableUrl(href: string): boolean {
  if (!href) return false;
  const lower = href.toLowerCase();
  return !(
    lower.startsWith('javascript:') ||
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:') ||
    lower.startsWith('data:') ||
    lower.startsWith('sms:') ||
    lower.startsWith('about:') ||
    href === '#' ||
    href.startsWith('#')
  );
}

function rewriteHtmlContent(content: string, baseUrl: string, appOrigin: string, targetUrl: string): string {
  // Add base tag for any remaining relative URLs
  content = content.replace(/<head>/i, `<head><base href="${baseUrl}/">`);

  // Rewrite ALL href attributes (links, stylesheets, etc) to go through proxy
  content = content.replace(/\bhref="([^"]*)"/g, (match, href) => {
    if (!isProxyableUrl(href)) return match;
    const absolute = resolveRelativeUrl(href, baseUrl);
    const proxy = `${appOrigin}/api/proxy/browse?url=${encodeURIComponent(absolute)}`;
    return `href="${proxy}"`;
  });

  content = content.replace(/\bhref='([^']*)'/g, (match, href) => {
    if (!isProxyableUrl(href)) return match;
    const absolute = resolveRelativeUrl(href, baseUrl);
    const proxy = `${appOrigin}/api/proxy/browse?url=${encodeURIComponent(absolute)}`;
    return `href='${proxy}'`;
  });

  // Rewrite ALL src attributes (scripts, images, iframes, etc) to go through proxy
  content = content.replace(/\bsrc="([^"]*)"/g, (match, src) => {
    if (!isProxyableUrl(src)) return match;
    const absolute = resolveRelativeUrl(src, baseUrl);
    const proxy = `${appOrigin}/api/proxy/browse?url=${encodeURIComponent(absolute)}`;
    return `src="${proxy}"`;
  });

  content = content.replace(/\bsrc='([^']*)'/g, (match, src) => {
    if (!isProxyableUrl(src)) return match;
    const absolute = resolveRelativeUrl(src, baseUrl);
    const proxy = `${appOrigin}/api/proxy/browse?url=${encodeURIComponent(absolute)}`;
    return `src='${proxy}'`;
  });

  // Rewrite action attributes in forms
  content = content.replace(/\baction="([^"]*)"/g, (match, action) => {
    if (!action || !isProxyableUrl(action)) {
      if (!action) {
        return `action="${appOrigin}/api/proxy/browse?url=${encodeURIComponent(targetUrl)}"`;
      }
      return match;
    }
    const absolute = resolveRelativeUrl(action, baseUrl);
    const proxy = `${appOrigin}/api/proxy/browse?url=${encodeURIComponent(absolute)}`;
    return `action="${proxy}"`;
  });

  content = content.replace(/\baction='([^']*)'/g, (match, action) => {
    if (!action || !isProxyableUrl(action)) {
      if (!action) {
        return `action='${appOrigin}/api/proxy/browse?url=${encodeURIComponent(targetUrl)}'`;
      }
      return match;
    }
    const absolute = resolveRelativeUrl(action, baseUrl);
    const proxy = `${appOrigin}/api/proxy/browse?url=${encodeURIComponent(absolute)}`;
    return `action='${proxy}'`;
  });

  // Handle forms without action - add proxy action
  content = content.replace(/<form(?!\s+action)(\s+[^>]*)>/gi, (match, attrs) => {
    return `<form action="${appOrigin}/api/proxy/browse?url=${encodeURIComponent(targetUrl)}"${attrs}>`;
  });

  // Inject script for dynamic link handling
  const script = `<script>
(function() {
  // Extract the actual target URL from the query parameter
  const url = new URL(window.location.href);
  const targetUrl = url.searchParams.get('url') || '${targetUrl.replace(/'/g, "\\'")}';
  const baseUrl = '${baseUrl.replace(/'/g, "\\'")}';
  const appOrigin = '${appOrigin.replace(/'/g, "\\'")}';

  function encodeUrl(url) {
    return encodeURIComponent(url);
  }

  function resolveUrl(href) {
    try {
      return new URL(href, baseUrl).href;
    } catch {
      return href;
    }
  }

  function isProxyable(href) {
    if (!href) return false;
    const lower = href.toLowerCase();
    return !(
      lower.startsWith('javascript:') ||
      lower.startsWith('mailto:') ||
      lower.startsWith('tel:') ||
      lower.startsWith('data:') ||
      lower === '#' ||
      lower.startsWith('#')
    );
  }

  function makeProxyUrl(url) {
    if (!isProxyable(url)) return url;
    const absolute = resolveUrl(url);
    return appOrigin + '/api/proxy/browse?url=' + encodeUrl(absolute);
  }

  // Fix any remaining links on page load
  function fixLinks() {
    try {
      document.querySelectorAll('a[href]').forEach(function(link) {
        const href = link.getAttribute('href');
        if (href && isProxyable(href) && !href.includes('/api/proxy/browse')) {
          link.href = makeProxyUrl(href);
        }
      });
    } catch(e) {}
  }

  fixLinks();

  // Monitor for dynamically added links
  const observer = new MutationObserver(function() {
    fixLinks();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
</script>`;

  content = content.replace(/<\/body>/i, script + '\n</body>');

  return content;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    let url: URL;
    try {
      url = new URL(targetUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'User-Agent': getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'max-age=0',
        },
        signal: controller.signal,
        redirect: 'follow',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch: ${response.status} ${response.statusText}` },
          { status: response.status }
        );
      }

      const contentType = response.headers.get('content-type') || 'text/html';
      let content = await response.text();

      if (contentType.includes('text/html')) {
        const baseUrl = `${url.protocol}//${url.host}`;
        const appOrigin = request.nextUrl.origin;
        content = rewriteHtmlContent(content, baseUrl, appOrigin, targetUrl);
      }

      return new NextResponse(content, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });

    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout - the website took too long to respond' },
          { status: 504 }
        );
      }

      return NextResponse.json(
        { error: `Failed to fetch content: ${fetchError.message}` },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Proxy browse error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    let url: URL;
    try {
      url = new URL(targetUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const contentType = request.headers.get('content-type') || 'application/x-www-form-urlencoded';
    const body = await request.text();
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'User-Agent': getRandomUserAgent(),
          'Content-Type': contentType,
        },
        body,
        signal: controller.signal,
        redirect: 'follow',
      });

      clearTimeout(timeoutId);

      const responseContentType = response.headers.get('content-type') || 'text/html';
      let content = await response.text();

      if (responseContentType.includes('text/html')) {
        const baseUrl = `${url.protocol}//${url.host}`;
        const appOrigin = request.nextUrl.origin;
        content = rewriteHtmlContent(content, baseUrl, appOrigin, targetUrl);
      }

      return new NextResponse(content, {
        status: 200,
        headers: {
          'Content-Type': responseContentType,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });

    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout' },
          { status: 504 }
        );
      }

      return NextResponse.json(
        { error: `Failed to fetch content: ${fetchError.message}` },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Proxy POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
