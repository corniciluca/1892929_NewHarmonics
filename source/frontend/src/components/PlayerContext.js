import React, { createContext, useRef, useState, useEffect } from 'react';
import SongDetailModal from './SongDetailModal';

export const PlayerContext = createContext(null);

export function PlayerProvider({ children, currentUser }) {
  // Create audio element synchronously so play() can be called within event handlers
  const audioRef = useRef(typeof document !== 'undefined' ? new Audio() : null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // --- 1. ADD NEW STATE FOR MODAL ---
  const [detailSong, setDetailSong] = useState(null); // null = closed, song = open

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.preload = 'metadata';
    // allow cross-origin media if your files are served from another host
    audio.crossOrigin = 'anonymous';

    const onTime = () => setProgress(audio.currentTime || 0);
    const onDuration = () => setDuration(audio.duration || 0);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onDuration);
      audio.removeEventListener('ended', onEnded);
      try { audio.pause(); } catch(e) {}
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playSong = (song) => {
    if (!song || !audioRef.current) return;
    const audio = audioRef.current;
    const src = song.fileUrl || song.audioUrl || song.url || '';

    // If same song, toggle playback
    if (currentSong && song.id && currentSong.id === song.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().then(() => setIsPlaying(true)).catch((err) => {
          console.error('Play blocked or failed:', err);
          setIsPlaying(false);
        });
      }
      return;
    }

    // Determine effective src: prefer absolute URLs. If fileUrl looks like a filesystem path
    // (starts with /app or doesn't start with http), use the API gateway download endpoint
    // so the browser requests the file through the backend which can set correct headers.
  // Always use the download endpoint through the API gateway
  const gateway = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:9000';
  const effectiveSrc = `${gateway}/songs/${song.id}/download`;

      setCurrentSong(song);
      audio.src = effectiveSrc;
    audio.currentTime = 0;
    console.log('Player: attempting to play', src);
    audio.play().then(() => setIsPlaying(true)).catch((err) => {
      console.error('Play failed after setting src:', err);
      setIsPlaying(false);
    });
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch((err) => {
        console.error('Play failed on toggle:', err);
      });
    }
  };

  const seek = (time) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const openSongDetail = (song) => {
    setDetailSong(song);
  };

  const closeSongDetail = () => {
    setDetailSong(null);
  };

  return (
    <PlayerContext.Provider value={{
      currentSong, setCurrentSong, isPlaying, playSong, togglePlay,
      volume, setVolume, progress, duration, seek, detailSong, openSongDetail, closeSongDetail, currentUser
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export default PlayerProvider;
