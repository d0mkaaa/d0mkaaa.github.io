'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CodeBracketIcon } from '@heroicons/react/24/outline';
import { NowPlaying } from '@/components/NowPlaying';

interface Repository {
  name: string;
  description: string;
  topics: string[];
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  private: boolean;
}

const ProjectCard = ({ repo }: { repo: Repository }) => (
  <motion.a
    href={repo.html_url}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-6 w-[400px] shrink-0"
    whileHover={{ scale: 1.02 }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-center gap-4 mb-4">
      <CodeBracketIcon className="h-6 w-6 text-zinc-400" />
      <h3 className="text-lg font-medium">{repo.name}</h3>
    </div>
    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{repo.description}</p>
    <div className="flex flex-wrap gap-2">
      {repo.topics.map(topic => (
        <span key={topic} className="px-2 py-1 bg-zinc-800/50 rounded-full text-xs text-zinc-300">
          {topic}
        </span>
      ))}
    </div>
  </motion.a>
);

export default function Home() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [speed, setSpeed] = useState(15);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchRepos = async () => {
      const response = await fetch('https://api.github.com/users/d0mkaaa/repos?per_page=100');
      const data = await response.json();
      setRepos(data.filter((repo: Repository) => !repo.fork && !repo.private));
    };
    fetchRepos();
  }, []);
  

  return (
    <div className="min-h-screen bg-black text-white font-space-grotesk">
      <main className="flex flex-col items-center">
      <div className="w-full flex flex-col items-center justify-center py-20 bg-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-8 text-center"
           >
             <div className="mb-6">
               <motion.div 
                 animate={{ 
                   scale: [1, 1.02, 1],
                   borderColor: ['rgb(39, 39, 42)', 'rgb(63, 63, 70)', 'rgb(39, 39, 42)']
                 }}
                 transition={{ duration: 3, repeat: Infinity }}
                 className="w-32 h-32 rounded-full bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-center mx-auto"
               >
                 <span className="text-3xl font-medium">d0m</span>
               </motion.div>
             </div>
             
             <h1 className="text-4xl font-bold mb-3">d0mkaaa</h1>
             <p className="text-zinc-400">
               Developer
             </p>
           </motion.div>

           <div className="flex items-center">
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-6 w-full">
              <NowPlaying />
            </div>
          </div>
         </div>
        </div>

        <section className="w-full py-12">
          <h2 className="text-xl font-medium text-center mb-8">Projects</h2>
          <div className="w-full overflow-hidden relative" 
               onMouseEnter={() => setSpeed(40)} 
               onMouseLeave={() => setSpeed(15)}>
            <motion.div 
              animate={{ 
                x: [0, "-50%"]
              }}
              transition={{
                duration: speed,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop"
              }}
              className="flex gap-6 w-max px-4"
            >
            {repos.map((repo) => (
              <ProjectCard key={`first-${repo.name}`} repo={repo} />
            ))}
            {repos.map((repo) => (
              <ProjectCard key={`second-${repo.name}`} repo={repo} />
            ))}
            </motion.div>
          </div>
        </section>

        <div className="flex gap-4 py-12">
          <a
            href="https://discord.com/users/578600798842519563"
            className="rounded-full bg-white text-black px-5 py-2 text-sm hover:bg-zinc-200 transition-colors"
          >
            Contact on Discord
          </a>
          <a
            href="https://github.com/d0mkaaa"
            className="rounded-full border border-zinc-800 px-5 py-2 text-sm hover:bg-zinc-900 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            View GitHub
          </a>
        </div>
      </main>

      <footer className="flex gap-6 justify-center py-8 text-sm text-zinc-400">
        <a href="https://github.com/d0mkaaa" className="hover:text-white transition-colors">GitHub</a>
        <a href="https://discord.com/users/578600798842519563" className="hover:text-white transition-colors">Discord</a>
      </footer>
    </div>
  );
}