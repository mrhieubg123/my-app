import React, { useMemo } from 'react';
import { Box, Grid, Typography, Fade, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import HiWarningLight from '../HiWarningLight'
import HiLegend from '../HiLegend';
import { MoreVertOutlined } from '@mui/icons-material';

const HiBox = ({
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
  sizeLegend = 12,
  titleLegend = '',
  columns = 12,
  note='',
  padding = 1.5,
  background = '',
  functionHtml
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
    padding: padding,
    background: background === '' ? theme.palette.background.main2 : background ,
    // border: '2px solid #4a8fa4',
    '&:hover': alarn && {
      transform: 'scale(1.02)',
      transition: 'transform 0.2s ease-in-out',
      backgroundColor: theme.palette.primary.main,
    },
  }), [variant, alarn, styles, width, height, theme]);

  return (
    <Fade in={true} timeout={1000}>
      <Grid  size={{ lg, md, xs }}  lg={lg} md={md} xs={xs} sx={{ padding: 1 }}>
          <Box sx={boxStyles}>
            {/* Header */}
            {header !== '' ?  <Box
              sx={{
                position: 'sticky',
                top: 0,
                marginLeft: 1,
                color: theme.palette.primary.conponent,
                display: 'flex', alignItems: 'center', justifyContent:'space-between',
              }}
            >
              <Box sx={{display: 'flex',alignItems: 'flex-end'}}>
                <Typography variant="h6" sx={{fontWeight: '800', float: 'left'}}>{header || 'Header'}    </Typography>
                <Typography sx={{float: 'left' , marginLeft: '10px' , color:'#3ce3ab', fontSize: '1rem' }}> {note ||''} </Typography>
              </Box>

              <Box sx={{display: 'flex',alignItems: 'center'}}>
                {alarnHeader ? <HiWarningLight status={statusHeader}></HiWarningLight> : ''}    <HiLegend sizeLegend={sizeLegend} legendItem = {legendItem} title={titleLegend}></HiLegend>
                {functionHtml || functionHtml }
              </Box>

              
              {/* <IconButton><MoreVertOutlined></MoreVertOutlined></IconButton>  */}
            </Box> : ''}
          

            {/* Nội dung */}
            <Box
              sx={{
                position: 'relative',
                flexGrow: 1,
                overflowY:  overflow ? 'auto' : 'hidden',
                overflowX:'hidden',
                '&::-webkit-scrollbar': { width: 4,height: 4, opacity: 0 },
                '&:hover::-webkit-scrollbar': { width: 4, height: 4, opacity: 1 },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#9999998c', borderRadius: '10px' },
                '&:hover::-webkit-scrollbar-thumb': { backgroundColor: '#999999'}
              }}
            >
              {children}
            </Box>
          </Box>
        </Grid>
    </Fade>
   
  );
};

export default HiBox;
