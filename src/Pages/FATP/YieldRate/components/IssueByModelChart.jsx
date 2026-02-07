import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import { Box, Switch, Typography, GlobalStyles } from "@mui/material";
// Khởi tạo module 3D

const IssueByModelChart = ({
  idata = [1, 2, 3],
  modelSelected,
  issueSelected,
  onSelectModel,
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

  const columnBaseColor = {
    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
    stops: [
      [0, "#2099f5"],
      [1, "#2099f500"],
    ],
  };

  const columnSelectedColor = {
    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
    stops: [
      [0, "#e74c3c"], // màu nổi bật (bạn đổi theo ý)
      [1, "#e74c3c00"],
    ],
  };

  const tempError2 = {};
  let totalError = 0;

  idata
    .filter((e) => e.ERROR_DESC === issueSelected)
    .forEach((item) => {
      if (tempError2[item.MODEL_NAME]) {
        tempError2[item.MODEL_NAME] += item.QTY;
      } else {
        tempError2[item.MODEL_NAME] = item.QTY;
      }
      totalError += item.QTY;
    });

  const entries = Object.entries(tempError2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, Math.min(Object.entries(tempError2).length, 10)); // sort theo QTY giảm dần

  const categories = [];
  const dataProduct = [];
  const dataIssue = [];

  let cumulative = 0;

  entries.forEach(([errorDesc, qty]) => {
    categories.push(errorDesc);
    dataProduct.push(qty);

    const percent = totalError > 0 ? (qty / totalError) * 100 : 0;
    cumulative += percent;

    // làm tròn 2 chữ số thập phân
    dataIssue.push(Math.round(cumulative * 100) / 100);
  });

  const columnData = categories.map((cat, i) => ({
    y: dataProduct[i] ?? 0,
    color: cat === modelSelected ? columnSelectedColor : columnBaseColor,
  }));

  useEffect(() => {
    if (categories.length > 0 && modelSelected === "") {
      onSelectModel(categories[0]);
    }
  }, [categories, modelSelected]);

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
    yAxis: [
      {
        min: 0,
        max: 100,
        gridLineWidth: 0,
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
        tickAmount: 5,
        opposite: true,
      },
      {
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
        },
        tickAmount: 5,
        opposite: false,
      },
    ],
    series: [
      {
        name: "Issue",
        type: "column",
        borderWidth: 0,
        yAxis: 1,
        data: columnData,
        dataLabels: {
          color: "#00e396",
          fontSize: "11px",
        },
      },
      {
        name: "Rate",
        type: "line",
        yAxis: 0,
        data: dataIssue,
        color: "#ff3110",
        dataLabels: {
          color: "#ff3110",
          fontSize: "11px",
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
              onSelectModel(this.category);
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
      {idata.length > 0 ? (
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

export default IssueByModelChart;
