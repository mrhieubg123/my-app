import Highcharts, { Legend, color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useRef, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useTheme } from '@mui/material/styles';
// Khởi tạo module 3D

const ColumnChart = ({idata =[], onModelChange}) => {
    const theme = useTheme();
    const parentRef = useRef(null);
    const [parentSize, setParentSize] = useState({width: 0 , height:0});
    const handleInputChange = (idatef, iName) =>{
        const newModel = {
          dateTime: idatef,
          tyle: iName === 'Error (> 10day)' ? 'Error' : iName === 'Alarm (> 7day)' ? 'Alarm' : 'Good'  
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
      categories: idata.length > 0 ?  idata.map(item => item.DATE_TIME)  : ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
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
      name: "Error (> 10day)",
      data:  idata.length > 0 ?  idata.map(item => item.Error)  : [ 1, 2, 3, 4, 5, 6],
      stack: 'actual',
      borderWidth:0,
      color: "#ff4d4d"
  },{
        name: "Alarm (> 7day)",
        data: idata.length > 0 ?  idata.map(item => item.ALarm)  :  [ 1, 2, 3, 4, 5, 6],
        stack: 'actual',
        borderWidth:0,
        color: "#ffc04d"
    },{
      name: "Good (< 7day)",
      data:  idata.length > 0 ?  idata.map(item => item.Good)  : [ 1, 2, 3, 4, 5, 6],
      stack: 'actual',
      borderWidth:0,
      color: "#26c1a2"
  }]  ,
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
      {/* <Button size="small" color='primary' variant='contained' sx={{position: 'absolute', top: 0, right: 0, zIndex: 2}}
        onClick={() => handleInputChange('', '')}
      >
        Reset
      </Button> */}


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

export default ColumnChart;
