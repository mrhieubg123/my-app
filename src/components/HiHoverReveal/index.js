import React,{useState } from 'react';
import { Box, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const HiHoverReveal = ({
  trigger,
  children,
  widthHover = 70,
  heightHover = 78,
  header = '',
  rowIndex = 2,
  cellIndex = 2
 
}) => {
    const theme = useTheme();
   const [show, setShow] = useState(false);
  return (
    <Box
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        sx={{
            position: 'relative',
            cursor:'pointer',
          
        }}
    >
        {trigger}
        
            <Paper
                elevation={4}
                sx={{
                    position: 'absolute',
                    display:'flex',
                    bottom: rowIndex > 1 ? '100%' : '',
                    top: rowIndex > 1 ? '' : '100%',
                    right: cellIndex > 2 ? 10 :'',
                    left:  cellIndex > 2 ? '': 10,
                    mt:0,
                    p:0.8,
                    borderRadius:2,
                    minWidth:50,
                    zIndex:20,
                    opacity: show ? 1:0,
                    transform: show ? 'translateY(0)': 'translateY(-10px)',
                    transition: 'opacity 0.3s ease , transform 0.3s ease',
                    pointerEvents: show ? 'auto' : 'none',
                }}
            >
                {children}
            </Paper>
        
        
    </Box>
    
  );
};

export default HiHoverReveal;
