import React from 'react';
import { Container, Typography, Grid } from '@mui/material';
import SongCard from '../components/SongCard';

const followedSongs = [
  { id:7, title:"Echo Park", artist:"Dario", genre:"Hip-Hop", likes:20 },
  { id:4, title:"Luna Piena", artist:"Stefania", genre:"Pop", likes:83 }
];

export default function Dashboard() {
  return (
    <Container>
      <Typography variant="h4" sx={{mt:5, mb:2}}>Dashboard</Typography>
      <Typography variant="h6" sx={{mb:2}}>Canzoni dagli artisti che segui</Typography>
      <Grid container spacing={2}>
        {followedSongs.map(song => (
          <Grid item xs={12} sm={6} md={4} key={song.id}>
            <SongCard song={song}/>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
