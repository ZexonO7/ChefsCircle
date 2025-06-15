
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageLoading = () => {
  const [isLoading, setIsLoading] = useState(true); // Start with loading for app startup
  const [hasInitialized, setHasInitialized] = useState(false);
  const location = useLocation();

  // Routes that should show loading screen
  const loadingRoutes = ['/news', '/recipes'];

  useEffect(() => {
    // Handle app startup loading
    if (!hasInitialized) {
      const startupTimer = setTimeout(() => {
        setIsLoading(false);
        setHasInitialized(true);
      }, 2000); // 2 seconds for startup

      return () => clearTimeout(startupTimer);
    }

    // Handle page-specific loading for news and recipes
    const shouldShowLoading = loadingRoutes.includes(location.pathname);
    
    if (shouldShowLoading) {
      setIsLoading(true);
      
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [location.pathname, hasInitialized]);

  return isLoading;
};
