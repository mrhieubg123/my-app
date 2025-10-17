import React from 'react';
import { Box,  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Download } from '@mui/icons-material';


const TableFeederMRDetail = ({
    showMaintain= false,
    data = [],
  }) => {
    const theme = useTheme();

    const snGroups = {};
    const groupedData = [];
    let stt = 1;

    data.forEach(item => {
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
                FEEDER_MACHINE: item.FEEDER_MACHINE,
                FEEDER_TYPE: item.FEEDER_TYPE,
                EMP: item.EMP,
                WorkDay: item.WorkDay,
                ERR_DESC_EMP: item.ERR_DESC_EMP,
                ERR_DESC: item.ERR_DESC,
                LOCK_TIME: item.LOCK_TIME,
                REPAIR_TIME: item.REPAIR_TIME,
                STATUS: item.STATUS,
                Confirm_Time: item.Confirm_Time,
            })
        })
        stt++;
    })

    console.log(groupedData);
    return (
        <Box sx={{height:'100%'}}>
            {data.length > 0 ? 

            showMaintain ?    
            <TableContainer sx={{overflow:'auto', height:'100%', color:'#000',
                '&::-webkit-scrollbar': { width: 8,height: 6, opacity: 0 },
                '&:hover::-webkit-scrollbar': { width: 8,height: 6, opacity: 1 },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
            <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
                <TableHead sx={{position:'sticky', top: '0', backgroundColor: theme.palette.background.conponent}}>
                    <TableRow>
                        <TableCell style={{padding: "8px", fontWeight: "bold"}}>No.</TableCell>
                        <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Feeder SN</TableCell>
                        <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Feeder NO</TableCell>
                        <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Feeder Type</TableCell>
                        <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Machine Code</TableCell>
                        <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Emp</TableCell>
                        <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Work Time</TableCell>
                        

                    </TableRow>
                </TableHead>
                <TableBody>
                {data.length > 0 ? groupedData.map((row, index) => ( //,ERROR,ERROR_CODE,root_,EMP_confirm, act
                    <TableRow key={index}>
                        {row.showSN && (
                            <TableCell rowSpan={row.rowSpan} align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`STT`] || ''}</TableCell>
                        )}
                        {row.showSN && (
                            <TableCell rowSpan={row.rowSpan} align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`FEEDER_SN`].split(',')[0] || ''}</TableCell>
                        )}
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`FEEDER_NO`] || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`FEEDER_TYPE`] || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`FEEDER_MACHINE`] || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`EMP`] || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`WorkDay`].replace('T', ' ').replace('.000Z', '') || ''}</TableCell>
                    </TableRow>
                )) : ''}
                </TableBody>
            </Table>
            </TableContainer>
            
            :

            <TableContainer sx={{overflow:'auto', height:'100%', color:'#000',
            '&::-webkit-scrollbar': { width: 8,height: 6, opacity: 0 },
            '&:hover::-webkit-scrollbar': { width: 8,height: 6, opacity: 1 },
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
        <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
            <TableHead sx={{position:'sticky', top: '0', backgroundColor: theme.palette.background.conponent}}>
                <TableRow>
                    <TableCell style={{padding: "8px", fontWeight: "bold"}}>No.</TableCell>
                    <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Feeder SN</TableCell>
                    <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Feeder NO</TableCell>
                    <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Feeder Type</TableCell>
                    <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Error Code</TableCell>
                    <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Error Name</TableCell>
                    <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Lock Time</TableCell>
                    <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Repair Time</TableCell>
                    <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Confirm Time</TableCell>
                    <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Status</TableCell>

                </TableRow>
            </TableHead>
            <TableBody>
            {data.length > 0 ? groupedData.map((row, index) => ( //,ERROR,ERROR_CODE,root_,EMP_confirm, act
                <TableRow key={index}>
                    {row.showSN && (
                        <TableCell rowSpan={row.rowSpan} align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`STT`] || ''}</TableCell>
                    )}
                    {row.showSN && (
                        <TableCell rowSpan={row.rowSpan} align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`FEEDER_SN`].split(',')[0] || ''}</TableCell>
                    )}
                    <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`FEEDER_NO`] || ''}</TableCell>
                    <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`FEEDER_TYPE`] || ''}</TableCell>
                    <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`ERR_DESC_EMP`] || ''}</TableCell>
                    <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`ERR_DESC`] || ''}</TableCell>
                    <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`LOCK_TIME`].replace('T', ' ').replace('.000Z', '') || ''}</TableCell>
                    <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`REPAIR_TIME`].replace('1900-01-01T00:00:00.000Z', '').replace('T', ' ').replace('.000Z', '') || ''}</TableCell>
                    <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`Confirm_Time`].replace('1900-01-01T00:00:00.000Z', '').replace('T', ' ').replace('.000Z', '') || ''}</TableCell>
                    <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`STATUS`] || ''}</TableCell>
                </TableRow>
            )) : ''}
            </TableBody>
        </Table>
        </TableContainer>
            :
            <Box sx={{height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Typography sx={{fontSize: '80px', fontWeight:'bold'}}>Null</Typography>
            </Box>    
        }
        
            
        </Box>
    )
}
export default TableFeederMRDetail;