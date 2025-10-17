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

const OverTimeDetail = ({ idata = [], idataMachine = [] }) => {
  const AVAILABLE_LINES = useMemo(
    () => Array.from(new Set(idataMachine.map((r) => r.LINE))),
    [idataMachine]
  );
  const AVAILABLE_TYPES = ["Over Time", "Maintenance", "Other"];
  const [newFolderDialogOpen6, setNewFolderDialogOpen6] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    line: "",
    startTime: dayjs(), // Mặc định là thời gian hiện tại
    endTime: dayjs().add(1, "hour"), // Mặc định là 1 tiếng sau
    type: "",
    comment: "",
    idConfirm: "",
  });
  const [dataOverTime, setDataOverTime] = useState([]);

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
      field: "COMMENT",
      headerName: "Comment",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      editable: true,
    },
    {
      field: "ID_CONFIRM",
      headerName: "Confirm",
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
      dataOverTime.map((row, index) => ({
        id: index, // hoặc row.LINE nếu unique
        ...row,
      })),
    [dataOverTime]
  );

  const fetchDataOverTime = async () => {
    try {
      const response = await axiosInstance.get("api/Fatp/DataOverTime");
      setDataOverTime(response.data || []); // Cập nhật state
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchDataOverTime();
  }, []);

  const openDialogAdd = () => {
    setFormData({
      id: "",
      line: "",
      startTime: dayjs(), // Mặc định là thời gian hiện tại
      endTime: dayjs().add(1, "hour"), // Mặc định là 1 tiếng sau
      type: "",
      comment: "",
      idConfirm: "",
    });
    setNewFolderDialogOpen6(true);
  };

  const openDialogEdit = (row) => {
    setFormData({
      id: row.ID,
      line: row.LINE,
      startTime: dayjs(row.START_TIME),
      endTime: dayjs(row.END_TIME),
      type: row.TYPE,
      comment: row.Comment || "",
      idConfirm: row.ID_CONFIRM || "",
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
    if (!formData.line || !formData.type) {
      alert("Vui lòng chọn Line và Type.");
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
      const dataToSend = {
        ...formData,
        // Dayjs format: Sử dụng 'YYYY-MM-DD HH:mm:ss' hoặc 'YYYY-MM-DD HH:mm:ss.SSS'
        // Bắt buộc phải sử dụng .format() để loại bỏ 'T' và 'Z'
        startTime: formData.startTime.format("YYYY-MM-DD HH:mm:ss.SSS"),
        endTime: formData.endTime.format("YYYY-MM-DD HH:mm:ss.SSS"),
      };

      const reponse = await axiosInstance.post(
        "api/FATP/addOverTimeLine",
        dataToSend
      );
      if (reponse.data.success) {
        showToast(reponse.data.message);
        fetchDataOverTime();
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
      const dataToSend = {
        ...formData,
        // Dayjs format: Sử dụng 'YYYY-MM-DD HH:mm:ss' hoặc 'YYYY-MM-DD HH:mm:ss.SSS'
        // Bắt buộc phải sử dụng .format() để loại bỏ 'T' và 'Z'
        startTime: formData.startTime.format("YYYY-MM-DD HH:mm:ss.SSS"),
        endTime: formData.endTime.format("YYYY-MM-DD HH:mm:ss.SSS"),
      };

      const reponse = await axiosInstance.post(
        "api/FATP/editDataOverTimeFATP",
        dataToSend
      );
      if (reponse.data.success) {
        showToast(reponse.data.message);
        fetchDataOverTime();
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
        "api/FATP/deleteDataOverTimeFATP",
        {
          id: row.ID,
        }
      );
      if (reponse.data.success) {
        showToast(reponse.data.message);
        fetchDataOverTime();
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

              {/* 3. Start Time (Chọn Ngày Giờ) */}
              <Grid item size={{ xs: 12, sm: 6 }} xs={12} sm={6}>
                <DateTimePicker
                  label="Start Time (Bắt Đầu)"
                  value={formData.startTime}
                  onChange={(newDate) => handleDateChange("startTime", newDate)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>

              {/* 4. End Time (Chọn Ngày Giờ) */}
              <Grid item size={{ xs: 12, sm: 6 }} xs={12} sm={6}>
                <DateTimePicker
                  label="End Time (Kết Thúc)"
                  value={formData.endTime}
                  onChange={(newDate) => handleDateChange("endTime", newDate)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>

              {/* 5. Comment (Ghi chú) */}
              <Grid item size={{ xs: 12 }} xs={12}>
                <TextField
                  label="Comment (Ghi chú)"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  fullWidth
                />
              </Grid>

              {/* 6. ID Confirm (Người xác nhận) */}
              <Grid item size={{ xs: 12 }} xs={12}>
                <TextField
                  label="ID Confirm (Mã xác nhận/Người duyệt)"
                  name="idConfirm"
                  value={formData.idConfirm}
                  onChange={handleChange}
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
            Add Item
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
export default OverTimeDetail;
