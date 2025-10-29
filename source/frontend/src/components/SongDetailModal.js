import React, { useContext, useState, useEffect } from "react";
import { 
  Dialog, DialogContent, Typography, Box, IconButton, DialogTitle, Avatar, Stack, Chip,
  Button,
  Link
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import VisibilityIcon from '@mui/icons-material/Visibility';
import AlbumIcon from '@mui/icons-material/Album';
import CategoryIcon from '@mui/icons-material/Category';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Link as RouterLink } from 'react-router-dom';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { PlayerContext } from './PlayerContext';
import { likeSong, unlikeSong } from '../api/songApi';

// 1. Define the gateway URL
const gateway = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:9000';

export default function SongDetailModal() {
  const { detailSong, closeSongDetail, playSong, currentSong, currentUser } = useContext(PlayerContext);

  const isUserLiked = !!currentUser && !!detailSong?.likedBy && detailSong.likedBy.includes(currentUser.id);
  const [isLiked, setIsLiked] = useState(isUserLiked);

  useEffect(() => {
      const newIsUserLiked = !!currentUser && !!detailSong?.likedBy && detailSong.likedBy.includes(currentUser.id);
      setIsLiked(newIsUserLiked);
    }, [detailSong, currentUser]);

  const isCurrentlyPlaying = currentSong?.id === detailSong?.id;
  const visuals = detailSong?.playCount || detailSong?.play_count || detailSong?.views || detailSong?.visuals || 0;
  const artistId = detailSong?.artistId || detailSong?.userId;

  // 2. Construct the cover image URL
  const coverImageUrl = detailSong?.coverImageUrl ? `${gateway}/songs/${detailSong.id}/cover` : null;

  const handlePlay = () => {
    if (detailSong) {
      playSong(detailSong);
    }
    closeSongDetail();
  };

  const handleLikeToggle = async () => {
      if (!currentUser) {
          alert("You must be logged in to like a song.");
          return;
      }
      if (!detailSong) return;
      try {
          if (isLiked) {
              await unlikeSong(detailSong.id);
          } else {
              await likeSong(detailSong.id);
          }
          setIsLiked(l => !l);
      } catch (error) {
          console.error("Error toggling like status:", error);
          alert(`Failed to update like status. Please try again.`);
      }
    };

  if (!detailSong) {
    return null;
  }

  return (
    <Dialog 
      open={true}
      onClose={closeSongDetail}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ pr: 6, minHeight: 64 }}>
        <IconButton
          aria-label="close"
          onClick={closeSongDetail}
          sx={{ position: 'absolute', right: 12, top: 12, color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: 'center', pt: 0 }}>
        
        {/* 3. Replaced Avatar with this Box for the image */}
        <Box sx={{ 
          width: 160, height: 160, 
          margin: 'auto', mb: 2, 
          borderRadius: 4,
          overflow: 'hidden',
          bgcolor: 'primary.light',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 3
        }}>
          {coverImageUrl ? (
            <img 
              src={coverImageUrl} 
              alt={detailSong.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            <MusicNoteIcon sx={{ fontSize: 90, color: 'primary.dark' }} />
          )}
        </Box>

        <Typography variant="h4" fontWeight={600} noWrap>
          {detailSong.title}
        </Typography>

        <Typography variant="h6" color="text.secondary" gutterBottom>
          {artistId ? (
            <Link 
              component={RouterLink} 
              to={`/user/${artistId}`}
              sx={{ 
                color: 'text.secondary', 
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline', color: 'primary.main' }
              }}
              onClick={closeSongDetail}
            >
              {detailSong.artist}
            </Link>
          ) : (
            detailSong.artist
          )}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 2, mb: 3 }}>
          <Button
            variant="contained"
            color={isCurrentlyPlaying ? "secondary" : "primary"}
            startIcon={<PlayArrowIcon />}
            onClick={handlePlay}
            sx={{ borderRadius: 6, px: 3 }}
          >
            {isCurrentlyPlaying ? "Playing" : "Play"}
          </Button>

          <IconButton
            aria-label="like song"
            onClick={handleLikeToggle}
            size="large"
          >
            {isLiked ? 
              <FavoriteIcon sx={{ color: 'error.main', fontSize: 30 }} /> : 
              <FavoriteBorderIcon sx={{ fontSize: 30 }} />
            }
          </IconButton>
        </Box>

        <Stack spacing={1.5} sx={{ alignItems: 'flex-start', pl: { xs: 1, sm: 4 }, mb: 2 }}>
          {detailSong.album && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AlbumIcon color="action" />
              <Typography variant="body1">
                <strong>Album:</strong> {detailSong.album}
              </Typography>
            </Box>
          )}

          {detailSong.genre && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CategoryIcon color="action" />
              <Typography variant="body1">
                <strong>Genre:</strong> {detailSong.genre}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <VisibilityIcon color="action" />
            <Typography variant="body1">
              <strong>Plays:</strong> {visuals}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}