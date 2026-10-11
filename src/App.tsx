import React, { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { BuiltInBrowserView } from './components/BuiltInBrowserView';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);

  // Routing state for /admin
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      if (window.location.pathname === '/') {
        setIsBrowserOpen(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenVisaCheck = () => {
    setIsBrowserOpen(true);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/https://imigresen-online.imi.gov.my/eservices/myPermit?semakStatusPermit);
    }
  };

  const handleBackToHome = () => {
    setIsBrowserOpen(false);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
    }
  };

  // If visiting /admin directly
  if (currentPath.startsWith('/admin')) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <AdminPage lang="bn" onRefreshAll={() => {}} />
      </div>
    );
  }

  // Built-in In-App Browser view for Visa Check
  if (isBrowserOpen || currentPath === '/check-status') {
    return <BuiltInBrowserView onBack={handleBackToHome} />;
  }

  // Home Screen: Single Modern 'ভিসা চেক' Category with Background Image
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center">
      <HomePage onOpenVisaCheck={handleOpenVisaCheck} />
    </div>
  );
}
