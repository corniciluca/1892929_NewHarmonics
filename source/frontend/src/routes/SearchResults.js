import React, { useEffect, useState } from 'react';
import { Container, Box, CircularProgress, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { searchSongs } from '../api/songApi';
import SongList from '../components/SongList';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!q || q.trim().length === 0) {
      setSongs([]);
      return;
    }

    setLoading(true);
    setError(null);
    searchSongs(q)
      .then((res) => {
        // backend returns SongDocument objects; normalize to a lightweight song shape if needed
        setSongs(res || []);
      })
      .catch((err) => {
        console.error('Search error', err);
        setError(err.message || 'Search failed');
      })
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <Container sx={{ mt: 4, mb: 4 }} maxWidth="xl">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Search results</Typography>
        <Typography variant="subtitle1" color="text.secondary">Results for "{q}"</Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <SongList songs={songs} />
      )}
    </Container>
  );
}
