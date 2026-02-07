import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { getAuthorizedAxiosIntance } from "../../../../utils/axiosConfig";

const axiosInstance = await getAuthorizedAxiosIntance();

// Khởi tạo module 3D

const QuanlityDailyByModelChart = ({
  idata,
  idata2,
  weekSelected,
  modelAnalysisSelected,
}) => {
  const theme = useTheme();
  const parentRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });
  const [dataYeildRateDay, setDataYeildRateDay] = useState({});

  const fetchYeildRate = async (model) => {
    return data2.Data;
    try {
      const response = await axiosInstance.post(
        "api/YeildRate/getYeildRate",
        model
      );
      return response.data.Data || [];
    } catch (error) {
      console.log(error.message);
    }
    return [];
  };

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

  useEffect(() => {
    if (weekSelected === "") return;
    const load = async () => {
      const ld = getDatesFromYearWeek(weekSelected);

      const entries = await Promise.all(
        ld.map(async (day) => {
          const model = { ...day, groupList: "PTHVI" };
          const data = await fetchYeildRate(model);
          return [day.dateFrom, data];
        })
      );
      const result = Object.fromEntries(entries);
      console.log("dataYeildRateDay", result);
      setDataYeildRateDay(result);
    };
    load();
  }, [weekSelected]);

  const dataSeries = React.useMemo(() => {
    return analyzeDataByModel(dataYeildRateDay, modelAnalysisSelected);
  }, [dataYeildRateDay, modelAnalysisSelected]);

  const rateData = dataSeries.categories.map((cat, i) => ({
    y: dataSeries.dataRateIssue?.[i] ?? 0,
    dataLabels:
      i === 0 || dataSeries.dataRateIssue?.[i] > dataSeries.dataRateIssue?.[i - 1]
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
        data: dataSeries.dataProduct,
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

export default QuanlityDailyByModelChart;

function analyzeDataByModel(rawData, modelName) {
  const categories = [];
  const dataProduct = [];
  const dataRateIssue = [];

  Object.entries(rawData).forEach(([dateKey, records]) => {
    // categories
    categories.push(formatCategory(dateKey));

    let totalQty = 0;
    let failQty = 0;

    records.forEach((item) => {
      if (item.MODEL_NAME === modelName) {
        totalQty += item.TOTAL_QTY || 0;
        failQty += item.FAIL_QTY || 0;
      }
    });

    dataProduct.push(totalQty);

    const rate =
      totalQty === 0 ? 0 : Number(((failQty / totalQty) * 100).toFixed(2));
    dataRateIssue.push(rate);
  });

  return {
    categories,
    dataProduct,
    dataRateIssue,
  };
}

function formatCategory(dateStr) {
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);

  const date = new Date(`${year}-${month}-${day}`);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function getDatesFromYearWeek(input) {
  const [yearStr, weekStr] = input.split("/WK");
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekStr, 10);

  // ISO week: tuần 1 là tuần có ngày 4/1
  const jan4 = new Date(year, 0, 4);
  const jan4Day = jan4.getDay() || 7; // CN = 7

  // Thứ 2 của tuần 1
  const week1Monday = new Date(jan4);
  week1Monday.setDate(jan4.getDate() - jan4Day + 1);

  // Thứ 2 của tuần cần tìm
  const targetMonday = new Date(week1Monday);
  targetMonday.setDate(week1Monday.getDate() + (week - 1) * 7);

  const result = [];

  for (let i = 0; i < 7; i++) {
    const from = new Date(targetMonday);
    from.setDate(targetMonday.getDate() + i);
    from.setHours(7, 30, 0, 0);

    const to = new Date(from);
    to.setDate(from.getDate() + 1);

    result.push({
      dateFrom: formatDate(from),
      dateTo: formatDate(to),
    });
  }

  return result;
}

function formatDate(date) {
  const pad = (n) => n.toString().padStart(2, "0");
  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes())
  );
}

const data2 = {
  Code: "1",
  Message:
    "OK QUERY_YEILD_RATE Q_GROUP_PIVOT: Q_FIELD_SELECT:R.LINE_NAME,R.SECTION_NAME,R.GROUP_NAME,",
  Data: [
    {
      MODEL_NAME: "5605707AT00",
      LINE_NAME: "AP6",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 0.0,
      FAIL_QTY: 1.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 1.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "             .00",
      REPASS_QTY: 0.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "5608407AT00",
      LINE_NAME: "PT1",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 966.0,
      FAIL_QTY: 12.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 978.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "           98.77",
      REPASS_QTY: 0.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "5612369AT00",
      LINE_NAME: "AP3",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 3086.0,
      FAIL_QTY: 0.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 3086.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "          100.00",
      REPASS_QTY: 0.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "5612369AT00",
      LINE_NAME: "AP4",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 480.0,
      FAIL_QTY: 0.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 480.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "          100.00",
      REPASS_QTY: 0.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "6339224AT00",
      LINE_NAME: "AP4",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 5066.0,
      FAIL_QTY: 3.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 5069.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "           99.94",
      REPASS_QTY: 0.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "6345113AT00",
      LINE_NAME: "AP6",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 2374.0,
      FAIL_QTY: 0.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 2374.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "          100.00",
      REPASS_QTY: 0.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "6353191AT00",
      LINE_NAME: "AP6",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 2428.0,
      FAIL_QTY: 131.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 2559.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "           94.88",
      REPASS_QTY: 109.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "BGW620-7001T00",
      LINE_NAME: "AP3",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 1111.0,
      FAIL_QTY: 30.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 1141.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "           97.37",
      REPASS_QTY: 25.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "BGW620-7002T00",
      LINE_NAME: "AP3",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 2131.0,
      FAIL_QTY: 22.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 2153.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "           98.98",
      REPASS_QTY: 19.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "BGW620-7002T00",
      LINE_NAME: "AP4",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 2.0,
      FAIL_QTY: 0.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 2.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "          100.00",
      REPASS_QTY: 0.0,
      REFAIL_QTY: 0.0,
    },
  ],
};
