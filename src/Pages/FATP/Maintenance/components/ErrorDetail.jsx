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
      field: "NAME_MACHINE",
      headerName: "Machine",
      flex: 4, // tự chia chiều rộng
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "DATE_CHECK",
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
      field: "QR_CODE",
      headerName: "QR checklist",
      flex: 4, // tự chia chiều rộng
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <a
          href={`https://fiisw-cns.myfiinet.com/paperless/machine-history?qrcode=${encodeURIComponent(
            params.value || ""
          )}`}
          style={{ whiteSpace: "normal", wordWrap: "break-word", color: "#3498db" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          {params.value || ""}
        </a>
      ),
    },
    {
      field: "STATUS",
      headerName: "Status",
      flex: 2, // tự chia chiều rộng
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const row = params.row;
        const todayStr = new Date().toISOString().slice(0, 10);
        const status =
          row.STATUS_NAME === "approve"
            ? "Approved"
            : row.DATE_CHECK < todayStr
            ? "Delay"
            : "Ongoing";
        return (
          <Box
            sx={{
              display: "inline-block", // không full width
              px: 1, // padding ngang nhỏ
              py: 0.3,
              background:
                status === "Approved"
                  ? "linear-gradient(180deg, #66bb6a 0%, #2e7d32 100%)" // xanh lá gradient
                  : status === "Ongoing"
                  ? "linear-gradient(180deg, #fff176 0%, #fbc02d 100%)"
                  : "linear-gradient(180deg,rgb(233, 85, 80) 0%,rgb(241, 16, 8) 100%)",
              borderRadius: 2,
              color: status === "Ongoing" ? "#000" : "#fff", // màu chữ
              fontWeight: 700,
              minWidth: "fit-content",
            }}
          >
            {status}
          </Box>
        );
      },
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
