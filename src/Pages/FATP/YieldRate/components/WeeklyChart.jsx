import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import HiModal from "../../../../components/HiModal";
import HiBox from "../../../../components/HiBox";
import QuanlityModelChart from "../components/QuanlityModelChart";
import QuanlityDailyByModelChart from "../components/QuanlityDailyByModelChart";
import FailAnalysisModelChart from "../components/FailAnalysisModelChart";
import FailAnalysisLineChart from "../components/FailAnalysisLineChart";

// Khởi tạo module 3D

const WeeklyChart = ({
  idata = {},
  idata2 = {},
  listWeek = [],
  onSelectWeek,
  setDataQtyProduct,
  weekSelected,
}) => {
  const theme = useTheme();
  const parentRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });
  const [showModal1, setShowModal1] = useState(false);
  const [modelAnalysisSelected, setModelAnalysisSelected] = useState("");

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

  function buildYieldChartSeries(DataYeildRate = {}, DataDefectAnalysis = {}) {
    const categories = Object.keys(DataYeildRate); // nếu muốn đúng thứ tự tuần thì có thể sort custom
    const categories2 = Object.keys(DataDefectAnalysis); // nếu muốn đúng thứ tự tuần thì có thể sort custom

    const dataProduct = [];
    const dataIssue = [];

    for (const week of categories) {
      const rows = Array.isArray(DataYeildRate[week])
        ? DataYeildRate[week]
        : [];

      let totalQtySum = 0;
      let failQtySum =
        ((categories2.length > 0 && idata2[week] !== null
          ? idata2[week][0].QTY
          : 0) /
          (categories2.length > 0 && idata2[week] !== null
            ? idata2[week][0]["Rate(%)"]
            : 1)) *
        100;

      for (const r of rows) {
        const total = Number(r?.TOTAL_QTY ?? 0);
        // const fail = Number(r?.FAIL_QTY ?? 0);

        totalQtySum += total;
        // failQtySum += fail;
      }

      dataProduct.push(totalQtySum);

      // % issue = total FAIL / total TOTAL * 100
      const issuePct =
        totalQtySum > 0
          ? Number(((failQtySum / totalQtySum) * 100).toFixed(2))
          : 0;
      dataIssue.push(issuePct);
    }

    return { categories, dataProduct, dataIssue };
  }

  const dataSeries = React.useMemo(() => {
    const result = buildYieldChartSeries(idata, idata2);
    setDataQtyProduct(result.dataProduct);
    return result;
  }, [idata, idata2]);

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
  const columnData = listWeek.map((cat, i) => ({
    y: dataSeries.dataProduct?.[8 - listWeek.length + i] ?? 0,
    color: cat === weekSelected ? columnSelectedColor : columnBaseColor,
  }));

  const rateData = listWeek.map((cat, i) => ({
    y: dataSeries.dataIssue?.[8 - listWeek.length + i] ?? 0,
    dataLabels:
      i === 0 || dataSeries.dataIssue?.[8 - listWeek.length + i] > dataSeries.dataIssue?.[8 - listWeek.length + i - 1]
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
        name: "Production",
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
        name: "Fail",
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
              if (this.category !== weekSelected) onSelectWeek(this.category);
              else setShowModal1(true);
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
          <HiModal
            header={`Fail Analysis`}
            open={showModal1}
            onClose={() => setShowModal1(false)}
            widthModal={60}
            heightModal={85}
          >
            <Grid container columns={12}>
              <HiBox
                lg={12}
                md={12}
                xs={12}
                alarn={false}
                header={"Total Quanlity"}
                height="40vh"
                variant="filled"
                note={weekSelected}
              >
                <QuanlityModelChart
                  idata={idata[weekSelected]}
                  idata2={idata2[weekSelected]}
                  idata3={
                    getWeekDataAndPrev(idata, weekSelected)?.previous?.value
                  }
                  idata4={
                    getWeekDataAndPrev(idata2, weekSelected)?.previous?.value
                  }
                  modelAnalysisSelected={modelAnalysisSelected}
                  onSelectModelAnalysis={setModelAnalysisSelected}
                />
              </HiBox>
              <HiBox
                lg={12}
                md={12}
                xs={12}
                alarn={false}
                header={"Quanlity Daily"}
                height="40vh"
                variant="filled"
                note={modelAnalysisSelected}
              >
                <QuanlityDailyByModelChart
                  idata={idata[weekSelected]}
                  idata2={idata2[weekSelected]}
                  weekSelected={weekSelected}
                  modelAnalysisSelected={modelAnalysisSelected}
                />
              </HiBox>
              {/* <HiBox
                lg={6}
                md={6}
                xs={12}
                alarn={false}
                header={"Fail rate by model"}
                height="40vh"
                variant="filled"
                note={weekSelected}
              >
                <FailAnalysisModelChart idata={idata2[weekSelected]} />
              </HiBox>
              <HiBox
                lg={6}
                md={6}
                xs={12}
                alarn={false}
                header={"Fail rate by line"}
                height="40vh"
                variant="filled"
                note={weekSelected}
              >
                <FailAnalysisLineChart idata={idata2[weekSelected]} />
              </HiBox> */}
            </Grid>
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

export default WeeklyChart;

const getWeekDataAndPrev = (dataDefectAnalysis = [], weekSelected = "") => {
  const keys = Object.keys(dataDefectAnalysis); // ["2026/W1","2026/W2","2026/W3",...]

  const currentIndex = keys.indexOf(weekSelected);

  const currentData =
    currentIndex !== -1 ? dataDefectAnalysis[weekSelected] : null;

  const prevKey = currentIndex > 0 ? keys[currentIndex - 1] : null;

  const prevData = prevKey ? dataDefectAnalysis[prevKey] : null;

  return {
    current: {
      key: weekSelected,
      value: currentData,
    },
    previous: prevKey
      ? {
        key: prevKey,
        value: prevData,
      }
      : null,
  };
};
