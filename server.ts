import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Blogger feed proxy endpoint
  app.get('/api/blogger-feed', async (req, res) => {
    try {
      const rawTargetUrl = (req.query.url as string) || '';
      const maxResults = Math.min(Math.max(parseInt((req.query.maxResults as string) || '30', 10), 1), 50);

      if (!rawTargetUrl) {
        return res.status(400).json({ error: 'Missing required "url" parameter.' });
      }

      let parsedUrl: URL;
      try {
        parsedUrl = new URL(rawTargetUrl);
      } catch {
        return res.status(400).json({ error: 'Invalid URL format.' });
      }

      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return res.status(400).json({ error: 'Only HTTP/HTTPS URLs are allowed.' });
      }

      const hostname = parsedUrl.hostname.toLowerCase();
      // Block private IP/loopback
      if (
        hostname === 'localhost' ||
        hostname.startsWith('127.') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('169.254.')
      ) {
        return res.status(403).json({ error: 'Access to private or local network addresses is forbidden.' });
      }

      const cleanBase = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}`.replace(/\/+$/, '');
      const feedTargetUrl = `${cleanBase}/feeds/posts/default?alt=json&max-results=${maxResults}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);

      const upstreamResponse = await fetch(feedTargetUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Probashi-Seba-Feed-Bot/1.0',
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeout);

      if (!upstreamResponse.ok) {
        return res.status(upstreamResponse.status).json({
          error: `Upstream Blogger returned status ${upstreamResponse.status}`,
        });
      }

      const textData = await upstreamResponse.text();
      if (textData.length > 4 * 1024 * 1024) {
        return res.status(413).json({ error: 'Feed response exceeds safe maximum size limit.' });
      }

      const jsonData = JSON.parse(textData);
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
      return res.json(jsonData);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return res.status(504).json({ error: 'Request timed out after 7 seconds.' });
      }
      return res.status(500).json({ error: err.message || 'Internal proxy error' });
    }
  });

  // Health endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  if (!isProd) {
    // Development mode: Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Probashi Seba server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
