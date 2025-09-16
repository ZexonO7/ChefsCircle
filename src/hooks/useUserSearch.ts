import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserResult, isValidSearchTerm } from '@/utils/userHelpers';

// Explicit search hook with no implicit behavior
export const useUserSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Explicit search function
  const performSearch = useCallback(async (term: string): Promise<void> => {
    if (!isValidSearchTerm(term)) {
      setSearchResults([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: searchError } = await supabase.rpc('search_users', {
        search_term: term.trim(),
        limit_count: 10
      });

      if (searchError) {
        throw new Error(`Search failed: ${searchError.message}`);
      }

      // Explicit null/undefined check
      const results = data || [];
      setSearchResults(results);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      console.error('User search error:', errorMessage);
      setError(errorMessage);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Explicit debounced search effect
  useEffect(() => {
    const searchTimer = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => {
      clearTimeout(searchTimer);
    };
  }, [searchTerm, performSearch]);

  // Explicit clear function
  const clearSearch = useCallback((): void => {
    setSearchTerm('');
    setSearchResults([]);
    setError(null);
  }, []);

  // Explicit update function
  const updateSearchTerm = useCallback((term: string): void => {
    setSearchTerm(term);
  }, []);

  return {
    // State
    searchTerm,
    searchResults,
    isLoading,
    error,
    // Actions
    updateSearchTerm,
    clearSearch,
    performSearch,
    // Computed values
    hasResults: searchResults.length > 0,
    shouldShowResults: isValidSearchTerm(searchTerm),
    isEmpty: searchResults.length === 0 && !isLoading && isValidSearchTerm(searchTerm)
  };
};