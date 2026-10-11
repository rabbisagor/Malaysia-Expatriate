import React, { useState } from 'react';
import {
  Bell,
  Globe2,
  Menu,
  X,
  ShieldAlert,
  Newspaper,
  Home,
  Info,
  Lock,
  Download,
} from 'lucide-react';
import { Language } from '../types/blogger';
import { UI_STRINGS } from '../data/blogger-config';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenInstall: () => void;
  onOpenAbout: () => void;
  hasEmergencyNotice?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  currentPath,
  onNavigate,
  onOpenInstall,
  onOpenAbout,
  hasEmergencyNotice,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = UI_STRINGS[lang];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top emergency ribbon if emergency notice is active */}
      {hasEmergencyNotice && (
        <div className="bg-rose-600 text-white text-xs sm:text-sm font-medium py-1.5 px-4 text-center flex items-center justify-center gap-2 animate-pulse">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>
            {lang === 'bn'
              ? 'জরুরি নোটিশ: কুয়ালালামপুর দূতাবাস ও ইমিগ্রেশন সংক্রান্ত বিশেষ সতর্কতা জারী!'
              : 'Emergency Advisory: High Commission & Immigration Notice in Effect!'}
          </span>
          <button
            onClick={() => handleNav('/news?category=emergency')}
            className="underline font-bold ml-2 cursor-pointer hover:text-rose-100"
          >
            {lang === 'bn' ? 'দেখুন' : 'View'}
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="font-bold text-lg sm:text-xl">প্র</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {lang === 'bn' ? 'প্রবাসী সেবা মালয়েশিয়া' : 'Probashi Seba Malaysia'}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  🇲🇾 MY • 🇧🇩 BD
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {lang === 'bn' ? 'ব্লগার চালিত তথ্য ও সহায়তা বাতায়ন' : 'Blogger-Powered Expatriate Portal'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNav('/')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentPath === '/'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{t.home}</span>
            </button>

            <button
              onClick={() => handleNav('/news')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentPath.startsWith('/news') && !currentPath.includes('category=emergency')
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>{t.newsAndNotices}</span>
            </button>

            <button
              onClick={() => handleNav('/news?category=emergency')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentPath.includes('category=emergency')
                  ? 'bg-rose-50 text-rose-700 font-semibold'
                  : 'text-rose-600 hover:bg-rose-50'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{t.emergencyNotices}</span>
            </button>

            <button
              onClick={onOpenAbout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Info className="w-4 h-4" />
              <span>{t.aboutUs}</span>
            </button>

            <button
              onClick={onOpenInstall}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-emerald-700 bg-emerald-100/70 hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200"
            >
              <Download className="w-4 h-4" />
              <span>{t.installApp}</span>
            </button>

            <button
              onClick={() => handleNav('/admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentPath === '/admin'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t.adminLogin}</span>
            </button>
          </nav>

          {/* Language Switcher & Mobile Hamburger */}
          <div className="flex items-center gap-2">
            {/* Language Toggle Button */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => onLanguageChange('bn')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  lang === 'bn'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ENG
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <button
            onClick={() => handleNav('/')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentPath === '/' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>{t.home}</span>
          </button>

          <button
            onClick={() => handleNav('/news')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentPath.startsWith('/news') && !currentPath.includes('category=emergency')
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>{t.newsAndNotices}</span>
          </button>

          <button
            onClick={() => handleNav('/news?category=emergency')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentPath.includes('category=emergency')
                ? 'bg-rose-50 text-rose-700 font-semibold'
                : 'text-rose-600 hover:bg-rose-50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{t.emergencyNotices}</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAbout();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Info className="w-4 h-4" />
            <span>{t.aboutUs}</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenInstall();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
          >
            <Download className="w-4 h-4" />
            <span>{t.installApp}</span>
          </button>

          <button
            onClick={() => handleNav('/admin')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Lock className="w-4 h-4" />
            <span>{t.adminLogin}</span>
          </button>
        </div>
      )}
    </header>
  );
};
