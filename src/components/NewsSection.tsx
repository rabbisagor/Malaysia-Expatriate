import React from 'react';
import {
  RotateCw,
  ArrowRight,
  Database,
  Radio,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { BloggerPost, Language } from '../types/blogger';
import { UI_STRINGS, getActiveBloggerUrl } from '../data/blogger-config';
import { NewsCard } from './NewsCard';
import { NewsSkeleton } from './NewsSkeleton';
import { EmergencyBanner } from './EmergencyBanner';

interface NewsSectionProps {
  posts: BloggerPost[];
  loading: boolean;
  isCached: boolean;
  cacheTime: number | null;
  error?: string;
  lang: Language;
  onRefresh: () => void;
  onViewAll: () => void;
  onSelectPost: (postId: string) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  posts,
  loading,
  isCached,
  cacheTime,
  error,
  lang,
  onRefresh,
  onViewAll,
  onSelectPost,
}) => {
  const t = UI_STRINGS[lang];
  const bloggerUrl = getActiveBloggerUrl();

  // Find newest emergency post for top highlight banner
  const emergencyPost = posts.find((p) => p.isEmergency);

  // Take the 6 newest articles for the homepage
  const recentPosts = posts.slice(0, 6);

  const formatLastSync = (ts: number | null) => {
    if (!ts) return '';
    const date = new Date(ts);
    return date.toLocaleTimeString(lang === 'bn' ? 'bn-BD' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Emergency Notice Section if active */}
      {emergencyPost && (
        <div className="mb-6">
          <EmergencyBanner
            post={emergencyPost}
            lang={lang}
            onSelect={onSelectPost}
          />
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase">
              {lang === 'bn' ? 'সরাসরি তথ্যপ্রবাহ' : 'Live Information Feed'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.latestNewsHeading}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {t.latestNewsSub}
          </p>
        </div>

        {/* Controls: Refresh & Feed Status */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* Cache/Live Indicator */}
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

          {/* Manual Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
            title={t.refresh}
          >
            <RotateCw
              className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin text-emerald-600' : ''}`}
            />
            <span>{loading ? t.refreshing : t.refresh}</span>
          </button>
        </div>
      </div>

      {/* Network warning notice if fallback is displayed */}
      {error && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={onRefresh}
            className="shrink-0 font-bold underline hover:text-amber-950 cursor-pointer"
          >
            {t.retry}
          </button>
        </div>
      )}

      {/* News Grid or Skeletons */}
      {loading && posts.length === 0 ? (
        <NewsSkeleton count={6} />
      ) : recentPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <NewsCard
              key={post.id}
              post={post}
              lang={lang}
              onSelect={onSelectPost}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <p className="text-base font-semibold text-slate-800">
            {t.noArticlesTitle}
          </p>
          <p className="text-sm text-slate-500">{t.noArticlesDesc}</p>
        </div>
      )}

      {/* View All Button & Blogger Portal attribution */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
        <a
          href={bloggerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <span>{lang === 'bn' ? 'অফিসিয়াল ব্লগার পোর্টাল:' : 'Official Blogger Site:'}</span>
          <span className="font-mono text-emerald-600 underline truncate max-w-[220px]">
            {bloggerUrl}
          </span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>

        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-emerald-700 text-white hover:bg-emerald-800 shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <span>{t.viewAllNews}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
