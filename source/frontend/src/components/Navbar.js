import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, TextField, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // <-- 2. ICONA IMPORTATA
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';

// 1. ACCETTA LE PROPS (isLoggedIn, isArtist, onLogout)
export default function Navbar({ isLoggedIn, isArtist, onLogout }) {
  const navigate = useNavigate();

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
            placeholder="Search for artists, songs..."
            size="small"
            sx={{ width: 400, bgcolor:'white', borderRadius:2 }}
          />
        </Box>

        <Box sx={{display: 'flex', alignItems: 'center'}}>
          {isLoggedIn ? (
            <>
              {isArtist && (
                <IconButton component={Link} to="/upload" color="inherit" title="Upload Song">
                  <AddCircleOutlineIcon fontSize="large" />
                </IconButton>
              )}
              <IconButton component={Link} to="/notification" color="inherit" title="Notifications">
                <NotificationsIcon fontSize="large"/>
              </IconButton>
              <IconButton component={Link} to="/profile" color="inherit" title="Profile">
                <AccountCircleIcon fontSize="large"/>
              </IconButton>
              <Button onClick={onLogout} color="inherit" sx={{ml: 1}}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" color="inherit">
                Login
              </Button>
              <Button component={Link} to="/register" variant="contained" sx={{ml: 2}}>
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}