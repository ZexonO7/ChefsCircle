
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
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50"
          >
            <LoadingScreen />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isLoading && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PageLoadingWrapper;
