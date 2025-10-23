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
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

const handleUpload = async e => {
    e.preventDefault();
    if (!currentUser) {
      alert("Error: Not logged in.");
      return;
    }
    
    try {
      // 2. Get both artist name and ID from the prop
      const artistName = currentUser.username;
      const artistId = currentUser.id;
      
      // 3. Pass all 6 parameters to the upload function
      await uploadSong({ 
        file, 
        title, 
        artist: artistName, 
        artistId: artistId, // Add the ID
        album, 
        genre 
      });
      
      alert("Song uploaded!");
      navigate("/mysongs");
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
            <Grid container spacing={2} sx={{mt:2, mb:2}} justifyContent="center">
              <Grid item xs={12} sx={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                <Typography fontWeight={600} mb={1}>Song File / Art</Typography>
                <IconButton component="label" sx={{ bgcolor: "#ede7f6", width:72, height:72, borderRadius:3, boxShadow:2 }}>
                  {file ? <MusicNoteIcon sx={{ fontSize:48, color:"#00897b" }}/> : <ImageIcon sx={{ fontSize:48, color:"#7e57c2" }}/>}
                  <input type="file" accept="image/*,audio/*" hidden onChange={e => setFile(e.target.files[0])} />
                </IconButton>
                {file && <Typography variant="caption">{file.name}</Typography>}
              </Grid>
            </Grid>
            <Box sx={{ display:'flex', justifyContent:'center', gap:2, mt:2 }}>
              <Button variant="outlined" color="inherit"
                sx={{ borderRadius:3, minWidth:110 }} onClick={()=>navigate(-1)}>
                Cancel
              </Button>
              <Button variant="contained" color="primary"
                sx={{ borderRadius:3, minWidth:110 }} type="submit"
                disabled={!title || !file || !album || !genre}>
                Upload
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}