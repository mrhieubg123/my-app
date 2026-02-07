import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

// Khởi tạo module 3D

const QuanlityModelChart = ({
  idata = [],
  idata2 = [],
  idata3 = [],
  idata4 = [],
  onSelectModelAnalysis,
  modelAnalysisSelected,
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

  function buildIssue(dataDefectAnalysis = []) {
    const tempError2 = {};

    dataDefectAnalysis.forEach((item) => {
      const key = item?.MODEL_NAME ?? "UNKNOWN";
      const fail = Number(item?.QTY ?? 0);

      tempError2[key] = (tempError2[key] ?? 0) + fail;
    });
    return tempError2;
  }

  function buildModelYieldSeries(DataYeildRate = []) {
    const map = new Map(); // MODEL_NAME -> { total, fail }

    for (const r of DataYeildRate) {
      const key = r?.MODEL_NAME;
      if (!key) continue;

      const total = Number(r?.TOTAL_QTY ?? 0);
      const fail = Number(r?.FAIL_QTY ?? 0);

      const cur = map.get(key) ?? { total: 0, fail: 0 };
      cur.total += total;
      cur.fail += fail;
      map.set(key, cur);
    }

    const categories = [];
    const dataProduct = [];
    const sorted = [...map.entries()].sort((a, b) => b[1].total - a[1].total);

    for (const [modelName, { total }] of sorted) {
      categories.push(modelName);
      dataProduct.push(total);
    }

    return { categories, dataProduct };
  }

  const dataSeries = React.useMemo(() => {
    const { categories, dataProduct } = buildModelYieldSeries(idata);
    const tempError = buildIssue(idata2);
    const dataRateIssue = categories.map((e, index) =>
      dataProduct[index] > 0
        ? Math.round(((tempError[e] ?? 0) / dataProduct[index]) * 100 * 100) /
          100
        : 0
    );
    // console.log("idata3", { idata3, idata4 });
    const { categories: categories2 = [], dataProduct: dataProduct2 = [] } =
      buildModelYieldSeries(idata3);
    const tempError2 = buildIssue(idata4);
    const dataRateIssue2 = categories.map((e, index) => {
      const currentIndex = categories2.indexOf(e);
      return currentIndex !== -1 && dataProduct2[currentIndex] > 0
        ? Math.round(
            ((tempError2[e] ?? 0) / dataProduct2[currentIndex]) * 100 * 100
          ) / 100
        : null;
    });
    if (onSelectModelAnalysis) onSelectModelAnalysis(categories[0]);
    return { categories, dataProduct, dataRateIssue, dataRateIssue2 };
  }, [idata, idata2, idata3, idata4]);

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

  // categories đang là mảng ["WK46", ...]
  const columnData = dataSeries.categories.map((cat, i) => ({
    y: dataSeries.dataProduct?.[i] ?? 0,
    color:
      cat === modelAnalysisSelected ? columnSelectedColor : columnBaseColor,
  }));

  const rateData = dataSeries.categories.map((cat, i) => ({
    y: dataSeries.dataRateIssue?.[i] ?? 0,
    dataLabels:
      dataSeries.dataRateIssue2?.[i] === null ||
      dataSeries.dataRateIssue?.[i] > dataSeries.dataRateIssue2?.[i]
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
      categories: dataSeries.categories,
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
          style: {
            color: Highcharts.getOptions().colors[0],
          },
        },
        tickAmount: 5,
        opposite: false,
      },
    ],
    series: [
      {
        name: "Total quanlity",
        type: "column",
        borderWidth: 0,
        color: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "#2099f5"],
            [1, "#2099f500"],
          ],
        },
        yAxis: 1,
        data: columnData,
        dataLabels: {
          color: "#00e396",
          fontSize: "11px",
        },
      },
      {
        name: "Fail rate",
        type: "spline",
        yAxis: 0,
        data: rateData,
        color: "#ff3110",
        // dataLabels: {
        //   color: "#ff3110",
        //   fontSize: "11px",
        // },
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
              if (this.category !== modelAnalysisSelected)
                onSelectModelAnalysis(this.category);
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

export default QuanlityModelChart;
