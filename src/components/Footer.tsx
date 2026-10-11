import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Shield,
  Heart,
  Lock,
  Download,
  Newspaper,
  Info,
} from 'lucide-react';
import { Language } from '../types/blogger';
import { UI_STRINGS, getActiveBloggerUrl } from '../data/blogger-config';

interface FooterProps {
  lang: Language;
  onNavigate: (path: string) => void;
  onOpenInstall: () => void;
  onOpenAbout: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onNavigate,
  onOpenInstall,
  onOpenAbout,
}) => {
  const t = UI_STRINGS[lang];
  const bloggerUrl = getActiveBloggerUrl();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: About & App */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                প্র
              </div>
              <span className="font-bold text-lg text-white">
                {lang === 'bn' ? 'প্রবাসী সেবা মালয়েশিয়া' : 'Probashi Seba Malaysia'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'মালয়েশিয়ায় কর্মরত প্রবাসী বাংলাদেশীদের জন্য সার্বক্ষণিক তথ্য, পাসপোর্ট, ভিসা ও জরুরি দূতাবাস সার্কুলার প্রদানকারী নির্ভরযোগ্য প্লাটফর্ম।'
                : 'Your dedicated expatriate assistance portal for circulars, consular services, immigration guidance and emergency notices.'}
            </p>

            {/* App Install Option In Footer */}
            <div className="pt-2">
              <button
                onClick={onOpenInstall}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'bn' ? 'মোবাইলে অ্যাপ ইনস্টল করুন' : 'Install Mobile App'}</span>
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {lang === 'bn' ? 'প্রয়োজনীয় লিংক' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/news')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.newsAndNotices}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/news?category=emergency')}
                  className="hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  {t.emergencyNotices}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.aboutUs}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5 text-slate-500"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t.adminLogin}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Government Portals */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {lang === 'bn' ? 'অফিসিয়াল পোর্টালসমূহ' : 'Official Portals'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <a
                  href="https://bdhckl.gov.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>{lang === 'bn' ? 'বাংলাদেশ হাইকমিশন, কুয়ালালামপুর' : 'High Commission of BD, KL'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://eservices.imi.gov.my"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>{lang === 'bn' ? 'মালয়েশিয়া ইমিগ্রেশন ডিপার্টমেন্ট' : 'Immigration Dept. of Malaysia'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.fomema2u.com.my"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>{lang === 'bn' ? 'ফমেমা অনলাইন (FOMEMA)' : 'FOMEMA Healthcare'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="http://www.boesl.gov.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>BOESL / BMET সার্কুলার</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href={bloggerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-medium text-emerald-400"
                >
                  <span>{lang === 'bn' ? 'সরাসরি ব্লগার সাইট ভিজিট' : 'Direct Blogger Site'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Hotlines */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {lang === 'bn' ? 'জরুরি হেল্পলাইন' : 'Emergency Hotlines'}
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>হাইকমিশন কন্ট্রোল রুম:</span>
                </div>
                <p className="text-emerald-300 font-mono">+60 12-345 6789</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-rose-400" />
                  <span>মালয়েশিয়া ইমার্জেন্সি (পুলিশ/অ্যাম্বুলেন্স):</span>
                </div>
                <p className="text-rose-300 font-mono text-sm font-bold">999</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} Probashi Seba Malaysia. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAbout}
              className="hover:text-slate-400 transition-colors cursor-pointer"
            >
              {t.aboutUs}
            </button>
            <span>•</span>
            <button
              onClick={onOpenInstall}
              className="hover:text-slate-400 transition-colors cursor-pointer"
            >
              {t.installApp}
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('/admin')}
              className="hover:text-slate-400 transition-colors cursor-pointer text-slate-400"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
