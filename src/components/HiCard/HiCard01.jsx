import React, { useMemo } from 'react';
import { Box, Grid, Typography, Fade, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import HiWarningLight from '../HiWarningLight'
import HiLegend from '../HiLegend';
import { MoreVertOutlined } from '@mui/icons-material';
import { color } from 'highcharts';

const HiCard01 = ({
  children,
  alarn,
  alarnHeader = false,
  statusHeader = [],
  width = '100%',
  height = '100px',
  border = '1px solid black',
  variant = 'default',
  header = '',
  lg = 12,
  md = 12,
  xs = 12,
  overflow = true,
  legendItem = '',
  titleLegend = '',
  columns = 12,
  note='',
  padding = 1.5,
  bgHeader= '',
  bgContent = ''
}) => {
  const theme = useTheme();

  // Tạo styles cho các variant khác nhau chỉ một lần
  const styles = useMemo(() => ({
    default: { backgroundColor: theme.palette.primary.light, border },
    outlined: { border: '2px dashed black', backgroundColor: 'transparent' },
    filled: { backgroundColor:  theme.palette.background.conponent, color: theme.palette.primary.conponent },
  }), [theme, border]);

  // Style chung cho box
  const boxStyles = useMemo(() => ({
    width,
    height,
    ...styles[variant],
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 3,
    boxShadow: 5,
    padding: 0,
    background: theme.palette.background.main2,
    // border: '2px solid #4a8fa4',
    '&:hover': alarn && {
      transform: 'scale(1.02)',
      transition: 'transform 0.2s ease-in-out',
      backgroundColor: theme.palette.primary.main,
    },
  }), [variant, alarn, styles, width, height, theme]);

  return (
    <Fade in={true} timeout={1000}>
      <Grid  lg={lg} md={md} xs={xs} sx={{ padding: 1, position: 'relative' }}>
          <Box sx={boxStyles}>
            {/* Header */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                borderRadius: 3,
              }}
            >
                <Box 
                    sx={{
                        position: 'absolute',
                        width:'100%',
                        height: '100%',
                        background: theme.palette.background.main2,
                        clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                        display: 'flex',
                        alignItems:'flex-start',
                        justifyContent: 'left',
                        zIndex:1
                }}>
                    {header !== '' ?  
                        <Box
                            sx={{
                                position: 'sticky',
                                top: 0,
                                padding: padding,
                                marginLeft: 1,
                                color: theme.palette.primary.conponent,
                                display: 'flex', alignItems: 'center', justifyContent:'space-between'
                            }}
                        >
                            <Box sx={{display: 'flex',alignItems: 'center'}}>
                                <Typography variant="h6" sx={{fontWeight: '800', float: 'left'}}>{header || 'Header'}    </Typography>
                                <Typography sx={{float: 'left' , marginLeft: '10px' ,marginTop:'4px', color:'#3ce3ab' }}> {note ||''} </Typography>
                            </Box>

                            <Box sx={{display: 'flex',alignItems: 'center'}}>
                                {alarnHeader ? <HiWarningLight status={statusHeader}></HiWarningLight> : ''}    <HiLegend legendItem = {legendItem} title={titleLegend}></HiLegend>
                            </Box>
                        </Box> : ''}
                </Box>
                <Box 
                    sx={{
                        position: 'absolute',
                        width:'100%',
                        height: '100%',
                        background: 'linear-gradient(155deg,#99b5ff,#73b4ff00)',
                        clipPath: 'polygon(100% 15%, 100% 100%, -25% 100%)',
                        display: 'flex',
                        alignItems:'flex-end',
                        justifyContent: 'right',
                        boxShadow:'10px 10px 0px rgba(0,0,0,0.9)',
                        padding:2,
                        textAlign: 'right',
                        zIndex:2
                }}>
                    <Typography sx={{
                        fontSize: '44px',
                        fontWeight:'bold',
                    }}>
                    {children || 'Content'}
                    </Typography>
                </Box>
            </Box>
          </Box>
        </Grid>
    </Fade>
   
  );
};

export default HiCard01;
