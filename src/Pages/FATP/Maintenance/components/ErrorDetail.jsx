import React, { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ErrorDetail = ({ idata = [] }) => {
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
      field: "id",
      headerName: "ID",
      flex: 1,
      minWidth: 90,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "LINE",
      headerName: "Line",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "MACHINE_NAME",
      headerName: "Machine",
      flex: 4, // tự chia chiều rộng
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "DATE_TIME",
      headerName: "Check date",
      flex: 2, // tự chia chiều rộng
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {(params.value || "").replace("T", " ").replace(".000Z", "")}
        </div>
      ),
    },
    {
      field: "CODE",
      headerName: "QR checklist",
      flex: 4, // tự chia chiều rộng
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "STATUS",
      headerName: "Status",
      flex: 2, // tự chia chiều rộng
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
  ];

  const rowsWithId = idata.map((row, index) => ({
    id: index, // hoặc row.LINE nếu unique
    ...row,
  }));

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
