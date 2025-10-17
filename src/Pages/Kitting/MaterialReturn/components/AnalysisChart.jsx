import React, { useEffect, useRef, useState } from "react";
import Highcharts, { format } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { BorderColor } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";

function HoursAddOne(date) {
  const idate = new Date(date.replace(" ", "T"));
  let year = idate.getFullYear();
  let month = String(idate.getMonth() + 1).padStart(2, "0");
  let date1 = String(idate.getDate()).padStart(2, "0");
  let ihours = String(idate.getHours() + 1).padStart(2, "0");
  let minutes = String(idate.getMinutes()).padStart(2, "0");
  let seconds = String(idate.getSeconds()).padStart(2, "0");
  const resultTime = `${ihours}:${minutes}:${seconds}`;
  return resultTime;
}

const AnalysisChart = ({ idata = [], idata2 = [], queryDate, onShowModal }) => {
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

  const temp = {};
  idata2 &&
    idata2
      .filter(
        (item) =>
          dayjs(item.end_time).format("YYYY-MM-DD") ===
          dayjs(queryDate).format("YYYY-MM-DD")
      )
      .forEach((item) => {
        const dateT = dayjs(item.end_time).format("HH:00");
        if (temp[dateT]) {
          temp[dateT].counted += 1;
          if (item.status === "LOCK WAIT UNLOCK") temp[dateT].waitLCR += 1;
        } else {
          temp[dateT] = {
            DateT: dateT,
            counted: 1,
            waitLCR: item.status === "LOCK WAIT UNLOCK" ? 1 : 0,
            waitReturn: 0,
            time: item.end_time,
          };
        }
      });
  idata &&
    idata
      .filter(
        (item) =>
          dayjs(item.end_time).format("YYYY-MM-DD") ===
          dayjs(queryDate).format("YYYY-MM-DD")
      )
      .forEach((item) => {
        const dateT = dayjs(item.end_time).format("HH:00");
        if (temp[dateT]) {
          temp[dateT].waitReturn += 1;
        } else {
          temp[dateT] = {
            DateT: dateT,
            counted: 0,
            waitLCR: 0,
            waitReturn: 1,
            time: item.end_time,
          };
        }
      });

  const ErrorList = Object.values(temp).sort(
    (a, b) => dayjs(a.time) - dayjs(b.time)
  );

  const spark1Options = {
    chart: {
      backgroundColor: "transparent",
      reflow: true,
      height: 180,
      borderWidth: 0,
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: ErrorList.map((item) => item["DateT"]),
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
    yAxis: {
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
      tickAmount: 3,
      opposite: false,
    },
    series: [
      {
        name: "Wait return",
        type: "column",
        borderWidth: 0,
        data: ErrorList.map((item) => item.waitReturn),
        color: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, "orange"],
            [1, "#2099f500"],
          ],
        },
        dataLabels: {
          color: "orange",
          fontSize: "11px",
        },
      },
      {
        name: "Counted",
        type: "column",
        borderWidth: 0,
        data: ErrorList.map((item) => item.counted),
        color: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, "#00e396"],
            [1, "#2099f500"],
          ],
        },
        dataLabels: {
          color: "#00e396",
          fontSize: "11px",
        },
      },
    ],
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    tooltip: {
      shared: true,
    },
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
              onShowModal(
                idata.filter(
                  (item) =>
                    dayjs(item.end_time).format("YYYY-MM-DD") ===
                      dayjs(queryDate).format("YYYY-MM-DD") &&
                    dayjs(item.end_time).format("HH:00") === this.category
                )
              );
            },
          },
        },
      },
    },
    legend: {
      align: "left",
      verticalAlign: "top",
      style: {
        color: theme.palette.chart.color, // Màu chữ trên trục Y
      },
      labels: {
        useSeriesColors: true,
      },
      itemStyle: {
        color: theme.palette.chart.color, // Màu chữ legend
      },
    },
  };

  const spark2Options = {
    chart: {
      backgroundColor: "transparent",
      reflow: true,
      height: 160,
      //   borderWidth: 0,
      reversed: true,
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: ErrorList.map((item) => item["DateT"]),
      title: {
        text: "",
      },
      labels: {
        enabled: false,
        style: {
          fontSize: "12px",
          color: theme.palette.chart.color, // Màu chữ trên trục Y
        },
      },
      gridLineWidth: 0,
      lineWidth: 0,
    },
    yAxis: {
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
      tickAmount: 3,
      opposite: false,
      reversed: true,
      //   gridLineWidth: 0,
      //   lineWidth: 0,
    },
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
              onShowModal(
                idata2.filter(
                  (item) =>
                    item.status === "LOCK WAIT UNLOCK" &&
                    dayjs(item.end_time).format("YYYY-MM-DD") ===
                      dayjs(queryDate).format("YYYY-MM-DD") &&
                    dayjs(item.end_time).format("HH:00") === this.category
                )
              );
            },
          },
        },
      },
    },
    series: [
      {
        name: "Wait LCR",
        type: "column",
        borderWidth: 0,
        data: ErrorList.map((item) => item.waitLCR),
        color: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, "#ff3110"],
            [1, "#2099f500"],
          ],
        },
        dataLabels: {
          color: "#ff3110",
          fontSize: "11px",
        },
      },
      {
        name: "Tested LCR",
        type: "column",
        borderWidth: 0,
        data: ErrorList.map((item) => item.counted - item.waitLCR),
        color: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, "#34aadc"],
            [1, "#2099f500"],
          ],
        },
        dataLabels: {
          color: "#34aadc",
          fontSize: "11px",
        },
      },
    ],
    credits: {
      enabled: false, // Tắt logo Highcharts ở góc
    },
    legend: {
      //   enabled: false,
      align: "left",
      verticalAlign: "bottom",
      style: {
        color: theme.palette.chart.color, // Màu chữ trên trục Y
      },
      labels: {
        useSeriesColors: true,
      },
      itemStyle: {
        color: theme.palette.chart.color, // Màu chữ legend
      },
    },
    exporting: {
      enabled: false,
    },
  };

  return (
    <div>
      <div id="chart41">
        <HighchartsReact highcharts={Highcharts} options={spark1Options} />
      </div>
      <div id="chart42">
        <HighchartsReact highcharts={Highcharts} options={spark2Options} />
      </div>
    </div>
  );
};

export default AnalysisChart;
