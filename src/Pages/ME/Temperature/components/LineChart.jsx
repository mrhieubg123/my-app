import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Typography, MenuItem, FormControl, InputLabel, IconButton, Select,
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import { getAuthorizedAxiosIntance } from '../../../../utils/axiosConfig';
const axiosInstance = await getAuthorizedAxiosIntance();

const LineChart = ({
  idata = []
}
) => {
  const paramState = useSelector(state => state.param);
  const theme = useTheme();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const parentRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });
  const [selectedMachine, setSelectedMachine] = useState();
  const [chartData, setChartData] = useState([]);
  const [highchartOption, setHighchartOption] = useState([]);

  useEffect(() => {
    const updateSize = () => {
      if (parentRef.current) {
        const { width, height } = parentRef.current.getBoundingClientRect();
        setParentSize({ width, height });
      }
    };
    const resizeObserver = new ResizeObserver(updateSize);
    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);
    }
    return () => {
      if (parentRef.current) {
        resizeObserver.unobserve(parentRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (idata.length > 0)
      updateChartOptions(idata);
  }, [idata])

  const updateChartOptions = (data) => {
    const dataChart = [].map(item => [
      item.DATETIME?.split('T')[0], // X: timestamp
      +item.TEMP, // Y: CL
    ]);
    console.log("dataChartModal", dataChart);
    setHighchartOption({
      chart: {
        type: "spline",
        height: 400,
        backgroundColor: "transparent",
        zoom: "x"
      },
      title: { text: `${data[0].IDQRCODE}` },
      xAxis: {
        type: 'category',
        labels: {
          style: {
            fontSize: "12px",
            // color: theme.palette.chart.color, // Màu chữ trên trục X
          },
        },
        // tickInterval : 2,
        // labels:{
        //   format: `{value:%H:%M}`
        // }
      },
      yAxis: {
        title: {
          text: "Temperature °C", style: {
            color: "#007bff",
            // color: theme.palette.chart.color,
            fontWeight: "800" // Màu chữ trên trục Y
          },
        },
        min: 0, // Đặt min/max cho trục Y để khớp hình ảnh
        max: +data[0].TEMP_MAX * 1.1,
        gridLineColor: null, 
        plotLines: [
          {
            value: data[0].TEMP_MAX,
            color: "red",
            dashStyle: "Dash",
            width: 1,
            label: { text: `${data[0].TEMP_MAX}`, align: "right", style: { color: "red", fontWeight: "bold" } },
          },
          {
            value: data[0].TEMP_MIN,
            color: "red",
            dashStyle: "Dash",
            width: 1,
            label: { text: `${data[0].TEMP_MIN}`, align: "right", style: { color: "red", fontWeight: "bold" } },
          },
        ],
      },
      credits: {
        enabled: false, // Ẩn "Highcharts.com"
      },
      legend: {
        enabled: false, // Ẩn legend mặc định
      },
      exporting: {
        enabled: true,
      },
      plotOptions: {
        series: {
          marker: {
            enabled: true, // Hiển thị điểm dữ liệu
            radius: 3,
          },
          dataLabels: {
            enabled: true, // Kích hoạt hiển thị dataLabels
            // format: '{y:.1f}', // Định dạng giá trị Y với 4 chữ số thập phân
            style: {
              color: 'orange', // Màu chữ của nhãn
              // textOutline: '1px solid #333', // Viền chữ để dễ đọc hơn trên nền màu
              fontSize: '10px', // Cỡ chữ của nhãn 
            },
            allowOverlap: false, // Ngăn nhãn chồng lên nhau (Highcharts sẽ tự động ẩn một số nhãn nếu cần)
            // Có thể tùy chỉnh vị trí của nhãn
            // verticalAlign: 'bottom',
            y: -10, // Dịch chuyển nhãn lên trên 10px so với điểm
          },
        },

      },
      series: [
        {
          name: data[0].IDQRCODE,
          data: dataChart,
          color: "#007bff",
        },
      ],
    });
  };

  const exportToCSV = (dataList, fileName = "export.csv") => {
    if (!dataList || dataList.length === 0) return;

    const headers = ["index", "Machine", "time", "name", "cl"];

    const rows = dataList.map((item, index) => {
      return [
        index + 1,
        item.Machine,
        item.TIME_START,
        item.NAME_TEST,
        item.CL
      ].join(",");
    });

    const csvContent = [...rows].join("\n");

    // Tạo blob và tải xuống
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.click();
  };

  return (
    <Box ref={parentRef} sx={{ height: "100%", p: 2 }}>
      {idata.length > 0 ?
        <>
          {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControl variant="outlined" size="small" sx={{ zIndex: 2, height: 40 }}>
              <InputLabel id="machine-select-label" sx={{ color: 'black' }}>Machine</InputLabel>
              <Select
                labelId="machine-select-label"
                value={selectedMachine || ""}
                onChange={(e) => setSelectedMachine(e.target.value)}
                label="Machine"
                sx={{
                  color: 'black',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'black',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'black',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'black',
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'black',
                  },
                }}
              >
                {idata.map((value, index) => {
                  return <MenuItem value={value.Machine}>{value.Machine}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <IconButton sx={{ color: "#007bff" }} title='Export to Excel' onClick={() => exportToCSV(chartData)}>
              <DownloadIcon />
            </IconButton>
          </Box> */}
          <HighchartsReact highcharts={Highcharts} options={highchartOption} />
        </>
        :
        <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
          <Typography>Null</Typography>
        </Box>
      }
    </Box>
  )
};

export default LineChart;
