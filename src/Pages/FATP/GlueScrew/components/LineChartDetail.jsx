import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { getAuthorizedAxiosIntance } from "../../../../utils/axiosConfig";

const axiosInstance = await getAuthorizedAxiosIntance();

const specGlueWifi = [81, 101];
const specGlueMB1 = [153, 187];
const specGlueMB2 = [1107, 1353];
const slotGlueMB1 = [1, 4, 5, 8, 9, 12];
const slotGlueMB2 = [2, 3, 6, 7, 10, 11];

const LineChartDetail = ({ dataForce = [], model }) => {
  const theme = useTheme();
  const parentRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });
  const [dataScrewMachineDetail, setDataScrewMachineDetail] = useState([]);

  const fetchDataScrewMachineDetail = async () => {
    try {
      const response = await axiosInstance.post(
        "api/Screw/getDataScrewMachineDetail",
        model
      );
      setDataScrewMachineDetail(response.data || []);
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
    fetchDataScrewMachineDetail();
  }, []);

  const findGlobalMinMaxForces = (dataArray) => {
    if (!dataArray || dataArray.length === 0) {
      return { globalMax: null, globalMin: null };
    }

    // Khởi tạo Max và Min với các giá trị đối lập
    // Hoặc sử dụng giá trị Max và Min của đối tượng đầu tiên để đảm bảo tính toán đúng
    let globalMax = -Infinity;
    let globalMin = Infinity;

    // Các thuộc tính cần so sánh
    const forceKeys = ["FORCE_1", "FORCE_2", "FORCE_3", "FORCE_4"];

    for (const item of dataArray) {
      // 1. Tạo mảng chỉ chứa 4 giá trị Force cho đối tượng hiện tại
      const currentForces = forceKeys
        .map((key) => item[key])
        // Lọc bỏ các giá trị null/undefined để đảm bảo Math.max/min hoạt động đúng
        .filter((value) => typeof value === "number");

      if (currentForces.length === 0) {
        continue; // Bỏ qua nếu không có giá trị Force nào hợp lệ
      }

      // 2. Tìm Max/Min nội bộ trong 4 chỉ số của đối tượng hiện tại
      const localMax = Math.max(...currentForces);
      const localMin = Math.min(...currentForces);

      // 3. Cập nhật Max/Min toàn cục (Global)
      if (localMax > globalMax) {
        globalMax = localMax;
      }
      if (localMin < globalMin) {
        globalMin = localMin;
      }
    }

    // Xử lý trường hợp không có dữ liệu số
    if (globalMax === -Infinity || globalMin === Infinity) {
      return { globalMax: null, globalMin: null };
    }

    return {
      globalMax: globalMax,
      globalMin: globalMin,
    };
  };

  const temp = {};
  dataScrewMachineDetail.forEach((item, index) => {
    temp[index] = {
      INDEX: index,
      FORCE1: item.FORCE_1 || 0,
      FORCE2: item.FORCE_2 || 0,
      FORCE3: item.FORCE_3 || 0,
      FORCE4: item.FORCE_4 || 0,
      FORCE5: item.FORCE_5 || 0,
      FORCE6: item.FORCE_6 || 0,
      FORCE7: item.FORCE_7 || 0,
      FORCE8: item.FORCE_8 || 0,
      FORCE9: item.FORCE_9 || 0,
      FORCE10: item.FORCE_10 || 0,
      FORCE11: item.FORCE_11 || 0,
      FORCE12: item.FORCE_12 || 0,
      TIME_UPDATE: new Date(item.TIME_UPDATE).getTime(),
    };
  });
  var ErrorList = Object.values(temp);

  const arrLimit = findGlobalMinMaxForces(dataScrewMachineDetail);

  const arrDefault = dataForce.find(
    (item) =>
      item.LINE === model.line &&
      item.NAME_MACHINE === model.name &&
      item.TYPE === model.type
  ) || { MAX_FORCE: "", MIN_FORCE: "" };

  const seriesData =
    model.type !== "Glue"
      ? Array.from({ length: 4 }, (_, index) => ({
          name: `Force${index + 1}`,
          type: "spline",
          data: ErrorList.map((item) => [
            item.TIME_UPDATE,
            Number(item[`FORCE${index + 1}`].toFixed(2)),
          ]),
          // color: "#00e396",
          dataLabels: {
            // color: "#00e396",
            fontSize: "11px",
          },
          marker: {
            enabled: true,
          },
        }))
      : Array.from({ length: 6 }, (_, index) => ({
          name: `Glue${
            model.location === "WIFI" ? index + 1 : slotGlueMB1[index]
          }`,
          type: "spline",
          data: ErrorList.map((item) => [
            item.TIME_UPDATE,
            Number(
              item[
                `FORCE${
                  model.location === "WIFI" ? index + 1 : slotGlueMB1[index]
                }`
              ].toFixed(2)
            ),
          ]),
          // color: "#00e396",
          dataLabels: {
            // color: "#00e396",
            fontSize: "11px",
          },
          marker: {
            enabled: true,
          },
        }));
  const seriesData2 = Array.from({ length: 6 }, (_, index) => ({
    name: `Glue${slotGlueMB2[index]}`,
    type: "spline",
    data: ErrorList.map((item) => [
      item.TIME_UPDATE,
      Number(item[`FORCE${slotGlueMB2[index]}`].toFixed(2)),
    ]),
    // color: "#00e396",
    dataLabels: {
      // color: "#00e396",
      fontSize: "11px",
    },
    marker: {
      enabled: true,
    },
  }));

  console.log("arrDefault", arrDefault, model, dataForce, ErrorList);

  // Cấu hình biểu đồ đường
  const options = {
    time: {
      timezone: "Asia/Bangkok",
    },
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
      type: "datetime",
      // categories: ErrorList.map((item) => item["INDEX"]),
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
      min:
        model.type === "Glue"
          ? model.location === "WIFI"
            ? specGlueWifi[0] * 0.9
            : specGlueMB1[0] * 0.9
          : arrLimit.globalMin,
      max:
        model.type === "Glue"
          ? model.location === "WIFI"
            ? specGlueWifi[1] * 0.9
            : specGlueMB1[1] * 1.2
          : arrLimit.globalMax,
      tickAmount: 5,
      opposite: false,
      // 🚀 BỔ SUNG HAI ĐƯỜNG HIGHLIGHT (plotLines)
      plotLines: [
        {
          value:
            model.type === "Glue"
              ? model.location === "WIFI"
                ? specGlueWifi[1]
                : specGlueMB1[1]
              : arrDefault.MAX_FORCE || arrLimit.globalMax, // Giá trị của đường Max Limit
          color: "#ff0000", // Màu đỏ
          width: 1, // Độ dày 2px
          dashStyle: "Dash", // Kiểu đường nét đứt
          label: {
            text: `Max (${
              model.type === "Glue"
                ? model.location === "WIFI"
                  ? specGlueWifi[1]
                  : specGlueMB1[1]
                : arrDefault.MAX_FORCE || arrLimit.globalMax
            })`,
            align: "right",
            style: {
              color: "#ff0000",
              fontWeight: "500",
            },
            x: -5, // Dịch chuyển label sang trái 5px
          },
        },
        {
          value:
            model.type === "Glue"
              ? model.location === "WIFI"
                ? specGlueWifi[0]
                : specGlueMB1[0]
              : arrDefault.MIN_FORCE || arrLimit.globalMin, // Giá trị của đường Min Limit
          color: "#ff0000", // Màu đỏ
          width: 1,
          dashStyle: "Dash",
          label: {
            text: `Min (${
              model.type === "Glue"
                ? model.location === "WIFI"
                  ? specGlueWifi[0]
                  : specGlueMB1[0]
                : arrDefault.MIN_FORCE || arrLimit.globalMin
            })`,
            align: "right",
            style: {
              color: "#ff0000",
              fontWeight: "500",
            },
            x: -5,
            y: 10,
          },
        },
      ],
    },
    series: seriesData,
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

  const options2 = {
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
      type: "datetime",
      // categories: ErrorList.map((item) => item["INDEX"]),
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
      min: specGlueMB2[0] * 0.8,
      max: specGlueMB2[1] * 1.2,
      tickAmount: 5,
      opposite: false,
      // 🚀 BỔ SUNG HAI ĐƯỜNG HIGHLIGHT (plotLines)
      plotLines: [
        {
          value: specGlueMB2[1], // Giá trị của đường Max Limit
          color: "#ff0000", // Màu đỏ
          width: 1, // Độ dày 2px
          dashStyle: "Dash", // Kiểu đường nét đứt
          label: {
            text: `Max (${specGlueMB2[1]})`,
            align: "right",
            style: {
              color: "#ff0000",
              fontWeight: "500",
            },
            x: -5, // Dịch chuyển label sang trái 5px
          },
        },
        {
          value: specGlueMB2[0], // Giá trị của đường Min Limit
          color: "#ff0000", // Màu đỏ
          width: 1,
          dashStyle: "Dash",
          label: {
            text: `Min (${specGlueMB2[0]})`,
            align: "right",
            style: {
              color: "#ff0000",
              fontWeight: "500",
            },
            x: -5,
            y: 10,
          },
        },
      ],
    },
    series: seriesData2,
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

  return (
    <div ref={parentRef} style={{ height: "100%", display: "block" }}>
      {dataScrewMachineDetail.length > 0 ? (
        model.type !== "Glue" || model.location === "WIFI" ? (
          <>
            <HighchartsReact highcharts={Highcharts} options={options} />
          </>
        ) : (
          <>
            <Grid sx={{ height: "100%" }} container columns={12}>
              <Grid size={{ lg: 6, md: 6, xs: 12 }} sx={{ height: "100%" }}>
                <HighchartsReact highcharts={Highcharts} options={options} />
              </Grid>
              <Grid size={{ lg: 6, md: 6, xs: 12 }} sx={{ height: "100%" }}>
                <HighchartsReact highcharts={Highcharts} options={options2} />
              </Grid>
            </Grid>
          </>
        )
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

export default LineChartDetail;
