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

// Expanded categories specifically tailored for Bangladeshis in Malaysia
// Glassmorphism styling harmonious with Malaysia (Royal Blue, Red, White, Yellow/Gold) and Bangladesh (Bottle Green, Crimson Red) flags
export const BLOGGER_CATEGORIES: CategoryInfo[] = [
  {
    id: 'emergency',
    bn: 'জরুরি নোটিশ',
    en: 'Emergency Notices',
    iconName: 'ShieldAlert',
    subtitleBn: 'জরুরি সতর্কতা ও দূতাবাস বিজ্ঞপ্তি',
    subtitleEn: 'Urgent Notices & High Commission Alerts',
    isEmergency: true,
    color: 'bg-rose-600 text-white',
    glassGradient: 'from-rose-500/20 via-red-600/15 to-amber-500/15 border-rose-400/40 text-rose-950',
  },
  {
    id: 'passport',
    bn: 'পাসপোর্ট ও ডেলিভারি',
    en: 'Passport & Delivery',
    iconName: 'BookOpen',
    subtitleBn: 'ই-পাসপোর্ট, এমআরপি ও ডেলিভারি ট্র্যাকিং',
    subtitleEn: 'E-Passport, MRP & Delivery Status',
    color: 'bg-emerald-600 text-white',
    glassGradient: 'from-emerald-600/20 via-teal-600/15 to-amber-400/15 border-emerald-400/40 text-emerald-950',
    portalUrl: 'https://bdhckl.gov.bd',
  },
  {
    id: 'visa',
    bn: 'ভিসা ও রিক্যালিব্রেশন (RTK)',
    en: 'Visa & Recalibrasi (RTK)',
    iconName: 'Compass',
    subtitleBn: 'ওয়ার্ক পারমিট, পিএলকেএস ও রিক্যালিব্রেশন',
    subtitleEn: 'Work Permit, PLKS & RTK Verification',
    color: 'bg-blue-700 text-white',
    glassGradient: 'from-blue-700/20 via-indigo-600/15 to-emerald-600/15 border-blue-400/40 text-blue-950',
    portalUrl: 'https://eservices.imi.gov.my',
  },
  {
    id: 'immigration',
    bn: 'ইমিগ্রেশন ও স্পেশাল পাস',
    en: 'Immigration & Special Pass',
    iconName: 'Building2',
    subtitleBn: 'মালয়েশিয়া ইমিগ্রেশন ডিপার্টমেন্ট সার্কুলার',
    subtitleEn: 'Malaysia Immigration Dept Circulars',
    color: 'bg-indigo-700 text-white',
    glassGradient: 'from-indigo-800/20 via-red-600/15 to-white/30 border-indigo-400/40 text-indigo-950',
    portalUrl: 'https://www.imi.gov.my',
  },
  {
    id: 'embassy',
    bn: 'হাইকমিশন কুয়ালালামপুর',
    en: 'High Commission KL',
    iconName: 'Landmark',
    subtitleBn: 'কনস্যুলার শাখা, এনওসি ও সত্যায়ন সেবা',
    subtitleEn: 'Consular Branch, NOC & Attestation',
    color: 'bg-emerald-700 text-white',
    glassGradient: 'from-emerald-700/20 via-rose-600/15 to-emerald-600/15 border-emerald-400/40 text-emerald-950',
    portalUrl: 'https://bdhckl.gov.bd',
  },
  {
    id: 'medical',
    bn: 'ফমেমা ও মেডিকেল চেকআপ',
    en: 'FOMEMA & Medical',
    iconName: 'Stethoscope',
    subtitleBn: 'ফমেমা রেজাল্ট, ক্লিনিক তালিকা ও ফিটনেস',
    subtitleEn: 'FOMEMA Results, Clinics & Fit Status',
    color: 'bg-cyan-600 text-white',
    glassGradient: 'from-cyan-600/20 via-blue-600/15 to-white/30 border-cyan-400/40 text-cyan-950',
    portalUrl: 'https://www.fomema2u.com.my',
  },
  {
    id: 'remittance',
    bn: 'রিংগিত রেট ও রেমিট্যান্স',
    en: 'MYR Rate & Remittance',
    iconName: 'BadgeDollarSign',
    subtitleBn: 'বিনিময় হার ও ২.৫% সরকারি প্রণোদনা',
    subtitleEn: 'Exchange Rates & 2.5% Cash Bonus',
    color: 'bg-amber-600 text-white',
    glassGradient: 'from-amber-500/25 via-yellow-400/20 to-emerald-600/15 border-amber-400/50 text-amber-950',
  },
  {
    id: 'jobs',
    bn: 'চাকরির খবর ও বোয়েসেল',
    en: 'Job Circulars & BOESL',
    iconName: 'Briefcase',
    subtitleBn: 'সরকারি ও অনুমোদিত কোম্পানি নিয়োগ',
    subtitleEn: 'Government & Approved Jobs',
    color: 'bg-teal-600 text-white',
    glassGradient: 'from-teal-600/20 via-blue-600/15 to-amber-500/15 border-teal-400/40 text-teal-950',
    portalUrl: 'http://www.boesl.gov.bd',
  },
  {
    id: 'bmet',
    bn: 'বিএমইটি ও প্রবাসী কল্যাণ',
    en: 'BMET & Welfare Fund',
    iconName: 'FileCheck2',
    subtitleBn: 'স্মার্ট কার্ড ও ওয়েজ আর্নার্স কল্যাণ তহবিল',
    subtitleEn: 'Smart Card & Wage Earners Welfare',
    color: 'bg-emerald-800 text-white',
    glassGradient: 'from-emerald-700/20 via-rose-600/15 to-white/30 border-emerald-400/40 text-emerald-950',
    portalUrl: 'http://www.bmet.gov.bd',
  },
  {
    id: 'flights',
    bn: 'বিমান টিকেট ও ভ্রমণ নির্দেশিকা',
    en: 'Flights & Travel Guide',
    iconName: 'Plane',
    subtitleBn: 'এয়ারপোর্ট কাস্টমস, লাগেজ ও ট্রানজিট রুলস',
    subtitleEn: 'Airport Customs, Baggage & Transit Rules',
    color: 'bg-blue-600 text-white',
    glassGradient: 'from-blue-600/20 via-indigo-500/15 to-rose-600/15 border-blue-400/40 text-blue-950',
  },
  {
    id: 'legal',
    bn: 'আইন, জরিমানা ও পুলিশ সহায়তা',
    en: 'Legal Aid & Police Help',
    iconName: 'Scale',
    subtitleBn: 'শ্রমিক আইন, পাওনা আদায় ও আইনি সুরক্ষা',
    subtitleEn: 'Labor Law, Wage Claims & Legal Rights',
    color: 'bg-rose-700 text-white',
    glassGradient: 'from-rose-700/20 via-blue-800/15 to-white/30 border-rose-400/40 text-rose-950',
  },
  {
    id: 'license',
    bn: 'ড্রাইভিং লাইসেন্স ও JPJ',
    en: 'Driving License & JPJ',
    iconName: 'Car',
    subtitleBn: 'লাইসেন্স নবায়ন, যাচাই ও কনভার্সন নিয়ম',
    subtitleEn: 'License Renewal, Check & JPJ Rules',
    color: 'bg-amber-700 text-white',
    glassGradient: 'from-amber-500/20 via-blue-600/15 to-white/30 border-amber-400/40 text-amber-950',
    portalUrl: 'https://www.jpj.gov.my',
  },
  {
    id: 'socso',
    bn: 'সকসো (SOCSO) ও স্বাস্থ্যবীমা',
    en: 'SOCSO Insurance & Health',
    iconName: 'ShieldCheck',
    subtitleBn: 'কর্মক্ষেত্রে দুর্ঘটনা ক্ষতিপূরণ ও দাবি',
    subtitleEn: 'Workplace Accident Compensation',
    color: 'bg-blue-800 text-white',
    glassGradient: 'from-blue-700/20 via-emerald-600/15 to-teal-500/15 border-blue-400/40 text-blue-950',
    portalUrl: 'https://www.perkeso.gov.my',
  },
  {
    id: 'malaysia-news',
    bn: 'মালয়েশিয়া সংবাদ ও আপডেট',
    en: 'Malaysia News & Updates',
    iconName: 'Newspaper',
    subtitleBn: 'মালয়েশিয়ার সর্বশেষ সরকারি ঘোষণা ও খবর',
    subtitleEn: 'Latest National News & Circulars',
    color: 'bg-blue-900 text-white',
    glassGradient: 'from-blue-600/20 via-rose-600/15 to-yellow-500/15 border-blue-400/40 text-blue-950',
  },
  {
    id: 'hotlines',
    bn: 'জরুরি হেল্পলাইন ও নম্বর',
    en: 'Emergency Helplines',
    iconName: 'PhoneCall',
    subtitleBn: 'হাইকমিশন কন্ট্রোল রুম, ৯৯৯ ও হাসপাতাল',
    subtitleEn: 'High Commission 24/7 Desk & 999 Police',
    color: 'bg-red-700 text-white',
    glassGradient: 'from-red-600/20 via-amber-500/20 to-white/30 border-red-400/40 text-red-950',
  },
  {
    id: 'other',
    bn: 'সাধারণ তথ্য ও অন্যান্য',
    en: 'General Guides & Other',
    iconName: 'HelpCircle',
    subtitleBn: 'প্রবাসীদের প্রয়োজনীয় সাধারণ দিকনির্দেশনা',
    subtitleEn: 'General Guidance & Migrant Tips',
    color: 'bg-slate-700 text-white',
    glassGradient: 'from-slate-600/15 via-teal-600/10 to-blue-600/10 border-slate-300/40 text-slate-900',
  },
];

// Helper to map Blogger post label to application category info
export function mapLabelToCategory(rawLabel: string): CategoryInfo {
  const normalized = (rawLabel || '').trim().toLowerCase();
  
  // Emergency notice check
  if (
    normalized.includes('জরুরি') ||
    normalized.includes('জরুরী') ||
    normalized.includes('emergency') ||
    normalized.includes('alert')
  ) {
    return BLOGGER_CATEGORIES[0]; // emergency
  }

  // Passport
  if (
    normalized.includes('পাসপোর্ট') ||
    normalized.includes('passport') ||
    normalized.includes('ডেলিভারি') ||
    normalized.includes('delivery')
  ) {
    return BLOGGER_CATEGORIES[1];
  }

  // Visa & RTK
  if (
    normalized.includes('ভিসা') ||
    normalized.includes('visa') ||
    normalized.includes('রিক্যালিব্রেশন') ||
    normalized.includes('recalibrasi') ||
    normalized.includes('rtk') ||
    normalized.includes('plks')
  ) {
    return BLOGGER_CATEGORIES[2];
  }

  // Immigration & special pass
  if (
    normalized.includes('ইমিগ্রেশন') ||
    normalized.includes('immigration') ||
    normalized.includes('স্পেশাল পাস') ||
    normalized.includes('special pass')
  ) {
    return BLOGGER_CATEGORIES[3];
  }

  // Embassy
  if (
    normalized.includes('দূতাবাস') ||
    normalized.includes('হাইকমিশন') ||
    normalized.includes('embassy') ||
    normalized.includes('high commission') ||
    normalized.includes('কনস্যুলার')
  ) {
    return BLOGGER_CATEGORIES[4];
  }

  // Medical / FOMEMA
  if (
    normalized.includes('মেডিকেল') ||
    normalized.includes('ফমেমা') ||
    normalized.includes('fomema') ||
    normalized.includes('medical') ||
    normalized.includes('স্বাস্থ্য')
  ) {
    return BLOGGER_CATEGORIES[5];
  }

  // Remittance
  if (
    normalized.includes('রেমিট্যান্স') ||
    normalized.includes('কারেন্সি') ||
    normalized.includes('টাকা') ||
    normalized.includes('রিংগিত') ||
    normalized.includes('remittance') ||
    normalized.includes('rate') ||
    normalized.includes('বিনিময়')
  ) {
    return BLOGGER_CATEGORIES[6];
  }

  // Jobs & BOESL
  if (
    normalized.includes('চাকরি') ||
    normalized.includes('কাজের খবর') ||
    normalized.includes('job') ||
    normalized.includes('boesl') ||
    normalized.includes('বোয়েসেল')
  ) {
    return BLOGGER_CATEGORIES[7];
  }

  // BMET
  if (
    normalized.includes('bmet') ||
    normalized.includes('বিএমইটি') ||
    normalized.includes('প্রবাসী কল্যাণ') ||
    normalized.includes('স্মার্ট কার্ড')
  ) {
    return BLOGGER_CATEGORIES[8];
  }

  // Flights / Travel
  if (
    normalized.includes('বিমান') ||
    normalized.includes('টিকেট') ||
    normalized.includes('ভ্রমণ') ||
    normalized.includes('flight') ||
    normalized.includes('travel') ||
    normalized.includes('airport')
  ) {
    return BLOGGER_CATEGORIES[9];
  }

  // Legal & Police
  if (
    normalized.includes('আইন') ||
    normalized.includes('পুলিশ') ||
    normalized.includes('জরিমানা') ||
    normalized.includes('legal') ||
    normalized.includes('law') ||
    normalized.includes('police')
  ) {
    return BLOGGER_CATEGORIES[10];
  }

  // Driving license & JPJ
  if (
    normalized.includes('ড্রাইভিং') ||
    normalized.includes('লাইসেন্স') ||
    normalized.includes('jpj') ||
    normalized.includes('driving')
  ) {
    return BLOGGER_CATEGORIES[11];
  }

  // SOCSO
  if (
    normalized.includes('সকসো') ||
    normalized.includes('socso') ||
    normalized.includes('বীমা') ||
    normalized.includes('insurance') ||
    normalized.includes('perkeso')
  ) {
    return BLOGGER_CATEGORIES[12];
  }

  // Malaysia news
  if (
    normalized.includes('মালয়েশিয়া সংবাদ') ||
    normalized.includes('সংবাদ') ||
    normalized.includes('খবর') ||
    normalized.includes('malaysia') ||
    normalized.includes('news')
  ) {
    return BLOGGER_CATEGORIES[13];
  }

  // Hotlines
  if (
    normalized.includes('হটলাইন') ||
    normalized.includes('হেল্পলাইন') ||
    normalized.includes('hotline') ||
    normalized.includes('contact') ||
    normalized.includes('নম্বর')
  ) {
    return BLOGGER_CATEGORIES[14];
  }

  // Fallback to "অন্যান্য" / "Other"
  return BLOGGER_CATEGORIES[15];
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
