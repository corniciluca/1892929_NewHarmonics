import React, { useEffect, useState } from "react";
import {
  Container, Typography, Box, Paper, Avatar, Button, Stack
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { useNavigate } from "react-router-dom";
import { getSongsByArtistId, deleteSong } from "../api/songApi";

export default function SongsManagement({ currentUser }) { // 2. Accept currentUser
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // 3. Call user-specific function
    if (currentUser && currentUser.id) {
      getSongsByArtistId(currentUser.id).then(setSongs);
    }
  }, [currentUser]); // 4. Add dependency

  const handleEdit = id => { navigate(`/edit-song/${id}`); };
  const handleDelete = async id => {
    await deleteSong(id);
    setSongs(songs => songs.filter(s => s.id !== id));
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
              <Button variant="contained" color="error" sx={{ borderRadius:2, minWidth:90 }} onClick={()=>handleDelete(song.id)}>
                Delete
              </Button>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}
