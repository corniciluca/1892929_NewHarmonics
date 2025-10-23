import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Avatar, Box, Button, Grid, Paper, IconButton, Divider, CircularProgress, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SongCard from '../components/SongCard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
// 1. Import your new function
import { getSongsByArtistId } from '../api/songApi'; 

export default function Profile({ user }) {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We check for 'user' and 'user.id' before fetching
    if (user && user.id) {
        // 2. Use the new, efficient API call
        getSongsByArtistId(user.id)
            .then(userSongs => {
                // The API now returns an array directly, not an object with 'content'
                setSongs(userSongs);
            })
            .catch(error => console.error("Errore nel caricamento delle canzoni:", error))
            .finally(() => setLoading(false));
    } else if (user) {
        // Fallback if user object doesn't have an ID (from old localStorage)
        console.warn("User object is missing an ID. Cannot fetch songs.");
        setLoading(false);
    }
    // Dependency array now correctly includes user.id
  }, [user]);

  if (!user) {
    return (
      <Container sx={{ textAlign: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  // Helper for placeholder "Following" section
  const following = [
    { id: 1, username: 'ArtistOne' },
    { id: 2, username: 'ArtistTwo' },
    { id: 3, username: 'ArtistThree' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      {/* This structure matches your mockup's layout */}
      <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', mb: 3}}>
        <Avatar sx={{ width: 120, height: 120, mb: 2 }}>
          {/* You can add a real profile picture here later */}
          <AccountCircleIcon sx={{ fontSize: 130 }} />
        </Avatar>
        <Typography variant="h4" fontWeight={700}>{user.username}</Typography>
        <Typography variant="body1" color="text.secondary">{user.email}</Typography>
        <Chip label={user.role} color={user.role === 'ARTIST' ? 'secondary' : 'default'} sx={{ mt: 1 }} />
        <Button 
          startIcon={<EditIcon/>} 
          variant="outlined" 
          color="inherit"
          sx={{mt: 2, borderRadius: 20, textTransform: 'none', px: 3}} 
          onClick={()=>navigate('/edit-profile')}
        >
          Edit
        </Button>
      </Box>

      {/* Latest Uploads Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>Latest Uploads</Typography>
        {loading ? <CircularProgress /> : (
          <Grid container spacing={2}>
            {songs.length > 0 ? (
              // 3. Show 5 songs, like the mockup
              songs.slice(0, 5).map(song => (
                <Grid item xs={12} sm={4} md={2.4} key={song.id}>
                  <SongCard song={song} />
                </Grid>
              ))
            ) : (
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
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* 4. Following Artists Section (from mockup) */}
      <Box>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>Following Artists</Typography>
        <Grid container spacing={3}>
          {following.map(artist => (
            <Grid item key={artist.id} sx={{ textAlign: 'center' }}>
              <Avatar sx={{ width: 80, height: 80, mb: 1, mx: 'auto' }}>
                <AccountCircleIcon sx={{ fontSize: 80 }} />
              </Avatar>
              <Typography variant="body1">{artist.username}</Typography>
            </Grid>
          ))}
          {following.length === 0 && (
             <Typography sx={{ ml: 2, fontStyle: 'italic' }}>You aren't following any artists yet.</Typography>
          )}
        </Grid>
      </Box>
    </Container>
  );
}