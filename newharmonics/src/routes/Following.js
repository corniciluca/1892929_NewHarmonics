import React from 'react';
import { Container, Typography, Grid } from '@mui/material';
import ArtistCard from '../components/ArtistCard';

const demoArtists = [
  { id:1, name:"Alice", avatarUrl:"https://via.placeholder.com/80x80.png?text=A"},
  { id:2, name:"Bob", avatarUrl:"https://via.placeholder.com/80x80.png?text=B"}
];

export default function Following() {
  return (
    <Container>
      <Typography variant="h4" sx={{mt:5, mb:3}}>Artisti che segui</Typography>
      <Grid container spacing={2}>
        {demoArtists.map(a => (
          <Grid item xs={12} sm={6} md={4} key={a.id}>
            <ArtistCard artist={a} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
