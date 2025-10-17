import React, { useMemo,useState } from 'react';
import { Box, Grid, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ESDTopError = ({
    alarn,
    width = '100%',
    height = '100%',
    variant = 'default',
    dataFilter =[],
    data = [],
    onModelChange
  }) => {
    const theme = useTheme();
    const dataFil = data.filter(item => dataFilter.includes(item.DEPARTMENT))
    const handleInputChange = (idepartment, istation, iname) =>{
        const newModel = {
            line: "",
            lane: "",
            station: istation,
            dateFrom: "",
            dateTo: "",
            department: idepartment,
            name: iname,
        };
        onModelChange?.(newModel);
    };
    
    return (
        <Box sx={{height:"100%"}}>
            <TableContainer  sx={{height:"100%", overflow:'auto',
                '&::-webkit-scrollbar': { width: 4,height: 4, opacity: 0 },
                '&:hover::-webkit-scrollbar': { width: 4,height: 4, opacity: 1 },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd', borderRadius: '10px' },
                '&:hover::-webkit-scrollbar-thumb': { backgroundColor: '#999', borderRadius: '10px' }}}>
                <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
                    <TableHead sx={{position:'sticky', top: '0' , backgroundColor: theme.palette.background.conponent}}>
                        <TableRow>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">Station</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">IP</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">Name</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">Total</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">Detail</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px" }}>{row.DEPARTMENT || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px"}} >{row.IP_ESD || '0'}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px"}}> {row.NAME_ESD || '0'}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px",}} >{row.Total || '0'}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px",cursor:'pointer', color:'#00c2ff', "&:hover":{color:"#07f", fontWeight:"bold"} }} onClick={() => handleInputChange( row.DEPARTMENT,row.IP_ESD, row.NAME_ESD )}>Click</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
        </Box>
    )
}
export default ESDTopError;