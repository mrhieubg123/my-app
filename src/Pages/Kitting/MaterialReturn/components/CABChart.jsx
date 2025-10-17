import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
// Khởi tạo module 3D

const CABChart = ({ idata = [], idata2 = [], onChangeDate }) => {
  const theme = useTheme();
  const parentRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });

  const handleInputChange = (a) => {
    onChangeDate?.(a);
  };

  const temp = {};
  idata &&
    idata.forEach((item) => {
      const dateT = dayjs(item.end_time).format("YYYY-MM-DD");
      if (temp[dateT]) {
        temp[dateT].counted += 1;
        if (item.status === "LOCK WAIT UNLOCK") temp[dateT].waitLCR += 1;
      } else {
        temp[dateT] = {
          DateT: dateT,
          counted: 1,
          waitLCR: item.status === "LOCK WAIT UNLOCK" ? 1 : 0,
          waitReturn: 0,
        };
      }
    });
  idata2 &&
    idata2.forEach((item) => {
      const dateT = dayjs(item.end_time).format("YYYY-MM-DD");
      if (temp[dateT]) {
        temp[dateT].waitReturn += 1;
      } else {
        temp[dateT] = {
          DateT: dateT,
          counted: 0,
          waitLCR: 0,
          waitReturn: 1,
        };
      }
    });
  const ErrorList = Object.values(temp);

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
      categories: ErrorList.map((item) => item["DateT"]),
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
          format: "{value}",
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
        name: "Wait return",
        type: "column",
        borderWidth: 0,
        yAxis: 1,
        data: ErrorList.map((item) => item.waitReturn),
        color: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, "orange"],
            [1, "#2099f500"],
          ],
        },
        dataLabels: {
          color: "orange",
          fontSize: "11px",
        },
      },
      {
        name: "Counted",
        type: "column",
        borderWidth: 0,
        yAxis: 1,
        data: ErrorList.map((item) => item.counted),
        color: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, "#00e396"],
            [1, "#2099f500"],
          ],
        },
        dataLabels: {
          color: "#00e396",
          fontSize: "11px",
        },
      },
      {
        name: "Wait LCR",
        type: "spline",
        yAxis: 0,
        data: ErrorList.map((item) =>
          parseFloat((((item.waitLCR * 100) / item.counted) * 1).toFixed(2))
        ),
        color: "#ff3110",
        dataLabels: {
          color: "#ff3110",
          fontSize: "11px",
        },
      },
      {
        name: "Tested LCR",
        type: "spline",
        yAxis: 0,
        data: ErrorList.map((item) =>
          parseFloat(
            (
              (((item.counted - item.waitLCR) * 100) / item.counted) *
              1
            ).toFixed(2)
          )
        ),
        color: "#2099f5",
        dataLabels: {
          color: "#2099f5",
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
