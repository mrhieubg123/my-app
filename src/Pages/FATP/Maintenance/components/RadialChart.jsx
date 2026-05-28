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

const MONTH_ABBR = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

const RadialChart = ({
  title = "",
  dataFATPErrorDetail = [],
  onCallBack,
  idata = [],
}) => {
  const theme = useTheme();
  const parentRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });
  const [showModal1, setShowModal1] = useState(false);

  const currentMonthIndex = new Date().getMonth();

  // 1. Total OK = số record có STATUS = 'approve'
  const totalOK = idata.filter(
    (item) => item.STATUS && item.STATUS.toLowerCase() === "approve"
  );

  // 2. Total Delay = TARGET_MONTH nhỏ hơn tháng hiện tại và STATUS != 'approve'
  const totalDelay = idata.filter((item) => {
    const isApprove = item.STATUS && item.STATUS.toLowerCase() === "approve";
    const targetMonthIndex = MONTH_ABBR.indexOf(item.TARGET_MONTH?.toUpperCase());
    const isBeforeCurrentMonth = targetMonthIndex !== -1 && targetMonthIndex < currentMonthIndex;
    return isBeforeCurrentMonth && !isApprove;
  });

  // 3. Total OnGoing = còn lại
  const totalOnGoing = idata.filter((item) => {
    const isApprove = item.STATUS && item.STATUS.toLowerCase() === "approve";
    const targetMonthIndex = MONTH_ABBR.indexOf(item.TARGET_MONTH?.toUpperCase());
    const isBeforeCurrentMonth = targetMonthIndex !== -1 && targetMonthIndex < currentMonthIndex;
    const isDelay = isBeforeCurrentMonth && !isApprove;
    return !isApprove && !isDelay;
  });

  const total = totalOK.length + totalDelay.length + totalOnGoing.length;

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
                .label("", 0, 0) // text để trống, lát nữa set
                .add();
            }

            // 🔴 Luôn update text ở đây (mỗi lần render)
            customLabel.attr({
              text: `TOTAL<br/><strong>${total}</strong>`,
            });

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
        pointFormat: "{series.name}: <b>{point.y}</b>",
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
              format: "{point.y}",
              style: {
                fontSize: "0.8em",
              },
            },
          ],
          showInLegend: true,
          point: {
            events: {
              click: function () {
                const p = this; // Highcharts Point
                if (p.name === "Approved") {
                  onCallBack(totalOK);
                } else if (p.name === "Ongoing") {
                  onCallBack(totalOnGoing);
                } else {
                  onCallBack(totalDelay);
                }
                // onSliceClick({
                //   name: p.name,
                //   y: p.y,
                //   index: p.index,
                //   color: p.color,
                //   percentage: p.percentage,
                //   category: p.category, // nếu có
                // });
              },
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
              name: "Approved",
              y: totalOK.length,
              // color: "#4caf50",
              color: {
                linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 1,
                },
                stops: [
                  [0, "#66bb6a"], // xanh lá nhạt
                  [1, "#2e7d32"], // xanh lá đậm
                ],
              },
            },
            {
              name: "Ongoing",
              y: totalOnGoing.length,
              color: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                  [0, "#fff176"], // vàng nhạt
                  [1, "#fbc02d"], // vàng đậm
                ],
              },
            },
            {
              name: "Delay",
              y: totalDelay.length,
              color: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                  [0, "#ef9a9a"], // đỏ nhạt
                  [1, "#c62828"], // đỏ đậm
                ],
              },
            },
          ],
        },
      ],
      credits: {
        enabled: false,
      },
    }),
    [theme, parentSize, idata]
  );
  return (
    <div ref={parentRef} style={{ height: "100%", display: "block" }}>
      {[1].length > 0 ? (
        <>
          <HiModal
            header={`Maintenance plan details`}
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
