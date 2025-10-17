import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Box, Switch, Typography } from "@mui/material";
import { getAuthorizedAxiosIntance } from "../../../../utils/axiosConfig";

const axiosInstance = await getAuthorizedAxiosIntance();

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
      FORCE1: item.FORCE_1,
      FORCE2: item.FORCE_2,
      FORCE3: item.FORCE_3,
      FORCE4: item.FORCE_4,
    };
  });
  var ErrorList = Object.values(temp);

  const arrLimit = findGlobalMinMaxForces(dataScrewMachineDetail);

  const arrDefault = dataForce.find(
    (item) =>
      item.LINE === model.line &&
      item.NAME_MACHINE === model.name &&
      item.TYPE === model.type
  )||{MAX_FORCE:"",MIN_FORCE:""};

  console.log('arrDefault',arrDefault,model,dataForce)

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
      categories: ErrorList.map((item) => item["INDEX"]),
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
      min: arrLimit.globalMin,
      max: arrLimit.globalMax,
      tickAmount: 5,
      opposite: false,
      // 🚀 BỔ SUNG HAI ĐƯỜNG HIGHLIGHT (plotLines)
      plotLines: [
        {
          value: arrDefault.MAX_FORCE || arrLimit.globalMax, // Giá trị của đường Max Limit
          color: "#ff0000", // Màu đỏ
          width: 1, // Độ dày 2px
          dashStyle: "Dash", // Kiểu đường nét đứt
          label: {
            text: `Max (${arrDefault.MAX_FORCE || arrLimit.globalMax})`,
            align: "right",
            style: {
              color: "#ff0000",
              fontWeight: "500",
            },
            x: -5, // Dịch chuyển label sang trái 5px
          },
        },
        {
          value: arrDefault.MIN_FORCE || arrLimit.globalMin, // Giá trị của đường Min Limit
          color: "#ff0000", // Màu đỏ
          width: 1,
          dashStyle: "Dash",
          label: {
            text: `Min (${arrDefault.MIN_FORCE || arrLimit.globalMin})`,
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
        data: ErrorList.map((item) => Number(item["FORCE1"].toFixed(2))),
        color: "#00e396",
        dataLabels: {
          color: "#00e396",
          fontSize: "11px",
        },
      },
      {
        name: "Force2",
        type: "spline",
        yAxis: 0,
        data: ErrorList.map((item) => Number(item["FORCE2"].toFixed(2))),
        color: "#3498db",
        dataLabels: {
          color: "#3498db",
          fontSize: "11px",
        },
      },
      {
        name: "Force3",
        type: "spline",
        yAxis: 0,
        data: ErrorList.map((item) => Number(item["FORCE3"].toFixed(2))),
        color: "#bb86fc",
        dataLabels: {
          color: "#bb86fc",
          fontSize: "11px",
        },
      },
      {
        name: "Force4",
        type: "spline",
        yAxis: 0,
        data: ErrorList.map((item) => Number(item["FORCE4"].toFixed(2))),
        color: "#f1c40f",
        dataLabels: {
          color: "#f1c40f",
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

  return (
    <div ref={parentRef} style={{ height: "100%", display: "block" }}>
      {dataScrewMachineDetail.length > 0 ? (
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

export default LineChartDetail;
