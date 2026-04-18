import React, { useMemo,useState } from 'react';
import { Box, Grid, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,Paper, TableSortLabel, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const TableAnalysisDetailError = ({
    alarn,
    width = '100%',
    height = '100%',
    variant = 'default',
    idata = [],
  }) => {
    const theme = useTheme();
    const [orderBy, setOrderBy] = useState('');
    const [orderDirection, setOrderDirection] = useState('asc');

    const handleSortRequest = (columnId) =>{
        const isAsc = orderBy === columnId && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(columnId);
    }
    const sortedRows = [...idata].sort((a, b) =>{
        if(!orderBy) return 0;
        if(a[orderBy] < b[orderBy]) return orderDirection === 'asc' ? -1 : 1;
        if(a[orderBy] > b[orderBy]) return orderDirection === 'asc' ? 1 : -1;
        return 0;
    })
    
    return (
        <Box sx={{height:'100%'}}>
            <TableContainer sx={{overflow:'auto', height:'100%',
                    '&::-webkit-scrollbar': { width: 0, opacity: 0 },
                    '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
                <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
                    <TableHead sx={{position:'sticky', top: '0'}}>
                        <TableRow sx={{backgroundColor: '#f6f7f5'}}>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">No.</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">
                                <TableSortLabel 
                                    active={orderBy === 'LINE'}
                                    direction={orderBy === 'LINE' ? orderDirection : 'asc'}
                                    onClick={() => handleSortRequest('LINE')}
                                    sx={{color:'#000 !important'}}
                                >
                                    Line
                                </TableSortLabel>
                                
                            </TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">
                                <TableSortLabel 
                                    active={orderBy === 'MACHINE_CODE'}
                                    direction={orderBy === 'MACHINE_CODE' ? orderDirection : 'asc'}
                                    onClick={() => handleSortRequest('MACHINE_CODE')}
                                    sx={{color:'#000 !important'}}
                                >
                                    Machine
                                </TableSortLabel>
                            </TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">
                                <TableSortLabel 
                                    active={orderBy === 'ERROR_CODE'}
                                    direction={orderBy === 'ERROR_CODE' ? orderDirection : 'asc'}
                                    onClick={() => handleSortRequest('ERROR_CODE')}
                                    sx={{color:'#000 !important'}}
                                >
                                    ErrorCode
                                </TableSortLabel>
                            </TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">
                                <TableSortLabel 
                                    active={orderBy === 'ERROR'}
                                    direction={orderBy === 'ERROR' ? orderDirection : 'asc'}
                                    onClick={() => handleSortRequest('ERROR')}
                                    sx={{color:'#000 !important'}}
                                >
                                    Error
                                </TableSortLabel>
                            </TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">
                                <TableSortLabel 
                                    active={orderBy === 'TIMER'}
                                    direction={orderBy === 'TIMER' ? orderDirection : 'asc'}
                                    onClick={() => handleSortRequest('TIMER')}
                                    sx={{color:'#000 !important'}}
                                >
                                    Timer(s)
                                </TableSortLabel>
                            </TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">
                                <TableSortLabel 
                                    active={orderBy === 'START_TIME'}
                                    direction={orderBy === 'START_TIME' ? orderDirection : 'asc'}
                                    onClick={() => handleSortRequest('START_TIME')}
                                    sx={{color:'#000 !important'}}
                                >
                                    DateTime
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {sortedRows.map((row, index) => (
                        <TableRow key={index} >
                            <TableCell align="center" sx={{ padding: "6px",color: '#000'}}>{index +1 || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px",color: '#000'}}>{row.LINE || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px",color: '#000'}}>{row.MACHINE_CODE || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px",color: '#000'}}>{row.ERROR_CODE || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px",color: '#000'}}>{row.ERROR || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px",color: '#000'}}>{row.TIMER || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px",color: '#000'}}>{row.START_TIME.replace('T',' ').replace('.000Z','') || ''}</TableCell>
                          
                        </TableRow>
                    ))}
                    
                    </TableBody>
                </Table>
                </TableContainer>
                
        </Box>
    )




}
export default TableAnalysisDetailError;