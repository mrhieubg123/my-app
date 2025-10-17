import React, { useMemo,useState } from 'react';
import { Box, Grid, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,Paper, TableSortLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const TableParam = ({
    alarn,
    width = '100%',
    height = '100%',
    variant = 'default',
    idata = [],
    onModelChange,
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
    
    var highL = ['MountBlowCheck','ImproveCheckNozzlePartsEjection','MissDetect','HeadMainteNzlPosiFilterDetected']

    const colorMap = useMemo(
        () => ({
            RUN: '#00e396',
            OFFt: '#fdfd00',
            ERROR: '#ff3110',
            NA: '#808080',
        }),
        []
    )

    const renderStatusCell = (status) => {
        const color = colorMap[status] || '';

        return(
            <Box 
            sx={{
                backgroundColor: color,
                width: '24px', 
                height: '24px', 
                borderRadius: '50%',
                margin: 'auto'
                }}
            >
            </Box>
        )
    }

    const StatusCell = (index) => {
        const list = [idata[index].H1, idata[index].H2, idata[index].H3, idata[index].H4, idata[index].H5, idata[index].H6, idata[index].G1, idata[index].G2];
                        
        const count = list.reduce((acc, value) =>{
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        },{});
        var sumY = count["YES"] ? count["YES"]*1 : 0;
        var sumN = count["NO"] ? count["NO"]*1 : 0;
        var sumYN = sumY + sumN;
        if (sumY >= sumYN) {
            return 'RUN';
        }
        else if(sumY < sumYN && sumY > 0){
            return 'OFFt';
        }
        else{
            return 'NA';
        }
       
    }
    return (
        <Box sx={{height:'100%'}}>
            <TableContainer sx={{overflow:'auto', height:'100%',
                    '&::-webkit-scrollbar': { width: 0, opacity: 0 },
                    '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
                <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
                    <TableHead sx={{position:'sticky', top: '0', backgroundColor: '#fff'}}>
                        <TableRow>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">Status</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">Line</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">
                                <TableSortLabel 
                                    active={orderBy === 'parameter'}
                                    direction={orderBy === 'parameter' ? orderDirection : 'asc'}
                                    onClick={() => handleSortRequest('parameter')}
                                    
                                    sx={{color:'#000 !important'}}
                                >
                                    Parameter
                                </TableSortLabel>
                            </TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">
                                <TableSortLabel 
                                    active={orderBy === 'H1'}
                                    direction={orderBy === 'H1' ? orderDirection : 'asc'}
                                    onClick={() => handleSortRequest('H1')}
                                    sx={{color:'#000 !important'}}
                                >
                                    H1
                                </TableSortLabel>
                            </TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">
                                <TableSortLabel 
                                    active={orderBy === 'H2'}
                                    direction={orderBy === 'H2' ? orderDirection : 'asc'}
                                    onClick={() => handleSortRequest('H2')}
                                    sx={{color:'#000 !important'}}
                                >
                                    H2
                                </TableSortLabel>
                            </TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">
                                <TableSortLabel 
                                    active={orderBy === 'H3'}
                                    direction={orderBy === 'H3' ? orderDirection : 'asc'}
                                    onClick={() => handleSortRequest('H3')}
                                    sx={{color:'#000 !important'}}
                                >
                                    H3
                                </TableSortLabel>
                            </TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">
                            <TableSortLabel 
                                    active={orderBy === 'H4'}
                                    direction={orderBy === 'H4' ? orderDirection : 'asc'}
                                    onClick={() => handleSortRequest('H4')}
                                    sx={{color:'#000 !important'}}
                                >
                                    H4
                                </TableSortLabel>
                            </TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">
                            <TableSortLabel 
                                    active={orderBy === 'H5'}
                                    direction={orderBy === 'H5' ? orderDirection : 'asc'}
                                    onClick={() => handleSortRequest('H5')}
                                    sx={{color:'#000 !important'}}
                                >
                                    H5
                                </TableSortLabel>
                            </TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">
                            <TableSortLabel 
                                    active={orderBy === 'H6'}
                                    direction={orderBy === 'H6' ? orderDirection : 'asc'}
                                    onClick={() => handleSortRequest('H6')}
                                    sx={{color:'#000 !important'}}
                                >
                                    H6
                                </TableSortLabel>
                            </TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">
                                <TableSortLabel 
                                    active={orderBy === 'G1'}
                                    direction={orderBy === 'G1' ? orderDirection : 'asc'}
                                    onClick={() => handleSortRequest('G1')}
                                    sx={{color:'#000 !important'}}
                                >
                                    G1
                                </TableSortLabel></TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center"> 
                                <TableSortLabel 
                                    active={orderBy === 'G2'}
                                    direction={orderBy === 'G2' ? orderDirection : 'asc'}
                                    onClick={() => handleSortRequest('G2')}
                                    sx={{color:'#000 !important'}}
                                >
                                    G2
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {sortedRows.map((row, index) => (
                        <TableRow key={index} sx={{backgroundColor: highL.includes(row.parameter) ? '#cbcbcb' : ''}}>
                            <TableCell align="center" sx={{ padding: "6px 6px",}}>{renderStatusCell(StatusCell(index))}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px",color: '#000'}}>{row.line || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px",color: '#000'}}>{row.parameter || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px",color: '#000', backgroundColor: row.H1 === 'YES' ? '#00b532' : ''}}>{row.H1 || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px",color: '#000', backgroundColor: row.H2 === 'YES' ? '#00b532' : ''}}>{row.H2 || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px",color: '#000', backgroundColor: row.H3 === 'YES' ? '#00b532' : ''}}>{row.H3 || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px",color: '#000', backgroundColor: row.H4 === 'YES' ? '#00b532' : ''}}>{row.H4 || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px",color: '#000', backgroundColor: row.H5 === 'YES' ? '#00b532' : ''}}>{row.H5 || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px",color: '#000', backgroundColor: row.H6 === 'YES' ? '#00b532' : ''}}>{row.H6 || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px",color: '#000', backgroundColor: row.G1 === 'YES' ? '#00b532' : ''}}>{row.G1 || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px",color: '#000', backgroundColor: row.G2 === 'YES' ? '#00b532' : ''}}>{row.G2 || ''}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
        </Box>
    )




}
export default TableParam;