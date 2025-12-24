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

const TableErorOver5m = ({ idata = [] }) => {
  const theme = useTheme();

  return (
    <Box sx={{ height: "100%" }}>
      <TableContainer
        sx={{
          overflow: "auto",
          height: "100%",
          "&::-webkit-scrollbar": { width: 0, opacity: 0 },
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
            <TableRow>
              <TableCell
                style={{ padding: "3px 6px", fontWeight: "bold" }}
                align="center"
              >
                No.
              </TableCell>
              <TableCell
                style={{ padding: "3px 6px", fontWeight: "bold" }}
                align="center"
              >
                Name
              </TableCell>
              <TableCell
                style={{ padding: "3px 6px", fontWeight: "bold" }}
                align="center"
              >
                Đã lên đơn
              </TableCell>
              <TableCell
                style={{ padding: "3px 6px", fontWeight: "bold" }}
                align="center"
              >
                Chưa lên đơn
              </TableCell>
              <TableCell
                style={{ padding: "3px 6px", fontWeight: "bold" }}
                align="center"
              >
                Total Qty
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {idata.length > 0
              ? idata.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell
                      component="th"
                      align="center"
                      scope="row"
                      style={{
                        padding: "12px 0px",
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
                    <TableCell
                      align="center"
                      style={{
                        padding: "3px",
                        fontSize: "12px",
                        color: row.CARD_CODE !== null ? "" : "#ff3110",
                      }}
                    >
                      {row.MACHINE_NAME || ""}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        padding: "3px",
                        fontSize: "12px",
                        color: row.CARD_CODE !== null ? "" : "#ff3110",
                      }}
                    >
                      {row.LOCATION || ""}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        padding: "3px",
                        fontSize: "12px",
                        color: row.CARD_CODE !== null ? "" : "#ff3110",
                      }}
                    >
                      {row.COL || ""}
                    </TableCell>
                  </TableRow>
                ))
              : ""}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default TableErorOver5m;
