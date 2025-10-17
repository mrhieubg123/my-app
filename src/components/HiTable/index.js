import React, { useMemo } from 'react';
import { Box, Grid, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const HiTable = ({
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
    data = {},
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

    
    const dataFilter = data.filter(item => item.LINE === `Line_${line}`) 

    // console.log(dataFilter);


      // const createData = (content, spec, g1, g2) => {
      //   return { content, spec, g1, g2 };
      // };
      

        // Dữ liệu JSON mẫu
        // const jsonData = [
        //   { content: "Front Presure", spec1: "1", g1: "1", spec2: "1" , g2: "1"},
        //   { content: "Rear Presure", spec1: "2", g1: "2", spec2: "2", g2: "1" },
        //   { content: "Front Print speed", spec1: "3", g1: "3", spec2: "3", g2: "1" },
        //   { content: "Rear Print speed", spec1: "4", g1: "4", spec2: "4" , g2: "1"},
        //   { content: "Separadon Speed", spec1: "", g1: "", spec2: "" , g2: "1"},
        //   { content: "Separadon dastance", spec1: "", g1: "", spec2: "" , g2: "1"},
        //   { content: "Screen clean rate", spec1: "", g1: "", spec2: "" , g2: "1"},
        //   { content: "Solvent clean speed", spec1: "", g1: "", spec2: "" , g2: "1"},
        //   { content: "Dry clean seed", spec1: "", g1: "", spec2: "" , g2: "1"},
        //   { content: "Vaccun clean speed", spec1: "", g1: "", spec2: "" , g2: "1"},
        //   { content: "Stencil", spec1: "", g1: "", spec2: "" , g2: "1"},
        //   { content: "Detail", spec1: "", g1: "", spec2: "" , g2: "1"},
        // ];
      
        // const rows = jsonData.map((item) => createData(item.content, item.spec1, item.g1,item.spec2, item.g2));

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
                        <TableCell rowSpan={2} style={{padding: "3px 6px", fontWeight: "bold"}}>CONTENT</TableCell>
                        <TableCell colSpan={2} style={{padding: "3px 6px", fontWeight: "bold"}} align="center">G1</TableCell>
                        <TableCell colSpan={2} style={{padding: "3px 6px", fontWeight: "bold"}} align="center">G2</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Spec</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Actual</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Spec</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Actual</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {dataFilter.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell component="th" scope="row" style={{ padding: "6px" }}>{row.PARAM1.replaceAll('_', ' ') || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px" }}>{row[`F`].split('/')[1] || '0'}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px" ,fontWeight: '600', color: row[`F`].split('/')[0]*1 >= row[`F`].split('/')[1].split('-')[0]*1 && row[`F`].split('/')[0]*1 <= row[`F`].split('/')[1].split('-')[1]*1 ? '' : '#ff0000' }}>{row[`F`].split('/')[0] || '0'}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px" }}>{row[`R`].split('/')[1] || '0'}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px" ,fontWeight: '600', color: row[`R`].split('/')[0]*1 >= row[`R`].split('/')[1].split('-')[0]*1 && row[`R`].split('/')[0]*1 <= row[`R`].split('/')[1].split('-')[1]*1 ? '' : '#ff0000' }}>{row[`R`].split('/')[0] || '0'}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        </Box>
    )




}
export default HiTable;