import React from 'react';
import { Calendar, User, ArrowRight, ExternalLink, ShieldAlert } from 'lucide-react';
import { BloggerPost, Language } from '../types/blogger';
import { UI_STRINGS, mapLabelToCategory } from '../data/blogger-config';

interface NewsCardProps {
  post: BloggerPost;
  lang: Language;
  onSelect: (postId: string) => void;
  onOpenLink?: (url: string, title: string) => void;
  featured?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  post,
  lang,
  onSelect,
  onOpenLink,
  featured = false,
}) => {
  const t = UI_STRINGS[lang];

  // Format date nicely
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return isoString;
      return date.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const primaryCategory = post.categories[0] || 'অন্যান্য';
  const categoryMeta = mapLabelToCategory(primaryCategory);

  // Fallback cover gradient or image
  const defaultImage =
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80';

  return (
    <article
      onClick={() => onSelect(post.id)}
      className={`group relative bg-white rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 ${
        post.isEmergency
          ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-300'
          : 'border-slate-200 hover:border-emerald-300'
      } ${featured ? 'md:grid md:grid-cols-12 md:gap-6' : ''}`}
    >
      {/* Thumbnail area */}
      <div
        className={`relative overflow-hidden bg-slate-100 ${
          featured ? 'md:col-span-5 h-56 md:h-full min-h-[220px]' : 'h-48 w-full'
        }`}
      >
        <img
          src={post.featuredImage || defaultImage}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback if image fails to load
            (e.currentTarget as HTMLImageElement).src = defaultImage;
          }}
        />

        {/* Source Badge & Emergency indicator */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-800 shadow-xs backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            {t.sourceBlogger}
          </span>
          {post.isEmergency && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-xs animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5" />
              {t.emergencyNoticeBadge}
            </span>
          )}
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3">
          <span
            className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold shadow-xs ${
              categoryMeta.isEmergency
                ? 'bg-rose-600 text-white'
                : 'bg-emerald-700 text-white'
            }`}
          >
            {lang === 'bn' ? categoryMeta.bn : categoryMeta.en}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div
        className={`p-5 flex flex-col justify-between flex-1 ${
          featured ? 'md:col-span-7' : ''
        }`}
      >
        <div>
          {/* Metadata: Date & Author */}
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-2.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDate(post.published)}</span>
            </span>
            {post.author?.name && (
              <span className="flex items-center gap-1 truncate max-w-[120px]">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.author.name}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className={`font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug ${
              featured ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
            }`}
          >
            {post.title}
          </h3>

          {/* Summary */}
          <p className="mt-2.5 text-xs sm:text-sm text-slate-600 line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {post.summary}
          </p>
        </div>

        {/* Action Button: Read More */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-emerald-700 group-hover:text-emerald-800">
            <span>{t.readMore}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>

          {post.url && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenLink) {
                  onOpenLink(post.url, post.title);
                } else {
                  window.open(post.url, '_blank');
                }
              }}
              title={t.readOriginalArticle}
              className="text-slate-400 hover:text-emerald-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
