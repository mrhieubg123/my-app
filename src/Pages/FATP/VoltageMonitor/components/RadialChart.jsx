import Highcharts, { Point } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import SolidGauge from 'highcharts/modules/solid-gauge';
import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';


// Kích hoạt module
HighchartsMore(Highcharts);
SolidGauge(Highcharts);

const RadialChart = ({
    title = '',
    data = [],
    color = [],
    idata = [],
}) => {
    const theme = useTheme();
    const parentRef = useRef(null);
    const [parentSize, setParentSize] = useState({width: 0 , height:0});
  
    const totalOK = idata.length > 0 ? idata.filter(item => item.STATUS === 'OK').reduce((sum, item) => sum + item.TOTALTIME ,0): 0;
    const totalNG = idata.length > 0 ? idata.filter(item => item.STATUS === 'NG').reduce((sum, item) => sum + item.TOTALTIME ,0): 0;

    const total = totalOK*1 + totalNG*1;

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
    const radiusConfig = React.useMemo(() => ([
      {outer: '100%', inner :'88%'},
      {outer: '85%', inner :'73%'},
      {outer: '70%', inner :'58%'},
      {outer: '55%', inner :'43%'},
      {outer: '40%', inner :'28%'},
      {outer: '25%', inner :'13%'},
  ]),[]);  
    const colorConfig =   ['#2099f5', '#ff3110', '#219af5','#ff5733', '#33ff57', '#3357ff']; 

    const seriesData = [
        {name:'Availabitity', value: (totalOK*100/total*1).toFixed(2)*1},
        {name:'DownTime Rate', value: (totalNG*100/total*1).toFixed(2)*1},
        
    ]; 

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
        style: {fontSize: '12px'}
    }));

  const options = {
    chart: {
      type: 'solidgauge',
      animation: {
        duration: 1000,
      },
      backgroundColor: "transparent",
      reflow: true,
      height: parentSize.height,
    },
    title: {
      text: title,
      style: {
        fontSize: '15px',
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
          linecap: 'round', // Bo tròn đầu thanh
          dataLabels: {
            enabled: true,
            useHTML: true,
            borderWidth: 0,
            align: 'center',
            verticalAlign:'middle',
            format: `<div style="text-align:center; border: unset">
                      <span style="font-size:12px; font-weight:bold; color:{point.color}; textShadow:none;">{series.name}</span>
                      </br>
                      <span style="font-size:12px; color: ${theme.palette.chart.color}; textShadow:none;">{y}%</span>
                  </div>`,
            style: {
              fontSize: "12px",
              border: 'none',
              background : 'none',
            }
          },
          borderRadius: '50%',
          stickyTracking: false,
          point:{
            events:{
              mouseOver: function(){
                const chart = this.series.chart;
                const point = this;
                chart.update({
                  series:[{
                    dataLabels:{
                      format: `<div style="text-align:center; border: unset">
                                  <span style="font-size:12px; font-weight:bold; color:${point.color}; textShadow:none;">${point.series.name}</span>
                                  </br>
                                  <span style="font-size:12px; color: ${theme.palette.chart.color}; textShadow:none;">${point.y}%</span>
                              </div>`,
                      useHTML: true
                    }
                  }]
                },false)
                chart.redraw();
              },
              mouseOut: function(){
                const chart = this.series.chart;
                const point = this;
                chart.update({
                  series:[{
                    dataLabels:{
                      format: `<div style="text-align:center; border: unset">
                                  <span style="font-size:12px; font-weight:bold; color:${point.color}; textShadow:none;">${point.series.name}</span>
                                  </br>
                                  <span style="font-size:12px; color: ${theme.palette.chart.color}; textShadow:none;">${point.y}%</span>
                              </div>`,
                      useHTML: true
                    }
                  }]
                },false)
                chart.redraw();
              }

            }
          }
        },
        series:{
          states:{
            inactive:{
              enabled: false
            },
            hover:{
              enabled: true,
              brightness:0.5,
            }
          },
          
        }
    },
    
    series: series,
    tooltip: {
      enabled: false,
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
      {idata.length > 0 ?
        <HighchartsReact highcharts={Highcharts} options={options} />
        :
        <Box sx={{width:'100%', height: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
            <Typography>Null</Typography>
        </Box> 
      }
    </div>
  ) 
};

export default RadialChart;
