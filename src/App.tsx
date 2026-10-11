import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { NewsPage } from './pages/NewsPage';
import { NewsArticlePage } from './pages/NewsArticlePage';
import { AdminPage } from './pages/AdminPage';
import { AppInstallModal } from './components/AppInstallModal';
import { AboutModal } from './components/AboutModal';
import { InAppBrowserModal } from './components/InAppBrowserModal';
import { BloggerPost, Language } from './types/blogger';
import { BloggerService } from './lib/bloggerService';

export default function App() {
  // Language state (persisted)
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('probashi_lang');
      if (saved === 'en' || saved === 'bn') return saved;
    }
    return 'bn';
  });

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('probashi_lang', newLang);
      document.documentElement.lang = newLang;
    }
  };

  // Routing state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search;
    }
    return '/';
  });

  const [selectedPostId, setSelectedPostId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const match = window.location.pathname.match(/^\/news\/([^/?#]+)/);
      if (match) return decodeURIComponent(match[1]);
    }
    return null;
  });

  // Modal states
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // In-App Browser state
  const [inAppBrowser, setInAppBrowser] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
  }>({
    isOpen: false,
    url: '',
    title: '',
  });

  const openInAppBrowser = (url: string, title: string) => {
    setInAppBrowser({
      isOpen: true,
      url,
      title: title || (lang === 'bn' ? 'প্রবাসী সেবা পোর্টাল' : 'Probashi Seba Portal'),
    });
  };

  // Blogger feed data state
  const [posts, setPosts] = useState<BloggerPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCached, setIsCached] = useState(false);
  const [cacheTime, setCacheTime] = useState<number | null>(null);
  const [error, setError] = useState<string | undefined>();

  // Fetch posts from Blogger service
  const loadPosts = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    try {
      const result = await BloggerService.getPosts({ forceRefresh });
      setPosts(result.posts);
      setIsCached(result.isCached);
      setCacheTime(result.cacheTime);
      setError(result.error);
    } catch (err: any) {
      console.error('Error in loadPosts:', err);
      setError(err?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadPosts(false);
  }, [loadPosts]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const full = window.location.pathname + window.location.search;
      setCurrentPath(full);

      const match = window.location.pathname.match(/^\/news\/([^/?#]+)/);
      if (match) {
        setSelectedPostId(decodeURIComponent(match[1]));
      } else {
        setSelectedPostId(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation handler
  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);

    const match = path.match(/^\/news\/([^/?#]+)/);
    if (match) {
      setSelectedPostId(decodeURIComponent(match[1]));
    } else {
      setSelectedPostId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select article to view detail page
  const handleSelectPost = (postId: string) => {
    setSelectedPostId(postId);
    navigate(`/news/${encodeURIComponent(postId)}`);
  };

  // Has active emergency post
  const hasEmergency = posts.some((p) => p.isEmergency);

  // Check current route category query if on /news?category=...
  const categoryParam = React.useMemo(() => {
    if (currentPath.includes('category=')) {
      const params = new URLSearchParams(currentPath.split('?')[1]);
      return params.get('category') || undefined;
    }
    return undefined;
  }, [currentPath]);

  // Selected post object
  const activePost = React.useMemo(() => {
    if (!selectedPostId) return null;
    return posts.find((p) => p.id === selectedPostId) || null;
  }, [selectedPostId, posts]);

  // Determine active page component
  let pageContent: React.ReactNode;

  if (currentPath.startsWith('/admin')) {
    pageContent = (
      <AdminPage
        lang={lang}
        onRefreshAll={() => loadPosts(true)}
      />
    );
  } else if (selectedPostId) {
    pageContent = (
      <NewsArticlePage
        post={activePost}
        lang={lang}
        onBack={() => navigate('/news')}
        onSelectCategory={(cat) => navigate(`/news?category=${cat}`)}
        onOpenLink={openInAppBrowser}
      />
    );
  } else if (currentPath.startsWith('/news')) {
    pageContent = (
      <NewsPage
        posts={posts}
        loading={loading}
        isCached={isCached}
        cacheTime={cacheTime}
        error={error}
        lang={lang}
        initialCategory={categoryParam || 'all'}
        onRefresh={() => loadPosts(true)}
        onNavigate={navigate}
        onSelectPost={handleSelectPost}
        onOpenLink={openInAppBrowser}
      />
    );
  } else {
    // Default: Home Page (Only Category Grid with Icons & Flag Glassmorphism)
    pageContent = (
      <HomePage
        posts={posts}
        lang={lang}
        onSelectCategory={(categoryId) => navigate(`/news?category=${categoryId}`)}
        onOpenPortal={openInAppBrowser}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Global Header */}
      <Header
        lang={lang}
        onLanguageChange={handleLanguageChange}
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenInstall={() => setIsInstallOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        hasEmergencyNotice={hasEmergency}
      />

      {/* Main Page Area */}
      <main className="flex-1">{pageContent}</main>

      {/* Global Footer */}
      <Footer
        lang={lang}
        onNavigate={navigate}
        onOpenInstall={() => setIsInstallOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* App Install Modal */}
      <AppInstallModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
        lang={lang}
      />

      {/* About & Mission Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onOpenInstall={() => setIsInstallOpen(true)}
        lang={lang}
      />

      {/* Integrated In-App Browser Modal */}
      <InAppBrowserModal
        isOpen={inAppBrowser.isOpen}
        url={inAppBrowser.url}
        title={inAppBrowser.title}
        onClose={() => setInAppBrowser((prev) => ({ ...prev, isOpen: false }))}
        lang={lang}
      />
    </div>
  );
}
