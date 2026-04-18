import React, { useState, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Stack,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import {
  AddOutlined,
  LockOutlined,
  SyncLockOutlined,
} from "@mui/icons-material";
import { getAuthorizedAxiosIntance } from "../../../../utils/axiosConfig";
const axiosInstance = await getAuthorizedAxiosIntance();
//http://localhost:5000
const API = "/api/files";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ForceFileExplorer() {
  const theme = useTheme();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [files, setFiles] = useState([]);
  const [newFolder, setNewFolder] = useState("");
  const [newFolderPassword, setNewFolderPassword] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAction, setDeleteAction] = useState(() => {});
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteTarget, setDeleteTarget] = useState({ type: "", name: "" });
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordAction, setPasswordAction] = useState("");
  const [selectedFolderForPassword, setSelectedFolderForPassword] =
    useState("");
  const [folderPassword, setFolderPassword] = useState("");
  const [accessPassword, setAccessPassword] = useState("");
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);

  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);

  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const fetchFolders = async () => {
    try {
      const res = await axiosInstance.get(`${API}/folders`);
      setFolders(res.data);
    } catch (err) {
      showToast("Không thể tải danh sách folder", "error");
    }
  };

  const fetchFiles = async (folder, password = "", folderFile) => {
    if (folderFile && folderFile.hasPassword) {
      setAccessDialogOpen(true);
      setSelectedFolderForPassword(folder);
      return;
    }
    if (!folder) return;
    try {
      const res = await axiosInstance.get(`${API}/files`, {
        params: { folder, password },
      });
      setAccessDialogOpen(false);
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
        folder: newFolder,
        password: newFolderPassword,
      });
      showToast("✅ Đã tạo folder");
      setNewFolder("");
      setNewFolderPassword("");
      setNewFolderDialogOpen(false);
      fetchFolders();
    } catch (err) {
      showToast(err.response?.data?.message || "❌ Lỗi tạo folder", "error");
    }
  };

  const upload = async () => {
    if (!uploadFile || !selectedFolder) return;
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("folder", selectedFolder);
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

  const formatDate = (iso) => {
    return new Date(iso).toLocaleString();
  };

  const confirmDelete = (type, name, action) => {
    if (type === "folder") {
      const confirm = window.confirm(
        `Bạn có chắc muốn xóa Folder "${name}" không`
      );
      if (!confirm) return;
    }
    const folder = type === "folder" ? name : selectedFolder;
    const hasPassword = folders.find((f) => f.name === folder)?.hasPassword;
    setDeleteTarget({ type, name });
    setDeleteAction(() => action);
    if (hasPassword) {
      setDeleteDialogOpen(true);
    } else {
      action("");
    }
  };

  const handleDeleteFile = (filename) => {
    confirmDelete("file", filename, async (password) => {
      try {
        await axiosInstance.delete(
          `${API}/file/${selectedFolder}/${filename}`,
          {
            data: { password },
          }
        );
        showToast(`Đã xóa file "${filename}"`);
        fetchFiles(selectedFolder, accessPassword);
      } catch (err) {
        showToast(err.response?.data?.message || "❌ Lỗi xóa file", "error");
      }
    });
  };

  const handleDeleteFolder = (folder) => {
    confirmDelete("folder", folder, async (password) => {
      try {
        await axiosInstance.delete(`${API}/folder/${folder}`, {
          data: { password },
        });
        showToast(`Đã xóa folder "${folder}"`);
        if (selectedFolder === folder) {
          setSelectedFolder("");
          setFiles([]);
          setAccessPassword("");
        }
        fetchFolders();
      } catch (err) {
        showToast(err.response?.data?.message || "❌ Lỗi xóa folder", "error");
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
      `${baseURL}${API}/download/${selectedFolder}/${filename}?password=${encodeURIComponent(
        accessPassword
      )}`,
      "_blank"
    );
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAction(deletePassword);
      setDeleteDialogOpen(false);
      setDeletePassword("");
    } catch (err) {
      showToast(err.response?.data?.message || "❌ Lỗi xóa", "error");
    }
  };

  const handlePasswordAction = async () => {
    try {
      if (passwordAction === "set") {
        await axiosInstance.post(`${API}/folder/password`, {
          folder: selectedFolderForPassword,
          password: folderPassword,
        });
        setAccessPassword(folderPassword);
        showToast("✅ Đã cài đặt mật khẩu");
      } else if (passwordAction === "update") {
        await axiosInstance.put(`${API}/folder/password`, {
          folder: selectedFolderForPassword,
          oldPassword: accessPassword,
          newPassword: folderPassword,
        });
        showToast("✅ Đã cập nhật mật khẩu");
        setAccessPassword(folderPassword);
      } else if (passwordAction === "remove") {
        await axiosInstance.delete(
          `${API}/folder/password/${selectedFolderForPassword}`,
          {
            data: { password: accessPassword },
          }
        );
        showToast("✅ Đã xóa mật khẩu");
      }
      setPasswordDialogOpen(false);
      setFolderPassword("");
      fetchFolders();
    } catch (err) {
      showToast(
        err.response?.data?.message || "❌ Lỗi xử lý mật khẩu",
        "error"
      );
    }
  };

  const openPasswordDialog = (folder, action) => {
    setSelectedFolderForPassword(folder);
    setPasswordAction(action);
    setPasswordDialogOpen(true);
  };

  const handleAccessFolder = async () => {
    await fetchFiles(selectedFolderForPassword, accessPassword);
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    let aVal, bVal;

    if (sortBy === "name") {
      aVal = a.name.toLowerCase();
      bVal = b.name.toLowerCase();
    } else if (sortBy === "size") {
      aVal = a.size;
      bVal = b.size;
    } else if (sortBy === "date") {
      aVal = new Date(a.createAt);
      bVal = new Date(b.createAt);
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    fetchFolders();
  }, []);

  // useEffect(() => {
  //   if (selectedFolder) {
  //     fetchFiles(selectedFolder);
  //   }
  // }, [selectedFolder]);

  return (
    <Box p={3} sx={{ display: "flex", height: "90vh", gap: 2 }}>
      {/* Sidebar */}
      <Paper
        sx={{
          width: 300,
          p: 2,
          overflowY: "auto",
          height: "100%",
          background: theme.palette.background.component,
          boxShadow: 4,
          position: "relative",
          "&::-webkit-scrollbar": { width: 6, opacity: 0 },
          "&:hover::-webkit-scrollbar": { width: 6, opacity: 1 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#cdcdcd8c",
            borderRadius: "10px",
          },
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            background: theme.palette.background.component,
            zIndex: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">📁 Folders</Typography>
          <Button size="small" onClick={() => setNewFolderDialogOpen(true)}>
            <AddOutlined></AddOutlined>
          </Button>
        </Box>

        <List dense>
          {folders.map((folder) => (
            <ListItem
              key={folder.name}
              button
              selected={folder.name === selectedFolder}
              onClick={() => fetchFiles(folder.name, "", folder)}
              sx={{ height: "50px", borderBottom: "1px solid #999" }}
            >
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "calc(100% - 20px)", // tránh tràn vào icon
                      display: "block",
                    }}
                  >
                    {folder.name}
                  </Typography>
                }
                secondary={folder.hasPassword ? "🔒 Bảo mật" : ""}
              />
              <ListItemSecondaryAction>
                {folder.hasPassword ? (
                  <IconButton
                    onClick={() => openPasswordDialog(folder.name, "update")}
                  >
                    <SyncLockOutlined />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => openPasswordDialog(folder.name, "set")}
                  >
                    <LockOpenIcon color="primary" />
                  </IconButton>
                )}
                {folder.hasPassword ? (
                  <IconButton
                    onClick={() => openPasswordDialog(folder.name, "remove")}
                  >
                    <LockOutlined color="warning" />
                  </IconButton>
                ) : (
                  ""
                )}
                <IconButton
                  edge="end"
                  onClick={() => handleDeleteFolder(folder.name)}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* File section */}
      <Box
        flex={1}
        sx={{
          overflowY: "hidden",
          height: "100%",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "sticky",
            height: "150px",
            padding: "0px 10px",
            top: 0,
            background: theme.palette.primary.background,
            zIndex: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            📄 Files in:{" "}
            <strong> / {selectedFolder || "Chưa chọn folder"}</strong>
          </Typography>
          {selectedFolder && (
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mt: 1, height: "50px" }}
            >
              <Button
                variant={isDragging ? "outlined" : "contained"}
                component="label"
                startIcon={<UploadFileIcon />}
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
              <Button variant="contained" onClick={upload}>
                Upload
              </Button>
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
            </Stack>
          )}
          <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between" }}>
            <Box>
              <ToggleButtonGroup
                size="small"
                value={sortBy}
                exclusive
                onChange={(e, value) => {
                  if (value) setSortBy(value);
                }}
              >
                <ToggleButton value="name">Tên</ToggleButton>
                <ToggleButton value="size">Kích thước</ToggleButton>
                <ToggleButton value="date">Ngày</ToggleButton>
              </ToggleButtonGroup>
              <ToggleButtonGroup
                size="small"
                value={sortOrder}
                exclusive
                onChange={(e, value) => {
                  if (value) setSortOrder(value);
                }}
                sx={{ ml: 2 }}
              >
                <ToggleButton value="asc">🔼 Tăng</ToggleButton>
                <ToggleButton value="desc">🔽 Giảm</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <TextField
              label="🍳 Tìm File"
              variant="outlined"
              size="small"
              sx={{ ml: 2 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            overflowY: "auto",
            height: "calc(100% - 150px)",
            position: "relative",
            "&::-webkit-scrollbar": { width: 6, opacity: 0 },
            "&:hover::-webkit-scrollbar": { width: 6, opacity: 1 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#cdcdcd8c",
              borderRadius: "10px",
            },
          }}
        >
          <List dense>
            {sortedFiles.map((file) => (
              <ListItem key={file.name} divider>
                <ListItemText
                  primary={file.name}
                  secondary={`${formatBytes(file.size)} | ${formatDate(
                    file.createAt
                  )}`}
                />
                <IconButton onClick={() => handleDownload(file.name)}>
                  <DownloadIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteFile(file.name)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Xác nhận xóa {deleteTarget.type === "folder" ? "folder" : "file"} "
          {deleteTarget.name}"
        </DialogTitle>
        <DialogContent sx={{ paddingTop: "8px !important" }}>
          <TextField
            label="Mật khẩu"
            type="password"
            fullWidth
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleConfirmDelete}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password management dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
      >
        <DialogTitle>
          {passwordAction === "set"
            ? "Cài đặt mật khẩu"
            : passwordAction === "update"
            ? "Cập nhật mật khẩu"
            : "Xóa mật khẩu"}
        </DialogTitle>
        <DialogContent sx={{ paddingTop: "8px !important" }}>
          {passwordAction !== "remove" && (
            <TextField
              label="Mật khẩu mới"
              type="password"
              fullWidth
              value={folderPassword}
              onChange={(e) => setFolderPassword(e.target.value)}
              autoFocus
              sx={{ mb: 2 }}
            />
          )}
          {passwordAction === "update" && (
            <TextField
              label="Mật khẩu cũ"
              type="password"
              fullWidth
              value={accessPassword}
              onChange={(e) => setAccessPassword(e.target.value)}
            />
          )}
          {passwordAction === "remove" && (
            <TextField
              label="Mật khẩu hiện tại"
              type="password"
              fullWidth
              value={accessPassword}
              onChange={(e) => setAccessPassword(e.target.value)}
              autoFocus
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handlePasswordAction}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Folder access dialog */}
      <Dialog
        open={accessDialogOpen}
        onClose={() => setAccessDialogOpen(false)}
      >
        <DialogTitle>
          Nhập mật khẩu cho folder "{selectedFolderForPassword}"
        </DialogTitle>
        <DialogContent sx={{ paddingTop: "8px !important" }}>
          <TextField
            label="Mật khẩu"
            type="password"
            fullWidth
            value={accessPassword}
            onChange={(e) => setAccessPassword(e.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAccessDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleAccessFolder}>
            Xác nhận
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
        <DialogContent sx={{ paddingTop: "8px !important" }}>
          <TextField
            label="Mật khẩu (tùy chọn)"
            type="password"
            fullWidth
            value={newFolderPassword}
            onChange={(e) => setNewFolderPassword(e.target.value)}
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
    </Box>
  );
}
