
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCulinaryNews, NewsArticle } from '@/services/newsApi';

export const useNewsApi = () => {
  const { data: articles, isLoading, error, refetch } = useQuery({
    queryKey: ['culinary-news'],
    queryFn: fetchCulinaryNews,
    staleTime: 10 * 60 * 1000, // 10 minutes (shorter for RSS feeds)
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes for fresh RSS content
    refetchIntervalInBackground: true,
    retry: 2, // Retry failed requests twice
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  return {
    articles: articles || [],
    isLoading,
    error,
    refetch
  };
};
