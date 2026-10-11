export interface BloggerPost {
  id: string; // Clean post ID or URL identifier
  title: string;
  url: string; // Original Blogger post link
  published: string; // ISO date string
  updated: string; // ISO date string
  author: {
    name: string;
    avatarUrl?: string;
  };
  summary: string;
  content: string; // Sanitized HTML
  isFullContent: boolean; // True if full body was returned by feed; false if summary only
  featuredImage: string | null;
  categories: string[]; // Mapped friendly category names
  rawLabels: string[]; // Raw Blogger label strings
  isEmergency: boolean; // Flagged if matching designated emergency category
}

export interface CategoryInfo {
  id: string;
  bn: string;
  en: string;
  iconName: string;
  subtitleBn: string;
  subtitleEn: string;
  imageUrl: string; // Thematic background image for category card
  isEmergency?: boolean;
  color: string;
  glassGradient: string; // Tailwind glass gradient matching BD & MY flags
  portalUrl?: string; // Optional official service link for in-app browser
}

export interface FeedMeta {
  title: string;
  url: string;
  totalPosts: number;
  lastUpdated: string;
}

export interface FeedFetchResult {
  posts: BloggerPost[];
  meta: FeedMeta;
  isCached: boolean;
  cacheTime: number | null;
  error?: string;
}

export type SortOrder = 'newest' | 'oldest';

export type Language = 'bn' | 'en';
