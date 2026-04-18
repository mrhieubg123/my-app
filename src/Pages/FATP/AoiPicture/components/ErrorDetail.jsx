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
      flex: 0.5, // tự chia chiều rộng
      minWidth: 100,
    },
    {
      field: "NAME_MACHINE",
      headerName: "Machine name",
      flex: 1, // tự chia chiều rộng
      minWidth: 150,
    },
    {
      field: "MODEL_NAME",
      headerName: "Model",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
    },
    {
      field: "SERIAL_NUMBER",
      headerName: "SN",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
    },
    {
      field: "FORCE_1",
      headerName: "Force 1",
      flex: 0.5, // tự chia chiều rộng
      minWidth: 50,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {(params.value || 0).toFixed(2)}
        </div>
      ),
    },
    {
      field: "FORCE_2",
      headerName: "Force 2",
      flex: 0.5, // tự chia chiều rộng
      minWidth: 50,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {(params.value || 0).toFixed(2)}
        </div>
      ),
    },
    {
      field: "FORCE_3",
      headerName: "Force 3",
      flex: 0.5, // tự chia chiều rộng
      minWidth: 50,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {(params.value || 0).toFixed(2)}
        </div>
      ),
    },
    {
      field: "FORCE_4",
      headerName: "Force 4",
      flex: 0.5, // tự chia chiều rộng
      minWidth: 50,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {(params.value || 0).toFixed(2)}
        </div>
      ),
    },
    // {
    //   field: "solution",
    //   headerName: "Solution",
    //   width: 150,
    //   editable: true,
    // },
    {
      field: "TIME_UPDATE",
      headerName: "Time",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {(params.value || "").replace("T", " ").replace(".000Z", "")}
        </div>
      ),
    },
    {
      field: "STATE",
      headerName: "State",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      // renderCell: (params) => (
      //   <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
      //     {((params.value || 0)/60).toFixed(2)}m
      //   </div>
      // ),
    },
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
};
export default ErrorDetail;
