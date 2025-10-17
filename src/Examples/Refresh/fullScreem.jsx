import React, { useState } from 'react';
import {   Box , Fab, Typography} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setParam, resetParam } from '../../Redux/Actions/paramSlice';
import { ScreenshotMonitorOutlined } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const FullScreem = () => {
  const theme = useTheme();
  const [position, setPosition] = useState({bottom: 115, right: 35});
  const user = useSelector((state) => state.auth.login.currentUser);

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", "dragging");
  }
  const handleDragEnd = (e) => {
    const newBottom = window.innerHeight - e.clientY;
    const newRight = window.innerWidth - e.clientX;
    setPosition({
      bottom: Math.max(0, newBottom),
      right: Math.max(0, newRight)
    });
  };


const handleFullScreem = () => {
  if (!document.fullscreenElement) {
    // Nếu hiện tại không ở chế độ toàn màn hình, yêu cầu vào chế độ toàn màn hình
    document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
      // Nếu đang ở chế độ toàn màn hình, thoát khỏi chế độ toàn màn hình
      document.exitFullscreen();
  }
}

  return (
    <Box >
        <Fab
          color='#ff0909'
          size='small'
          sx={{
            position: "fixed",
            // backgroundColor: theme.palette.background.conponent2,
            background: 'linear-gradient(to left, rgba(51, 167 , 108, 0.9), rgba(51, 167, 108, 0.5))',
            bottom: position.bottom,
            right: 0,
            color:theme.palette.primary.conponent,
            transition: 'transform 0.25s ease-out',
            transformOrigin: 'right bottom',
            zIndex: 889,
            opacity:  1 ,
            transform: 'scale(1) translateX(72%)',
            borderTopRightRadius: 'unset',
            borderBottomRightRadius: 'unset',
            borderTopLeftRadius: '30px',
            borderBottomLeftRadius: '30px',
            width: '180px',
            paddingRight: '10px',
            '&:hover': { backgroundColor: theme.palette.background.conponent2, transform: 'translateX(0%)', color:theme.palette.primary.conponent2},
          }}
          draggable={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={handleFullScreem}
        >
            <ScreenshotMonitorOutlined 
              sx={{ fontSize: 30, float: 'left'}} 
            />
            <Typography sx={{fontSize: 20, float: 'right', marginLeft:'15px', textTransform: 'none'}} >
              FullScreen
            </Typography>
        </Fab>
    </Box>
  );
};

export default FullScreem;
