import React from "react";
import {
  Card, CardContent, CardMedia, Typography, CardActions, IconButton, Box
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import FastForwardIcon from "@mui/icons-material/FastForward";

export default function SongCard({ song, color }) {
  return (
    <Card sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      borderRadius: 4, bgcolor: `${color || "#bdbdbd"}12`,
      boxShadow: 2, transition: 'transform 0.2s, box-shadow 0.2s',
      "&:hover": { transform: "scale(1.035)", boxShadow: 8, bgcolor: `${color || "#bdbdbd"}22` }
    }}>
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h6" fontWeight={600}>{song.title}</Typography>
        <Typography variant="subtitle2" color="text.secondary">{song.artist}</Typography>
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
        <IconButton sx={{ color }}><FastRewindIcon /></IconButton>
        <IconButton sx={{ color }}><PlayArrowIcon /></IconButton>
        <IconButton sx={{ color }}><FastForwardIcon /></IconButton>
      </CardActions>
    </Card>
  );
}
