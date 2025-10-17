import React, { useMemo,useState } from 'react';
import { Box, Grid, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ESDErrorDetail = ({ data = []  }) => {
    const theme = useTheme();
    
    return (
        <Box sx={{height:"100%"}}>
            <TableContainer sx={{height:"100%", overflow:'auto',
                    '&::-webkit-scrollbar': { width: 0, opacity: 0 },
                    '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
                <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
                    <TableHead sx={{position:'sticky', top: '0', backgroundColor: "#f6f7f5"}}>
                        <TableRow>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color:'#000'}} align="center">No.</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color:'#000'}} align="center">Station</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color:'#000'}} align="center">IP</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color:'#000'}} align="center">Name</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color:'#000'}} align="center">Status</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color:'#000'}} align="center">Date</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color:'#000'}} align="center">Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px" ,color:'#000'}}>{index+1}</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px",color:'#000' }}>{row.DEPARTMENT || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px",color:'#000'}} >{row.IP_ESD || '0'}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px",color:'#000'}}> {row.NAME_ESD || '0'}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px",color:'#000'}} >{row.STATUS_ESD || '0'}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px",color:'#000'}}> {row.DATE_E.split('T')[0] || '0'}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px",color:'#000'}}> {row.TIME_S || '0'}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
        </Box>
    )
}
export default ESDErrorDetail;