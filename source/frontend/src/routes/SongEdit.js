import React, { useState, useEffect } from "react";
import {
  Container, Typography, TextField, Box, Button, Paper, Grid, IconButton,
  // 1. Import Dialog components
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { useNavigate, useParams } from "react-router-dom";
import { getSong, updateSong } from "../api/songApi";

export default function SongEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("");
  const [file, setFile] = useState(null);

  // 2. Add state for the dialog
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    getSong(id).then(song => {
      setTitle(song.title);
      setGenre(song.genre);
      setAlbum(song.album);
    });
  }, [id]);

  // 3. This function now *opens* the dialog
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form from submitting immediately
    setOpenDialog(true); // Open the confirmation dialog
  };

  // 4. This function closes the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // 5. This new function contains the *actual* update logic
  const handleConfirmUpdate = async () => {
    const song = { title, genre, album };
    
    await updateSong(id, song);
    handleCloseDialog(); // Close the dialog
    navigate("/manage-songs");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h4" align="center" fontWeight={700} sx={{ mb:4 }}>
        Song Edit
      </Typography>
      <Box sx={{ display:'flex', justifyContent:'center' }}>
        <Paper elevation={6} sx={{
          p:4, borderRadius:6, minWidth:350, maxWidth:420, width:'100%'
        }}>
          {/* 6. The form's onSubmit now calls handleSubmit */}
          <form onSubmit={handleSubmit}>
            <TextField label="Title" fullWidth margin="normal"
              value={title} onChange={e => setTitle(e.target.value)} required />
            <TextField label="Album" fullWidth margin="normal"
              value={album} onChange={e => setAlbum(e.target.value)} required />
            <TextField label="Genre" fullWidth margin="normal"
              value={genre} onChange={e => setGenre(e.target.value)} required />
            
            <Grid container spacing={2} sx={{mt:2, mb:2}} justifyContent="center">
              <Grid item xs={12} sx={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                <Typography fontWeight={600} mb={1}>Song File / Art</Typography>
                <IconButton component="label" sx={{ bgcolor: "#ede7f6", width:72, height:72, borderRadius:3, boxShadow:2 }}>
                  {file ? <MusicNoteIcon sx={{ fontSize:48, color:"#00897b" }}/> : <ImageIcon sx={{ fontSize:48, color:"#7e57c2" }}/>}
                  <input type="file" accept="image/*,audio/*" hidden onChange={e => setFile(e.target.files[0])} />
                </IconButton>
                {file && <Typography variant="caption">{file.name}</Typography>}
                
                {!file && (
                  <Typography variant="caption" sx={{mt: 1, fontStyle: 'italic', color: 'text.secondary'}}>
                    Replacing files is not supported yet.
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Box sx={{ display:'flex', justifyContent:'center', gap:2, mt:2 }}>
              <Button variant="outlined" color="inherit"
                sx={{ borderRadius:3, minWidth:110 }} onClick={()=>navigate(-1)}>
                Cancel
              </Button>
              <Button variant="contained" color="primary"
                sx={{ borderRadius:3, minWidth:110 }} type="submit"
                disabled={!title || !genre || !album}>
                Update
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>

      {/* 7. Add the Dialog component */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to save these changes?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmUpdate} color="primary" autoFocus>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}