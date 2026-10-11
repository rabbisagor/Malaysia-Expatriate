import DOMPurify from 'dompurify';
import {
  BloggerPost,
  FeedFetchResult,
  FeedMeta,
} from '../types/blogger';
import {
  getActiveBloggerUrl,
  getCacheTtlMs,
  mapLabelToCategory,
} from '../data/blogger-config';

const CACHE_STORAGE_KEY_PREFIX = 'probashi_blogger_posts_cache_';
const CACHE_TIME_KEY_PREFIX = 'probashi_blogger_cache_time_';

// In-memory cache for fast SPA tab navigation
let inMemoryCache: {
  url: string;
  posts: BloggerPost[];
  meta: FeedMeta;
  timestamp: number;
} | null = null;

/**
 * Sanitizes Blogger HTML safely, removing malicious tags, scripts, and attributes
 * while keeping paragraphs, headers, images, blockquotes, and links safe.
 */
export function sanitizeArticleHtml(rawHtml: string): string {
  if (!rawHtml) return '';
  
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'span',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'hr',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'img', 'a', 'figure', 'figcaption'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'title',
      'class', 'width', 'height', 'loading'
    ],
    ADD_ATTR: ['target', 'rel', 'loading'],
  });
}

/**
 * Extracts a high resolution image URL from Blogger post.
 * Blogger thumbnails usually come as /s72-c/ or /w72-h72/. We upgrade them to /s1600/.
 */
function extractBestImageUrl(entry: any): string | null {
  // Check media$thumbnail first
  if (entry.media$thumbnail && entry.media$thumbnail.url) {
    const thumbUrl = entry.media$thumbnail.url;
    // Replace Blogger small thumb tokens with high-resolution image
    return thumbUrl
      .replace(/\/s72(-c)?\//, '/s1600/')
      .replace(/\/w\d+-h\d+(-c)?\//, '/s1600/');
  }

  // Next, inspect content or summary HTML to find first <img src="...">
  const rawHtml = entry.content?.$t || entry.summary?.$t || '';
  if (rawHtml) {
    const match = rawHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Strips HTML tags safely to generate plain text summary
 */
function extractPlainTextSummary(rawHtml: string, maxLength: number = 180): string {
  if (!rawHtml) return '';
  // Remove HTML tags
  const text = rawHtml
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Parses raw Blogger JSON feed entries into safe BloggerPost items
 */
function parseBloggerJsonFeed(data: any): { posts: BloggerPost[]; meta: FeedMeta } {
  const feed = data?.feed;
  if (!feed) {
    throw new Error('Invalid feed structure: feed object missing');
  }

  const meta: FeedMeta = {
    title: feed.title?.$t || 'Probashi Seba Malaysia Updates',
    url: feed.link?.find((l: any) => l.rel === 'alternate')?.href || '',
    totalPosts: parseInt(feed.openSearch$totalResults?.$t || '0', 10),
    lastUpdated: feed.updated?.$t || new Date().toISOString(),
  };

  const entries = feed.entry || [];
  const posts: BloggerPost[] = entries.map((entry: any) => {
    // Extract ID
    const rawId = entry.id?.$t || '';
    const postIdMatch = rawId.match(/post-(\d+)/);
    const id = postIdMatch ? postIdMatch[1] : (entry.id?.$t || Math.random().toString(36).substring(7));

    // Extract Title
    const title = entry.title?.$t || 'শিরোনামহীন নোটিশ';

    // Extract Alternate Link (original Blogger post link)
    const alternateLink = entry.link?.find((l: any) => l.rel === 'alternate')?.href || '';

    // Published & Updated dates
    const published = entry.published?.$t || new Date().toISOString();
    const updated = entry.updated?.$t || published;

    // Author
    const authorName = entry.author?.[0]?.name?.$t || 'প্রবাসী সেবা এডমিন';
    const authorAvatar = entry.author?.[0]?.gd$image?.src;

    // Content and Summary
    const hasFullContent = Boolean(entry.content?.$t && entry.content.$t.trim().length > 0);
    const rawContentHtml = hasFullContent ? entry.content.$t : (entry.summary?.$t || '');
    const sanitizedContent = sanitizeArticleHtml(rawContentHtml);
    
    // Plain text summary
    const summary = entry.summary?.$t 
      ? extractPlainTextSummary(entry.summary.$t, 180) 
      : extractPlainTextSummary(rawContentHtml, 180);

    // Featured Image
    const featuredImage = extractBestImageUrl(entry);

    // Categories / Labels
    const rawLabels: string[] = (entry.category || []).map((cat: any) => cat.term || '').filter(Boolean);
    const categories: string[] = [];
    let isEmergency = false;

    if (rawLabels.length === 0) {
      categories.push('অন্যান্য');
    } else {
      for (const label of rawLabels) {
        const catInfo = mapLabelToCategory(label);
        if (!categories.includes(catInfo.bn)) {
          categories.push(catInfo.bn);
        }
        if (catInfo.isEmergency) {
          isEmergency = true;
        }
      }
    }

    return {
      id,
      title,
      url: alternateLink,
      published,
      updated,
      author: {
        name: authorName,
        avatarUrl: authorAvatar,
      },
      summary,
      content: sanitizedContent,
      isFullContent: hasFullContent,
      featuredImage,
      categories,
      rawLabels,
      isEmergency,
    };
  });

  return { posts, meta };
}

/**
 * Baseline fallback articles for Probashi Seba Malaysia.
 * Used if the configured Blogger site is newly created or while configuring custom blog.
 */
const BASELINE_NOTICES: BloggerPost[] = [
  {
    id: 'notice-emergency-01',
    title: 'জরুরি সতর্কতা: মালয়েশিয়া ইমিগ্রেশনের নতুন সতর্কবার্তা ও ভুয়া এজেন্ট প্রতারণা রোধে নির্দেশনা',
    url: 'https://probashisebamalaysia.blogspot.com',
    published: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated: new Date().toISOString(),
    author: { name: 'হাইকমিশন ডেস্ক' },
    summary: 'মালয়েশিয়ায় অবস্থানরত সকল প্রবাসী বাংলাদেশীদের অবগতির জন্য জানানো যাচ্ছে যে, কোনো প্রকার দালালের মাধ্যমে অবৈধ উপায়ে ভিসা নবায়ন বা পাসপোর্টের কাজ না করার আহ্বান জানানো হয়েছে।',
    content: `
      <p>মালয়েশিয়ায় অবস্থানরত সকল সম্মানিত প্রবাসী বাংলাদেশী ভাই ও বোনদের বিশেষ অবগতির জন্য জানানো যাচ্ছে যে, সম্প্রতি কতিপয় প্রতারক চক্র সামাজিক যোগাযোগ মাধ্যমে ভুয়া ভিসা ও ওয়ার্ক পারমিটের বিজ্ঞাপন দিয়ে অর্থ আত্মসাৎ করছে।</p>
      <h2>হাইকমিশনের পরামর্শ ও নির্দেশনাবলী:</h2>
      <ul>
        <li>কোনো তৃতীয় পক্ষ বা অননুমোদিত এজেন্টের মাধ্যমে পাসপোর্ট ডেলিভারি বা ভিসা রিনিউ করবেন না।</li>
        <li>ইমিগ্রেশন সংক্রান্ত যেকোনো হালনাগাদ তথ্যের জন্য সরাসরি মালয়েশিয়া ইমিগ্রেশনের অফিসিয়াল ওয়েবসাইট বা কুয়ালালামপুরস্থ বাংলাদেশ দূতাবাসের ভেরিফাইড পৃষ্ঠা অনুসরণ করুন।</li>
        <li>অনলাইন এপয়েন্টমেন্ট ব্যতীত দূতাবাসে ভিড় না করার অনুরোধ করা হলো।</li>
      </ul>
      <blockquote>জরুরি আইনি বা কূটনৈতিক সহায়তার জন্য দূতাবাসের হটলাইন: +60 12-345 6789 নম্বরে কল করুন।</blockquote>
    `,
    isFullContent: true,
    featuredImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
    categories: ['জরুরি নোটিশ', 'দূতাবাসের নোটিশ'],
    rawLabels: ['জরুরি নোটিশ', 'দূতাবাস', 'ভিসা'],
    isEmergency: true,
  },
  {
    id: 'notice-visa-02',
    title: 'মালয়েশিয়ায় বিদেশি কর্মীদের ওয়ার্ক পারমিট ও ই-ভিসা যাচাইকরণের সহজ নিয়মাবলী',
    url: 'https://probashisebamalaysia.blogspot.com',
    published: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated: new Date().toISOString(),
    author: { name: 'প্রবাসী সেবা দল' },
    summary: 'আপনার পাসপোর্ট ও ভিসা আসল কিনা তা যাচাই করার অফিসিয়াল পদ্ধতি ও ইমিগ্রেশন পোর্টাল ব্যবহারের নিয়মাবলী বিস্তারিতভাবে দেখে নিন।',
    content: `
      <p>মালয়েশিয়ায় কর্মরত অভিবাসী কর্মীদের জন্য তাদের ভিসার সঠিক মেয়াদ এবং বৈধতা নিশ্চিত করা অত্যন্ত গুরুত্বপূর্ণ। ঘরে বসেই স্মার্টফোনের মাধ্যমে আপনার ভিসার স্ট্যাটাস চেক করা সম্ভব।</p>
      <h2>ভিসা স্ট্যাটাস চেক করার ধাপসমূহ:</h2>
      <ol>
        <li>মালয়েশিয়া ইমিগ্রেশন ডিপার্টমেন্টের পোর্টাল (eservices.imi.gov.my) ভিজিট করুন।</li>
        <li>Query Pas Lawatan Kerja Sementara (PLKS) অপশন নির্বাচন করুন।</li>
        <li>আপনার কোম্পানি বা স্পন্সরের রেজিস্ট্রেশন নম্বর অথবা পাসপোর্ট নম্বর প্রদান করুন।</li>
        <li>সাবমিট বাটনে চাপলে ভিসার মেয়াদ, সেক্টর ও অনুমোদন স্ট্যাটাস প্রদর্শিত হবে।</li>
      </ol>
      <p>সন্দেহজনক কোনো অসঙ্গতি পরিলক্ষিত হলে অবিলম্বে আপনার নিয়োগকর্তা অথবা দূতাবাসের কনস্যুলার শাখায় যোগাযোগ করুন।</p>
    `,
    isFullContent: true,
    featuredImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    categories: ['ভিসা ও ইমিগ্রেশন', 'মালয়েশিয়া সংবাদ'],
    rawLabels: ['ভিসা ও ইমিগ্রেশন', 'মালয়েশিয়া সংবাদ'],
    isEmergency: false,
  },
  {
    id: 'notice-remittance-03',
    title: 'বৈধ পথে রেমিট্যান্স প্রেরণে সরকারি প্রণোদনা ও আজকের মালয়েশিয়ান রিংগিতের বিনিময় হার',
    url: 'https://probashisebamalaysia.blogspot.com',
    published: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated: new Date().toISOString(),
    author: { name: 'ফাইন্যান্স ডেস্ক' },
    summary: 'ব্যাংকিং চ্যানেল ও অনুমোদিত মানি এক্সচেঞ্জের মাধ্যমে দেশে অর্থ প্রেরণে ২.৫% সরকারি প্রণোদনা অব্যাহত রয়েছে। জেনে নিন নিরাপদ রেমিট্যান্স পাঠানোর পদ্ধতি।',
    content: `
      <p>কষ্টার্জিত উপার্জনের অর্থ হুন্ডি বা অবৈধ চ্যানেলে না পাঠিয়ে বৈধ ব্যাংকিং মাধ্যমে পাঠিয়ে দেশের অর্থনীতিতে অবদান রাখুন এবং সরকারি নগদ প্রণোদনা গ্রহণ করুন।</p>
      <h2>বৈধ রেমিট্যান্সের প্রধান সুবিধাসমূহ:</h2>
      <ul>
        <li>প্রতি ১০০ টাকায় আড়াই টাকা (২.৫%) সরকারি তাৎক্ষণিক বোনাস।</li>
        <li>নিরাপদ ও দ্রুততম সময়ে পরিবারের ব্যাংক বা মোবাইল অ্যাকাউন্টে জমা।</li>
        <li>সিআইপি (CIP) মর্যাদা ও প্রবাসী কল্যাণ ব্যাংকের সহজ শর্তে ঋণ সুবিধা।</li>
      </ul>
      <p>মালয়েশিয়ার সেন্ট্রাল ব্যাংক (Bank Negara Malaysia) অনুমোদিত রেমিট্যান্স হাউজ ব্যবহার করুন।</p>
    `,
    isFullContent: true,
    featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    categories: ['রেমিট্যান্স ও কারেন্সি', 'সাধারণ তথ্য'],
    rawLabels: ['রেমিট্যান্স ও কারেন্সি', 'সাধারণ তথ্য'],
    isEmergency: false,
  },
  {
    id: 'notice-medical-04',
    title: 'ফমেমা (FOMEMA) মেডিকেল চেকআপের নতুন নিয়মাবলী ও প্রবাসী কর্মীদের স্বাস্থ্য নির্দেশিকা',
    url: 'https://probashisebamalaysia.blogspot.com',
    published: new Date(Date.now() - 3600000 * 72).toISOString(),
    updated: new Date().toISOString(),
    author: { name: 'স্বাস্থ্য সহায়তা ডেস্ক' },
    summary: 'মালয়েশিয়ায় বার্ষিক ফমেমা মেডিকেল পরীক্ষার সময়সীমা ও প্রয়োজনীয় স্বাস্থ্য সতর্কতা মেনে চলার অনুরোধ জানানো হয়েছে।',
    content: `
      <p>মালয়েশিয়ায় ভিসা নবায়নের পূর্বে FOMEMA এর মাধ্যমে বার্ষিক স্বাস্থ্য পরীক্ষা সম্পন্ন করা বাধ্যতামূলক। সঠিক সময়ে পরীক্ষা সম্পন্ন না করলে ভিসা নবায়নে জটিলতা দেখা দিতে পারে।</p>
      <h2>মেডিকেল সেন্টারে যাওয়ার পূর্ব প্রস্তুতি:</h2>
      <ul>
        <li>পরীক্ষার পূর্বে পর্যাপ্ত বিশ্রাম এবং প্রচুর পানি পান করুন।</li>
        <li>মূল পাসপোর্ট এবং নিয়োগকর্তার প্রেরিত FOMEMA রেজিস্ট্রেশন স্লিপ সাথে রাখুন।</li>
        <li>অনুমোদিত ক্লিনিক ব্যতীত অন্য কোথাও রক্ত বা এক্স-রে করাবেন না।</li>
      </ul>
    `,
    isFullContent: true,
    featuredImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    categories: ['মেডিকেল আপডেট', 'সাধারণ তথ্য'],
    rawLabels: ['মেডিকেল আপডেট'],
    isEmergency: false,
  },
  {
    id: 'notice-embassy-05',
    title: 'কুয়ালালামপুরস্থ বাংলাদেশ হাইকমিশনের ই-পাসপোর্ট সেবা গ্রহণ প্রক্রিয়া ও ছুটির নোটিশ',
    url: 'https://probashisebamalaysia.blogspot.com',
    published: new Date(Date.now() - 3600000 * 96).toISOString(),
    updated: new Date().toISOString(),
    author: { name: 'কনস্যুলার শাখা' },
    summary: 'দূতাবাস প্রাঙ্গণে ই-পাসপোর্টের বায়োমেট্রিক প্রদান এবং পুরাতন এমআরপি পাসপোর্ট নবায়নের জন্য অনলাইন সিরিয়ালের সময়সূচী প্রকাশিত হয়েছে।',
    content: `
      <p>মালয়েশিয়ার বাংলাদেশ হাইকমিশনে প্রতিদিন শত শত প্রবাসী সেবাপ্রার্থীর সুবিধার জন্য ই-পাসপোর্ট আবেদন প্রক্রিয়া সহজ করা হয়েছে।</p>
      <h2>ই-পাসপোর্ট আবেদন করার পদ্ধতি:</h2>
      <ol>
        <li>www.epassport.gov.bd পোর্টালে অনলাইন আবেদন ফরম পূরণ করুন।</li>
        <li>মালয়েশিয়া হাইকমিশনকে মিশন হিসেবে নির্বাচন করুন।</li>
        <li>নির্ধারিত ফি ব্যাংকে পরিশোধ করে রশিদ সংগ্রহ করুন।</li>
        <li>ওয়েবসাইট থেকে অ্যাপয়েন্টমেন্ট তারিখের প্রিন্ট কপি নিয়ে নির্ধারিত সময়ে উপস্থিত হোন।</li>
      </ol>
    `,
    isFullContent: true,
    featuredImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    categories: ['দূতাবাসের নোটিশ', 'সাধারণ তথ্য'],
    rawLabels: ['দূতাবাস', 'পাসপোর্ট'],
    isEmergency: false,
  },
  {
    id: 'notice-jobs-06',
    title: 'BOESL ও BMET এর মাধ্যমে বৈধভাবে মালয়েশিয়ায় নিয়োগ সংক্রান্ত তথ্যাবলী',
    url: 'https://probashisebamalaysia.blogspot.com',
    published: new Date(Date.now() - 3600000 * 120).toISOString(),
    updated: new Date().toISOString(),
    author: { name: 'নিয়োগ ডেস্ক' },
    summary: 'সরকারি প্রতিষ্ঠান বোয়েসেল এবং বিএমইটির মাধ্যমে মালয়েশিয়ায় সরকারিভাবে কর্মী নিয়োগের সর্বশেষ সরকারি সার্কুলার।',
    content: `
      <p>বাংলাদেশ ওভারসিজ এমপ্লয়মেন্ট অ্যান্ড সার্ভিসেস লিমিটেড (বোয়েসেল) এর মাধ্যমে বিভিন্ন প্লান্টেশন ও উৎপাদনশীল খাতে কর্মী প্রেরণের ক্ষেত্রে সতর্ক থাকুন। কোনো দালালের প্রলোভনে পড়বেন না।</p>
      <p>সরকারি খরচ ব্যতীত অতিরিক্ত কোনো অর্থ কাউকে প্রদান করবেন না। বিস্তারিত জানতে boesl.gov.bd ভিজিট করুন।</p>
    `,
    isFullContent: true,
    featuredImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    categories: ['BMET ও BOESL', 'চাকরির খবর'],
    rawLabels: ['BMET', 'BOESL', 'চাকরি'],
    isEmergency: false,
  }
];

/**
 * Blogger Service Class
 */
export class BloggerService {
  /**
   * Reads cached posts from localStorage if available
   */
  private static getStoredCache(bloggerUrl: string): { posts: BloggerPost[]; meta: FeedMeta; timestamp: number } | null {
    if (typeof window === 'undefined') return null;
    try {
      const cacheKey = CACHE_STORAGE_KEY_PREFIX + encodeURIComponent(bloggerUrl);
      const timeKey = CACHE_TIME_KEY_PREFIX + encodeURIComponent(bloggerUrl);
      const rawData = localStorage.getItem(cacheKey);
      const rawTime = localStorage.getItem(timeKey);

      if (rawData && rawTime) {
        const parsed = JSON.parse(rawData);
        const timestamp = parseInt(rawTime, 10);
        return {
          posts: parsed.posts || [],
          meta: parsed.meta || { title: 'Blogger Feed', url: bloggerUrl, totalPosts: 0, lastUpdated: new Date().toISOString() },
          timestamp,
        };
      }
    } catch (e) {
      console.warn('Failed to read blogger cache from localStorage:', e);
    }
    return null;
  }

  /**
   * Saves feed data to localStorage
   */
  private static setStoredCache(bloggerUrl: string, posts: BloggerPost[], meta: FeedMeta): void {
    if (typeof window === 'undefined') return;
    try {
      const cacheKey = CACHE_STORAGE_KEY_PREFIX + encodeURIComponent(bloggerUrl);
      const timeKey = CACHE_TIME_KEY_PREFIX + encodeURIComponent(bloggerUrl);
      const now = Date.now();
      localStorage.setItem(cacheKey, JSON.stringify({ posts, meta }));
      localStorage.setItem(timeKey, now.toString());
      inMemoryCache = {
        url: bloggerUrl,
        posts,
        meta,
        timestamp: now,
      };
    } catch (e) {
      console.warn('Failed to write blogger cache to localStorage:', e);
    }
  }

  /**
   * Clears the Blogger cache
   */
  public static clearCache(): void {
    inMemoryCache = null;
    if (typeof window === 'undefined') return;
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith(CACHE_STORAGE_KEY_PREFIX) || key.startsWith(CACHE_TIME_KEY_PREFIX))) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {
      console.warn('Failed to clear cache:', e);
    }
  }

  /**
   * Fetches feed from Blogger JSON endpoint.
   * Strategy:
   * 1. Direct browser fetch with timeout.
   * 2. If CORS or network error occurs, fallback to internal /api/blogger-feed proxy.
   */
  private static async fetchRawBloggerData(bloggerUrl: string, maxResults: number = 30): Promise<any> {
    const cleanUrl = bloggerUrl.replace(/\/+$/, '');
    const directFeedUrl = `${cleanUrl}/feeds/posts/default?alt=json&max-results=${maxResults}`;

    // Attempt direct fetch first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

      const res = await fetch(directFeedUrl, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        return await res.json();
      }
    } catch (directErr) {
      console.warn('Direct Blogger fetch failed, falling back to /api/blogger-feed proxy:', directErr);
    }

    // Fallback: Use same-origin proxy /api/blogger-feed
    const proxyUrl = `/api/blogger-feed?url=${encodeURIComponent(cleanUrl)}&maxResults=${maxResults}`;
    const proxyController = new AbortController();
    const proxyTimeoutId = setTimeout(() => proxyController.abort(), 8000);

    const proxyRes = await fetch(proxyUrl, {
      signal: proxyController.signal,
    });
    clearTimeout(proxyTimeoutId);

    if (!proxyRes.ok) {
      throw new Error(`Proxy feed error: ${proxyRes.status} ${proxyRes.statusText}`);
    }

    return await proxyRes.json();
  }

  /**
   * Primary method to load posts with intelligent caching, network detection, and fallback
   */
  public static async getPosts(options: {
    forceRefresh?: boolean;
    category?: string;
    searchQuery?: string;
    maxResults?: number;
  } = {}): Promise<FeedFetchResult> {
    const bloggerUrl = getActiveBloggerUrl();
    const ttl = getCacheTtlMs();
    const now = Date.now();

    // 1. Check in-memory cache
    if (!options.forceRefresh && inMemoryCache && inMemoryCache.url === bloggerUrl) {
      if (now - inMemoryCache.timestamp < ttl) {
        return {
          posts: this.filterPosts(inMemoryCache.posts, options.category, options.searchQuery),
          meta: inMemoryCache.meta,
          isCached: true,
          cacheTime: inMemoryCache.timestamp,
        };
      }
    }

    // 2. Check localStorage cache
    const stored = this.getStoredCache(bloggerUrl);
    if (!options.forceRefresh && stored && (now - stored.timestamp < ttl)) {
      inMemoryCache = {
        url: bloggerUrl,
        posts: stored.posts,
        meta: stored.meta,
        timestamp: stored.timestamp,
      };
      return {
        posts: this.filterPosts(stored.posts, options.category, options.searchQuery),
        meta: stored.meta,
        isCached: true,
        cacheTime: stored.timestamp,
      };
    }

    // 3. Attempt live network fetch
    try {
      const rawData = await this.fetchRawBloggerData(bloggerUrl, options.maxResults || 40);
      const parsed = parseBloggerJsonFeed(rawData);

      // If feed returned posts, save cache
      if (parsed.posts.length > 0) {
        this.setStoredCache(bloggerUrl, parsed.posts, parsed.meta);
        return {
          posts: this.filterPosts(parsed.posts, options.category, options.searchQuery),
          meta: parsed.meta,
          isCached: false,
          cacheTime: Date.now(),
        };
      } else {
        // If the blog has 0 posts, blend or return empty
        this.setStoredCache(bloggerUrl, [], parsed.meta);
        return {
          posts: [],
          meta: parsed.meta,
          isCached: false,
          cacheTime: Date.now(),
        };
      }
    } catch (networkErr: any) {
      console.warn('Network error fetching Blogger feed:', networkErr);

      // Fallback A: If we had stored cached posts (even if older than TTL), return them with isCached: true
      if (stored && stored.posts.length > 0) {
        return {
          posts: this.filterPosts(stored.posts, options.category, options.searchQuery),
          meta: stored.meta,
          isCached: true,
          cacheTime: stored.timestamp,
          error: networkErr?.message || 'Failed to sync with live Blogger feed. Showing cached records.',
        };
      }

      // Fallback B: If completely brand new and never fetched, provide baseline sample posts so users see how it works!
      return {
        posts: this.filterPosts(BASELINE_NOTICES, options.category, options.searchQuery),
        meta: {
          title: 'Probashi Seba Malaysia Notices (Offline Mode)',
          url: bloggerUrl,
          totalPosts: BASELINE_NOTICES.length,
          lastUpdated: new Date().toISOString(),
        },
        isCached: true,
        cacheTime: now,
        error: `সংযোগ ত্রুটি: ${networkErr?.message || 'ব্লগার ফিড রেসপন্স দেয়নি'}। অফলাইন ডেটা দেখানো হচ্ছে।`,
      };
    }
  }

  /**
   * Retrieves single article by ID
   */
  public static async getPostById(id: string): Promise<BloggerPost | null> {
    const result = await this.getPosts({ forceRefresh: false });
    const post = result.posts.find((p) => p.id === id);
    if (post) return post;

    // Check baseline notices
    const baseline = BASELINE_NOTICES.find((p) => p.id === id);
    return baseline || null;
  }

  /**
   * Filter posts by category and search query
   */
  private static filterPosts(
    posts: BloggerPost[],
    category?: string,
    searchQuery?: string
  ): BloggerPost[] {
    let filtered = [...posts];

    // Filter by category
    if (category && category !== 'all') {
      filtered = filtered.filter((post) => {
        if (category === 'emergency') {
          return post.isEmergency;
        }
        return post.categories.some((c) => {
          const mapped = mapLabelToCategory(c);
          return mapped.id === category || c.toLowerCase().includes(category.toLowerCase());
        });
      });
    }

    // Filter by search query
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((post) => {
        return (
          post.title.toLowerCase().includes(q) ||
          post.summary.toLowerCase().includes(q) ||
          post.categories.some((c) => c.toLowerCase().includes(q)) ||
          post.author.name.toLowerCase().includes(q)
        );
      });
    }

    return filtered;
  }
}
