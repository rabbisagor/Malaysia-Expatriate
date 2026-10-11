import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Languages,
  Check,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface BuiltInBrowserViewProps {
  onBack: () => void;
}

export type TranslateLang = 'en' | 'bn' | 'ms';

export const BuiltInBrowserView: React.FC<BuiltInBrowserViewProps> = ({ onBack }) => {
  // Automatically translate to English by default as requested: "অটোমেটিক ইংরেজিতে ট্রান্সলেট হবে"
  const [currentLang, setCurrentLang] = useState<TranslateLang>('en');
  const [loading, setLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  // Endpoint URL based on selected language
  const frameSrc =
    currentLang === 'ms'
      ? 'https://imigresen-online.imi.gov.my/eservices/myPermit?semakStatusPermit'
      : `/api/imi-permit?lang=${currentLang}`;

  const handleLanguageChange = (newLang: TranslateLang) => {
    if (newLang !== currentLang) {
      setLoading(true);
      setCurrentLang(newLang);
      setIframeKey((prev) => prev + 1);
    }
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [iframeKey]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white animate-in fade-in duration-300">
      {/* Native App Bar - Clean, Modern, No browser clutter */}
      <div className="h-16 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 flex items-center justify-between gap-3 shrink-0 shadow-lg">
        {/* Left: Native Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold transition-all cursor-pointer border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          <span>হোম</span>
        </button>

        {/* Center: Title & Verification badge */}
        <div className="text-center truncate px-2">
          <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-white tracking-tight">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">ভিসা স্ট্যাটাস চেক (myPermit)</span>
          </div>
          <p className="text-[10px] text-slate-400 hidden sm:block">
            ইমিগ্রেশন ডিপার্টমেন্ট মালয়েশিয়া
          </p>
        </div>

        {/* Right: Modern Language Translation Selector (বাংলা ও ইংরেজি) */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          {/* English Button (Active by default) */}
          <button
            onClick={() => handleLanguageChange('en')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              currentLang === 'en'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="English translation"
          >
            <span>English</span>
            {currentLang === 'en' && <Check className="w-3 h-3 text-white" />}
          </button>

          {/* Bengali Translation Option - As requested: "ও উপরে বাংলা ট্রান্সলেশন এর অপশন আসবে" */}
          <button
            onClick={() => handleLanguageChange('bn')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              currentLang === 'bn'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="বাংলা ট্রান্সলেশন"
          >
            <span>বাংলা</span>
            {currentLang === 'bn' && <Check className="w-3 h-3 text-white" />}
          </button>

          {/* Original Malay */}
          <button
            onClick={() => handleLanguageChange('ms')}
            className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer hidden md:flex items-center gap-1 ${
              currentLang === 'ms'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Bahasa Melayu (Original)"
          >
            <span>Melayu</span>
          </button>
        </div>
      </div>

      {/* Modern Progress Line Indicator */}
      {loading && (
        <div className="h-0.5 w-full bg-slate-900 overflow-hidden shrink-0">
          <div className="h-full bg-linear-to-r from-blue-500 via-emerald-400 to-amber-400 animate-pulse w-full" />
        </div>
      )}

      {/* Translation State Banner (Subtle & Professional) */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-300 shrink-0">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>
            {currentLang === 'en'
              ? 'Automatic English Translation Active'
              : currentLang === 'bn'
              ? 'বাংলা অনুবাদ সক্রিয় রয়েছে'
              : 'Original Bahasa Melayu'}
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">
          https://imigresen-online.imi.gov.my
        </span>
      </div>

      {/* Full App Viewport - Seamless Built-In View */}
      <div className="flex-1 w-full h-full bg-[#0b1120] relative overflow-hidden flex flex-col">
        <iframe
          key={iframeKey}
          src={frameSrc}
          title="Malaysia Visa Permit Status Check"
          className="w-full flex-1 border-none bg-[#0b1120]"
          onLoad={() => setLoading(false)}
          allow="clipboard-write; fullscreen"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>
    </div>
  );
};
