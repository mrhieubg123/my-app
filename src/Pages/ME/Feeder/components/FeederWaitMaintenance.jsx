import React, { useState } from 'react';
import { Box,  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Typography, TablePagination } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Download } from '@mui/icons-material';


const TableFeederWaitMaintenance = ({
    data = [],
  }) => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event , newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    const snGroups = {};
    const groupedData = [];
    let stt = 1;
    const slideData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    slideData.forEach(item => {
        if(!snGroups[item.FEEDER_SN]){
            snGroups[item.FEEDER_SN] = [];
        }
        snGroups[item.FEEDER_SN].push(item);
    })

    Object.entries(snGroups).forEach(([sn, items]) => {
        items.forEach((item, index) => {
            groupedData.push({
                showSN: index === 0 ,
                rowSpan: index === 0 ? items.length : 0,
                STT: index === 0 ? stt : '',
                FEEDER_SN:  index === 0 ? sn : '',
                FEEDER_NO: item.FEEDER_NO,
                FEEDER_TYPE: item.FEEDER_TYPE,
                FEEDER_STATUS: item.FEEDER_STATUS,
                LINE_NAME: item.LINE_NAME,
                SLOT_NO: item.SLOT_NO,
                DateDri: item.DateDri,
                WORK_TIME: item.WORK_TIME,
                STATION: item.STATION
            })
        })
        stt++;
    })

    return (
        <Box sx={{height:'100%'}}>
            {data.length > 0 ? 
            <Box sx={{height:'100%'}}>
        <TableContainer sx={{overflow:'auto', color:'#000',height:'100%',
            '&::-webkit-scrollbar': { width: 8,height: 6, opacity: 0 },
            '&:hover::-webkit-scrollbar': { width: 8,height: 6, opacity: 1 },
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
            <Table  sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
                <TableHead sx={{position:'sticky', top: '0', backgroundColor: theme.palette.background.conponent}}>
                    <TableRow>
                        {/* <TableCell style={{padding: "3px 6px", fontWeight: "bold"}}>No.</TableCell> */}
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Feeder SN</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Feeder NO</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Feeder Type</TableCell>
                        {/* <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Status</TableCell> */}
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Station</TableCell>
                        {/* <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Work Time</TableCell> */}
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Times(day)</TableCell>
                    
                    </TableRow>
                </TableHead>
                <TableBody>
                {data.length > 0 ? groupedData.map((row, index) => ( //,ERROR,ERROR_CODE,root_,EMP_confirm, act
                    <TableRow key={index} >
                        {/* {row.showSN && (
                            <TableCell rowSpan={row.rowSpan} align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`STT`] || ''}</TableCell>
                        )} */}
                        {row.showSN && (
                            <TableCell rowSpan={row.rowSpan} align="center" style={{ padding: "3px 6px", background: row[`DateDri`] > 90 ? '#ff232355' : '#ffbc4255'  }}>{row[`FEEDER_SN`].split(',')[0] || ''}</TableCell>
                        )}
                        <TableCell align="center" style={{ padding: "3px 6px", background: row[`DateDri`] > 90 ? '#ff232355' : '#ffbc4255' }}>{row[`FEEDER_NO`].split(',')[0] || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", background: row[`DateDri`] > 90 ? '#ff232355' : '#ffbc4255'}}>{row[`FEEDER_TYPE`] || ''}</TableCell>
                        {/* <TableCell align="center" style={{ padding: "3px 6px", }}>{row[`FEEDER_STATUS`] || ''}</TableCell> */}
                        <TableCell align="center" style={{ padding: "3px 6px", background: row[`DateDri`] > 90 ? '#ff232355' : '#ffbc4255'}}>{row[`LINE_NAME`] !== '' ? row[`LINE_NAME`] + '/'+row[`SLOT_NO`] : row[`STATION`]}</TableCell>
                        {/* <TableCell align="center" style={{ padding: "3px 6px",}}>{row[`WORK_TIME`] || ''}</TableCell> */}
                        <TableCell align="center" style={{ padding: "3px 6px", background: row[`DateDri`] > 90 ? '#ff232355' : '#ffbc4255'}}>{row[`DateDri`] || ''}</TableCell>
                    </TableRow>
                )) : ''}
                </TableBody>
            </Table>
        </TableContainer>
        <TablePagination 
            conponent='div'
            page={page}
            count={data.length}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5,10, 25, {label:'All', value: -1}]}
            labelRowsPerPage="Page" 


            sx={{position: 'absolute', 
                bottom: 0, 
                right: 0, 
                backgroundColor: '#0005', 
                borderTopLeftRadius: '15px', 
                '& .MuiTablePagination-toolbar':{
                    minHeight: 32,
                },
                '& .MuiTablePagination-selectLabel':{
                    margin:'unset',
                    
                },
                '& .MuiTablePagination-displayedRows':{
                    margin:'unset',
                },
                transition: 'transform 0.25s ease-out',
                transform: 'translateX(80%)',
                textTransform: 'capitalize',
                '&:hover': {  backgroundColor: theme.palette.background.conponent,  transform: 'translateX(0%)' },
            }}

         />
        
        </Box>
            
            :
            <Box sx={{height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Typography sx={{fontSize: '80px', fontWeight:'bold'}}>Null</Typography>
            </Box>    
        }
            
        </Box>
    )
}
export default TableFeederWaitMaintenance;