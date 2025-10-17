import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Highcharts3D from "highcharts/highcharts-3d";
import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { useTheme } from '@mui/material/styles';
// Khởi tạo module 3D
Highcharts3D(Highcharts);




const HiDonut3DChart = ({idata}) => {
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




  const options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      options3d: {
        enabled: true,
        alpha: 55, // Góc nghiêng 3D
        beta: 0, // Góc xoay
      },
      reflow: true,
      height: parentSize.height
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
    },
    plotOptions: {
      pie: {
        innerSize: 120, // Độ rộng của lỗ trong donut
        depth: 45, // Chiều sâu 3D
        dataLabels: {
          enabled: true,
          format: "{point.name}: {point.y}", // Hiển thị tên và số liệu trên biểu đồ
        },
      },
    },
   
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)", // Tooltip kèm % phần trăm
    },
    series: [
      {
        name: "Medals",
        data: idata !== null ? idata : [
          { name: "Norway", y: 16, color: "#FF0000" }, // Màu đỏ
          { name: "Germany", y: 12, color: "#099000" }, // Màu đen
          { name: "USA", y: 8, color: "#0000FF" }, // Màu xanh
          { name: "Sweden", y: 8, color: "#FFFF00" }, // Màu vàng
          { name: "Netherlands", y: 8, color: "#FF8000" }, // Màu cam
          { name: "ROC", y: 6, color: "#00FF00" }, // Màu xanh lá
          { name: "Austria", y: 7, color: "#800080" }, // Màu tím
          { name: "Canada", y: 4, color: "#FF3333" }, // Màu đỏ nhạt
          { name: "Japan", y: 3, color: "#FFD700" }, // Màu vàng kim
        ] ,
      },
    ],
    exporting:{
      enabled: false,
    },
    credits: {
      enabled: false,
    },
  };

  return(
    <div ref={parentRef} style={{height: "100%", display:"block"}}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  ) 
};

export default HiDonut3DChart;
