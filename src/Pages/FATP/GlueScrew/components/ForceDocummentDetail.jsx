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
  Stack,
  Typography,
  LinearProgress,
  Button,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { getAuthorizedAxiosIntance } from "../../../../utils/axiosConfig";
import {
  AddOutlined,
  EditOutlined,
  Download,
  DeleteOutline,
  UploadFile,
} from "@mui/icons-material";

const axiosInstance = await getAuthorizedAxiosIntance();

const ForceDocummentDetail = ({
  idata = [],
  idataMachine = [],
  onModelChange,
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dataScrewDocummentUpload, setDataScrewDocummentUpload] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  // const AVAILABLE_LINES = useMemo(
  //   () => Array.from(new Set(idataMachine.map((r) => r.LINE))),
  //   [idataMachine]
  // );
  const AVAILABLE_LINES = ["L06","T04","T06","T07","T08","T09","T10","T11"];
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

  const fetchDataErrorHistory = async () => {
    try {
      const response = await axiosInstance.get(
        "api/Screw/getDataScrewDocummentUpload"
      );
      setDataScrewDocummentUpload(response.data || []); // Cập nhật state
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchDataErrorHistory();
  }, []);

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
      field: "PATH",
      headerName: "File",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
    },
    {
      field: "CREATED_AT",
      headerName: "Created at",
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
              title="Download"
              onClick={() => handleDownload(row.PATH)}
              sx={{ minWidth: "unset", backgroundColor: "#9994" }}
              size="small"
            >
              <Download sx={{ fontSize: "0.8rem" }}></Download>
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
      dataScrewDocummentUpload.map((row, index) => ({
        id: index, // hoặc row.LINE nếu unique
        ...row,
      })),
    [dataScrewDocummentUpload]
  );

  const openDialogAdd = () => {
    setFormData({
      id: "",
      line: "",
      type: "",
      min: "",
      max: "",
      name: "",
    });
    setNewFolderDialogOpen6(true);
  };

  const openDialogEdit = (row) => {
    setFormData({
      id: row.ID,
      line: row.LINE,
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
    if (!formData.line || !formData.type || !uploadFile) {
      alert("Vui lòng chọn Line/Type/UploadFile.");
      return;
    }

    if (formData.id) handleEdit(formData);
    // else handleSave(formData);
    else upload();
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
        "api/screw/addDataForceDefault",
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
        "api/screw/editDataForceDefault",
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
        "api/screw/deleteScrewDocummentUpload",
        {
          id: row.ID,
          path: row.PATH,
        }
      );
      if (reponse.data.success) {
        showToast(reponse.data.message);
        fetchDataErrorHistory();
        // onModelChange();
      } else {
        showToast("Delete fail", "error");
      }
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      showToast("Lỗi khi kết nối server", "error");
    }
  };

  const handleDownload = async (filename) => {
    const res = await fetch("/config.json");
    const config = await res.json();

    // filenameFromDB có thể là "uploads/1729_report.xlsx" hoặc "1729_report.xlsx"
    const params = new URLSearchParams({ path: filename.replace('uploads/','') });
    const url = `${
      config.apiBaseUrl
    }/api/screw/downloadScrewDocummentUpload?${params.toString()}`;

    window.open(url, "_blank");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setUploadFile(file);
  };
  const handleDropOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const upload = async () => {
    if (!uploadFile) return;
    const formDataDocumment = new FormData();
    formDataDocumment.append("file", uploadFile);
    formDataDocumment.append("line", formData.line);
    formDataDocumment.append("type", formData.type);
    try {
      setIsUploading(true);
      setUploadProgress(0);

      await axiosInstance.post(
        `api/screw/uploadScrewDocumment`,
        formDataDocumment,
        {
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(percent);
          },
        }
      );
      showToast("✅ Upload thành công");
      setUploadFile(null);
      setNewFolderDialogOpen6(false);
      fetchDataErrorHistory();
    } catch (err) {
      showToast(err.response?.data?.message || "❌ Upload thất bại", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Dialog
        open={newFolderDialogOpen6}
        onClose={() => setNewFolderDialogOpen6(false)}
      >
        <DialogTitle>{formData.id ? "Edit" : "Add new"} documment</DialogTitle>
        <DialogContent sx={{ paddingTop: "8px !important", minWidth: "500px" }}>
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
              <Grid>
                <Box
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mt: 1, height: "50px" }}
                >
                  <Button
                    variant={isDragging ? "outlined" : "contained"}
                    component="label"
                    startIcon={<UploadFile />}
                    sx={{ whiteSpace: "nowrap" }}
                    onDrop={handleDrop}
                    onDragOver={handleDropOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    color={isDragging ? "secondary" : "primary"}
                  >
                    Chọn file
                    <input
                      type="file"
                      hidden
                      onChange={(e) => setUploadFile(e.target.files[0])}
                    />
                  </Button>
                  {/* <Button variant="contained" onClick={upload}>
                  Upload
                </Button> */}
                  <Box sx={{ width: "100%" }}>
                    {uploadFile && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        File đã chọn: <strong>{uploadFile.name}</strong>
                      </Typography>
                    )}
                    {isUploading && (
                      <Box sx={{ width: "100%" }}>
                        <LinearProgress
                          variant="determinate"
                          value={uploadProgress}
                        ></LinearProgress>
                        <Typography variant="caption">
                          {" "}
                          {uploadProgress}%{" "}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
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
export default ForceDocummentDetail;
