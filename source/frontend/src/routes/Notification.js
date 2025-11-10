import React from 'react';
import {
  Container,
  Typography,
  Box,
  Avatar,
  Paper,
  Stack,
  Button
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const notifications = [
  {
    id: 1,
    user: 'Username',
    type: 'posted',
    message: 'posted a new song!',
    link: '/song/1'
  },
  {
    id: 2,
    user: 'Username',
    type: 'liked',
    message: 'liked your song!',
    link: '/song/2'
  },
  {
    id: 3,
    user: 'Username',
    type: 'posted',
    message: 'posted a new song!',
    link: '/song/3'
  }
];

export default function Notification() {
  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h5" fontWeight={600} align="center" sx={{ mb: 4 }}>
        Latest
      </Typography>
      <Stack spacing={4}>
        {notifications.map(notif => (
          <Paper
            key={notif.id}
            elevation={2}
            sx={{
              borderRadius: 4,
              p: 2,
              px: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{
                bgcolor: '#7e57c2',
                mr: 2,
                width: 56,
                height: 56
              }}>
                <AccountCircleIcon fontSize="large" />
              </Avatar>
              <Typography fontSize={20} fontWeight={500}>
                <b>{notif.user}</b> {notif.message}
              </Typography>
            </Box>
            <Button
              href={notif.link}
              variant="outlined"
              sx={{ borderRadius: 3, fontWeight: 600, minWidth: 110 }}
            >
              Listen now!
            </Button>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}
