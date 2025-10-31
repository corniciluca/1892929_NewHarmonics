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
  const [detailSong, setDetailSong] = useState(null); // null = closed, song = open
  const [isSeeking, setIsSeeking] = useState(false);
  const wasPlayingRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.preload = 'metadata';
    // allow cross-origin media if your files are served from another host
    audio.crossOrigin = 'anonymous';

    const onTime = () => {
      if (!isSeeking) {
        setProgress(audio.currentTime || 0);
      }
    };
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
  }, [isSeeking]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playSong = (song) => {
    if (!song || !audioRef.current) return;
    const audio = audioRef.current;
    //Get timestamps for the new song and the currently playing song
    const newUploadTimestamp = new Date(song.uploadDate || 0).getTime();
    const currentUploadTimestamp = new Date(currentSong?.uploadDate || 0).getTime();

    // Check if it's the same song AND the same version (timestamp)
    if (currentSong && song.id === currentSong.id && newUploadTimestamp === currentUploadTimestamp) {
      // If it is, just toggle play/pause
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

    // If it's a new song OR a new version of the same song, reload the file
   const gateway = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:9000';
   // 4. Create the cache-busting URL using the timestamp
   const effectiveSrc = `${gateway}/songs/${song.id}/download?v=${newUploadTimestamp}`;

    setCurrentSong(song);
    audio.src = effectiveSrc;
    audio.currentTime = 0;
    console.log('Player: attempting to play', effectiveSrc);
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
          setIsSeeking(false);

          // Wrap the play() call in a timeout to let the pause() promise finish
          if (wasPlayingRef.current) {
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.play();
                setIsPlaying(true);
              }
            }, 0); // 0ms is enough to push it to the next event loop
          }
        };

  const startSeek = () => {
        if (!audioRef.current) return;
        // Store whether the song is *currently* playing
        wasPlayingRef.current = isPlaying;
        setIsSeeking(true);
        // Pause the audio *while* seeking to prevent stutter
        audioRef.current.pause();
        setIsPlaying(false); // Sync the state
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
      volume, setVolume, progress, duration, seek, detailSong, openSongDetail, closeSongDetail, currentUser, startSeek, isSeeking
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export default PlayerProvider;
