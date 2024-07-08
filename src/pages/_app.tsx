import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { AppProps } from 'next/app';
import LoadingScreen from '@/components/LoadingScreen';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <main className="font-sans">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" onLoadingComplete={handleLoadingComplete} />
        ) : (
          <Component {...pageProps} key="page" />
        )}
      </AnimatePresence>
    </main>
  );
}