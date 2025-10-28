import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import ArtistCard from '../components/ArtistCard';
import { getFollowedArtists } from '../api/userApi';

export default function Following({ currentUser }) {
  const [followedArtists, setFollowedArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in and has an ID
    if (currentUser && currentUser.id) {
        const fetchFollowing = async () => {
            try {
                const artists = await getFollowedArtists(currentUser.id);
                setFollowedArtists(artists);
            } catch (err) {
                console.error("Error fetching followed artists:", err);
                setError("Failed to load followed artists. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchFollowing();
    } else {
        setLoading(false);
        // This case should be handled by <Navigate to="/login"/> in App.js
    }
  }, [currentUser]);

  if (loading) {
    return <Container sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Container>;
  }

  if (error) {
    return <Container sx={{ mt: 10 }}><Alert severity="error">{error}</Alert></Container>;
  }

  return (
    <Container>
      <Typography variant="h4" sx={{mt:5, mb:3}}>Artisti che segui</Typography>

      {followedArtists.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic' }}>
          Non stai seguendo nessun artista al momento.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {followedArtists.map(artist => (
            // Assuming ArtistCard is designed to display a user object
            <Grid item xs={12} sm={6} md={4} key={artist.id}>
              <ArtistCard artist={artist} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
