import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import { Box, Switch, Typography } from "@mui/material";
// Khởi tạo module 3D

const MOCK_DATA = [
    {
        "FACTORY": "A02",
        "LINE": "T04",
        "LOCATION": "1",
        "NAME_MACHINE": "V-cut01",
        "TIMET":"02:30",
        "DIFF": 1333
    },
    {
        "FACTORY": "B01",
        "LINE": "T04",
        "LOCATION": "1",
        "NAME_MACHINE": "V-cut01",
        "TIMET":"03:30",
        "DIFF": 0
    },
    {
        "FACTORY": "B01",
        "LINE": "T04",
        "LOCATION": "2",
        "NAME_MACHINE": "V-cut02",
        "TIMET":"03:30",
        "DIFF": 0
    },
    {
        "FACTORY": "B01",
        "LINE": "T06",
        "LOCATION": "1",
        "NAME_MACHINE": "V-cut01",
        "TIMET":"04:30",
        "DIFF": 100
    }
];
const LineChart = ({ idata = [] }) => {
  const theme = useTheme();
  const parentRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });

  const [switchMOL, setSwitchMOL] = useState(false);
  const handleChangeSwitchErAnLo = (event) => {
    setSwitchMOL(event.target.checked);
  };

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

  const grouped = {};

  MOCK_DATA.forEach((item) => {
    // const timeKey = new Date(item.TimeT).getTime();
    const timeKey = item.TIMET;
    const key = `${switchMOL ? item.NAME_MACHINE : item.LINE}_${timeKey}`;

    if (!grouped[key]) {
      grouped[key] = {
        LINE: switchMOL ? item.NAME_MACHINE : item.LINE,
        time: timeKey,
        runTime: 0,
        TOTALTIME: 0,
      };
    }
    grouped[key].TOTALTIME += item.DIFF;
  });

  const serialMap = {};

  Object.values(grouped).forEach(({ LINE, time, runTime, TOTALTIME }) => {
    if (!serialMap[LINE]) serialMap[LINE] = [];
    serialMap[LINE].push([time, TOTALTIME]);
  });

  const series = Object.entries(serialMap).map(([LINE, data]) => ({
    name: LINE,
    data: data.sort((a, b) => a[0] - b[0]),
  }));
  const seriesLength =
    series.length > 0 ? series.map((item) => item.data.length) : [];
  const maxLength =
    seriesLength.length > 0 ? Math.max(...seriesLength.map((e) => e), 0) : 1;

  // Cấu hình biểu đồ đường
  const options = {
    chart: {
      backgroundColor: "#ffffff00",
      reflow: true,
      type: "spline", // Loại biểu đồ đường
      height: parentSize.height,
    },
    title: {
      text: "",
    },
    xAxis: {
      type: "category",
      labels: {
        style: {
          fontSize: "12px",
          color: theme.palette.chart.color, // Màu chữ trên trục Y
        },
      },
      // tickInterval : 2,
      tickInterval: maxLength > 15 ? 3 : maxLength > 8 ? 2 : "",
      // labels:{
      //   format: `{value:%H:%M}`
      // }
    },
    yAxis: {
      // max: 100,
      title: {
        text: "Frequency",

        style: {
          color: "#999",
          fontSize: "11px",
        },
      },
      labels: {
        style: {
          fontSize: "12px",
          color: theme.palette.chart.color,
        },
      },
      tickAmount: 3,
    },
    series: series,
    credits: {
      enabled: false, // Tắt logo Highcharts ở góc
    },
    exporting: {
      enabled: false,
    },
    legend: {
      align: "left",
      verticalAlign: "top",
      style: {
        fontSize: "12px",
        color: theme.palette.chart.color,
      },
      itemStyle: {
        color: theme.palette.chart.color, // Màu chữ legend
      },
    },
  };

  return (
    <div ref={parentRef} style={{ height: "100%", display: "block" }}>
      {MOCK_DATA.length > 0 ? (
        <>
          <Switch
            labels={"sad"}
            checked={switchMOL}
            onChange={handleChangeSwitchErAnLo}
            sx={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}
            defaultChecked
          ></Switch>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Typography>Null</Typography>
        </Box>
      )}
    </div>
  );
};

export default LineChart;
