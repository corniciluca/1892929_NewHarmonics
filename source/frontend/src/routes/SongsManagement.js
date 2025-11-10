import React, { useEffect, useState } from "react";
import {
  Container, Typography, Box, Paper, Avatar, Button,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote"; 
import { useNavigate } from "react-router-dom";
import { getSongsByArtistId, deleteSong } from "../api/songApi";

const gateway = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:9000';

export default function SongsManagement({ currentUser }) {
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [songToDeleteId, setSongToDeleteId] = useState(null);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      getSongsByArtistId(currentUser.id).then(setSongs);
    }
  }, [currentUser]);

  const handleEdit = id => { navigate(`/edit-song/${id}`); };
  const handleDeleteClick = (id) => {
    setSongToDeleteId(id);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSongToDeleteId(null);
  };
  const handleConfirmDelete = async () => {
    if (songToDeleteId) {
      await deleteSong(songToDeleteId);
      setSongs(songs => songs.filter(s => s.id !== songToDeleteId));
      handleCloseDialog();
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      {/* 4. Updated Header to use real user data */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
        <Avatar sx={{ width: 96, height: 96, bgcolor: "#7e57c2", mb: 2 }}>
          <Typography variant="h2" sx={{ color: "#fff" }}>
            {currentUser?.username.charAt(0).toUpperCase()}
          </Typography>
        </Avatar>
        <Typography variant="h5" fontWeight={700}>{currentUser?.username}</Typography>
      </Box>
      <Typography variant="h4" align="center" fontWeight={700} mb={4}>
        Manage Your Songs
      </Typography>
      
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 6 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: '1rem' }}>Song</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '1rem' }}>Album</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '1rem' }}>Genre</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, fontSize: '1rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {songs.map((song) => {
              const coverImageUrl = song.coverImageUrl ? `${gateway}/songs/${song.id}/cover` : null;

              return (
                <TableRow
                  key={song.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {/* Song Cell (Image + Title/Artist) */}
                  <TableCell component="th" scope="row">
                    <Box sx={{ display:"flex", alignItems:"center" }}>
                      <Avatar 
                        variant="rounded"
                        sx={{ width: 56, height: 56, bgcolor: "#ede7f6", mr: 2 }}
                        src={coverImageUrl}
                      >
                        {/* Fallback Icon */}
                        {!coverImageUrl && <MusicNoteIcon sx={{ color: "#7e57c2", fontSize: 36 }}/>}
                      </Avatar>
                      <Box>
                        <Typography fontSize={18} fontWeight={600}>{song.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{song.artist}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  {/* Album Cell */}
                  <TableCell>
                    <Typography>{song.album}</Typography>
                  </TableCell>
                  
                  {/* Genre Cell */}
                  <TableCell>
                    <Typography>{song.genre}</Typography>
                  </TableCell>
                  
                  {/* Actions Cell */}
                  <TableCell align="right">
                    <Box sx={{ display:"flex", gap: 1, justifyContent: 'flex-end' }}>
                      <Button variant="contained" color="primary" sx={{ borderRadius:2 }} onClick={()=>handleEdit(song.id)}>
                        Edit
                      </Button>
                      <Button variant="contained" color="error" sx={{ borderRadius:2 }} onClick={()=>handleDeleteClick(song.id)}>
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog*/}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Song Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this song? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}