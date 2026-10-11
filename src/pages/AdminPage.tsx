import React, { useState } from 'react';
import {
  Lock,
  Globe,
  Database,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  BookOpen,
  ArrowRight,
  RefreshCw,
  LogOut,
  Save,
  Tag,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { Language } from '../types/blogger';
import {
  DEFAULT_BLOGGER_SITE_URL,
  getActiveBloggerUrl,
  setActiveBloggerUrl,
  BLOGGER_CATEGORIES,
} from '../data/blogger-config';
import { BloggerService } from '../lib/bloggerService';

interface AdminPageProps {
  lang: Language;
  onRefreshAll: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ lang, onRefreshAll }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('probashi_admin_auth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Blogger URL configuration state
  const [bloggerUrlInput, setBloggerUrlInput] = useState(getActiveBloggerUrl());
  const [urlSavedSuccess, setUrlSavedSuccess] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'testing' | 'success' | 'error';
    message?: string;
    postCount?: number;
    responseTime?: number;
  }>({ status: 'idle' });

  // GitHub commit assistant state
  const [commitMessage, setCommitMessage] = useState('feat: updated blogger news integration and config');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'mirrabbihossain' && password === 'Rabbi@198027') {
      setIsAuthenticated(true);
      sessionStorage.setItem('probashi_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError(
        lang === 'bn'
          ? 'ভুল ইউজারনেম বা পাসওয়ার্ড! পুনরায় চেষ্টা করুন।'
          : 'Invalid username or password. Please try again.'
      );
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('probashi_admin_auth');
  };

  // Test feed connection
  const handleTestConnection = async () => {
    setTestResult({ status: 'testing' });
    const startTime = performance.now();

    try {
      // Temporarily test the input URL
      const cleanUrl = bloggerUrlInput.trim().replace(/\/+$/, '');
      const testProxyUrl = `/api/blogger-feed?url=${encodeURIComponent(cleanUrl)}&maxResults=10`;
      
      const res = await fetch(testProxyUrl);
      const elapsed = Math.round(performance.now() - startTime);

      if (!res.ok) {
        throw new Error(`সার্ভার স্ট্যাটাস: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const count = data.feed?.entry?.length || 0;

      setTestResult({
        status: 'success',
        message: lang === 'bn' 
          ? `সফলভাবে সংযোগ স্থাপিত হয়েছে! ${count} টি পোস্ট পাওয়া গেছে।`
          : `Connected successfully! Found ${count} posts.`,
        postCount: count,
        responseTime: elapsed,
      });
    } catch (err: any) {
      setTestResult({
        status: 'error',
        message: err?.message || 'সংযোগ স্থাপন ব্যর্থ হয়েছে। URL টি সঠিক কিনা যাচাই করুন।',
      });
    }
  };

  // Save active Blogger URL
  const handleSaveUrl = () => {
    setActiveBloggerUrl(bloggerUrlInput);
    BloggerService.clearCache();
    setUrlSavedSuccess(true);
    setTimeout(() => setUrlSavedSuccess(false), 3000);
    onRefreshAll();
  };

  // Reset to default
  const handleResetDefaultUrl = () => {
    setBloggerUrlInput(DEFAULT_BLOGGER_SITE_URL);
    setActiveBloggerUrl(DEFAULT_BLOGGER_SITE_URL);
    BloggerService.clearCache();
    setUrlSavedSuccess(true);
    setTimeout(() => setUrlSavedSuccess(false), 3000);
    onRefreshAll();
  };

  // Clear cache manually
  const handleClearCache = () => {
    BloggerService.clearCache();
    onRefreshAll();
    alert(lang === 'bn' ? 'ক্যাশ মেমোরি খালি করা হয়েছে!' : 'Blogger cache cleared successfully!');
  };

  // Copy helper
  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    if (identifier.startsWith('cmd-')) {
      setCopiedCmd(identifier);
      setTimeout(() => setCopiedCmd(null), 2000);
    } else {
      setCopiedLabel(identifier);
      setTimeout(() => setCopiedLabel(null), 2000);
    }
  };

  // If not logged in, render login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full border border-slate-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {lang === 'bn' ? 'এডমিন লগইন' : 'Admin Login'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {lang === 'bn'
                ? 'ব্লগার সংযোগ ও গিটহাব কনফিগারেশনের জন্য প্রবেশ করুন'
                : 'Sign in to manage Blogger feeds and GitHub repository updates'}
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {lang === 'bn' ? 'ইউজারনেম' : 'Username'}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="mirrabbihossain"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-md cursor-pointer"
            >
              {lang === 'bn' ? 'প্রবেশ করুন' : 'Sign In'}
            </button>
          </form>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] text-center">
            Probashi Seba Malaysia • Admin Portal Security Gate
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-emerald-300 uppercase">
              {lang === 'bn' ? 'সক্রিয় এডমিন সেশন' : 'Active Admin Session'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            {lang === 'bn' ? 'প্রবাসী সেবা নিয়ন্ত্রণ প্যানেল' : 'Admin Control Panel'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'bn'
              ? 'ব্যবহারকারী: mirrabbihossain • ব্লগার ফিড ও গিটহাব আপডেট ম্যানেজমেন্ট'
              : 'User: mirrabbihossain • Blogger Feed & GitHub Update Management'}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{lang === 'bn' ? 'লগআউট' : 'Sign Out'}</span>
        </button>
      </div>

      {/* Grid: Blogger Config & Cache */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1: Blogger Site Configuration */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {lang === 'bn' ? '১. ব্লগার সাইট কনফিগারেশন' : '1. Blogger Site Configuration'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? 'যে ব্লগার ডোমেইন থেকে নোটিশ লোড হবে' : 'Configure Blogger domain URL'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Blogger Website URL
              </label>
              <input
                type="url"
                value={bloggerUrlInput}
                onChange={(e) => setBloggerUrlInput(e.target.value)}
                placeholder="https://probashisebamalaysia.blogspot.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                {lang === 'bn'
                  ? 'আপনার ব্লগস্পট বা কাস্টম ডোমেইন দিন। যেমন: https://YOUR-SITE.blogspot.com'
                  : 'Enter your Blogspot or custom Blogger domain URL.'}
              </p>
            </div>

            {/* Test connection & Save controls */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testResult.status === 'testing'}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                {testResult.status === 'testing'
                  ? lang === 'bn'
                    ? 'পরীক্ষা চলছে...'
                    : 'Testing...'
                  : lang === 'bn'
                  ? 'সংযোগ পরীক্ষা করুন'
                  : 'Test Connection'}
              </button>

              <button
                type="button"
                onClick={handleSaveUrl}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save URL'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetDefaultUrl}
                className="px-3 py-2 rounded-xl text-slate-500 hover:text-slate-700 text-xs font-medium cursor-pointer"
              >
                {lang === 'bn' ? 'ডিফল্ট রিসেট' : 'Reset to Default'}
              </button>
            </div>

            {/* Success alert */}
            {urlSavedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {lang === 'bn'
                    ? 'ব্লগার URL সফলভাবে সংরক্ষণ করা হয়েছে এবং ক্যাশ রিফ্রেশ হয়েছে!'
                    : 'Blogger URL updated and cache refreshed successfully!'}
                </span>
              </div>
            )}

            {/* Test Results Box */}
            {testResult.status !== 'idle' && (
              <div
                className={`p-3.5 rounded-xl text-xs space-y-1 border ${
                  testResult.status === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : testResult.status === 'error'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="font-semibold flex items-center gap-1.5">
                  {testResult.status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : testResult.status === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  ) : (
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-600" />
                  )}
                  <span>{testResult.message}</span>
                </div>
                {testResult.responseTime && (
                  <p className="text-[11px] opacity-75">
                    রেসপন্স টাইম: {testResult.responseTime}ms
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Cache & Synchronization Management */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {lang === 'bn' ? '২. ক্যাশ ও সিঙ্ক ব্যবস্থাপনা' : '2. Cache & Sync Management'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? 'স্থানীয় ক্যাশ মেমোরি ও স্বয়ংক্রিয় রিফ্রেশ' : 'Control local caching & TTL'}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600">
            <p>
              {lang === 'bn'
                ? 'ব্লগার ফিডের অনুরোধ সীমিত রাখতে এবং দ্রুত পেজ লোড নিশ্চিত করতে অ্যাপটি ৫ মিনিটের ক্যাশ ব্যবহার করে। নতুন পোস্ট প্রকাশ করার পর তৎক্ষণাৎ দেখতে ক্যাশ খালি করুন।'
                : 'The application caches retrieved posts for 5 minutes. After publishing a new article on Blogger, clear the cache to view it immediately.'}
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">ক্যাশ মেয়াদ (TTL):</span>
                <span className="font-bold text-slate-900">৫ মিনিট (300 সেকেন্ড)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">CORS প্রক্সি:</span>
                <span className="font-bold text-emerald-700">সক্রিয় (/api/blogger-feed)</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleClearCache}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>
                  {lang === 'bn'
                    ? 'ক্যাশ মেমোরি খালি করুন ও নতুন ডেটা আনুন'
                    : 'Clear Cache & Force Sync'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Step-by-Step Blogger Publishing Guide with Copyable Labels */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {lang === 'bn'
                ? '৩. ব্লগার-এ নোটিশ পোস্ট করার নিয়মাবলী'
                : '3. Blogger Post Publishing Guidelines'}
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'bn'
                ? 'ব্লগারে পোস্ট করলে অ্যাপটিতে স্বয়ংক্রিয়ভাবে প্রদর্শিত হবে'
                : 'How to publish posts on Blogger so they appear in this app'}
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
              ১
            </span>
            <h4 className="font-bold text-slate-900 text-sm">
              {lang === 'bn' ? 'নতুন পোস্ট তৈরি করুন' : 'Create New Post'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'bn'
                ? 'blogger.com এ আপনার অ্যাকাউন্টে গিয়ে "New Post" এ ক্লিক করে শিরোনাম লিখুন।'
                : 'Visit blogger.com, open your blog, and click "New Post". Enter a clear title.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
              ২
            </span>
            <h4 className="font-bold text-slate-900 text-sm">
              {lang === 'bn' ? 'ছবি ও বিবরণ যুক্ত করুন' : 'Add Content & Image'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'bn'
                ? 'বিস্তারিত নোটিশ লিখুন। পোস্টের শুরুতে একটি প্রাসঙ্গিক ছবি যুক্ত করলে অ্যাপের থাম্বনেইলে আসবে।'
                : 'Write the full body. Insert a featured image at the top to be used as thumbnail.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
              ৩
            </span>
            <h4 className="font-bold text-slate-900 text-sm">
              {lang === 'bn' ? 'লেবেল (Label) নির্বাচন করুন' : 'Assign Category Label'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'bn'
                ? 'ডানপাশের Labels বক্সে নিচের নির্ধারিত ট্যাগগুলো দিন এবং Publish করুন।'
                : 'In the right sidebar, assign one of the supported labels and click Publish.'}
            </p>
          </div>
        </div>

        {/* Copyable Labels */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-700" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {lang === 'bn'
                ? 'সাপোর্টেড লেবেলসমূহ (ক্লিক করে কপি করুন):'
                : 'Supported Blogger Labels (Click to copy):'}
            </h4>
          </div>

          <div className="flex flex-wrap gap-2">
            {BLOGGER_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => copyToClipboard(cat.bn, `label-${cat.id}`)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  cat.isEmergency
                    ? 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span>{cat.bn}</span>
                {copiedLabel === `label-${cat.id}` ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4: GitHub Update & Push Assistant */}
      {/* As requested: "আলাদা একটি এডমিন প্যানেল থাকবে যেখান থেকে পরবর্তিতে আপডেট করে গিটহাবে পুশ করা যাবে।" */}
      <div className="bg-slate-900 text-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border border-slate-800">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {lang === 'bn'
                ? '৪. গিটহাব রিপোজিটরি আপডেট ও পুশ সহায়িকা'
                : '4. GitHub Repository Update & Push Assistant'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'bn'
                ? 'পরবর্তীতে অ্যাপ আপডেট করে সহজেই গিটহাবে পুশ করার নির্দেশিকা'
                : 'Step-by-step assistant to commit and push changes to GitHub'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              {lang === 'bn' ? 'কমিট মেসেজ (Commit Message)' : 'Commit Message'}
            </label>
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Terminal className="w-4 h-4" />
              <span>{lang === 'bn' ? 'টার্মিনাল কমান্ডসমূহ (ক্লিক করে কপি করুন):' : 'Terminal Commands (Click to copy):'}</span>
            </div>

            {/* Git Command 1 */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between font-mono text-xs text-emerald-300">
              <span>git add .</span>
              <button
                onClick={() => copyToClipboard('git add .', 'cmd-add')}
                className="p-1 hover:text-white transition-colors cursor-pointer text-slate-400"
                title="কপি করুন"
              >
                {copiedCmd === 'cmd-add' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Git Command 2 */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between font-mono text-xs text-emerald-300">
              <span>git commit -m &quot;{commitMessage}&quot;</span>
              <button
                onClick={() => copyToClipboard(`git commit -m "${commitMessage}"`, 'cmd-commit')}
                className="p-1 hover:text-white transition-colors cursor-pointer text-slate-400"
                title="কপি করুন"
              >
                {copiedCmd === 'cmd-commit' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Git Command 3 */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between font-mono text-xs text-emerald-300">
              <span>git push origin main</span>
              <button
                onClick={() => copyToClipboard('git push origin main', 'cmd-push')}
                className="p-1 hover:text-white transition-colors cursor-pointer text-slate-400"
                title="কপি করুন"
              >
                {copiedCmd === 'cmd-push' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-white">
              {lang === 'bn' ? 'পুশ করার সম্পূর্ণ নির্দেশিকা:' : 'All-in-one terminal execution:'}
            </p>
            <p className="text-slate-400 font-mono text-[11px]">
              git add . && git commit -m &quot;{commitMessage}&quot; && git push origin main
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    `git add . && git commit -m "${commitMessage}" && git push origin main`,
                    'cmd-all'
                  )
                }
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCmd === 'cmd-all' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>কমান্ড কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>সম্পূর্ণ কমান্ড একসাথে কপি করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
