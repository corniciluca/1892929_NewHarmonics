import React from 'react';
import { IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

export default function SongPlayer({ src }) {
  // Stato player molto base, puoi espandere con controlli MUI
  const audioRef = React.useRef();

  const handlePlay = () => audioRef.current.play();
  const handlePause = () => audioRef.current.pause();

  return (
    <div>
      <audio ref={audioRef} src={src} />
      <IconButton onClick={handlePlay}><PlayArrowIcon /></IconButton>
      <IconButton onClick={handlePause}><PauseIcon /></IconButton>
    </div>
  );
}
