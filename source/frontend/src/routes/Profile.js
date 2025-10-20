import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Avatar, Box, Button, Grid, Paper, IconButton, Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SongCard from '../components/SongCard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { getSongs } from '../api/songApi';

export default function Profile() {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  useEffect(() => { getSongs().then(setSongs); }, []);

  // Simulazione username/avatar
  const user = {
    name: "Username",
    avatarUrl: ""
  };

  return (
    <Container maxWidth="md" sx={{ mt:6, mb:6 }}>
      <Paper elevation={3} sx={{p:4, borderRadius:5, background: 'linear-gradient(80deg, #ede7f6 60%, #fffde7 100%)'}}>
        <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', mb:2}}>
          <Avatar sx={{ width: 108, height: 108, bgcolor:"#7e57c2", fontSize:70, mb:1 }}>
            {user.avatarUrl
              ? <img src={user.avatarUrl} alt="profile" style={{width:"100%",height:"100%"}} />
              : <AccountCircleIcon fontSize="inherit" style={{color:'#fff'}} />}
          </Avatar>
          <Typography variant="h5" fontWeight={700}>{user.name}</Typography>
          <Button startIcon={<EditIcon/>} variant="outlined" color="secondary"
            sx={{mt:2, borderRadius:2}} onClick={()=>navigate('/edit-profile')}>
            Edit
          </Button>
        </Box>
        <Divider sx={{my:3}} />
        <Typography variant="h6" fontWeight={600} sx={{mb:2}}>Latest Uploads</Typography>
        <Grid container spacing={3} alignItems="center">
          {songs.slice(0,4).map(song => (
            <Grid item xs={12} sm={6} md={3} key={song.id}>
              <SongCard song={song} />
            </Grid>
          ))}
          <Grid item xs={12} sm={3}>
            <Button variant="contained" color="primary"
              sx={{mt:{xs:2, sm:8, md:8}, width:1, height:50, borderRadius:3}}
              fullWidth onClick={()=>navigate('/manage-songs')}>
              Manage all
            </Button>
          </Grid>
        </Grid>
        <Divider sx={{my:3}} />
        {/* Puoi mettere qui Following Artists, ALTRE LOGICHE */}
      </Paper>
    </Container>
  );
}
