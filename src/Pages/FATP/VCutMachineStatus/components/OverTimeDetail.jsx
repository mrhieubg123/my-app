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

const OverTimeDetail = ({ idata = [] }) => {
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
      field: "FACTORY",
      headerName: "Factory",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
    },{
      field: "LINE",
      headerName: "Line",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
    },
    {
      field: "NAME_MACHINE",
      headerName: "Machine",
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
      field: "COMMENT",
      headerName: "Comment",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      editable: true,
    },
    {
      field: "EMP_ID",
      headerName: "Emp",
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
      const response = await axiosInstance.post(
        "api/vcut/getKnifeVcutMachineHistory",
        {
          factory: idata.FACTORY,
          line: idata.LINE,
          location: idata.LOCATION,
        }
      );
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
      factory: idata.FACTORY,
      line: idata.LINE,
      name: idata.NAME_MACHINE,
      location: idata.LOCATION,
      startTime: dayjs(), // Mặc định là thời gian hiện tại
      comment: "",
      idConfirm: "",
    });
    setNewFolderDialogOpen6(true);
  };

  const openDialogEdit = (row) => {
    setFormData({
      id: row.ID,
      factory: row.FACTORY,
      line: row.LINE,
      name: row.NAME_MACHINE,
      location: row.LOCATION,
      startTime: dayjs(row.START_TIME),
      comment: row.COMMENT || "",
      idConfirm: row.EMP_ID || "",
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
    if (!formData.line || !formData.factory) {
      alert("Vui lòng chọn Line và factory.");
      return;
    }

    if (formData.id) handleEdit(formData);
    else handleSave(formData);
  };

  const handleSave = async (formData) => {
    //add item
    try {
      const dataToSend = {
        ...formData,
        startTime: formData.startTime.toDate(),
      };

      const reponse = await axiosInstance.post(
        "api/vcut/changeKnifeVcutmachine",
        dataToSend
      );
      if (reponse.data.success) {
        alert(reponse.data.message);
        fetchDataOverTime();
        setNewFolderDialogOpen6(false);
      } else {
        alert("Thêm item thất bại", "error");
      }
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert("Lỗi khi kết nối server", "error");
    }
  };

  const handleEdit = async (formData) => {
    //add item
    try {
      const dataToSend = {
        ...formData,
        startTime: formData.startTime.toDate(),
      };

      const reponse = await axiosInstance.post(
        "api/vcut/editChangeKnifeVcutmachine",
        dataToSend
      );
      if (reponse.data.success) {
        alert(reponse.data.message);
        fetchDataOverTime();
        setNewFolderDialogOpen6(false);
      } else {
        alert("Edit fail", "error");
      }
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert("Lỗi khi kết nối server", "error");
    }
  };

  const handleDelete = async (row) => {
    //add item
    try {
      const reponse = await axiosInstance.post(
        "api/vcut/deleteChangeKnifeVcutmachine",
        {
          id: row.ID,
        }
      );
      if (reponse.data.success) {
        alert(reponse.data.message);
        fetchDataOverTime();
      } else {
        alert("Delete fail", "error");
      }
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert("Lỗi khi kết nối server", "error");
    }
  };

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
              <Grid item size={{ xs: 12, sm: 6 }} xs={12} sm={6}>
                <TextField
                  label="Factory"
                  name="factory"
                  value={formData.factory}
                  fullWidth
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                ></TextField>
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }} xs={12} sm={6}>
                <TextField
                  label="Line"
                  name="line"
                  value={formData.line}
                  fullWidth
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                ></TextField>
              </Grid>

              <Grid item size={{ xs: 12, sm: 6 }} xs={12} sm={6}>
                <TextField
                  label="Machine name"
                  name="name"
                  value={formData.name}
                  fullWidth
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                >
                </TextField>
              </Grid>

              {/* 3. Start Time (Chọn Ngày Giờ) */}
              <Grid item size={{ xs: 12, sm: 6 }} xs={12} sm={6}>
                <DateTimePicker
                  label="Change Time"
                  value={formData.startTime}
                  onChange={(newDate) => handleDateChange("startTime", newDate)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>

              {/* 4. ID Confirm (Người xác nhận) */}
              <Grid item size={{ xs: 12, sm: 12 }} xs={12}>
                <TextField
                  label="ID Confirm"
                  name="idConfirm"
                  value={formData.idConfirm}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              {/* 5. Comment (Ghi chú) */}
              <Grid item size={{ xs: 12 }} xs={12}>
                <TextField
                  label="Comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  multiline
                  rows={2}
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
    </Box>
  );
};
export default OverTimeDetail;
