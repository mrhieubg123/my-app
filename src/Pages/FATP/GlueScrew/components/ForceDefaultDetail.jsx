import React, { useState, useMemo, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Grid,
  MenuItem,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { getAuthorizedAxiosIntance } from "../../../../utils/axiosConfig";
import { AddOutlined, EditOutlined, DeleteOutline } from "@mui/icons-material";

const axiosInstance = await getAuthorizedAxiosIntance();

const ForceDefaultDetail = ({
  idata = [],
  idataMachine = [],
  onModelChange,
}) => {
  const AVAILABLE_LINES = useMemo(
    () => Array.from(new Set(idataMachine.map((r) => r.LINE))),
    [idataMachine]
  );
  const AVAILABLE_TYPES = ["Screw", "Glue", "Shielding"];
  const [newFolderDialogOpen6, setNewFolderDialogOpen6] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    line: "",
    name: "",
    location: "",
    type: "",
    min: "",
    max: "",
  });

  const columns = [
    {
      field: "LINE",
      headerName: "Line",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
    },
    {
      field: "TYPE",
      headerName: "Type",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
    },
    {
      field: "LOCATION",
      headerName: "Location",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
    },
    {
      field: "NAME_MACHINE",
      headerName: "Name",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      editable: true,
    },
    {
      field: "MIN_FORCE",
      headerName: "Min Force",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      editable: true,
    },
    {
      field: "MAX_FORCE",
      headerName: "Max Force",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      editable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        // params.row contains the full row data
        const row = params.row;

        return (
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
            <Button
              title="Edit"
              onClick={() => openDialogEdit(row)}
              sx={{ minWidth: "unset", backgroundColor: "#9994" }}
              size="small"
            >
              <EditOutlined sx={{ fontSize: "0.8rem" }}></EditOutlined>
            </Button>
            <Button
              title="Delete"
              onClick={() => handleDelete(row)}
              color="error"
              sx={{ minWidth: "unset", backgroundColor: "#9994" }}
              size="small"
            >
              <DeleteOutline sx={{ fontSize: "0.8rem" }}></DeleteOutline>
            </Button>
          </Box>
        );
      },
    },
  ];

  const rowsWithId = useMemo(
    () =>
      idata.map((row, index) => ({
        id: index, // hoặc row.LINE nếu unique
        ...row,
      })),
    [idata]
  );

  const openDialogAdd = () => {
    setFormData({
      id: "",
      line: "",
      type: "",
      min: "",
      max: "",
      name:"",
    });
    setNewFolderDialogOpen6(true);
  };

  const openDialogEdit = (row) => {
    setFormData({
      id: row.ID,
      line: row.LINE,
      min: row.MIN_FORCE,
      max: row.MAX_FORCE,
      type: row.TYPE,
      location: row.LOCATION || "",
      name: row.NAME_MACHINE || "",
    });
    setNewFolderDialogOpen6(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const onSave = () => {
    // Thêm logic kiểm tra dữ liệu hợp lệ tại đây (ví dụ: line và type không được trống)
    if (!formData.line || !formData.type|| !formData.location|| !formData.min|| !formData.max) {
      alert("Vui lòng chọn Line/Type/Location/Min Force/Max Force.");
      return;
    }

    if (formData.id) handleEdit(formData);
    else handleSave(formData);
  };

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const handleSave = async (formData) => {
    //add item
    try {
      const reponse = await axiosInstance.post(
        "api/Screw/addDataForceDefault",
        formData
      );
      if (reponse.data.success) {
        showToast(reponse.data.message);
        onModelChange();
        setNewFolderDialogOpen6(false);
      } else {
        showToast("Thêm item thất bại", "error");
      }
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      showToast("Lỗi khi kết nối server", "error");
    }
  };

  const handleEdit = async (formData) => {
    //add item
    try {
      const reponse = await axiosInstance.post(
        "api/Screw/editDataForceDefault",
        formData
      );
      if (reponse.data.success) {
        showToast(reponse.data.message);
        onModelChange();
        setNewFolderDialogOpen6(false);
      } else {
        showToast("Edit fail", "error");
      }
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      showToast("Lỗi khi kết nối server", "error");
    }
  };

  const handleDelete = async (row) => {
    //add item
    try {
      const reponse = await axiosInstance.post(
        "api/Screw/deleteDataForceDefault",
        {
          id: row.ID,
        }
      );
      if (reponse.data.success) {
        showToast(reponse.data.message);
        onModelChange();
      } else {
        showToast("Delete fail", "error");
      }
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      showToast("Lỗi khi kết nối server", "error");
    }
  };

  console.log("idata", idata);
  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Dialog
        open={newFolderDialogOpen6}
        onClose={() => setNewFolderDialogOpen6(false)}
      >
        <DialogTitle>
          {formData.id ? "Edit" : "Add new"} item (Over time/Maintenance)
        </DialogTitle>
        <DialogContent sx={{ paddingTop: "8px !important", minWidth: "350px" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={3}>
              {/* 1. Line (Chọn trong danh sách) */}
              <Grid item size={{ xs: 12, sm: 6 }} xs={12} sm={6}>
                <TextField
                  select
                  label="Line (Chuyền)"
                  name="line"
                  value={formData.line}
                  onChange={handleChange}
                  fullWidth
                  required
                >
                  {AVAILABLE_LINES.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* 2. Type (Chọn trong danh sách) */}
              <Grid item size={{ xs: 12, sm: 6 }} xs={12} sm={6}>
                <TextField
                  select
                  label="Type (Loại)"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  fullWidth
                  required
                >
                  {AVAILABLE_TYPES.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item size={{ xs: 12 }} xs={12}>
                <TextField
                  label="Name machine (tên máy)"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item size={{ xs: 4 }} xs={12}>
                <TextField
                  label="Location (vị trí)"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              {/* 5. Comment (Ghi chú) */}
              <Grid item size={{ xs: 4 }} xs={12}>
                <TextField
                  label="Min Force"
                  name="min"
                  value={formData.min}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>

              {/* 6. ID Confirm (Người xác nhận) */}
              <Grid item size={{ xs: 4 }} xs={12}>
                <TextField
                  label="Max Force"
                  name="max"
                  value={formData.max}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={() => setNewFolderDialogOpen6(false)}
          >
            Exit
          </Button>
          <Button variant="contained" onClick={onSave}>
            {formData.id ? "Edit Item" : "Add Item"}
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        sx={{ marginLeft: "15px" }}
        variant="contained"
        onClick={openDialogAdd}
      >
        Add item
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
      {/* Toast notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
export default ForceDefaultDetail;
