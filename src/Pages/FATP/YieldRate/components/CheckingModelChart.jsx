import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import { Box, Switch, Typography, GlobalStyles } from "@mui/material";
// Khởi tạo module 3D

const CheckingModelChart = ({
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

  function buildYieldChartSeries(data = {}) {
    const categories = Object.keys(data); // nếu muốn đúng thứ tự tuần thì có thể sort custom

    const dataProduct = [];
    const dataModelIssue = [];
    const dataSlotIssue = [];

    for (const [index, week] of categories.entries()) {
      const rows = Array.isArray(data[week])
        ? data[week].filter(
          (e) =>
            e.ERROR_DESC === issueSelected && e.MODEL_NAME === modelSelected
        )
        : [];

      const totalQtySum = listQtyProduct[index];
      let failQtyModelSum = 0;
      let failQtySlotSum = 0;

      for (const r of rows) {
        const fail = Number(r?.QTY ?? 0);

        failQtyModelSum += fail;
        if (r?.LOCATION_CODE === slotSelected) failQtySlotSum += fail;
      }

      dataProduct.push(totalQtySum);

      // % issue = total FAIL / total TOTAL * 100
      const issueModelPct =
        totalQtySum > 0
          ? Number(((failQtyModelSum / totalQtySum) * 100).toFixed(2))
          : 0;
      dataModelIssue.push(issueModelPct);
      const issueSlotPct =
        totalQtySum > 0
          ? Number(((failQtySlotSum / totalQtySum) * 100).toFixed(2))
          : 0;
      dataSlotIssue.push(issueSlotPct);
    }

    return { categories, dataProduct, dataModelIssue, dataSlotIssue };
  }

  const dataSeries = React.useMemo(() => {
    return buildYieldChartSeries(idata);
  }, [idata, slotSelected, modelSelected, issueSelected]);

  const rateModelData = listWeek.map((cat, i) => ({
    y: dataSeries.dataModelIssue?.[8 - listWeek.length + i] ?? 0,
    dataLabels:
      i === 0 ||
        dataSeries.dataModelIssue?.[8 - listWeek.length + i] > dataSeries.dataModelIssue?.[8 - listWeek.length + i - 1]
        ? {
          color: "#ff3110",
          fontSize: "11px",
        }
        : {
          color: "#00e396",
          fontSize: "11px",
        },
  }));

  const rateSlotData = listWeek.map((cat, i) => ({
    y: dataSeries.dataSlotIssue?.[8 - listWeek.length + i] ?? 0,
    dataLabels:
      i === 0 ||
        dataSeries.dataSlotIssue?.[8 - listWeek.length + i] > dataSeries.dataSlotIssue?.[8 - listWeek.length + i - 1]
        ? {
          color: "#ff3110",
          fontSize: "11px",
        }
        : {
          color: "#00e396",
          fontSize: "11px",
        },
  }));

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
      categories: listWeek,
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
      // opposite: true,
    },
    series: [
      {
        name: modelSelected,
        type: "line",
        data: rateModelData,
        color: "#ff3110",
        // dataLabels: {
        //   color: "#ff3110",
        //   fontSize: "11px",
        // },
      },
      {
        name: slotSelected,
        type: "line",
        data: rateSlotData,
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

export default CheckingModelChart;
