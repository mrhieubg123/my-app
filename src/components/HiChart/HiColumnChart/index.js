import Highcharts, { Legend, color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { useTheme } from '@mui/material/styles';
// Khởi tạo module 3D

const HiColumnChart = ({idata =[]}) => {
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
      categories:idata.map(item => item.name) || ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
      title: {
        text: "Error name",
      },
      labels: {
        style: {
          fontSize: "0.8rem",
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
          fontSize: "0.8rem",
          color: theme.palette.chart.color, // Màu chữ trên trục Y
        },
      },
    },
    series: [{
        name: "Total",
        data:  idata.map(item => item.y) || [ 1, 2, 3, 4, 5, 6],
        color: "#ff5733"
    }]  ,
    credits: {
        enabled: false,
      },
    exporting:{
      enabled: false,
    },
    legend:{
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
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  ) 
};

export default HiColumnChart;
