import React, { memo, useMemo9,useState } from 'react';
import { Box, Grid, Typography, TableContainer, Dialog, DialogActions, DialogContent, DialogTitle,TextField, Table, TableHead, TableRow, TableCell, TableBody,Paper, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DeleteOutline, DetailsOutlined, DetailsSharp } from '@mui/icons-material';

import { useSelector, useDispatch } from 'react-redux';
import { getAuthorizedAxiosIntance } from '../../../../utils/axiosConfig';
const axiosInstance = await getAuthorizedAxiosIntance();


function getLocalDate() {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset*60000);
    return localDate.toISOString().slice(0, 19);
}


const ListProductsUseInMonth = ({
    alarn,
    width = '100%',
    height = '100%',
    variant = 'default',
    idata = {},
    onModelChange,
    onModelChange2,
    onModelChange3,

    
  }) => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const theme = useTheme();
  

    const handleConfirm = (model) => {
        const newModel = {
            project: model.Project,
            line: model.Line,
            machine: model.Machine,
            machineName: model.MachineName,
            location: model.Location,
            machineCode: model.MachineCode,
            product_en: model.Product_en, 
            product_vn: model.Product_vn,
            Time_Control: model.TimeControl,
            idConfirm: user.username,
            DateTime: getLocalDate(),
            totalItemUse: 1,
        }
        onModelChange?.(newModel)
    }

    

    const handleDelete = (model) => {
        // const confirm = window.confirm(`Bạn có chắc muốn xóa item (${model.Product_en} | ${model.Product_vn}) không`);
        // if(!confirm) return;
        const newModel = {
            project: model.Project,
            line: model.Line,
            machine: model.Machine,
            machineName: model.MachineName,
            location: model.Location,
            machineCode: model.MachineCode,
            product_en: model.Product_en, 
            product_vn: model.Product_vn, 
            
        }
        onModelChange2(newModel); 
    }

    const handleDeleteAll = (val) => {
        const model = val &&  val[0];
        const newModel = {
            project: model.Project,
            line: model.Line,
            machine: model.Machine,
            machineName: model.MachineName,
            location: model.Location,
            machineCode: model.MachineCode,
            product_en: '%', 
            product_vn: '%', 
        }
        onModelChange2(newModel); 
    }

    const handleDetails = (model) => {
        const newModel = {
            project: model.Project,
            line: model.Line,
            machine: model.Machine,
            machineName: model.MachineName,
            location: model.Location,
            machineCode: model.MachineCode,
            product_en: model.Product_en, 
            product_vn: model.Product_vn,
            Time_Control: model.TimeControl,
            idConfirm: user.username,
            DateTime: getLocalDate(),
            totalItemUse: 1,
        }
        onModelChange3?.(newModel)
        console.log(newModel);
    }

    return (
        <Box sx={{height: '100%'}}>
            <TableContainer sx={{overflow:'auto',height: '100%',
                    '&::-webkit-scrollbar': { width: 4,height:4, opacity: 0 },
                    '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
                <Table stickyHeader aria-label="customized table">
                    <TableHead sx={{position:'sticky', top: '0',zIndex: 10, backgroundColor: theme.palette.background.conponent}}>
                        
                        <TableRow>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>No.</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Product (EN)</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Product (VN)</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Quantity</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Type</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Date Time</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Note</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {idata.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell align="center" style={{padding: "6px",border: '1px solid #999' }}>{index + 1 || ''}</TableCell>
                            <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.Product_EN || ''}</TableCell>
                            <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.Product_VN || ''}</TableCell>
                            <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.Quantity || ''}</TableCell>
                            <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.TransactionsType}</TableCell>
                            <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.TransactionsTime.split(".")[0].replace('T',' ') || ''}</TableCell>
                            <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.Note || ''}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>

                
            
        </Box>
    )




}
export default memo(ListProductsUseInMonth) ;