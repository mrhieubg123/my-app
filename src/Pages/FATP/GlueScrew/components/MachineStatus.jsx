import React, { useMemo, useState, useRef } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  ListItemText,
  TableBody,
  LinearProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HiModal from "../../../../components/HiModal";
import LineChartDetail from "./LineChartDetail";
import HiHoverReveal from "../../../../components/HiHoverReveal";

const TableMachineStatus = ({
  idata = [],
  dataForce= [],
  onModelChange,
  onModelChange2,
  activeModeId,
  model,
}) => {
  const theme = useTheme();
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const [showModal1, setShowModal1] = useState(false);
  const [queryMain, setQueryMain] = useState({
    line: "",
    name: "",
    dateFrom: model.dateFrom,
    dateTo: model.dateTo,
    type: activeModeId,
  });
  const [selectedCells, setSelectedCells] = useState(new Map());
  const [selectedRows, setSelectedRows] = useState(new Set());
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
          newSelection.delete(`${row}-${colIdx}`)
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
      RUN: "#00e396",
      OFF: "#ffe636",
      CUT: "blue",
      WARNING: "#ffb640",
      ERROR: "#ff3110",
      NA: "#808080",
    }),
    []
  );

  const numMaxCols = useMemo(() => {
    if (!idata || idata.length === 0) {
      return 1;
    }

    // 1. Đếm tần suất sử dụng Map
    const lineCounts = idata.reduce((acc, item) => {
      const line = item.LINE;
      // Tăng bộ đếm cho line hiện tại
      acc[line] = (acc[line] || 0) + 1;
      return acc;
    }, {});

    // 2. Tìm Max
    let maxLine = null;
    let maxCount = 0;

    for (const line in lineCounts) {
      const count = lineCounts[line];
      if (count > maxCount) {
        maxCount = count;
        maxLine = line;
      }
    }
    console.log("numMaxCols", maxCount);
    // Trả về kết quả
    return maxCount;
  }, [idata]);

  const renderStatusCell = (item) => {
    const fpy = (
      (item.PASS_COUNT / (item.PASS_COUNT + item.FAIL_COUNT)) *
      100
    ).toFixed(2);
    const status = fpy > 99.7 ? "RUN" : fpy > 50 ? "WARNING" : "ERROR";
    const color = colorMap[status] || "#808080";
    return (
      <HiHoverReveal
        trigger={
          <Box
            onClick={() => showModalAnalysisDetail(item)}
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
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                margin: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: "11px" }}>{fpy}</Typography>
            </Box>
          </Box>
        }
      >
        <ListItemText
          primary={item.NAME_MACHINE}
          secondary={
            <Box
              component={"div"}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Typography sx={{ fontSize: "11px", whiteSpace: "nowrap" }}>
                PASS: {item.PASS_COUNT}
              </Typography>
              <Typography
                sx={{
                  fontSize: "11px",
                  whiteSpace: "nowrap",
                  color: "#ff3110",
                }}
              >
                FAIL: {item.FAIL_COUNT}
              </Typography>
            </Box>
          }
          slotProps={{
            primary: {
              fontSize: "13px",
              fontWeight: "bold",
              color: "primary.main",
            },
            secondary: {
              fontSize: "11px",
              whiteSpace: "nowrap",
            },
          }}
        />
      </HiHoverReveal>
    );
  };

  const showModalAnalysisDetail = (item) => {
    setQueryMain((prev) => ({
      ...prev,
      line: item.LINE,
      name: item.NAME_MACHINE,
    }));
    setShowModal1(true);
  };

  return idata.length > 0 ? (
    <>
      <HiModal
        header={`Force Analysis Detail`}
        open={showModal1}
        onClose={() => setShowModal1(false)}
        widthModal={80}
        heightModal={80}
      >
        <LineChartDetail model={queryMain} dataForce={dataForce}/>
      </HiModal>
      <Box sx={{ position: "relative", height: "100%" }}>
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
                <TableCell
                  key={activeModeId}
                  align="center"
                  sx={{ fontWeight: 700 }}
                  colSpan={numMaxCols}
                >
                  {activeModeId} Machine
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(new Set(idata.map((item) => item.LINE))).map(
                (line, rIdx) => {
                  const listMachineRow = idata.filter(
                    (item) => item.LINE === line
                  );
                  return (
                    <TableRow key={line}>
                      <TableCell
                        key={0}
                        style={{
                          padding: "6.5px",
                          textAlign: "center",
                          cursor: "pointer",
                        }}
                      >
                        <HiHoverReveal
                          rowIndex={rIdx}
                          cellIndex={0}
                          trigger={
                            <Box
                              component={"a"}
                              onClick={() => handleCellClick(rIdx, 0)}
                              sx={{ fontWeight: "bold" }}
                            >
                              {line}
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
                      </TableCell>
                      {Array.from({ length: numMaxCols }).map((_, cIdx) => {
                        return (
                          <TableCell
                            key={`${line}-1`}
                            style={{
                              padding: "6.5px",
                              textAlign: "center",
                              cursor: "pointer",
                            }}
                          >
                            {cIdx < listMachineRow.length
                              ? renderStatusCell(listMachineRow[cIdx])
                              : ""}
                          </TableCell>
                        );
                      })}
                      {/* <TableCell
                      key={`${line}-1`}
                      style={{
                        padding: "6.5px",
                        // textAlign: "center",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "row",
                        gap: "4px", // Tùy chọn: Thêm khoảng cách giữa các phần tử
                        justifyContent: "start",
                      }}
                    >
                      {idata
                        .filter((item) => item.LINE === line)
                        .map((machine, cIdx) => renderStatusCell(machine))}
                    </TableCell> */}
                    </TableRow>
                  );
                }
              )}

              {idata.length === 0 && (
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{ py: 4, color: "text.secondary" }}
                  >
                    Không có dữ liệu.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
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
  );
};
export default React.memo(TableMachineStatus);
