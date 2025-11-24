import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// Khởi tạo module 3D

const CABChart = ({ idata = [], onChangeDate }) => {
  const theme = useTheme();
  const parentRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });

  const handleInputChange = (a) => {
    onChangeDate?.(a);
  };

  const temp = {};
  idata &&
    idata.forEach((item) => {
      if (temp[item.DATET]) {
        temp[item.DATET].VOK += item.OK * 1;
        temp[item.DATET].VNG += item.NG * 1;
      } else {
        temp[item.DATET] = {
          DATET: item.DATET,
          VOK: item.OK * 1,
          VNG: item.NG * 1,
        };
      }
    });
  const ErrorList = Object.values(temp);

  ErrorList.sort((a, b) => new Date(a.DATET) - new Date(b.DATET));

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

  function calculateTotalDailyCuts(data) {
    // --- B1. Chuẩn hóa dữ liệu ---
    const parsed = data.map((item) => ({
      ...item,
      time: new Date(item.TIME),
      date: new Date(item.TIME).toISOString().slice(0, 10),
    }));

    // --- B2. Gom nhóm theo factory, line, location, date ---
    const grouped = {};
    for (const row of parsed) {
      const key = `${row.FACTORY}|${row.LINE}|${row.LOCATION}|${row.date}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(row);
    }

    // --- B3. Tính dailyQty cho từng nhóm ---
    const perMachine = Object.entries(grouped).map(([key, rows]) => {
      const [factory, line, location, date] = key.split("|");
      rows.sort((a, b) => a.time - b.time);
      const maxTotalChange = rows.reduce(
        (max, item) => (item.TOTAL > max ? item.TOTAL : max),
        -Infinity
      );
      const minTotal = rows[0].TOTAL;
      const maxTotal = rows[rows.length - 1].TOTAL;
      const dailyQty =
        maxTotal !== maxTotalChange
          ? maxTotalChange - minTotal + maxTotal
          : maxTotal - minTotal;
      return { factory, line, location, date, dailyQty };
    });

    // --- B4. Tổng hợp theo ngày (cộng tất cả máy) ---
    const totalPerDay = {};
    for (const row of perMachine) {
      totalPerDay[row.date] = (totalPerDay[row.date] || 0) + row.dailyQty;
    }

    // --- B5. Trả ra dạng list ---
    return Object.entries(totalPerDay)
      .map(([date, totalDailyQty]) => ({ date, totalDailyQty }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  const DataSeries = React.useMemo(() => {
    return calculateTotalDailyCuts(idata);
  }, [idata]);

  // Dữ liệu cấu hình cho biểu đồ
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
      categories: DataSeries.map((item) => item["date"]),
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
          text: "",
          style: {
            color: Highcharts.getOptions().colors[0],
          },
        },
        tickAmount: 3,
        opposite: false,
      },
    ],
    series: [
      {
        name: "Quanlity",
        type: "column",
        borderWidth: 0,
        yAxis: 0,
        data: DataSeries.map((item) => item["totalDailyQty"]),
        color: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, "#2099f5"],
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
              handleInputChange(this.category);
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

  return (
    <div ref={parentRef} style={{ height: "100%", display: "block" }}>
      {idata.length > 0 ? (
        <HighchartsReact highcharts={Highcharts} options={options} />
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

export default CABChart;
