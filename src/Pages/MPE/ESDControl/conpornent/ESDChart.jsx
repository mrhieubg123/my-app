import React, { useEffect, useRef, useState } from "react";
import Highcharts, { color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";
import { useTheme } from '@mui/material/styles';

const ESDChart = ({ title = "", data = [], categories = [], onModelChange }) => {
  const theme = useTheme();
  const parentRef = useRef(null);
  const [parentSize, setParentSize] = useState({width: 0 , height:0});
  const handleInputChange = (idate) =>{
    const newModel = {
        line: "",
        lane: "",
        station: "",
        dateFrom: `${idate} 00:00:00`,
        dateTo: `${idate} 23:59:59`,
        department: "",
        name: "",
    };
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



  // Định nghĩa màu gradient tĩnh
  const gradient2023 = {
    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
    stops: [
      [0, "#1976d2"], // Màu đậm ở trên (xanh đậm)
      [1, "#bbdefb00"], // Màu nhạt ở dưới (xanh nhạt)
    ],
  };

  const gradient2024 = {
    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
    stops: [
      [0, "#ff5722"], // Màu đậm ở trên (cam đậm)
      [1, "#ffccbc"], // Màu nhạt ở dưới (cam nhạt)
    ],
  };

  const options = {
    chart: {
      backgroundColor: "transparent",
      reflow: true,
      
      height: parentSize.height

    },
    title: {
      text: title,
      style: {
        color: theme.palette.chart.color // Màu chữ tiêu đề
      },
    },
    xAxis: {
      categories: data.length ? data.map(item => item.DATE_E.split('T')[0]) : [],
      type: 'datetime',
      dateTimeLabelFormats:{
        hour: '%H:%M',
        day: '%e %b',
        month:'%b %Y'
      },
      labels: {
        style: {
          fontSize: "0.8rem",
            color: theme.palette.chart.color, // Màu chữ trên trục X
        },
      },
    },
    yAxis: {
      title: {
        text: "Total Error",
        style: {
            color: theme.palette.chart.color, // Màu chữ trên trục Y
        },
      },
      labels: {
        style: {
          fontSize: "0.8rem",
          color: theme.palette.chart.color, // Màu chữ trên trục Y
        },
      },
      tickAmount: 3,
    },
    plotOptions: {
      column: {
          borderRadius: 5,
          dataLabels: { enabled: true, style: { fontSize: '0.8rem', color: theme.palette.chart.color } },
          borderWidth:0,
      },
      series:{
        point:{
            events:{
                click: function(){
                    handleInputChange(this.category);
                    // alert(`sdfsdf ${this.category}, ${this.y} ,  ${data.map(item => item.DATE_E.split('T')[0])[this.index]}`);
                    // alert(this.category);
                }
            }
        }
    }
    },
    tooltip: {
      x: {
          format: 'yyyy-MM-dd HH:mm:ss'
      },
      y: {
          formatter: function (value) {
              return value + ' %';
          }
      },
    },
    legend: {
      show: true,
      fontSize: '0.8rem',
      position: 'bottom',
      align: 'left',
        verticalAlign: 'top',
      style: {
        color: theme.palette.chart.color, // Màu chữ trên trục Y
      },
      labels: {
          useSeriesColors: true,
      },
      markers: {
          size: 0
      },
      formatter: function (seriesName, opts) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex] + '%'
      },
      itemMargin: {
          vertical: 3
      },
      itemStyle:{
        color: theme.palette.chart.color, // Màu chữ legend
      }
  },
    series: 
       [
          {
            name: "Total Error",
            type: "column",
            data: data.length ? data.map(item => item.Value1) : [],
            color: gradient2023,
          },
        ],
    credits: {
      enabled: false,
    },
    exporting:{
      enabled: false,
    },
    
      
  };

  return (
      <div ref={parentRef} style={{height: "100%", display:"block"}}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
  );
};

export default ESDChart;
