'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCallback } from 'react';
import _ from 'lodash';

interface GeniusResult {
 title: string;
 url: string;
 header_image_url: string;
}

interface Song {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumImage: string;
  duration: number;
  progress: number;
}

const fetchLyricsDebounced = _.debounce(async (title: string, artist: string, setGeniusData: (data: GeniusResult | null) => void) => {
  try {
    const res = await fetch(`/api/lyrics?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`);
    if (res.ok) {
      const data = await res.json();
      setGeniusData(data);
    }
  } catch (error) {
    console.error('Error fetching lyrics:', error);
  }
}, 1000);

export function NowPlaying() {
  const [song, setSong] = useState<Song | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const [geniusData, setGeniusData] = useState<GeniusResult | null>(null);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const res = await fetch('/api/now-playing');
        if (res.ok) {
          const data = await res.json();
          setSong(data);
          setProgress(data.progress);
        }
      } catch (error) {
        console.error('Error fetching song:', error);
      }
    };

    fetchSong();
    const interval = setInterval(fetchSong, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (song && showLyrics) {
      fetchLyricsDebounced(song.title, song.artist, setGeniusData);
    }
    
    return () => {
      fetchLyricsDebounced.cancel();
    };
  }, [song?.title, song?.artist, showLyrics]);

  useEffect(() => {
    if (!showLyrics) {
      setGeniusData(null);
    }
  }, [showLyrics]);

  useEffect(() => {
    const handleClickAway = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.lyrics-panel') && !target.closest('.lyrics-button')) {
        setShowLyrics(false);
      }
    };

    if (showLyrics) {
      document.addEventListener('mousedown', handleClickAway);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickAway);
    };
  }, [showLyrics]);

  if (!song?.isPlaying) {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <div className="w-2 h-2 rounded-full bg-zinc-500"></div>
        Not playing
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-4 min-w-[300px]">
        <AnimatePresence mode="wait">
          {song.albumImage && (
            <motion.img
              key={song.albumImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={song.albumImage}
              alt={song.title}
              className="w-16 h-16 rounded-md"
            />
          )}
        </AnimatePresence>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-zinc-400">Listening to Spotify</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={song.title}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="font-medium mt-1"
            >
              {song.title}
            </motion.p>
            <motion.p
              key={song.artist}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-zinc-400"
            >
              {song.artist}
            </motion.p>
          </AnimatePresence>
          <div className="w-full h-1.5 bg-zinc-800/50 rounded-full mt-2 overflow-hidden">
            <motion.div 
              className="h-full rounded-full relative"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(progress / song.duration) * 100}%`,
                background: song.isPlaying ? 
                  "linear-gradient(90deg, rgb(34 197 94), rgb(74 222 128), rgb(34 197 94))" : 
                  "rgb(34 197 94)"
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <motion.div 
                className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 2,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
              <motion.div
                className="absolute inset-0"
                animate={{ 
                  background: ["rgba(255,255,255,0)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0)"]
                }}
                transition={{
                  duration: 2,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
            </motion.div>
          </div>
          
          <button
            onClick={() => setShowLyrics(!showLyrics)}
            className="lyrics-button text-sm px-3 py-1.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700/80 transition-colors flex items-center gap-2 mt-3"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            {showLyrics ? 'Hide Lyrics' : 'Show Lyrics'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showLyrics && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="lyrics-panel absolute top-full left-0 right-0 mt-4 bg-zinc-900/95 backdrop-blur-md rounded-lg border border-zinc-800/50 overflow-hidden z-50 shadow-xl"
          >
            {geniusData ? (
              <>
                <div className="relative h-32 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center blur-sm opacity-30"
                    style={{ backgroundImage: `url(${geniusData.header_image_url})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/95" />
                  <div className="relative p-4 flex items-end h-full">
                    <div>
                      <h3 className="font-medium text-lg">{song.title}</h3>
                      <p className="text-sm text-zinc-400">{song.artist}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <a 
                    href={geniusData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-full text-sm font-medium hover:bg-yellow-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.968 11.918a2.84 2.84 0 0 1-2.838 2.838h-2.958V9.08h2.958a2.84 2.84 0 0 1 2.838 2.838zM12 2C6.478 2 2 6.478 2 12s4.478 10 10 10 10-4.478 10-10S17.522 2 12 2zm7.968 9.918a2.84 2.84 0 0 1-2.838 2.838h-2.958V9.08h2.958a2.84 2.84 0 0 1 2.838 2.838z"/>
                    </svg>
                    View Full Lyrics on Genius
                  </a>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-zinc-500">
                <svg className="w-8 h-8 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>No lyrics available</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}