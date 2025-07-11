import React from 'react';
import { Box, Typography } from '@mui/material';
import SwipeIcon from '@mui/icons-material/Swipe';

export default function VideoSlide({ src, title, index, activeVideo, setActiveVideo, videoRef, pauseAllExcept }) {
  const isActive = activeVideo === index;

  const handlePlay = () => {
    if (pauseAllExcept) pauseAllExcept(index);
    setActiveVideo(index);
    // Ya no llamamos a play automáticamente
  };


  React.useEffect(() => {
    if (!isActive && videoRef && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive, videoRef]);





  const handlePause = () => {
    setActiveVideo(null);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 24px rgba(26,35,126,0.10)', bgcolor: '#000', width: { xs: '100%', md: 700 }, mx: 'auto', ml: { xs: 3, sm: 4, md: 0 } }}>
          <video
            ref={videoRef}
            src={src}
            width="100%"
            height="400"
            style={{
              width: '100%',
              height: '400px',
              maxWidth: '100%',
              objectFit: 'cover',
              borderRadius: '16px 16px 0 0',
              background: '#000',
              display: 'block',
            }}
          controls={isActive}
          onPause={() => {}}
          onEnded={handlePause}
          autoPlay={false}
          muted={false}
        />
        {!isActive && (
          <Box
            onClick={handlePlay}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(0,0,0,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2,
              transition: 'background 0.2s'
            }}
          >
            <Box sx={{
              bgcolor: 'rgba(0,0,0,0.55)',
              borderRadius: '50%',
              p: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 12px #0006'
            }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="24" fill="#F05B3C"/>
                <polygon points="20,16 34,24 20,32" fill="#fff" />
              </svg>
            </Box>
          </Box>
        )}
        <Box
            sx={{
              width: '100%',
              bgcolor: 'linear-gradient(90deg, #F05B3C 0%, #1a237e 100%)',
              color: '#fff',
              p: 2,
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '1.2rem',
              letterSpacing: 1.1,
              opacity: 0.97,
              textShadow: '0 2px 10px #000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              userSelect: 'none',
              borderRadius: '0 0 16px 16px'
            }}
          >
            <SwipeIcon sx={{ fontSize: 26, mr: 1, color: '#fff' }} />
            {title}
            <Typography
              component="span"
              sx={{
                ml: 2,
                fontSize: '0.95rem',
                fontWeight: 400,
                color: '#fff9',
                letterSpacing: 0.5,
                display: { xs: 'inline', md: 'none' }
              }}
            >
              (Desliza para ver más)
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
