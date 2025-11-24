import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { Box, Button, Dialog, DialogActions, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const LineChart = ({ title = "", idata = [], categories = [], onModelChange }) => {
  const theme = useTheme();
  const user = useSelector((state) => state.auth.login.currentUser);

  const parentRef = useRef(null);
  const [parentSize, setParentSize] = useState({width: 0 , height:0});
  const [dataTable, setDataTable] = useState([]);
  const [newFolderDialogOpen9, setNewFolderDialogOpen9] = useState(false);

  const convertDate = (date) =>{
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const date1 = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const formarttedDate = `${year}-${month}-${date1} ${hours}:${minutes}:${seconds}`;
    return formarttedDate;
  } 
  const convertMonth = (dat) =>{
    const date = new Date(dat);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
  
    const formarttedDate = `${year}-${month}`;
    return formarttedDate;
  } 

  const tempError = {};
    idata.forEach(item => {
        let key = convertMonth(item.Time_Start) 
        if(tempError[key]) {
            // if(item.TotalItemUse > 0){
                tempError[key].Total +=  1;
            // }
        }
        else {
            tempError[key] = {Series:key , Total: item.TotalItemUse === 0 ? 1 : item.TotalItemUse* 1 };
        }
    });
    const List2 = Object.values(tempError);

  const[formData, setFormData] = useState({
    empConfirm: user?.username,
    reason: "",
    method: "",
    time: convertDate(new Date()),
    id: "",
})
  const handleInputChange = (idate) =>{
    const fileDataMonth = idata.filter(item => convertMonth(item.Time_Start) === idate);
    setDataTable(fileDataMonth)
    setNewFolderDialogOpen9(true)
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
      [1, "#bbdefb92"], // Màu nhạt ở dưới (xanh nhạt)
    ],
  };

  const gradient2024 = {
    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
    stops: [
      [0, "#bbdefb92"], // Màu đậm ở trên (xanh đậm)
      [1, "#1976d2"], // Màu nhạt ở dưới (xanh nhạt)
    ],
  };

  const options = {
    chart: {
      backgroundColor: "transparent",
      reflow: true,
      height: parentSize.height,
      zoomType: 'x',
    },
    title: {
      text: title,
      style: {
        color: "#333" // Màu chữ tiêu đề
      },
    },
    xAxis: {
        categories: List2.length > 0 ? List2.map(item => item.Series) : [],
      type: 'datetime',
      dateTimeLabelFormats:{
        hour: '%H:%M',
        day: '%e %b',
        month:'%b %Y'
      },
      labels: {
        style: {
          fontSize: "0.8rem",
            color: "#333", // Màu chữ trên trục X
        },
      },
    },
    yAxis: {
      title: {
        text: "Frequency",
        style: {
            color: "#333", // Màu chữ trên trục Y
        },
      },
      labels: {
        style: {
          fontSize: "0.8rem",
          color: "#333", // Màu chữ trên trục Y
        },
      },
     
    //   tickAmount: 3,
    },
    plotOptions: {
      column: {
          borderRadius: 5,
          dataLabels: { enabled: true, style: { fontSize: '0.8rem', color:"#333" } },
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
        color: "#333", // Màu chữ trên trục Y
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
        color: "#333", // Màu chữ legend
      }
  },
    series: 
       [
          {
            name: "Frequency",
            type: "areaspline",
            data: List2.length > 0 ? List2.map(item => item.Total*1) : [],
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
        {/* Machine Code Detail*/}
            <Dialog open={newFolderDialogOpen9} onClose={() => setNewFolderDialogOpen9(false)} maxWidth="md" fullWidth='true'>
                <Box sx={{padding: '10px' , paddingTop: 'unset'}}>
                    <DialogTitle>Spare Parts Detail</DialogTitle>
                    <Box sx={{width: '100%',height: '60vh' , padding: '6px'}}>
                        <TableContainer sx={{overflow:'auto',height: '100%',
                                '&::-webkit-scrollbar': { width: 4,height:4, opacity: 0 },
                                '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                                '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
                            <Table stickyHeader aria-label="customized table">
                                <TableHead sx={{position:'sticky', top: '0',zIndex: 10, backgroundColor: theme.palette.background.conponent}}>
                                    <TableRow>
                                        <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>No.</TableCell>
                                        <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Product (EN)</TableCell>
                                        <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Product (VN)</TableCell>
                                        <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Date time</TableCell>
                                        <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Time Control (day)</TableCell>
                                        <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Total use</TableCell>

                                        <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>ID Confirm</TableCell>
                                        <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", border: '1px solid #999',cursor:"pointer"  }}>Comment</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {dataTable.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center" style={{padding: "6px",border: '1px solid #999' }}>{index + 1 || ''}</TableCell>
                                        <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.Product_en || ''}</TableCell>
                                        <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.Product_vn || ''}</TableCell>
                                        <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.Time_Start.split(".")[0].replace('T',' ') || ''}</TableCell>
                                        <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.TimeControl}</TableCell>
                                        <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.TotalItemUse || ''}</TableCell>
                                        <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.ID_Confirm || ''}</TableCell>
                                        <TableCell align="center" style={{padding: "6px",border: '1px solid #999'  }}>{row.Comment || ''}</TableCell>

                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                <DialogActions>
                <Button variant="contained" color='error'  onClick={() => setNewFolderDialogOpen9(false)}>Exit</Button>
                </DialogActions>
            </Dialog>
      </div>
  );
};

export default LineChart;
