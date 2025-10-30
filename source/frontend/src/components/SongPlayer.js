import React, { useContext } from 'react';
import { Box, IconButton, Slider, Typography, Link, CardMedia } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUp from '@mui/icons-material/VolumeUp';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Link as RouterLink } from 'react-router-dom';
import { PlayerContext } from './PlayerContext';

// Define the gateway URL
const gateway = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:9000';

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

  // Get artist ID from the song
  const artistId = currentSong.artistId || currentSong.userId;
  
  // Construct the cover image URL through the API gateway
  const coverImageUrl = currentSong.id ? `${gateway}/songs/${currentSong.id}/cover` : null;

  return (
    <Box sx={{
      position: 'fixed', bottom: 0, left: 0, right: 0, bgcolor: 'background.paper', boxShadow: 6,
      display: 'flex', alignItems: 'center', gap: 2, p: 1.5, zIndex: 1400
    }}>
      <Box sx={{ width: 280, display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Album Cover */}
        <Box sx={{
          width: 56, 
          height: 56, 
          borderRadius: 2,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: coverImageUrl ? 'transparent' : '#bdbdbd55',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          {coverImageUrl ? (
            <CardMedia
              component="img"
              image={coverImageUrl}
              alt={currentSong.title}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <MusicNoteIcon sx={{ width: 32, height: 32, opacity: 0.7, color: '#616161' }} />
          )}
        </Box>
        
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>{currentSong.title}</Typography>
          {artistId ? (
            <Link 
              component={RouterLink} 
              to={`/user/${artistId}`}
              sx={{ 
                color: 'text.secondary', 
                textDecoration: 'none', 
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {currentSong.artist}
              </Typography>
            </Link>
          ) : (
            <Typography variant="caption" color="text.secondary">
              {currentSong.artist}
            </Typography>
          )}
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