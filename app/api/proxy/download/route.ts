import { NextRequest, NextResponse } from 'next/server';

// List of user agents for rotation
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.43 Mobile Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 14; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:119.0) Gecko/20100101 Firefox/119.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.47',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 13; SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 13; SM-F936B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 11; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36',
];

// Common video, audio, and document MIME types
const MIME_TYPES: Record<string, string> = {
  // Video
  '.mp4': 'video/mp4',
  '.m4v': 'video/mp4',
  '.avi': 'video/x-msvideo',
  '.mov': 'video/quicktime',
  '.wmv': 'video/x-ms-wmv',
  '.flv': 'video/x-flv',
  '.webm': 'video/webm',
  '.mkv': 'video/x-matroska',
  '.3gp': 'video/3gpp',
  '.mpeg': 'video/mpeg',
  '.mpg': 'video/mpeg',
  '.ts': 'video/mp2t',
  '.m2ts': 'video/mp2t',
  '.mts': 'video/mp2t',
  '.divx': 'video/divx',
  '.f4v': 'video/x-f4v',
  '.ogv': 'video/ogg',
  '.rm': 'application/vnd.rn-realmedia',
  '.rmvb': 'application/vnd.rn-realmedia-vbr',
  '.vob': 'video/dvd',
  '.asf': 'video/x-ms-asf',
  
  // Audio
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.flac': 'audio/flac',
  '.wma': 'audio/x-ms-wma',
  '.opus': 'audio/opus',
  '.mid': 'audio/midi',
  '.midi': 'audio/midi',
  '.mka': 'audio/x-matroska',
  '.aiff': 'audio/x-aiff',
  '.aif': 'audio/x-aiff',
  '.ra': 'audio/vnd.rn-realaudio',
  '.ram': 'audio/vnd.rn-realaudio',
  
  // Documents
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.txt': 'text/plain',
  '.rtf': 'application/rtf',
  '.csv': 'text/csv',
  '.xml': 'application/xml',
  '.html': 'text/html',
  '.htm': 'text/html',
  '.epub': 'application/epub+zip',
  '.mobi': 'application/x-mobipocket-ebook',
  '.azw': 'application/vnd.amazon.ebook',
  
  // Images
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.tiff': 'image/tiff',
  '.tif': 'image/tiff',
  '.ico': 'image/x-icon',
  '.heic': 'image/heic',
  '.heif': 'image/heif',
  '.psd': 'image/vnd.adobe.photoshop',
  '.ai': 'application/postscript',
  '.eps': 'application/postscript',
  
  // Archives
  '.zip': 'application/zip',
  '.rar': 'application/vnd.rar',
  '.7z': 'application/x-7z-compressed',
  '.tar': 'application/x-tar',
  '.gz': 'application/gzip',
  '.bz2': 'application/x-bzip2',
  '.xz': 'application/x-xz',
  '.lz': 'application/x-lzip',
  '.lzma': 'application/x-lzma',
  
  // Executables
  '.exe': 'application/x-msdownload',
  '.msi': 'application/x-msdownload',
  '.apk': 'application/vnd.android.package-archive',
  '.dmg': 'application/x-apple-diskimage',
  '.deb': 'application/x-debian-package',
  '.rpm': 'application/x-redhat-package-manager',
  
  // Fonts
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.eot': 'application/vnd.ms-fontobject',
  
  // Others
  '.json': 'application/json',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.php': 'application/x-httpd-php',
  '.swf': 'application/x-shockwave-flash',
  '.torrent': 'application/x-bittorrent',
  '.iso': 'application/x-iso9660-image',
  '.bin': 'application/octet-stream',
  '.dat': 'application/octet-stream',
};

// Supported domains (allow all)
const ALLOWED_DOMAINS = [
  '.*' // Allow all domains
];

// Maximum file size to handle (raised to 1GB to allow large media)
const MAX_FILE_SIZE = 4 * 1024 * 1024 * 1024; // 4GB

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fileUrl = searchParams.get('url');
    
    if (!fileUrl) {
      return NextResponse.json(
        { error: 'Missing file URL parameter' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
          }
        }
      );
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(fileUrl);
      
      // Validate protocol
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return NextResponse.json(
          { error: 'Invalid protocol. Only HTTP and HTTPS are allowed.' },
          { 
            status: 400,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, OPTIONS',
            }
          }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
          }
        }
      );
    }

    // Check if domain is allowed (currently allows all)
    const isAllowed = ALLOWED_DOMAINS.some(pattern => {
      if (pattern === '.*') return true; // Allow all domains
      try {
        const regex = new RegExp(pattern);
        return regex.test(parsedUrl.hostname);
      } catch {
        return false;
      }
    });

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Domain not allowed' },
        { 
          status: 403,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
          }
        }
      );
    }

    // Get filename from URL or generate one
    const urlPath = parsedUrl.pathname;
    const filename = decodeURIComponent(urlPath.split('/').pop() || 'download');
    
    // Clean filename from query parameters
    const cleanFilename = filename.split('?')[0].split('#')[0];
    
    // Determine MIME type from extension
    const extensionMatch = cleanFilename.match(/\.[a-zA-Z0-9]+$/);
    const extension = extensionMatch ? extensionMatch[0].toLowerCase() : '';
    const mimeType = MIME_TYPES[extension] || 'application/octet-stream';

    // Select random user agent
    const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

    // Headers for the request
    const headers: HeadersInit = {
      'User-Agent': userAgent,
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
    };

    // Add referer if available
    const referer = parsedUrl.origin;
    if (referer) {
      headers['Referer'] = referer;
    }

    // Add origin header
    headers['Origin'] = referer;

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 seconds timeout

    try {
      // Make HEAD request first to check file size and availability
      const headResponse = await fetch(fileUrl, {
        method: 'HEAD',
        headers,
        redirect: 'follow',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!headResponse.ok) {
        return NextResponse.json(
          { error: `File not accessible: ${headResponse.status} ${headResponse.statusText}` },
          { 
            status: headResponse.status,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, OPTIONS',
            }
          }
        );
      }

      // Check content length if available
      const contentLength = headResponse.headers.get('content-length');
      if (contentLength) {
        const fileSize = parseInt(contentLength, 10);
        if (fileSize > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: `File too large. Maximum size allowed: ${formatBytes(MAX_FILE_SIZE)}` },
            { 
              status: 413,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
              }
            }
          );
        }
      }

      // Check content type
      const contentType = headResponse.headers.get('content-type');
      if (!contentType) {
        console.warn('No content-type header found, using detected MIME type');
      }

      // Now make the actual GET request
      const getController = new AbortController();
      const getTimeoutId = setTimeout(() => getController.abort(), 120000); // 2 minutes for download

      const response = await fetch(fileUrl, {
        headers,
        redirect: 'follow',
        signal: getController.signal,
      });

      clearTimeout(getTimeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      }

      // Get the response body as a stream
      const fileStream = response.body;

      if (!fileStream) {
        throw new Error('No response body received');
      }

      // Get final content type
      const finalContentType = response.headers.get('content-type') || contentType || mimeType;
      const finalContentLength = response.headers.get('content-length') || contentLength || 'unknown';
      
      // Create content disposition header
      let contentDisposition = `attachment; filename="${cleanFilename}"`;
      const serverContentDisposition = response.headers.get('content-disposition');
      if (serverContentDisposition) {
        contentDisposition = serverContentDisposition;
      }

      // Return the file stream with appropriate headers
      return new NextResponse(fileStream, {
        status: 200,
        headers: {
          'Content-Type': finalContentType,
          'Content-Length': finalContentLength,
          'Content-Disposition': contentDisposition,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Expose-Headers': '*',
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Cross-Origin-Resource-Policy': 'cross-origin',
          'Accept-Ranges': 'bytes',
          'X-Content-Type-Options': 'nosniff',
          'X-Proxy-Server': 'ProxyDownloader/1.0',
          'X-Original-URL': fileUrl,
          'X-Filename': cleanFilename,
          'X-File-Size': finalContentLength,
        },
      });

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout. The server took too long to respond.' },
          { 
            status: 408,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, OPTIONS',
            }
          }
        );
      }
      
      throw fetchError;
    }

  } catch (error: any) {
    console.error('Proxy error:', {
      error: error.message,
      stack: error.stack,
      url: request.nextUrl.toString(),
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        error: 'Failed to proxy file',
        message: error.message || 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
        }
      }
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Allow-Credentials': 'true',
      'Vary': 'Origin',
    },
  });
}

// Helper function to format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Handle POST requests if needed in future
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const fileUrl = body.url;
    
    if (!fileUrl) {
      return NextResponse.json(
        { error: 'Missing file URL parameter' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          }
        }
      );
    }
    
    // Redirect to GET endpoint
    const redirectUrl = new URL('/api/proxy/download', request.nextUrl.origin);
    redirectUrl.searchParams.set('url', fileUrl);
    
    return NextResponse.redirect(redirectUrl, 307);
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        }
      }
    );
  }
}
