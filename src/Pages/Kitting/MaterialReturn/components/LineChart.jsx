import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import { Box, Switch, Typography } from "@mui/material";
import dayjs from "dayjs";
// Khởi tạo module 3D

const LineChart = ({ idata = [], idata2 = [], idata3 = [], queryDate }) => {
  const theme = useTheme();
  const parentRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });

  const [switchMOL, setSwitchMOL] = useState(false);
  const handleChangeSwitchErAnLo = (event) => {
    setSwitchMOL(event.target.checked);
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

  const temp = {};
  idata2 &&
    idata2
      // .filter(
      //   (item) =>
      //     dayjs(item.end_time).format("YYYY-MM-DD") ===
      //     dayjs(queryDate).format("YYYY-MM-DD")
      // )
      .forEach((item) => {
        const dateT = dayjs(item.end_time).format("YYYY-MM-DD");
        if (temp[dateT]) {
          temp[dateT].counted += 1;
          if (item.status === "LOCK WAIT UNLOCK") temp[dateT].waitLCR += 1;
        } else {
          temp[dateT] = {
            DateT: dateT,
            counted: 1,
            waitLCR: item.status === "LOCK WAIT UNLOCK" ? 1 : 0,
            waitCount: 0,
            waitReturn: 0,
          };
        }
      });
  idata &&
    idata
      // .filter(
      //   (item) =>
      //     dayjs(item.end_time).format("YYYY-MM-DD") ===
      //     dayjs(queryDate).format("YYYY-MM-DD")
      // )
      .forEach((item) => {
        const dateT = dayjs(item.end_time).format("YYYY-MM-DD");
        if (temp[dateT]) {
          temp[dateT].waitReturn += 1;
        } else {
          temp[dateT] = {
            DateT: dateT,
            counted: 0,
            waitLCR: 0,
            waitCount: 0,
            waitReturn: 1,
          };
        }
      });
  idata3 &&
    idata3.forEach((item) => {
      const dateT = dayjs(item.end_time).format("YYYY-MM-DD");
      if (temp[dateT]) {
        temp[dateT].waitCount += 1;
      } else {
        temp[dateT] = {
          DateT: dateT,
          counted: 0,
          waitLCR: 0,
          waitCount: 1,
          waitReturn: 0,
        };
      }
    });

  const ErrorList = Object.values(temp);

  // Cấu hình biểu đồ đường
  const options = {
    chart: {
      backgroundColor: "#ffffff00",
      reflow: true,
      // type: "spline", // Loại biểu đồ đường
      height: parentSize.height,
    },
    title: {
      text: "",
    },
    xAxis: {
      // type: "category",
      categories: ErrorList.map((item) => item["DateT"]),
      labels: {
        style: {
          fontSize: "12px",
          color: theme.palette.chart.color, // Màu chữ trên trục Y
        },
      },
      // tickInterval : 2,
      // tickInterval: maxLength > 15 ? 3 : maxLength > 8 ? 2 : "",
      // labels:{
      //   format: `{value:%H:%M}`
      // }
    },
    yAxis: {
      // min: 0,
      // max: 100,
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
          color: Highcharts.getOptions().colors[1],
        },
      },
      tickAmount: 3,
      // opposite: true,
    },
    series: [
      {
        name: "Wait LCR",
        type: "spline",
        // yAxis: 0,
        data: ErrorList.map(
          (item) =>
            parseFloat((((item.waitLCR * 100) / item.counted) * 1).toFixed(2))
          // item.waitLCR
        ),
        // color: "#00e396",
        // dataLabels: {
        //   color: "#00e396",
        //   fontSize: "11px",
        // },
      },
      {
        name: "Wait Return",
        type: "spline",
        // yAxis: 0,
        data: ErrorList.map((item) =>
          // item.waitReturn
          parseFloat(
            (
              ((item.waitReturn * 100) /
                (item.counted + item.waitReturn + item.waitCount)) *
              1
            ).toFixed(2)
          )
        ),
        // color: "#2099f5",
        // dataLabels: {
        //   color: "#2099f5",
        //   fontSize: "11px",
        // },
      },
      {
        name: "Wait Count",
        type: "spline",
        // yAxis: 0,
        data: ErrorList.map((item) =>
          // item.waitCount
          parseFloat(
            (
              ((item.waitCount * 100) /
                (item.counted + item.waitReturn + item.waitCount)) *
              1
            ).toFixed(2)
          )
        ),
        // color: "#2099f5",
        // dataLabels: {
        //   color: "#2099f5",
        //   fontSize: "11px",
        // },
      },
    ],
    credits: {
      enabled: false, // Tắt logo Highcharts ở góc
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
              // handleInputChange(this.category);
            },
          },
        },
      },
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
      {idata.length > 0 ? (
        <>
          {/* <Switch
            labels={"sad"}
            checked={switchMOL}
            onChange={handleChangeSwitchErAnLo}
            sx={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}
            defaultChecked
          ></Switch> */}
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

export default LineChart;
