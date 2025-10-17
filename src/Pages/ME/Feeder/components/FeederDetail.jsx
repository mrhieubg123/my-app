import React from 'react';
import { Box,  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Download } from '@mui/icons-material';


const TableFeederDetail = ({
    showMaintain= false,
    data = [],
    data2 = [],
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
                FEEDER_TYPE: item.FEEDER_TYPE,
                MACHINE_CODE: item.MACHINE_CODE,
                USE_TIMES: item.USE_TIMES,
                STATION: item.STATION,
                SLOT_NO: item.SLOT_NO,
                STATUS: item.STATUS,
                FEEDER_STATUS: item.FEEDER_STATUS
            })
        })
        stt++;
    })


    return (
        <Box sx={{height:'100%'}}>
            {data.length > 0 ? 
            <TableContainer sx={{overflow:'auto', height:showMaintain ? '30%': '100%', color:'#000',
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
                        <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Use Times</TableCell>
                        <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Station</TableCell>
                        <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Slot NO</TableCell>
                        <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Status</TableCell>
                        {/* <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Status</TableCell> */}

                    </TableRow>
                </TableHead>
                <TableBody>
                {data.length > 0 ? groupedData.map((row, index) => ( //,ERROR,ERROR_CODE,root_,EMP_confirm, act
                    <TableRow key={index}>
                        {row.showSN && (
                            <TableCell rowSpan={row.rowSpan} align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`STT`] || ''}</TableCell>
                        )}
                        {/* <TableCell component="th" scope="row" style={{ padding: "6px", color:'#000',}}>{index + 1 || ''}</TableCell> */}
                        {row.showSN && (
                            <TableCell rowSpan={row.rowSpan} align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`FEEDER_SN`].split(',')[0] || ''}</TableCell>
                        )}
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`FEEDER_NO`] || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`FEEDER_TYPE`] || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`MACHINE_CODE`] || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`USE_TIMES`] || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`STATION`] || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`SLOT_NO`] || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`STATUS`] || ''}</TableCell>
                        {/* <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`FEEDER_STATUS`] || ''}</TableCell> */}
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
        {showMaintain ? 
            <TableContainer sx={{overflow:'auto',height: showMaintain ? '70%':'100%', color:'#000',
            '&::-webkit-scrollbar': { width: 8,height: 6, opacity: 0 },
            '&:hover::-webkit-scrollbar': { width: 8,height: 6, opacity: 1 },
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
            <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
                <TableHead sx={{position:'sticky', top: '0', backgroundColor: theme.palette.background.conponent}}>
                    <TableRow>
                        <TableCell style={{padding: "8px", fontWeight: "bold"}}>No.</TableCell>
                        <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Feeder SN</TableCell>
                        <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Feeder NO</TableCell>
                        <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Feeder Machine</TableCell>
                        <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Feeder Type</TableCell>
                        <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">EMP</TableCell>
                        <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Work Time</TableCell>
                        <TableCell style={{padding: "8px", fontWeight: "bold"}} align="center">Adjust Reason</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {data2.length > 0 ? data2.map((row, index) => ( //,ERROR,ERROR_CODE,root_,EMP_confirm, act
                    <TableRow key={index}>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{index + 1}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`FEEDER_SN`] || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`FEEDER_NO`] || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`FEEDER_MACHINE`] || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`FEEDER_TYPE_DESC`] || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`mfr_EMP`] || ''}</TableCell>
                        {/* <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`EMP`] || ''}</TableCell> */}
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`WORK_TIME`].replace('T', ' ').replace('.000Z', '') || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px", color:'#000' }}>{row[`ADJUST_REASON`] || ''}</TableCell>
                    </TableRow>
                )) : ''}
                </TableBody>
            </Table>
            </TableContainer>
            :
            ''
        }
            
        </Box>
    )
}
export default TableFeederDetail;