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
  Chip,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import {
  Delete,
  AddRounded,
  Refresh,
  FileDownloadOutlined,
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

const fetchData = [
  {
    name: "Manh",
    email: "jerry.m.shen@mail.foxconn.com",
    ccEmail: "shan-you.liang@mail.foxconn.com",
    project: "CWA438TCOM",
  },
  {
    name: "Diu",
    email: "cpe-vn-ape@mail.foxconn.com",
    ccEmail: "shan-you.liang@mail.foxconn.com",
    project: "CWA438TCOM, CGM601TCOM, F4704D52700-VME",
  },
];

const EmailConfig = ({ headerParts, subHeaderParts }) => {
  const theme = useTheme();

  const [selectedFolder, setSelectedFolder] = useState("");
  const [files, setFiles] = useState(fetchData);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAction, setDeleteAction] = useState(() => {});
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteTarget, setDeleteTarget] = useState({ type: "", name: "" });
  const [selectedFolderForPassword, setSelectedFolderForPassword] =
    useState("");
  const [accessPassword, setAccessPassword] = useState("");
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedIds, setSelectedIds] = React.useState({
    type: "include",
    ids: new Set([]),
  });
  const AVAILABLE_TYPES = ["CWA438TCOM", "CWA438TCOM", "CGM601TCOM"];
  const [dataListProject, setDataListProject] = useState([]);
  const [newFolderDialogOpen6, setNewFolderDialogOpen6] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    ccEmail: "",
    project: [],
  });

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const fetchListEmailConfig = async () => {
    try {
      const res = await axiosInstance.get(`${API_Project}/getEmailConfig`);
      setFiles(res.data || []);
    } catch (err) {
      // showToast("Không thể tải danh sách file", "error");
    }
  };

  const fetchListProject = async () => {
    try {
      const res = await axiosInstance.get(
        `${API_Project}/getListProjectManagement`
      );
      setDataListProject(res.data || []);
    } catch (err) {
      // showToast("Không thể tải danh sách file", "error");
    }
  };

  const confirmDelete = (user, action) => {
    const confirm = window.confirm(
      `Bạn có chắc muốn xóa User "${user.NAME}" không`
    );
    if (!confirm) return;
    action("");
  };

  const handleDeleteFile = (user) => {
    confirmDelete(user, async () => {
      try {
        await axiosInstance.post(`${API_Project}/deleteEmailConfig`, {
          id: user.ID,
        });
        showToast(`Đã xóa User "${user.NAME}"`);
        fetchListEmailConfig();
      } catch (err) {
        showToast(err.response?.data?.message || "❌ Lỗi xóa User", "error");
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = () => {
    // Thêm logic kiểm tra dữ liệu hợp lệ tại đây (ví dụ: line và type không được trống)
    if (!formData.name || !formData.email) {
      alert("Vui lòng điền Name và Email.");
      return;
    }

    if (formData.id) handleEdit();
    else handleSave();
  };

  const handleSave = async () => {
    //add item
    try {
      const dataToSend = {
        ...formData,
        projectString: formData.project.join(","),
      };

      const reponse = await axiosInstance.post(
        `${API_Project}/addNewEmailConfig`,
        dataToSend
      );
      if (reponse.data.success) {
        showToast(reponse.data.message);
        fetchListEmailConfig();
        setNewFolderDialogOpen6(false);
      } else {
        showToast("Thêm Email thất bại", "error");
      }
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      showToast("Lỗi khi kết nối server", "error");
    }
  };

  const handleEdit = async () => {
    //add item
    try {
      const dataToSend = {
        ...formData,
        projectString: formData.project.join(","),
      };
      const reponse = await axiosInstance.post(
        `${API_Project}/editEmailConfig`,
        dataToSend
      );
      if (reponse.data.success) {
        showToast(reponse.data.message);
        fetchListEmailConfig();
        setNewFolderDialogOpen6(false);
      } else {
        showToast("Edit fail", "error");
      }
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      showToast("Lỗi khi kết nối server", "error");
    }
  };

  const openDialogAddNewEmailConfig = () => {
    setFormData({
      id: "",
      name: "",
      email: "",
      ccEmail: "",
      project: [],
    });
    setNewFolderDialogOpen6(true);
  };

  const openDialogEditEmailConfig = (item) => {
    setFormData({
      id: item.ID,
      name: item.NAME,
      email: item.EMAIL,
      ccEmail: item.CCEMAIL,
      project: item.PROJECT ? item.PROJECT.split(",") : [],
    });
    console.log("formData", {
      id: item.ID,
      name: item.NAME,
      email: item.EMAIL,
      ccEmail: item.CCEMAIL,
      project: item.PROJECT ? item.PROJECT.split(",") : [],
    });
    setNewFolderDialogOpen6(true);
  };

  useEffect(() => {
    fetchListProject();
    fetchListEmailConfig();
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "No.",
      flex: 0.3,
      minWidth: 30,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return <>{params.value + 1}</>;
      },
    },
    {
      field: "NAME",
      headerName: "Name",
      flex: 0.5, // tự chia chiều rộng
      headerAlign: "center",
      align: "center",
      minWidth: 100,
    },
    {
      field: "EMAIL",
      headerName: "Email",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "CCEMAIL",
      headerName: "CC Email",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "PROJECT",
      headerName: "Project",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      headerAlign: "center",
      align: "center",
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
            <Button
              title="Edit"
              onClick={() => openDialogEditEmailConfig(row)}
              color="primary"
              sx={{ minWidth: "unset", backgroundColor: "#9994" }}
              size="small"
            >
              <EditRounded sx={{ fontSize: "1rem" }}></EditRounded>
            </Button>
            <Button
              title="Delete"
              onClick={() => handleDeleteFile(row)}
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
        <Dialog
          open={newFolderDialogOpen6}
          onClose={() => setNewFolderDialogOpen6(false)}
        >
          <DialogTitle>{formData.id ? "Edit" : "Add new"} Email</DialogTitle>
          <DialogContent
            sx={{ paddingTop: "8px !important", minWidth: "350px" }}
          >
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
              <Grid item size={{ xs: 12 }} xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item size={{ xs: 12 }} xs={12}>
                <TextField
                  label="CC Email"
                  name="ccEmail"
                  value={formData.ccEmail}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  fullWidth
                  required
                  slotProps={{
                    select: {
                      multiple: true,
                      displayEmpty: true,
                      renderValue: () => (
                        <span style={{ color: "#9e9e9e" }}>Select Project</span>
                      ),
                    },
                  }}
                >
                  {dataListProject.map((option) => (
                    <MenuItem key={option} value={option.PROJECT}>
                      {option.PROJECT}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {formData.project.map((item) => (
                    <Chip
                      key={item}
                      label={item}
                      onDelete={() =>
                        setFormData((prev) => ({
                          ...prev,
                          project: prev.project.filter((p) => p !== item),
                        }))
                      }
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
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
              {formData.id ? "Edit Email" : "Add Email"}
            </Button>
          </DialogActions>
        </Dialog>
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
            📄 Email Config
          </Typography>
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
                icon={<AddRounded />}
                label="Add New"
                onClick={openDialogAddNewEmailConfig}
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
                    if (row) handleDeleteFile(row);
                  }
                }}
                // disabled={selected.size === 0}
              />
              <ToolbarBtn
                icon={<Refresh />}
                label="Refresh"
                onClick={() => fetchListEmailConfig()}
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
                    // if (row) handleDownload(row.name);
                  }
                }}
              />
            </Stack>
          </Box>
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
              onRowClick={(params) => {}}
              rowSelectionModel={selectedIds}
              onRowSelectionModelChange={(newSelection) => {
                setSelectedIds(newSelection);
              }}
            />
          </Box>
        }
      </Box>

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

export default React.memo(EmailConfig);

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
