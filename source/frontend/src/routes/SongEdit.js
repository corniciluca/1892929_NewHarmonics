import React, { useState, useEffect } from "react";
import {
  Container, Typography, TextField, Box, Button, Paper, Grid, IconButton
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { useNavigate, useParams } from "react-router-dom";
import { getSong, updateSong } from "../api/songApi";

export default function SongEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 1. State updated to match Upload.js
  const [title, setTitle] = useState("");
  const [album, setAlbum] = useState(""); // Added album
  const [genre, setGenre] = useState("");
  // const [featured, setFeatured] = useState(""); // Removed featured
  const [file, setFile] = useState(null); // Added for UI consistency

  useEffect(() => {
    getSong(id).then(song => {
      // 2. Populate all fields from the song data
      setTitle(song.title);
      setGenre(song.genre);
      setAlbum(song.album); // Make sure your song object has 'album'
    });
  }, [id]);

  const handleUpdate = async e => {
    e.preventDefault();
    
    // 3. Send the updated text fields as JSON
    //    File updating requires a backend change to accept FormData
    const song = { title, genre, album }; // Updated object
    
    await updateSong(id, song);
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
          <form onSubmit={handleUpdate}>
            {/* 4. Form fields now match Upload.js */}
            <TextField label="Title" fullWidth margin="normal"
              value={title} onChange={e => setTitle(e.target.value)} required />
            <TextField label="Album" fullWidth margin="normal"
              value={album} onChange={e => setAlbum(e.target.value)} required />
            <TextField label="Genre" fullWidth margin="normal"
              value={genre} onChange={e => setGenre(e.target.value)} required />
            
            {/* 5. File input UI now matches Upload.js */}
            <Grid container spacing={2} sx={{mt:2, mb:2}} justifyContent="center">
              <Grid item xs={12} sx={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                <Typography fontWeight={600} mb={1}>Song File / Art</Typography>
                <IconButton component="label" sx={{ bgcolor: "#ede7f6", width:72, height:72, borderRadius:3, boxShadow:2 }}>
                  {file ? <MusicNoteIcon sx={{ fontSize:48, color:"#00897b" }}/> : <ImageIcon sx={{ fontSize:48, color:"#7e57c2" }}/>}
                  <input type="file" accept="image/*,audio/*" hidden onChange={e => setFile(e.target.files[0])} />
                </IconButton>
                {file && <Typography variant="caption">{file.name}</Typography>}
                
                {/* Optional: Add a note that file replacing isn't supported */}
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
                // 6. Update disabled check
                disabled={!title || !genre || !album}>
                Update
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}