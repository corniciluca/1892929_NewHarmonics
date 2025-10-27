import React, { useContext } from 'react';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUp from '@mui/icons-material/VolumeUp';
import { PlayerContext } from './PlayerContext';

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  const m = Math.floor(sec / 60);
  return `${m}:${s}`;
}

export default function SongPlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) return null;
  const { currentSong, isPlaying, togglePlay, progress, duration, seek, volume, setVolume } = ctx;

  // Hidden when no song selected
  if (!currentSong) return null;

  return (
    <Box sx={{
      position: 'fixed', bottom: 0, left: 0, right: 0, bgcolor: 'background.paper', boxShadow: 6,
      display: 'flex', alignItems: 'center', gap: 2, p: 1.5, zIndex: 1400
    }}>
      <Box sx={{ width: 220, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>{currentSong.title}</Typography>
          <Typography variant="caption" color="text.secondary">{currentSong.artist}</Typography>
        </Box>
      </Box>

      <IconButton onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="caption">{formatTime(progress)}</Typography>
        <Slider
          min={0}
          max={duration || 0}
          value={Math.min(progress, duration || 0)}
          onChange={(_, val) => seek(val)}
          sx={{ mx: 1 }}
        />
        <Typography variant="caption">{formatTime(duration)}</Typography>
      </Box>

      <Box sx={{ width: 180, display: 'flex', alignItems: 'center', gap: 1 }}>
        <VolumeUp />
        <Slider min={0} max={1} step={0.01} value={volume} onChange={(_, v) => setVolume(v)} />
      </Box>
    </Box>
  );
}
