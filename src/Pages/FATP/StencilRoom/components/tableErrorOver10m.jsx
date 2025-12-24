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
                Vị trí dừng
              </TableCell>
              <TableCell
                style={{ padding: "3px 6px", fontWeight: "bold" }}
                align="center"
              >
                Thông tin
              </TableCell>
              <TableCell
                style={{ padding: "3px 6px", fontWeight: "bold" }}
                align="center"
              >
                Tồn kho
              </TableCell>
              <TableCell
                style={{ padding: "3px 6px", fontWeight: "bold" }}
                align="center"
              >
                An toàn tồn
              </TableCell>
              <TableCell
                style={{ padding: "3px 6px", fontWeight: "bold" }}
                align="center"
              >
                Report
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {idata.length > 0
              ? idata.map(
                  (
                    row,
                    index //,ERROR,ERROR_CODE,root_,EMP_confirm, act
                  ) => (
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
                      <TableCell
                        align="center"
                        style={{
                          padding: "3px",
                          fontSize: "12px",
                          color: row.CARD_CODE !== null ? "" : "#ff3110",
                        }}
                      >
                        {row.VAL.toFixed(1) || ""}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          padding: "3px",
                          fontSize: "12px",
                          color: row.CARD_CODE !== null ? "" : "#ff3110",
                        }}
                      >
                        {row.CREATED_AT || ""}
                      </TableCell>
                      {/* <TableCell
                        align="center"
                        style={{
                          padding: "3px",
                          fontSize: "12px",
                          color: row.CARD_CODE !== null ? "" : "#ff3110",
                        }}
                      >
                        <Box
                          sx={{
                            display: "inline-block", // không full width
                            px: 1, // padding ngang nhỏ
                            py: 0.3,
                            background:
                              "linear-gradient(180deg,rgb(233, 85, 80) 0%,rgb(241, 16, 8) 100%)",
                            borderRadius: 2,
                            color: "#fff", // màu chữ
                            fontWeight: 700,
                            minWidth: "fit-content",
                          }}
                        >
                          Failure
                        </Box>
                      </TableCell> */}
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
export default TableErorOver5m;
