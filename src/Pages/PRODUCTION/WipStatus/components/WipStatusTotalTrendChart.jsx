import Highcharts, { Legend, color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useRef, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useTheme } from '@mui/material/styles';


const WipStatusTotalTrendChart = ({idata =[], onModelChange}) => {
    const theme = useTheme();
    const parentRef = useRef(null);
    const [parentSize, setParentSize] = useState({width: 0 , height:0});
    const handleInputChange = (idatef, iName) =>{
        const newModel = {
          dateTime: idatef,
          // tyle: iName === 'Error (> 10day)' ? 'Error' : iName === 'Alarm (> 7day)' ? 'Alarm' : 'Good'  
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
      reflow: true,
      height: parentSize.height
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: idata.map(item => item.DateT) ,
      labels: {
        style: {
          fontSize: "0.65rem",
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
          fontSize: "0.65rem",
          color: theme.palette.chart.color, // Màu chữ trên trục Y
        },
      },
    },
    plotOptions:{
      column:{
        stacking: 'normal',
        dataLabels:{
          enabled: true
        }
      },
       
        series:{
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
      name: 'input',
      type: 'column',
      borderWidth:0,
      data: idata.map(item => item.SMT_WIP*1),
      stack: 'input',
      color: "#0057db",
    },{
      name: 'output',
      type: 'column',
      borderWidth:0,
      data: idata.map(item => item.ROUTER*1),
      stack: 'output',
      color: "#db320c",
  
    },{
      name: 'Total',
      type: 'spline',
      data: idata.map(item => item.SoLuongConLai*1),
      color: "#00e396",
      dataLabels:{
        color: '#00e396',
      },
      market:{
        lineWidth:2,
        lineColor: '#000',
        fillColor: 'white'
      },
      yAxis:0
    }],
    credits: {
        enabled: false,
      },
    exporting:{
      enabled: false,
    },
    legend:{
        align: 'right',
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
    <div ref={parentRef} style={{height: "100%", display:"block"}}>
      {idata.length > 0 ? 
        <HighchartsReact highcharts={Highcharts} options={options} />
        :
        <Box sx={{width:'100%', height: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
          <CircularProgress ></CircularProgress>
        </Box>  
      }

      
    </div>
  ) 
};

export default WipStatusTotalTrendChart;
