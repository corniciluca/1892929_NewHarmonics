import React, { useEffect, useState } from "react"; // 1. Assicurati che 'useState' sia importato
import {
  Container, Typography, Box, Paper, Avatar, Button, Stack,
  // 2. Importa i componenti del Dialog
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { useNavigate } from "react-router-dom";
import { getSongsByArtistId, deleteSong } from "../api/songApi";

export default function SongsManagement({ currentUser }) {
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();

  // 3. Aggiungi i nuovi stati per il Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [songToDeleteId, setSongToDeleteId] = useState(null);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      getSongsByArtistId(currentUser.id).then(setSongs);
    }
  }, [currentUser]);

  const handleEdit = id => { navigate(`/edit-song/${id}`); };

  // 4. Questa funzione ora apre solo il dialog
  const handleDeleteClick = (id) => {
    setSongToDeleteId(id); // Salva l'ID della canzone
    setOpenDialog(true);  // Apri il dialog
  };

  // 5. Questa funzione chiude il dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSongToDeleteId(null); // Pulisci l'ID
  };

  // 6. Questa è la vecchia logica di 'handleDelete', ora chiamata dalla conferma
  const handleConfirmDelete = async () => {
    if (songToDeleteId) {
      await deleteSong(songToDeleteId);
      setSongs(songs => songs.filter(s => s.id !== songToDeleteId));
      handleCloseDialog(); // Chiudi il dialog dopo l'eliminazione
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
        <Avatar sx={{ width: 96, height: 96, bgcolor: "#7e57c2", mb: 2 }}>
          <ImageIcon sx={{ fontSize: 70, color: "#fff" }} />
        </Avatar>
        <Typography variant="h5" fontWeight={700}>Username</Typography>
      </Box>
      <Typography variant="h4" align="center" fontWeight={700} mb={4}>
        Latest Uploads
      </Typography>
      <Stack spacing={3} sx={{ maxHeight: 420, overflowY: 'auto', px:2 }}>
        {songs.map(song => (
          <Paper key={song.id} elevation={3}
            sx={{
              borderRadius: 6, display: "flex", alignItems: "center",
              px: 4, py: 2, justifyContent: "space-between"
            }}>
            <Box sx={{ display:"flex", alignItems:"center" }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: "#ede7f6", mr: 2 }}>
                <ImageIcon sx={{ color: "#7e57c2", fontSize:36 }}/>
              </Avatar>
              <Typography fontSize={22} fontWeight={600}>{song.title}</Typography>
            </Box>
            <Box sx={{ display:"flex", gap:2 }}>
              <Button variant="contained" color="primary" sx={{ borderRadius:2, minWidth:90 }} onClick={()=>handleEdit(song.id)}>
                Edit
              </Button>
              {/* 7. Aggiorna l'onClick per chiamare la nuova funzione */}
              <Button variant="contained" color="error" sx={{ borderRadius:2, minWidth:90 }} onClick={()=>handleDeleteClick(song.id)}>
                Delete
              </Button>
            </Box>
          </Paper>
        ))}
      </Stack>

      {/* 8. Aggiungi il componente Dialog qui */}
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