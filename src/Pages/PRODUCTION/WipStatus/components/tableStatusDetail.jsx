import React, { memo } from 'react';
import { Box,  TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const TableStatusDetail = ({
    idata = [],
  }) => {
    const theme = useTheme();    
  
    return (
        <Box sx={{height: '100%'}}>
            
            <TableContainer sx={{overflow:'auto',height: '100%',
                '&::-webkit-scrollbar': { width: 6, opacity: 0 },
                '&:hover::-webkit-scrollbar': { width: 6, opacity: 1 },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
            <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
                <TableHead sx={{position:'sticky', top: '0', backgroundColor: theme.palette.background.conponent}}>
                    <TableRow>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}}>No.</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Model</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Line</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">SN</TableCell>

                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">In Time</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Op Pack</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Car ID</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Station</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Time</TableCell>
             

                    </TableRow>
                </TableHead>
                <TableBody>
                {idata.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell component="th" scope="row" style={{ padding: "6px", color:'#000' }}>{index + 1 || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{item.MODEL || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{item.LINE || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{item.SN || ''}</TableCell>

                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{item.SMT_TIME.replace('T', ' ').replace('.000Z', '') || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{item.EMP_SMT || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{item.CART_SN || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{item.STATION || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{item.SMT_TIME.replace('T', ' ').replace('.000Z', '') || ''}</TableCell>
                      
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        </Box>
    )
}
export default memo(TableStatusDetail);