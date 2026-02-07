import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import { Box, Switch, Typography, GlobalStyles } from "@mui/material";
// Khởi tạo module 3D

const LineChart = ({
  idata = [1, 2, 3],
  modelSelected,
  issueSelected,
  listQtyProduct,
  slotSelected,
  listWeek,
}) => {
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

  const tempError2 = {};

  idata
    .filter(
      (e) =>
        e.LOCATION_CODE === slotSelected &&
        e.MODEL_NAME === modelSelected &&
        e.ERROR_DESC === issueSelected
    )
    .forEach((item) => {
      if (tempError2[item.TEST_LINE]) {
        tempError2[item.TEST_LINE] += item.QTY;
      } else {
        tempError2[item.TEST_LINE] = item.QTY;
      }
    });

  const entries = Object.entries(tempError2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, Math.min(Object.entries(tempError2).length, 10)); // sort theo QTY giảm dần

  const categories = [];
  const dataProduct = [];

  entries.forEach(([errorDesc, qty]) => {
    categories.push(errorDesc);
    dataProduct.push(qty);
  });

  // Cấu hình biểu đồ đường
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
      categories: categories,
      title: {
        text: "",
      },
      labels: {
        useHTML: true,
        style: {
          fontSize: "12px",
          color: theme.palette.chart.color,
        },
        formatter: function () {
          const value = String(this.value ?? "");
          // escape đơn giản tránh vỡ HTML
          const safe = value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
          return `<div class="hc-x-ellipsis" title="${safe}">${safe}</div>`;
        },
      },
    },
    yAxis: {
      min: 0,
      // max: 100,
      gridLineWidth: 0,
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
      tickAmount: 5,
      // opposite: true,
    },
    series: [
      {
        name: issueSelected,
        type: "bar",
        data: dataProduct,
        color: {
          linearGradient: { x1: 0, y1: 0.3, x2: 0, y2: 1 },
          stops: [
            [0, "#e74c3c"], // màu nổi bật (bạn đổi theo ý)
            [1, "#e74c3c00"],
          ],
        },
      },
    ],
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
              // handleInputChange(this.category);
            },
          },
        },
      },
    },
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
      {idata !== null ? (
        <>
          <GlobalStyles
            styles={{
              ".hc-x-ellipsis": {
                maxWidth: 50, // chỉnh tuỳ ý
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: "16px",
              },
            }}
          />
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
