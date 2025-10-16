import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Box,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Link
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    onLogin(false); // todo: login logic
    navigate('/');
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 6 }}>
        <Typography variant="h4" align="center" fontWeight={700} sx={{ mb:4 }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            sx={{ bgcolor: "#f5f5f5", borderRadius:2 }}
          />
          <TextField
            label="Password"
            type={showPwd ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={password}
            required
            onChange={e => setPassword(e.target.value)}
            sx={{ bgcolor: "#f5f5f5", borderRadius:2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password"
                    onClick={()=>setShowPwd(v=>!v)}
                    edge="end"
                  >
                    {showPwd ? <Visibility/> : <VisibilityOff/>}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Box sx={{ display:'flex', justifyContent:'flex-end', mb:2 }}>
            <Link href="#" underline="hover" sx={{ fontSize:15 }}>
              Forgot password?
            </Link>
          </Box>
          <Box sx={{ display:'flex', justifyContent:'center', my:2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius:2, minWidth:120, fontWeight:600, fontSize:18
              }}>
              Login
            </Button>
          </Box>
          <Box sx={{ textAlign:'center', mt:1 }}>
            <Typography variant="body2">
              Not registered yet?{' '}
              <Link
                component="button"
                underline="hover"
                sx={{ fontWeight:600 }}
                onClick={()=>navigate('/register')}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
