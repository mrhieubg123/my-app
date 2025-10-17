import React, { useEffect, useRef, useState } from "react";
import Highcharts, { format } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { BorderColor } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const AnalysisChart2 = ({ idata =[], onModelChange}) => {
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

    const handleInputChange = (imodel, idx) => {
      const model ={
        cate: imodel,
        idx: idx
      }
      onModelChange?.(model)
    }
    
    const spark1Options = {
        chart: {
            type: 'column',
            backgroundColor: "transparent",
            height: parentSize.height,
        },
        colors: ['#00e396'],
        title: { text: '' },
        xAxis: {
            categories: idata.length > 0 ? idata.map(item => item.ERROR) :[],
            labels: { style: { fontSize: '13px', color: theme.palette.chart.color } },
            gridLineWidth: 0,
            lineWidth:0,
            // tickAmount: 5,
            //tickInterval: 3
        },
        yAxis: {
            title: { text: 'Duration(h)', style: { fontSize: '13px', color: '#999' }},
            gridLineWidth: 0,
            lineWidth:0,
            tickAmount: 2,
            labels:{
                style:{
                    fontSize: '0.7vw',
                    color: theme.palette.chart.color
                }
            } 
           
        },
        plotOptions: {
            column: {
                borderRadius: 5,
                dataLabels: { enabled: true, style: { fontSize: '13px', color: theme.palette.chart.color } },
                borderWidth:0,
            },
            series:{
              point:{
                  events:{
                      click: function(){
                          handleInputChange(this.category, this.index);
                          // alert(`sdfsdf ${this.category}, ${this.y} ,  ${data.map(item => item.DATE_E.split('T')[0])[this.index]}`);
                          // alert(this.category);
                 
                      }
                  }
              }
          }
        },
        series: [{
            name: 'Duration(h)',
            data: idata.length > 0 ? idata.map(item => item.TotalTime) : [],
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
            },
            dataLabels: {
                enabled: true,
                format:`{y}`,
                offsetY: -20,
                color: theme.palette.chart.color,
                style: {
                    textOutline: 'none',
                }
            },
        }],
       
        credits: {
            enabled: false, // Tắt logo Highcharts ở góc
          },
          legend:{
            enabled: false,
            align: 'left',
            verticalAlign: 'top',
          },
          exporting:{
            enabled: false,
          },
        
    };

    

    return (
        <div ref={parentRef} style={{height: "100%", display:"block"}} id="chart41">            
                <HighchartsReact highcharts={Highcharts} options={spark1Options} />
        </div>
    );
};

export default AnalysisChart2;
