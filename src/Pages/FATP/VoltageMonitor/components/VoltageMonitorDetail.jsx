import React, { useState, useMemo, useEffect, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Switch, Grid } from "@mui/material";
import HiBox from "../../../../components/HiBox";
import { getAuthorizedAxiosIntance } from "../../../../utils/axiosConfig";
import imgMachine from "./images/img1.png";
import imgCtRobot from "./images/ctRobot.png";
import { useTheme } from "@mui/material/styles";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const axiosInstance = await getAuthorizedAxiosIntance();
const MIN_THRESHOLD = 14.5;
const MAX_THRESHOLD = 15.5;

const VoltageMonitorDetail = ({ idata }) => {
  const theme = useTheme();
  const parentRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });
  const [dataVoltage, setDataVoltage] = useState([]);

  const fetchDataOverTime = async () => {
    try {
      const response = await axiosInstance.post(
        "api/Voltage/getVoltageMonitorDetail",
        {
          line: idata.line,
          location: idata.location,
        }
      );
      setDataVoltage(response.data || []); // Cập nhật state
    } catch (error) {
      console.log(error.message);
    }
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
    fetchDataOverTime();
  }, []);

  const options = React.useMemo(() => {
    return {
      chart: {
        backgroundColor: "transparent",
        reflow: true,
        height: parentSize.height,
        borderWidth: 0,
        zoomType: "x",
      },
      title: {
        text: "",
      },
      xAxis: {
        categories: dataVoltage.map((item, index) => index + 1),
        tickInterval: 50,
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
        min: 14,
        max: 16,
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
        // min: arrLimit.globalMin,
        // max: arrLimit.globalMax,
        tickAmount: 5,
        opposite: false,
        plotBands: [
          {
            from: MIN_THRESHOLD,
            to: MAX_THRESHOLD,
            color: "rgba(0, 255, 0, 0.05)", // vùng xanh nhạt
            label: {
              text: "",
              align: "left",
              style: {
                color: theme.palette.chart.color,
              },
            },
          },
        ],
        // 🚀 BỔ SUNG HAI ĐƯỜNG HIGHLIGHT (plotLines)
        plotLines: [
          {
            value: MAX_THRESHOLD, // Giá trị của đường Max Limit
            color: "#ff0000", // Màu đỏ
            width: 1, // Độ dày 2px
            dashStyle: "Dash", // Kiểu đường nét đứt
            label: {
              text: `Max (${MAX_THRESHOLD}V)`,
              align: "right",
              style: {
                color: "#ff0000",
                fontWeight: "500",
              },
              x: -5, // Dịch chuyển label sang trái 5px
              y: -5,
            },
          },
          {
            value: MIN_THRESHOLD, // Giá trị của đường Min Limit
            color: "#ff0000", // Màu đỏ
            width: 1,
            dashStyle: "Dash",
            label: {
              text: `Min (${MIN_THRESHOLD}V)`,
              align: "right",
              style: {
                color: "#ff0000",
                fontWeight: "500",
              },
              x: -5,
              y: 20,
            },
          },
        ],
      },
      series: [
        {
          name: "Force1",
          type: "spline",
          data: dataVoltage.map((item) => {
            if (idata.locationMonitor === 0) return item.CT_ROBOT;
            return item["KCN" + idata.locationMonitor];
          }),
          // color: "#00e396",
          zoneAxis: "y", // dùng giá trị y để chia zone
          zones: [
            {
              value: MIN_THRESHOLD, // y < min  -> đỏ
              color: "#e74c3c",
            },
            {
              value: MAX_THRESHOLD, // min <= y <= max -> xanh
              color: "#00e396",
            },
            {
              // y > max -> đỏ
              color: "#e74c3c",
            },
          ],
          marker: {
            enabled: false, // ❌ Ẩn chấm
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
        shared: false,
        valueDecimals: 3,
        pointFormatter: function () {
          return `<b>${this.y.toFixed(1)} V</b>`;
        },
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: false,
            color: theme.palette.chart.color,
            style: {
              textOutline: "none",
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
  }, [parentSize, theme, dataVoltage]);

  const optionsGauge = React.useMemo(
    () => ({
      chart: {
        type: "solidgauge",
        reflow: true,
        height: parentSize.height,
        backgroundColor: "transparent", // màu nền tối giống hình
      },
      title: {
        text: "Voltage",
        style: {
          color: "#ffffff",
          fontSize: "16px",
        },
      },
      pane: {
        center: ["50%", "57%"], // hạ gauge xuống dưới
        size: "100%",
        startAngle: -90,
        endAngle: 90,
        background: {
          innerRadius: "60%",
          outerRadius: "100%",
          shape: "arc",
          backgroundColor: "#555555", // màu xám của vòng ngoài
        },
      },

      tooltip: { enabled: false },
      credits: { enabled: false },

      yAxis: {
        min: 0,
        max: 25,
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: null,
        labels: {
          distance: 12,
          style: {
            color: "#ffffff",
            fontSize: "10px",
          },
        },
      },

      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: -20,
            borderWidth: 0,
            useHTML: true,
          },
        },
      },

      series: [
        {
          name: "Voltage",
          data: [Number(idata.value)],
          // màu phần đã fill (vùng xanh)
          color: "#00ff00",
          // màu phần chưa fill dùng từ background pane
          innerRadius: "60%",
          radius: "100%",
          dataLabels: {
            formatter: function () {
              const y = this.y;
              const color =
                y < MIN_THRESHOLD || y > MAX_THRESHOLD ? "#e74c3c" : "#00e396"; // đỏ nếu lỗi, xanh nếu OK

              return (
                '<div style="text-align:center">' +
                `<span style="font-size:22px;color:${color}">` +
                Highcharts.numberFormat(y, 1) +
                " V</span><br/>" +
                "</div>"
              );
            },
            // format:
            //   '<div style="text-align:center">' +
            //   '<span style="font-size:22px;color:#e74c3c">{y:.1f} V</span><br/>' +
            //   "</div>",
          },
        },
        // KIM ĐỒNG HỒ
        {
          type: "gauge",
          data: [Number(idata.value)],
          dial: {
            radius: "103%", // dài tới mép ngoài
            backgroundColor: "#ffffff", // màu kim (trắng)
            borderWidth: 0,
            baseLength: "28", // không có phần gốc thò ra
            baseWidth: 8, // độ dày kim
            rearLength: "-28", // không kéo dài ra phía sau
          },
          pivot: {
            radius: 0, // ẩn chấm tròn ở tâm
          },
          enableMouseTracking: false,
          dataLabels: { enabled: false },
          zIndex: 2, // nằm trên vòng cung
        },
      ],
    }),
    [parentSize, theme, idata]
  );

  return (
    <Grid sx={{ height: "100%" }} container columns={12}>
      <HiBox lg={5} md={5} xs={5} alarn={false} height="28vh" variant="filled">
        <Box
          component={"div"}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            component="img"
            align="center"
            src={idata.locationMonitor === 0 ? imgCtRobot : imgMachine}
            sx={{ height: "100%", width: "100%" }}
          />
        </Box>
      </HiBox>
      <HiBox lg={7} md={7} xs={7} alarn={false} height="28vh" variant="filled">
        <div ref={parentRef} style={{ height: "100%", display: "block" }}>
          <HighchartsReact
            highcharts={Highcharts}
            options={optionsGauge}
            containerProps={{ style: { width: "100%", height: "100%" } }}
          />
        </div>
      </HiBox>
      <HiBox
        header={idata.machine}
        lg={12}
        md={12}
        xs={12}
        alarn={false}
        height="46vh"
        variant="filled"
      >
        <div ref={parentRef} style={{ height: "100%", display: "block" }}>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </HiBox>
    </Grid>
  );
};
export default VoltageMonitorDetail;
