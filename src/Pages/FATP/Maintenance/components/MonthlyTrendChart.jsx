import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const MONTH_ABBR = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

const MonthlyTrendChart = ({ idata = [] }) => {
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

  const chartData = useMemo(() => {
    // Initialize monthly counts
    const monthlyCounts = MONTH_ABBR.map((month) => ({
      month,
      target: 0,
      completed: 0,
    }));

    (idata || []).forEach((item) => {
      const dateStr = item.DATE_CHECK;
      if (!dateStr) return;
      
      const monthIndex = Number(dateStr.slice(5, 7)) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyCounts[monthIndex].target += 1;
        if (item.STATUS && item.STATUS.trim().toUpperCase() === "OK") {
          monthlyCounts[monthIndex].completed += 1;
        }
      }
    });

    return {
      categories: monthlyCounts.map(d => d.month),
      targetData: monthlyCounts.map(d => d.target),
      completedData: monthlyCounts.map(d => d.completed),
    };
  }, [idata]);

  const options = useMemo(() => ({
    chart: {
      backgroundColor: "transparent",
      reflow: true,
      height: parentSize.height || 260,
      type: "areaspline"
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: chartData.categories,
      labels: {
        style: {
          fontSize: "11px",
          color: theme.palette.chart?.color || "#757575",
        },
      },
      gridLineWidth: 0,
    },
    yAxis: {
      title: {
        text: "Số lượng máy",
        style: {
          color: theme.palette.chart?.color || "#757575",
          fontSize: "11px"
        }
      },
      labels: {
        style: {
          color: theme.palette.chart?.color || "#757575",
        }
      },
      gridLineDashStyle: "Dash",
      gridLineColor: "rgba(0,0,0,0.05)",
      tickAmount: 4,
    },
    tooltip: {
      shared: true,
      borderRadius: 8,
      shadow: true,
    },
    legend: {
      align: "center",
      verticalAlign: "bottom",
      itemStyle: {
        color: theme.palette.chart?.color || "#757575",
        fontWeight: "600",
        fontSize: "11px"
      },
    },
    plotOptions: {
      areaspline: {
        fillOpacity: 0.1,
        marker: {
          radius: 4,
          states: {
            hover: {
              radius: 6
            }
          }
        }
      }
    },
    series: [
      {
        name: "Kế hoạch (Target)",
        data: chartData.targetData,
        color: "#2196f3",
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "rgba(33, 150, 243, 0.2)"],
            [1, "rgba(33, 150, 243, 0.0)"]
          ]
        }
      },
      {
        name: "Đã hoàn thành (Actual)",
        data: chartData.completedData,
        color: "#4caf50",
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "rgba(76, 175, 80, 0.2)"],
            [1, "rgba(76, 175, 80, 0.0)"]
          ]
        }
      }
    ],
    credits: {
      enabled: false,
    },
  }), [theme, parentSize, chartData]);

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
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">Không có dữ liệu biểu diễn xu hướng</Typography>
        </Box>
      )}
    </div>
  );
};

export default React.memo(MonthlyTrendChart);
