import Highcharts, { Legend, color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card,IconButton, CardContent,Switch, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Box  } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from '@mui/material/styles';


const HiPieChart = ({idata=[], label1 = 'Error'}) =>{
    const theme = useTheme();
    const parentRef = useRef(null);
    const [parentSize, setParentSize] = useState({width: 0 , height:0});
  
    const colors = [
        "#00AEEF", "#7D3C98", "#E91E63", "#F39C12", "#2ECC71",
        "#1F77B4", "#FF7F0E", "#2CA02C", "#D62728", "#9467BD",
        "#8C564B", "#E377C2", "#7F7F7F", "#BCBD22", "#17BECF",
        "#AEC7E8", "#FFBB78", "#98DF8A", "#FF9896", "#C5B0D5",
        "#C49C94", "#F7B6D2", "#C7C7C7", "#DBDB8D", "#9EDAE5",
        "#393B79", "#637939", "#8C6D31", "#843C39", "#7B4173",
        "#5254A3", "#6B6ECF", "#637939", "#E7BA52", "#D6616B",
        "#CE6DBD", "#7B4173", "#393B79", "#8C6D31", "#843C39",
        "#7B4173", "#5254A3", "#6B6ECF", "#637939", "#E7BA52",
        "#D6616B", "#CE6DBD", "#7B4173", "#1F77B4", "#FF7F0E",
        "#2CA02C", "#D62728", "#9467BD", "#8C564B", "#E377C2"
      ];

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

    const resultData = Object.values(idata).sort((a,b) => b.y - a.y );

    const fometData = resultData.map((item, index) =>({
        ...item,
        color: colors[index % colors.length],
    }))

    const options = {
        chart: {
          type: "pie", // Loại biểu đồ cột
          backgroundColor: "transparent",
          reflow: true,
          height: parentSize.height
        },
        title: {
          text: "",
        },
        plotOptions:{
            pie:{
                dataLabels: {
                    enabled: false,
                },
                borderRadius: 5
            }
        },
        series:[{
            name: 'Total',
            data:fometData
        }],
        credits: {
            enabled: false,
          },
        exporting:{
          enabled: false,
        },
        
      };
    
      return(
        <div ref={parentRef} style={{height: "100%", display:"block"}}>
            <Card  sx={{height:"100%",padding: 'unset'}} >
                <CardContent sx={{height:"100%",padding: 'unset !important'}}>
                <Grid container  sx={{height:"100%"}}>
                    <Grid item lg={6} md={6} xs={6}>
                        <HighchartsReact highcharts={Highcharts} options={options} />
                    </Grid>
                    <Grid item lg={6} md={6} xs={6} sx={{height:'100%'}}>
                    <TableContainer component={Paper} sx={{height:'100%', overflow:'auto',
                            '&::-webkit-scrollbar': { width: 0, opacity: 0 },
                            '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
                        <Table size="small" >
                            <TableHead style={{position:'sticky', top:0, backgroundColor: theme.palette.primary.main}}>
                                <TableRow key='12' sx={{color:'#fff'}} >
                                    <TableCell align="center">{label1}</TableCell>
                                    <TableCell align="center">Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {fometData.map((item) => (
                                <TableRow key={item.name}>
                                    <TableCell sx={{ cursor: 'pointer'}}>
                                        <span style={{ color: item.color, marginRight:6}}>⬤</span>
                                        {item.name}
                                    </TableCell>
                                    <TableCell align="center">{item.y }</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
                </CardContent>
            </Card>
        </div>
      ) 


}


export default HiPieChart;