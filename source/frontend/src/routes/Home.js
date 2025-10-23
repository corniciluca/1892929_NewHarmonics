import React, { useEffect, useState } from "react";
import { Typography, Container, Grid, Box, Button, useTheme, Paper, Fade } from "@mui/material";
import SongCard from "../components/SongCard";
import { getSongs } from "../api/songApi";

export default function Home() {
  const theme = useTheme();
  const sectionStyle = color => ({
    background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`,
    borderRadius: 32, boxShadow: theme.shadows[1], padding: "32px 20px 24px 20px",
    marginBottom: theme.spacing(4), border: `1.5px solid ${color}`,
  });

  const [songs, setSongs] = useState([]);
  useEffect(() => { getSongs().then(setSongs); }, []);

  // Demo: raggruppa e mostra (customizza come vuoi)
  const newPopular = songs.slice(0, 5);
  const following = songs.slice(5, 9);
  const yourMusic = songs.slice(9, 13);

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
            <Typography variant="h5" fontWeight={600} color="#5e35b1" mb={2}>New & Popular</Typography>
            <Grid container spacing={3}>
              {newPopular.map(song => (
                <Grid item xs={12} sm={6} md={2.4} key={song.id}>
                  <SongCard song={song} color="#7e57c2"/>
                </Grid>
              ))}
            </Grid>
            <Box sx={{display:'flex', justifyContent:'flex-end', mt:2}}>
              <Button variant="contained" color="secondary" size="small" sx={{borderRadius: 2}}>More</Button>
            </Box>
          </Box>
          <Box sx={sectionStyle("#009688")}>
            <Typography variant="h5" fontWeight={600} color="#00695c" mb={2}>Following</Typography>
            <Grid container spacing={3}>
              {following.map(song => (
                <Grid item xs={12} sm={6} md={2.4} key={song.id}>
                  <SongCard song={song} color="#009688"/>
                </Grid>
              ))}
            </Grid>
            <Box sx={{display:'flex', justifyContent:'flex-end', mt:2}}>
              <Button variant="contained" color="info" size="small" sx={{borderRadius: 2}}>More</Button>
            </Box>
          </Box>
          <Box sx={sectionStyle("#ffa726")}>
            <Typography variant="h5" fontWeight={600} color="#f57c00" mb={2}>Your music</Typography>
            <Grid container spacing={3}>
              {yourMusic.map(song => (
                <Grid item xs={12} sm={6} md={2.4} key={song.id}>
                  <SongCard song={song} color="#ffa726"/>
                </Grid>
              ))}
            </Grid>
            <Box sx={{display:'flex', justifyContent:'flex-end', mt:2}}>
              <Button variant="contained" color="warning" size="small" sx={{borderRadius: 2}}>More</Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
}
