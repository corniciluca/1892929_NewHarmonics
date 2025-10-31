import React, { useEffect, useState } from 'react';
import { Container, Box, CircularProgress, Typography, Grid } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { searchSongs } from '../api/songApi';
import { getUserById } from '../api/userApi';
import SongList from '../components/SongList';
import ArtistCard from '../components/ArtistCard';

export default function SearchResults({ currentUser }) {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';

  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!q || q.trim().length === 0) {
      setSongs([]);
      setArtists([]);
      return;
    }

    let mounted = true;

    const doSearch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await searchSongs(q);
        const results = res || [];
        if (!mounted) return;
        setSongs(results);

        // derive unique artists from song results
        const map = new Map();
        results.forEach(s => {
          const id = s.artistId || s.artist_id || null;
          const name = s.artist || s.artistName || s.artist_name || '';
          const key = id ? String(id) : name;
          if (!map.has(key)) {
            map.set(key, { id, name, avatarUrl: s.coverImageUrl || undefined });
          }
        });

        // Fetch artist details from user service for entries that have an id
        const entries = Array.from(map.entries());
        const ids = entries.filter(([k, a]) => a.id).map(([k, a]) => a.id);
        if (ids.length > 0) {
          const details = await Promise.all(ids.map(id => getUserById(id).catch(() => null)));
          // Merge details back into the map; details are in same order as ids
          let di = 0;
          for (let [key, art] of entries) {
            if (art.id) {
              const det = details[di++];
              if (det) {
                const username = det.username || det.name || art.name;
                const avatar = det.avatarUrl || det.profilePicture || art.avatarUrl;
                map.set(key, { id: art.id, name: username, avatarUrl: avatar });
              }
            }
          }
        }

        if (mounted) setArtists(Array.from(map.values()));
      } catch (err) {
        console.error('Search error', err);
        if (mounted) setError(err.message || 'Search failed');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    doSearch();

    return () => { mounted = false; };
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
        <>
          {artists && artists.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Artists</Typography>
              <Grid container spacing={2}>
                {artists.map(a => (
                  <Grid item key={a.id || a.name} xs={12} sm={6} md={3} lg={2}>
                    <ArtistCard artist={{ id: a.id, name: a.name, avatarUrl: a.avatarUrl }} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Songs</Typography>
            <SongList songs={songs} currentUser={currentUser} />
          </Box>
        </>
      )}
    </Container>
  );
}
