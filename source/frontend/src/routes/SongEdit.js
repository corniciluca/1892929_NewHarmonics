import React, { useState, useEffect } from "react";
import {
  Container, Typography, TextField, Box, Button, Paper, Grid, IconButton,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  CircularProgress, Alert
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { useNavigate, useParams } from "react-router-dom";
import { getSong, updateSongDetails } from "../api/songApi";

export default function SongEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    getSong(id).then(song => {
      setTitle(song.title);
      setGenre(song.genre);
      setAlbum(song.album);
    });
  }, [id]);

  // This function *opens* the dialog
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form from submitting immediately
    setUpdateError(null);
    setOpenDialog(true); // Open the confirmation dialog
  };

  // This function closes the dialog
  const handleCloseDialog = () => {
    if (isUpdating) return;
    setOpenDialog(false);
  };

  // This  function contains the *actual* update logic
  const handleConfirmUpdate = async () => {
      setIsUpdating(true);
      setUpdateError(null);

      const songData = {
        title,
        genre,
        album,
        audioFile, // Pass the audio file state
        coverFile  // Pass the cover file state
      };
      try {
          // Call the  'updateSongDetails' function
          await updateSongDetails(id, songData);

          setIsUpdating(false);
          handleCloseDialog();
          navigate("/manage-songs");
      } catch (err) {
            console.error("Failed to update song:", err);
            setUpdateError(err.message || "An unknown error occurred. (Check gateway logs)");
            setIsUpdating(false); // Stop loading
      }
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
          {/* The form's onSubmit now calls handleSubmit */}
          <form onSubmit={handleSubmit}>
            <TextField label="Title" fullWidth margin="normal"
              value={title} onChange={e => setTitle(e.target.value)} required />
            <TextField label="Album" fullWidth margin="normal"
              value={album} onChange={e => setAlbum(e.target.value)} required />
            <TextField label="Genre" fullWidth margin="normal"
              value={genre} onChange={e => setGenre(e.target.value)} required />
            
            <Grid container spacing={2} sx={{mt:2, mb:2}} justifyContent="center">
              {/* Audio File Input */}
              <Grid item xs={6} sx={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                <Typography fontWeight={600} mb={1}>Audio File</Typography>
                <IconButton component="label" sx={{ bgcolor: "#ede7f6", width:72, height:72, borderRadius:3, boxShadow:2 }}>
                  <MusicNoteIcon sx={{ fontSize:48, color: audioFile ? "#00897b" : "#7e57c2" }}/>
                  <input type="file" accept="audio/*" hidden onChange={e => setAudioFile(e.target.files[0])} />
                </IconButton>
                <Typography variant="caption" sx={{mt: 1, fontStyle: 'italic', color: 'text.secondary'}} noWrap>
                  {audioFile ? audioFile.name : "Change audio"}
                </Typography>
              </Grid>

              {/* Cover File Input */}
              <Grid item xs={6} sx={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                <Typography fontWeight={600} mb={1}>Cover Art</Typography>
                <IconButton component="label" sx={{ bgcolor: "#ede7f6", width:72, height:72, borderRadius:3, boxShadow:2 }}>
                  <ImageIcon sx={{ fontSize:48, color: coverFile ? "#00897b" : "#7e57c2" }}/>
                  <input type="file" accept="image/*" hidden onChange={e => setCoverFile(e.target.files[0])} />
                </IconButton>
                <Typography variant="caption" sx={{mt: 1, fontStyle: 'italic', color: 'text.secondary'}} noWrap>
                  {coverFile ? coverFile.name : "Change cover"}
                </Typography>
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

      {/* Dialog component */}
      <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
        >
          <DialogTitle>Confirm Update</DialogTitle>
          <DialogContent>
            {/* Show an error here if one occurs */}
            {updateError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {updateError}
              </Alert>
            )}
            <DialogContentText>
              Are you sure you want to save these changes?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="inherit" disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleConfirmUpdate} color="primary" autoFocus disabled={isUpdating}>
              {isUpdating ? <CircularProgress size={24} /> : "Save Changes"}
            </Button>
          </DialogActions>
        </Dialog>
    </Container>
  );
}