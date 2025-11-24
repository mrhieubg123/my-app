import { Box, Grid,Card,  Grid2, Icon, Typography, Button, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import HiWarningLight from '../../../../components/HiWarningLight'
import Highcharts, { color, offset } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useMemo, useEffect, useRef, useState } from "react";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { Functions, RocketLaunch, ReportGmailerrorredOutlined } from '@mui/icons-material';

const MachineStatus = ({
    data = [],
  children,
  alarn,
  alarnHeader = false,
  statusHeader = [],
  width = '100%',
  height = '50px',
  bgColor = '#4CAF50',
  border = '1px solid black',
  variant = 'default',
  header = '',
  lg = 12,
  md = 12,
  xs = 12,
  overflow = true ,
  onSendData,
  isActive,
  onCheckSheet
}) => {
    const theme = useTheme();

    return (
        <Grid item lg={lg} md={md} xs={xs} sx={{ padding: 1 }}>
          <Card
            sx={{width,
              height,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              '&:hover': alarn && {
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease-in-out',
                backgroundColor: theme.palette.primary.main,
              },
              border: '2px solid #678',
              background: '#0000', // Màu xanh lá cây
              justifyContent: "space-between",
              position: "relative",
             }}
          >
            <Box
              sx={{
                height: '100%', width: '100%',
                padding:'6px',
                fontSize: '1rem',
                fontWeight:'bold',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column', justifyContent: "space-between",position: "relative"
              }}
    
            >
             { children}
            </Box>
     
            
    
           
            
          </Card>
        </Grid>
      );
}

export default MachineStatus;