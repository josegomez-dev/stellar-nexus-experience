'use client';

import { useEffect } from 'react';
import { initBugfender, logPageVisit } from '@/lib/bugfender';

export const BugfenderInit = () => {
  useEffect(() => {
    // Initialize Bugfender on client-side
    const init = async () => {
      await initBugfender();
      
      // Log initial page visit after initialization
      logPageVisit('App Initialized', window.location.pathname);
    };
    
    init();
  }, []);

  return null; // This component doesn't render anything
};
