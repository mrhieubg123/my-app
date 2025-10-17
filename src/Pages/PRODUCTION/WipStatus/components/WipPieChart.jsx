import Highcharts, { Legend, color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useRef, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useTheme } from '@mui/material/styles';
// Khởi tạo module 3D

const getPieDataLatestDate = (data) => {
    if (!data.length) return [];
  
    const pieData = data.map(item => ({
      name: item.MODEL,
      y: item.Total_inWIP
    }));
    pieData.sort((a,b) => b.y - a.y)
    

    return { pieData };
  };

const WipPieChart = ({idata =[], onModelChange, filDate}) => {
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
    console.log(idata);
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

    const colors = Highcharts.getOptions().colors.map((c,i) => 
      Highcharts.color('#007fff') //#007bff #0057db
        .brighten((i - 3) / 7)
        .get()
    );

    
    const { pieData, newestDate } = getPieDataLatestDate(idata);

    const options = {
      chart: {
        type: 'pie',
        backgroundColor: "transparent",
        reflow: true,
        height: parentSize.height
      },
      title: {
        text: ``
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)'
      },
      credits: {
        enabled: false,
      },
      exporting:{
        enabled: false,
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          borderWidth:4,
          borderColor: theme.palette.background.main,
          borderRadius: 10,
          cursor: 'pointer',
          colors,
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>:<br/><b>{point.y}</b> ({point.percentage:.1f} %) ',
            color: theme.palette.chart.color,
            distance: 20
          }
        }
      },
      series: [{
        name: 'Total',
        colorByPoint: true,
        data: pieData
      }]
    };

  return(
    <div ref={parentRef} style={{height: "100%", display:"block"}}>
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

export default WipPieChart;
