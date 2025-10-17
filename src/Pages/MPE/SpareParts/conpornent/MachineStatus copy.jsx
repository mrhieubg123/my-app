import React, { useMemo,useState,useRef } from 'react';
import { Box,Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, LinearProgress, ListItemText, Button, Grid, Grid2 } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import HiHoverReveal from '../../../../components/HiHoverReveal';
import { AddOutlined, EditOutlined } from '@mui/icons-material';

const TableMachineStatus = ({
    idata = [],
    onModelChange,
    onModelChange2,
    onModelChangeEdit
  }) => {
    const theme = useTheme();
    const timeoutRef = useRef(null);
    const intervalRef = useRef(null);
    const [selectedCells, setSelectedCells] = useState(new Map());
    const [selectedRows, setSelectedRows] = useState(new Set());
    const columnsxx = ['','H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8',"H9",'H10']
    const [progress, setProgress] = useState(0);
    const columns = idata.length > 0 ? Object.keys(idata[0]).map((keycol) => keycol.replace('LINE','')) : columnsxx

    const filterColumn = columns.filter(key => !['Project', 'Line'].includes(key));

    const handleCellClick = (row,col, station) =>{
        const cellValue = `${columns[col]}`;
        const rowValue = `${idata[row].Line}`;
        const rowValue2 = `${idata[row].Project}`;
        const newModel =
        {
            project: rowValue2,
            line: rowValue ,
            machine: station.split('-sta-')[0].split('//')[0],
            machineName: station.split('-sta-')[0].split('//')[1],
            location: cellValue.replace('H', ''),
            machineCode:"",
        }
        onModelChange?.(newModel)
    }

    const handleCellClickEdit = (row,col, station) =>{
        const cellValue = `${columns[col]}`;
        const rowValue = `${idata[row].Line}`;
        const rowValue2 = `${idata[row].Project}`;
        const newModel =
        {
            project: rowValue2,
            line: rowValue ,
            machine: station.split('-sta-')[0].split('//')[0],
            machineName: station.split('-sta-')[0].split('//')[1],
            location: cellValue.replace('H', ''),
            machineCode:"",
        }
        console.log(newModel);
        onModelChangeEdit?.(newModel)
    }


    const handleCellClick2 = (row,col, station, code) =>{  
        const cellValue = `${columns[col]}`;
        const rowValue = `${idata[row].Line}`;
        const rowValue2 = `${idata[row].Project}`;
        const newModel =
        {
            project: rowValue2,
            line: rowValue ,
            machine: station.split('-sta-')[0].split('//')[0],
            machineName: station.split('-sta-')[0].split('//')[1],
            location: cellValue.replace('H', ''),
            machineCode: code
        }
        onModelChange2?.(newModel);
        
    }
    const colorMap = useMemo(() => ({
            RUN: '#00e396',
            OFF: '#ffe636',
            ERROR: '#ff3110',
            NA: '#808080',
        }),[])

    const renderStatusCell = (val) => {
        const lVal = val && val?.split('-sta-')[1].split('/-/').map(item => item.split('//')[1]);
        const minVal = lVal.length > 0 ? lVal.reduce((min, num) => num*1 < min*1 ? num : min) : 0 ;
        const status = minVal && minVal <= 0 ? 'ERROR' : minVal <= 5*24 ? 'OFF' : 'RUN'
        const color = colorMap[status?.split('-')[0]] || '';
        return(
            <Box sx={{width: '100%', height: '100%', display: 'flex', justifyContent:'center', alignItems: 'center', zIndex:1}}>
                <Box 
                    className={status?.split('-')[0] === 'ERROR' ? 'blinking': '' }
                    sx={{                       
                        backgroundColor: color,
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%',
                        margin: '6px auto'
                        }}
                    >
                </Box>
            </Box>         
        )
    }

    const renderStatusCell2 = (val) => {
        const status = val && val <= 0 ? 'ERROR' : val <= 5*24 ? 'OFF' : 'RUN'
        const color = colorMap[status?.split('-')[0]] || '';
        return(
            <Box sx={{width: '100%', height: '100%', display: 'flex', justifyContent:'center', alignItems: 'center', zIndex:1}}>
                <Box 
                    className={status?.split('-')[0] === 'ERROR' ? 'blinking': '' }
                    sx={{                       
                        backgroundColor: color,
                        width: '16px', 
                        height: '16px', 
                        borderRadius: '50%',
                        margin: 'auto'
                        }}
                    >
                </Box>
            </Box>         
        )
    }
    

    return (idata.length > 0 ?
            <Box  sx={{position: 'relative', height: "100%"}}>
                <TableContainer sx={{overflow:'auto', height: "100%",
                        '&::-webkit-scrollbar': { width: 4,height: 6, opacity: 0 },
                        '&:hover::-webkit-scrollbar': { width: 4,height: 6, opacity: 1 },
                        '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
                    <Table sx={{ borderSpacing: "0 8px" , height: "100%" }} aria-label="customized table">
                        <TableHead sx={{position:'sticky', top: '0',backgroundColor: theme.palette.background.conponent, zIndex: '10'}}>
                        <TableRow>
                            <TableCell key={'Project'} style={{padding:'6px', textAlign:'center',fontWeight: "bold"}}>Project</TableCell>
                            <TableCell key={'Line'} style={{padding:'6px', textAlign:'center',fontWeight: "bold"}}>Line</TableCell>
                            {idata.length > 0 && Object.keys(idata[0]).map((keycol) =>(
                                keycol !== 'Line' && keycol !== 'Project' ? 
                                <TableCell key={keycol} style={{padding:'6px', textAlign:'center',fontWeight: "bold"}}>{keycol}</TableCell>:''
                            ))}
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {idata.length > 0 &&  idata.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                {Object.keys(row).map((key,cellIndex)=>{
                                    const cellKey = `${rowIndex}-${cellIndex}`;
                                    const isSelected = selectedCells.has(cellKey);
                                    return (
                                    <TableCell  key={cellIndex} style={{paddingLeft:'6px',paddingRight:'6px',paddingTop: 'unset', paddingBottom: 'unset', whiteSpace: 'nowrap', textAlign:'center' , background: isSelected ? key !== 'Line' ? '#219af144' : '#219af1' : '' , cursor: 'pointer'}}>
                                        {key !== 'Line' && key !== 'Project' ? 
                                            row[key] !== null &&
                                                <HiHoverReveal  rowIndex={rowIndex} cellIndex={cellIndex}
                                                    trigger={
                                                        <Box component={'div'} >{renderStatusCell(row[key])}</Box>
                                                    }>
                                                        <Box component={'div'} sx={{marginTop: '8px'}}>
                                                            <Box sx={{position: 'absolute', top: 0, right: 0}}>
                                                                <Button title='Edit' onClick={() => handleCellClickEdit(rowIndex, cellIndex, row[key])} sx={{ minWidth:'unset', backgroundColor:'#9994'}} size='small' ><EditOutlined sx={{fontSize: '0.8rem'}}></EditOutlined></Button>
                                                                <Button title='Add' onClick={() => handleCellClick(rowIndex, cellIndex, row[key])} sx={{ minWidth:'unset', backgroundColor:'#9994'}} size='small' ><AddOutlined sx={{fontSize: '0.8rem'}}></AddOutlined></Button>
                                                            </Box>
                                                            
                                                            <ListItemText 
                                                                primary={row[key]?.split('-sta-')[0].replace('//',' || ')} 
                                                                secondary={
                                                                    <Grid container columns={12} component={'div'} sx={{display: 'flex', justifyContent:'center', alignItems: 'center' , minWidth: '210px'}}>
                                                                        {row[key]?.split('-sta-')[1].split('/-/').map(item => (
                                                                            <Grid lg={4} md={4} xs={4} conponent={'a'} onClick={() => handleCellClick2(rowIndex, cellIndex, row[key],item?.split('//')[0])} sx={{display:'flex',flexDirection: 'column', justifyContent:'center', alignItems: 'center', padding:'0px 6px'}}>
                                                                                <Typography sx={{fontSize: '11px', whiteSpace:'nowrap', maxWidth: '70px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item?.split('//')[0]}</Typography> 
                                                                                {renderStatusCell2(item?.split('//')[1])}
                                                                            </Grid>
                                                                        ))}
                                                                    </Grid>
                                                                } 
                                                                primaryTypographyProps={{fontSize: '12px', whiteSpace:'nowrap', fontWeight:'bold'}}
                                                                secondaryTypographyProps={{fontSize: '11px', whiteSpace:'nowrap'}}
                                                            />
                                                        </Box>
                                                </HiHoverReveal>  
                                                : row[key] }
                                    </TableCell>
                                    )
                                }
                                )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
            </Box> 
            :
            <Box sx={{width:'100%', height: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                <Typography>Null</Typography>
            </Box> 
    )
}
export default React.memo(TableMachineStatus);