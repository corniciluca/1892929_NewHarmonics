import React, { useState } from 'react';
import {
  Container, Typography, Box, Button, Avatar, Stack, Paper, 
  TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Alert
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { updateUser, deleteUser } from '../api/userApi';
import { logout } from '../api/api';

export default function EditProfile({ user, onUserUpdate }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleUpdate = async () => {
    setError('');
    setSuccess('');
    try {
      const updatedUser = await updateUser(user.id, { username, email });
      onUserUpdate(updatedUser); // Aggiorna lo stato globale dell'app
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.message || 'Error during update!');
    }
  };

  const handleDeleteAccount = async () => {
    try {
        await deleteUser(user.id);
        alert('Account deleted successfully.');
        logout();
        navigate('/login');
    } catch (err) {
        setError(err.message || 'Unable to delete account!');
    }
    setOpenDeleteDialog(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{p:4, borderRadius:6}}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
          <Avatar sx={{ width: 110, height: 110, bgcolor: "#7e57c2", mb:1 }}>
            <AccountCircleIcon sx={{ fontSize: "88px", color:"#fff" }} />
          </Avatar>
          <Typography variant="h5" fontWeight={700}>{user.username}</Typography>
        </Box>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Stack spacing={2} sx={{mb:4, mt: 3}}>
           <TextField 
             label="Username"
             value={username}
             onChange={(e) => setUsername(e.target.value)}
             fullWidth
           />
           <TextField 
             label="Email"
             type="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             fullWidth
           />
           <Button variant="contained" onClick={handleUpdate}>Save changes</Button>
        </Stack>

        <Box sx={{ display:"flex", justifyContent:"center", gap:3, mt:4, borderTop: '1px solid #ddd', pt: 3 }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenDeleteDialog(true)}
          >
            Delete Account
          </Button>
        </Box>
      </Paper>

      {/* Dialog di conferma eliminazione */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

