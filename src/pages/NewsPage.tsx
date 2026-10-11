import React, { useState, useMemo } from 'react';
import {
  RotateCw,
  Database,
  Radio,
  ArrowLeft,
  ChevronDown,
  RefreshCcw,
  ShieldAlert,
  SearchX,
  ExternalLink,
  Globe2,
} from 'lucide-react';
import { BloggerPost, Language, SortOrder } from '../types/blogger';
import { UI_STRINGS, getActiveBloggerUrl, BLOGGER_CATEGORIES, mapLabelToCategory } from '../data/blogger-config';
import { NewsCard } from '../components/NewsCard';
import { NewsSkeleton } from '../components/NewsSkeleton';
import { NewsFilters } from '../components/NewsFilters';
import { CategoryIcon } from '../components/CategoryIcon';

interface NewsPageProps {
  posts: BloggerPost[];
  loading: boolean;
  isCached: boolean;
  cacheTime: number | null;
  error?: string;
  lang: Language;
  initialCategory?: string;
  onRefresh: () => void;
  onNavigate: (path: string) => void;
  onSelectPost: (postId: string) => void;
  onOpenLink?: (url: string, title: string) => void;
}

const POSTS_PER_PAGE = 9;

export const NewsPage: React.FC<NewsPageProps> = ({
  posts,
  loading,
  isCached,
  cacheTime,
  error,
  lang,
  initialCategory = 'all',
  onRefresh,
  onNavigate,
  onSelectPost,
  onOpenLink,
}) => {
  const t = UI_STRINGS[lang];
  const bloggerUrl = getActiveBloggerUrl();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [visibleCount, setVisibleCount] = useState<number>(POSTS_PER_PAGE);

  // Sync when initialCategory prop changes
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Active category object
  const activeCategoryMeta = useMemo(() => {
    return BLOGGER_CATEGORIES.find((c) => c.id === selectedCategory);
  }, [selectedCategory]);

  // Filter & sort logic
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      if (selectedCategory === 'emergency') {
        result = result.filter((p) => p.isEmergency);
      } else {
        result = result.filter((p) =>
          p.categories.some((c) => {
            const mapped = mapLabelToCategory(c);
            return (
              mapped.id === selectedCategory ||
              c.toLowerCase().includes(selectedCategory.toLowerCase())
            );
          })
        );
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.categories.some((c) => c.toLowerCase().includes(q)) ||
          p.author.name.toLowerCase().includes(q)
      );
    }

    // Sort order
    result.sort((a, b) => {
      const timeA = new Date(a.published).getTime();
      const timeB = new Date(b.published).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [posts, selectedCategory, searchQuery, sortOrder]);

  const displayedPosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  };

  const formatLastSync = (ts: number | null) => {
    if (!ts) return '';
    const date = new Date(ts);
    return date.toLocaleTimeString(lang === 'bn' ? 'bn-BD' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button & Page Title Header */}
      <div className="space-y-4">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase">
                {lang === 'bn' ? 'ব্লগার লাইভ ফিড' : 'Blogger Feed Portal'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {activeCategoryMeta
                ? lang === 'bn'
                  ? activeCategoryMeta.bn
                  : activeCategoryMeta.en
                : t.newsAndNotices}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {activeCategoryMeta
                ? lang === 'bn'
                  ? activeCategoryMeta.subtitleBn
                  : activeCategoryMeta.subtitleEn
                : lang === 'bn'
                ? 'মালয়েশিয়ায় অবস্থানরত প্রবাসীদের সকল জরুরি নোটিশ, সার্কুলার ও খবর'
                : 'All announcements, circulars, and updates published directly via Blogger'}
            </p>
          </div>

          {/* Sync & Refresh Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                isCached
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
            >
              {isCached ? (
                <>
                  <Database className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.cachedDataIndicator}</span>
                </>
              ) : (
                <>
                  <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>{t.liveDataIndicator}</span>
                </>
              )}
              {cacheTime && (
                <span className="opacity-75 pl-1 border-l border-current/20">
                  {formatLastSync(cacheTime)}
                </span>
              )}
            </div>

            <button
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
            >
              <RotateCw
                className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin text-emerald-600' : ''}`}
              />
              <span>{loading ? t.refreshing : t.refresh}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Category In-App Portal Banner (if category has official portal URL) */}
      {activeCategoryMeta && activeCategoryMeta.portalUrl && (
        <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 backdrop-blur-xl bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl border border-indigo-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <CategoryIcon name={activeCategoryMeta.iconName} className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {lang === 'bn' ? `অফিসিয়াল পোর্টাল সেবা: ${activeCategoryMeta.bn}` : `Official Portal: ${activeCategoryMeta.en}`}
              </h3>
              <p className="text-xs text-indigo-200">
                {lang === 'bn' ? 'অ্যাপ থেকে বের না হয়ে সরাসরি অফিসিয়াল সার্ভারে স্ট্যাটাস চেক করুন।' : 'Check status directly on the official server inside the app.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenLink && onOpenLink(activeCategoryMeta.portalUrl!, lang === 'bn' ? activeCategoryMeta.bn : activeCategoryMeta.en)}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-2 transition-transform hover:scale-105 shadow-md cursor-pointer"
          >
            <span>{lang === 'bn' ? 'ইন-অ্যাপ পোর্টালে যান' : 'Open In-App Portal'}</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Network error banner with Retry */}
      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <div>
              <p className="font-semibold">{t.errorTitle}</p>
              <p className="text-amber-800/90 text-xs">{error}</p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
          >
            {t.retry}
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <NewsFilters
        lang={lang}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setVisibleCount(POSTS_PER_PAGE);
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setVisibleCount(POSTS_PER_PAGE);
        }}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        totalResults={filteredPosts.length}
      />

      {/* Posts List or Loading */}
      {loading && posts.length === 0 ? (
        <NewsSkeleton count={9} />
      ) : displayedPosts.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPosts.map((post) => (
              <NewsCard
                key={post.id}
                post={post}
                lang={lang}
                onSelect={onSelectPost}
                onOpenLink={onOpenLink}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="pt-4 text-center">
              <button
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <span>{lang === 'bn' ? 'আরও খবর লোড করুন' : 'Load More Articles'}</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <SearchX className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {t.noArticlesTitle}
            </h3>
            <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
              {t.noArticlesDesc}
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs cursor-pointer"
            >
              {lang === 'bn' ? 'সকল ফিল্টার মুছুন' : 'Reset Filters'}
            </button>
            <button
              onClick={onRefresh}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs cursor-pointer"
            >
              {t.refresh}
            </button>
          </div>
        </div>
      )}

      {/* Official Blogger Footer Link */}
      <div className="pt-6 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <span>{lang === 'bn' ? 'সংবাদ প্রকাশের মূল প্ল্যাটফর্ম:' : 'Primary Publishing Platform:'}</span>
          <a
            href={bloggerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 underline font-medium hover:text-emerald-800"
          >
            {bloggerUrl}
          </a>
        </p>
      </div>
    </div>
  );
};

