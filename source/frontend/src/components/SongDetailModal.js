import React, { useContext, useState, useEffect } from "react";
import {
  Dialog, DialogContent, Typography, Box, IconButton, DialogTitle, Avatar, Stack, Chip,
  Button, Link
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import VisibilityIcon from '@mui/icons-material/Visibility';
import AlbumIcon from '@mui/icons-material/Album';
import CategoryIcon from '@mui/icons-material/Category';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DownloadIcon from '@mui/icons-material/Download'; // add this import!
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

  if (!detailSong) return null;

  const isCurrentlyPlaying = currentSong?.id === detailSong?.id;
  const visuals = detailSong?.playCount || detailSong?.play_count || detailSong?.views || detailSong?.visuals || 0;
  const artistId = detailSong?.artistId || detailSong?.userId;
  const coverImageUrl = detailSong?.coverImageUrl
    ? `${gateway}/songs/${detailSong.id}/cover`
    : null;

  const handlePlay = () => {
    playSong(detailSong);
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

  return (
    <Dialog open={!!detailSong} onClose={closeSongDetail} maxWidth="sm" fullWidth>
      <DialogTitle>
        Song Details
        <IconButton onClick={closeSongDetail} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {coverImageUrl ? (
            <Avatar src={coverImageUrl} alt="cover" sx={{ width: 72, height: 72, mr: 2 }} />
          ) : (
            <Avatar sx={{ width: 72, height: 72, mr: 2 }}>
              <MusicNoteIcon />
            </Avatar>
          )}
          <Box>
            <Typography variant="h6">{detailSong.title}</Typography>
            {artistId ? (
              <Link component={RouterLink} to={`/user/${artistId}`} underline="hover" color="inherit">
                <Typography variant="body2" color="gray">{detailSong.artist}</Typography>
              </Link>
            ) : (
              <Typography variant="body2" color="gray">{detailSong.artist}</Typography>
            )}
            <Stack direction="row" spacing={1} mt={1}>
              {detailSong.album && (
                <Chip icon={<AlbumIcon />} label={`Album: ${detailSong.album}`} />
              )}
              {detailSong.genre && (
                <Chip icon={<CategoryIcon />} label={`Genre: ${detailSong.genre}`} />
              )}
              <Chip icon={<VisibilityIcon />} label={`Plays: ${visuals}`} />
            </Stack>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            color={isCurrentlyPlaying ? "secondary" : "primary"}
            onClick={handlePlay}
            startIcon={<PlayArrowIcon />}
          >
            {isCurrentlyPlaying ? "Playing" : "Play"}
          </Button>
          <Button
            variant={isLiked ? "contained" : "outlined"}
            color="primary"
            onClick={handleLikeToggle}
            startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          >
            {isLiked ? "Unlike" : "Like"}
          </Button>
          {/* Add Download Button */}
          <Button
            variant="outlined"
            color="primary"
            component="a"
            href={`${gateway}/songs/${detailSong.id}/download`}
            download={`${detailSong.title.replace(/[^a-z0-9]+/gi, '_')}.mp3`}
            startIcon={<DownloadIcon />}
          >
            Download
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
