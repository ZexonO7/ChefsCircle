import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingScreen from './LoadingScreen';
import { usePageLoading } from '@/hooks/usePageLoading';

interface PageLoadingWrapperProps {
  children: React.ReactNode;
}

const PageLoadingWrapper = ({ children }: PageLoadingWrapperProps) => {
  const isLoading = usePageLoading();

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isLoading && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PageLoadingWrapper;
