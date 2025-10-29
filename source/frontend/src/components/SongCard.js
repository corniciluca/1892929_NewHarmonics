import React, { useContext, useState, useEffect } from "react";
import {
  Card, CardContent, CardMedia, Typography, CardActions, IconButton, Box, Chip, Link
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from '@mui/icons-material/Visibility';
import MusicNoteIcon from '@mui/icons-material/MusicNote'; // 1. Import MusicNoteIcon
import { Link as RouterLink } from 'react-router-dom';
import { PlayerContext } from './PlayerContext';
import { likeSong, unlikeSong } from '../api/songApi';

// 2. Define the gateway URL (same as in PlayerContext.js)
const gateway = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:9000';

export default function SongCard({ song, color, currentUser }) {
  const visuals = song.playCount || song.play_count || song.views || song.visuals || 0;
  const player = useContext(PlayerContext);

  const initialLikes = song.likedBy ? song.likedBy.length : 0;
  const [likes, setLikes] = useState(initialLikes);
  const isUserLiked = !!currentUser && !!song.likedBy && song.likedBy.includes(currentUser.id);
  const [isLiked, setIsLiked] = useState(isUserLiked);
  
  useEffect(() => {
      const newInitialLikes = song.likedBy ? song.likedBy.length : 0;
      const newIsUserLiked = !!currentUser && !!song.likedBy && song.likedBy.includes(currentUser.id);
      setLikes(newInitialLikes);
      setIsLiked(newIsUserLiked);
    }, [song, currentUser]);

    const handleLikeToggle = async (e) => {
      e.stopPropagation();
      if (!currentUser) {
          alert("You must be logged in to like a song.");
          return;
      }
      try {
          if (isLiked) {
              await unlikeSong(song.id);
              setLikes(l => l - 1);
          } else {
              await likeSong(song.id);
              setLikes(l => l + 1);
          }
          setIsLiked(l => !l);
      } catch (error) {
          console.error("Error toggling like status:", error);
          alert(`Failed to update like status. Please try again.`);
      }
    };

  // 3. Construct the cover image URL
  // We check 'song.coverImageUrl' which is the *path* saved in the database
  const coverImageUrl = song.coverImageUrl ? `${gateway}/songs/${song.id}/cover` : null;

  const { playSong, openSongDetail } = player || {};
  
  return (
    <Card sx={{
      width: 180,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      borderRadius: 4, bgcolor: `${color || "#bdbdbd"}12`,
      boxShadow: 2, transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      "&:hover": { transform: "scale(1.035)", boxShadow: 8, bgcolor: `${color || "#bdbdbd"}22` }
    }}
      onClick={() => openSongDetail && openSongDetail(song)}
    >
      <CardContent sx={{ textAlign: "center", width: '100%', pb: 0, px: 1 }}> {/* Reduced padding */}
        <Typography variant="h6" fontWeight={600} noWrap sx={{ width: '100%' }}>
          {song.title}
        </Typography>
        
        {/* Artist Link Logic... */}
        {(() => {
          const artistId = song.artistId || song.userId;
          return (
            <Typography variant="subtitle2" color="text.secondary" noWrap sx={{ width: '100%' }}>
              {artistId ? (
                <Link component={RouterLink} to={`/user/${artistId}`}
                  sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' }}}
                  onClick={(e) => e.stopPropagation()} 
                >
                  {song.artist}
                </Link>
              ) : (
                song.artist
              )}
            </Typography>
          );
        })()}
        
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
          <VisibilityIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">{visuals}</Typography>
        </Box>
      </CardContent>
      
      {/* 4. This Box now handles either the image or the icon */}
      <Box sx={{
        width: 120, height: 120, // Make the container larger
        borderRadius: 3, mb: 1, mt: 1, // Add margin-top
        display: "flex", alignItems: "center", justifyContent: "center",
        bgcolor: coverImageUrl ? 'transparent' : (color || "#bdbdbd" + "55"), // Show bgcolor only for icon
        overflow: 'hidden', // Hide parts of image that don't fit
        boxShadow: 2
      }}>
        {coverImageUrl ? (
          <CardMedia
            component="img"
            image={coverImageUrl}
            alt={song.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <MusicNoteIcon sx={{ width: 70, height: 70, opacity: 0.85, color: color ? 'white' : '#616161' }} />
        )}
      </Box>

      <CardActions sx={{ justifyContent: 'center', mb: 1, pt: 0 }}>
        <IconButton sx={{ color }} onClick={handleLikeToggle}>
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>

        <IconButton sx={{ color }} onClick={(e) => {
          e.stopPropagation();
          playSong && playSong(song);
        }}>
          <PlayArrowIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}