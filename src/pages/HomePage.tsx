import React from 'react';
import { ExternalLink, Newspaper, ShieldCheck } from 'lucide-react';
import { BloggerPost, Language } from '../types/blogger';
import { BLOGGER_CATEGORIES } from '../data/blogger-config';
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
  const visaCategory = BLOGGER_CATEGORIES[0];
  const postCount = posts.length;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-slate-950">
      {/* Floating Flag-Harmonized Ambient Orbs (Malaysia Royal Blue, Red & Bangladesh Green) */}
      <div className="absolute top-1/4 left-1/4 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-rose-600/15 blur-3xl pointer-events-none" />

      {/* Single Category Card: ভিসা চেক (Visa Check) */}
      <div className="w-full max-w-md sm:max-w-lg z-10">
        <div
          onClick={() => onOpenPortal(visaCategory.portalUrl || 'https://eservices.imi.gov.my', visaCategory.bn)}
          className="group relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[440px] flex flex-col justify-between p-6 sm:p-8 border border-white/20 hover:border-blue-400/60 transition-all duration-500 cursor-pointer shadow-2xl hover:shadow-blue-900/40 hover:-translate-y-1 select-none"
        >
          {/* Thematic Background Image */}
          <img
            src={visaCategory.imageUrl}
            alt={visaCategory.bn}
            loading="eager"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />

          {/* Glassmorphic Flag Gradient Scrim */}
          <div
            className={`absolute inset-0 bg-linear-to-t ${visaCategory.glassGradient} opacity-95 group-hover:opacity-90 transition-opacity`}
          />

          {/* Top Row: Icon Badge & Post Indicator */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center backdrop-blur-md bg-blue-600/30 text-blue-200 border border-blue-400/40 shadow-xl group-hover:scale-110 transition-transform">
              <CategoryIcon name={visaCategory.iconName} className="w-7 h-7 sm:w-8 sm:h-8 text-blue-300" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md bg-black/50 text-blue-200 border border-blue-400/30 shadow-xs">
                {lang === 'bn' ? `${postCount} টি নোটিশ` : `${postCount} notices`}
              </span>
            </div>
          </div>

          {/* Center / Bottom: Title, Description & Action Buttons */}
          <div className="relative z-10 space-y-4 pt-8">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'অফিসিয়াল ইমিগ্রেশন পোর্টাল' : 'Official Immigration Portal'}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight group-hover:text-blue-300 transition-colors">
                {lang === 'bn' ? visaCategory.bn : visaCategory.en}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {lang === 'bn' ? visaCategory.subtitleBn : visaCategory.subtitleEn}
              </p>
            </div>

            {/* Direct In-App Actions */}
            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPortal(visaCategory.portalUrl || 'https://eservices.imi.gov.my', visaCategory.bn);
                }}
                className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <span>{lang === 'bn' ? 'সরাসরি ভিসা চেক করুন' : 'Check Visa Online'}</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCategory(visaCategory.id);
                }}
                className="w-full sm:w-auto py-3.5 px-4 rounded-2xl backdrop-blur-md bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/20 transition-all cursor-pointer"
              >
                <Newspaper className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'bn' ? 'নোটিশ' : 'Notices'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
