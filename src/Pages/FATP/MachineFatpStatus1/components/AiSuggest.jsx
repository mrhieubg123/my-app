import React from 'react';
import { Box,  TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const AiSuggest = ({
    idata = [],
  }) => {
    const theme = useTheme();
    return (
        <Box sx={{height:'100%'}}>
            <TableContainer sx={{overflow:'auto', height:'100%',
                    '&::-webkit-scrollbar': { width: 0, opacity: 0 },
                    '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
                <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
                    <TableHead sx={{position:'sticky', top: '0', backgroundColor: '#69c0fe'}}>
                        <TableRow>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">Error</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">Fre</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">Cause</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">Solution</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">Suggest</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {idata.length > 0 ? idata.slice(0,5).map((row, index) => (
                        <TableRow key={index} >
                             <TableCell align="center" sx={{ padding: "12px",color: '#000', background: '#cbcbcb56', fontSize: '12px'}}>{row.ERROR_NAME || ''}</TableCell> 
                             <TableCell align="center" sx={{ padding: "6px 6px",color: '#004eff', fontWeight:'bold', cursor:'pointer', fontSize:  '1.2rem',  }}>{row.Total || '0'}</TableCell>
                            <TableCell align="left" sx={{ padding: "6px 6px",color: '#000', fontSize: '12px'}}>{row.CAUSE || ''}</TableCell>
                            <TableCell align="left" sx={{ padding: "6px 6px",color: '#000', fontSize: '12px'}}>{row.SOLUTION || ''}</TableCell>
                            <TableCell align="left" sx={{ padding: "6px 6px",color: '#004eff', fontWeight:'bold', cursor:'pointer', fontSize:  '1.2rem',  }}></TableCell>

                        </TableRow>
                    )) :''}
                    
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}
export default AiSuggest;