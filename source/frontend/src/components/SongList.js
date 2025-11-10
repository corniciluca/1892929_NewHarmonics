import React, { useRef } from 'react';
import { Grid, Typography, Box, IconButton } from '@mui/material';
import SongCard from './SongCard';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function SongList({ songs = [], title, variant = 'grid', itemWidth = 220, height = 320, currentUser }) {
  if (!songs) songs = [];
  const scrollerRef = useRef(null);

  const scrollBy = (dir = 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.round(itemWidth * 2.5);
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  if (variant === 'carousel') {
    return (
      <Box>
        {title && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h5" fontWeight={600}>{title}</Typography>
            <Box>
              <IconButton size="small" onClick={() => scrollBy(-1)}><ChevronLeftIcon /></IconButton>
              <IconButton size="small" onClick={() => scrollBy(1)}><ChevronRightIcon /></IconButton>
            </Box>
          </Box>
        )}

        {songs.length === 0 ? (
          <Typography variant="body1" color="text.secondary">No results found.</Typography>
        ) : (
          <Box sx={{ position: 'relative' }}>
            <Box
              ref={scrollerRef}
              sx={{
                display: 'flex', gap: 2, overflowX: 'auto', scrollBehavior: 'smooth', pb: 1,
                '&::-webkit-scrollbar': { height: 8 },
                height: height,
                alignItems: 'flex-start'
              }}
            >
              {songs.map((song) => (
                <Box key={song.id || song._id || `${song.title}-${song.artist}`} sx={{ minWidth: itemWidth, flex: '0 0 auto' }}>
                  <SongCard song={song} currentUser={currentUser} />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box>
      {title && (
        <Typography variant="h5" fontWeight={600} mb={2}>{title}</Typography>
      )}
      {songs.length === 0 ? (
        <Typography variant="body1" color="text.secondary">No results found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {songs.map((song) => (
            <Grid item xs={12} sm={6} md={3} lg={2.4} key={song.id || song._id || `${song.title}-${song.artist}`}>
              <SongCard song={song} currentUser={currentUser} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
