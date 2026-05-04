import React, { useState, useRef, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Button, Grid, Switch } from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import HiBox from "../../../../components/HiBox";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from "@mui/material/styles";
import imgMachine from "./image/machine.png";
import imgRobot from "./image/robot.png";

const ErrorDetail = ({ idata = [] }) => {
  const theme = useTheme();
  const parentRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });
  const [querryMachine, setQuerryMachine] = useState("");
  const [switchMOL, setSwitchMOL] = useState(false);

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

  const tempError2 = React.useMemo(() => {
    const tempError = {};
    idata.forEach((item) => {
      if (tempError[item.LINE + item.MACHINE_NAME]) {
        tempError[item.LINE + item.MACHINE_NAME].Downtime +=
          (item.TIME * 1) / 60;
        tempError[item.LINE + item.MACHINE_NAME].Frequency += 1;
      } else {
        tempError[item.LINE + item.MACHINE_NAME] = {
          Series: item.LINE + item.MACHINE_NAME,
          Downtime: (item.TIME * 1) / 60,
          Frequency: 1,
        };
      }
    });
    return tempError;
  }, [idata]);

  const dataSeries = React.useMemo(() => {
    const List3 = Object.values(tempError2);
    if (switchMOL) List3.sort((a, b) => b.Frequency - a.Frequency);
    else List3.sort((a, b) => b.Downtime - a.Downtime);
    if (List3.length > 5) return List3.slice(0, 5);
    return List3;
  }, [tempError2, switchMOL]);

  const dataDisplay = React.useMemo(() => {
    if (querryMachine) {
      return idata
        .filter(
          (item) =>
            querryMachine.includes(item.LINE) &&
            querryMachine.includes(item.MACHINE_NAME)
        )
        .map((row, index) => ({
          id: index, // hoặc row.LINE nếu unique
          ...row,
        }));
    } else
      return idata.map((row, index) => ({
        id: index, // hoặc row.LINE nếu unique
        ...row,
      }));
  }, [idata, querryMachine]);

  const handleExportExel = () => {
    // 1. Chuyển mảng JSON thành worksheet
    const worksheet = XLSX.utils.json_to_sheet(idata);

    // 2. Tạo workbook và gắn worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // 3. Xuất ra dạng array buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // 4. Tạo file blob và download
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, `data_${Date.now()}.xlsx`);
  };

  const columns = [
    {
      field: "LINE",
      headerName: "Line",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
    },
    {
      field: "MACHINE_NAME",
      headerName: "Machine name",
      flex: 1, // tự chia chiều rộng
      minWidth: 150,
      editable: true,
    },
    {
      field: "ERROR_CODE",
      headerName: "Error Code",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      editable: true,
    },
    {
      field: "ERROR_TYPE",
      headerName: "Error",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      editable: true,
    },
    {
      field: "START_TIME",
      headerName: "Start time",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      editable: true,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {(params.value || "").replace("T", " ").replace(".000Z", "")}
        </div>
      ),
    },
    {
      field: "END_TIME",
      headerName: "End time",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      editable: true,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {(params.value || "").replace("T", " ").replace(".000Z", "")}
        </div>
      ),
    },
    {
      field: "TIME",
      headerName: "Time",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      editable: true,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {((params.value || 0) / 60).toFixed(2)}m
        </div>
      ),
    },
  ];

  const options = React.useMemo(
    () => ({
      chart: {
        type: "column",
        backgroundColor: "transparent",
        reflow: true,
        height: parentSize.height,
      },
      title: {
        text: `Top 5 machine error`,
        style: {
          color: theme.palette.chart.color,
        },
      },
      xAxis: {
        categories: dataSeries.map((item) => item.Series),
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
            color: theme.palette.chart.color,
          },
        },
        tickAmount: 3,
        opposite: false,
      },
      tooltip: {
        pointFormat: switchMOL ? "<b>{point.y}</b>" : "<b>{point.y:.2f}</b>",
      },
      series: [
        {
          name: switchMOL ? "Frequency" : "Downtime",
          type: "column",
          data: switchMOL
            ? dataSeries.map((item) =>
                // đảm bảo là number; làm tròn hiển thị bằng dataLabels/tooltip
                Number(item?.Frequency ?? 0)
              )
            : dataSeries.map((item) =>
                // đảm bảo là number; làm tròn hiển thị bằng dataLabels/tooltip
                Number(item?.Downtime ?? 0)
              ),
          color: switchMOL
            ? {
                linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 1,
                },
                stops: [
                  [0, "#ff3110"],
                  [1, "#ff311000"],
                ],
              }:{
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
              }
            ,
          dataLabels: {
            enabled: true,
            format: switchMOL ? "{y}" : "{y:.2f}", // hiển thị value trên cột
          },
        },
      ],
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
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
                const cat = this.category;
                setQuerryMachine((prev) => (prev === cat ? "" : cat));
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
    }),
    [theme, dataSeries, parentSize]
  );

  return (
    <Grid sx={{ height: "100%" }} container columns={12}>
      <HiBox lg={4} md={4} xs={4} alarn={false} height="36vh" variant="filled">
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
            src={querryMachine.includes("_RB") ? imgRobot : imgMachine}
            sx={{ height: "100%" }}
          />
        </Box>
      </HiBox>
      <HiBox lg={8} md={8} xs={8} alarn={false} height="36vh" variant="filled">
        <div ref={parentRef} style={{ height: "100%", display: "block" }}>
          <Switch
            labels={"sad"}
            checked={switchMOL}
            onChange={() => {
              setSwitchMOL((prev) => !prev);
            }}
            sx={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}
            defaultChecked
          ></Switch>

          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </HiBox>
      <HiBox
        lg={12}
        md={12}
        xs={12}
        alarn={false}
        height="36vh"
        variant="filled"
      >
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <Button
            sx={{ marginLeft: "15px" }}
            variant="contained"
            color="error"
            onClick={handleExportExel}
          >
            Export exel
          </Button>
          <Typography
            sx={{
              float: "left",
              marginLeft: "10px",
              color: "#3ce3ab",
              fontSize: "1rem",
            }}
          >
            {querryMachine || ""}
          </Typography>
        </Box>

        <DataGrid
          rows={dataDisplay}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          sx={{
            height: "90%",
            backgroundColor: "transparent",
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "transparent !important",
            },
            "& .MuiDataGrid-cell": {
              whiteSpace: "normal",
              wordBreak: "break-word",
              lineHeight: "1.3",
              py: 1, // padding top/bottom
              alignItems: "flex-start", // ensure top alignment when multi-line
            },
          }}
        />
      </HiBox>
    </Grid>
  );
};
export default ErrorDetail;
