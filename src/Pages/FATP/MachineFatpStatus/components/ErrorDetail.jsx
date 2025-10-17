import React, { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  TableSortLabel,
  Button,
} from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ErrorDetail = ({ idata = [] }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [filterText, setFilterText] = useState("");
  // state filters theo cột
  const [filters, setFilters] = useState({
    LINE: "",
    MACHINE_NAME: "",
    ERROR_TYPE: "",
    ERROR_CODE: "",
  });

  // danh sách unique cho mỗi cột
  const uniqueLine = useMemo(
    () => Array.from(new Set(idata.map((r) => r.LINE))),
    [idata]
  );
  const uniqueMachine = useMemo(
    () => Array.from(new Set(idata.map((r) => r.MACHINE_NAME))),
    [idata]
  );
  const uniqueErrorCode = useMemo(
    () => Array.from(new Set(idata.map((r) => r.ERROR_CODE))),
    [idata]
  );
  const uniqueErrorType = useMemo(
    () => Array.from(new Set(idata.map((r) => r.ERROR_TYPE))),
    [idata]
  );

  // handle change
  const handleFilterChange = (column) => (event) => {
    setFilters((prev) => ({
      ...prev,
      [column]: event.target.value,
    }));
  };

  // lọc dữ liệu
  const filteredRows = useMemo(() => {
    return idata.filter(
      (row) =>
        (filters.LINE === "" || row.LINE === filters.LINE) &&
        (filters.MACHINE_NAME === "" ||
          row.MACHINE_NAME === filters.MACHINE_NAME) &&
        (filters.ERROR_CODE === "" || row.ERROR_CODE === filters.ERROR_CODE) &&
        (filters.ERROR_TYPE === "" || row.ERROR_TYPE === filters.ERROR_TYPE)
    );
  }, [filters]);

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
      type: "array",
    });

    // 4. Tạo file blob và download
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, `data_${Date.now()}.xlsx`);
  };

  const columns = [
    {
      field: "LINE",
      headerName: "Line",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
    },
    {
      field: "MACHINE_NAME",
      headerName: "Machine name",
      flex: 1, // tự chia chiều rộng
      minWidth: 150,
      editable: true,
    },
    {
      field: "ERROR_CODE",
      headerName: "Error Code",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      editable: true,
    },
    {
      field: "ERROR_TYPE",
      headerName: "Error",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      editable: true,
    },
    // {
    //   field: "root",
    //   headerName: "Root",
    //   width: 150,
    //   editable: true,
    // },
    // {
    //   field: "solution",
    //   headerName: "Solution",
    //   width: 150,
    //   editable: true,
    // },
    {
      field: "START_TIME",
      headerName: "Start time",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      editable: true,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {(params.value || "").replace("T", " ").replace(".000Z", "")}
        </div>
      ),
    },
    {
      field: "END_TIME",
      headerName: "End time",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      editable: true,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {(params.value || "").replace("T", " ").replace(".000Z", "")}
        </div>
      ),
    },
    {
      field: "TIME",
      headerName: "Time",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      editable: true,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {((params.value || 0)/60).toFixed(2)}m
        </div>
      ),
    },
    // {
    //   field: "confirm",
    //   headerName: "Emp confirm",
    //   width: 150,
    //   editable: true,
    // },
  ];

  const rowsWithId = idata.map((row, index) => ({
    id: index, // hoặc row.LINE nếu unique
    ...row,
  }));

  console.log("idata", idata);
  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Button
        sx={{ marginLeft: "15px" }}
        variant="contained"
        color="error"
        onClick={handleExportExel}
      >
        Export exel
      </Button>
      <DataGrid
        rows={rowsWithId}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        sx={{
          height: "90%",
          backgroundColor: "transparent",
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "transparent !important",
          },
          "& .MuiDataGrid-cell": {
            whiteSpace: "normal",
            wordBreak: "break-word",
            lineHeight: "1.3",
            py: 1, // padding top/bottom
            alignItems: "flex-start", // ensure top alignment when multi-line
          },
        }}
      />
    </Box>
  );

  return (
    <Box sx={{ height: "100%" }}>
      <Button
        sx={{ marginLeft: "15px" }}
        variant="contained"
        color="error"
        onClick={handleExportExel}
      >
        Export exel
      </Button>
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
              {rowHeader("LINE", "Line")}
              {rowHeader("MACHINE_NAME", "Machine")}
              {rowHeader("ERROR_CODE", "Error Code")}
              {rowHeader("ERROR_TYPE", "Error")}
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
              {rowHeader("TIME", "Time")}
              {rowHeader("START_TIME", "Start Time")}
              {rowHeader("END_TIME", "End Time")}
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
            {/* hàng filter dropdown */}
            <TableRow>
              <TableCell>
                <Select
                  value={filters.LINE}
                  onChange={handleFilterChange("LINE")}
                  displayEmpty
                  size="small"
                  fullWidth
                >
                  <MenuItem value="">Line</MenuItem>
                  {uniqueLine.map((n) => (
                    <MenuItem key={n} value={n}>
                      {n}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={filters.MACHINE_NAME}
                  onChange={handleFilterChange("MACHINE_NAME")}
                  displayEmpty
                  size="small"
                  fullWidth
                >
                  <MenuItem value="">Machine</MenuItem>
                  {uniqueMachine.map((a) => (
                    <MenuItem key={a} value={a}>
                      {a}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={filters.ERROR_CODE}
                  onChange={handleFilterChange("ERROR_CODE")}
                  displayEmpty
                  size="small"
                  fullWidth
                >
                  <MenuItem value="">Error code</MenuItem>
                  {uniqueErrorCode.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={filters.ERROR_TYPE}
                  onChange={handleFilterChange("ERROR_TYPE")}
                  displayEmpty
                  size="small"
                  fullWidth
                >
                  <MenuItem value="">Error type</MenuItem>
                  {uniqueErrorType.map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </Select>
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
