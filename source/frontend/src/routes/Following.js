import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    CircularProgress,
    Alert,
    Paper, 
    Avatar 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; 
import { getFollowedArtists } from '../api/userApi';

export default function Following({ currentUser }) {
  const [followedArtists, setFollowedArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    }
  }, [currentUser]);

  if (loading) {
    return <Container sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Container>;
  }

  if (error) {
    return <Container sx={{ mt: 10 }}><Alert severity="error">{error}</Alert></Container>;
  }

  return (
    <Container sx={{ mt: 5 }}>
      {/* Use the same styling as your other main pages */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: 'secondary.main' }}>
        Artists You Follow
      </Typography>

      {followedArtists.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic' }}>
          Non stai seguendo nessun artista al momento.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {followedArtists.map(artist => (
            <Grid item xs={12} sm={6} md={3} key={artist.id}>
              <Paper
                component={RouterLink}
                to={`/user/${artist.id}`} 
                sx={{
                  p: 2,
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': { boxShadow: 4 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Avatar sx={{ width: 100, height: 100, margin: 'auto', mb: 2, bgcolor: 'secondary.light' }}>
                  {artist.username.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" fontWeight={500} noWrap>
                  {artist.username}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}