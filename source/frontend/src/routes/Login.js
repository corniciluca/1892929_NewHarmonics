import React, { useState } from 'react';
import {
  Container, Typography, TextField, Box, Button, Paper, 
  InputAdornment, IconButton, Link, Alert
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      onLogin();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 6 }}>
        <Typography variant="h4" align="center" fontWeight={700} sx={{ mb:4 }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type={showPwd ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={password}
            required
            onChange={e => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPwd(v => !v)} edge="end">
                    {showPwd ? <Visibility/> : <VisibilityOff/>}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Box sx={{ display:'flex', justifyContent:'center', my:2 }}>
            <Button type="submit" variant="contained" size="large">
              Login
            </Button>
          </Box>
          <Box sx={{ textAlign:'center', mt:1 }}>
            <Typography variant="body2">
              Not registered yet?{' '}
              <Link component="button" onClick={() => navigate('/register')}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

