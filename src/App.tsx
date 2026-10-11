import React, { useState, useEffect, useCallback } from 'react';
import { HomePage } from './pages/HomePage';
import { NewsPage } from './pages/NewsPage';
import { NewsArticlePage } from './pages/NewsArticlePage';
import { AdminPage } from './pages/AdminPage';
import { InAppBrowserModal } from './components/InAppBrowserModal';
import { BloggerPost, Language } from './types/blogger';
import { BloggerService } from './lib/bloggerService';

export default function App() {
  const [lang] = useState<Language>('bn');

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
      title: title || 'ভিসা চেক পোর্টাল',
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

  // Selected post object
  const activePost = React.useMemo(() => {
    if (!selectedPostId) return null;
    return posts.find((p) => p.id === selectedPostId) || null;
  }, [selectedPostId, posts]);

  // Determine active view
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
        onBack={() => navigate('/')}
        onSelectCategory={() => navigate('/news')}
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
        initialCategory="visa"
        onRefresh={() => loadPosts(true)}
        onNavigate={navigate}
        onSelectPost={handleSelectPost}
        onOpenLink={openInAppBrowser}
      />
    );
  } else {
    // Default: Pure Single Category (ভিসা চেক) - No Header, No Footer, No Extra Clutter
    pageContent = (
      <HomePage
        posts={posts}
        lang={lang}
        onSelectCategory={() => navigate('/news')}
        onOpenPortal={openInAppBrowser}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center">
      {/* Main View Area - No Header, No Footer */}
      <main className="w-full flex-1 flex flex-col justify-center">{pageContent}</main>

      {/* In-App Browser for Visa Check & Portals */}
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
