import React, { useState } from "react";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Button,
} from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ErrorDetail = ({ idata = [] }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [filterText, setFilterText] = useState("");

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = idata.sort(getComparator(order, orderBy));

  const rowHeader = (key, value) => {
    return (
      <TableCell
        sortDirection={orderBy === key ? order : false}
        style={{
          padding: "3px 6px",
          fontWeight: "bold",
          color: "#000",
        }}
        align="center"
      >
        <TableSortLabel
          active={orderBy === key}
          direction={orderBy === key ? order : "asc"}
          onClick={() => handleRequestSort(key)}
          sx={{
            color: "black", // màu chữ
            "& .MuiTableSortLabel-icon": {
              color: "black !important", // màu icon arrow
            },
            "&.Mui-active": {
              color: "black",
            },
          }}
        >
          {value}
        </TableSortLabel>
      </TableCell>
    );
  };

  const handleExportExel = () => {
    // 1. Chuyển mảng JSON thành worksheet
    const worksheet = XLSX.utils.json_to_sheet(idata);

    // 2. Tạo workbook và gắn worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // 3. Xuất ra dạng array buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    // 4. Tạo file blob và download
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, `data_${Date.now()}.xlsx`);
  }

  return (
    <Box sx={{ height: "100%" }}>
        <Button sx={{marginLeft: '15px' }} variant="contained" color='error' onClick={ handleExportExel}>Export exel</Button>
      <TableContainer
        sx={{
          overflow: "auto",
          height: "90%",
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
            sx={{ position: "sticky", top: "0", backgroundColor: "#f6f7f5" }}
          >
            <TableRow>
              <TableCell
                style={{
                  padding: "3px 6px",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                No.
              </TableCell>
              {rowHeader("LINE","Line")}
              {rowHeader("MACHINE_NAME","Machine")}
              {rowHeader("ERROR_CODE","Error Code")}
              {rowHeader("ERROR_TYPE","Error")}
              <TableCell
                style={{
                  padding: "3px 6px",
                  fontWeight: "bold",
                  color: "#000",
                }}
                align="center"
              >
                Root
              </TableCell>
              <TableCell
                style={{
                  padding: "3px 6px",
                  fontWeight: "bold",
                  color: "#000",
                }}
                align="center"
              >
                Action
              </TableCell>
              {rowHeader("TIME","Time")}
              {rowHeader("START_TIME","Start Time")}
              {rowHeader("END_TIME","End Time")}
              <TableCell
                style={{
                  padding: "3px 6px",
                  fontWeight: "bold",
                  color: "#000",
                }}
                align="center"
              >
                Emp Confirm
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {idata.length > 0
              ? sortedRows.map(
                  (
                    row,
                    index //,ERROR,ERROR_CODE,root_,EMP_confirm, act
                  ) => (
                    <TableRow key={index}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ padding: "6px", color: "#000" }}
                      >
                        {index + 1 || ""}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ padding: "3px 6px", color: "#000" }}
                      >
                        {row.LINE || ""}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ padding: "3px 6px", color: "#000" }}
                      >
                        {row[`MACHINE_NAME`] || ""}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ padding: "3px 6px", color: "#000" }}
                      >
                        {row[`ERROR_CODE`] || ""}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ padding: "3px 6px", color: "#000" }}
                      >
                        {row[`ERROR_TYPE`] || ""}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ padding: "3px 6px", color: "#000" }}
                      >
                        {row[`CAUSE`] || ""}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ padding: "3px 6px", color: "#000" }}
                      >
                        {row[`SOLUTION`] || ""}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ padding: "3px 6px", color: "#000" }}
                      >
                        {row.TIME && ((row.TIME * 1) / 60).toFixed(2)}m
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ padding: "3px 6px", color: "#000" }}
                      >
                        {row[`START_TIME`] &&
                          row[`START_TIME`]
                            .replace("T", " ")
                            .replace(".000Z", "")}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ padding: "3px 6px", color: "#000" }}
                      >
                        {row[`END_TIME`] &&
                          row[`END_TIME`]
                            .replace("T", " ")
                            .replace(".000Z", "")}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ padding: "3px 6px", color: "#000" }}
                      >
                        {row.NAME || ""}
                      </TableCell>
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
export default ErrorDetail;
