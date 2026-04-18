import React, { useEffect, useMemo,useRef,useState } from 'react';
import { Box, Grid, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,Paper, TableSortLabel, Button } from '@mui/material';
import HiBox from '../../../../components/HiBox';
import Highcharts, { Legend, color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from '@mui/material/styles';

const getPieDataLatestDate = (data) => {
    if (!data.length) return [];
    const pieData = data.map(item => ({
      name: item.CAUSE,
      y: item.Total
    }));
    pieData.sort((a,b) => b.y - a.y)
    

    return { pieData };
  };


const TableError = ({
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
  
      
      const { pieData, newestDate } = getPieDataLatestDate(idata);
      console.log(pieData)

      const options = {
        chart: {
          type: 'pie',
          backgroundColor: "transparent",
          reflow: true,
          height: parentSize.height
        },
        title: {
          text: `Error by Root Cause`
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
          data: pieData
        }]
      };



    return (
        <Grid sx={{height:'100%'}} container columns={12} >
            <HiBox lg={6} md={6} xs={6} alarn={false} height="36vh" variant="filled"  background='#fff'  >
            </HiBox>
            <HiBox lg={6} md={6} xs={6} alarn={false} height="36vh" variant="filled" background='#fff'   >
                <div ref={parentRef} style={{height: "100%", display:"block"}}>
                        <HighchartsReact highcharts={Highcharts} options={options} />
                </div>
            </HiBox>
            <HiBox lg={12} md={12} xs={12} alarn={false}  height="36vh" variant="filled" background='#fff'  >
            
            <TableContainer sx={{overflow:'auto', height:'100%',
                    '&::-webkit-scrollbar': { width: 0, opacity: 0 },
                    '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
                <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
                    <TableHead sx={{position:'sticky', top: '0'}}>
                        <TableRow>
                            <TableCell colSpan={999} style={{padding: "6px 6px", fontWeight: "bold",color: '#000', fontSize:'1.5rem'}} align="center">ErrorCode: {idata?.map(item => item['ERROR_CODE'])[0]}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">Error</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">Cause</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">Solution</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold",color: '#000'}} align="center">Frequecy</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {idata.map((row, index) => (
                        <TableRow key={index} >
                             {index === 0 ? <TableCell rowSpan={99} align="center" sx={{ padding: "12px",color: '#000', background: '#cbcbcb'}}>{row.ERROR_NAME || ''}</TableCell> : null} 
                            {/* <TableCell align="left" sx={{ padding: "6px 6px",color: '#000'}}>{index}</TableCell> */}
                            <TableCell align="left" sx={{ padding: "6px 6px",color: '#000'}}>{row.CAUSE || ''}</TableCell>
                            <TableCell align="left" sx={{ padding: "6px 6px",color: '#000'}}>{row.SOLUTION || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "6px 6px",color: '#004eff', fontWeight:'bold', cursor:'pointer', fontSize:  '1.2rem', backgroundColor: brightenColor('#00adff', index*10) }}>{row.Total || '0'}</TableCell>
                        </TableRow>
                    ))}
                    
                    </TableBody>
                </Table>
                </TableContainer>
            </HiBox>
        </Grid>
    )




}
export default TableError;