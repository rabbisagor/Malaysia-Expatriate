import React, { useState } from 'react';
import {
  Search,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { BloggerPost, Language } from '../types/blogger';
import { BLOGGER_CATEGORIES, mapLabelToCategory, UI_STRINGS } from '../data/blogger-config';
import { CategoryIcon } from '../components/CategoryIcon';

interface HomePageProps {
  posts: BloggerPost[];
  lang: Language;
  onSelectCategory: (categoryId: string) => void;
  onOpenPortal: (url: string, title: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  posts,
  lang,
  onSelectCategory,
  onOpenPortal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const t = UI_STRINGS[lang];

  // Calculate post counts per category
  const categoryPostCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of BLOGGER_CATEGORIES) {
      counts[cat.id] = 0;
    }

    for (const post of posts) {
      if (post.isEmergency) {
        counts['emergency'] = (counts['emergency'] || 0) + 1;
      }
      for (const catName of post.categories) {
        const meta = mapLabelToCategory(catName);
        if (meta) {
          counts[meta.id] = (counts[meta.id] || 0) + 1;
        }
      }
    }
    return counts;
  }, [posts]);

  // Check if there is an active emergency post
  const emergencyCount = categoryPostCounts['emergency'] || 0;

  // Filter categories by search query if user types in search
  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return BLOGGER_CATEGORIES;
    const q = searchQuery.toLowerCase().trim();
    return BLOGGER_CATEGORIES.filter(
      (cat) =>
        cat.bn.toLowerCase().includes(q) ||
        cat.en.toLowerCase().includes(q) ||
        cat.subtitleBn.toLowerCase().includes(q) ||
        cat.subtitleEn.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      {/* Dynamic Glassmorphism Ambient Orbs (Malaysia & Bangladesh Flag Colors) */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 rounded-full bg-rose-600/15 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-2/3 right-1/4 w-72 h-72 rounded-full bg-amber-400/15 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Sleek App Banner with Glassmorphism Flag Accent */}
        <div className="relative rounded-3xl p-6 sm:p-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 shadow-xl shadow-slate-900/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            {/* Title & Flag Badges */}
            <div className="text-center md:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md bg-white/70 border border-white/80 text-xs font-bold shadow-xs">
                <span className="flex items-center gap-1 text-slate-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                  বাংলাদেশ 🇧🇩
                </span>
                <span className="text-slate-400">•</span>
                <span className="flex items-center gap-1 text-slate-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-700 inline-block"></span>
                  মালয়েশিয়া 🇲🇾
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {lang === 'bn' ? 'প্রবাসী সেবা ক্যাটাগরি' : 'Probashi Seba Categories'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                {lang === 'bn'
                  ? 'আপনার প্রয়োজনীয় ক্যাটাগরিতে ট্যাপ করে সরাসরি ব্লগার নোটিশ ও সেবা দেখুন।'
                  : 'Tap any category below to browse Blogger notices and official portals inside the app.'}
              </p>
            </div>

            {/* Quick Category Search Input */}
            <div className="w-full md:w-80">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'bn' ? 'ক্যাটাগরি খুঁজুন...' : 'Search categories...'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl backdrop-blur-md bg-white/80 border border-white/90 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 shadow-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Glassmorphism Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCategories.map((cat) => {
            const count = categoryPostCounts[cat.id] || 0;
            const isEmergency = cat.isEmergency;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group relative rounded-3xl p-5 sm:p-6 backdrop-blur-xl bg-white/60 dark:bg-slate-900/50 border transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-2xl hover:-translate-y-1.5 overflow-hidden ${
                  isEmergency
                    ? 'border-rose-400/60 hover:border-rose-500 bg-rose-50/40 ring-1 ring-rose-400/30'
                    : 'border-white/70 hover:border-white hover:bg-white/80 shadow-md shadow-slate-900/5'
                }`}
              >
                {/* Subtle Glass Gradient Glow */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${cat.glassGradient} opacity-20 group-hover:opacity-35 transition-opacity pointer-events-none`}
                />

                <div className="relative z-10 space-y-4">
                  {/* Top Bar: Icon Badge & Post Count */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 ${
                        isEmergency
                          ? 'bg-rose-600 text-white shadow-rose-600/30'
                          : 'bg-linear-to-br from-slate-900 to-slate-800 text-white shadow-slate-900/20'
                      }`}
                    >
                      <CategoryIcon name={cat.iconName} className="w-6 h-6" />
                    </div>

                    {/* Count Indicator */}
                    <div className="flex items-center gap-1.5">
                      {isEmergency && emergencyCount > 0 && (
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                      )}
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md border ${
                          isEmergency
                            ? 'bg-rose-100/80 text-rose-800 border-rose-300'
                            : 'bg-white/80 text-slate-700 border-white/80'
                        }`}
                      >
                        {lang === 'bn' ? `${count} টি নোটিশ` : `${count} posts`}
                      </span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {lang === 'bn' ? cat.bn : cat.en}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {lang === 'bn' ? cat.subtitleBn : cat.subtitleEn}
                    </p>
                  </div>
                </div>

                {/* Bottom Actions: View Blogger Posts & In-App Portal if available */}
                <div className="relative z-10 mt-5 pt-3.5 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                  {/* Primary Action: Open Category Posts */}
                  <span className="inline-flex items-center gap-1 text-emerald-800 group-hover:text-emerald-900">
                    <span>{lang === 'bn' ? 'নোটিশ দেখুন' : 'View Notices'}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>

                  {/* Secondary Action: In-App Portal Link if available */}
                  {cat.portalUrl && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenPortal(cat.portalUrl!, lang === 'bn' ? cat.bn : cat.en);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer text-[11px]"
                      title={lang === 'bn' ? 'অ্যাপে সরাসরি পোর্টাল খুলুন' : 'Open in-app portal'}
                    >
                      <span>{lang === 'bn' ? 'পোর্টাল' : 'Portal'}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
