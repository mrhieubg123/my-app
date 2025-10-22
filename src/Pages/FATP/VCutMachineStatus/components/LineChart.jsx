import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import { Box, Switch, Typography } from "@mui/material";
// Khởi tạo module 3D

const MOCK_DATA = [
  {
    FACTORY: "A02",
    LINE: "T04",
    LOCATION: "1",
    NAME_MACHINE: "V-cut01",
    TIMET: "02:30",
    DIFF: 1333,
  },
  {
    FACTORY: "B01",
    LINE: "T04",
    LOCATION: "1",
    NAME_MACHINE: "V-cut01",
    TIMET: "03:30",
    DIFF: 0,
  },
  {
    FACTORY: "B01",
    LINE: "T04",
    LOCATION: "2",
    NAME_MACHINE: "V-cut02",
    TIMET: "03:30",
    DIFF: 0,
  },
  {
    FACTORY: "B01",
    LINE: "T06",
    LOCATION: "1",
    NAME_MACHINE: "V-cut01",
    TIMET: "04:30",
    DIFF: 100,
  },
];
const LineChart = ({ idata = [] }) => {
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

  // data: list đã lọc sẵn trong 1 ngày
  // Mỗi item có: ID, FACTORY, LINE, LOCATION, NAME_MACHINE, TOTAL, TIME (yyyy-MM-dd HH:mm:ss)
  function calculateHourlyByMachine(data) {
    if (!Array.isArray(data) || data.length === 0) return [];

    // Parse TIME và lấy giờ
    const parsed = data.map(item => {
      const d = new Date(item.TIME);
      return {
        ...item,
        __time: d,
        __hour: d.getHours(),
      };
    });

    // B1) Group theo (factory, line, name_machine, location, hour)
    const g1 = {};
    for (const r of parsed) {
      const key = `${r.FACTORY}|${r.LINE}|${r.NAME_MACHINE}|${r.LOCATION}|${r.__hour}`;
      if (!g1[key]) g1[key] = [];
      g1[key].push(r);
    }

    // B2) Trong mỗi nhóm nhỏ (từng location), tính diff = max(total) - min(total)
    const perLocPerHour = Object.entries(g1).map(([key, rows]) => {
      const [factory, line, nameMachine, location, hourStr] = key.split('|');
      rows.sort((a, b) => a.__time - b.__time);
      const maxTotalChange = rows.reduce(
        (max, item) => (item.TOTAL > max ? item.TOTAL : max),
        -Infinity
      );
      const minTotal = rows[0].TOTAL;
      const maxTotal = rows[rows.length - 1].TOTAL;
      const diff = maxTotal !== maxTotalChange
          ? maxTotalChange - minTotal + maxTotal
          : maxTotal - minTotal;
      return {
        factory,
        line,
        nameMachine,
        location,
        hour: Number(hourStr),
        diff
      };
    });

    // B3) Rollup theo (factory, line, name_machine, hour): cộng diff của các location
    const g2 = {};
    for (const r of perLocPerHour) {
      const key = `${r.factory}|${r.line}|${r.nameMachine}|${r.hour}`;
      if (!g2[key]) g2[key] = 0;
      g2[key] += r.diff;
    }

    // B4) Trả về list kết quả
    const result = Object.entries(g2)
      .map(([key, totalHourlyQty]) => {
        const [factory, line, nameMachine, hourStr] = key.split('|');
        return {
          factory,
          line,
          nameMachine,
          hour: Number(hourStr),
          totalHourlyQty
        };
      })
      .sort((a, b) =>
        a.factory.localeCompare(b.factory) ||
        a.line.localeCompare(b.line) ||
        a.nameMachine.localeCompare(b.nameMachine) ||
        a.hour - b.hour
      );

    return result;
  }

  const grouped = {};

  calculateHourlyByMachine(idata).forEach((item) => {
    // const timeKey = new Date(item.TimeT).getTime();
    const timeKey = `${item.hour}:00`;
    const key = `${switchMOL ? (`${item.factory}-${item.line}-${item.nameMachine}`) : (`${item.factory}-${item.line}`)}_${timeKey}`;

    if (!grouped[key]) {
      grouped[key] = {
        LINE: switchMOL ? (`${item.factory}-${item.line}-${item.nameMachine}`) : (`${item.factory}-${item.line}`),
        time: timeKey,
        TOTALTIME: 0,
      };
    }
    grouped[key].TOTALTIME += item.totalHourlyQty;
  });

  const serialMap = {};

  Object.values(grouped).forEach(({ LINE, time, TOTALTIME }) => {
    if (!serialMap[LINE]) serialMap[LINE] = [];
    serialMap[LINE].push([time, TOTALTIME]);
  });

  const series = Object.entries(serialMap).map(([LINE, data]) => ({
    name: LINE,
    data: data.sort((a, b) => a[0] - b[0]),
  }));
  const seriesLength =
    series.length > 0 ? series.map((item) => item.data.length) : [];
  const maxLength =
    seriesLength.length > 0 ? Math.max(...seriesLength.map((e) => e), 0) : 1;

  function calculateHourlyCutQuantities(data) {
    if (!data || data.length === 0) return [];

    // --- B1. Parse TIME và lấy giờ ---
    const parsed = data.map((item) => ({
      ...item,
      time: new Date(item.TIME),
      hour: new Date(item.TIME).getHours(),
    }));

    // --- B2. Group theo máy + giờ ---
    const grouped = {};
    for (const row of parsed) {
      const key = `${row.FACTORY}|${row.LINE}|${row.LOCATION}|${row.hour}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(row);
    }

    // --- B3. Tính số lượng cắt từng giờ cho từng máy ---
    const perMachineHour = Object.entries(grouped).map(([key, rows]) => {
      const [factory, line, location, hour] = key.split("|");
      rows.sort((a, b) => a.time - b.time);
      const minTotal = rows[0].TOTAL;
      const maxTotal = rows[rows.length - 1].TOTAL;
      const diff = maxTotal - minTotal;
      return { factory, line, location, hour: Number(hour), diff };
    });

    // --- B4. Cộng gộp lại theo từng giờ (tổng tất cả máy) ---
    const totalPerHour = {};
    for (const row of perMachineHour) {
      totalPerHour[row.hour] = (totalPerHour[row.hour] || 0) + row.diff;
    }

    // --- B5. Trả về danh sách kết quả sắp theo giờ ---
    return Object.entries(totalPerHour)
      .map(([hour, totalHourlyQty]) => ({
        hour: Number(hour),
        totalHourlyQty,
      }))
      .sort((a, b) => a.hour - b.hour);
  }

  const DataSeries = React.useMemo(() => {
      return calculateHourlyCutQuantities(idata);
    }, [idata]);

  // Cấu hình biểu đồ đường
  const options = {
    chart: {
      backgroundColor: "#ffffff00",
      reflow: true,
      type: "spline", // Loại biểu đồ đường
      height: parentSize.height,
    },
    title: {
      text: "",
    },
    xAxis: {
      type: "category",
      labels: {
        style: {
          fontSize: "12px",
          color: theme.palette.chart.color, // Màu chữ trên trục Y
        },
      },
      // tickInterval : 2,
      tickInterval: maxLength > 15 ? 3 : maxLength > 8 ? 2 : "",
      // labels:{
      //   format: `{value:%H:%M}`
      // }
    },
    yAxis: {
      // max: 100,
      title: {
        text: "Frequency",

        style: {
          color: "#999",
          fontSize: "11px",
        },
      },
      labels: {
        style: {
          fontSize: "12px",
          color: theme.palette.chart.color,
        },
      },
      tickAmount: 3,
    },
    series: series,
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
      {MOCK_DATA.length > 0 ? (
        <>
          <Switch
            labels={"sad"}
            checked={switchMOL}
            onChange={handleChangeSwitchErAnLo}
            sx={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}
            defaultChecked
          ></Switch>
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
