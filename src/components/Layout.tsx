import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaGithub, FaDiscord } from 'react-icons/fa';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <motion.div
      className="min-h-screen bg-background text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.header 
        className="py-4 px-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">lmaoleonix</h1>
          <nav className="flex space-x-4">
            <Link href="https://github.com/lmaoleonix" target="_blank" rel="noopener noreferrer">
              <FaGithub className="text-2xl hover:text-primary transition-colors duration-300" />
            </Link>
            <Link href="https://discord.com/users/578600798842519563" target="_blank" rel="noopener noreferrer">
              <FaDiscord className="text-2xl hover:text-primary transition-colors duration-300" />
            </Link>
          </nav>
        </div>
      </motion.header>
      <motion.main 
        className="content-container"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="border-with-gaps" />
        {children}
      </motion.main>
      <motion.footer 
        className="py-4 text-center text-sm text-muted-foreground"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        © {new Date().getFullYear()} lmaoleonix. All rights reserved.
      </motion.footer>
    </motion.div>
  );
};

export default Layout;