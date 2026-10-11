import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Smartphone,
  CheckCircle2,
  Share2,
  PlusSquare,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types/blogger';

interface AppInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AppInstallModal: React.FC<AppInstallModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Show Android/browser Add to Home Screen alert
      alert(
        lang === 'bn'
          ? 'ব্রাউজারের ডানপাশের ৩-ডট (⋮) মেনু চেপে "Add to Home screen" বা "অ্যাপ ইনস্টল করুন" চাপুন।'
          : 'Tap the 3-dots (⋮) browser menu and select "Add to Home screen" or "Install App".'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
            <Smartphone className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              {lang === 'bn' ? 'প্রবাসী সেবা অ্যাপ ইনস্টল করুন' : 'Install Probashi Seba App'}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {lang === 'bn'
                ? 'আপনার স্মার্টফোনে দ্রুত নোটিশ ও ইমিগ্রেশন আপডেট পেতে অ্যাপটি সরাসরি ইনস্টল করুন।'
                : 'Install our web app directly on your device for instant notices and one-tap access.'}
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2.5 text-xs sm:text-sm text-slate-700">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {lang === 'bn'
                  ? 'কোনো প্লে-স্টোর অ্যাকাউন্ট ছাড়াই সরাসরি ইনস্টল'
                  : 'Direct installation without Play Store dependency'}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {lang === 'bn'
                  ? 'জরুরি নোটিশ ও নতুন সার্কুলার এর সাথে সাথে আপডেট'
                  : 'Real-time sync with latest Blogger notices'}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {lang === 'bn'
                  ? 'অফলাইনেও ক্যাশড নোটিশ পড়ার সুবিধা'
                  : 'Read cached news & notices even when offline'}
              </span>
            </div>
          </div>

          {/* Quick instructions for Android / iPhone */}
          <div className="text-left border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs text-slate-600">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === 'bn' ? 'কীভাবে ইনস্টল করবেন:' : 'How to install:'}</span>
            </div>
            <p>
              <strong>Android (Chrome):</strong>{' '}
              {lang === 'bn'
                ? 'উপরের তিনটি ডট (⋮) এ চাপ দিন এবং "Add to Home screen" নির্বাচন করুন।'
                : 'Tap top 3 dots (⋮) and choose "Add to Home screen".'}
            </p>
            <p>
              <strong>iPhone (Safari):</strong>{' '}
              {lang === 'bn'
                ? 'নিচের শেয়ার (Share) বাটনে চেপে "Add to Home Screen" (+) এ ট্যাপ করুন।'
                : 'Tap the Share icon at bottom and select "Add to Home Screen".'}
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleInstallClick}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>
                {installed
                  ? lang === 'bn'
                    ? 'ইনস্টল সম্পন্ন হয়েছে!'
                    : 'Installed Successfully!'
                  : lang === 'bn'
                  ? 'এখনই অ্যাপ ইনস্টল করুন'
                  : 'Install Web App Now'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
