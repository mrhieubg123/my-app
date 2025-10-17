import React, { memo, useCallback, useMemo,useState } from 'react';
import { Box, Grid, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,Paper, TextField, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';


const DailyMoStatus = ({
    alarn,
    width = '100%',
    height = '100%',
    variant = 'default',
    idata = [],
    onModelChange,
  }) => {

    const theme = useTheme();
    const user = useSelector((state) => state.auth.login.currentUser);

    const [inputValue, setInputValue] = useState({});

    const handleInputChange = useCallback((id) =>{
        if(inputValue[id]){
         onModelChange?.({id, value:inputValue[id], user:user?.username })
        }
     },[inputValue, onModelChange]);
 
     const handleInputValueChange = (id, field ,value) =>{
         setInputValue((prev) => ({...prev, [id]: {...prev[id], [field]:value},user:user?.username}))
     }


    return (
        <Box sx={{height: '100%'}}>
            <TableContainer sx={{overflow:'auto',height: '100%',
                    '&::-webkit-scrollbar': { width: 4, opacity: 0 },
                    '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
                <Table stickyHeader  aria-label="customized table">
                    <TableHead sx={{position:'sticky', top: '0',zIndex: 1, backgroundColor:'#f6f7f5'}}>
                        <TableRow
                            sx={{ backgroundColor: theme.palette.background.conponent,
                                '& th':{
                                    backgroundColor: theme.palette.background.conponent,
                                borderBottom: '2px solid #999',
                                borderTop: '2px solid #999',
                                },
                                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                            }}
                         >
                            <TableCell rowSpan={2} style={{padding: "6px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">No.</TableCell>
                            <TableCell rowSpan={2} style={{padding: "6px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">Line</TableCell>
                            <TableCell rowSpan={2} style={{padding: "6px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">Model</TableCell>
                            <TableCell rowSpan={2} style={{padding: "6px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">P/N</TableCell>
                            <TableCell rowSpan={2} style={{padding: "6px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">Total MO</TableCell>

                            <TableCell rowSpan={2} style={{padding: "6px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">Material</TableCell>
                            <TableCell rowSpan={2} style={{padding: "6px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">Release Date</TableCell>

                            <TableCell rowSpan={2} style={{padding: "6px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">Online Date</TableCell>
                            <TableCell rowSpan={2} style={{padding: "6px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">Not Input</TableCell>

                            <TableCell colSpan={9} style={{padding: "6px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">WIP Status</TableCell>
                            <TableCell rowSpan={2} style={{padding: "3px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">Total Wip</TableCell>
                            <TableCell rowSpan={2} style={{padding: "3px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">Online Day</TableCell>
                            <TableCell colSpan={2} style={{padding: "3px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">Remark</TableCell>
                            <TableCell rowSpan={2} style={{padding: "3px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">Confirm</TableCell>

                        </TableRow>
                        <TableRow 
                            sx={{ backgroundColor: theme.palette.background.conponent,
                                '& th':{
                                    backgroundColor: theme.palette.background.conponent,
                                borderBottom: '2px solid #999',
                                borderTop: '2px solid #999',
                                },
                                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                            }}
                        >
                            <TableCell  style={{padding: "6px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">TURNPCB</TableCell>
                            <TableCell  style={{padding: "6px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">INSP</TableCell>
                            <TableCell  style={{padding: "6px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">ROUTER</TableCell>
                            <TableCell  style={{padding: "6px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">STOCKIN</TableCell>
                            <TableCell  style={{padding: "6px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">INSTOCKIN</TableCell>
                            <TableCell  style={{padding: "6px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">BC8M</TableCell>
                            <TableCell  style={{padding: "6px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">BC2M</TableCell>
                            <TableCell  style={{padding: "6px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">BC3F</TableCell>
                            <TableCell  style={{padding: "6px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">BCFA</TableCell>
                            <TableCell  style={{padding: "6px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">WIP Status</TableCell>
                            <TableCell  style={{padding: "6px", fontWeight: "bold", border: '1px solid #e0e0e0'}} align="center">SAP Status</TableCell>
                        </TableRow>
                        
                    </TableHead>
                    <TableBody>
                    {idata.map((row, index) => (
                        <TableRow key={index}
                            sx={{ 
                                '& td':{
                                    fontSize:'12px'
                                },
                            }}
                        >
                            <TableCell align="center" sx={{ padding: "6px 6px", color: '#000', border: '1px solid #e0e0e0'}}>{index + 1}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px", color: '#000', border: '1px solid #e0e0e0'}}>{row.LINE_NAME || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px", color: '#000', border: '1px solid #e0e0e0'}}>{row.MODEL_NAME || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px", color: '#000', border: '1px solid #e0e0e0'}}>{row.MO_NUMBER || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px", color: '#000', border: '1px solid #e0e0e0'}}>{row.TARGET_QTY || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px", color: '#000', border: '1px solid #e0e0e0'}}>{row.Material || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px", color: '#000', border: '1px solid #e0e0e0'}}>{row.DATE_TIME.replace('T', ' ').replace('.000Z', '') || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px", color: '#000', border: '1px solid #e0e0e0'}}>{row.TIMEOL.split('T')[0] || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px", color: '#000', border: '1px solid #e0e0e0'}}>{row.NOTINPUT_QTY || ''}</TableCell>

                            <TableCell align="center" sx={{ padding: "6px 6px", color: '#000', border: '1px solid #e0e0e0'}}>{row.TURNPCB || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px", color: '#000', border: '1px solid #e0e0e0'}}>{row.INSP || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px", color: '#000', border: '1px solid #e0e0e0'}}>{row.ROUTER || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px", color: '#000', border: '1px solid #e0e0e0'}}>{row.STOCKIN || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px", color: '#000', border: '1px solid #e0e0e0'}}>{row.INSTOCKIN || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px", color: '#000', border: '1px solid #e0e0e0'}}>{row.BC8M || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px", color: '#000', border: '1px solid #e0e0e0'}}>{row.BC2M || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px", color: '#000', border: '1px solid #e0e0e0'}}>{row.BC3F || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px", color: '#000', border: '1px solid #e0e0e0'}}>{row.BCFA || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px", color: '#000', border: '1px solid #e0e0e0'}}>{row.TARGET_QTY*1 - row.INSTOCKIN*1 - row.BC8M*1 - row.BC2M*1 - row.BC3F*1 - row.BCFA*1   || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px", color: '#000', border: '1px solid #e0e0e0'}}>{row.TIMEOL.split('T')[0] || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px", color: '#000', border: '1px solid #e0e0e0'}}>
                                {row.WIP_Status || 
                                <TextField 
                                    variant='outlined'
                                    size='small'
                                    type='text'
                                    color='#000'
                                    value={inputValue[row.MO_NUMBER]?.WIP || ''}
                                    onChange={(e) => handleInputValueChange(row.MO_NUMBER,'WIP', e.target.value)} 
                                    sx={{
                                        width:"100%", color: '#000',
                                        '& input':{textAlign:'center', padding:'8px',color: '#000'},
                                        '& .MuiOutlinedInput-root':{borderRadius:0,borderColor:"#00000000"}
                                    }}
                                />
                                }
                            </TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px", border: '1px solid #e0e0e0'}}> 
                                {row.SAP_Status || 
                                <TextField 
                                    variant='outlined'
                                    size='small'
                                    type='text'
                                    value={inputValue[row.MO_NUMBER]?.SAP || ''}
                                    onChange={(e) => handleInputValueChange(row.MO_NUMBER, 'SAP',e.target.value)} 
                                    sx={{
                                        width:"100%", color: '#000',
                                        '& input':{textAlign:'center', padding:'8px',color: '#000'},
                                        '& .MuiOutlinedInput-root':{borderRadius:0,borderColor:"#00000000"}
                                    }}
                                />
                                }
                            </TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px", border: '1px solid #e0e0e0'}}> 
                            {row.ID_Confirm || 
                           
                            
                            <Button onClick={() => handleInputChange(row.MO_NUMBER)}
                            sx={{
                                marginLeft:1, textTransform:'none'
                            }}
                            variant='contained'
                            size='small'
                                >
                                    Confirm
                            </Button>
                            
                            }
                                
                            </TableCell>

                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
        </Box>
    )




}
export default memo(DailyMoStatus) ;