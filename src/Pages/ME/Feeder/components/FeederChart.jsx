import Highcharts, { Legend, color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import { useTheme } from '@mui/material/styles';
// Khởi tạo module 3D

const ColumnChart = ({idata =[], onModelChange}) => {
    const theme = useTheme();
    const parentRef = useRef(null);
    const [parentSize, setParentSize] = useState({width: 0 , height:0});
    const handleInputChange = (idatef, iName) =>{
        const newModel = {
          dateTime: idatef,
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
      categories: idata.length > 0 ?  idata.map(item => item.DateT.split('T')[0])  : ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
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
        stacking: 'normal',
        // borderRadius: 5,
        dataLabels: { enabled: true, style: { fontSize: '0.6rem', color: theme.palette.chart.color } },
        borderWidth:0,
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
        name: "Total Lock",
        data:  idata.length > 0 ?  idata.map(item => item.TLock)  : [ 1, 2, 3, 4, 5, 6],
        stack: 'actual',
        color: "#f64ff2"
    },{
        name: "Total Repair",
        data: idata.length > 0 ?  idata.map(item => item.TRepair)  :  [ 1, 2, 3, 4, 5, 6],
        stack: 'actual',
        color: "#26a7ff"
    },{
      name: "ActualMain",
      data:  idata.length > 0 ?  idata.map(item => item.ActualMain)  : [ 1, 2, 3, 4, 5, 6],
      stack: 'budget',
      color: "#26c1a2"
  },{
      name: "ExistMain",
      data: idata.length > 0 ?  idata.map(item => item.ExistMain)  :  [ 1, 2, 3, 4, 5, 6],
      stack: 'budget',
      color: "#ff5733"
  }]  ,
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
    },

  };

  return(
    <div ref={parentRef} style={{height: "100%", display:"block"}}>
      <Button size="small" color='primary' variant='contained' sx={{position: 'absolute', top: 0, right: 0, zIndex: 2}}
        onClick={() => handleInputChange('', '')}
      >
        Reset
      </Button>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  ) 
};

export default ColumnChart;
