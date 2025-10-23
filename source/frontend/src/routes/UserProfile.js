import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Avatar, Box, Chip, CircularProgress, Alert } from '@mui/material';
import { getUserById } from '../api/userApi';
// TODO: Importare una funzione per prendere le canzoni di un utente specifico
// import { getSongsByUserId } from '../api/songApi';

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setError('');
        setLoading(true);
        const userData = await getUserById(id);
        setUser(userData);
        // TODO: Caricare le canzoni di questo utente una volta che l'endpoint è pronto
        // const userSongs = await getSongsByUserId(id);
        // setSongs(userSongs);
      } catch (err) {
        setError(err.message || "Impossibile caricare il profilo dell'utente.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return <Container sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Container>;
  }

  if (error) {
    return <Container sx={{ mt: 10 }}><Alert severity="error">{error}</Alert></Container>;
  }

  if (!user) {
    return <Container sx={{ mt: 10 }}><Typography>Utente non trovato.</Typography></Container>;
  }

  return (
    <Container>
      <Box sx={{ display:'flex', alignItems:'center', mt:5, mb:3 }}>
        <Avatar sx={{ width: 90, height: 90, mr:3, bgcolor: 'primary.main' }}>
            {user.username.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h4">{user.username}</Typography>
          <Typography variant="body1" color="text.secondary">{user.email}</Typography>
          <Chip label={user.role} color={user.role === 'ARTIST' ? 'secondary' : 'default'} sx={{ mt: 1 }} />
        </Box>
      </Box>
      <Typography variant="h6" sx={{mt:5}}>Brani caricati da {user.username}</Typography>
      {/* Qui andrà la lista delle canzoni una volta implementata la logica API */}
      <Box sx={{mt: 2}}>
        <Typography>La visualizzazione delle canzoni non è ancora implementata.</Typography>
      </Box>
    </Container>
  );
}

