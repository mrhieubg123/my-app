import Highcharts, { Legend, color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useRef, useState } from "react";
import { Box, Tooltip } from "@mui/material";
import { useTheme } from '@mui/material/styles';
// Khởi tạo module 3D

const CABChart = ({idata =[], queryJSON = {}}) => {
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
      backgroundColor: "transparent",
      reflow: true,
      height: parentSize.height,
      borderWidth:0,
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: idata.map(item => item["DateT"]),
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
    yAxis: [{
        min:0,
        max:100,
        labels: {
            format: '{value}%',
            style: {
              fontSize: "0.7rem",
              color: theme.palette.chart.color, // Màu chữ trên trục Y
            },
          },
        title: {
            text: "",
            style:{
                color: Highcharts.getOptions().colors[1]
            }
        },
        opposite: true
    },{
        labels: {
            format: '{value}',
            style: {
              fontSize: "0.7rem",
              color: theme.palette.chart.color, // Màu chữ trên trục Y
            },
          },
        title: {
            text: "",
            style:{
                color: Highcharts.getOptions().colors[0]
            }
        },
        opposite: false
    }],
    series: [{
      name: 'Total',
      type: 'column',
      borderWidth:0,
      yAxis:1,
      
      data:   idata.map(item => item["TotalOK"]*1 + item["TotalNG"]*1 ),
      color: {
          linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
          },
          stops: [
              [0, '#2099f5'],
              [1, '#2099f500']
          ]
      }
  },{
        name: 'OK',
        type: 'spline',
        yAxis:0,
        //data:  idata.map(item => parseFloat((item["TotalOK"] * 100 / (item["TotalOK"] + item["TotalNG"]) * 1).toFixed(2))),
        data:  idata.map((item, i) => {
            const total = item["TotalOK"] + item["TotalNG"];
            const percent = parseFloat((item["TotalOK"] * 100 / (item["TotalOK"] + item["TotalNG"]) * 1).toFixed(2));
            const count = item["TotalOK"];
            return {
              y: percent,
              total: total,
              count: count
            }
           
            
          }),

        color: "#00e396",
        dataLabels:{
          color: "#00e396",
        },
        tooltip:{
          pointFormatter: function() {
            return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${this.y}% </b> <br/>`
            + 
            `<span style="color:${this.color}">\u25CF</span> Total ${this.series.name}: <b>${this.count}</b> `
          }
        }
        
    },{
        name: "NG",
        type: 'spline',
        yAxis:0,
        // data:  idata.map(item => parseFloat((item["TotalNG"] * 100 / (item["TotalOK"] + item["TotalNG"]) * 1).toFixed(2))),
        data:  idata.map((item, i) => {
          const total = item["TotalOK"] + item["TotalNG"];
          const percent = parseFloat((item["TotalNG"] * 100 / (item["TotalOK"] + item["TotalNG"]) * 1).toFixed(2));
          const count = item["TotalNG"];
          return {
            y: percent,
            total: total,
            count: count
          }
         
          
        }),
        color: "#ff3110",
        dataLabels:{
          color: "#ff3110",
        },
        tooltip:{
          pointFormatter: function() {
            return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${this.y}%</b> <br/> `
            +
            `<span style="color:${this.color}">\u25CF</span> Total ${this.series.name}: <b>${this.count}</b> `
          }
        }
        
    }
    ,]  ,

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

    plotOptions:{
      series:{
        dataLabels:{
          enabled: true,
          color: theme.palette.chart.color,
          style: {
              textOutline: 'none',
              fontSize: '0.7rem'
          }
        },
          
      }
    },
  };

  return(
    <div ref={parentRef} style={{height: "100%", display:"block"}}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  ) 
};

export default CABChart;
