import React, { useState, useEffect } from "react";
import {
  Container, Typography, TextField, Box, Button, Paper, Grid, IconButton, Avatar
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { useNavigate, useParams } from "react-router-dom";
import { getSong, updateSong } from "../api/songApi";

export default function SongEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [featured, setFeatured] = useState("");
  const [songArt, setSongArt] = useState(null);
  const [songFile, setSongFile] = useState(null);

  useEffect(() => {
    getSong(id).then(song => {
      setTitle(song.title);
      setGenre(song.genre);
      setFeatured(song.featured);
      // Gestisci songArt/songFile se backend supporta
    });
  }, [id]);

  const handleUpdate = async e => {
    e.preventDefault();
    const song = { title, genre, featured };
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
            <TextField label="Title" fullWidth margin="normal"
              value={title} onChange={e => setTitle(e.target.value)} required />
            <TextField label="Genre" fullWidth margin="normal"
              value={genre} onChange={e => setGenre(e.target.value)} required />
            <TextField label="Featured Artists" fullWidth margin="normal"
              value={featured} onChange={e => setFeatured(e.target.value)} />
            <Grid container spacing={2} justifyContent="center">
              {/* Song Art / Song File (handle upload if backend supports) */}
              <Grid item xs={6} sx={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                <Typography fontWeight={600} mb={1}>Song Art</Typography>
                <IconButton component="label" sx={{ bgcolor: "#ede7f6", width:72, height:72, borderRadius:3, boxShadow:2 }}>
                  <ImageIcon sx={{ fontSize:48, color:"#7e57c2" }}/>
                  <input type="file" accept="image/*" hidden onChange={e => setSongArt(e.target.files[0])} />
                </IconButton>
              </Grid>
              <Grid item xs={6} sx={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                <Typography fontWeight={600} mb={1}>Song File</Typography>
                <IconButton component="label" sx={{ bgcolor: "#f5f5f5", width:72, height:72, borderRadius:3, boxShadow:2 }}>
                  <MusicNoteIcon sx={{ fontSize:48, color:"#bdbdbd" }}/>
                  <input type="file" accept="audio/*" hidden onChange={e => setSongFile(e.target.files[0])} />
                </IconButton>
              </Grid>
            </Grid>
            <Box sx={{ display:'flex', justifyContent:'center', gap:2, mt:2 }}>
              <Button variant="outlined" color="inherit"
                sx={{ borderRadius:3, minWidth:110 }} onClick={()=>navigate(-1)}>
                Cancel
              </Button>
              <Button variant="contained" color="primary"
                sx={{ borderRadius:3, minWidth:110 }} type="submit"
                disabled={!title || !genre}>
                Update
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
