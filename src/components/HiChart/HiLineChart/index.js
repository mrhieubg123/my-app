import Highcharts, { Legend, color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, Typography, Paper } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { Label } from "@mui/icons-material";
import Highcharts3D from "highcharts/highcharts-3d";
import React, { useEffect, useRef, useState } from "react";
// Khởi tạo module 3D

const HiLineChart = ({
    title = '', 
    data = ''
  }
) => {

    const theme = useTheme();
    const parentRef = useRef(null);
    const [parentSize, setParentSize] = useState({width: 0 , height:0});
  
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

  // Cấu hình biểu đồ đường
  const options = {
    chart: {
        backgroundColor: '#ffffff00',
        //reflow: true,
        type: "line", // Loại biểu đồ đường
        height: parentSize.height
    },
    title: {
      text: title,
    },
    xAxis: {
      categories: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5"],
      labels:{
        style:{
            fontSize: '0.5vw',
            color: theme.palette.chart.color
        }
      }
    },
    yAxis: {
      title: {
        text: "Doanh thu (triệu VND)",
        color: theme.palette.chart.color
      },
      labels:{
        style:{
            fontSize: '0.5vw',
            color: theme.palette.chart.color
        }
      } 
    },
    series: [
      {
        name: "Năm 2023",
        data: [120, 150, 180, 200, 250],
        color: "#1976d2", // Màu đường
      },
      {
        name: "Năm 2024",
        data: [130, 160, 190, 220, 270],
        color: "#ff5722", // Màu đường khác
      },
    ],
    credits: {
      enabled: false, // Tắt logo Highcharts ở góc
    },
    exporting:{
      enabled: false,
    },
    legend:{
       align: 'left',
       verticalAlign: 'top',
     }
  };

  return(
    <div ref={parentRef} style={{height: "100%", display:"block"}}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  ) 
};

export default HiLineChart;
