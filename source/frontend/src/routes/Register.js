import React, { useState } from 'react';
import {
  Container, Typography, TextField, Box, Button, Paper,
  InputAdornment, IconButton, Link, FormControl, FormLabel,
  RadioGroup, FormControlLabel, Radio, Alert
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ARTIST');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
        setError("La password deve essere di almeno 6 caratteri.");
        return;
    }
    try {
      await register({ username, email, password, role });
      alert('Registrazione avvenuta con successo!');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Errore durante la registrazione.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 6, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb:4 }}>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>{error}</Alert>}
          <TextField
            label="Username"
            fullWidth
            variant="standard"
            margin="normal"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <FormControl component="fieldset" sx={{ mt: 2, mb: 1, textAlign: 'left', width: '100%' }}>
            <FormLabel component="legend" sx={{fontSize: '0.8rem'}}>I am a...</FormLabel>
            <RadioGroup row value={role} onChange={e => setRole(e.target.value)}>
              <FormControlLabel value="ARTIST" control={<Radio />} label="Artist" />
              <FormControlLabel value="LISTENER" control={<Radio />} label="Listener" />
            </RadioGroup>
          </FormControl>
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type={showPwd ? 'text' : 'password'}
            fullWidth
            variant="standard"
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={()=>setShowPwd(v=>!v)} edge="end">
                    {showPwd ? <Visibility/> : <VisibilityOff/>}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Box sx={{ my: 3 }}>
            <Button type="submit" variant="contained" size="large">
              Sign Up
            </Button>
          </Box>
          <Typography variant="body2">
            Hai già un account?{' '}
            <Link component="button" onClick={()=>navigate('/login')}>
              Login
            </Link>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
}

