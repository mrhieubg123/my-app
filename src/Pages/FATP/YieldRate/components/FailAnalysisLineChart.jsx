import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

// Khởi tạo module 3D

const FailAnalysisLineChart = ({ idata }) => {
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

  idata.forEach((item) => {
    const key = item?.TEST_LINE ?? "UNKNOWN";
    const fail = Number(item?.QTY ?? 0);

    tempError2[key] = (tempError2[key] ?? 0) + fail;
  });

  const entries = Object.entries(tempError2)
    .map(([name, y]) => ({
      name,
      y,
    }))
    .sort((a, b) => a.y - b.y);

  // Cấu hình biểu đồ đường
  const options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      reflow: true,
      height: parentSize.height,
      borderWidth: 0,
    },
    title: { text: "" },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    series: [
      {
        colorByPoint: true,
        data: entries,
      },
    ],

    plotOptions: {
      series: {
        name: "Issue",
        allowPointSelect: true,
        borderRadius: 5,
        cursor: "pointer",
        dataLabels: [
          {
            enabled: true,
            distance: 15,
            format: "{point.name}",
          },
          {
            enabled: true,
            distance: "-40%",
            format: "{point.percentage:.1f}%",
            style: {
              fontSize: "0.9em",
              textOutline: "none",
            },
          },
        ],
      },
    },

    credits: { enabled: false },
    exporting: { enabled: false },
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

export default FailAnalysisLineChart;
