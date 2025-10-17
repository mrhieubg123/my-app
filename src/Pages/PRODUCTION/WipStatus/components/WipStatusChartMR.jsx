import Highcharts, { Legend, color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useRef, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
// Khởi tạo module 3D

const ColumnChartMR = ({idata =[], onModelChange}) => {
    const theme = useTheme();
    const parentRef = useRef(null);
    const [parentSize, setParentSize] = useState({width: 0 , height:0});
    const handleInputChange = (ifeedertype, iName) =>{
        const newModel = {
          model: ifeedertype,
          station1: iName === 'Total Router' ? 'ROUTER': 'SMT_WIP' ,
        }
        onModelChange?.(newModel);
      };
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

  // Dữ liệu cấu hình cho biểu đồ
  const options = {
    chart: {
      type: "column", // Loại biểu đồ cột
      backgroundColor: "transparent",
      reflow: false,
      height: parentSize.height,
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: idata.length > 0 ?  idata.map(item => item.MODEL)  : ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
      labels: {
        style: {
          fontSize: "0.7rem",
          color: theme.palette.chart.color, // Màu chữ trên trục Y
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "",
      },
      labels: {
        style: {
          fontSize: "0.7rem",
          color: theme.palette.chart.color, // Màu chữ trên trục Y
        },
      },
    },
    plotOptions:{
      column:{
        stacking: 'normal'
      },
       
        series:{
          dataLabels:{
            enabled: true,
            color: theme.palette.chart.color,
            style: {
                textOutline: 'none',
                fontSize: '0.7rem'
            }
          },
            point:{
                events:{
                    click: function(){
                       handleInputChange(this.category, this.series.name);
                    }
                }
            }
        }
    },
    series: [{
        name: "Total input",
        data:  idata.length > 0 ?  idata.map(item => item.Total_inWIP)  : [ 1, 2, 3, 4, 5, 6],
        color: "#0057db",
        borderWidth:0,

    }],
    credits: {
        enabled: false,
      },
    exporting:{
      enabled: false,
    },
    legend:{
        align: 'left',
        verticalAlign: 'top',
      style: {
        color: theme.palette.chart.color, // Màu chữ trên trục Y
        
      },
      labels: {
          useSeriesColors: true,
      },
      itemStyle:{
        color: theme.palette.chart.color, // Màu chữ legend
      }
    }
  };

  const options2 = {
    chart: {
      type: "column", // Loại biểu đồ cột
      backgroundColor: "transparent",
      reflow: true,
      height: parentSize.height
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: idata.length > 0 ?  idata.map(item => item.MODEL)  : ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
      labels: {
        style: {
          fontSize: "0.7rem",
          color: theme.palette.chart.color, // Màu chữ trên trục Y
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "",
      },
      labels: {
        style: {
          fontSize: "0.7rem",
          color: theme.palette.chart.color, // Màu chữ trên trục Y
        },
      },
    },
    plotOptions:{
      column:{
        stacking: 'normal'
      },
      series:{
        dataLabels:{
          enabled: true,
          color: theme.palette.chart.color,
          style: {
              textOutline: 'none',
              fontSize: '0.7rem'
          }
        },
          point:{
              events:{
                  click: function(){
                      handleInputChange(this.category, this.series.name);
                  }
              }
          }
      }
    },
    series: [{
        name: "Total output",
        borderWidth:0,
        data:  idata.length > 0 ?  idata.map(item => item.Total_inROU)  : [ 1, 2, 3, 4, 5, 6],
        color: "#db320c"
    }],
    credits: {
        enabled: false,
      },
    exporting:{
      enabled: false,
    },
    legend:{
        align: 'left',
        verticalAlign: 'top',
      style: {
        color: theme.palette.chart.color, // Màu chữ trên trục Y
      },
      labels: {
          useSeriesColors: true,
      },
      itemStyle:{
        color: theme.palette.chart.color, // Màu chữ legend
      }
    }
  };

  return(
    idata.length > 0 ? 
    <Grid container columns={12} sx={{height: '100%', width: '100%', overflow: 'hidden', display:'flex', position:'relative'}}>
        <Grid lg={6} md={6} xs={6} sx={{height: '100%'}}>
            <div ref={parentRef} style={{height: "100%", width: '100%', display:"block"}}>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
        </Grid>
        <Grid lg={6} md={6} xs={6} sx={{height: '100%'}}>
            <div ref={parentRef} style={{height: "100%",width: '100%', display:"block"}}>
                <HighchartsReact highcharts={Highcharts} options={options2} />
            </div>
        </Grid>
       
    </Grid>
    :
    <Box sx={{height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Typography sx={{fontSize: '80px', fontWeight:'bold'}}>Null</Typography>
    </Box>
  ) 
};

export default ColumnChartMR;
