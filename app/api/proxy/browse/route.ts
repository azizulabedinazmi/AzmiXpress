import { NextRequest, NextResponse } from 'next/server';

// User agents for rotation
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
];

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
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

    // Validate URL
    let url: URL;
    try {
      url = new URL(targetUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Fetch the target page
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

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

      // Get content type
      const contentType = response.headers.get('content-type') || 'text/html';

      // Get the content
      let content = await response.text();

      // If it's HTML, modify it to fix relative URLs
      if (contentType.includes('text/html')) {
        const baseUrl = `${url.protocol}//${url.host}`;
        
        // Add base tag to handle relative URLs
        const baseTag = `<base href="${baseUrl}/" target="_blank">`;
        content = content.replace(/<head>/i, `<head>${baseTag}`);
        
        // Inject a script to handle navigation
        const script = `
          <script>
            (function() {
              // Intercept link clicks to open in new tab
              document.addEventListener('click', function(e) {
                const target = e.target.closest('a');
                if (target && target.href) {
                  e.preventDefault();
                  const proxyUrl = window.location.origin + '/api/proxy/browse?url=' + encodeURIComponent(target.href);
                  window.open(target.href, '_blank');
                }
              }, true);
              
              // Intercept form submissions
              document.addEventListener('submit', function(e) {
                const form = e.target;
                if (form.method.toLowerCase() === 'get') {
                  e.preventDefault();
                  const formData = new FormData(form);
                  const params = new URLSearchParams(formData);
                  const actionUrl = new URL(form.action || window.location.href);
                  actionUrl.search = params.toString();
                  const proxyUrl = window.location.origin + '/api/proxy/browse?url=' + encodeURIComponent(actionUrl.toString());
                  window.location.href = proxyUrl;
                }
              }, true);
            })();
          </script>
        `;
        content = content.replace(/<\/body>/i, `${script}</body>`);
      }

      // Create response with proxied content
      const proxyResponse = new NextResponse(content, {
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

      return proxyResponse;

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

// Handle OPTIONS for CORS preflight
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
