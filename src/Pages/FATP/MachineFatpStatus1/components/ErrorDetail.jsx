import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Button, Grid, Switch, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from "@mui/material";
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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

        <Box sx={{ height: "90%", display: "flex", flexDirection: "column" }}>
          <TableContainer sx={{ flexGrow: 1, overflow: "auto" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: "transparent", color: "inherit", fontWeight: "bold" }}>Line</TableCell>
                  <TableCell sx={{ backgroundColor: "transparent", color: "inherit", fontWeight: "bold" }}>Machine name</TableCell>
                  <TableCell sx={{ backgroundColor: "transparent", color: "inherit", fontWeight: "bold" }}>Error Code</TableCell>
                  <TableCell sx={{ backgroundColor: "transparent", color: "inherit", fontWeight: "bold" }}>Error</TableCell>
                  <TableCell sx={{ backgroundColor: "transparent", color: "inherit", fontWeight: "bold" }}>Start time</TableCell>
                  <TableCell sx={{ backgroundColor: "transparent", color: "inherit", fontWeight: "bold" }}>End time</TableCell>
                  <TableCell sx={{ backgroundColor: "transparent", color: "inherit", fontWeight: "bold" }}>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataDisplay
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ whiteSpace: "normal", wordBreak: "break-word", color: "inherit" }}>{row.LINE}</TableCell>
                      <TableCell sx={{ whiteSpace: "normal", wordBreak: "break-word", color: "inherit" }}>{row.MACHINE_NAME}</TableCell>
                      <TableCell sx={{ whiteSpace: "normal", wordBreak: "break-word", color: "inherit" }}>{row.ERROR_CODE}</TableCell>
                      <TableCell sx={{ whiteSpace: "normal", wordBreak: "break-word", color: "inherit" }}>{row.ERROR_TYPE}</TableCell>
                      <TableCell sx={{ whiteSpace: "normal", wordBreak: "break-word", color: "inherit" }}>{(row.START_TIME || "").replace("T", " ").replace(".000Z", "")}</TableCell>
                      <TableCell sx={{ whiteSpace: "normal", wordBreak: "break-word", color: "inherit" }}>{(row.END_TIME || "").replace("T", " ").replace(".000Z", "")}</TableCell>
                      <TableCell sx={{ whiteSpace: "normal", wordBreak: "break-word", color: "inherit" }}>{((row.TIME || 0) / 60).toFixed(2)}m</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={dataDisplay.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ color: "inherit" }}
          />
        </Box>
      </HiBox>
    </Grid>
  );
};
export default ErrorDetail;
