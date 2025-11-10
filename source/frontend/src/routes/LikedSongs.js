// src/pages/LikedSongs.js

import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import SongCard from '../components/SongCard';
import { getLikedSongs } from '../api/songApi';

export default function LikedSongs({ currentUser }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setError("Devi effettuare il login per vedere i tuoi brani preferiti.");
      setLoading(false);
      return;
    }

    const fetchLikedSongs = async () => {
      try {
        setError(null);
        setLoading(true);
        const likedSongs = await getLikedSongs();
        setSongs(likedSongs);
      } catch (err) {
        console.error("Errore nel caricamento dei brani preferiti:", err);
        setError(err.message || "Impossibile caricare i brani preferiti. Riprova.");
      } finally {
        setLoading(false);
      }
    };

    fetchLikedSongs();
  }, [currentUser]);

  if (loading) {
    return <Container sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Container>;
  }

  if (error) {
    return (
      <Container sx={{ mt: 10 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 5, mb: 3, fontWeight: 700, color: '#7e57c2' }}>
        Your liked songs 💜
      </Typography>

      {songs.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic' }}>
          You still havent liked any song
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {songs.map(song => (
            <Grid item key={song.id || song._id} xs={12} sm={6} md={3}>
              <SongCard song={song} color="#7e57c2" currentUser={currentUser} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}