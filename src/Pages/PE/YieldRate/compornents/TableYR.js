import React, { useMemo } from 'react';
import { Box, Grid, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const TableYR = ({
    children,
    alarn,
    width = '100%',
    height = '100%',
    border = '1px solid black',
    variant = 'default',
    header = '',
    lg = 12,
    md = 12,
    xs = 12,
    data = [],
    filter,
    line = 1,
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
        // borderRadius: 2,
        // boxShadow: 4,
        padding: 'unset',
        overflow:'hidden',
        '&:hover': alarn && {
          transform: 'scale(1.05)',
          transition: 'transform 0.2s ease-in-out',
          backgroundColor: theme.palette.primary.main,
        },
      }), [variant, alarn, styles, width, height, theme]);

    
    const dataFilter = data.length > 0 ? data : [
          { content: "Line1", spec1: "1", g1: "1", spec2: "1" , g2: "1"},
          { content: "Line1", spec1: "2", g1: "2", spec2: "2", g2: "1" },
          { content: "Line2", spec1: "3", g1: "3", spec2: "3", g2: "1" },
          { content: "Line2", spec1: "4", g1: "4", spec2: "4" , g2: "1"},
          { content: "Line4", spec1: "", g1: "", spec2: "" , g2: "1"},
          { content: "Line4", spec1: "", g1: "", spec2: "" , g2: "1"},
          { content: "Line5", spec1: "", g1: "", spec2: "" , g2: "1"},
          { content: "Line5", spec1: "", g1: "", spec2: "" , g2: "1"},
        ]
     
    return (
        <Box sx={tableStyles}>
            <Typography sx={{display: 'flex',
                float:'right',
                padding: 0.5, //khoang cach ben trong
                }}>
                {dataFilter.map(item => item["PRODUCT_NAME"])[0] }
            </Typography>
            <TableContainer sx={{overflow:'auto',
                '&::-webkit-scrollbar': { width: 0, opacity: 0 },
                '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
            <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
                <TableHead sx={{position:'sticky', top: '0', backgroundColor: theme.palette.background.conponent}}>
                    <TableRow>
                        <TableCell rowSpan={2} style={{padding: "3px 6px", fontWeight: "bold"}}>LINE</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">G</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Model</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">SPI</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Pre-AOI</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Pos-AOI</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {dataFilter.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell component="th" scope="row" style={{ padding: "6px" }}>{row.LINE || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px" }}>{row[`LANE`] || '0'}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px" }}>{row[`MODEL`] || '0'}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px" }}>{row[`SPI`] !== null ? filter === 'OK' ? row[`SPI`] :  100 - row[`SPI`] : 'null'}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px" }}>{row[`AOI`] !== null ? filter === 'OK' ? row[`AOI`] : 100 -  row[`AOI`] : 'null'}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px" }}>{row[`POS_AOI`] !== null ? filter === 'OK' ? row[`POS_AOI`] : 100 - row[`POS_AOI`] : 'null'}</TableCell> 
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        </Box>
    )

}
export default TableYR;