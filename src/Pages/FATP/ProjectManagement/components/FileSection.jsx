import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Snackbar,
  Tooltip,
  Grid,
  MenuItem,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import {
  ArrowBackIos,
  Download,
  Delete,
  FilePresentRounded,
  FolderSpecialRounded,
  AddRounded,
  Refresh,
  FileDownloadOutlined,
  CreateNewFolderRounded,
  EditRounded,
} from "@mui/icons-material";
import { getAuthorizedAxiosIntance } from "../../../../utils/axiosConfig";

const axiosInstance = await getAuthorizedAxiosIntance();
//http://localhost:5000
const API = "/api/files";
const API_Project = "/api/projectManagement";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const FileSection = ({ headerParts, subHeaderParts }) => {
  const theme = useTheme();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [selectedFolder, setSelectedFolder] = useState("");
  const [files, setFiles] = useState([]);
  const [newFolder, setNewFolder] = useState("");
  const [newFolderPassword, setNewFolderPassword] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [selectedFolderForPassword, setSelectedFolderForPassword] =
    useState("");
  const [accessPassword, setAccessPassword] = useState("");
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);

  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [newFolderDialogOpen6, setNewFolderDialogOpen6] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    ccEmail: "",
    project: [],
  });
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedIds, setSelectedIds] = React.useState({
    type: "include",
    ids: new Set([]),
  });

  const dataListProject = ["RFQ", "NPI Projects", "MP Projects", "EOL"];

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  //   const fetchFolders = async () => {
  //     try {
  //       const res = await axiosInstance.get(`${API}/folders`);
  //       setFolders(res.data);
  //     } catch (err) {
  //       showToast("Không thể tải danh sách folder", "error");
  //     }
  //   };

  const fetchFiles = async (folder, password = "", folderFile) => {
    try {
      const res = await axiosInstance.get(`${API}/files`, {
        params: { folder: `${headerParts}${folder}`, password },
      });
      setAccessDialogOpen(false);
      setSelectedIds({ type: "include", ids: new Set([]) });
      setFiles(res.data);
      setSelectedFolder(folder);
      setAccessPassword(password); // Store the correct password
      // Close dialog on success
    } catch (err) {
      if (err.response?.status === 403) {
        setAccessDialogOpen(true);
        setSelectedFolderForPassword(folder);
        // showToast('Mật khẩu folder không đúng', 'error'); // Show error toast
        // throw new Error('Wrong password')
      } else {
        showToast("Không thể tải danh sách file", "error");
      }
    }
  };

  const createFolder = async () => {
    if (!newFolder) return;
    try {
      await axiosInstance.post(`${API}/folder`, {
        folder: `${headerParts + selectedFolder}/${newFolder}`,
        password: newFolderPassword,
      });
      showToast("✅ Đã tạo folder");
      setNewFolder("");
      setNewFolderPassword("");
      setNewFolderDialogOpen(false);
      if (selectedFolder.replace("/", "").split("/").length === 1)
        await addNewProject(newFolder);
      //   fetchFolders();
      await fetchFiles(selectedFolder, accessPassword);
    } catch (err) {
      showToast(err.response?.data?.message || "❌ Lỗi tạo folder", "error");
    }
  };

  const upload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !selectedFolder) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", headerParts + selectedFolder);
    formData.append("password", accessPassword);
    try {
      setIsUploading(true);
      setUploadProgress(0);

      await axiosInstance.post(`${API}/upload`, formData, {
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(percent);
        },
      });
      showToast("✅ Upload thành công");
      setUploadFile(null);
      fetchFiles(selectedFolder, accessPassword);
    } catch (err) {
      showToast(err.response?.data?.message || "❌ Upload thất bại", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const confirmDelete = (type, name, action) => {
    const confirm = window.confirm(
      `Bạn có chắc muốn xóa Folder "${name}" không`
    );
    if (!confirm) return;
    action("");
  };

  const handleDeleteFile = (filename) => {
    confirmDelete("file", filename, async (password) => {
      try {
        await axiosInstance.delete(`${API}/file/delete`, {
          data: {
            password,
            folder: `${headerParts + selectedFolder}`,
            filename,
          },
        });
        showToast(`Đã xóa file "${filename}"`);
        fetchFiles(selectedFolder, accessPassword);
      } catch (err) {
        showToast(err.response?.data?.message || "❌ Lỗi xóa file", "error");
      }
    });
  };

  const handleDownload = async (filename) => {
    const res = await fetch("/config.json");
    const configJson = await res.json();
    const baseURL = window.location.hostname.startsWith("10.228.121.39")
      ? configJson.apiBaseUrl121
      : configJson.apiBaseUrl;
    window.open(
      `${baseURL}${API}/download/${
        headerParts + selectedFolder
      }/${filename}?password=${encodeURIComponent(accessPassword)}`,
      "_blank"
    );
  };

  const backFolder = async () => {
    const normalized = (selectedFolder || "")
      .replace(/\\/g, "/") // hỗ trợ cả \ của Windows
      .replace(/\/+/g, "/") // gộp nhiều dấu /
      .replace(/\/$/, ""); // bỏ / cuối nếu có

    if (!normalized) return; // đang rỗng thì thôi

    const parts = normalized.split("/").filter(Boolean);
    if (parts.length <= 1) {
      setSelectedFolder(""); // về root
      setFiles([]);
      return;
    }

    parts.pop(); // bỏ folder cuối
    await fetchFiles(parts.join("/"), accessPassword);

    // setSelectedFolder(parts.join("/"));
  };

  const goToFolder = async (folder) => {
    // const parts = selectedFolder + `/${folder}`;
    await fetchFiles(folder, accessPassword);
  };

  const addNewProject = async (project) => {
    //add item
    try {
      const dataToSend = {
        project: project,
      };

      const reponse = await axiosInstance.post(
        `${API_Project}/addNewProject`,
        dataToSend
      );
      if (reponse.data.success) {
        showToast(reponse.data.message);
      } else {
        showToast("Thêm project vào database thất bại", "error");
      }
    } catch (error) {
      console.error("Lỗi khi lưu project vào database:", error);
      showToast("Lỗi khi kết nối server", "error");
    }
  };

  useEffect(() => {
    console.log("headerParts", headerParts);
    if (subHeaderParts) fetchFiles(subHeaderParts);
  }, [subHeaderParts]);

  const columns = [
    {
      field: "id",
      headerName: "No.",
      flex: 0.4,
      minWidth: 30,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "Description",
      flex: 1, // tự chia chiều rộng
      headerAlign: "center",
      align: "center",
      minWidth: 100,
    },
    {
      field: "isFolder",
      headerName: "Attachment",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value ? (
            <FolderSpecialRounded sx={{ fontSize: 24, display: "block" }} />
          ) : (
            <FilePresentRounded sx={{ fontSize: 24, display: "block" }} />
          )}
        </Box>
      ),
    },
    {
      field: "size",
      headerName: "Size",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {params.row.isFolder ? "" : formatBytes(params.value) || ""}
        </div>
      ),
    },
    {
      field: "createAt",
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              gap: 0.5,
            }}
          >
            {row.isFolder === false && (
              <Button
                title="Download"
                onClick={() => handleDownload(row.name)}
                sx={{ minWidth: "unset", backgroundColor: "#9994" }}
                size="small"
              >
                <Download sx={{ fontSize: "1rem" }}></Download>
              </Button>
            )}
            {selectedFolder.split("/").length === 1 && (
              <Button
                title="Edit"
                onClick={() => openDialogEditEmailConfig(row)}
                sx={{ minWidth: "unset", backgroundColor: "#9994" }}
                size="small"
              >
                <EditRounded sx={{ fontSize: "1rem" }}></EditRounded>
              </Button>
            )}
            <Button
              title="Delete"
              onClick={() => handleDeleteFile(row.name)}
              color="error"
              sx={{ minWidth: "unset", backgroundColor: "#9994" }}
              size="small"
            >
              <Delete sx={{ fontSize: "1rem" }}></Delete>
            </Button>
          </Box>
        );
      },
    },
  ];

  const rowsWithId = React.useMemo(() => {
    return files.map((row, index) => ({
      id: index, // hoặc row.LINE nếu unique
      ...row,
    }));
  }, [files]);

  const fileInputRef = React.useRef(null);
  const openFilePicker = () => {
    if (isDragging) return;
    fileInputRef.current?.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = () => {
    // Thêm logic kiểm tra dữ liệu hợp lệ tại đây (ví dụ: line và type không được trống)
    if (!formData.name) {
      alert("Vui lòng điền Name");
      return;
    }
    handleEdit();
  };

  const handleEdit = async () => {
    //add item
    try {
      const reponse = await axiosInstance.post(
        `${API_Project}/editProject`,
        formData
      );
      if (reponse.data.success) {
        showToast(reponse.data.message);
        fetchFiles(selectedFolder, "");
        setNewFolderDialogOpen6(false);
      } else {
        showToast("Edit fail", "error");
      }
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      showToast("Lỗi khi kết nối server", "error");
    }
  };

  const openDialogEditEmailConfig = (item) => {
    const status = selectedFolder;
    setFormData({
      oldName: item.name,
      name: item.name,
      status: status.replace("/", ""),
      oldStatus: status.replace("/", ""),
      headerParts: headerParts,
    });
    setNewFolderDialogOpen6(true);
  };

  return (
    <>
      {/* File section */}
      <Box
        flex={1}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "sticky",
            // height: "150px",
            padding: "0px 10px",
            top: 0,
            background: theme.palette.primary.background,
            zIndex: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {selectedFolder && (
              <IconButton
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  width: 32,
                  height: 32,
                  // backgroundColor: "primary.main",
                  "&:hover": {
                    borderColor: "text.primary",
                    backgroundColor: "action.hover",
                  },
                }}
                onClick={() => backFolder()}
              >
                <ArrowBackIos size="small" />
              </IconButton>
            )}
            📄 Files in:{" "}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {(() => {
                const pathStr = selectedFolder || "";
                if (!pathStr) return <strong>Chưa chọn folder</strong>;

                const parts = pathStr.split("/").filter(Boolean);

                return parts.map((p, i) => {
                  const newPath = parts.slice(0, i + 1).join("/");
                  return (
                    <React.Fragment key={newPath}>
                      {i > 0 && <Box sx={{ mx: 0.5 }}>{">"}</Box>}
                      <Box
                        component="span"
                        onClick={() => goToFolder(newPath)}
                        sx={{
                          cursor: "pointer",
                          fontWeight: 700,
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {p}
                      </Box>
                    </React.Fragment>
                  );
                });
              })()}
            </Box>
          </Typography>
          {selectedFolder && (
            <Box
              sx={{
                px: 1.5,
                py: 1,
                // bgcolor: "#1c1e20",
                // borderBottom: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <ToolbarBtn
                  icon={<CreateNewFolderRounded />}
                  label="Add Folder"
                  onClick={() => setNewFolderDialogOpen(true)}
                />
                <ToolbarBtn
                  icon={<AddRounded />}
                  label={
                    isUploading ? `Uploading... ${uploadProgress}%` : "Add File"
                  }
                  onClick={openFilePicker}
                />
                <ToolbarBtn
                  icon={<Delete />}
                  label="Delete"
                  onClick={() => {
                    const idsArray =
                      selectedIds?.type === "include"
                        ? Array.from(selectedIds.ids)
                        : [];
                    for (const id of idsArray) {
                      const row = rowsWithId[id]; // id đang là index
                      if (row) handleDeleteFile(row.name);
                    }
                  }}
                  // disabled={selected.size === 0}
                />
                <ToolbarBtn
                  icon={<Refresh />}
                  label="Refresh"
                  onClick={() => fetchFiles(selectedFolder, "")}
                />
                <ToolbarBtn
                  icon={<FileDownloadOutlined />}
                  label="Export"
                  onClick={() => {
                    const idsArray =
                      selectedIds?.type === "include"
                        ? Array.from(selectedIds.ids)
                        : [];
                    for (const id of idsArray) {
                      const row = rowsWithId[id]; // id đang là index
                      if (row) handleDownload(row.name);
                    }
                  }}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  onChange={upload}
                  // accept=".pdf,.xlsx,.docx,image/*" // nếu muốn giới hạn loại file
                />
              </Stack>
            </Box>
          )}
        </Box>
        {
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <DataGrid
              rows={rowsWithId || []}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10]}
              checkboxSelection
              disableRowSelectionOnClick
              sx={{
                height: "100%",
                backgroundColor: "transparent",
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "transparent !important",
                },
                "& .MuiDataGrid-cell": {
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  alignItems: "center", // ensure top alignment when multi-line
                },
              }}
              onCellClick={(params) => {
                if (params.field !== "name") return;
                if (params.row.isFolder) {
                  goToFolder(`${selectedFolder}/${params.row.name}`); // bạn tự implement
                }
              }}
              rowSelectionModel={selectedIds}
              onRowSelectionModelChange={(newSelection) => {
                setSelectedIds(newSelection);
              }}
            />
          </Box>
        }
      </Box>

      <Dialog
        open={newFolderDialogOpen6}
        onClose={() => setNewFolderDialogOpen6(false)}
      >
        <DialogTitle>{formData.id ? "Edit" : "Add new"} Email</DialogTitle>
        <DialogContent sx={{ paddingTop: "8px !important", minWidth: "350px" }}>
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12 }} xs={12}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 12 }} xs={12} sm={12}>
              <TextField
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                fullWidth
                required
              >
                {dataListProject.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
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
            Edit project
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={newFolderDialogOpen}
        onClose={() => setNewFolderDialogOpen(false)}
      >
        <DialogTitle>Tạo một Folder mới</DialogTitle>
        <DialogContent sx={{ paddingTop: "8px !important" }}>
          <TextField
            label="Tên folder mới"
            fullWidth
            value={newFolder}
            onChange={(e) => setNewFolder(e.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewFolderDialogOpen(false)}>Hủy</Button>
          <Button fullWidth variant="contained" onClick={createFolder}>
            Tạo folder
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default FileSection;

function ToolbarBtn({ icon, label, onClick, disabled, input }) {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Tooltip title={label}>
        <span>
          <IconButton
            size="small"
            disabled={disabled}
            onClick={onClick}
            sx={{
              color: "#e8e8e8",
              borderRadius: 1,
              "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
              "&.Mui-disabled": { color: "rgba(255,255,255,0.25)" },
            }}
          >
            {icon}
            {`  ${label}`}
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
