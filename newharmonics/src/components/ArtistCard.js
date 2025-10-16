import React from 'react';
import { Card, CardContent, Avatar, Typography, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';

export default function ArtistCard({ artist }) {
  return (
    <Card>
      <CardActionArea component={Link} to={`/user/${artist.id}`}>
        <CardContent sx={{display:'flex', alignItems:'center'}}>
          <Avatar src={artist.avatarUrl} sx={{mr:2}} />
          <Typography variant="h6">{artist.name}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
