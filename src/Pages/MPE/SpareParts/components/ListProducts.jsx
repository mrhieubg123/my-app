import React, { memo, useMemo9,useState } from 'react';
import { Box, Grid, Typography, TableContainer, Dialog, DialogActions, DialogContent, DialogTitle,TextField, Table, TableHead, TableRow, TableCell, TableBody,Paper, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DeleteOutline, DetailsOutlined, DetailsSharp, EditOutlined } from '@mui/icons-material';

import { useSelector, useDispatch } from 'react-redux';
import { getAuthorizedAxiosIntance } from '../../../../utils/axiosConfig';
const axiosInstance = await getAuthorizedAxiosIntance();


function getLocalDate() {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset*60000);
    return localDate.toISOString().slice(0, 19);
}


const ListProducts = ({
    alarn,
    width = '100%',
    height = '100%',
    variant = 'default',
    idata = {},
    onModelChange,
    onModelChange2,
    onModelChange3,
    onModelChange4,
    onModelChangeEdit
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
    }

    const handleDetailsAll = (val) => {
        const model = val &&  val[0];
        const newModel = {
            project: model.Project,
            line: model.Line,
            machine: model.Machine,
            machineName: model.MachineName,
            location: model.Location,
            machineCode: model.MachineCode,
            
        }
        onModelChange4?.(newModel)
    }

    const handleEdit = (val) => {
        const model = val &&  val[0];
        const newModel = {
            project: model.Project,
            line: model.Line,
            machine: model.Machine,
            machineName: model.MachineName,
            location: model.Location,
            machineCode: model.MachineCode,
        }
        console.log(newModel)
        onModelChangeEdit?.(newModel)
    }

    return (
        <Box sx={{height: '100%'}}>
            <TableContainer sx={{overflow:'auto',height: '100%',
                    '&::-webkit-scrollbar': { width: 4,height:4, opacity: 0 },
                    '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
                <Table stickyHeader aria-label="customized table">
                    <TableHead sx={{position:'sticky', top: '0',zIndex: 10, backgroundColor: theme.palette.background.conponent}}>
                        <TableRow >
                            <TableCell colSpan={100} align="center" component="th" scope="row" sx={{ padding: "10px", border: '1px solid #999', fontSize: '1.1rem', fontWeight: 'bold', zIndex:'10',position:'relative'}}>
                                <Box sx={{width:'100%', display: 'flex', justifyContent:'center', alignItems:'center', position:'relative'}}>
                                    <Typography component={'a'} sx={{fontSize: '1.1rem', fontWeight: 'bold'}}>
                                         Machine Code: 
                                    </Typography>
                                   
                                    <Button size='small' 
                                    variant="text" 
                                    color='secondary' 
                                    sx={{fontSize: '1.1rem', fontWeight: 'bold', minWidth:'unset', marginLeft: '6px', padding: 'unset'}} 
                                    onClick={() => handleDetailsAll(idata)}
                                    >
                                        {idata.map(item => item.MachineCode)[0] || 'N/a'}
                                    </Button>
                                    <Box sx={{position: 'absolute', top: 0, right: 0}}>
                                        <Button title='Delete' 
                                            onClick={() => handleDeleteAll(idata)} 
                                            sx={{ minWidth:'unset', backgroundColor:'#9994'}} size='small' >
                                            <DeleteOutline color='error' sx={{fontSize: '0.8rem'}}/>
                                        </Button>
                                        <Button title='Edit' 
                                            onClick={() => handleEdit(idata)} 
                                            sx={{ minWidth:'unset', backgroundColor:'#9994'}} size='small' >
                                            <EditOutlined sx={{fontSize: '0.8rem'}}></EditOutlined>
                                        </Button>
                                    </Box>
                                   

                                </Box>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>No.</TableCell>
                            {/* <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Project</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Line</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Machine</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Machine Name</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Machine Code</TableCell> */}
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Product (EN)</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Product (VN)</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Last Time</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Next Time</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Comment</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Emp</TableCell>


                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Confirm</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Detail</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Delete</TableCell>


                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {idata.map((row, index) => (
                        <TableRow key={index} sx={{backgroundColor: row.DateDiff*1 > 0 ? row.DateDiff*1 > 5*60*24 ? '' : '#e6ff005c' : '#f459'}}>
                            <TableCell align="center" style={{padding: "6px",border: '1px solid #999' }}>{index + 1 || ''}</TableCell>
                            {/* <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.Project || ''}</TableCell>
                            <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.Line || ''}</TableCell>
                            <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.Machine || ''}</TableCell>
                            <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.MachineName || ''}</TableCell>
                            <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.MachineCode || ''}</TableCell> */}
                            <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.Product_en || ''}</TableCell>
                            <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.Product_vn || ''}</TableCell>
                            <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.Time_Start.split(".")[0].replace('T',' ') || ''}</TableCell>
                            <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.Time_End && row.Time_End.split(".")[0].replace('T',' ')}</TableCell>
                            <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.Comment || ''}</TableCell>
                            <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.ID_Confirm || ''}</TableCell>
                            {/* <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.DateDiff || ''}</TableCell> */}

                            <TableCell align="center" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>
                                <Button size='small'
                                 variant="contained" 
                                 sx={{fontSize: '12px'}} 
                                 onClick={() => handleConfirm(row)}
                                >
                                    Confirm
                                </Button>
                            </TableCell>
                            <TableCell align="center"  scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>
                                <Button size='small'
                                 variant="outlined" 
                                 color='secondary'
                                 sx={{fontSize: '12px', padding: '2px', minWidth:'unset'}} 
                                 onClick={() => handleDetails(row)}
                                >
                                    <DetailsOutlined/>
                                </Button>
                            </TableCell>
                            <TableCell align="center"  scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer",position:'unset'  }}>
                                <Button size='small' 
                                variant="outlined" 
                                color='error' 
                                sx={{fontSize: '12px', padding: '2px', minWidth:'unset'}} 
                                onClick={() => handleDelete(row)}
                                >
                                    <DeleteOutline ></DeleteOutline>
                                </Button>
                            </TableCell>

                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>

                
            
        </Box>
    )




}
export default memo(ListProducts) ;