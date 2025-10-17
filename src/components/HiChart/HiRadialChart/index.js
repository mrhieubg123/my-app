import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import SolidGauge from 'highcharts/modules/solid-gauge';
import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { useTheme } from '@mui/material/styles';


// Kích hoạt module
HighchartsMore(Highcharts);
SolidGauge(Highcharts);

const HiRadialChart = ({
    title = '',
    data = [],
    color = [],
}) => {
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

    console.log("HiradianChart");


    const radiusConfig = React.useMemo(() => ([
      {outer: '100%', inner :'88%'},
      {outer: '85%', inner :'73%'},
      {outer: '70%', inner :'58%'},
      {outer: '55%', inner :'43%'},
      {outer: '40%', inner :'28%'},
      {outer: '25%', inner :'13%'},
  ]),[]);  
    const colorConfig = React.useMemo(() => (color.length > 1 ? color :  ['#ff5733', '#33ff57', '#3357ff']),[]); 

    const seriesData = React.useMemo(() => ( data.length  >  1 ? data :   [
        {name:'First', value:75},
        {name:'Second', value:50},
        {name:'Third', value:85},
    ]),[]); 

    const series = seriesData.map((item, index) => ({
        name: item.name,
        data:[
            {
                color: colorConfig[index],
                radius: radiusConfig[index].outer,
                innerRadius: radiusConfig[index].inner,
                y: item.value,
            },
        ],
    }));

  const options = {
    chart: {
      type: 'solidgauge',
      animation: {
        duration: 1000,
      },
      backgroundColor: "transparent",
      reflow: true,
      height: parentSize.height
    },
    title: {
      text: title,
      style: {
        fontSize: '18px',
      },
    },
    pane: {
      startAngle: 0,
      endAngle: 360,
      background: seriesData.map((radius, index) => ({
        outerRadius: radiusConfig[index].outer,
        innerRadius: radiusConfig[index].inner,
        backgroundColor: '#99999930',
        borderWidth: 0,
        borderColor: '#ccc',
      }))
    },
    yAxis: {
      min: 0,
      max: 100,
      lineWidth: 0,
      tickPositions: [],
    },
    plotOptions: {
        solidgauge: {
        //   linecap: 'round', // Bo tròn đầu thanh
          dataLabels: {
            enabled: true,
            useHTML: true,
            align: 'center',
            verticalAlign:'middle',
            format: `<div style="text-align:center">
                <span style="font-size:0.8vw; font-weight:bold; color:{point.color}; textShadow:none;">{series.name}</span>
                </br>
                <span style="font-size:0.8vw; color: ${theme.palette.chart.color}; textShadow:none;">{y}%</span>
            </div>`,
            style: {
                border: 'none',
                background : 'none',
            }
          },
          borderRadius: '50%',
          stickyTracking: false,
        },
      },
    
    series: series,
    tooltip: {
      valueSuffix: '%',
    },
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

export default HiRadialChart;
