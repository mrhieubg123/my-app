import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ListItemText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HiHoverReveal from "../../../../components/HiHoverReveal";
import HiModal from "../../../../components/HiModal";
import dayjs from "dayjs";
import { getAuthorizedAxiosIntance } from "../../../../utils/axiosConfig";
import LineChart from "./LineChart";

const axiosInstance = await getAuthorizedAxiosIntance();

const TableTemperatureMachineStatus = ({ idata = [] }) => {
  const theme = useTheme();
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const [selectedMachine, setSelectedMachine] = useState();
  const [dataForTable, setDataForTable] = useState([]);
  const [dataForModal, setDataForModal] = useState([]);
  const [showModal2, setShowModal2] = useState(false);
  const columnsxx = [
    "SPI",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "G1",
    "G2",
    "RF",
    "AOI1",
    "AOI2",
    "P1",
    "P2",
    "DK",
  ];
  const columnPT = ["HR1", "HR2", "HR3", "HRT1", "HRT2", "HRT3", "HDK"];

  useEffect(() => {
    const result = renderMergedCell();
    setDataForTable(result);
    console.log("DataForTable", dataForTable);
  }, [idata.length]);

  useEffect(() => {
    console.log("selectedMachine", selectedMachine);
    if (!selectedMachine) return;
    fetchDataTemperatureByMachine(selectedMachine);
  }, [selectedMachine]);

  const fetchDataTemperatureByMachine = async (machine) => {
    try {
      const response = await axiosInstance.post(
        "api/ME/getDataTemperatureByMachine",
        {
          id: machine.IDQRCODE,
        }
      );
      setDataForModal(response.data || []); // Cập nhật state
      console.log("dataForModal", response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getStatusColor = (dataRow) => {
    // const today = dayjs();
    if (!dataRow) return "#ffe636";
    if (dayjs().diff(dayjs(dataRow?.DATETIME), "day") > 30) return "#ffe636";
    if (
      +dataRow?.TEMP < +dataRow?.TEMP_MAX &&
      +dataRow?.TEMP > +dataRow?.TEMP_MIN
    )
      return "#00e396";
    else if (
      +dataRow?.TEMP > +dataRow?.TEMP_MAX ||
      +dataRow?.TEMP < +dataRow?.TEMP_MIN
    )
      return "#ff3110";
    else return "#ffe636";
  };

  const renderStatusCell = (line, indeM) => {
    console.log("Line", line);
    console.log("columnsxx", columnsxx[indeM]);
    var machineInfo;
    if (!line) {
      machineInfo = [].find(
        (m) => m.LINE_NAME === "PT" && m.MACHINE_CODE === columnPT[indeM]
      );
    } else
      machineInfo = [].find(
        (m) => m.LINE_NAME === line.Line && m.MACHINE_CODE === columnsxx[indeM]
      );

    console.log("idata", idata);
    console.log("machineInfo", machineInfo);
    const color = getStatusColor(machineInfo);
    if (!machineInfo)
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
        />
      );
    return (
      <HiHoverReveal
        rowIndex={line}
        cellIndex={indeM}
        trigger={
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
              className={color === "#ff0000" ? "blinking" : ""}
              component={"a"}
              onClick={() => onTapMachineDetails(machineInfo)}
              sx={{
                backgroundColor: color,
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                margin: "auto",
              }}
            ></Box>
          </Box>
        }
      >
        <Box component={"a"}>
          <ListItemText
            primary={machineInfo.IDQRCODE}
            secondary={
              <Box
                component={"div"}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <Typography
                  sx={{
                    fontSize: "11px",
                    whiteSpace: "nowrap",
                    color: "orange",
                  }}
                >
                  {machineInfo.TEMP} °C
                </Typography>
                <Typography sx={{ fontSize: "11px", whiteSpace: "nowrap" }}>
                  {machineInfo.DATETIME.split("T")[0]}
                </Typography>
              </Box>
            }
            primaryTypographyProps={{ fontSize: "13px", whiteSpace: "nowrap" }}
            secondaryTypographyProps={{
              fontSize: "11px",
              whiteSpace: "nowrap",
            }}
          />
        </Box>
      </HiHoverReveal>
    );
  };

  const renderMergedCell = () => {
    const projectStats = {}; // Dùng một object để lưu trữ thống kê theo project

    [].forEach((item) => {
      const { LINE_NAME } = item;
      if (LINE_NAME != "PT") {
        // Đảm bảo project đã tồn tại trong projectStats
        if (!projectStats[LINE_NAME]) {
          projectStats[LINE_NAME] = {
            count: 1,
          };
        } else {
          projectStats[LINE_NAME].count++;
        }
      }
    });
    // Chuyển đổi object thống kê thành mảng kết quả mong muốn
    const result = Object.keys(projectStats).map((project) => ({
      Line: project,
      count: project.count,
    }));
    return result;
  };

  const onTapMachineDetails = (machine) => {
    if (showModal2 === false) {
      setSelectedMachine(machine);
    }
    setShowModal2((prev) => !prev);
  };

  return idata.length > 0 ? (
    <Box sx={{ position: "relative", height: "100%" }}>
      <HiModal
        header={`History temperature`}
        open={showModal2}
        onClose={() => setShowModal2(false)}
        widthModal={80}
        heightModal={60}
      >
        <LineChart idata={dataForModal}></LineChart>
      </HiModal>
      <TableContainer
        sx={{
          overflow: "auto",
          height: "80%",
          "&::-webkit-scrollbar": { width: 4, height: 6, opacity: 0 },
          "&:hover::-webkit-scrollbar": { width: 4, height: 6, opacity: 1 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#cdcdcd8c",
            borderRadius: "10px",
          },
        }}
      >
        <Table
          sx={{ height: "100%" }}
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
                  padding: "5px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Line
              </TableCell>
              {idata.length > 0 &&
                columnsxx.map((keycol) => (
                  <TableCell
                    key={keycol}
                    style={{
                      padding: "5px",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {keycol}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {idata.length > 0 &&
              dataForTable.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell sx={{padding:'unset', textAlign: "center" }}>{row.Line}</TableCell>
                  {idata.length > 0 &&
                    columnsxx.map((keycol, indexM) => (
                      <TableCell
                        key={keycol}
                        style={{
                          padding:'unset',
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {renderStatusCell(row, indexM)}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer
        sx={{
          overflow: "auto",
          height: "20%",
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
                  padding: "5px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Line
              </TableCell>
              {idata.length > 0 &&
                columnPT.map((keycol) => (
                  <TableCell
                    key={keycol}
                    style={{
                      padding: "5px",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {keycol}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {idata.length > 0 ? (
              <TableRow>
                <TableCell sx={{ textAlign: "center" }}>PTH</TableCell>
                {idata.length > 0 &&
                  columnPT.map((keycol, indexM) => (
                    <TableCell
                      key={keycol}
                      style={{
                        padding: "5px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {renderStatusCell(null, indexM)}
                    </TableCell>
                  ))}
              </TableRow>
            ) : (
              ""
            )}
          </TableBody>
        </Table>
      </TableContainer>
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
export default React.memo(TableTemperatureMachineStatus);
