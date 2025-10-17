import React, { useCallback, useMemo,useState } from 'react';
import { Box, Grid, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,Paper, Button, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';

const ESDStatusDetail = ({
    alarn,
    width = '100%',
    height = '100%',
    variant = 'default',
    dataFilter =[],
    data = [],
    onModelChange,
  }) => {

    const theme = useTheme();
    const user = useSelector((state) => state.auth.login.currentUser);


    const [inputValue, setInputValue] = useState({});

    const dataFil = useMemo(() => data.filter(item => dataFilter.includes(item.NAME_ESD))) ;

    const handleInputChange = useCallback((id) =>{
       if(inputValue[id]){
        onModelChange?.({id, value:inputValue[id], user:user?.username })
       }
    },[inputValue, onModelChange]);

    const handleInputValueChange = (id, value) =>{
        setInputValue((prev) => ({...prev, [id]:value,user:user?.username}))
    }

    return (
        <Box sx={{height:"100%"}}>
            <TableContainer sx={{height:"100%" , overflow:'auto',
                    '&::-webkit-scrollbar': { width: 0, opacity: 0 },
                    '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
                <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
                    <TableHead sx={{position:'sticky', top: '0', backgroundColor: "#f6f7f5"}}>
                        <TableRow>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color:'#000'}} align="center">Name</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color:'#000'}} align="center">Date</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color:'#000'}} align="center">Time</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color:'#000'}} align="center">Status</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color:'#000'}} align="center">Confirm</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color:'#000'}} align="center">ID_Confirm</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {dataFil.map((row, index) => (
                        <TableRow key={index} >
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px",cursor:"pointer",color:'#000' }} >{row.NAME_ESD || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px",cursor:"pointer",color:'#000'}} >{row.DATE_S.split('T')[0] || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px",cursor:"pointer",color:'#000'}} >{row.TIME_S.split('T')[1].replace('.000Z','') || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px",cursor:"pointer",color:'#000'}} >{row.STATUS_ESD || ''}</TableCell>
                            {row.STATUS_ESD === 'ON' ? 
                                <TableCell colSpan={2}></TableCell>
                            : 
                            row.Confirm === null ?
                                <><TableCell colSpan={2} align="center" sx={{padding:0}}> 
                                <Box sx={{display:'flex', alignItems:'center',width:'100%'}}>
                                <TextField 
                                    variant='outlined'
                                    size='small'
                                    type='text'
                                    value={inputValue[row.ID] || ''}
                                    onChange={(e) => handleInputValueChange(row.ID, e.target.value)} 
                                    sx={{
                                        width:"100%",
                                        '& input':{textAlign:'center', padding:'8px'},
                                        '& .MuiOutlinedInput-root':{borderRadius:0,borderColor:"#00000000"}
                                    }}
                                    />
                                    <Button onClick={() => handleInputChange(row.ID)}
                                        sx={{
                                            marginLeft:1, textTransform:'none'
                                        }}
                                        variant='contained'
                                        size='small'
                                    >
                                        Confirm
                                    </Button>
                                </Box>
                                    
                                </TableCell></>
                                :
                                <>
                                <TableCell align="center" sx={{ padding: "3px 6px",cursor:"pointer",color:'#000'}} >{row.Confirm || ''}</TableCell>
                                <TableCell align="center" sx={{ padding: "3px 6px",cursor:"pointer",color:'#000'}} >{row.ID_Confirm || ''}</TableCell>
                                </>
                            }
                           
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
        </Box>
    )
}
export default ESDStatusDetail;