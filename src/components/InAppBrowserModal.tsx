import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  RotateCw,
  Lock,
  Copy,
  Check,
  Share2,
  ExternalLink,
  ShieldCheck,
  Globe2,
} from 'lucide-react';
import { Language } from '../types/blogger';

interface InAppBrowserModalProps {
  isOpen: boolean;
  url: string;
  title: string;
  onClose: () => void;
  lang: Language;
}

export const InAppBrowserModal: React.FC<InAppBrowserModalProps> = ({
  isOpen,
  url,
  title,
  onClose,
  lang,
}) => {
  const [copied, setCopied] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIframeLoaded(false);
      setIframeError(false);
      // Fallback timer: if frame takes longer or is blocked by X-Frame-Options
      const timer = setTimeout(() => {
        setIframeLoaded(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, url, reloadKey]);

  if (!isOpen || !url) return null;

  // Extract clean domain hostname
  let domain = '';
  try {
    domain = new URL(url).hostname.replace('www.', '');
  } catch {
    domain = url;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Failed to copy URL:', e);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (e) {
        // Ignored
      }
    }
    handleCopy();
  };

  const handleReload = () => {
    setIframeLoaded(false);
    setIframeError(false);
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* In-App Browser App Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg shrink-0">
        {/* Back / Close button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">
              {lang === 'bn' ? 'অ্যাপে ফিরে যান' : 'Back to App'}
            </span>
          </button>
        </div>

        {/* Center: Domain & Verified SSL Badge */}
        <div className="flex-1 max-w-md mx-auto text-center truncate px-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-[11px] text-slate-300 font-mono max-w-full truncate">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">{domain}</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 text-[10px] hidden sm:inline truncate">
              {title}
            </span>
          </div>
        </div>

        {/* Right Tools: Reload, Copy, Share */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleReload}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reload"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Copy URL"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Loading Progress Bar */}
      {!iframeLoaded && (
        <div className="h-0.5 w-full bg-slate-800 overflow-hidden">
          <div className="h-full bg-linear-to-r from-emerald-500 via-blue-500 to-amber-400 animate-pulse w-full" />
        </div>
      )}

      {/* Browser Viewport Area */}
      <div className="flex-1 bg-white relative overflow-hidden flex flex-col">
        <iframe
          key={reloadKey}
          src={url}
          title={title}
          className="w-full h-full border-none flex-1"
          onLoad={() => setIframeLoaded(true)}
          onError={() => setIframeError(true)}
          allow="clipboard-write; fullscreen"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />

        {/* In-App Browser Helper Overlay if site limits iframe */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {lang === 'bn'
                ? 'প্রবাসী সেবা ইন-অ্যাপ ব্রাউজার: নিরাপদে অফিসিয়াল পোর্টাল ব্রাউজ করছেন'
                : 'Probashi Seba In-App Browser: Browsing verified official portal'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 underline"
            >
              <span>{lang === 'bn' ? 'সরাসরি সাইট ওপেন করুন' : 'Direct Link'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
