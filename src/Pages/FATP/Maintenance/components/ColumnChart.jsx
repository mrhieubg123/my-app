import Highcharts, { Point } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ColumnChart = ({ idata = [], onModelChange, onModelChange2 }) => {
  const theme = useTheme();
  const parentRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });

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

  const options = React.useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        reflow: true,
        height: parentSize.height,
      },
      title: {
        text: "",
      },
      xAxis: {
        categories: [
          "L06",
          "T04",
          "T06",
          "T07",
          "T08",
          "T09",
          "T10",
          "T11",
          "T12-A",
          "T12-B",
        ],
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
          labels: {
            format: "{value}",
            style: {
              fontSize: "12px",
              color: theme.palette.chart.color, // Màu chữ trên trục Y
            },
          },
          title: {
            text: "Qty",
            style: {
              color: Highcharts.getOptions().colors[0],
            },
          },
          tickAmount: 3,
          opposite: false,
        },
      ],
      legend: {
        align: "right",
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
                //   handleInputChange(this.category);
              },
            },
          },
        },
      },
      series: [
        {
          name: "Machine details",
          type: "column",
          borderWidth: 0,
          yAxis: 0,
          data: [9, 15, 17, 15, 13, 15, 12, 16, 9, 9],
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
          name: "Maintenance for month",
          type: "column",
          borderWidth: 0,
          yAxis: 0,
          data: [9, 15, 17, 15, 13, 15, 12, 16, 0, 0],
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
      ],
      credits: {
        enabled: false,
      },
    }),
    [theme, parentSize]
  );

  return (
    <div ref={parentRef} style={{ height: "100%", display: "block" }}>
      {[1].length > 0 ? (
        <>
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
export default React.memo(ColumnChart);
