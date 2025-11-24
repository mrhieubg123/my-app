import React, { memo, useMemo9,useState } from 'react';
import { Box, Grid, Typography, TableContainer, Dialog, DialogActions, DialogContent, DialogTitle,TextField, Table, TableHead, TableRow, TableCell, TableBody,Paper, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DeleteOutline } from '@mui/icons-material';

import { useSelector, useDispatch } from 'react-redux';
import { getAuthorizedAxiosIntance } from '../../../../utils/axiosConfig';
const axiosInstance = await getAuthorizedAxiosIntance();


function getLocalDate() {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset*60000);
    return localDate.toISOString().slice(0, 19);
}


const TableEquipmentUse = ({
    alarn,
    width = '100%',
    height = '100%',
    variant = 'default',
    idata = {},
    onModelChange,
    onModelChange2,

    
  }) => {
    const theme = useTheme();
  
    return (
        <Box sx={{height: '100%'}}>
            <TableContainer sx={{overflow:'auto',height: '100%',
                    '&::-webkit-scrollbar': { width: 6,height:6, opacity: 0 },
                    '&:hover::-webkit-scrollbar': { width: 6, opacity: 1 },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
                <Table stickyHeader aria-label="customized table">
                    <TableHead >
                        <TableRow sx={{ backgroundColor: theme.palette.background.conponent,
                            '& th':{
                                backgroundColor: theme.palette.background.conponent,
                               borderBottom: '2px solid #999',
                               borderTop: '2px solid #999',
                            },
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                        }}>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px",cursor:"pointer", fontWeight: "bold"  }}>No.</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px",cursor:"pointer", fontWeight: "bold"  }}>Project</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px",cursor:"pointer", fontWeight: "bold"  }}>Line</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px",cursor:"pointer", fontWeight: "bold"  }}>Machine</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px",cursor:"pointer", fontWeight: "bold"  }}>Machine Name</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px",cursor:"pointer", fontWeight: "bold"  }}>Machine Code</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px",cursor:"pointer", fontWeight: "bold"  }}>Product EN</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px",cursor:"pointer", fontWeight: "bold"  }}>Product VN</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px",cursor:"pointer", fontWeight: "bold"  }}>Date Time</TableCell>
                            {/* <TableCell align="center" component="th" scope="row" sx={{ padding: "6px",cursor:"pointer", fontWeight: "bold"  }}>Time Control (day)</TableCell> */}
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px",cursor:"pointer", fontWeight: "bold"  }}>Total used</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px",cursor:"pointer", fontWeight: "bold"  }}>Comment</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px",cursor:"pointer", fontWeight: "bold"  }}>Emp</TableCell>


                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {idata.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell align="center" style={{padding: "6px"}}>{index + 1 || ''}</TableCell>
                            <TableCell align="center" style={{padding: "6px"}}>{row.Project || ''}</TableCell>
                            <TableCell align="center" style={{padding: "6px"}}>{row.Line || ''}</TableCell>
                            <TableCell align="center" style={{padding: "6px"}}>{row.Machine || ''}</TableCell>
                            <TableCell align="center" style={{padding: "6px"}}>{row.MachineName || ''}</TableCell>
                            <TableCell align="center" style={{padding: "6px"}}>{row.MachineCode || ''}</TableCell>
                            <TableCell align="center" style={{padding: "6px"}}>{row.Product_en || ''}</TableCell>
                            <TableCell align="center" style={{padding: "6px"}}>{row.Product_vn || ''}</TableCell>
                            <TableCell align="center" style={{padding: "6px"}}>{row.Time_Start.split(".")[0].replace('T',' ') || ''}</TableCell>
                            {/* <TableCell align="center" style={{padding: "3px 6px"}}>{row.TimeControl}</TableCell> */}
                            <TableCell align="center" style={{padding: "6px"}}>{row.TotalItemUse}</TableCell>
                            <TableCell align="center" style={{padding: "6px"}}>{row.Comment || ''}</TableCell>
                            <TableCell align="center" style={{padding: "6px"}}>{row.ID_Confirm || ''}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>

                
            
        </Box>
    )




}
export default memo(TableEquipmentUse) ;