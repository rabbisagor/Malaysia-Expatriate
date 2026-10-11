import { CategoryInfo } from '../types/blogger';

// Centralized default Blogger URL. Easily replaceable with any real Blogspot or custom Blogger domain.
export const DEFAULT_BLOGGER_SITE_URL = "https://probashisebamalaysia.blogspot.com";

const STORAGE_KEY_BLOGGER_URL = "probashi_blogger_custom_url";
const STORAGE_KEY_CACHE_TTL = "probashi_blogger_cache_ttl";

// Get active Blogger Site URL (checks localStorage override first, then fallback to default)
export function getActiveBloggerUrl(): string {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY_BLOGGER_URL);
    if (saved && saved.trim()) {
      return saved.trim().replace(/\/+$/, '');
    }
  }
  return DEFAULT_BLOGGER_SITE_URL;
}

export function setActiveBloggerUrl(url: string): void {
  if (typeof window !== "undefined") {
    if (!url || !url.trim() || url === DEFAULT_BLOGGER_SITE_URL) {
      localStorage.removeItem(STORAGE_KEY_BLOGGER_URL);
    } else {
      localStorage.setItem(STORAGE_KEY_BLOGGER_URL, url.trim().replace(/\/+$/, ''));
    }
  }
}

// Configurable cache duration in milliseconds (default 5 minutes = 300,000 ms)
export const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000;

export function getCacheTtlMs(): number {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY_CACHE_TTL);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }
  return DEFAULT_CACHE_TTL_MS;
}

// Single category requested by user: 'ভিসা চেক' (Visa Check)
// Glassmorphism styling harmonious with Malaysia (Royal Blue, Red, White, Yellow/Gold) and Bangladesh (Bottle Green, Crimson Red) flags
export const BLOGGER_CATEGORIES: CategoryInfo[] = [
  {
    id: 'visa',
    bn: 'ভিসা চেক',
    en: 'Visa Check',
    iconName: 'Compass',
    subtitleBn: 'মালয়েশিয়া ইমিগ্রেশন ডিপার্টমেন্ট ও ওয়ার্ক পারমিট (PLKS/RTK) যাচাই',
    subtitleEn: 'Malaysia Immigration PLKS & Visa Status Query',
    imageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80',
    color: 'bg-blue-700 text-white',
    glassGradient: 'from-blue-950/85 via-indigo-950/70 to-black/85 border-blue-400/50 text-blue-100',
    portalUrl: 'https://eservices.imi.gov.my',
  },
];

// Helper to map Blogger post label to application category info
export function mapLabelToCategory(_rawLabel: string): CategoryInfo {
  return BLOGGER_CATEGORIES[0];
}

// Translations dictionary for bilingual UI
export const UI_STRINGS = {
  bn: {
    siteTitle: 'প্রবাসী সেবা মালয়েশিয়া',
    siteSubtitle: 'মালয়েশিয়ায় কর্মরত বাংলাদেশী ভাই-বোনদের জন্য নির্ভরযোগ্য তথ্য ও সেবা বাতায়ন',
    home: 'হোম',
    newsAndNotices: 'সংবাদ ও নোটিশ',
    emergencyNotices: 'জরুরি নোটিশ',
    services: 'সেবাসমূহ',
    aboutUs: 'আমাদের সম্পর্কে',
    adminLogin: 'এডমিন প্যানেল',
    latestNewsHeading: 'সর্বশেষ খবর ও নোটিশ',
    latestNewsSub: 'ব্লগার পোর্টাল থেকে সরাসরি হালনাগাদ তথ্যাবলী',
    viewAllNews: 'সব খবর দেখুন',
    readMore: 'বিস্তারিত পড়ুন',
    readOriginalArticle: 'মূল প্রতিবেদন পড়ুন',
    readOriginalDesc: 'ব্লগার ফিডে সংক্ষেপিত তথ্য পাওয়া গেছে। সম্পূর্ণ বিস্তারিত প্রতিবেদনটি মূল ব্লগসাইটে পড়তে নিচের বোতামে ক্লিক করুন।',
    fullContentNotice: 'ব্লগার ওয়েবসাইট থেকে সরাসরি সংগৃহীত পূর্ণাঙ্গ প্রতিবেদন।',
    sourceBlogger: 'Blogger',
    publishedOn: 'প্রকাশিত:',
    author: 'লেখক:',
    searchPlaceholder: 'খবরের শিরোনাম বা বিষয়বস্তু খুঁজুন...',
    allCategories: 'সকল ক্যাটাগরি',
    filterByCategory: 'ক্যাটাগরি অনুযায়ী ফিল্টার',
    sortBy: 'বাছাইক্রম',
    newestFirst: 'নতুন প্রকাশিত আগে',
    oldestFirst: 'পুরনো প্রকাশিত আগে',
    refresh: 'রিফ্রেশ',
    refreshing: 'হালনাগাদ করা হচ্ছে...',
    lastSync: 'সর্বশেষ সিঙ্ক:',
    cachedDataIndicator: 'ক্যাশড ডেটা প্রদর্শিত হচ্ছে',
    liveDataIndicator: 'সরাসরি ডেটা প্রদর্শিত হচ্ছে',
    noArticlesTitle: 'কোনো খবর পাওয়া যায়নি',
    noArticlesDesc: 'আপনার অনুসন্ধানের সাথে মিলে এমন কোনো পোস্ট পাওয়া যায়নি। অনুগ্রহ করে অনুসন্ধান শর্ত পরিবর্তন করে চেষ্টা করুন।',
    errorTitle: 'সংবাদ ও নোটিশ লোড করতে সমস্যা হচ্ছে',
    errorDesc: 'ব্লগার ফিডের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করুন অথবা পুনরায় চেষ্টা করুন।',
    retry: 'পুনরায় চেষ্টা করুন',
    backToNews: 'সকল খবরে ফিরে যান',
    shareArticle: 'শেয়ার করুন',
    linkCopied: 'লিঙ্ক কপি করা হয়েছে!',
    originalUrl: 'মূল সোর্স লিঙ্ক:',
    emergencyNoticeBadge: 'জরুরি নোটিশ',
    importantNoticeAlert: 'গুরুত্বপূর্ণ সতর্কতা ও জরুরি নির্দেশনা',
    installApp: 'অ্যাপ ইনস্টল করুন',
    installAppDesc: 'মোবাইলে সহজে ব্যবহার করতে প্রবাসী সেবা অ্যাপটি আপনার ডিভাইসে ইনস্টল করুন।',
    installBtn: 'ইনস্টল করুন',
    quickHotlines: 'জরুরি হটলাইন নম্বর',
    embassyKualaLumpur: 'বাংলাদেশ হাইকমিশন, কুয়ালালামপুর',
    passportHelp: 'পাসপোর্ট সংক্রান্ত হেল্পলাইন',
    legalHelp: 'আইনি সহায়তা ডেস্ক',
  },
  en: {
    siteTitle: 'Probashi Seba Malaysia',
    siteSubtitle: 'Reliable information & services portal for expatriate Bangladeshis in Malaysia',
    home: 'Home',
    newsAndNotices: 'News & Notices',
    emergencyNotices: 'Emergency Notices',
    services: 'Services',
    aboutUs: 'About Us',
    adminLogin: 'Admin Panel',
    latestNewsHeading: 'Latest News and Notices',
    latestNewsSub: 'Real-time updates directly from our Blogger publishing portal',
    viewAllNews: 'View All News',
    readMore: 'Read More',
    readOriginalArticle: 'Read Original Article',
    readOriginalDesc: 'Only a summary was provided in the Blogger feed. Click below to view the complete article on the official blog.',
    fullContentNotice: 'Full article body retrieved directly from the Blogger website.',
    sourceBlogger: 'Blogger',
    publishedOn: 'Published:',
    author: 'Author:',
    searchPlaceholder: 'Search news by title or content...',
    allCategories: 'All Categories',
    filterByCategory: 'Filter by category',
    sortBy: 'Sort by',
    newestFirst: 'Newest first',
    oldestFirst: 'Oldest first',
    refresh: 'Refresh',
    refreshing: 'Refreshing...',
    lastSync: 'Last synced:',
    cachedDataIndicator: 'Cached data displayed',
    liveDataIndicator: 'Live data displayed',
    noArticlesTitle: 'No articles found',
    noArticlesDesc: 'No posts matched your search criteria. Please adjust your query or category filter.',
    errorTitle: 'Unable to load news and notices',
    errorDesc: 'Could not connect to the Blogger feed. Please verify your network connection and try again.',
    retry: 'Try Again',
    backToNews: 'Back to all news',
    shareArticle: 'Share',
    linkCopied: 'Link copied to clipboard!',
    originalUrl: 'Original source link:',
    emergencyNoticeBadge: 'Emergency Notice',
    importantNoticeAlert: 'Important Notice & Urgent Advisory',
    installApp: 'Install App',
    installAppDesc: 'Install the Probashi Seba app on your phone for instant notifications and faster access.',
    installBtn: 'Install Now',
    quickHotlines: 'Emergency Hotlines',
    embassyKualaLumpur: 'Bangladesh High Commission, Kuala Lumpur',
    passportHelp: 'Passport Service Helpline',
    legalHelp: 'Legal Aid Desk',
  }
};
