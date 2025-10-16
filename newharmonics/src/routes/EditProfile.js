import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Avatar,
  Stack,
  Paper
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const navigate = useNavigate();
  // Demo user data (replace with actual user/context)
  const user = {
    name: "Username",
    email: "user@email.com"
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{p:4, borderRadius:6}}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
          <Avatar sx={{ width: 110, height: 110, bgcolor: "#7e57c2", mb:1 }}>
            <AccountCircleIcon sx={{ fontSize: "88px", color:"#fff" }} />
          </Avatar>
          <Button
            variant="outlined"
            size="small"
            sx={{ borderRadius: 2, mb:2 }}
            onClick={() => alert("Edit profile image not implemented")}
          >
            Edit
          </Button>
        </Box>
        <Stack spacing={3} alignItems="center" sx={{mb:4}}>
          <Box sx={{ display:"flex", alignItems:"center", gap:2 }}>
            <Typography fontWeight={600}>Username</Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{ borderRadius:2 }}
              onClick={() => alert("Edit username")}
            >
              Edit
            </Button>
          </Box>
          <Box sx={{ display:"flex", alignItems:"center", gap:2 }}>
            <Typography fontWeight={600}>Email</Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{ borderRadius:2 }}
              onClick={() => alert("Edit email")}
            >
              Edit
            </Button>
          </Box>
          <Box sx={{ display:"flex", alignItems:"center", gap:2 }}>
            <Typography fontWeight={600}>Password</Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{ borderRadius:2 }}
              onClick={() => alert("Edit password")}
            >
              Edit
            </Button>
          </Box>
        </Stack>
        <Box sx={{ display:"flex", justifyContent:"center", gap:3, mt:4 }}>
          <Button
            variant="outlined"
            color="inherit"
            sx={{ borderRadius:2, minWidth:120 }}
            onClick={() => navigate('/login')}
          >
            Logout
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ borderRadius:2, minWidth:160 }}
            onClick={() => alert("Delete Account")}
          >
            Delete Account
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
