import React, { memo } from 'react';
import { Box,  TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const EquipmentInStock = ({
    idata = [],
  }) => {
    const theme = useTheme();    
    
    return (
        <Box sx={{height: '100%'}}>
            
            <TableContainer sx={{overflow:'auto',height: '100%',
                '&::-webkit-scrollbar': { width: 6, opacity: 0 },
                '&:hover::-webkit-scrollbar': { width: 6, opacity: 1 },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
            <Table stickyHeader aria-label="customized table">
                <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.background.conponent,
                            '& th':{
                                backgroundColor: theme.palette.background.conponent,
                               borderBottom: '2px solid #999',
                               borderTop: '2px solid #999',
                            },
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                        }}>
                        <TableCell style={{padding: "6px", fontWeight: "bold"}}>No.</TableCell>
                        <TableCell style={{padding: "6px", fontWeight: "bold"}} align="center">Product (EN)</TableCell>
                        <TableCell style={{padding: "6px", fontWeight: "bold"}} align="center">Product (VN)</TableCell>
                        <TableCell style={{padding: "6px", fontWeight: "bold"}} align="center">Quantity</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {idata.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell component="th" scope="row" style={{ padding: "6px" }}>{index + 1 || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "6px" }}>{item.Product_EN || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "6px" }}>{item.Product_VN || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "6px" , color: item.In*1 - item.Out*1 - item.Scrap*1 < 10 ? item.In*1 - item.Out*1 - item.Scrap*1 <= 5 ? "#ff320a" : "#ffa20a" : "#1d87ff", fontWeight: 'bold' }}>{item.In*1 - item.Out*1 - item.Scrap*1 || 0}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        </Box>
    )
}
export default memo(EquipmentInStock);