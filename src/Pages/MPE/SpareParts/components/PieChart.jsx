import React, { useEffect, useMemo,useRef,useState } from 'react';
import { Box, Grid, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,Paper, TableSortLabel, Button } from '@mui/material';
import HiBox from '../../../../components/HiBox';
import Highcharts, { Legend, color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from '@mui/material/styles';

const getPieDataLatestDate = (data) => {
  const groupedTotal = data.reduce((acc, item) => {
    const name = item.Note;
    const qty = Number(item.Quantity) || 0;
    if(!acc[name]){
      acc[name] = 0;
    }
    acc[name] += qty;
    return acc;
  },{})
  const dataResult = Object.entries(groupedTotal).map(([name, y]) =>({
    name: name,
    y: y
  }))
    dataResult.sort((a,b) => b.y - a.y)
    return { dataResult };
  };


const PieChart = ({
    alarn,
    width = '100%',
    height = '100%',
    variant = 'default',
    idata = [],
  }) => {
    const theme = useTheme();
    const parentRef = useRef(null);
    const [parentSize, setParentSize] = useState({width: 0 , height:0});
    // function brightenColor

    // const colors = (i) =>{
    //     return  (tiny '#007fff'.brighten((i - 3) / 7)).toHexString();
    // };

    function brightenColor(hexColor, percent) {
        // Chuyển đổi màu hex thành R, G, B
        let r = parseInt(hexColor.substr(1, 2), 16);
        let g = parseInt(hexColor.substr(3, 2), 16);
        let b = parseInt(hexColor.substr(5, 2), 16);
    
        // Tăng giá trị của mỗi thành phần màu
        r = Math.min(255, r + (255 * (percent / 100)));
        g = Math.min(255, g + (255 * (percent / 100)));
        b = Math.min(255, b + (255 * (percent / 100)));
    
        // Chuyển đổi lại thành mã màu hex
        const toHex = (c) => ('0' + Math.round(c).toString(16)).slice(-2);
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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
  
      const colors = Highcharts.getOptions().colors.map((c,i) => 
            brightenColor('#00adff', i*10)
      );
  
      
      const pieData  = getPieDataLatestDate(idata);

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
            borderWidth:0,
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
          data: pieData.dataResult
        }]
      };



    return (
      <div ref={parentRef} style={{height: "100%", display:"block"}}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    )




}
export default PieChart;