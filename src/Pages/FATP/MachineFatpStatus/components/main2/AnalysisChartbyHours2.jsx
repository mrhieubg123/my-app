import React, { useEffect, useRef, useState } from "react";
import {   Box ,List, Fab, Paper, ListItem, ListItemText, FormControl, Select, MenuItem, InputLabel} from '@mui/material';
import Highcharts, { format } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { BorderColor } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const AnalysisChartByHours2 = ({ idata =[]}) => {
    const theme = useTheme();
    const latestDate = idata.length > 0 ?  idata.reduce((max, row) => max > row.DateT ? max : row.DateT , idata[0]?.DateT) : '';
    const [selectedValue, setSelectedValue] = useState(`${latestDate|| ''}`);
    const [dataValue, setDataValue] = useState([]);

    const parentRef = useRef(null);
    const [parentSize, setParentSize] = useState({width: 0 , height:0});
  
    useEffect (() => {
      if(selectedValue !== ''){
        setDataValue(idata.filter(item => item.DateT === `${selectedValue}`))
      } 
      else{
        setDataValue(idata)
      }
    },[idata]);


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

    const ListDate = [...new Set(idata.length > 0 ? idata.map(row => row.DateT) :[])]
    const handleChange = (event) =>{
      setSelectedValue(event.target.value);
      if(event.target.value !== ''){
        setDataValue(idata.length > 0 ?  idata.filter(item => item.DateT === `${event.target.value}`) : [])
      }    
      else{
        setDataValue(idata.length > 0 ?  idata :[])
      }
      
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
            categories: dataValue.length > 0 ? dataValue.map(item => item.TimeT) : idata.length > 0 ?  idata.map(item => item.TimeT): [] ,
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
            }
        },
        series: [{
            name: 'Duration(h)',
            data: dataValue.length > 0 ? dataValue.map(item => item.NG) : idata.length > 0 ?  idata.map(item => item.NG) : [],
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
      <Box sx={{width: '100%', height: '100%'}}>
        <FormControl size="small" sx={{position: 'absolute', top:0, right: 0, zIndex:2 }}>
          <Select
            value={selectedValue || ''}
            // label={selectedValue || ''}
            onChange={handleChange}
            sx={{padding: 'unset',
              '& .MuiSelect-select': {
                padding: 0.5,
              }
            }}
          >
            <MenuItem 
                key={''} 
                value={''}
            >
              All
            </MenuItem>
            {ListDate.map((item, index) => (
              <MenuItem 
                key={index} 
                value={item}
              >
                {item}
              </MenuItem>
            ))}

          </Select>
        </FormControl>
       
        <div ref={parentRef} style={{height: "100%", display:"block"}} id="chart41">            
                <HighchartsReact highcharts={Highcharts} options={spark1Options} />
        </div>
      </Box>
        
    );
};

export default AnalysisChartByHours2;
