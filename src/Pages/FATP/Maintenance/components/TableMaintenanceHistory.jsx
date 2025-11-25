import React from "react";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const MOCK_DATA = [
  { LINE: "L06", DATE: "2025-10-02", STATUS: "" },
  { LINE: "T04", DATE: "2025-10-02", STATUS: "Approved" },
  { LINE: "T06", DATE: "2025-10-02", STATUS: "Approved" },
  { LINE: "T07", DATE: "2025-10-02", STATUS: "Approved" },
  { LINE: "T08", DATE: "2025-10-02", STATUS: "Approved" },
  { LINE: "T09", DATE: "2025-10-02", STATUS: "On going" },
  { LINE: "T10", DATE: "2025-10-02", STATUS: "On going" },
  { LINE: "T11A", DATE: "2025-10-02", STATUS: "Approved" },
  { LINE: "T12-A", DATE: "2025-10-02", STATUS: "On going" },
  { LINE: "T12-B", DATE: "2025-10-02", STATUS: "On going" },
];

const TableMaintenanceHistory = ({ idata = [], onCallBack, monthSelect }) => {
  // idata = MOCK_DATA;
  const theme = useTheme();

  const MONTH_ABBR = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  function getMonthAbbrFromDate(dateStr) {
    if (!dateStr) return null; // hoặc ""
    // dateStr dạng "YYYY-MM-DD"
    const monthIndex = Number(dateStr.slice(5, 7)) - 1; // "11" -> 10
    return MONTH_ABBR[monthIndex] || null;
  }

  const uniqueFirstByLine = Object.values(
    idata.reduce((acc, item) => {
      const month = getMonthAbbrFromDate(item.DATE_CHECK);
      if (!acc[item.LINE]) {
        acc[item.LINE] = {
          LINE: item.LINE,
        }; // chỉ lấy lần đầu tiên LINE xuất hiện
      }
      if (!acc[item.LINE][month]) {
        acc[item.LINE][month] = [];
      }
      acc[item.LINE][month].push(item);
      return acc;
    }, {})
  ).sort((a, b) => a.LINE.localeCompare(b.LINE));

  console.log("uniqueFirstByLine", uniqueFirstByLine);
  return (
    <Box sx={{ height: "100%" }}>
      <TableContainer
        sx={{
          overflow: "auto",
          height: "100%",
          "&::-webkit-scrollbar": { width: 0, opacity: 0, height: 6 },
          "&:hover::-webkit-scrollbar": { width: 4, opacity: 1 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#cdcdcd8c",
            borderRadius: "10px",
          },
        }}
      >
        <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
          <TableHead
            sx={{
              position: "sticky",
              top: "0",
              backgroundColor: theme.palette.background.conponent,
            }}
          >
            <TableRow sx={{ background: "#518fb9" }}>
              <TableCell
                style={{ padding: "3px 6px", fontWeight: "bold" }}
                align="center"
              >
                No.
              </TableCell>
              <TableCell
                style={{
                  padding: "3px 6px",
                  fontWeight: "bold",
                  width: "120px",
                }}
                align="center"
              >
                Line
              </TableCell>
              {Array.from({ length: 12 }, (_, i) => {
                const m = MONTH_ABBR[i];
                const isSelected = m === monthSelect;
                return (
                  <TableCell
                    style={{
                      padding: "3px 6px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      background: isSelected ? "#e0f2f1" : undefined, // màu nền khi chọn
                      color: isSelected ? "#2e7d32" : undefined, // màu chữ khi chọn
                    }}
                    align="center"
                    onClick={() => onCallBack(MONTH_ABBR[i])}
                  >
                    {isSelected ? `✔ ${m}` : m}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              "& .MuiTableCell-root": {
                borderRight: "1px solid #616161", // đường kẻ dọc giữa các cell
              },
              "& .MuiTableRow-root:last-of-type .MuiTableCell-root": {
                borderBottom: 0, // bỏ đường kẻ cuối nếu muốn
              },
              "& .MuiTableCell-root:last-child": {
                borderRight: 0, // bỏ đường kẻ phải cuối cùng
              },
            }}
          >
            {idata.length > 0
              ? uniqueFirstByLine.map(
                  (
                    row,
                    index //,ERROR,ERROR_CODE,root_,EMP_confirm, act
                  ) => (
                    <TableRow key={index}>
                      <TableCell
                        align="center"
                        component="th"
                        scope="row"
                        style={{
                          padding: "3px",
                          fontSize: "12px",
                          color: row.CARD_CODE !== null ? "" : "#ff3110",
                        }}
                      >
                        {index + 1 || ""}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          padding: "3px",
                          fontSize: "12px",
                          color: row.CARD_CODE !== null ? "" : "#ff3110",
                        }}
                      >
                        {row.LINE || ""}
                      </TableCell>
                      {Array.from({ length: 12 }, (_, i) => {
                        const monthKey = MONTH_ABBR[i]; // "JAN", "FEB", ...
                        const monthArr = row[monthKey]; // mảng các item của tháng đó (hoặc undefined)
                        const rawStatus = monthArr?.[0]?.STATUS_NAME ?? null;

                        let display = "NA";
                        let bg = "#a4aca9";
                        let color = "#000";

                        if (rawStatus === "approve") {
                          display = "OK";
                          bg =
                            "linear-gradient(180deg, #66bb6a 0%, #2e7d32 100%)"; // xanh
                          color = "#fff";
                        } else if (rawStatus === null && monthArr) {
                          const todayStr = new Date()
                            .toISOString()
                            .slice(0, 10);
                          if (monthArr?.[0]?.DATE_CHECK >= todayStr) {
                            display = "Ongoing";
                            bg =
                              "linear-gradient(180deg, #fff176 0%, #fbc02d 100%)"; // vàng
                            color = "#000";
                          } else {
                            display = "Delay";
                            bg =
                              "linear-gradient(180deg,rgb(233, 85, 80) 0%,rgb(241, 16, 8) 100%)"; // vàng
                            color = "#fff";
                          }
                          // Có dữ liệu tháng nhưng STATUS_NAME null
                        }

                        return (
                          <TableCell
                            key={`${row.LINE}-${monthKey}`}
                            align="center"
                            style={{
                              fontSize: "12px",
                              background: bg,
                              color,
                              fontWeight: 700,
                            }}
                          >
                            {display}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  )
                )
              : ""}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default TableMaintenanceHistory;
