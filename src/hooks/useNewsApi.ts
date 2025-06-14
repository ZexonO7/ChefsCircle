
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCulinaryNews, NewsArticle } from '@/services/newsApi';

export const useNewsApi = () => {
  const { data: articles, isLoading, error, refetch } = useQuery({
    queryKey: ['culinary-news'],
    queryFn: fetchCulinaryNews,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchInterval: 24 * 60 * 60 * 1000, // Refetch every 24 hours (86400000 ms)
    refetchIntervalInBackground: true, // Continue refetching even when tab is not active
  });

  return {
    articles: articles || [],
    isLoading,
    error,
    refetch
  };
};
