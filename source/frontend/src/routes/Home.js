import React, { useEffect, useState } from "react";
import { Typography, Container, Grid, Box, Button, useTheme, Paper, Fade } from "@mui/material";
import SongCard from "../components/SongCard";
import SongList from "../components/SongList";
import { getSongs, getRecentSongs, getUserFeed, getTrendingSongs, getSongsByArtistId } from "../api/songApi";

export default function Home({ currentUser }) {
  const theme = useTheme();
  const sectionStyle = color => ({
    background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`,
    borderRadius: 32, boxShadow: theme.shadows[1], padding: "32px 20px 24px 20px",
    marginBottom: theme.spacing(4), border: `1.5px solid ${color}`,
  });

  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [following, setFollowing] = useState([]);
  const [yourMusic, setYourMusic] = useState([]);

  const isLoggedIn = !!currentUser;
  const isArtist = currentUser?.role === 'ARTIST';

  useEffect(() => {
    // Public lists
    getRecentSongs().then(setRecent).catch(() => setRecent([]));
    getTrendingSongs().then(setTrending).catch(() => setTrending([]));

    // Following: only for logged users
    if (isLoggedIn) {
      // Use feed endpoint to get songs from followed artists
      getUserFeed(currentUser.id).then(setFollowing).catch(() => setFollowing([]));
    } else {
      setFollowing([]);
    }

    // Your music: only for logged users that are artists
    if (isLoggedIn && isArtist) {
      getSongsByArtistId(currentUser.id).then(setYourMusic).catch(() => setYourMusic([]));
    } else {
      setYourMusic([]);
    }
  }, [currentUser]);

  return (
    <Container sx={{mt:4, mb:4}} maxWidth="xl">
      <Fade in timeout={800}>
        <Box>
          <Paper elevation={2} sx={{
              p:2, mb:4, bgcolor: theme.palette.primary.light, borderRadius:4,
              textAlign:'center', color: theme.palette.primary.contrastText
            }}>
            <Typography variant="h4" fontWeight={700} sx={{letterSpacing:2}}>
              Welcome to NewHarmonics 🎵
            </Typography>
            <Typography variant="subtitle1" fontWeight={300} sx={{opacity:0.8, mt:1}}>
              Discover, follow & share the sound of your world.
            </Typography>
          </Paper>
          <Box sx={sectionStyle("#7e57c2")}>
            <SongList songs={trending} title="Trending" variant="carousel" itemWidth={220} height={320} />
          </Box>

          <Box sx={sectionStyle("#009688")}>
            <SongList songs={recent} title="Recent Uploads" variant="carousel" itemWidth={220} height={320} />
          </Box>

          {isLoggedIn && (
            <Box sx={sectionStyle("#4db6ac")}>
              <Typography variant="h5" fontWeight={600} color="#00695c" mb={2}>Following</Typography>
              <Grid container spacing={3}>
                {following.map(song => (
                  <Grid item xs={12} sm={6} md={2.4} key={song.id || song._id}>
                    <SongCard song={song} color="#4db6ac"/>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {isLoggedIn && isArtist && (
            <Box sx={sectionStyle("#ffa726")}>
              <Typography variant="h5" fontWeight={600} color="#f57c00" mb={2}>Your music</Typography>
              <Grid container spacing={3}>
                {yourMusic.map(song => (
                  <Grid item xs={12} sm={6} md={2.4} key={song.id || song._id}>
                    <SongCard song={song} color="#ffa726"/>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Fade>
    </Container>
  );
}
