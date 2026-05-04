import Highcharts, { Point } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge";
import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ErrorDetail from "./ErrorDetail";
import HiModal from "../../../../components/HiModal";

// Kích hoạt module
HighchartsMore(Highcharts);
SolidGauge(Highcharts);

const RadialChart = ({ title = "", dataFATPErrorDetail = [], color = [], idata = [] }) => {
  const theme = useTheme();
  const parentRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });
  const [showModal1, setShowModal1] = useState(false);

  const totalOK =
    idata.length > 0
      ? idata
        .filter((item) => item.STATUS === "OK")
        .reduce((sum, item) => sum + item.TOTALTIME, 0)
      : 0;
  const totalNG =
    idata.length > 0
      ? idata
        .filter((item) => item.STATUS === "NG")
        .reduce((sum, item) => sum + item.TOTALTIME, 0)
      : 0;

  const total = totalOK * 1 + totalNG * 1;

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
  const radiusConfig = React.useMemo(
    () => [
      { outer: "100%", inner: "83%" },
      { outer: "78%", inner: "61%" },
      { outer: "56%", inner: "39%" },
      { outer: "34%", inner: "17%" },
      { outer: "0%", inner: "0%" },
      { outer: "0%", inner: "0%" },
    ],
    []
  );

  const colorConfig = [
    {
      linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
      stops: [
        [0, "#00c6ff"],
        [1, "#0072ff"],
      ],
    }, // Electric Blue
    {
      linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
      stops: [
        [0, "#ff0844"],
        [1, "#ffb199"],
      ],
    }, // Fiery Red
    "#219af5",
    "#ff5733",
    "#33ff57",
    "#3357ff",
  ];

  const seriesColorsFallback = ["#00c6ff", "#ff0844", "#219af5", "#ff5733"];

  const seriesData = [
    {
      name: "Availability",
      value: (((totalOK * 100) / total) * 1).toFixed(2) * 1,
    },
    {
      name: "DownTime Rate",
      value: (((totalNG * 100) / total) * 1).toFixed(2) * 1,
    },
  ];

  const series = seriesData.map((item, index) => ({
    name: item.name,
    fallbackColor: seriesColorsFallback[index],
    data: [
      {
        color: colorConfig[index],
        radius: radiusConfig[index].outer,
        innerRadius: radiusConfig[index].inner,
        y: item.value,
      },
    ],
    style: { fontSize: "12px" },
  }));

  const options = {
    chart: {
      type: "solidgauge",
      animation: {
        duration: 1200,
      },
      backgroundColor: "transparent",
      reflow: true,
      height: parentSize.height,
    },
    title: {
      text: title,
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: theme.palette.chart.color,
      },
    },
    pane: {
      startAngle: 0,
      endAngle: 360,
      background: seriesData.map((radius, index) => ({
        outerRadius: radiusConfig[index].outer,
        innerRadius: radiusConfig[index].inner,
        backgroundColor: "rgba(150, 150, 150, 0.15)",
        borderWidth: 0,
      })),
    },
    yAxis: {
      min: 0,
      max: 100,
      lineWidth: 0,
      tickPositions: [],
    },
    plotOptions: {
      solidgauge: {
        linecap: "round", // Bo tròn đầu thanh hiện đại
        dataLabels: {
          enabled: true,
          useHTML: true,
          borderWidth: 0,
          align: "center",
          verticalAlign: "middle",
          format: `<div style="text-align:center; border: unset; display: flex; flex-direction: column; gap: 4px;">
                      <span style="font-size:13px; font-weight:800; color:{series.userOptions.fallbackColor}; text-shadow: 0px 1px 2px rgba(0,0,0,0.2);">{series.name}</span>
                      <span style="font-size:16px; font-weight:bold; color: ${theme.palette.chart.color}; text-shadow:none;">{y}%</span>
                  </div>`,
          style: {
            fontSize: "13px",
            border: "none",
            background: "none",
          },
        },
        borderRadius: "50%",
        stickyTracking: false,
        point: {
          events: {
            click: function () {
              setShowModal1((prev) => !prev);
            },
            mouseOver: function () {
              const chart = this.series.chart;
              const point = this;
              chart.update(
                {
                  series: [
                    {
                      dataLabels: {
                        format: `<div style="text-align:center; border: unset; display: flex; flex-direction: column; gap: 4px;">
                                  <span style="font-size:13px; font-weight:800; color:${point.series.userOptions.fallbackColor}; text-shadow: 0px 1px 2px rgba(0,0,0,0.2);">${point.series.name}</span>
                                  <span style="font-size:16px; font-weight:bold; color: ${theme.palette.chart.color}; text-shadow:none;">${point.y}%</span>
                              </div>`,
                        useHTML: true,
                      },
                    },
                  ],
                },
                false
              );
              chart.redraw();
            },
            mouseOut: function () {
              const chart = this.series.chart;
              const point = this;
              chart.update(
                {
                  series: [
                    {
                      dataLabels: {
                        format: `<div style="text-align:center; border: unset; display: flex; flex-direction: column; gap: 4px;">
                                  <span style="font-size:13px; font-weight:800; color:${point.series.userOptions.fallbackColor}; text-shadow: 0px 1px 2px rgba(0,0,0,0.2);">${point.series.name}</span>
                                  <span style="font-size:16px; font-weight:bold; color: ${theme.palette.chart.color}; text-shadow:none;">${point.y}%</span>
                              </div>`,
                        useHTML: true,
                      },
                    },
                  ],
                },
                false
              );
              chart.redraw();
            },
          },
        },
      },
      series: {
        states: {
          inactive: {
            enabled: false,
          },
          hover: {
            enabled: true,
            brightness: 0.1,
          },
        },
      },
    },

    series: series,
    tooltip: {
      enabled: false,
      valueSuffix: "%",
    },
    exporting: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <div ref={parentRef} style={{ height: "100%", display: "block" }}>
      {idata.length > 0 ? (
        <>
          <HiModal
            header={`Error details`}
            open={showModal1}
            onClose={() => setShowModal1(false)}
            widthModal={80}
            heightModal={80}
          >
            <ErrorDetail idata={dataFATPErrorDetail}></ErrorDetail>
          </HiModal>
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

export default React.memo(RadialChart);
