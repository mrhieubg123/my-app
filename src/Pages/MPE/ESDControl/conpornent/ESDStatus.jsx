import React, { useMemo,useState } from 'react';
import { Box, Grid, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { color } from 'highcharts';

const ESDStatus = ({
    alarn,
    width = '100%',
    height = '100%',
    variant = 'default',
    dataFilter =[],
    data = [],
    data2 =[],
    onModelChange,
    onModelChange2
  }) => {

    const theme = useTheme();
    const styles = useMemo(() => ({
        default: { backgroundColor: '#ffffff00'  },
        outlined: {  backgroundColor: '#ffffff00' },
        filled: { backgroundColor: '#ffffff00', color: theme.palette.primary.conponent },
      }), [theme]);

    const tableStyles = useMemo(() => ({
        width,
        height,
        ...styles[variant],
        display: 'flex',
        flexDirection: 'column',
        padding: 'unset',
        overflow:'hidden',
        '&:hover': alarn && {
          transform: 'scale(1.05)',
          transition: 'transform 0.2s ease-in-out',
          backgroundColor: theme.palette.primary.main,
        },
      }), [variant, alarn, styles, width, height, theme]);

    const dataFil = data.filter(item => dataFilter.includes(item.DEPARTMENT))

    const handleInputChange = (idepartment) =>{
        const newModel = {
            line: "",
            lane: "",
            station: "",
            dateFrom: "",
            dateTo: "",
            department: idepartment
        };
        onModelChange?.(newModel);
    };
    const handleInputChange2 = (id) =>{
        const newModel2 = id;
        onModelChange2?.(newModel2);
    };
    
    return (
        <Box sx={{height:"100%"}}>
            <TableContainer sx={{height:"100%",overflow:'auto',
                    '&::-webkit-scrollbar': { width: 0,height: 4, opacity: 0 },
                    '&:hover::-webkit-scrollbar': { width: 4,height: 4, opacity: 1 },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
                <Table sx={{ borderSpacing: "0 8px"}} aria-label="customized table" >
                    <TableHead sx={{position:'sticky', top: '0' , backgroundColor: theme.palette.background.conponent}}>
                        <TableRow>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">Station</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">Total</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">Good</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">OFF</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">Error</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">Status</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {dataFil.map((row, index) => (
                        <TableRow key={index} >
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px",cursor:"pointer" }} onClick={() => handleInputChange(row.DEPARTMENT)}>{row.DEPARTMENT || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px",cursor:"pointer"}} onClick={() => handleInputChange(row.DEPARTMENT)}>{row.RUN + row.OFFt + row.ERROR || '0'}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px",cursor:"pointer"}} onClick={() => handleInputChange(row.DEPARTMENT)}><Box sx={{backgroundColor: row.STATUS_ESD === "OFF" ? '#999': '#00d325', borderRadius:'6px'}}> {row.RUN || '0'}</Box></TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px",cursor:"pointer"}} onClick={() => handleInputChange(row.DEPARTMENT)}> <Box sx={{backgroundColor: row.STATUS_ESD === "OFF" ? '#999': '#feff33', borderRadius:'6px'}}>{row.OFFt || '0'}</Box></TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px",cursor:"pointer"}} onClick={() => handleInputChange(row.DEPARTMENT)}><Box sx={{backgroundColor: row.STATUS_ESD === "OFF" ? '#999': '#ff5733', borderRadius:'6px' }}>{row.ERROR || '0'}</Box></TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px",cursor:"pointer"}} onClick={() => handleInputChange2(row.NAME_ESD)}><Box sx={{backgroundColor: row.STATUS_ESD === "OFF" ? '#999' : '#00d325', borderRadius:'6px' ,border: `2px solid ${row.Confirm === null ? '#ff0000': '#fff'}`   }}>{row.STATUS_ESD || '0'}</Box></TableCell>

                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
        </Box>
    )
}
export default ESDStatus;