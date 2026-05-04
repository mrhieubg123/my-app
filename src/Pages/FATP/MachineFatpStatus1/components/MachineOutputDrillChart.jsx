import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, Typography } from "@mui/material";

const MachineOutputDrillChart = ({ weeklyData = [], parentSize, theme }) => {
  const [drillStack, setDrillStack] = React.useState([]);

  const secondOfDay = 27600;

  const toPercent = (value) => Number(((value || 0) * 100).toFixed(2));

  const toCycleTimeDay = (value) => Number((secondOfDay / value).toFixed(2));

  const toCycleTimeHour = (value, key) => {
    if (key === "11:30" ) return 0;
    if (key === "15:30" || key === "10:30")
      return Number((3000 / value).toFixed(2));
    return Number((3600 / value).toFixed(2));
  };

  const getWeekItem = React.useCallback(
    (weekKey) => weeklyData.find((w) => w.week === weekKey),
    [weeklyData],
  );

  const getDayItem = React.useCallback(
    (dayKey) => {
      for (const week of weeklyData) {
        const found = (week.days || []).find((d) => d.day === dayKey);
        if (found) return found;
      }
      return null;
    },
    [weeklyData],
  );

  const getChartViewData = React.useCallback(() => {
    // Level 1: WEEK
    if (drillStack.length === 0) {
      return {
        title: "Weekly View",
        categories: weeklyData.map((w) => w.week),
        columnData: weeklyData.map((w) => ({
          name: w.week,
          y: w.value || 0,
          custom: {
            type: "week",
            key: w.week,
          },
        })),
        lineData: weeklyData.map((w) => ({
          name: w.week,
          y: toPercent(w.failRate),
        })),
      };
    }

    // Level 2: DAY
    if (drillStack.length === 1 && drillStack[0].type === "week") {
      const weekItem = getWeekItem(drillStack[0].key);

      if (!weekItem) {
        return {
          title: "",
          categories: [],
          columnData: [],
          lineData: [],
          cycleTimeData: [],
        };
      }

      return {
        title: `Week: ${weekItem.week}`,
        categories: (weekItem.days || []).map((d) => d.day),
        columnData: (weekItem.days || []).map((d) => ({
          name: d.day,
          y: d.value || 0,
          custom: {
            type: "day",
            key: d.day,
          },
        })),
        lineData: (weekItem.days || []).map((d) => ({
          name: d.day,
          y: toPercent(d.failRate),
        })),
        cycleTimeData: (weekItem.days || []).map((d) => ({
          name: d.day,
          y: d.value !== null && d.value !== 0 ? toCycleTimeDay(d.value) : 0,
        })),
      };
    }

    // Level 3: HOUR
    if (drillStack.length === 2 && drillStack[1].type === "day") {
      const dayItem = getDayItem(drillStack[1].key);

      if (!dayItem) {
        return {
          title: "",
          categories: [],
          columnData: [],
          lineData: [],
          cycleTimeData: [],
        };
      }

      return {
        title: `Day: ${dayItem.day}`,
        categories: (dayItem.hours || []).map((h) => h.time),
        columnData: (dayItem.hours || []).map((h) => ({
          name: h.time,
          y: h.value || 0,
        })),
        lineData: (dayItem.hours || []).map((h) => ({
          name: h.time,
          y: toPercent(h.failRate),
        })),
        cycleTimeData: (dayItem.hours || []).map((h) => ({
          name: h.time,
          y:
            h.value !== null && h.value !== 0
              ? toCycleTimeHour(h.value, h.time)
              : 0,
        })),
      };
    }

    return {
      title: "",
      categories: [],
      columnData: [],
      lineData: [],
    };
  }, [drillStack, weeklyData, getWeekItem, getDayItem]);

  const chartViewData = React.useMemo(
    () => getChartViewData(),
    [getChartViewData],
  );

  const handleDrill = React.useCallback((point) => {
    const custom = point.custom;
    if (!custom?.type || !custom?.key) return;

    if (custom.type === "week") {
      setDrillStack([{ type: "week", key: custom.key }]);
      return;
    }

    if (custom.type === "day") {
      setDrillStack((prev) => [...prev, { type: "day", key: custom.key }]);
    }
  }, []);

  const handleBack = React.useCallback(() => {
    setDrillStack((prev) => prev.slice(0, -1));
  }, []);

  const isDayView = drillStack.length > 0;
  // đổi lại theo logic của bạn, ví dụ:
  // const isDayView = drillStack.length === 0;

  const options = React.useMemo(() => {
    // 1. Cột Output (Sản lượng) - Xanh Cyan chuyển sang Xanh Dương đậm (Electric Blue)
    const outputGradient = {
      linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
      stops: [
        [0, "#00c6ff"],
        [1, "#0072ff"],
      ],
    };

    // 2. Đường Tỷ lệ lỗi (Fail Rate) - Đỏ rực lửa (Fiery Red)
    const failRateGradient = {
      linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
      stops: [
        [0, "#ff0844"],
        [1, "#ffb199"],
      ],
    };

    // 3. Đường Chu kỳ (Cycle Time) - Vàng hoàng kim chuyển Cam (Golden Orange)
    const cycleTimeGradient = {
      linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
      stops: [
        [0, "#f6d365"],
        [1, "#fda085"],
      ],
    };

    const yAxis = [
      {
        title: {
          text: "Output",
          style: { color: theme.palette.chart.color, fontSize: "11px", fontWeight: "bold" },
        },
        labels: { style: { fontSize: "12px", color: theme.palette.chart.color } },
        tickAmount: 3,
      },
      {
        title: {
          text: "Fail Rate (%)",
          style: { color: theme.palette.chart.color, fontSize: "11px", fontWeight: "bold" },
        },
        labels: {
          format: "{value}%",
          style: { fontSize: "12px", color: theme.palette.chart.color },
        },
        opposite: true,
        tickAmount: 3,
      },
    ];

    if (isDayView) {
      yAxis.push({
        title: {
          text: "Cycle Time (s)",
          style: { color: theme.palette.chart.color, fontSize: "11px", fontWeight: "bold" },
        },
        labels: {
          format: "{value}s",
          style: { fontSize: "12px", color: theme.palette.chart.color },
        },
        opposite: true,
        gridLineWidth: 0,
        offset: 55,
      });
    }

    const series = [
      {
        name: "Output",
        type: "column",
        yAxis: 0,
        color: outputGradient,
        borderRadius: 4, // Bo góc cột nhìn hiện đại hơn
        data: chartViewData.columnData,
      },
      {
        name: "Fail Rate (%)",
        type: "spline", // Spline làm đường cong mượt mà thay vì gấp khúc
        yAxis: 1,
        color: failRateGradient,
        lineWidth: 4,
        marker: {
          enabled: true,
          radius: 5,
          fillColor: "#ff0844",
          lineColor: "#fff",
          lineWidth: 2,
          symbol: "circle",
        },
        shadow: {
          color: "rgba(255, 8, 68, 0.4)",
          width: 6,
          offsetX: 0,
          offsetY: 3,
        },
        data: chartViewData.lineData,
      },
    ];

    if (isDayView) {
      series.push({
        name: "Cycle Time (s)",
        type: "spline",
        yAxis: 2,
        color: cycleTimeGradient,
        lineWidth: 4,
        dashStyle: "Solid",
        marker: {
          enabled: true,
          radius: 5,
          fillColor: "#fd7e14",
          lineColor: "#fff",
          lineWidth: 2,
          symbol: "diamond",
        },
        shadow: {
          color: "rgba(246, 211, 101, 0.4)",
          width: 6,
          offsetX: 0,
          offsetY: 3,
        },
        data: chartViewData.cycleTimeData || [],
        tooltip: {
          valueSuffix: " s",
        },
        dataLabels: {
          enabled: true,
          formatter: function () {
            return `${this.y}s`;
          },
          style: {
            color: theme.palette.chart.color,
            textOutline: "none",
            fontWeight: "bold",
          },
        },
      });
    }

    return {
      chart: {
        backgroundColor: "transparent",
        reflow: true,
        height: parentSize?.height || 300,
        borderWidth: 0,
      },
      title: { text: "" },
      xAxis: {
        categories: chartViewData.categories,
        labels: { style: { fontSize: "12px", color: theme.palette.chart.color, fontWeight: "bold" } },
        lineColor: theme.palette.chart.color,
        tickColor: theme.palette.chart.color,
      },
      yAxis,
      tooltip: {
        shared: true,
        backgroundColor: theme.palette.mode === "dark" ? "rgba(30, 30, 30, 0.9)" : "rgba(255, 255, 255, 0.95)",
        borderRadius: 8,
        borderColor: theme.palette.divider,
        shadow: true,
      },
      plotOptions: {
        series: { animation: true },
        column: {
          cursor: drillStack.length < 2 ? "pointer" : "default",
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            color: theme.palette.chart.color,
            style: { color: theme.palette.chart.color, textOutline: "none", fontWeight: "bold" },
          },
          point: {
            events: {
              click: function () {
                handleDrill(this);
              },
            },
          },
        },
        spline: {
          dataLabels: {
            enabled: true,
            style: { color: theme.palette.chart.color, textOutline: "none", fontWeight: "bold" },
          },
        },
      },
      series,
      credits: { enabled: false },
      exporting: { enabled: false },
      legend: {
        align: "center",
        verticalAlign: "top",
        itemStyle: { color: theme.palette.chart.color, fontWeight: "bold" },
      },
    };
  }, [
    chartViewData,
    chartViewData.categories,
    chartViewData.columnData,
    chartViewData.lineData,
    chartViewData.cycleTimeData,
    chartViewData.view,
    drillStack.length,
    handleDrill,
    parentSize?.height,
    theme.palette.chart.color,
    theme.palette.divider,
    theme.palette.mode,
  ]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          mb: 1,
          gap: 1,
        }}
      >
        {drillStack.length > 0 && (
          <Typography
            onClick={handleBack}
            sx={{
              cursor: "pointer",
              color: theme.palette.primary.main,
              fontWeight: 600,
              userSelect: "none",
            }}
          >
            ← Back
          </Typography>
        )}

        <Typography
          sx={{
            color: theme.palette.chart.color,
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {chartViewData.title}
        </Typography>
      </Box>

      <HighchartsReact highcharts={Highcharts} options={options} />
    </Box>
  );
};

export default MachineOutputDrillChart;
