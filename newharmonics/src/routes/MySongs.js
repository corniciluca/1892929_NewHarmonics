import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, IconButton, Paper } from '@mui/material';
import SongCard from '../components/SongCard';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getSongs, deleteSong } from '../api/songApi';
import { useNavigate } from 'react-router-dom';

export default function MySongs() {
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getSongs().then(setSongs);
  }, []);

  const handleDelete = async id => {
    await deleteSong(id);
    setSongs(songs => songs.filter(s => s.id !== id));
  };

  const handleEdit = id => {
    navigate(`/edit-song/${id}`);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{mt:5, mb:2}}>Le tue canzoni</Typography>
      <Grid container spacing={2}>
        {songs.map(song => (
          <Grid item xs={12} sm={6} md={4} key={song.id}>
            <Paper sx={{p:2, position:"relative"}}>
              <SongCard song={song}/>
              <IconButton
                color="error"
                sx={{position:"absolute", top:10, right:10}}
                onClick={()=>handleDelete(song.id)}
              >
                <DeleteIcon/>
              </IconButton>
              <IconButton
                sx={{position:"absolute", top:10, right:60}}
                onClick={()=>handleEdit(song.id)}
              >
                <EditIcon/>
              </IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
