import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// Khởi tạo module 3D

const CABChart = ({ idata = [], queryJSON = {}, onChangeDate }) => {
  const theme = useTheme();
  const parentRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });

  const handleInputChange = (a) => {
    onChangeDate?.(a);
  };

  const temp = {};
  idata &&
    idata.forEach((item) => {
      if (temp[item.DATET]) {
        temp[item.DATET].VOK += item.PASS_COUNT;
        temp[item.DATET].VNG += item.FAIL_COUNT;
      } else {
        temp[item.DATET] = {
          DATET: item.DATET,
          VOK: item.PASS_COUNT,
          VNG: item.FAIL_COUNT,
        };
      }
    });
  var ErrorList = Object.values(temp);

  ErrorList.sort((a, b) => new Date(a.DATET) - new Date(b.DATET));
  ErrorList = ErrorList.slice(0, 7);

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

  // Dữ liệu cấu hình cho biểu đồ
  const options = {
    chart: {
      backgroundColor: "transparent",
      reflow: true,
      height: parentSize.height,
      borderWidth: 0,
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: ErrorList.map((item) => item["DATET"]),
      title: {
        text: "",
      },
      labels: {
        style: {
          fontSize: "12px",
          color: theme.palette.chart.color, // Màu chữ trên trục Y
        },
      },
    },
    yAxis: [
      {
        min: 0,
        max: 100,
        labels: {
          format: "{value}%",
          style: {
            fontSize: "12px",
            color: theme.palette.chart.color, // Màu chữ trên trục Y
          },
        },
        title: {
          text: "",
          style: {
            color: Highcharts.getOptions().colors[1],
          },
        },
        tickAmount: 3,
        opposite: true,
      },
      {
        labels: {
          format: "{value}",
          style: {
            fontSize: "12px",
            color: theme.palette.chart.color, // Màu chữ trên trục Y
          },
        },
        title: {
          text: "",
          style: {
            color: Highcharts.getOptions().colors[0],
          },
        },
        tickAmount: 3,
        opposite: false,
      },
    ],
    series: [
      {
        name: "Frequency",
        type: "column",
        borderWidth: 0,
        yAxis: 1,
        data: ErrorList.map((item) => item["VNG"]),
        color: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, "#2099f5"],
            [1, "#2099f500"],
          ],
        },
        dataLabels: {
          color: "#00e396",
          fontSize: "11px",
        },
      },
      {
        name: "Pass",
        type: "spline",
        yAxis: 0,
        data: ErrorList.map((item) =>
          parseFloat(
            (((item["VOK"] * 100) / (item["VOK"] + item["VNG"])) * 1).toFixed(2)
          )
        ),
        color: "#00e396",
        dataLabels: {
          color: "#00e396",
          fontSize: "11px",
        },
      },
      {
        name: "Fail Rate",
        type: "spline",
        yAxis: 0,
        data: ErrorList.map((item) =>
          parseFloat(
            (((item["VNG"] * 100) / (item["VOK"] + item["VNG"])) * 1).toFixed(2)
          )
        ),
        color: "#ff3110",
        dataLabels: {
          color: "#ff3110",
          fontSize: "11px",
        },
      },
    ],
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    tooltip: {
      shared: true,
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          color: theme.palette.chart.color,
          style: {
            textOutline: "none",
          },
        },
        point: {
          events: {
            click: function () {
              handleInputChange(this.category);
            },
          },
        },
      },
    },
    legend: {
      align: "left",
      verticalAlign: "top",
      style: {
        color: theme.palette.chart.color, // Màu chữ trên trục Y
      },
      labels: {
        useSeriesColors: true,
      },
      itemStyle: {
        color: theme.palette.chart.color, // Màu chữ legend
      },
    },
  };

  return (
    <div ref={parentRef} style={{ height: "100%", display: "block" }}>
      {idata.length > 0 ? (
        <HighchartsReact highcharts={Highcharts} options={options} />
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

export default CABChart;
