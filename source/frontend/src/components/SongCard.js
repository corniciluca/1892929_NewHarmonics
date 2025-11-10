import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Card, CardContent, CardMedia, Typography, CardActions, IconButton, Box, Chip, Link
} from "@mui/material";
import { keyframes } from "@mui/system";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from '@mui/icons-material/Visibility';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Link as RouterLink } from 'react-router-dom';
import { PlayerContext } from './PlayerContext';
import { likeSong, unlikeSong } from '../api/songApi';

const gateway = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:9000';

const marquee = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); } /* Scrolls 1 copy length */
`;

export default function SongCard({ song, color, currentUser }) {
  const visuals = song.playCount || song.play_count || song.views || song.visuals || 0;
  const player = useContext(PlayerContext);

  const initialLikes = song.likedBy ? song.likedBy.length : 0;
  const [likes, setLikes] = useState(initialLikes);
  const isUserLiked = !!currentUser && !!song.likedBy && song.likedBy.includes(currentUser.id);
  const [isLiked, setIsLiked] = useState(isUserLiked);

  // Logic to detect if text is overflowing ---
  const titleRef = useRef(null);
  const artistRef = useRef(null);
  const [isTitleOverflowing, setIsTitleOverflowing] = useState(false);
  const [isArtistOverflowing, setIsArtistOverflowing] = useState(false);
  const [titleScrollDuration, setTitleScrollDuration] = useState(7);
  const [artistScrollDuration, setArtistScrollDuration] = useState(5);

  useEffect(() => {
    // Sync like status when song or user changes
    const newInitialLikes = song.likedBy ? song.likedBy.length : 0;
    const newIsUserLiked = !!currentUser && !!song.likedBy && song.likedBy.includes(currentUser.id);
    setLikes(newInitialLikes);
    setIsLiked(newIsUserLiked);

    // Check for text overflow
    const checkOverflow = () => {
      if (titleRef.current) {
        const isOverflowing = titleRef.current.scrollWidth > titleRef.current.clientWidth;
        setIsTitleOverflowing(isOverflowing);
        if (isOverflowing) {
          // Calculate duration based on text length (e.g., 60px per second)
          setTitleScrollDuration(titleRef.current.scrollWidth / 60);
        }
      }
      if (artistRef.current) {
        const isOverflowing = artistRef.current.scrollWidth > artistRef.current.clientWidth;
        setIsArtistOverflowing(isOverflowing);
        if (isOverflowing) {
          setArtistScrollDuration(artistRef.current.scrollWidth / 60);
        }
      }
    };

    setTimeout(checkOverflow, 100); // Check on mount
    window.addEventListener('resize', checkOverflow); // Re-check on window resize
    return () => window.removeEventListener('resize', checkOverflow);

  }, [song, currentUser]); // Re-check if song or user changes

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

  const coverImageUrl = song.id ? `${gateway}/songs/${song.id}/cover` : null;
  const { playSong, openSongDetail } = player || {};

  const scrollingSx = () => ({
      display: 'inline-block',
      whiteSpace: 'nowrap',
    });

  return (
    <Card sx={{
      width: 210,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      borderRadius: 4, bgcolor: `${color || "#bdbdbd"}12`,
      boxShadow: 2, transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      "&:hover": {
        transform: "scale(1.035)",
        boxShadow: 8,
        bgcolor: `${color || "#bdbdbd"}22`,

        // Target title and apply animation on card hover
        '& .song-card-title-scroll': {
          animation: `${marquee} ${titleScrollDuration}s linear infinite`,
          animationDelay: '0.5s',
        },
        // Target artist and apply animation on card hover
        '& .song-card-artist-scroll': {
          animation: `${marquee} ${artistScrollDuration}s linear infinite`,
          animationDelay: '0.5s',
        },
      }
    }}
      onClick={() => openSongDetail && openSongDetail(song)}
    >
      <CardContent sx={{ textAlign: "center", width: '100%', pb: 0, px: 1 }}>
          {/* Title */}
          <Typography
                ref={titleRef}
                variant="h6"
                fontWeight={600}
                noWrap
                sx={{ width: '100%', overflow: 'hidden' }} // The "window"
              >
                <Box
                  component="span"
                  // Add a class name for the card's hover to target
                  className={isTitleOverflowing ? "song-card-title-scroll" : ""}
                  sx={isTitleOverflowing ? scrollingSx() : { whiteSpace: 'nowrap', display: 'inline-block' }}
                >
                  {song.title}
                  {isTitleOverflowing && (
                    <>
                      <Box component="span" sx={{ pl: 4 }} />
                      {song.title}
                    </>
                  )}
                </Box>
              </Typography>

          {/* Artist */}
          <Typography
              ref={artistRef}
              variant="subtitle2"
              color="text.secondary"
              noWrap
            >
              {(() => {
                const artistId = song.artistId || song.userId;

                // This is the scrolling text block
                const artistNameSpan = (
                  <Box
                    component="span"
                    className={isArtistOverflowing ? "song-card-artist-scroll" : ""}
                    sx={isArtistOverflowing ? scrollingSx() : { whiteSpace: 'nowrap', display: 'inline-block' }}
                  >
                    {song.artist}
                    {isArtistOverflowing && (
                      <>
                        <Box component="span" sx={{ pl: 4 }} />
                        {song.artist}
                      </>
                    )}
                  </Box>
                );

                return artistId ? (
                  <Link
                      // Add the class name for the card to target
                      className="song-card-artist-link"
                      component={RouterLink}
                      to={`/user/${artistId}`}
                      sx={
                        {
                          color: 'inherit',
                          textDecoration: 'none',
                          width: '100%',
                          display: 'inline-block',
                          overflow: 'hidden',
                          '&:hover': {
                            color: color || 'primary.main', 
                            fontWeight: 600,
                          }
                        }
                      }
                      onClick={(e) => e.stopPropagation()}
                    >
                      {artistNameSpan}
                    </Link>
                ) : (
                  // If no ID, just show the text (as a non-link)
                  <Box sx={{ width: '100%', overflow: 'hidden' }}>
                    {artistNameSpan}
                  </Box>
                );
              })()}
            </Typography>

          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <VisibilityIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">{visuals}</Typography>
          </Box>
        </CardContent>

      <Box sx={{
        width: 120, height: 120,
        borderRadius: 3, mb: 1, mt: 1,
        display: "flex", alignItems: "center", justifyContent: "center",
        bgcolor: coverImageUrl ? 'transparent' : (color || "#bdbdbd" + "55"),
        overflow: 'hidden',
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