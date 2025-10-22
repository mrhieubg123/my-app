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

const TableMaintenanceHistory = ({ idata = [] }) => {
  idata = MOCK_DATA;
  const theme = useTheme();

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
                style={{ padding: "3px 6px", fontWeight: "bold", width: '120px' }}
                align="center"
              >
                Line
              </TableCell>
              <TableCell
                style={{ padding: "3px 6px", fontWeight: "bold" }}
                align="center"
              >
                Jan
              </TableCell>
              <TableCell
                style={{ padding: "3px 6px", fontWeight: "bold" }}
                align="center"
              >
                Feb
              </TableCell>
              <TableCell
                style={{ padding: "3px 6px", fontWeight: "bold" }}
                align="center"
              >
                Mar
              </TableCell>
              <TableCell
                style={{ padding: "3px 6px", fontWeight: "bold" }}
                align="center"
              >
                Apr
              </TableCell>
              <TableCell
                style={{ padding: "3px 6px", fontWeight: "bold" }}
                align="center"
              >
                May
              </TableCell>
              <TableCell
                style={{ padding: "3px 6px", fontWeight: "bold" }}
                align="center"
              >
                Jun
              </TableCell>
              <TableCell
                style={{ padding: "3px 6px", fontWeight: "bold" }}
                align="center"
              >
                Jul
              </TableCell>
              <TableCell
                style={{ padding: "3px 6px", fontWeight: "bold" }}
                align="center"
              >
                Aug
              </TableCell>
              <TableCell
                style={{ padding: "3px 6px", fontWeight: "bold" }}
                align="center"
              >
                Sep
              </TableCell>
              <TableCell
                style={{ padding: "3px 6px", fontWeight: "bold" }}
                align="center"
              >
                Oct
              </TableCell>
              <TableCell
                style={{ padding: "3px 6px", fontWeight: "bold" }}
                align="center"
              >
                Nov
              </TableCell>
              <TableCell
                style={{ padding: "3px 6px", fontWeight: "bold" }}
                align="center"
              >
                Dec
              </TableCell>
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
              ? idata.map(
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
                      {Array.from({ length: 12 }, (_, i) => (
                        <TableCell
                          align="center"
                          style={{
                            fontSize: "12px",
                            background:
                              row.STATUS === "Approved"
                                ? "linear-gradient(180deg, #66bb6a 0%, #2e7d32 100%)" // xanh lá gradient
                                : row.STATUS === "On going"
                                ? "linear-gradient(180deg, #fff176 0%, #fbc02d 100%)"
                                : "#a4aca9",
                            color: row.STATUS === "Approved" ? "#fff" : "#000", // màu chữ
                            fontWeight: 700,
                          }}
                        >
                          {row.STATUS === "Approved"
                            ? "OK"
                            : row.STATUS === "On going"
                            ? "Ongoing"
                            : "NA"}
                        </TableCell>
                      ))}
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
