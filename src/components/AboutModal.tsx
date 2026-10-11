import React from 'react';
import {
  X,
  Info,
  ShieldCheck,
  Download,
  PhoneCall,
  HeartHandshake,
  ExternalLink,
} from 'lucide-react';
import { Language } from '../types/blogger';
import { getActiveBloggerUrl } from '../data/blogger-config';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInstall: () => void;
  lang: Language;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onOpenInstall,
  lang,
}) => {
  if (!isOpen) return null;
  const bloggerUrl = getActiveBloggerUrl();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Probashi Seba Malaysia'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                {lang === 'bn'
                  ? 'মালয়েশিয়ায় প্রবাসী ভাই-বোনদের বিশ্বস্ত তথ্য ও সেবা সাথী'
                  : 'Empowering Bangladeshi Expatriates in Malaysia'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="text-sm text-slate-700 leading-relaxed space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <p>
              {lang === 'bn'
                ? 'প্রবাসী সেবা মালয়েশিয়া হলো একটি অরাজনৈতিক, সামাজিক ও মানবিক তথ্য বাতায়ন। মালয়েশিয়ায় অবস্থানরত ৮ লক্ষাধিক বাংলাদেশী কর্মজীবী ভাই-বোনদের সঠিক ভিসা আপডেট, পাসপোর্ট নবায়ন, আইনি অধিকার এবং কুয়ালালামপুরস্থ বাংলাদেশ হাইকমিশনের জরুরি সার্কুলার সহজে পৌঁছে দেওয়ার লক্ষ্যে এটি পরিচালিত হয়।'
                : 'Probashi Seba Malaysia is a dedicated expatriate welfare and public information portal. It provides timely updates on visa renewals, passports, immigration regulations, workers’ rights, and High Commission notices for Bangladeshi workers in Malaysia.'}
            </p>
            <p>
              {lang === 'bn'
                ? 'আমাদের সমস্ত সংবাদ ও নোটিশ সরাসরি ব্লগার (Blogger) পাবলিশিং সিস্টেমের মাধ্যমে নিয়মিত হালনাগাদ করা হয়, যা কোনো মধ্যস্বত্বভোগী বা দালালের মিথ্যা তথ্য ছড়ানো থেকে প্রবাসীদের সুরক্ষা প্রদান করে।'
                : 'All news and announcements are published via Blogger and delivered live through this application to prevent misinformation and keep the community accurately informed.'}
            </p>
          </div>

          {/* Key pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <ShieldCheck className="w-5 h-5 text-emerald-700 mb-1" />
              <h4 className="text-xs font-bold text-slate-900">
                {lang === 'bn' ? 'সরাসরি সরকারি তথ্য' : 'Verified Notices'}
              </h4>
              <p className="text-[11px] text-slate-600 mt-1">
                {lang === 'bn' ? 'দূতাবাস ও ইমিগ্রেশন থেকে সরাসরি' : 'Official mission circulars'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-100">
              <HeartHandshake className="w-5 h-5 text-teal-700 mb-1" />
              <h4 className="text-xs font-bold text-slate-900">
                {lang === 'bn' ? 'দালালমুক্ত সেবা' : 'Fraud Prevention'}
              </h4>
              <p className="text-[11px] text-slate-600 mt-1">
                {lang === 'bn' ? 'ভুয়া ভিসার ফাঁদ থেকে রক্ষা' : 'Protection from fake agents'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100">
              <PhoneCall className="w-5 h-5 text-blue-700 mb-1" />
              <h4 className="text-xs font-bold text-slate-900">
                {lang === 'bn' ? 'জরুরি সহায়তা' : '24/7 Helpline'}
              </h4>
              <p className="text-[11px] text-slate-600 mt-1">
                {lang === 'bn' ? 'হাইকমিশন ও আইনি ডেস্ক নম্বর' : 'Consular hotline directory'}
              </p>
            </div>
          </div>

          {/* PROMINENT APP INSTALL SECTION - REQUIRED BY USER PROMPT */}
          <div className="bg-linear-to-r from-emerald-700 to-teal-800 text-white rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-200 text-xs font-bold uppercase">
                <Download className="w-4 h-4" />
                <span>{lang === 'bn' ? 'মোবাইল অ্যাপ সংস্করণ' : 'Mobile App Edition'}</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold">
                {lang === 'bn'
                  ? 'প্রবাসী সেবা অ্যাপ আপনার ফোনে ইনস্টল করুন'
                  : 'Install Probashi Seba App On Your Phone'}
              </h4>
              <p className="text-xs text-emerald-100/90">
                {lang === 'bn'
                  ? 'এক ক্লিকে নোটিশ দেখতে ও ব্রাউজার ছাড়া সহজে ব্যবহারের জন্য এখনই অ্যাপ যুক্ত করুন।'
                  : 'Fast, offline-friendly access directly from your smartphone home screen.'}
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenInstall();
              }}
              className="px-5 py-3 rounded-xl bg-white text-emerald-800 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-all shrink-0 shadow-md cursor-pointer flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'bn' ? 'অ্যাপ ইনস্টল করুন' : 'Install App'}</span>
            </button>
          </div>

          {/* Blogger Source Info */}
          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span>
              {lang === 'bn' ? 'ব্লগার পোর্টাল:' : 'Blogger Portal:'}{' '}
              <a
                href={bloggerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 font-medium underline inline-flex items-center gap-1"
              >
                {bloggerUrl}
                <ExternalLink className="w-3 h-3" />
              </a>
            </span>
            <span>Version 2.4.0 (2026 Edition)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
