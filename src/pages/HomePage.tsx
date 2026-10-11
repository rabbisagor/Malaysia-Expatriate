import React from 'react';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { BLOGGER_CATEGORIES } from '../data/blogger-config';
import { CategoryIcon } from '../components/CategoryIcon';

interface HomePageProps {
  onOpenVisaCheck: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenVisaCheck }) => {
  const visaCategory = BLOGGER_CATEGORIES[0];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-slate-950">
      {/* Modern Ambient Fluid Glows (Malaysia Royal Blue, Red, & Bangladesh Green) */}
      <div className="absolute top-1/4 left-1/4 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-blue-600/25 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md sm:max-w-lg z-10">
        {/* Single Modern Glassmorphic Category Card: ভিসা চেক */}
        <div
          onClick={onOpenVisaCheck}
          className="group relative rounded-3xl overflow-hidden min-h-[420px] sm:min-h-[460px] flex flex-col justify-between p-7 sm:p-9 border border-blue-400/40 hover:border-blue-300 transition-all duration-500 cursor-pointer shadow-2xl hover:shadow-blue-600/30 hover:-translate-y-2 select-none"
        >
          {/* Thematic Background Image */}
          <img
            src={visaCategory.imageUrl}
            alt={visaCategory.bn}
            loading="eager"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />

          {/* Deep Glassmorphic Flag Gradient Scrim */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/75 to-blue-950/60 opacity-95 group-hover:opacity-90 transition-opacity" />

          {/* Top Badge: Verified Portal Indicator */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center backdrop-blur-md bg-blue-600/30 text-blue-200 border border-blue-400/40 shadow-xl group-hover:scale-110 group-hover:bg-blue-600/40 transition-all duration-300">
              <CategoryIcon name={visaCategory.iconName} className="w-8 h-8 sm:w-9 sm:h-9 text-blue-300" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full backdrop-blur-md bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>অফিসিয়াল পোর্টাল</span>
            </div>
          </div>

          {/* Content: Title, Subtitle, and Modern Action Trigger */}
          <div className="relative z-10 space-y-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ইমিগ্রেশন ডিপার্টমেন্ট মালয়েশিয়া</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight group-hover:text-blue-300 transition-colors">
                {visaCategory.bn}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {visaCategory.subtitleBn}
              </p>
            </div>

            {/* Tap Action Bar - Direct 1-Touch App Experience */}
            <div className="pt-2">
              <div className="w-full py-4 px-6 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm sm:text-base flex items-center justify-between shadow-xl shadow-blue-600/30 group-hover:from-blue-500 group-hover:to-indigo-500 transition-all">
                <span>চেক করতে এখানে টাচ করুন</span>
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
