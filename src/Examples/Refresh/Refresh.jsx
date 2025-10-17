import React, { useState } from 'react';
import {   Box , Fab, Typography} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setParam, resetParam } from '../../Redux/Actions/paramSlice';
import { RefreshOutlined } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Refresh = () => {
  const theme = useTheme();
  const [position, setPosition] = useState({bottom: 70, right: 35});
  const user = useSelector((state) => state.auth.login.currentUser);

  const dispatch = useDispatch()

  const handleOpenChat = () =>{
    dispatch(setParam({
      PageNumber: '',
      data:'',
      showpage: '',
      params:{
        Building: '',
        Factory: '',
        Linename: '',
        Machine: '',
        Project: '',
        Section: '',
        starttime: '',
        endtime: '',
      },
     
    }))
  }

  
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




  return (
    <Box >
        <Fab
          color='#ff0909'
          size='small'
          sx={{
            position: "fixed",
            // backgroundColor: theme.palette.background.conponent2,
            background: 'linear-gradient(to left, rgba(64, 207 , 239, 0.9), rgba(64, 207, 239, 0.5))',
            bottom: position.bottom,
            right: 0,
            color:theme.palette.primary.conponent,
            transition: 'transform 0.25s ease-out',
            transformOrigin: 'right bottom',
            zIndex: 889,
            opacity:  1 ,
            transform: 'scale(1) translateX(65%)',
            borderTopRightRadius: 'unset',
            borderBottomRightRadius: 'unset',
            borderTopLeftRadius: '30px',
            borderBottomLeftRadius: '30px',
            width: '140px',
            paddingRight: '10px',
            '&:hover': { backgroundColor: theme.palette.background.conponent2, transform: 'translateX(0%)', color:theme.palette.primary.conponent2},
          }}
          draggable={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={handleOpenChat}
        >
            <RefreshOutlined 
              sx={{ fontSize: 30, float: 'left'}} 
            />
            <Typography sx={{fontSize: 20, float: 'right', marginLeft:'15px', textTransform: 'none'}} >
              Refresh
            </Typography>
        </Fab>
    </Box>
  );
};

export default Refresh;
