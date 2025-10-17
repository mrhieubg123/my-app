import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Typography, MenuItem, FormControl, InputLabel, IconButton, Select,
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import dayjs from 'dayjs';
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
    if (idata.length > 0 && isFirstRender) {
      setSelectedMachine(idata[0].Machine);
      setIsFirstRender(false)
    }
  }, [idata])

  useEffect(() => {
    const fetchData = async () => {
      const machineInfo = idata?.find(m => m.Machine === selectedMachine);
      if (!machineInfo) return;

      try {
        const res = await axiosInstance.post("/api/MPE/getDataGelByMachine", {
          Machine: machineInfo.Machine,
          dateFrom: paramState.params.starttime,
          dateTo: paramState.params.endtime
        });

        const data = (res.data || []).map(item => [
          // dayjs(item.TIME_START).format('YYYY-MM-DD HH:mm:ss'),
          new Date(item.TIME_START).getTime(), // X: timestamp
          item.CL, // Y: CL
        ]);

        setChartData(res.data);
        updateChartOptions(data, machineInfo);
      } catch (err) {
        console.error("Fetch CL data error:", err.message);
      }
    };

    if (selectedMachine) {
      fetchData();
    }

  }, [selectedMachine,theme]);

  const updateChartOptions = (data, machine) => {
    setHighchartOption({
      chart: {
        type: "spline",
        backgroundColor: "transparent",
        height: parentSize.height - 60,
        zoom: "x"
      },
      title: { text: `` },
      xAxis: {
        type: "datetime",
        labels: { format: '{value:%Y:%m:%d %H:%M:%S}', style: { fontSize: '12px', color: theme.palette.chart.color} },
        // title: { text: "Time" },
      },
      yAxis: {
        title: { text: "CL" },
        min: machine.LCL * 0.95, // Đặt min/max cho trục Y để khớp hình ảnh
        max: machine.UCL * 1.05,
        labels: { style: { fontSize: '12px', color: theme.palette.chart.color } },
        plotLines: [
          {
            value: machine.UCL,
            color: "red",
            dashStyle: "Dash",
            width: 1,
            label: { text: `UCL ${machine.UCL}`, align: "right", style: { color: "red" } },
          },
          {
            value: machine.USL,
            color: "orange",
            dashStyle: "Dash",
            width: 1,
            label: { text: `USL ${machine.USL}`, align: "right",style: { color: theme.palette.chart.color }  },
          },
          {
            value: machine.LSL,
            color: "orange",
            dashStyle: "Dash",
            width: 1,
            label: { text: `LSL ${machine.LSL}`, align: "right",style: { color: theme.palette.chart.color } },
          },
          {
            value: machine.LCL,
            color: "red",
            dashStyle: "Dash",
            width: 1,
            label: { text: `LCL ${machine.LCL}`, align: "right", style: { color: "red" } },
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
            radius: 5,
          },
        },
      },
      series: [
        {
          name: machine.Machine,
          data: data,
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControl variant="outlined" size="small" sx={{ zIndex: 2, height: 40 }}>
              <InputLabel id="machine-select-label" sx={{ color: 'primary' }}>Machine</InputLabel>
              <Select
                labelId="machine-select-label"
                value={selectedMachine || ""}
                onChange={(e) => setSelectedMachine(e.target.value)}
                label="Machine"
                sx={{
                  color: 'primary',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary',
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'primary',
                  },
                }}
              >
                {[].map((value, index) => {
                  return <MenuItem value={value.Machine}>{value.Machine}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <IconButton sx={{ color: "#007bff" }} title='Export to Excel' onClick={() => exportToCSV(chartData)}>
              <DownloadIcon />
            </IconButton>
          </Box>
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
