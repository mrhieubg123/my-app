import Highcharts, { Point } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ColumnChart = ({ idata = [], onCallBack, checked }) => {
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

  const series = React.useMemo(() => {
    const uniqueFirstByLine = Object.values(
      idata.reduce((acc, item) => {
        const name = checked ? item.LINE + item.MACHINE_NAME : item.LINE;
        if (!acc[name]) {
          acc[name] = []; // chỉ lấy lần đầu tiên LINE xuất hiện
        }
        acc[name].push(item);
        return acc;
      }, {})
    );
    console.log("test1", uniqueFirstByLine);
    return Object.entries(uniqueFirstByLine)
      .map(([name, data]) => ({
        name: checked
          ? data[0].LINE + "-" + data[0].MACHINE_NAME
          : data[0].LINE,
        data: data,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [idata, checked]);
  const options = React.useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        reflow: true,
        height: parentSize.height,
      },
      title: {
        text: "",
      },
      xAxis: {
        categories: series.map((item) => item.name),
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
          labels: {
            format: "{value}",
            style: {
              fontSize: "12px",
              color: theme.palette.chart.color, // Màu chữ trên trục Y
            },
          },
          title: {
            text: "Frequency",
            style: {
              color: Highcharts.getOptions().colors[0],
            },
          },
          tickAmount: 3,
          opposite: false,
        },
      ],
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
                const p = this; // Highcharts Point
                console.log(p);
                onCallBack(
                  idata.filter((item) => {
                    const name = checked
                      ? item.LINE +"-"+ item.MACHINE_NAME
                      : item.LINE;
                    return name === p.category;
                  })
                );
              },
            },
          },
        },
      },
      series: [
        {
          name: "Error",
          type: "column",
          borderWidth: 0,
          yAxis: 0,
          data: series.map((item) => item.data.length).sort((a, b) => a > b),
          color: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, "#ff3110"],
              [1, "#ff311055"],
            ],
          },
          dataLabels: {
            color: "#ff3110",
            fontSize: "11px",
          },
        },
      ],
      credits: {
        enabled: false,
      },
    }),
    [theme, parentSize, idata, checked]
  );

  return (
    <div ref={parentRef} style={{ height: "100%", display: "block" }}>
      {[1].length > 0 ? (
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
export default React.memo(ColumnChart);
