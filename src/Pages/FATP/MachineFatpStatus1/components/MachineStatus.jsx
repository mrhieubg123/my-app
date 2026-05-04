import React, { useMemo, useState, useRef } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  LinearProgress,
  ListItemText,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HiHoverReveal from "../../../../components/HiHoverReveal";
import HiModal from "../../../../components/HiModal";
import FPYDetails from "./FPYDetails";

const TableMachineStatus = ({ idata = [], onModelChange, onModelChange2 }) => {
  const theme = useTheme();
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const [selectedCells, setSelectedCells] = useState(new Map());
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [selectMachineDetail, setSelectMachineDetail] = useState({});
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
  const [progress, setProgress] = useState(0);
  const columns =
    idata.length > 0
      ? Object.keys(idata[0]).map((keycol) => keycol.replace("LINE", ""))
      : columnsxx;
  const handleCellClick = (row, col) => {
    const cellKey = `${row}-${col}`;
    const cellValue = `${columns[col]}`;
    const rowKey = `${row}`;
    const rowValue = `${idata[row].LINE}`;
    const newSelection = new Map(selectedCells);
    const newSelectionRows = new Set(selectedRows);
    if (col === 0) {
      // neu click vao o dau tien cua hang, chon ca hang\
      if (newSelectionRows.has(rowKey)) {
        newSelectionRows.delete(rowKey);
        Object.keys(idata[row]).forEach((_, colIdx) =>
          newSelection.delete(`${row}-${colIdx}`),
        );
      } else {
        newSelectionRows.add(rowKey);
        Object.keys(idata[row]).forEach((_, colIdx) => {
          newSelection.set(`${row}-${colIdx}`, {
            row: idata[row].LINE,
            col: columns[`${colIdx}`],
          });
        });
      }
    } else {
      if (newSelection.has(cellKey)) {
        newSelection.delete(cellKey);
      } else {
        newSelection.set(cellKey, { row: rowValue, col: cellValue });
      }
    }
    setSelectedCells(newSelection);
    setSelectedRows(newSelectionRows);
    if (timeoutRef.current) clearInterval(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(100);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => (prev > 0 ? prev - 8 : 0));
    }, 100);
    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current);
      setProgress(0);
      const dsRowCol = [];
      newSelection.forEach((row, col) => {
        if (row.col !== "") {
          dsRowCol.push(`${row.row}-${row.col}`);
        }
      });
      const filRowColSet = [...new Set(dsRowCol)];
      onModelChange?.(filRowColSet);
      console.log(filRowColSet);
    }, 2000);
  };
  const handleCellClick2 = (itype, iparam) => {
    if (iparam === " ") return;
    onModelChange2?.(iparam);
  };
  const colorMap = useMemo(
    () => ({
      RUN: {
        background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
        boxShadow: "0 0 4px rgba(56, 239, 125, 0.7)",
      },
      STOP: {
        background: "linear-gradient(135deg, #f09819 0%, #edde5d 100%)",
        boxShadow: "0 0 4px rgba(240, 152, 25, 0.7)",
      },
      CUT: {
        background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
        boxShadow: "0 0 4px rgba(255, 154, 158, 0.7)",
      },
      ERROR: {
        background: "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
        boxShadow: "0 0 8px rgba(255, 65, 108, 0.9)",
      },
      OFF: {
        background: "linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)",
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
      },
      NA: {
        background: "linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)",
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
      },
    }),
    [],
  );

  const renderStatusCell = (status) => {
    const statusKey = status?.split("-")[0];
    const styleObj = colorMap[statusKey] || { background: "transparent", boxShadow: "none" };
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
          className={statusKey === "ERROR" ? "blinking" : ""}
          sx={{
            background: styleObj.background,
            boxShadow: styleObj.boxShadow,
            border: "1px solid rgba(255,255,255,0.25)",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            margin: "auto",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.2)",
            }
          }}
        ></Box>
      </Box>
    );
  };

  return idata.length > 0 ? (
    <Box sx={{ position: "relative", height: "100%" }}>
      <HiModal
        header={`FPY Details`}
        open={showModal}
        onClose={() => setShowModal(false)}
        widthModal={60}
        heightModal={80}
        whereRight="20vw"
        whereTop="10vh"
      >
        <FPYDetails selectMachineDetail={selectMachineDetail} />
      </HiModal>
      <Box sx={{ width: "100%", zIndex: "11", position: "absolute" }}>
        <LinearProgress
          sx={{ backgroundColor: "#00000000" }}
          variant="determinate"
          value={progress}
        ></LinearProgress>
      </Box>
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
                  padding: "5px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Line
              </TableCell>
              {idata.length > 0 &&
                Object.keys(idata[0]).map((keycol) =>
                  keycol !== "LINE" ? (
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
                  ) : (
                    ""
                  ),
                )}
            </TableRow>
          </TableHead>
          <TableBody>
            {idata.length > 0 &&
              idata.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.keys(row).map((key, cellIndex) => {
                    const cellKey = `${rowIndex}-${cellIndex}`;
                    const isSelected = selectedCells.has(cellKey);
                    return (
                      <TableCell
                        key={cellIndex}
                        style={{
                          padding: "6.5px",
                          textAlign: "center",
                          background: isSelected
                            ? key !== "LINE"
                              ? "#219af144"
                              : "#219af1"
                            : "",
                          cursor: "pointer",
                        }}
                      >
                        {key !== "LINE" ? (
                          row[key]?.split("-/-")[1] !== "None" ? (
                            <HiHoverReveal
                              rowIndex={rowIndex}
                              cellIndex={cellIndex}
                              trigger={
                                <Box
                                  component={"a"}
                                  onClick={() =>
                                    handleCellClick(rowIndex, cellIndex)
                                  }
                                >
                                  {renderStatusCell(row[key])}
                                </Box>
                              }
                            >
                              <Box
                                component={"div"}
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  component={"a"}
                                  onClick={() =>
                                    handleCellClick2(
                                      "Error",
                                      `${row[key]?.split("-/-")[4]}`,
                                    )
                                  }
                                >
                                  <ListItemText
                                    primary={`${row[key]?.split("-/-")[1]}-${row[key]?.split("-/-")[6]}`}
                                    secondary={
                                      <Box
                                        component={"div"}
                                        sx={{
                                          display: "flex",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            fontSize: "11px",
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          {row[key]?.split("-/-")[2]}
                                        </Typography>
                                        {row[key]?.split("-/-")[3] !== " " ? (
                                          <Typography
                                            sx={{
                                              fontSize: "11px",
                                              whiteSpace: "nowrap",
                                              color: "#ff3110",
                                            }}
                                          >
                                            {row[key]?.split("-/-")[4]} |{" "}
                                            {row[key]?.split("-/-")[3]}
                                          </Typography>
                                        ) : (
                                          ""
                                        )}
                                        <Typography
                                          sx={{
                                            fontSize: "11px",
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          {row[key]?.split("-/-")[5]}
                                        </Typography>
                                      </Box>
                                    }
                                    primaryTypographyProps={{
                                      fontSize: "13px",
                                      whiteSpace: "nowrap",
                                    }}
                                    secondaryTypographyProps={{
                                      fontSize: "11px",
                                      whiteSpace: "nowrap",
                                    }}
                                  />
                                </Box>
                                {/* Button Detail */}
                                <Button
                                  size="small"
                                  variant="contained"
                                  sx={{
                                    mt: 1,
                                    fontSize: "11px",
                                    textTransform: "none",
                                    padding: "2px 12px",
                                    minHeight: "22px",
                                  }}
                                  onClick={() => {
                                    setSelectMachineDetail({
                                      line: row.LINE,
                                      location: key.replace("M", ""),
                                    });
                                    setShowModal(true);
                                  }}
                                >
                                  Detail
                                </Button>
                              </Box>
                            </HiHoverReveal>
                          ) : (
                            <Box
                              component={"a"}
                              onClick={() =>
                                handleCellClick(rowIndex, cellIndex)
                              }
                            >
                              {renderStatusCell(row[key])}
                            </Box>
                          )
                        ) : (
                          <HiHoverReveal
                            rowIndex={rowIndex}
                            cellIndex={cellIndex}
                            trigger={
                              <Box
                                component={"a"}
                                onClick={() =>
                                  handleCellClick(rowIndex, cellIndex)
                                }
                                sx={{ fontWeight: "bold" }}
                              >
                                {row[key]}
                              </Box>
                            }
                          >
                            <Box
                              component={"a"}
                              onClick={() => handleCellClick2("Parameter", ``)}
                            >
                              Parameter
                            </Box>
                          </HiHoverReveal>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
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
export default React.memo(TableMachineStatus);
