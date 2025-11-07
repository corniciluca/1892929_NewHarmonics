import React, { useState } from "react";
import {
  Container, Typography, TextField, Box, Button, Paper, Grid, IconButton
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { useNavigate } from "react-router-dom";
import { uploadSong } from "../api/songApi";

export default function Upload({ currentUser }) {
  const [title, setTitle] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("");
  const [file, setFile] = useState(null); // This is the audio file
  
  // 1. Add new state for the cover image
  const [coverImageFile, setCoverImageFile] = useState(null); 
  
  const navigate = useNavigate();

  const handleUpload = async e => {
    e.preventDefault();
    if (!currentUser) {
      alert("Error: Not logged in.");
      return;
    }
    
    try {
      const artistName = currentUser.username;
      const artistId = currentUser.id;
      
      // 2. Pass all parameters, including the new coverImageFile
      await uploadSong({ 
        file, 
        title, 
        artist: artistName, 
        artistId: artistId,
        album, 
        genre,
        coverImageFile // <-- Add the new cover image file
      });
      
      alert("Song uploaded!");
      navigate("/manage-songs");
    } catch (err) {
      alert("Upload error: " + err.message);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h4" align="center" fontWeight={700} sx={{ mb:4 }}>
        Upload
      </Typography>
      <Box sx={{ display:'flex', justifyContent:'center' }}>
        <Paper elevation={6} sx={{
          p:4, borderRadius:6, minWidth:350, maxWidth:420, width:'100%'
        }}>
          <form onSubmit={handleUpload} encType="multipart/form-data">
            <TextField label="Title" fullWidth margin="normal" value={title} onChange={e => setTitle(e.target.value)} required />
            <TextField label="Album" fullWidth margin="normal" value={album} onChange={e => setAlbum(e.target.value)} required/>
            <TextField label="Genre" fullWidth margin="normal" value={genre} onChange={e => setGenre(e.target.value)} required/>
            
            {/* 3. Updated Grid for two separate file inputs */}
            <Grid container spacing={2} sx={{mt:2, mb:2}} justifyContent="space-around">
              
              {/* Song File Input */}
              <Grid item xs={6} sx={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                <Typography fontWeight={600} mb={1}>Song File</Typography>
                <IconButton component="label" sx={{ bgcolor: "#ede7f6", width:72, height:72, borderRadius:3, boxShadow:2 }}>
                  {file ? <MusicNoteIcon sx={{ fontSize:48, color:"#00897b" }}/> : <MusicNoteIcon sx={{ fontSize:48, color:"#7e57c2" }}/>}
                  {/* Accept audio files */}
                  <input type="file" accept="audio/*" hidden onChange={e => setFile(e.target.files[0])} />
                </IconButton>
                {file && <Typography variant="caption" noWrap>{file.name}</Typography>}
              </Grid>

              {/* Cover Art Input */}
              <Grid item xs={6} sx={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                <Typography fontWeight={600} mb={1}>Cover Art</Typography>
                <IconButton component="label" sx={{ bgcolor: "#ede7f6", width:72, height:72, borderRadius:3, boxShadow:2 }}>
                  {coverImageFile ? <ImageIcon sx={{ fontSize:48, color:"#00897b" }}/> : <ImageIcon sx={{ fontSize:48, color:"#7e57c2" }}/>}
                  {/* Accept image files */}
                  <input type="file" accept="image/*" hidden onChange={e => setCoverImageFile(e.target.files[0])} />
                </IconButton>
                {coverImageFile && <Typography variant="caption" noWrap>{coverImageFile.name}</Typography>}
              </Grid>

            </Grid>
            <Box sx={{ display:'flex', justifyContent:'center', gap:2, mt:2 }}>
              <Button variant="outlined" color="inherit"
                sx={{ borderRadius:3, minWidth:110 }} onClick={()=>navigate(-1)}>
                Cancel
              </Button>
              <Button variant="contained" color="primary"
                sx={{ borderRadius:3, minWidth:110 }} type="submit"
                // 4. Update disabled check to include the coverImageFile
                disabled={!title || !file || !album || !genre || !coverImageFile}>
                Upload
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}