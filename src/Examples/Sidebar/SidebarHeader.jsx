// SidebarHeader.jsx
import React from 'react';
import Logo from '../../Assets/img/logo.svg'
import { IconButton, Typography,Switch, Box } from '@mui/material';

const SidebarHeader = ({ toggleMenu, isMini, isSmallScreen}) => {
  return (
    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding:'10px 10px' }}>
      <Box 
          variant="h6" 
          component="div" 
          sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}
        >
          <img 
            src={Logo} 
            alt="Logo" 
            fill="#ff0000"
            style={{ width:'40px', height: 'auto',  color:'#ff0000'}} 
          />
          <Typography
          sx={{
            transform: !isMini ? 'translateX(0)' : 'translateX(-5px)',
            transition: 'transform 0.5s ease-in-out, opacity 0.5s ease',
            opacity: !isMini ? 1 : 0,
            fontSize: '1.6rem'
          }}
        >
          Harmony
        </Typography>
        </Box>

        <IconButton onClick={toggleMenu} 
          sx={{
            transform: !isMini ? 'translateX(0)' : 'translateX(-5px)',
            opacity: !isMini ? 1 : 0,
            transition: 'transform 0.8s ease-in-out, opacity 1s ease-in-out',
            padding:'unset'
          }}
        >
            { !isSmallScreen &&  !isMini &&  <Switch  /> }
        </IconButton>
    </Box>
    
  );
};

export default SidebarHeader;
