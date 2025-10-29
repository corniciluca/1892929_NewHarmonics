import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import SongCard from '../components/SongCard'; // Import your SongCard
import { getUserFeed } from '../api/songApi'; // Import your standardized API function

// Accept currentUser to pass it down to SongCard for 'like' functionality
export default function FeedPage({ currentUser }) {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeed = async () => {
            // This component requires a logged-in user
            if (!currentUser) {
                setError("You must be logged in to view your feed.");
                setLoading(false);
                return;
            }

            try {
                // Use the API function from songApi.js
                // It automatically handles auth headers
                const data = await getUserFeed(currentUser.id); //
                setSongs(data);
            } catch (e) {
                setError(e.message || "Failed to fetch feed data.");
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, [currentUser]); // Re-run if the user logs in or out

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
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: 'primary.main' }}>
                Your Feed
            </Typography>

            {songs.length === 0 ? (
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    No songs in your feed yet. Follow some artists to see their latest uploads here!
                </Typography>
            ) : (
                <Grid container spacing={4}>
                    {songs.map(song => (
                        <Grid item key={song.id} xs={12} sm={6} md={3}>
                            {/* Use SongCard and pass currentUser */}
                            <SongCard song={song} currentUser={currentUser} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}