import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Avatar, Grid, Box, Chip } from '@mui/material';
import SongCard from '../components/SongCard';
import ArtistCard from '../components/ArtistCard';

export default function UserProfile() {
  const { id } = useParams();
  // Demo dati, fetcha con id!
  const user = {
    name:'Alice',
    avatarUrl: 'https://via.placeholder.com/120x120.png?text=A',
    favGenres: ['Pop'],
    followedArtists: [{ id:2, name:"Bob", avatarUrl:"https://via.placeholder.com/80x80.png?text=B" }],
    songs: [{ id:1, title:"Sunset Beat", artist:'Alice', genre:'Pop', likes:125 }]
  };

  return (
    <Container>
      <Box sx={{ display:'flex', alignItems:'center', mt:5, mb:3 }}>
        <Avatar src={user.avatarUrl} sx={{ width: 90, height: 90, mr:3 }} />
        <Box>
          <Typography variant="h4">{user.name}</Typography>
          <Box sx={{ mt:1, display:'flex', gap:1 }}>{user.favGenres.map(g=><Chip key={g} label={g}/>)}</Box>
        </Box>
      </Box>
      <Typography variant="h6" sx={{mt:5}}>Brani caricati</Typography>
      <Grid container spacing={2}>
        {user.songs.map(song =>
          <Grid item xs={12} sm={6} md={4} key={song.id}><SongCard song={song}/></Grid>
        )}
      </Grid>
      <Typography variant="h6" sx={{mt:5}}>Artisti Seguiti</Typography>
      <Box sx={{ display:'flex', gap:2, mt:2 }}>
        {user.followedArtists.map(a => <ArtistCard artist={a} key={a.id}/>)}
      </Box>
    </Container>
  );
}
