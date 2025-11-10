import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Avatar,
  Button,
  CircularProgress,
  Tooltip
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { getUnreadCount, getNotifications, markAsRead, markAllAsRead } from '../api/notificationApi';

export default function NotificationBell({ currentUser }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!currentUser) return;

    const fetchUnreadCount = async () => {
      try {
        const { count } = await getUnreadCount();
        setUnreadCount(count);
      } catch (err) {
        console.error('Failed to fetch unread count:', err);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleClick = async (event) => {
    setAnchorEl(event.currentTarget);
    setLoading(true);
    
    try {
      const data = await getNotifications();
      setNotifications(data.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

    const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await markAsRead(notification.id);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(notifications.map(n => 
          n.id === notification.id ? { ...n, read: true } : n
        ));
      } catch (err) {
        console.error('Failed to mark as read:', err);
      }
    }

    handleClose();
    if (notification.artistId) {
      navigate(`/user/${notification.artistId}`);
    }
  };
  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (!currentUser) return null;

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          color="inherit"
          onClick={handleClick}
          size="large"
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon fontSize="large" />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 400,
            maxHeight: 600,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: 'primary.main',
          color: 'white'
        }}>
          <Typography variant="h6" fontWeight={600}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={handleMarkAllRead}
              sx={{ 
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
              startIcon={<CheckCircleIcon />}
            >
              Mark all read
            </Button>
          )}
        </Box>

        <Divider />

        {/* Notifications List */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto',
          maxHeight: 400
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={30} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
              <NotificationsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                No notifications yet
              </Typography>
            </Box>
          ) : (
            notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  py: 2,
                  px: 2,
                  bgcolor: notification.read ? 'transparent' : 'action.hover',
                  borderLeft: notification.read ? 'none' : '3px solid',
                  borderColor: 'primary.main',
                  '&:hover': {
                    bgcolor: notification.read ? 'action.hover' : 'action.selected'
                  }
                }}
              >
                <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main',
                      width: 40,
                      height: 40
                    }}
                  >
                    <MusicNoteIcon fontSize="small" />
                  </Avatar>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: notification.read ? 400 : 600,
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {notification.message}
                    </Typography>
                    
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                    >
                      {formatTimeAgo(notification.createdAt)}
                    </Typography>
                  </Box>

                  {!notification.read && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        flexShrink: 0,
                        mt: 0.5
                      }}
                    />
                  )}
                </Box>
              </MenuItem>
            ))
          )}
        </Box>

        <Divider />
      </Menu>
    </>
  );
}