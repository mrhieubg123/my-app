import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableSortLabel,
  Button,
} from "@mui/material";
import HiBox from "../../../../components/HiBox";
import { useTheme } from "@mui/material/styles";
import ConfirmDataGelDialog from "./confirmDataGelError";

const TableErrorMaterialReturnStatus = ({ idata = [] }) => {
  return (
    <Grid sx={{ height: "100%" }} container columns={12}>
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
            sx={{ position: "sticky", top: "0", backgroundColor: "#4099ff" }}
          >
            <TableRow>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                }}
                align="center"
              >
                WO
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                }}
                align="center"
              >
                Model
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                }}
                align="center"
              >
                KP_NO
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                }}
                align="center"
              >
                TR_SN
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                }}
                align="center"
              >
                Station
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                }}
                align="center"
              >
                Slot No
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                }}
                align="center"
              >
                Slot Request
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                }}
                align="center"
              >
                Return Qty
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                }}
                align="center"
              >
                Status
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                }}
                align="center"
              >
                End Time
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                }}
                align="center"
              >
                EMP NO
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                }}
                align="center"
              >
                Type
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                }}
                align="center"
              >
                Comment
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                }}
                align="center"
              >
                EMP Confirm
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {idata.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center" sx={{ padding: "6px 6px" }}>
                  {row.WO || ""}
                </TableCell>
                <TableCell align="center" sx={{ padding: "6px 6px" }}>
                  {row.MODEL || ""}
                </TableCell>
                <TableCell align="center" sx={{ padding: "6px 6px" }}>
                  {row.KP_NO || ""}
                </TableCell>
                <TableCell align="center" sx={{ padding: "6px 6px" }}>
                  {row.TR_SN || ""}
                </TableCell>
                <TableCell align="center" sx={{ padding: "6px 6px" }}>
                  {row.STATION || ""}
                </TableCell>
                <TableCell align="center" sx={{ padding: "6px 6px" }}>
                  {row.SLOT_NO || ""}
                </TableCell>
                <TableCell align="center" sx={{ padding: "6px 6px" }}>
                  {row.REQUEST_QTY || ""}
                </TableCell>
                <TableCell align="center" sx={{ padding: "6px 6px" }}>
                  {row.RETURN_QTY || ""}
                </TableCell>
                <TableCell align="center" sx={{ padding: "6px 6px" }}>
                  {row.STATUS || ""}
                </TableCell>
                <TableCell align="center" sx={{ padding: "6px 6px" }}>
                  {row.END_TIME || ""}
                </TableCell>
                <TableCell align="center" sx={{ padding: "6px 6px" }}>
                  {row.EMP_NO || ""}
                </TableCell>
                <TableCell align="center" sx={{ padding: "6px 6px" }}>
                  {row.TYPE || ""}
                </TableCell>
                <TableCell align="center" sx={{ padding: "6px 6px" }}>
                  {row.COMMENT || ""}
                </TableCell>
                <TableCell align="center" sx={{ padding: "6px 6px" }}>
                  {row.EMP_CONFIRM || ""}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};
export default TableErrorMaterialReturnStatus;
