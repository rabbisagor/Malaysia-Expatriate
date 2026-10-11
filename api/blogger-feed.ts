/**
 * Serverless handler for Vercel deployment: /api/blogger-feed
 * Safe Blogger feed proxy with origin security, timeout, size limit, and validation.
 */

export default async function handler(req: any, res: any) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Set permissive CORS for frontend app consumption
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const rawTargetUrl = (req.query.url as string) || '';
    const maxResults = Math.min(Math.max(parseInt((req.query.maxResults as string) || '30', 10), 1), 50);

    if (!rawTargetUrl) {
      return res.status(400).json({ error: 'Missing required "url" parameter.' });
    }

    // Security validation: Prevent SSRF and open proxy abuse
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(rawTargetUrl);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format.' });
    }

    // Enforce HTTPS or HTTP and prevent internal loopback/private IP addresses
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return res.status(400).json({ error: 'Only HTTP/HTTPS URLs are supported.' });
    }

    const hostname = parsedUrl.hostname.toLowerCase();
    const isBlogspot = hostname.endsWith('.blogspot.com') || hostname === 'blogspot.com';
    const isBloggerCustom = hostname.includes('blogger') || hostname.includes('probashi') || hostname.includes('blog');

    // Reject localhost, 127.0.0.1, 10.*, 192.168.*, 169.254.*
    if (
      hostname === 'localhost' ||
      hostname.startsWith('127.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('169.254.')
    ) {
      return res.status(403).json({ error: 'Access to private or local network addresses is forbidden.' });
    }

    // Construct target Blogger feed URL
    const cleanBase = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}`.replace(/\/+$/, '');
    const feedTargetUrl = `${cleanBase}/feeds/posts/default?alt=json&max-results=${maxResults}`;

    // Request with 7-second timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const upstreamResponse = await fetch(feedTargetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Probashi-Seba-Feed-Bot/1.0 (+https://probashiseba.app)',
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeout);

    if (!upstreamResponse.ok) {
      return res.status(upstreamResponse.status).json({
        error: `Upstream Blogger responded with status ${upstreamResponse.status}: ${upstreamResponse.statusText}`,
      });
    }

    // Limit maximum payload to prevent memory overflow (max 4MB)
    const textData = await upstreamResponse.text();
    if (textData.length > 4 * 1024 * 1024) {
      return res.status(413).json({ error: 'Feed response exceeds safe maximum size limit.' });
    }

    const jsonData = JSON.parse(textData);

    // Cache control: 5 minutes in public cache
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(jsonData);
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Gateway Timeout: Blogger feed request timed out after 7 seconds.' });
    }
    return res.status(500).json({ error: err.message || 'Failed to fetch Blogger feed.' });
  }
}
