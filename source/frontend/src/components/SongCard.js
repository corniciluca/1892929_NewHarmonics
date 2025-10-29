import React, { useContext, useState, useEffect } from "react";
import {
  Card, CardContent, CardMedia, Typography, CardActions, IconButton, Box, Chip, Link
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link as RouterLink } from 'react-router-dom';
import { PlayerContext } from './PlayerContext';
import { likeSong, unlikeSong } from '../api/songApi';

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

    // 4. Implement the toggle like handler
    const handleLikeToggle = async (e) => {
      e.stopPropagation();
      if (!currentUser) {
          alert("You must be logged in to like a song.");
          return;
      }

      try {
          if (isLiked) {
              // UNLIKE action
              await unlikeSong(song.id);
              setLikes(l => l - 1); // Optimistic UI update
          } else {
              // LIKE action
              await likeSong(song.id);
              setLikes(l => l + 1); // Optimistic UI update
          }
          setIsLiked(l => !l); // Toggle the heart icon
      } catch (error) {
          console.error("Error toggling like status:", error);
          alert(`Failed to update like status. Please try again.`);
          // Note: For a rollback, you would revert the setLikes/setIsLiked calls here
      }
    };


  const { playSong, openSongDetail } = player || {}; // Destructure safely
  return (
    <Card sx={{

      width: 180, // Set a FIXED width (adjust 180 as you like)

      display: 'flex', flexDirection: 'column', alignItems: 'center',
      borderRadius: 4, bgcolor: `${color || "#bdbdbd"}12`,
      boxShadow: 2, transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      "&:hover": { transform: "scale(1.035)", boxShadow: 8, bgcolor: `${color || "#bdbdbd"}22` }
    }}
      onClick={() => openSongDetail && openSongDetail(song)}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h6" fontWeight={600} sx={{
            // --- FIXES FOR TEXT OVERFLOW ---
            width: '100%',
            whiteSpace: 'nowrap',      // Keep text on one line
            overflow: 'hidden',        // Hide text that overflows
            textOverflow: 'ellipsis'   // Add "..." at the end
            // --- END FIXES ---
          }}
          >{song.title}</Typography>
        {/* Controlla se abbiamo un ID artista per creare il link */}
        {(() => {
          // Prova a trovare l'ID dell'artista. 
          // Le API a volte usano 'artistId' o 'userId' per l'autore.
          const artistId = song.artistId || song.userId;

          return (
            <Typography variant="subtitle2" color="text.secondary" sx={{
                width: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {artistId ? (
                // 1. Se l'ID esiste, crea un Link
                <Link 
                  component={RouterLink} 
                  to={`/user/${artistId}`}
                  sx={{ 
                    color: 'inherit', 
                    textDecoration: 'none',
                    '&:hover': {
                       textDecoration: 'underline',
                       color: 'primary.main' // Opzionale: cambia colore al passaggio del mouse
                    }
                  }}
                  // Impedisce al player di aprirsi se si clicca sul nome
                  onClick={(e) => e.stopPropagation()} 
                >
                  {song.artist}
                </Link>
              ) : (
                // 2. Altrimenti, mostra solo il nome
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
      <Box sx={{
        bgcolor: color || "#bdbdbd", width: 90, height: 90, borderRadius: 3, mb: 1,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <CardMedia
          component="img"
          image="https://img.icons8.com/ios-filled/100/ffffff/musical-notes.png"
          alt="Album Cover"
          sx={{ width: 60, height: 60, opacity: 0.85 }}
        />
      </Box>
      <CardActions sx={{ justifyContent: 'center', mb: 1 }}>
        <IconButton sx={{ color }} onClick={handleLikeToggle}>
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>

        <IconButton sx={{ color }} onClick={(e) => {
          e.stopPropagation();
          player && player.playSong && player.playSong(song)
          }}>
          <PlayArrowIcon />
        </IconButton>
        
      </CardActions>
    </Card>
  );
}
