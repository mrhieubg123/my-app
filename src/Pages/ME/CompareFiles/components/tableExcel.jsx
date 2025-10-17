import React from 'react';
import { Box,  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Download } from '@mui/icons-material';
const TableExcel = ({
    idata = [],
  }) => {
    const theme = useTheme();
    return (
        <Box sx={{height:'100%', position: 'relative',}}>
            {idata.length > 0 && 
                <TableContainer sx={{overflow:'auto',height:'100%',
                '&::-webkit-scrollbar': { width: 4, opacity: 0.3 },
                '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
            <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
                <TableHead sx={{position:'sticky', top: '0', backgroundColor: theme.palette.background.conponent}}>
                    <TableRow>
                        <TableCell  style={{ padding: "6px", maxWidth: '200px'}}>
                            No.                   
                        </TableCell>
                        {idata[0].map((col, index) => 
                            <TableCell key={index} style={{padding: "3px 6px", fontWeight: "bold", zIndex: 2}}>{col}</TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                {idata.slice(1).map((row, rowIndex) => ( 
                    <TableRow key={rowIndex}>
                        <TableCell  style={{ padding: "6px", maxWidth: '200px'}}>
                            {rowIndex+1 }                   
                        </TableCell>
                        {row.map((cel, cellIndex) => (
                            <TableCell key={cellIndex} style={{ padding: "6px", maxWidth: '200px'}}>
                                <Typography sx={{fontSize: '13px' , whiteSpace:'nowrap', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cel}</Typography> 
                            </TableCell>
                        ))}
                       
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
            }
        </Box>
    )
}
export default TableExcel;