import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';  // <--- import Link!

export default function Navbar() {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{justifyContent:"space-between"}}>
        <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "black", textDecoration: 'none', cursor: 'pointer' }}
        component={Link}
        to="/"
        >
        NewHarmonics
        </Typography>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="search"
            size="small"
            sx={{ width: 350, mr:2, bgcolor:'white', borderRadius:1 }}
          />
        </Box>
        <Box>
          <IconButton component={Link} to="/upload"><AddIcon fontSize="large"/></IconButton>
          <IconButton component={Link} to="/notification"><NotificationsIcon fontSize="large"/></IconButton>
          <IconButton component={Link} to="/profile"><AccountCircleIcon fontSize="large"/></IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
