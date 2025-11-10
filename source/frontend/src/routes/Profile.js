import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Avatar, Box, Button, Grid, Paper, IconButton, Divider, CircularProgress, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SongCard from '../components/SongCard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { getSongsByArtistId } from '../api/songApi';
import { getFollowedArtists } from '../api/userApi';

export default function Profile({ user }) {
    const navigate = useNavigate();
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState([]);

    useEffect(() => {
      if (user && user.id) {
          const fetchUserData = async () => {
              try {
                  const userSongs = await getSongsByArtistId(user.id);
                  setSongs(userSongs);

                  const followedArtists = await getFollowedArtists(user.id);
                  setFollowing(followedArtists);
              } catch (error) {
                  console.error("Error fetching user data:", error);
              } finally {
                  setLoading(false);
              }
          };

          fetchUserData();
      } else if (user) {
          console.warn("User object is missing an ID. Cannot fetch songs/following.");
          setLoading(false);
      }
}, [user]);

if (!user) return <Container sx={{ mt: 5 }}><Typography>Please log in to view your profile.</Typography></Container>;
if (loading) return <Container sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Container>;

return (
    <Container>
      {/* ... (Existing Profile header content remains the same) ... */}

      {/* User Info Section */}
      <Box sx={{ display:'flex', alignItems:'center', mt:5, mb:3 }}>
        <Avatar sx={{ width: 90, height: 90, mr:3, bgcolor: 'primary.main' }}>
            {user.username.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h4">{user.username}</Typography>
          <Typography variant="body1" color="text.secondary">{user.email}</Typography>
          <Chip label={user.role} color={user.role === 'ARTIST' ? 'secondary' : 'default'} sx={{ mt: 1 }} />
        </Box>
        <IconButton onClick={() => navigate('/edit-profile')} sx={{ ml: 'auto' }}>
          <EditIcon />
        </IconButton>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Artist Songs Section (Only for Artists) */}
      {user.role === 'ARTIST' && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
            Your Uploaded Songs ({songs.length})
          </Typography>
          <Grid container spacing={3}>
            {songs.slice(0, 3).map(song => (
              <Grid item xs={12} sm={6} md={4} key={song.id}>
                {/* Assuming SongCard component exists */}
                <SongCard song={song} showPlayButton={true} />
              </Grid>
            ))}
            {songs.length === 0 && (
              <Typography sx={{ ml: 2, fontStyle: 'italic' }}>You haven't uploaded any songs yet.</Typography>
            )}

            {/* Show this button if the user has ANY songs */}
            {songs.length > 0 && (
              <Grid item xs={12} sx={{ textAlign: 'right', mt: 1 }}>
                <Button
                  variant="text"
                  onClick={()=>navigate('/manage-songs')}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Manage all
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      <Divider sx={{ my: 4 }} />

      {/* Following Artists Section */}
      <Box>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>Following Artists</Typography>
        <Grid container spacing={3}>
          {following.map(artist => (
            <Grid
                item
                key={artist.id}
                xs={6} sm={4} md={3}
                sx={{ textAlign: 'center', cursor: 'pointer' }}
                onClick={() => navigate(`/user/${artist.id}`)}
            >
              <Avatar sx={{ width: 80, height: 80, mb: 1, mx: 'auto' }}>
                {artist.username.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body1">{artist.username}</Typography>
            </Grid>
          ))}
          {following.length === 0 && (
             <Typography sx={{ ml: 2, fontStyle: 'italic' }}>You are not following any artists yet.</Typography>
          )}
        </Grid>
      </Box>
    </Container>
    );
}