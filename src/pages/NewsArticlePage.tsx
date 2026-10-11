import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  User,
  Share2,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';
import { BloggerPost, Language } from '../types/blogger';
import { UI_STRINGS, mapLabelToCategory } from '../data/blogger-config';

interface NewsArticlePageProps {
  post: BloggerPost | null;
  lang: Language;
  onBack: () => void;
  onSelectCategory?: (category: string) => void;
  onOpenLink?: (url: string, title: string) => void;
}

export const NewsArticlePage: React.FC<NewsArticlePageProps> = ({
  post,
  lang,
  onBack,
  onSelectCategory,
  onOpenLink,
}) => {
  const t = UI_STRINGS[lang];
  const [copied, setCopied] = useState(false);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">
          {lang === 'bn' ? 'প্রতিবেদনটি পাওয়া যায়নি' : 'Article Not Found'}
        </h2>
        <p className="text-slate-500 text-sm">
          {lang === 'bn'
            ? 'হয়তো পোস্টটি মুছে ফেলা হয়েছে অথবা আইডি সঠিক নয়।'
            : 'The requested article may have been removed or the ID is incorrect.'}
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-sm cursor-pointer"
        >
          {t.backToNews}
        </button>
      </div>
    );
  }

  const primaryCategory = post.categories[0] || 'অন্যান্য';
  const categoryMeta = mapLabelToCategory(primaryCategory);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.summary,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (e) {
        // User cancelled or share failed, fallback to copy
      }
    }

    // Fallback: Copy link
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Failed to copy link:', e);
    }
  };

  const handleCopyTitle = async () => {
    try {
      await navigator.clipboard.writeText(post.title);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Failed to copy title:', e);
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Controls: Back button & Share buttons */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToNews}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            title={t.shareArticle}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">{t.linkCopied}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.shareArticle}</span>
              </>
            )}
          </button>

          {/* Copy Title Button */}
          <button
            onClick={handleCopyTitle}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 text-xs font-medium cursor-pointer"
            title="শিরোনাম কপি করুন"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Header Metadata */}
      <div className="space-y-4">
        {/* Category & Emergency Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            onClick={() => onSelectCategory && onSelectCategory(categoryMeta.id)}
            className={`inline-block px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-transform hover:scale-105 shadow-2xs ${
              categoryMeta.isEmergency
                ? 'bg-rose-600 text-white'
                : 'bg-emerald-700 text-white'
            }`}
          >
            {lang === 'bn' ? categoryMeta.bn : categoryMeta.en}
          </span>

          {post.isEmergency && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              {t.emergencyNoticeBadge}
            </span>
          )}

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            {t.sourceBlogger}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
          {post.title}
        </h1>

        {/* Author & Publication Timestamps */}
        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>
              {t.publishedOn} {formatDate(post.published)}
            </span>
          </div>

          {post.author?.name && (
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" />
              <span>
                {t.author} {post.author.name}
              </span>
            </div>
          )}

          {post.updated && post.updated !== post.published && (
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {lang === 'bn' ? 'হালনাগাদ:' : 'Updated:'} {formatDate(post.updated)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-md">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full max-h-[480px] object-cover"
          />
        </div>
      )}

      {/* Full Content vs Summary Honesty Callout */}
      {!post.isFullContent && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-900">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold">
                {lang === 'bn' ? 'সংক্ষেপিত তথ্য প্রদর্শিত হচ্ছে' : 'Summary Feed Only'}
              </h4>
              <p className="text-xs text-amber-800/90 mt-0.5">
                {t.readOriginalDesc}
              </p>
            </div>
          </div>

          {post.url && (
            <button
              type="button"
              onClick={() => {
                if (onOpenLink) {
                  onOpenLink(post.url, post.title);
                } else {
                  window.open(post.url, '_blank');
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 shadow-xs transition-colors cursor-pointer"
            >
              <span>{t.readOriginalArticle}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Article Body - Sanitized with DOMPurify */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
        {post.content ? (
          <div
            className="blogger-article-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          <p className="text-base text-slate-700 leading-relaxed">
            {post.summary}
          </p>
        )}
      </div>

      {/* Article Footer & Official Blogger Attribution */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {lang === 'bn' ? 'সরাসরি মূল সোর্স' : 'Original Source Verification'}
            </h4>
            <p className="text-xs text-slate-500">
              {lang === 'bn'
                ? 'এই প্রতিবেদনটি সরাসরি ব্লগার পাবলিশিং প্ল্যাটফর্ম থেকে সংগৃহীত।'
                : 'This article is served live from the designated Blogger publishing system.'}
            </p>
          </div>

          {post.url && (
            <button
              type="button"
              onClick={() => {
                if (onOpenLink) {
                  onOpenLink(post.url, post.title);
                } else {
                  window.open(post.url, '_blank');
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              <span>{t.readOriginalArticle}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {post.url && (
          <div className="pt-3 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-500 truncate">
            <span className="font-semibold shrink-0">{t.originalUrl}</span>
            <span className="font-mono text-emerald-700 underline truncate">
              {post.url}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Back Button */}
      <div className="pt-2 text-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToNews}</span>
        </button>
      </div>
    </article>
  );
};
