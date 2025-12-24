import React, { useState } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  ListItemText,
  Grid,
  Button,
  Tooltip,
} from "@mui/material";
import {
  Warning,
  Error,
  CheckCircle,
  Close,
  EditOutlined,
  AddOutlined,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { getAuthorizedAxiosIntance } from "../../../../utils/axiosConfig";
import HiModal from "../../../../components/HiModal";
import VoltageMonitorDetail from "./VoltageMonitorDetail";
import { useTheme } from "@mui/material/styles";
import HiHoverReveal from "../../../../components/HiHoverReveal";

const axiosInstance = await getAuthorizedAxiosIntance();
// --- HẰNG SỐ VÀ DỮ LIỆU GIẢ LẬP ---
const MIN_THRESHOLD = 14.5;
const MAX_THRESHOLD = 15.5;

// --- COMPONENT CHÍNH (GRID 16 MÁY) ---

const VoltageMonitorStatus = ({ idata = [], onModelChange2 }) => {
  // idata = [
  //   {
  //     LINE: "T04",
  //     M1: "machine1//M2-sta-M2//-1",
  //     M2: "machine1//M2-sta-M0//286/-/M1//286/-/M2//286/-/M3//286/-/M4//286/-/M5//286-/M6//286/-/M7//286/-/M8//286/-/M9//286/-/M10//286/-/M11//286/-/M12//286/-/M13//286/-/M14//286/",
  //     M3: "machine1//M2-sta-M0//286/-/M1//286/-/M2//286/-/M3//286/-/M4//286/-/M5//286-/M6//286/-/M7//286/-/M8//286/-/M9//286/-/M10//286/-/M11//286/-/M12//286/-/M13//286/-/M14//286/",
  //     M4: "machine1//M2-sta-M0//286/-/M1//286/-/M2//286/-/M3//286/-/M4//286/-/M5//286-/M6//286/-/M7//286/-/M8//286/-/M9//286/-/M10//286/-/M11//286/-/M12//286/-/M13//286/-/M14//286/",
  //     M5: "machine1//M2-sta-M0//286/-/M1//286/-/M2//286/-/M3//286/-/M4//286/-/M5//286-/M6//286/-/M7//286/-/M8//286/-/M9//286/-/M10//286/-/M11//286/-/M12//286/-/M13//286/-/M14//286/",
  //     M6: "machine1//M2-sta-M0//286/-/M1//286/-/M2//286/-/M3//286/-/M4//286/-/M5//286-/M6//286/-/M7//286/-/M8//286/-/M9//286/-/M10//286/-/M11//286/-/M12//286/-/M13//286/-/M14//286/",
  //     M7: "machine1//M2-sta-M0//286/-/M1//286/-/M2//286/-/M3//286/-/M4//286/-/M5//286-/M6//286/-/M7//286/-/M8//286/-/M9//286/-/M10//286/-/M11//286/-/M12//286/-/M13//286/-/M14//286/",
  //     M8: "machine1//M2-sta-M0//286/-/M1//286/-/M2//286/-/M3//286/-/M4//286/-/M5//286-/M6//286/-/M7//286/-/M8//286/-/M9//286/-/M10//286/-/M11//286/-/M12//286/-/M13//286/-/M14//286/",
  //     M9: "machine1//M2-sta-M0//286/-/M1//286/-/M2//286/-/M3//286/-/M4//286/-/M5//286-/M6//286/-/M7//286/-/M8//286/-/M9//286/-/M10//286/-/M11//286/-/M12//286/-/M13//286/-/M14//286/",
  //     M10: "machine1//M2-sta-M0//286/-/M1//286/-/M2//286/-/M3//286/-/M4//286/-/M5//286-/M6//286/-/M7//286/-/M8//286/-/M9//286/-/M10//286/-/M11//286/-/M12//286/-/M13//286/-/M14//286/",
  //   },
  //   {
  //     LINE: "T05",
  //     M1: "machine1//M2-sta-M2//-1",
  //     M2: "machine1//M2-sta-M1//286",
  //   },
  // ];
  const theme = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [selectedCells, setSelectedCells] = useState(new Map());
  const [machine, setMachine] = useState(null);
  const columnsxx = [
    "",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "H7",
    "H8",
    "H9",
    "H10",
  ];
  const columns =
    idata.length > 0
      ? Object.keys(idata[0]).map((keycol) => keycol.replace("LINE", ""))
      : columnsxx;

  const handleCellClick2 = (row, col, station, code,value) => {
    const rowValue = `${idata[row].LINE}`;
    const newModel = {
      line: rowValue,
      machine: station.split("//")[0],
      location: col,
      locationMonitor: code,
      value: value,
    };
    console.log('newModel',newModel)
    onModelChange2?.(newModel);
    setMachine(newModel);
    setShowModal(true);
  };

  const colorMap = React.useMemo(
    () => ({
      RUN: "#00e396",
      OFF: "#ffe636",
      ERROR: "#ff3110",
      NA: "#808080",
    }),
    []
  );

  const renderStatusCell = (val) => {
    console.log("renderStatusCell", val);
    const lVal =
      val &&
      val
        ?.split("//")[1]
        .split("-")
        .map((item) => item);
    const minVal =
      lVal.length > 0
        ? lVal.reduce((min, num) => (num * 1 < min * 1 ? num : min))
        : 0;
    const maxVal =
      lVal.length > 0
        ? lVal.reduce((max, num) => (num * 1 > max * 1 ? num : max))
        : 0;
    const status =
      minVal <= MIN_THRESHOLD || maxVal >= MAX_THRESHOLD ? "ERROR" : "RUN";
    const color = colorMap[status] || "";
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <Box
          className={status === "ERROR" ? "blinking" : ""}
          sx={{
            backgroundColor: color,
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            margin: "6px auto",
          }}
        ></Box>
      </Box>
    );
  };

  const renderStatusCell2 = (val) => {
    const status =
      val <= MIN_THRESHOLD || val >= MAX_THRESHOLD ? "ERROR" : "RUN";
    const color = colorMap[status] || "";
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <Box
          className={status === "ERROR" ? "blinking" : ""}
          sx={{
            backgroundColor: color,
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            margin: "auto",
          }}
        ></Box>
      </Box>
    );
  };
  const seriesData = Object.values(
    idata.reduce((acc, item) => {
      if (!acc[item.LINE]) {
        acc[item.LINE] = {
          LINE: item.LINE,
        }; // chỉ lấy lần đầu tiên LINE xuất hiện
      }
      acc[item.LINE]["M" + item.LOCATION] = item.MACHINE_NAME + "//" + item.KCN;
      return acc;
    }, {})
  ).sort((a, b) => a.LINE.localeCompare(b.LINE));

  return idata.length > 0 ? (
    <Box sx={{ flexGrow: 1, p: 3, width: "100%", height: "100%" }}>
      <HiModal
        header={`Voltage monitor details`}
        open={showModal}
        onClose={() => setShowModal(false)}
        widthModal={60}
        heightModal={80}
      >
        <VoltageMonitorDetail idata={machine}></VoltageMonitorDetail>
      </HiModal>
      <Box sx={{ position: "relative", height: "100%" }}>
        <TableContainer
          sx={{
            overflow: "auto",
            height: "100%",
            "&::-webkit-scrollbar": { width: 4, height: 6, opacity: 0 },
            "&:hover::-webkit-scrollbar": { width: 4, height: 6, opacity: 1 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#cdcdcd8c",
              borderRadius: "10px",
            },
          }}
        >
          <Table
            sx={{ borderSpacing: "0 8px", height: "100%" }}
            aria-label="customized table"
          >
            <TableHead
              sx={{
                position: "sticky",
                top: "0",
                backgroundColor: theme.palette.background.conponent,
                zIndex: "10",
              }}
            >
              <TableRow>
                <TableCell
                  key={"LINE"}
                  style={{
                    padding: "6px",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Line
                </TableCell>
                {Object.keys(seriesData[0]).map((keycol) =>
                  keycol !== "LINE" ? (
                    <TableCell
                      key={keycol}
                      style={{
                        padding: "6px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {keycol}
                    </TableCell>
                  ) : (
                    ""
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {seriesData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.keys(row).map((key, cellIndex) => {
                    const cellKey = `${rowIndex}-${cellIndex}`;
                    const isSelected = selectedCells.has(cellKey);
                    return (
                      <TableCell
                        key={cellIndex}
                        style={{
                          paddingLeft: "6px",
                          paddingRight: "6px",
                          paddingTop: "unset",
                          paddingBottom: "unset",
                          whiteSpace: "nowrap",
                          textAlign: "center",
                          background: isSelected
                            ? key !== "LINE"
                              ? "#219af144"
                              : "#219af1"
                            : "",
                          cursor: "pointer",
                        }}
                      >
                        {key !== "LINE"
                          ? row[key] !== null && (
                              <HiHoverReveal
                                rowIndex={rowIndex}
                                cellIndex={cellIndex}
                                trigger={
                                  <Box component={"div"}>
                                    {renderStatusCell(row[key])}
                                  </Box>
                                }
                              >
                                <Box
                                  component={"div"}
                                  sx={{ marginTop: "8px" }}
                                >
                                  <ListItemText
                                    primary={row[key]?.split("//")[0]}
                                    secondary={
                                      <Grid
                                        container
                                        columns={12}
                                        component={"div"}
                                        sx={{
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          minWidth: "210px",
                                        }}
                                      >
                                        {row[key]
                                          ?.split("//")[1]
                                          .split("-")
                                          .map((item, indexMonitor) => (
                                            <Grid
                                              size={{ lg: 2, md: 2, xs: 2 }}
                                              conponent={"a"}
                                              onClick={() =>
                                                handleCellClick2(
                                                  rowIndex,
                                                  cellIndex,
                                                  row[key],
                                                  indexMonitor,item
                                                )
                                              }
                                              sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                padding: "0px 6px",
                                              }}
                                            >
                                              <Typography
                                                sx={{
                                                  fontSize: "11px",
                                                  whiteSpace: "nowrap",
                                                  maxWidth: "70px",
                                                  overflow: "hidden",
                                                  textOverflow: "ellipsis",
                                                }}
                                              >
                                                {indexMonitor === 0
                                                  ? "CT"
                                                  : "V" + indexMonitor}
                                              </Typography>
                                              {renderStatusCell2(item)}
                                            </Grid>
                                          ))}
                                      </Grid>
                                    }
                                    primaryTypographyProps={{
                                      fontSize: "12px",
                                      whiteSpace: "nowrap",
                                      fontWeight: "bold",
                                    }}
                                    secondaryTypographyProps={{
                                      fontSize: "11px",
                                      whiteSpace: "nowrap",
                                    }}
                                  />
                                </Box>
                              </HiHoverReveal>
                            )
                          : row[key]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
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
  );
};

export default VoltageMonitorStatus;
