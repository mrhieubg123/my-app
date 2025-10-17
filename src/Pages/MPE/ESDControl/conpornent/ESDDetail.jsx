import React, { useMemo,useState } from 'react';
import { Box,Card, Grid, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ESDDetailDot = ({
    alarn,
    width = '100%',
    height = '100%',
    variant = 'default',
    data = [],

  }) => {
    const theme = useTheme();
    
    return (
        <Grid container columns={10}>
            {data.map((row, index) => (
                <Grid  key={index} lg={1} md={1} xs={1} padding={0.8}>
                <Card
                    sx={{width,
                    height,
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 3,
                    boxShadow: 5,
                    padding: 0.8,
                    paddingLeft: 1.5
                    
                   }}
                >
                    <Box item sx={{width: '1.5vw', height: '1.5vw', backgroundColor: 
                    row.STATUS_ESD !== 'RUN' ? 
                        row.STATUS_ESD !== 'OFFt' ?  
                            row.STATUS_ESD !== 'ERROR' ? 
                                '#999'
                                : '#feff33'
                            : '#feff33' 
                        : '#00d325',
                         borderRadius: '50%',
                         float:'left'}}>
                    </Box>
                    <Box
                        sx={{
                        top: 0,
                        marginLeft: 1,
                        //color: isActive ? '$fff' : theme.palette.primary.conponent,
                        overflowX: 'auto'
                        }}
                    >
                        <Typography sx={{fontWeight: '800', fontSize: '0.8vw', display: 'inline', position:'sticky'}}>{row.IP_ESD || 'Header'}  </Typography>
                        <br></br>
                        <Typography sx={{fontWeight: '500', fontSize: '0.7vw', display: 'inline', position:'sticky'}}>{row.NAME_ESD || 'Header'}  </Typography>
                    </Box>
                  
                    
                </Card>
            </Grid>
                       
            ))}
           
            
        </Grid>

    )
}
export default ESDDetailDot;