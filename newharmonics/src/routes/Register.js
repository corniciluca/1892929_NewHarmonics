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
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/api'; // Import the register function

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // Default role state
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await register({ username, email, password, role });
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      alert('Registration error: ' + err.message);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 6 }}>
        <Typography variant="h4" align="center" fontWeight={700} sx={{ mb:4 }}>
          Sign Up
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
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            sx={{ bgcolor: "#f5f5f5", borderRadius:2 }}
          />
           <FormControl fullWidth margin="normal" required>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={role}
              label="Role"
              onChange={e => setRole(e.target.value)}
              sx={{ bgcolor: "#f5f5f5", borderRadius:2 }}
            >
              <MenuItem value={"ARTIST"}>Artist</MenuItem>
              <MenuItem value={"LISTENER"}>Listener</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Password"
            type={showPwd ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            sx={{ bgcolor: "#f5f5f5", borderRadius:2 }}
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
          <Box sx={{ display:'flex', justifyContent:'center', my:2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius:2, minWidth:120, fontWeight:600, fontSize:18
              }}>
              Sign Up
            </Button>
          </Box>
          <Box sx={{ textAlign:'center', mt:1 }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link
                component="button"
                underline="hover"
                sx={{ fontWeight:600 }}
                onClick={()=>navigate('/login')}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}