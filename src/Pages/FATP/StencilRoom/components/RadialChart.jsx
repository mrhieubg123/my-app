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

const RadialChart = ({
  title = "",
  dataFATPErrorDetail = [],
  color = [],
  idata = [],
}) => {
  idata = [
    { STATUS: "OK", TOTALTIME: 80 },
    { STATUS: "NG", TOTALTIME: 20 },
  ];
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
      { outer: "100%", inner: "88%" },
      { outer: "85%", inner: "73%" },
      { outer: "70%", inner: "58%" },
      { outer: "55%", inner: "43%" },
      { outer: "40%", inner: "28%" },
      { outer: "25%", inner: "13%" },
    ],
    []
  );
  const colorConfig = [
    "#2099f5",
    "#ff3110",
    "#219af5",
    "#ff5733",
    "#33ff57",
    "#3357ff",
  ];

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

  const options = React.useMemo(() => {
    const used = (idata.TOTAL / 500000) * 100; // number
    const remain = 100 - used; // number

    return {
      chart: {
        type: "pie",
        custom: {},
        events: {
          render() {
            const chart = this,
              series = chart.series[0];
            const total = series.data.reduce((sum, { y = 0 }) => sum + y, 0);
            let customLabel = chart.options.chart.custom.label;

            if (!customLabel) {
              customLabel = chart.options.chart.custom.label = chart.renderer
                .label(`TOTAL: 100`)

                .add();
            }

            customLabel.css({
              color: theme.palette.primary.conponent,
              textAnchor: "middle",
            });

            const x = series.center[0] + chart.plotLeft,
              y =
                series.center[1] +
                chart.plotTop -
                customLabel.attr("height") / 2;

            customLabel.attr({
              x,
              y,
            });
            // Set font size based on chart diameter
            customLabel.css({
              fontSize: `${series.center[2] / 12}px`,
            });
          },
        },
        backgroundColor: "transparent",
        reflow: true,
        height: parentSize.height,
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      title: {
        text: "",
      },
      tooltip: {
        // pointFormat: "{series.name}: <b>{point.y}</b>",
        pointFormatter: function () {
          return `${this.series.name}: <b>${this.y.toLocaleString(
            "en-US"
          )}</b>`;
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: "pointer",
          borderRadius: 0,
          dataLabels: [
            {
              enabled: true,
              distance: 20,
              format: "{point.name}",
            },
            {
              enabled: true,
              distance: -13,
              formatter: function () {
                return this.y.toLocaleString("en-US");
              },
              style: {
                fontSize: "0.8em",
              },
            },
          ],
          showInLegend: true,
          point: {
            events: {
              click: function () {},
            },
          },
        },
      },
      series: [
        {
          name: "Quanlity",
          colorByPoint: true,
          innerSize: "75%",
          data: [
            {
              name: "Báo phế",
              // y: idata.TOTAL,
              y: 20,
              // color: "#4caf50",
              color: {
                linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 1,
                },
                stops: [
                  [0, "#e77e92"], // đỏ nhạt
                  [1, "#ff2d55"], // đỏ đậm
                ],
              },
            },
            {
              name: "OK",
              // y: Math.max(0, CRITICAL_THRESHOLD - idata.TOTAL),
              y: 80,
              color: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                  [0, "#3498db"], // xanh lá nhạt
                  [1, "#2273a9"], // xanh lá đậm
                ],
              },
            },
          ],
        },
      ],
      credits: {
        enabled: false,
      },
    };
  }, [parentSize, theme, idata]);

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
