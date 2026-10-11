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

  // Malaysia Immigration Permit Status Proxy & Auto-Translator
  app.get('/api/imi-permit', async (req, res) => {
    try {
      const targetLang = (req.query.lang as string) || 'en'; // 'en' default or 'bn'
      const imiUrl = 'https://imigresen-online.imi.gov.my/eservices/myPermit?semakStatusPermit';

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 9000);

      const upstreamRes = await fetch(imiUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,ms;q=0.8',
        },
      });

      clearTimeout(timeout);

      let html = await upstreamRes.text();

      // Rewrite relative URLs to absolute so CSS, scripts, and images load properly
      html = html.replace(/href="\/(eservices\/[^"]+)"/g, 'href="https://imigresen-online.imi.gov.my/$1"');
      html = html.replace(/src="\/(eservices\/[^"]+)"/g, 'src="https://imigresen-online.imi.gov.my/$1"');
      html = html.replace(/action="\/([^"]+)"/g, 'action="https://imigresen-online.imi.gov.my/$1"');

      // Dictionary of translations from Malay to English and Bengali
      const dictionary: Record<string, { en: string; bn: string }> = {
        'SEMAKAN STATUS PERMOHONAN PAS LAWATAN KERJA SEMENTARA (PLKS)': {
          en: 'APPLICATION STATUS CHECK FOR TEMPORARY EMPLOYMENT PASS (PLKS)',
          bn: 'অস্থায়ী কর্মসংস্থান ভিজিট পাস (PLKS) আবেদন স্ট্যাটাস যাচাই',
        },
        'No. Rujukan': {
          en: 'Reference Number (Application No.)',
          bn: 'রেফারেন্স নম্বর (আবেদন নম্বর)',
        },
        'Warganegara': {
          en: 'Nationality / Country',
          bn: 'জাতীয়তা (দেশ)',
        },
        'No. MyKad Penaja / No. Pasport Penaja': {
          en: 'Employer MyKad / Sponsor Passport / ROC No.',
          bn: 'নিয়োগকর্তার মাইকাড / স্পনসর পাসপোর্ট / কোম্পানি রেজিস্ট্রেশন নম্বর',
        },
        'Carian': {
          en: 'Check Status / Search',
          bn: 'স্ট্যাটাস চেক করুন (Search)',
        },
        'Set Semula': {
          en: 'Reset',
          bn: 'রিসেট করুন',
        },
        'Sila Penuhkan Ruangan Borang Sebelum Membuat Semakan': {
          en: 'Please fill in all form fields before checking.',
          bn: 'যাচাই করার পূর্বে অনুগ্রহ করে ফরমের ঘরগুলো পূরণ করুন।',
        },
        'Sila Masukkan No Rujukan & My Kad Penaja': {
          en: 'Please enter Reference No & Sponsor MyKad.',
          bn: 'অনুগ্রহ করে রেফারেন্স নম্বর ও স্পনসরের মাইকাড নম্বর দিন।',
        },
        'HANYA 1 KALI CETAKAN SAHAJA DIBENARKAN': {
          en: 'ONLY 1 TIME PRINTING IS ALLOWED.',
          bn: 'শুধুমাত্র ১ বার প্রিন্ট করার অনুমতি রয়েছে।',
        },
        'Sila pastikan maklumat yang dimasukkan adalah tepat.': {
          en: 'Please make sure all entered information is accurate.',
          bn: 'প্রদত্ত তথ্য সঠিক কিনা অনুগ্রহ করে নিশ্চিত করুন।',
        },
        'Laman Web Rasmi Jabatan Imigresen Malaysia': {
          en: 'Official Website of the Immigration Department of Malaysia',
          bn: 'মালয়েশিয়া ইমিগ্রেশন ডিপার্টমেন্টের অফিসিয়াল ওয়েবসাইট',
        },
        'Hakcipta Terpelihara': {
          en: 'All Rights Reserved',
          bn: 'সর্বস্বত্ব সংরক্ষিত',
        },
      };

      // Perform text replacement based on requested language
      for (const [malay, trans] of Object.entries(dictionary)) {
        const replacement = targetLang === 'bn' ? trans.bn : trans.en;
        html = html.split(malay).join(replacement);
      }

      // Inject custom mobile-first CSS into the head
      const customStyle = `
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Hind Siliguri', sans-serif !important;
            background-color: #0b1120 !important;
            color: #f1f5f9 !important;
            padding-bottom: 40px !important;
          }
          .container, .main-content, .panel, .form-horizontal {
            background-color: rgba(15, 23, 42, 0.95) !important;
            border-radius: 1.25rem !important;
            border: 1px solid rgba(56, 189, 248, 0.2) !important;
            color: #f8fafc !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
          }
          input.form-control, select.form-control {
            background-color: #1e293b !important;
            border: 1px solid #334155 !important;
            color: #ffffff !important;
            border-radius: 0.75rem !important;
            padding: 10px 14px !important;
            font-size: 15px !important;
          }
          input.form-control:focus, select.form-control:focus {
            border-color: #38bdf8 !important;
            outline: none !important;
            box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25) !important;
          }
          .btn-primary, button[type="submit"], input[type="submit"] {
            background: linear-gradient(135deg, #0284c7, #2563eb) !important;
            border: none !important;
            border-radius: 0.75rem !important;
            padding: 12px 24px !important;
            font-weight: 700 !important;
            color: #ffffff !important;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4) !important;
          }
          .btn-warning, input[type="reset"] {
            background-color: #334155 !important;
            border: 1px solid #475569 !important;
            border-radius: 0.75rem !important;
            color: #cbd5e1 !important;
          }
          label, .control-label {
            color: #93c5fd !important;
            font-weight: 600 !important;
            margin-bottom: 6px !important;
          }
          /* Hide bloated header/footer clutter from the official portal to make it look like a clean app */
          header, .top-header, .header-top, footer, .sub-footer, #header, #footer, .navbar {
            display: none !important;
          }
        </style>
      `;

      html = html.replace('</head>', `${customStyle}</head>`);

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('X-Frame-Options', 'ALLOWALL');
      return res.send(html);
    } catch (err: any) {
      return res.status(500).send(`
        <div style="font-family: sans-serif; text-align: center; padding: 40px; color: #fff; background: #0f172a; min-height: 100vh;">
          <h2>ইমিগ্রেশন সার্ভার সংযোগ বিলম্বিত</h2>
          <p>মালয়েশিয়া ইমিগ্রেশন সার্ভারে সরাসরি সংযোগ হচ্ছে... অনুগ্রহ করে কয়েক সেকেন্ড অপেক্ষা করুন।</p>
        </div>
      `);
    }
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
