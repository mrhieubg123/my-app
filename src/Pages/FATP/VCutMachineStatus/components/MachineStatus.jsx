import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  MenuItem,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import { Warning, Error, CheckCircle, Close } from "@mui/icons-material";
import dayjs from "dayjs";
import img1 from "./images/img1.png";
import ExpandFabComponent from "./expandFabComponent";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { getAuthorizedAxiosIntance } from "../../../../utils/axiosConfig";
import HiModal from "../../../../components/HiModal";
import OverTimeDetail from "./OverTimeDetail";

const axiosInstance = await getAuthorizedAxiosIntance();
// --- HẰNG SỐ VÀ DỮ LIỆU GIẢ LẬP ---
const CRITICAL_THRESHOLD = 500000;
const WARNING_THRESHOLD = 450000;

const MOCK_MACHINES = [
  { id: 1, name: "V-Cut 01", cuts: 125450, status: "NORMAL" },
  { id: 2, name: "V-Cut 02", cuts: 485210, status: "WARNING" },
  { id: 3, name: "V-Cut 03", cuts: 500001, status: "CRITICAL" }, // Đã tới hạn
  { id: 4, name: "V-Cut 04", cuts: 115450, status: "NORMAL" },
  { id: 5, name: "V-Cut 05", cuts: 478990, status: "WARNING" },
  { id: 6, name: "V-Cut 06", cuts: 0, status: "NORMAL" }, // Lỗi/Dừng
  { id: 7, name: "V-Cut 07", cuts: 390000, status: "NORMAL" },
  { id: 8, name: "V-Cut 08", cuts: 500210, status: "CRITICAL" }, // Đã tới hạn
  { id: 9, name: "V-Cut 09", cuts: 125450, status: "NORMAL" },
  { id: 10, name: "V-Cut 10", cuts: 310900, status: "NORMAL" },
  { id: 11, name: "V-Cut 11", cuts: 495000, status: "WARNING" },
  { id: 12, name: "V-Cut 12", cuts: 125870, status: "NORMAL" },
  { id: 13, name: "V-Cut 13", cuts: 25870, status: "NORMAL" },
  { id: 14, name: "V-Cut 14", cuts: 0, status: "NORMAL" }, // Lỗi/Dừng
  { id: 15, name: "V-Cut 15", cuts: 500000, status: "CRITICAL" },
  { id: 16, name: "V-Cut 16", cuts: 125450, status: "NORMAL" },
];
const WaterFill = ({
  value = 50,
  color = "#e9c4e3",
  bgColor = "transparent",
  textColor = "#fff",
  width = "100%",
  height = "100%",
  radius = 12,
  duration1 = 4, // tốc độ sóng 1
  duration2 = 6, // tốc độ sóng 2 (lệch pha)
  showCenterText = false,
  label,
}) => {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  const levelY = 100 - pct; // (viewBox 100)

  return (
    <Box sx={{ position: "absolute", inset: 0, width, height }}>
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <defs>
          <clipPath id="wf-clip">
            <rect
              x="0"
              y="0"
              width="100"
              height="100"
              rx={(radius / 200) * 100 * 2}
            />
          </clipPath>
          <path
            id="wf-wave"
            d="
            M 0 30
            Q 12.5 26 25 30
            T 50 30
            T 75 30
            T 100 30
            T 125 30
            T 150 30
            T 175 30
            T 200 30
            V 100 H 0 Z
          "
          />
        </defs>

        <g clipPath="url(#wf-clip)">
          {/* nền phía trên (không nước) */}
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill={color}
            opacity="0.35"
          />

          {/* nền đặc phần nước dưới mực */}
          <rect
            x="0"
            y={levelY}
            width="100"
            height={100 - 0}
            fill={color}
            opacity="0.5"
          />
        </g>
      </svg>
    </Box>
  );
};

// --- COMPONENT CHÍNH (GRID 16 MÁY) ---

const MachineStatusHighchartsGrid = ({ idata = [], onCallBack }) => {
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
  const [showModal, setShowModal] = useState(false);
  const [machine, setMachine] = useState(null);
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

    handleSave(formData);
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
        onCallBack();
        alert(reponse.data.message);
        // fetchDataOverTime();
        setNewFolderDialogOpen6(false);
      } else {
        alert("Thêm item thất bại", reponse.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert("Lỗi khi kết nối server", error);
    }
  };

  const openDialogAdd = (machine) => {
    setFormData({
      id: "",
      factory: machine.FACTORY,
      line: machine.LINE,
      name: machine.NAME_MACHINE,
      location: machine.LOCATION,
      startTime: dayjs(), // Mặc định là thời gian hiện tại
      comment: "",
      idConfirm: "",
    });
    setNewFolderDialogOpen6(true);
  };

  const MachineStatusCard2 = ({ machine }) => {
    const { NAME_MACHINE, TOTAL , LINE, LOCATION } = machine;

    let bgColor = "#f7f7f7";
    let titleColor = "text.primary";
    let icon = <CheckCircle sx={{ fontSize: 18 }} />;
    let message = "Hoạt động bình thường";
    let status = "NORMAL";

    if (TOTAL >= CRITICAL_THRESHOLD) {
      bgColor = "#ff5370"; // Đỏ nhạt
      titleColor = "error.dark";
      icon = <Error sx={{ fontSize: 18 }} />;
      message = "CẦN THAY DAO NGAY!";
      status = "CRITICAL";
    } else if (TOTAL >= WARNING_THRESHOLD) {
      bgColor = "#f1c40f"; // Cam nhạt
      titleColor = "warning.dark";
      icon = <Warning sx={{ fontSize: 18 }} />;
      message = "Sắp tới hạn thay dao";
      status = "WARNING";
    } else {
      bgColor = "#07bc0c"; // Xám
      titleColor = "rgb(38, 196, 51)";
      icon = <Close sx={{ fontSize: 18 }} />;
      message = "Active";
      status = "NORMAL";
    }
    return (
      <Card
        elevation={6}
        sx={{
          width: 180,
          height: 180,
          borderRadius: 2,
          position: "relative",
          bgcolor: "rgba(255,255,255,0.04)",
          overflow: "hidden",
        }}
      >
        <ExpandFabComponent onClick={() => openDialogAdd(machine)} />
        <CardContent
        onClick= {()=>{
          setMachine(machine);
          setShowModal(true);
        }}
          sx={{
            p: 1.5,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            position: "relative",
          }}
        >
          {/* Tiêu đề */}
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 800, letterSpacing: 0.5, color: "white" }}
          >
            {`${LINE}-${NAME_MACHINE}`}
          </Typography>

          {/* Khung hiển thị: WaterFill làm NỀN, ảnh và overlay nằm phía trên */}
          <Box
            className={status === "CRITICAL" ? "blinking" : ""}
            sx={{
              position: "relative",
              width: 140,
              height: 120,
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            {/* WaterFill nền */}
            <WaterFill
              value={(TOTAL / CRITICAL_THRESHOLD) * 100}
              color={bgColor}
              bgColor="rgba(255,255,255,0.06)"
              radius={8}
            />

            {/* Ảnh sản phẩm */}
            <Box
              component="img"
              src={img1}
              alt={NAME_MACHINE}
              sx={{
                position: "relative",
                zIndex: 2,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
            {/* <Typography
            variant="subtitle2"
            sx={{
              position: "absolute",
              top: 5,
              left: 0,
              right: 0,
              textAlign: "center",
              fontWeight: 700,
              color: titleColor,
              zIndex: 3,
            }}
          >
            {name}
          </Typography> */}
            <Typography
              variant="subtitle2"
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                textAlign: "center",
                fontWeight: 700,
                color: "rgba(0,0,0,0.85)",
                zIndex: 3,
              }}
            >
              {TOTAL}/{CRITICAL_THRESHOLD}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, width: "100%" }}>
      <Dialog
        open={newFolderDialogOpen6}
        onClose={() => setNewFolderDialogOpen6(false)}
      >
        <DialogTitle>Change knife of V-cut machine</DialogTitle>
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
                  {/* {AVAILABLE_TYPES.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))} */}
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
            Change
          </Button>
        </DialogActions>
      </Dialog>
      <HiModal
            header={`OverTime Infomation`}
            open={showModal}
            onClose={() => setShowModal(false)}
            widthModal={80}
            heightModal={80}
          >
            <OverTimeDetail
              idata={machine}
            ></OverTimeDetail>
          </HiModal>
      <Typography variant="title" sx={{ fontWeight: 800, letterSpacing: 0.5 }}>
        B01
      </Typography>
      <Box
        component="section"
        sx={{ flexGrow: 1, p: 3, width: "100%", border: "1px dashed grey" }}
      >
        <Grid container spacing={3}>
          {idata
            .filter((item) => item.FACTORY === "B01")
            .map((machine) => (
              <Grid
                item
                size={{ lg: 3, md: 6, xs: 6 }}
                xs={12}
                sm={6}
                md={3}
                key={machine.id}
              >
                {/* md={3} để có bố cục 4 cột (4x4) */}
                <MachineStatusCard2 machine={machine} />
              </Grid>
            ))}
        </Grid>
      </Box>
      <Typography variant="title" sx={{ fontWeight: 800, letterSpacing: 0.5 }}>
        A02
      </Typography>
      <Box
        component="section"
        sx={{ flexGrow: 1, p: 3, width: "100%", border: "1px dashed grey" }}
      >
        <Grid container spacing={3}>
          {idata
            .filter((item) => item.FACTORY === "A02")
            .map((machine) => (
              <Grid
                item
                size={{ lg: 3, md: 6, xs: 6 }}
                xs={12}
                sm={6}
                md={3}
                key={machine.id}
              >
                {/* md={3} để có bố cục 4 cột (4x4) */}
                <MachineStatusCard2 machine={machine} />
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default MachineStatusHighchartsGrid;
