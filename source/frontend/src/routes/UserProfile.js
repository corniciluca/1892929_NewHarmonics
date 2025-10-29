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
    Chip,
    Paper
} from '@mui/material';
import SongCard from '../components/SongCard';
import {
    getUserById,
    getFollowedArtists,
    followArtist,
    unfollowArtist
} from '../api/userApi';
import { getSongsByArtistId, getLikedSongs } from '../api/songApi';
import { Link as RouterLink } from 'react-router-dom';

export default function UserProfile({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [songs, setSongs] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([])

  const [isFollowing, setIsFollowing] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Use loose equality (==) since one might be string, one number
    const isOwnProfile = currentUser && currentUser.id == id;
    setIsCurrentUser(isOwnProfile);

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userData = await getUserById(id);
        setUser(userData);

        if (isOwnProfile) {
            try {
                const userLikedSongs = await getLikedSongs();
                setLikedSongs(userLikedSongs);
            } catch (likedErr) {
                console.warn("Could not fetch liked songs:", likedErr);
                setLikedSongs([]);
            }

            try {
                const followed = await getFollowedArtists(currentUser.id);
                setFollowedArtists(followed);
            } catch (followedErr) {
                console.warn("Could not fetch followed artists:", followedErr);
                setFollowedArtists([]);
            }
        } else {
            setLikedSongs([]);
        }

        if (userData.role === 'ARTIST') {
          const userSongs = await getSongsByArtistId(id);
          setSongs(userSongs);
        } else {
            setSongs([]);
        }

        // Use loose equality (!=)
        if (currentUser && currentUser.id && currentUser.id != id && userData.role === 'ARTIST') {
          const followedList = await getFollowedArtists(currentUser.id);
          const alreadyFollowing = followedList.some(artist => String(artist.id) === id);
          setIsFollowing(alreadyFollowing);
        } else {
            setIsFollowing(false);
        }

      } catch (err) {
        setError(err.message || "Impossibile caricare il profilo dell'utente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentUser]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!user || user.role !== 'ARTIST') return;

    setFollowLoading(true);
    try {
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

  if (loading) return <Container sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Container>;
  if (error) return <Container sx={{ mt: 10 }}><Alert severity="error">{error}</Alert></Container>;
  if (!user) return <Container sx={{ mt: 10 }}><Typography>Utente non trovato.</Typography></Container>;

  // This is correct as you set it
  const PREVIEW_COUNT = 5
  const isArtist = user.role === 'ARTIST';

  return (
    <Container sx={{ mt: 5 }}>
      {/* User Info Section (unchanged) */}
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
        <Box sx={{ ml: 'auto' }}>
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
          {isCurrentUser && (
             <Button variant="outlined" onClick={() => navigate('/edit-profile')}>
              Edit Profile
            </Button>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

        {/* --- LIKED SONGS SECTION --- */}
        {isCurrentUser && (
          <>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" fontWeight={600}>
                  Your Liked Songs
                </Typography>
                <Button
                  component={RouterLink}
                  to="/songs/liked"
                  size="small"
                >
                  See All
                </Button>
              </Box>

              {likedSongs.length > 0 ? (
              <Grid container spacing={3}>
                {likedSongs.slice(0, PREVIEW_COUNT).map((song) => (
                  // --- FIX: Changed md={3} to md={2.4} for 5 columns ---
                  <Grid item xs={12} sm={6} md={2.4} key={song.id}>
                    <SongCard song={song} currentUser={currentUser} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography sx={{ ml: 2, fontStyle: 'italic' }}>
                You haven't liked any songs yet.
              </Typography>
            )}
          </Box>
          <Divider sx={{ my: 4 }} />
        </>
        )}

      {/* FOLLOWING SECTION */}
      {isCurrentUser && (
        <>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" fontWeight={600}>
                Following
              </Typography>
              <Button
                component={RouterLink}
                to="/following"
                size="small"
              >
                See All
              </Button>
            </Box>
            <Grid container spacing={3}>
              {followedArtists.length > 0 ? (
                followedArtists.slice(0, PREVIEW_COUNT).map((artist) => (
                  // --- FIX: Changed md={3} to md={2.4} for 5 columns ---
                  <Grid item xs={12} sm={6} md={2.4} key={artist.id}>
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
                      <Avatar sx={{ width: 80, height: 80, margin: 'auto', mb: 1, bgcolor: 'secondary.main' }}>
                        {artist.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body1" fontWeight={500} noWrap>
                        {artist.username}
                      </Typography>
                    </Paper>
                  </Grid>
                ))
              ) : (
                <Typography sx={{ ml: 2, fontStyle: 'italic' }}>
                  You aren't following any artists yet.
                </Typography>
              )}
            </Grid>
          </Box>
          <Divider sx={{ my: 4 }} />
        </>
      )}

      {/* ARTIST SONGS SECTION */}
        {isArtist && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" fontWeight={600}>
                Songs by {user.username}
              </Typography>
              {isCurrentUser && (
                <Button
                  component={RouterLink}
                  to="/manage-songs"
                  size="small"
                >
                  Manage Songs
                </Button>
              )}
            </Box>

            <Grid container spacing={3}>
              {songs.length > 0 ? (
                songs.slice(0, PREVIEW_COUNT).map((song) => (
                  // --- FIX: Changed md={3} to md={2.4} for 5 columns ---
                  <Grid item xs={12} sm={6} md={2.4} key={song.id}>
                    <SongCard song={song} currentUser={currentUser} />
                  </Grid>
                ))
              ) : (
                <Typography sx={{ ml: 2, fontStyle: 'italic' }}>
                  {isCurrentUser ? "You haven't" : "This artist hasn't"} uploaded any songs yet.
                </Typography>
              )}
            </Grid>
          </Box>
        )}

        {/* If profile is a LISTENER (unchanged) */}
          {!isArtist && (
             <Typography sx={{ fontStyle: 'italic' }}>
                This user is a listener so they cannot upload songs
             </Typography>
          )}
        <Divider sx={{ my: 4 }} />

    </Container>
  );
}