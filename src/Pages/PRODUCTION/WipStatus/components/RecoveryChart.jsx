import Highcharts, { Legend, color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from '@mui/material/styles';
import { Box,  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, LinearProgress, Typography } from '@mui/material';

// Khởi tạo module 3D

const RecoveryChart = ({
  idata =[],
  onChangeInput
}) => {
    const theme = useTheme();
    const parentRef = useRef(null);
    const [parentSize, setParentSize] = useState({width: 0 , height:0});

  // const FullModel = [ "G160-00795-00","5C0303F00-633-G", "G160-00756-00","G160-00813-00", "sad"]

  const FullModel = idata.map(item => item.MODEL);


  // dam bao du model

  const CompleteData = FullModel.map(model => {
    return idata.find(item => item.MODEL === model) || {MODEL : model, "<36" : "", ">=36" : ""}
  })

  const progressPercent = (col, value) => {
    const filterData =  idata.filter(item => item[`${col}`] !== null) || false ;
    const maxData =  filterData ? filterData.reduce((max, item) => (item[`${col}`] > max[`${col}`] ? item : max ), filterData[0])  : false;
    return maxData ? maxData[`${col}`]*1 === 0 ? 0 : ((value*1 || 0) / maxData[`${col}`]*1) * 100 :  -10;
  }


    const handleInputChange = (iserialName , icategories) =>{
      const newModel = {
        model: iserialName,
        timediff: icategories,
        cartsn:''
      }
      onChangeInput?.(newModel)
    }


    useEffect (() => {
      const updateSize = () =>{
        if( parentRef.current ){
          const {width, height} = parentRef.current.getBoundingClientRect();
          setParentSize({width, height});
        }
      };
  
      const resizeObserver = new ResizeObserver(updateSize);
      if(parentRef.current){
        resizeObserver.observe(parentRef.current);
      }
  
      return () =>{
        if( parentRef.current){
          resizeObserver.unobserve(parentRef.current);
        }
      };
    },[]);

    const Total = idata.reduce((acc, item) => acc + item[`>=36`]*1 + item["<36"]*1, 0 );

  return(
    <div ref={parentRef} style={{height: "100%", display:"block"}}>
    <Box sx={{ height: '100%'}}>
      <TableContainer sx={{overflow:'auto', height: '100%',
                '&::-webkit-scrollbar': { width: 0, opacity: 0 },
                '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
            <Table sx={{ borderSpacing: "0 8px", height: '100%',}} aria-label="customized table">
                <TableHead sx={{position:'sticky', top: '0', backgroundColor: theme.palette.background.conponent, zIndex:'10'}}>
                    <TableRow>
                        <TableCell style={{ fontWeight: "bold" , whiteSpace: "nowrap"}} align="center">MODEL NAME</TableCell>
                        <TableCell style={{ fontWeight: "bold" , whiteSpace: "nowrap"}} align="center"> &#60; 36 (h) </TableCell>
                        <TableCell style={{ fontWeight: "bold" , whiteSpace: "nowrap"}} align="center"> &#8805; 36 (h) </TableCell>
                        <TableCell style={{ fontWeight: "bold" , whiteSpace: "nowrap"}} align="center"> Percentage</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                {CompleteData.length > 0 ? CompleteData.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell align="left" style={{fontSize: '0.95rem',padding:'10px'}} >{row["MODEL"] || ''}</TableCell>
                        <TableCell align="left" sx={{padding :"unset !important", paddingTop: '3px !important', paddingBottom: '3px !important', position:'relative', cursor: 'pointer'}}
                          onClick={() => row[`<36`]*1 > 0 ? handleInputChange(row["MODEL"], `<36`): ''}
                        >
                          <LinearProgress 
                            color="secondary" 
                            variant='determinate' 
                            value={progressPercent("<36", row["<36"])}
                            sx={{
                              height:"70%", 
                              borderRadius:'5px',
                              backgroundColor:"#99999953",
                              '& .MuiLinearProgress-bar':{
                                background:'linear-gradient(45deg,#59e0c5,#009376)'
                              } 
                              }}
                            />
                          <Typography
                            variant="body2"
                            sx={{
                              position: 'absolute',
                              
                              top: '50%',
                              left : '50%',
                              transform: 'translate(-50%, -50%)',
                              color: theme.palette.chart.color,
                              fontWeight: "bold"
                            }}
                          >
                            {row["<36"] || ''}
                          </Typography>
                        </TableCell>
                        <TableCell align="left" sx={{padding :"unset !important", paddingTop: '3px !important', paddingBottom: '3px !important' , position:'relative' , cursor: 'pointer'}}
                          onClick={() => row[`>=36`]*1 > 0 ? handleInputChange(row["MODEL"], `>=36`): ''}
                        >
                          <LinearProgress 
                            variant='determinate' 
                            value={progressPercent(">=36", row[">=36"])}
                            sx={{height:"70%",
                            borderRadius:'5px',
                              backgroundColor:"#99999953",
                              '& .MuiLinearProgress-bar' : {
                                background:'linear-gradient(45deg,#f38181,#ff0000)'
                              }
                             }}/>
                          <Typography
                            variant="body2"
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left : '50%',
                              transform: 'translate(-50%, -50%)',
                              color: theme.palette.chart.color,
                              fontWeight: "bold",
                            }}
                          >
                           {row[`>=36`] || ''}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{padding :"unset !important",fontWeight: 'bold',color: '#00a1ff', paddingTop: '3px !important', paddingBottom: '3px !important' , position:'relative' , cursor: 'pointer'}}>
                          {((row["<36"]*1 + row[`>=36`]*1)*100 / Total).toFixed(2) +' % '|| ''}
                        </TableCell>
                        
                       
                    </TableRow>
                )) : ''}
                </TableBody>
            </Table>
            </TableContainer>
    </Box>
    </div>
  ) 
};

export default RecoveryChart;
