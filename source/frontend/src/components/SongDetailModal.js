import React, { useContext, useState } from "react";
import { 
  Dialog, DialogContent, Typography, Box, IconButton, DialogTitle, Avatar, Stack, Chip,
  Button, // 1. Import Button
  Link    // 2. Import Link from MUI
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import VisibilityIcon from '@mui/icons-material/Visibility';
import AlbumIcon from '@mui/icons-material/Album';
import CategoryIcon from '@mui/icons-material/Category';
import PlayArrowIcon from '@mui/icons-material/PlayArrow'; // 3. Import Play Icon
import { Link as RouterLink } from 'react-router-dom'; // 4. Import RouterLink
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"; // 2. Import Like icons
import FavoriteIcon from "@mui/icons-material/Favorite";

import { PlayerContext } from './PlayerContext';

export default function SongDetailModal() {
  // 5. Get all necessary functions and data from context
  const { detailSong, closeSongDetail, playSong, currentSong } = useContext(PlayerContext);

  const [isLiked, setIsLiked] = useState(false);

  // Check if this song is the one currently playing
  const isCurrentlyPlaying = currentSong?.id === detailSong?.id;

  // Get the visuals count (logic from SongCard.js)
  const visuals = detailSong?.playCount || detailSong?.play_count || detailSong?.views || detailSong?.visuals || 0;
  
  // 6. Get the artistId (logic from SongCard.js)
  const artistId = detailSong?.artistId || detailSong?.userId;

  // Handler for the play button
  const handlePlay = () => {
    if (detailSong) {
      playSong(detailSong); // Tell the player to play this song
    }
    closeSongDetail(); // Close the modal
  };

  // If no song is selected, the modal is closed (render nothing)
  if (!detailSong) {
    return null;
  }

  return (
    <Dialog 
      open={true} // Open is controlled by detailSong not being null
      onClose={closeSongDetail} // Function to close
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ pr: 6, minHeight: 64 }}> {/* Added minHeight for spacing */}
        {/* Close Button */}
        <IconButton
          aria-label="close"
          onClick={closeSongDetail}
          sx={{ position: 'absolute', right: 12, top: 12, color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: 'center', pt: 0 }}> {/* Removed padding-top */}
        {/* Icon */}
        <Avatar sx={{ width: 120, height: 120, margin: 'auto', mb: 2, bgcolor: 'primary.light' }}>
          <MusicNoteIcon sx={{ fontSize: 70, color: 'primary.dark' }} />
        </Avatar>

        {/* Title */}
        <Typography variant="h4" fontWeight={600} noWrap>
          {detailSong.title}
        </Typography>

        {/* 7. Artist Link (Conditionally rendered) */}
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {artistId ? (
            <Link 
              component={RouterLink} 
              to={`/user/${artistId}`}
              sx={{ 
                color: 'text.secondary', 
                textDecoration: 'none',
                '&:hover': {
                   textDecoration: 'underline',
                   color: 'primary.main'
                }
              }}
              onClick={closeSongDetail} // Close modal when clicking artist
            >
              {detailSong.artist}
            </Link>
          ) : (
            detailSong.artist // Just show name if no ID
          )}
        </Typography>
        
        {/* 4. Group Play and Like buttons together */}
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

          {/* 5. Add the Like Button */}
          <IconButton
            aria-label="like song"
            onClick={() => setIsLiked(!isLiked)}
            size="large"
          >
            {isLiked ? 
              <FavoriteIcon sx={{ color: 'error.main', fontSize: 30 }} /> : 
              <FavoriteBorderIcon sx={{ fontSize: 30 }} />
            }
          </IconButton>
        </Box>

        {/* Details Stack */}
        <Stack spacing={1.5} sx={{ alignItems: 'flex-start', pl: { xs: 1, sm: 4 }, mb: 2 }}>
          {/* Album */}
          {detailSong.album && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AlbumIcon color="action" />
              <Typography variant="body1">
                <strong>Album:</strong> {detailSong.album}
              </Typography>
            </Box>
          )}

          {/* Genre */}
          {detailSong.genre && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CategoryIcon color="action" />
              <Typography variant="body1">
                <strong>Genre:</strong> {detailSong.genre}
              </Typography>
            </Box>
          )}
          
          {/* Play Count */}
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