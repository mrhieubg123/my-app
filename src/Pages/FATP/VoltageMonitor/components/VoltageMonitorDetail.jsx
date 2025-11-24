import React, { useState, useMemo, useEffect, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Switch, Grid } from "@mui/material";
import HiBox from "../../../../components/HiBox";
import { getAuthorizedAxiosIntance } from "../../../../utils/axiosConfig";
import imgMachine from "./images/img1.png";
import { useTheme } from "@mui/material/styles";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const axiosInstance = await getAuthorizedAxiosIntance();
const CRITICAL_THRESHOLD = 500000;
const WARNING_THRESHOLD = 450000;

const VoltageMonitorDetail = ({ idata = [] }) => {
  const theme = useTheme();
  const parentRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });
  const [dataOverTime, setDataOverTime] = useState([]);

  const rowsWithId = useMemo(
    () =>
      dataOverTime.map((row, index) => ({
        id: index, // hoặc row.LINE nếu unique
        ...row,
      })),
    [dataOverTime]
  );

  const fetchDataOverTime = async () => {
    try {
      const response = await axiosInstance.post(
        "api/vcut/getKnifeVcutMachineHistory",
        {
          factory: idata.FACTORY,
          line: idata.LINE,
          location: idata.LOCATION,
        }
      );
      setDataOverTime(response.data || []); // Cập nhật state
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
  }, [idata]);

  const options = React.useMemo(() => {
    const used = (10000 / 500000) * 100; // number
    const remain = 100 - used; // number

    return {
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
        categories: [1, 2, 3, 4, 5, 6, 7, 8],
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
        // min: arrLimit.globalMin,
        // max: arrLimit.globalMax,
        tickAmount: 5,
        opposite: false,
        // 🚀 BỔ SUNG HAI ĐƯỜNG HIGHLIGHT (plotLines)
        plotLines: [
          {
            value: 17, // Giá trị của đường Max Limit
            color: "#ff0000", // Màu đỏ
            width: 1, // Độ dày 2px
            dashStyle: "Dash", // Kiểu đường nét đứt
            label: {
              text: `Max (17V)`,
              align: "right",
              style: {
                color: "#ff0000",
                fontWeight: "500",
              },
              x: -5, // Dịch chuyển label sang trái 5px
            },
          },
          {
            value: 13, // Giá trị của đường Min Limit
            color: "#ff0000", // Màu đỏ
            width: 1,
            dashStyle: "Dash",
            label: {
              text: `Min (13V)`,
              align: "right",
              style: {
                color: "#ff0000",
                fontWeight: "500",
              },
              x: -5,
            },
          },
        ],
      },
      series: [
        {
          name: "Force1",
          type: "spline",
          data: [10, 11, 12, 11, 11, 15, 16],
          color: "#00e396",
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
  }, [parentSize, theme, idata]);

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
            src={imgMachine}
            sx={{ height: "100%" }}
          />
        </Box>
      </HiBox>
      <HiBox
        lg={7}
        md={7}
        xs={7}
        alarn={false}
        height="28vh"
        variant="filled"
      ></HiBox>
      <HiBox
        header={`Voltage monitor status`}
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
