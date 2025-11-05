import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from "react";
import { Box, Switch, Typography } from "@mui/material";
// Khởi tạo module 3D

const LineChart = ({
    idata = [],
    MOL = 'Line'
  }
) => {
    const theme = useTheme();
    const parentRef = useRef(null);
    const [parentSize, setParentSize] = useState({width: 0 , height:0});
  
    const [switchMOL, setSwitchMOL] = useState(false);
    const handleChangeSwitchErAnLo = (event) => {
      setSwitchMOL(event.target.checked);
    }

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

    const grouped = {};

    idata.forEach(item => {
      // const timeKey = new Date(item.TimeT).getTime();
      const timeKey = item.TIMET;
      const key =  `${switchMOL ?  item.MACHINE_NAME : item.LINE  }_${timeKey}`;  

      if(!grouped[key]){
        grouped[key] = {
          LINE: switchMOL ?  item.MACHINE_NAME : item.LINE,
          time: timeKey,
          runTime: 0,
          TOTALTIME: 0
        };
      }
      grouped[key].TOTALTIME += item.TOTALTIME;
      if(item.STATUS === 'OK'){
        grouped[key].runTime += item.TOTALTIME;
      }
    })

    const serialMap = {};

    Object.values(grouped).forEach(({LINE,time,runTime,TOTALTIME}) => {
      const percentRun = TOTALTIME > 0 ? (runTime/TOTALTIME)*100 : 0;
      if(!serialMap[LINE]) serialMap[LINE] = [];
      serialMap[LINE].push([time, +percentRun.toFixed(2)]);
    });

    const series = Object.entries(serialMap).map(([LINE,data]) => ({
      name: LINE,
      data: data.sort((a,b) => a[0] - b[0]),
    }));
    console.log('series',series)
    const seriesLength = series.length > 0 ? series.map(item => item.data.length) : [];
    const maxLength = seriesLength.length > 0 ?  Math.max(...seriesLength.map(e => e), 0) : 1;


// 1) Tạo categories đã sắp xếp
const categories = React.useMemo(() => {
  const set = new Set();
  series.forEach(s => s.data.forEach(([t]) => set.add(t))); // gom all times
  return Array.from(set).sort((a, b) => {
    const [ah, am] = a.split(':').map(Number);
    const [bh, bm] = b.split(':').map(Number);
    return (ah*60 + am) - (bh*60 + bm);
  });
}, [series]);

// 2) (Khuyên dùng) map x sang index để tránh “tạo category mới”
const catIndex = React.useMemo(
  () => Object.fromEntries(categories.map((c, i) => [c, i])),
  [categories]
);

const alignedSeries = React.useMemo(() =>
  series.map(s => ({
    ...s,
    data: s.data.map(([t, y]) => [catIndex[t], y]), // dùng index thay vì chuỗi
    connectNulls: true
  }))
, [series, catIndex]);

  // Cấu hình biểu đồ đường
  const options = {
    chart: {
        backgroundColor: '#ffffff00',
        reflow: true,
        type: "spline", // Loại biểu đồ đường
        height: parentSize.height
    },
    title: {
      text: '',
    },
    xAxis: {
      type: 'category',
      categories,
      labels: {
        style: {
          fontSize: "12px",
          color: theme.palette.chart.color, // Màu chữ trên trục Y
        },
      },
      // tickInterval : 2,
      tickInterval: maxLength > 15 ? 3 : maxLength > 8 ? 2 : 1
      // labels:{
      //   format: `{value:%H:%M}`
      // }
    },
    yAxis: {
      max: 100,
      title: {
        text: "Availability",
        
        style:{
          color: '#999',
          fontSize: '11px',
        }
      },
      labels:{
        style:{
          fontSize: '12px',
          color: theme.palette.chart.color
      }
      },
      tickAmount: 3,
      
    },
    series: alignedSeries,
    credits: {
      enabled: false, // Tắt logo Highcharts ở góc
    },
    exporting:{
      enabled: false,
    },
    legend:{
       align: 'left',
       verticalAlign: 'top',
       style: {
        fontSize: '12px',
        color: theme.palette.chart.color,
      },
      itemStyle:{
        color: theme.palette.chart.color, // Màu chữ legend
      }
     }
  };

  return(
    <div ref={parentRef} style={{height: "100%", display:"block"}}>
      {idata.length > 0 ?
        <>
          <Switch labels={'sad'} checked={switchMOL} onChange={handleChangeSwitchErAnLo} sx={{position: 'absolute' , top: 0, right:0, zIndex:2}} defaultChecked ></Switch>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </>
        :
        <Box sx={{width:'100%', height: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
            <Typography>Null</Typography>
        </Box> 
      }
    </div>
  ) 
};

export default React.memo(LineChart);
