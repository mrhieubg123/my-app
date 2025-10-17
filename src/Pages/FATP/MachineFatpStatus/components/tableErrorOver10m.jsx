import React from 'react';
import { Box,  TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const TableErorOver5m = ({
    idata = [],
  }) => {
    const theme = useTheme();

   
    return (
        <Box sx={{height:'100%'}}>
            
            <TableContainer sx={{overflow:'auto',height:'100%',
                '&::-webkit-scrollbar': { width: 0, opacity: 0, height: 6 },
                '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
            <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
                <TableHead sx={{position:'sticky', top: '0', backgroundColor: theme.palette.background.conponent}}>
                    <TableRow>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}}>No.</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Line</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Machine</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Error Code</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Error</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Time(m)</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Start Time</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">End Time</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Root</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Action</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Emp Confirm</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                {idata.length > 0 ? idata.map((row, index) => ( //,ERROR,ERROR_CODE,root_,EMP_confirm, act
                    <TableRow key={index}>
                        <TableCell component="th" scope="row" style={{ padding: "3px", fontSize: '12px', color: row.CARD_CODE !== null ? '' : '#ff3110' }}>{index + 1 || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px", fontSize: '12px', color: row.CARD_CODE !== null ? '' : '#ff3110' }}>{row.LINE || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px", fontSize: '12px', color: row.CARD_CODE !== null ? '' : '#ff3110'}}>{row[`MACHINE_NAME`] || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px", fontSize: '12px', color: row.CARD_CODE !== null ? '' : '#ff3110'}}>{row[`ERROR_CODE`] || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px", fontSize: '12px', color: row.CARD_CODE !== null ? '' : '#ff3110'}}>{row[`ERROR_TYPE`] || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px", fontSize: '12px', color: row.CARD_CODE !== null ? '' : '#ff3110'}}>{(row.TIME*1/60).toFixed(2) || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px", fontSize: '12px', color: row.CARD_CODE !== null ? '' : '#ff3110'}}>{row[`START_TIME`].replace('T', ' ').replace('.000Z', '') || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px", fontSize: '12px', color: row.CARD_CODE !== null ? '' : '#ff3110'}}>{row[`END_TIME`].replace('T', ' ').replace('.000Z', '') || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px", fontSize: '12px', color: row.CARD_CODE !== null ? '' : '#ff3110'}}>{row[`CAUSE`] || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px", fontSize: '12px', color: row.CARD_CODE !== null ? '' : '#ff3110'}}>{row[`SOLUTION`] || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px", fontSize: '12px', color: row.CARD_CODE !== null ? '' : '#ff3110'}}>{row.CARD_CODE || ''}</TableCell>
                    </TableRow>
                )) : ''}
                </TableBody>
            </Table>
            </TableContainer>
        </Box>
    )
}
export default TableErorOver5m;