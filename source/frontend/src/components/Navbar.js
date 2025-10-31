import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, TextField, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import { Link, useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';

// 1. ACCETTA LE PROPS (isLoggedIn, isArtist, onLogout)
export default function Navbar({ currentUser,isLoggedIn, isArtist, onLogout }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    const trimmed = (query || '').trim();
    if (trimmed.length === 0) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

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
        
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="Search for artists, songs..."
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ width: 400, bgcolor:'white', borderRadius:2 }}
            inputProps={{ 'aria-label': 'search' }}
          />
          <IconButton onClick={handleSearch} sx={{ ml: 1, bgcolor: 'white' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Box>

        <Box sx={{display: 'flex', alignItems: 'center'}}>
          {isLoggedIn ? (
            <>
              {isArtist && (
                <IconButton component={Link} to="/upload" color="inherit" title="Upload Song">
                  <AddCircleOutlineIcon fontSize="large" />
                </IconButton>
              )}
              {currentUser && <NotificationBell currentUser={currentUser} />}

              <IconButton component={Link} to="/feed" color="inherit" title="My Feed">
                  <RssFeedIcon fontSize="large"/>
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