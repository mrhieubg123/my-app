import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  Grid,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Có thể dùng cho nút đóng dialog
import LaptopMacIcon from "@mui/icons-material/LaptopMac"; // Ví dụ icon Foxconn
import { getAuthorizedAxiosIntance } from "../../../../utils/axiosConfig";
import { useSelector, useDispatch } from "react-redux";
const axiosInstance = await getAuthorizedAxiosIntance();

function ConfirmDataGelDialog({ open, onClose, initialData, onConfirmSucces }) {
  const user = useSelector((state) => state.auth.login.currentUser);
  const AVAILABLE_TYPES = ["Online", "Wait count", "Empty"];
  const [formData, setFormData] = useState({
    wo: initialData?.wo || "", // Dữ liệu mặc định hoặc từ props
    tr_sn: initialData?.tr_sn || "", // Dữ liệu mặc định hoặc từ props
    comment: "",
    type: "Online",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleConfirm = () => {
    console.log("Dữ liệu được xác nhận:", {
      wo: initialData.wo,
      tr_sn: initialData.tr_sn,
      comment: formData.comment,
    });
    confirmDataGelError({
      wo: initialData.wo,
      emp_confirm: "V1034779",
      emp_no: initialData.emp_no,
      end_time: initialData.end_time,
      status: initialData.status,
      kp_no: initialData.kp_no,
      model: initialData.model,
      station: initialData.station,
      slot_request: initialData.slot_request,
      return_qty: initialData.return_qty,
      tr_sn: initialData.tr_sn,
      slot_no: initialData.slot_no,
      type: formData.comment,
      comment: formData.comment,
    });
    // Thực hiện logic xác nhận dữ liệu ở đây (ví dụ: gửi lên API)
    onClose(); // Đóng dialog sau khi xác nhận
  };

  const confirmDataGelError = async (model) => {
    try {
      const response = await axiosInstance.post(
        "api/MaterialReturn/addMaterialReturnStatus",
        model
      );
    } catch (error) {
      console.log(error.message);
    } finally {
      onConfirmSucces();
    }
  };

  useEffect(() => {
    setFormData({
      wo: initialData?.wo || "", // Dữ liệu mặc định hoặc từ props
      tr_sn: initialData?.tr_sn || "", // Dữ liệu mặc định hoặc từ props
      comment: "",
      type: "Online",
    });
  }, [initialData]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-data-gel-dialog-title"
      PaperProps={{
        sx: {
          backgroundColor: "#424242", // Màu nền của dialog (xám đậm)
          color: "white", // Màu chữ chung trong dialog
          borderRadius: "8px",
          padding: "20px",
        },
      }}
      // Optional: Để dialog căn giữa màn hình và có khoảng cách xung quanh
      sx={{
        // zIndex: 100000,
        "& .MuiDialog-paper": {
          maxWidth: "500px", // Chiều rộng tối đa của dialog
          width: "100%",
        },
      }}
    >
      <DialogTitle id="confirm-data-gel-dialog-title" sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          {/* Bạn có thể thay thế bằng logo Foxconn thực tế */}
          <LaptopMacIcon sx={{ fontSize: 30, mr: 1, color: "#f0f0f0" }} />
          <Typography
            variant="h5"
            component="span"
            sx={{ color: "#f0f0f0", fontWeight: "bold" }}
          >
            Foxconn
          </Typography>
        </Box>
        {/* Nút đóng dialog (tùy chọn) */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {/* p:0 để loại bỏ padding mặc định của DialogContent */}
        <Typography
          variant="h6"
          sx={{ color: "white", mb: 2, borderBottom: "1px solid #666", pb: 1 }}
        >
          Confirm Material Return
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ color: "white", mb: 0.5 }}>
            WO
          </Typography>
          <TextField
            fullWidth
            name="wo"
            value={formData.wo}
            onChange={handleChange}
            variant="outlined"
            size="small"
            InputProps={{
              readOnly: true, // Nếu không cho phép chỉnh sửa
              sx: {
                backgroundColor: "#555", // Màu nền của input
                color: "white", // Màu chữ trong input
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#777", // Màu border
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#999",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#fff",
                },
              },
            }}
            InputLabelProps={{
              sx: { color: "#bbb" }, // Màu của label nếu có
            }}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ color: "white", mb: 0.5 }}>
            TR_SN
          </Typography>
          <TextField
            fullWidth
            name="tr_sn"
            value={formData.tr_sn}
            onChange={handleChange}
            variant="outlined"
            size="small"
            InputProps={{
              readOnly: true, // Nếu không cho phép chỉnh sửa
              sx: {
                backgroundColor: "#555", // Màu nền của input
                color: "white", // Màu chữ trong input
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#777", // Màu border
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#999",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#fff",
                },
              },
            }}
            InputLabelProps={{
              sx: { color: "#bbb" }, // Màu của label nếu có
            }}
          />
        </Box>
        <Grid item size={{ xs: 12, sm: 6 }} xs={12} sm={6}>
          <Typography variant="body1" sx={{ color: "white", mb: 0.5 }}>
            TYPE
          </Typography>
          <TextField
            select
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
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ color: "white", mb: 0.5 }}>
            Comment
          </Typography>
          <TextField
            fullWidth
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            variant="outlined"
            size="small"
            multiline // Cho phép nhập nhiều dòng
            rows={2} // Số dòng hiển thị mặc định
            InputProps={{
              sx: {
                backgroundColor: "#555",
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#777",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#999",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#fff",
                },
              },
            }}
            InputLabelProps={{
              sx: { color: "#bbb" },
            }}
          />
        </Box>
        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: "#4CAF50", // Màu xanh lá cây của nút CONFIRM
            "&:hover": {
              backgroundColor: "#45a049", // Màu xanh đậm hơn khi hover
            },
            color: "white",
            fontWeight: "bold",
            py: 1.5, // Padding dọc
            fontSize: "1.1rem",
            borderRadius: "4px",
          }}
          onClick={handleConfirm}
        >
          CONFIRM
        </Button>
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button
            onClick={onClose}
            sx={{
              color: "#ADD8E6", // Màu xanh nhạt cho "Back to List"
              textTransform: "none", // Bỏ viết hoa chữ cái đầu
              fontSize: "0.9rem",
              "&:hover": {
                textDecoration: "underline",
                backgroundColor: "transparent",
              },
            }}
          >
            Back to List
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDataGelDialog;
