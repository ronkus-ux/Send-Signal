'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type DashboardView = 'overview' | 'leads' | 'templates' | 'campaigns' | 'conversations' | 'analytics' | 'settings';

const ViewContext = createContext<{
  view: DashboardView;
  setView: (view: DashboardView) => void;
} | null>(null);

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<DashboardView>('overview');

  // Initialize view from URL query param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') as DashboardView;
    const validViews: DashboardView[] = ['overview', 'leads', 'templates', 'campaigns', 'conversations', 'analytics', 'settings'];
    if (viewParam && validViews.includes(viewParam)) {
      setView(viewParam);
    }
  }, []);

  // Update URL query param when active view changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentViewParam = params.get('view') || 'overview';
    if (currentViewParam !== view) {
      const newSearch = view === 'overview' ? '' : `?view=${view}`;
      const newUrl = `${window.location.pathname}${newSearch}`;
      window.history.pushState({ view }, '', newUrl);
    }
  }, [view]);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const params = new URLSearchParams(window.location.search);
      const viewParam = (params.get('view') || 'overview') as DashboardView;
      setView(viewParam);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <ViewContext.Provider value={{ view, setView }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useDashboardView() {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error('useDashboardView must be used within a ViewProvider');
  }
  return context;
}
