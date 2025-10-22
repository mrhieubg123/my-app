import Highcharts, { Point } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge";
import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HiModal from "../../../../components/HiModal";
import TableError from "./tableError";

// Kích hoạt module
HighchartsMore(Highcharts);
SolidGauge(Highcharts);

const RadialChart = ({
  title = "",
  idata = [],
  idata2 = [],
  idata3 = [],
  onShowModal,
}) => {
  const theme = useTheme();
  const parentRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });
  const [showModal2, setShowModal2] = useState(false);
  const [modalData, setModalData] = useState({ title: "", items: [] });

  const totalWaitReturn = idata.length;
  const totalWaitLCR =
    idata2.length > 0
      ? idata2.filter((item) => item.status === "LOCK WAIT UNLOCK").length
      : 0;
  const totalWaitCount = idata3.length;
  const total = totalWaitReturn + totalWaitLCR + totalWaitCount;

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
      name: "Wait return",
      value: (((totalWaitReturn * 100) / total) * 1).toFixed(2) * 1,
      total: totalWaitReturn,
    },
    {
      name: "Wait LCR",
      value: (((totalWaitLCR * 100) / total) * 1).toFixed(2) * 1,
      total: totalWaitLCR,
    },
    {
      name: "Wait count",
      value: (((totalWaitCount * 100) / total) * 1).toFixed(2) * 1,
      total: totalWaitCount,
    },
  ];

  const series = seriesData.map((item, index) => ({
    name: item.name,
    total: item.total,
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
      type: "pie", // Xác định loại biểu đồ là tròn
      animation: {
        duration: 1000,
      },
      backgroundColor: "transparent",
      reflow: true,
      height: parentSize.height,
    },
    title: {
      text: "",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b>",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.y}", // Hiển thị tên và phần trăm
          style: {
            fontSize: "0.8em",
          },
        },
        point: {
          events: {
            click: function (event) {
              // `event.point.name` sẽ là 'List A' hoặc 'List B'
              if (event.point.name === "Wait return") {
                console.log("click Wait return");
                onShowModal(idata);
              } else if (event.point.name === "Wait LCR") {
                console.log("click Wait LCR");
                onShowModal(
                  idata2.filter((item) => item.status === "LOCK WAIT UNLOCK")
                );
              } else if (event.point.name === "Wait count") {
                console.log("click Wait count");
                onShowModal(idata3);
              }
              // setShowModal2(true);
            },
          },
        },
      },
    },
    series: [
      {
        name: "Qty",
        colorByPoint: true,
        data: [
          {
            name: "Wait return",
            y: totalWaitReturn,
          },
          {
            name: "Wait LCR",
            y: totalWaitLCR,
          },
          {
            name: "Wait count",
            y: totalWaitCount,
          },
        ],
      },
    ],
    exporting: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <div ref={parentRef} style={{ height: "100%" }}>
      {idata.length > 0 ? (
        <>
          <HiModal
            header={`List detail`}
            open={showModal2}
            onClose={() => setShowModal2(false)}
            widthModal={80}
            heightModal={80}
          >
            <TableError idata={modalData}></TableError>
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

export default RadialChart;
