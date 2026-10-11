import React from 'react';
import { ShieldAlert, ArrowRight, BellRing, Sparkles } from 'lucide-react';
import { BloggerPost, Language } from '../types/blogger';
import { UI_STRINGS } from '../data/blogger-config';

interface EmergencyBannerProps {
  post: BloggerPost;
  lang: Language;
  onSelect: (postId: string) => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  post,
  lang,
  onSelect,
}) => {
  const t = UI_STRINGS[lang];

  return (
    <div className="relative overflow-hidden bg-linear-to-r from-rose-900 via-rose-800 to-red-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-700/50">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1 space-y-3">
          {/* Badge & Ticker */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/30 text-rose-200 border border-rose-400/40 uppercase tracking-wider backdrop-blur-xs">
              <ShieldAlert className="w-4 h-4 text-rose-300 animate-pulse" />
              {t.emergencyNoticeBadge}
            </span>
            <span className="text-xs text-rose-200/80 font-medium flex items-center gap-1">
              <BellRing className="w-3.5 h-3.5 text-amber-300" />
              {t.importantNoticeAlert}
            </span>
          </div>

          {/* Heading */}
          <h2
            onClick={() => onSelect(post.id)}
            className="text-xl sm:text-2xl font-bold leading-snug hover:text-rose-200 transition-colors cursor-pointer"
          >
            {post.title}
          </h2>

          {/* Summary */}
          <p className="text-sm sm:text-base text-rose-100/90 line-clamp-2 leading-relaxed">
            {post.summary}
          </p>

          <div className="text-xs text-rose-300/80">
            {t.publishedOn}{' '}
            {new Date(post.published).toLocaleDateString(
              lang === 'bn' ? 'bn-BD' : 'en-US',
              { dateStyle: 'long' }
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          <button
            onClick={() => onSelect(post.id)}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-white text-rose-900 hover:bg-rose-50 shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
          >
            <span>{t.readMore}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
