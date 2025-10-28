import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Avatar,
    Box,
    Button,
    Grid,
    CircularProgress,
    Alert,
    Divider,
    Chip
} from '@mui/material';
import SongCard from '../components/SongCard';
import {
    getUserById,
    getFollowedArtists,
    followArtist,
    unfollowArtist
} from '../api/userApi';
import { getSongsByArtistId } from '../api/songApi';

export default function UserProfile({ currentUser }) {
  // Use 'id' to match the original file's destructuring
  const { id } = useParams();
  const navigate = useNavigate();

  // State for the profile being viewed (using 'user' as in original)
  const [user, setUser] = useState(null);
  const [songs, setSongs] = useState([]);

  // State for follow logic
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false); // For the follow button
  const [error, setError] = useState(null);

  useEffect(() => {
    // 3. Check if this is the current user's own profile
    if (currentUser && currentUser.id === parseInt(id)) {
      setIsCurrentUser(true);
    } else {
      setIsCurrentUser(false);
    }

    // 4. Fetch all data for the profile page
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous error

        // Fetch the profile user's data
        const userData = await getUserById(id);
        setUser(userData);

        // Fetch their songs if they are an artist
        if (userData.role === 'ARTIST') {
          const userSongs = await getSongsByArtistId(id);
          setSongs(userSongs);
        } else {
            setSongs([]);
        }

        // 5. Check follow status (only if logged in, not their own profile, and the profile is an ARTIST)
        if (currentUser && currentUser.id && currentUser.id !== parseInt(id) && userData.role === 'ARTIST') {
          // Get the list of artists the *current user* follows
          const followedList = await getFollowedArtists(currentUser.id);
          // Check if the profileUser's ID is in that list
          const alreadyFollowing = followedList.some(artist => String(artist.id) === id);
          setIsFollowing(alreadyFollowing);
        } else {
            setIsFollowing(false);
        }

      } catch (err) {
        // Using the existing Italian error string from the original file
        setError(err.message || "Impossibile caricare il profilo dell'utente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentUser]); // Re-run when the URL (id) or currentUser changes

  // 6. Handler for the follow/unfollow button
  const handleFollowToggle = async () => {
    if (!currentUser) {
      navigate('/login'); // Not logged in, send to login
      return;
    }

    if (!user || user.role !== 'ARTIST') return;

    setFollowLoading(true);
    try {
        // This is the ID of the artist profile being viewed (e.g., 2)
        const artistId = parseInt(id);

      if (isFollowing) {
        await unfollowArtist(artistId);
        setIsFollowing(false);
      } else {
        await followArtist(artistId);
        setIsFollowing(true);
      }
    } catch (err) {
      setError("Failed to update follow status. Please try again.");
    } finally {
      setFollowLoading(false);
    }
  };

  // --- Render Logic ---
  if (loading) return <Container sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Container>;
  if (error) return <Container sx={{ mt: 10 }}><Alert severity="error">{error}</Alert></Container>;
  if (!user) return <Container sx={{ mt: 10 }}><Typography>Utente non trovato.</Typography></Container>;

  const isArtist = user.role === 'ARTIST';

  return (
    <Container sx={{ mt: 5 }}>
      {/* User Info Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', pb: 2 }}>
        <Avatar sx={{ width: 90, height: 90, mr: 3, bgcolor: 'primary.main' }}>
          {user.username.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {user.username}
          </Typography>
          <Typography variant="body1" color="text.secondary">{user.email}</Typography>
          <Chip
            label={user.role}
            color={isArtist ? 'secondary' : 'default'}
            sx={{ mt: 1 }}
          />
        </Box>

        {/* 7. Render Follow Button */}
        <Box sx={{ ml: 'auto' }}>
          {/* Show the button only if logged in, NOT their own profile, AND the profile is an ARTIST */}
          {currentUser && !isCurrentUser && isArtist && (
            <Button
              variant={isFollowing ? "outlined" : "contained"}
              color="secondary"
              disabled={followLoading}
              onClick={handleFollowToggle}
            >
              {followLoading ? <CircularProgress size={24} /> : (isFollowing ? "Following" : "Follow")}
            </Button>
          )}
          {/* If this is the user's own profile, show Edit button instead */}
          {isCurrentUser && (
             <Button variant="outlined" onClick={() => navigate('/edit-profile')}>
              Edit Profile
            </Button>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Artist Songs Section */}
      {isArtist && (
        <Box>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
            Songs by {user.username}
          </Typography>
          <Grid container spacing={3}>
            {songs.length > 0 ? (
              songs.map((song) => (
                <Grid item xs={12} sm={6} md={4} key={song.id}>
                  <SongCard song={song} />
                </Grid>
              ))
            ) : (
              <Typography sx={{ ml: 2, fontStyle: 'italic' }}>Questo artista non ha ancora caricato canzoni.</Typography>
            )}
          </Grid>
        </Box>
      )}

      {/* If profile is a LISTENER */}
      {!isArtist && (
         <Typography sx={{ fontStyle: 'italic' }}>
            Questo utente è un ascoltatore e non ha caricato canzoni.
         </Typography>
      )}

    </Container>
  );
}

