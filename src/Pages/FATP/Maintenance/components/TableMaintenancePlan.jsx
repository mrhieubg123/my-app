import React, { useState, useEffect, useMemo } from "react";
import {
  LinearProgress,
  Box,
  Typography,
  styled,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HiModal from "../../../../components/HiModal";
import ErrorDetailImage from "./ErrorDetailImage";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAuthorizedAxiosIntance } from "../../../../utils/axiosConfig";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const MOCK_DATA = [
  { LINE: "L06", DATE: "2025-10-02", STATUS: "Approved" },
  { LINE: "T04", DATE: "2025-10-02", STATUS: "Approved" },
  { LINE: "T06", DATE: "2025-10-02", STATUS: "Approved" },
  { LINE: "T07", DATE: "2025-10-02", STATUS: "Approved" },
  { LINE: "T08", DATE: "2025-10-02", STATUS: "Approved" },
  { LINE: "T09", DATE: "2025-10-02", STATUS: "On going" },
  { LINE: "T10", DATE: "2025-10-02", STATUS: "On going" },
  { LINE: "T11A", DATE: "2025-10-02", STATUS: "Approved" },
  { LINE: "T12-A", DATE: "2025-10-02", STATUS: "On going" },
  { LINE: "T12-B", DATE: "2025-10-02", STATUS: "On going" },
];

const LIST_BP_SIGNATURE = {
  'PTH': 'cpe-vn-me-automation@mail.foxconn.com',
  'PM': 'cpe-vn-me-automation@mail.foxconn.com',
  'TE': 'cpe-vn-me-automation@mail.foxconn.com',
  'ME': 'cpe-vn-me-automation@mail.foxconn.com',
  'PQE': 'cpe-vn-me-automation@mail.foxconn.com',
  'PE': 'cpe-vn-me-automation@mail.foxconn.com',
  'PD': 'cpe-vn-me-automation@mail.foxconn.com',
  'QA': '',
  'QC': 'cpe-vn-me-automation@mail.foxconn.com',
  'R&D': 'cpe-vn-me-automation@mail.foxconn.com',
  'SQE': 'cpe-vn-me-automation@mail.foxconn.com',
  'PP': '',
  'MFG': '',
  'IE': '',
  'MET': '',
  'FQC': '',
  'PROD': '',
};

const stages = Object.keys(LIST_BP_SIGNATURE)
  .filter(key => {
    const val = LIST_BP_SIGNATURE[key];
    return val !== "" && val !== null;
  })
  .map(key => ({
    key: key,
    label: key
  }));

const getCurrentStep = (statusStr) => {
  const norm = (statusStr || "").trim().toLowerCase();
  if (norm === "ok" || norm === "approved") return stages.length;

  for (let i = 0; i < stages.length; i++) {
    const key = stages[i].key;
    const bpVal = LIST_BP_SIGNATURE[key];
    if (
      (bpVal && norm.includes(bpVal.toLowerCase())) ||
      norm.includes(key.toLowerCase())
    ) {
      return i;
    }
  }
  return 0;
};

const TableMaintenancePlan = ({ idata = [], DataSeries = [], keyFilter }) => {
  // idata = MOCK_DATA;
  const theme = useTheme();
  const selectedFactory = useSelector((state) => state.param.params.Factory);

  const [current, setCurrent] = useState(0);
  const [showModal1, setShowModal1] = useState(false);
  const [dataFATPErrorDetail, setDataFATPErrorDetail] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5); // Number of visible items

  // State for Maintenance Form Dialog
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [idConfirm, setIdConfirm] = useState("");
  const [comment, setComment] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for Details HiModal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailRow, setDetailRow] = useState(null);
  const [apiBaseUrl, setApiBaseUrl] = useState("");

  useEffect(() => {
    fetch("/config.json")
      .then((res) => res.json())
      .then((configJson) => {
        const url = window.location.hostname.startsWith("10.228.121.39")
          ? configJson.apiBaseUrl121
          : configJson.apiBaseUrl;
        setApiBaseUrl(url);
      })
      .catch((err) => console.error("Error loading config:", err));
  }, []);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear()).slice(-2);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    } catch (e) {
      return dateStr;
    }
  };

  const handleRowClick = (row) => {
    if (!row.STATUS) {
      setSelectedRow(row);
      setIdConfirm("");
      setComment("");
      // Revoke old URLs
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      setPreviewUrls([]);
      setShowDialog(true);
    } else {
      setDetailRow(row);
      setShowDetailModal(true);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    // Revoke URLs to free memory
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newFiles = [...selectedFiles, ...files];
    const newUrls = files.map((file) => URL.createObjectURL(file));

    setSelectedFiles(newFiles);
    setPreviewUrls((prev) => [...prev, ...newUrls]);
  };

  const handleRemoveImage = (indexToRemove) => {
    URL.revokeObjectURL(previewUrls[indexToRemove]);
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setPreviewUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async () => {
    if (!idConfirm.trim()) {
      toast.error("Vui lòng điền ID Confirm (Người xác nhận)!");
      return;
    }

    setIsSubmitting(true);
    try {
      const axiosInstance = await getAuthorizedAxiosIntance();
      const formData = new FormData();
      formData.append("line", selectedRow?.LINE || "");
      formData.append("factory", selectedRow?.FACTORY || selectedFactory || "");
      formData.append("note", comment);
      formData.append("idConfirm", idConfirm);

      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axiosInstance.post("api/maintenance/addFATPMaintenancePlan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        toast.success("✅ Cập nhật thông tin bảo trì thành công!");
        handleCloseDialog();
      }
    } catch (error) {
      console.error("Error submitting maintenance plan:", error);
      toast.error(error.response?.data?.message || "❌ Lỗi khi gửi thông tin bảo trì!");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (DataSeries.length < visibleCount) return;
    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev >= DataSeries.length - visibleCount ? 0 : prev + 1
      );
    }, 3600);
    return () => clearInterval(interval);
  }, [DataSeries.length, visibleCount]);

  const uniqueFirstByLine = Object.values(
    idata.reduce((acc, item) => {
      if (!acc[item.LINE]) {
        acc[item.LINE] = item; // chỉ lấy lần đầu tiên LINE xuất hiện
      }
      return acc;
    }, {})
  ).sort((a, b) => a.LINE.localeCompare(b.LINE));

  return (
    <>
      {/* <HiModal
        header={`Maintenance plan details`}
        open={showModal1}
        onClose={() => setShowModal1(false)}
        widthModal={80}
        heightModal={80}
      >
        <ErrorDetailImage idata={dataFATPErrorDetail}></ErrorDetailImage>
      </HiModal> */}
      <Box sx={{ height: "100%" }}>
        <TableContainer
          sx={{
            overflow: "auto",
            height: "100%",
            "&::-webkit-scrollbar": { width: 0, opacity: 0, height: 6 },
            "&:hover::-webkit-scrollbar": { width: 4, opacity: 1 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#cdcdcd8c",
              borderRadius: "10px",
            },
          }}
        >
          <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
            <TableHead
              sx={{
                position: "sticky",
                top: "0",
                backgroundColor: theme.palette.background.conponent,
              }}
            >
              <TableRow sx={{ background: "#518fb9" }}>
                <TableCell
                  style={{ padding: "3px 6px", fontWeight: "bold" }}
                  align="center"
                >
                  No.
                </TableCell>
                <TableCell
                  style={{ padding: "3px 6px", fontWeight: "bold" }}
                  align="center"
                >
                  Line
                </TableCell>
                <TableCell
                  style={{ padding: "3px 6px", fontWeight: "bold" }}
                  align="center"
                >
                  Update at
                </TableCell>
                <TableCell
                  style={{ padding: "3px 6px", fontWeight: "bold" }}
                  align="center"
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {uniqueFirstByLine.length > 0
                ? uniqueFirstByLine.map(
                  (
                    row,
                    index //,ERROR,ERROR_CODE,root_,EMP_confirm, act
                  ) => {
                    const rawStatus = row.STATUS;
                    const isDenied = rawStatus && rawStatus.trim().toLowerCase().startsWith("deny");
                    const status = !rawStatus
                      ? "Need Maintenance"
                      : rawStatus.trim().toUpperCase() === "OK" || rawStatus.trim().toUpperCase() === "APPROVED"
                        ? "OK"
                        : isDenied
                          ? rawStatus.trim()
                          : `Waiting for ${rawStatus.trim()} signature`;
                    return (
                      <TableRow
                        key={index}
                        onClick={() => handleRowClick(row)}
                        sx={{
                          "& > .MuiTableCell-root": {
                            paddingTop: "8px !important",
                            paddingBottom: "8px !important",
                          },
                        }}
                      >
                        <TableCell
                          component="th"
                          align="center"
                          scope="row"
                          style={{
                            padding: "3px",
                            fontSize: "12px",
                          }}
                        >
                          {index + 1 || ""}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            padding: "3px",
                            fontSize: "12px",
                          }}
                        >
                          {row.LINE || ""}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            padding: "3px",
                            fontSize: "12px",
                          }}
                        >
                          {formatDateTime(row.UPDATED_AT)}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            padding: "3px",
                            fontSize: "12px",
                          }}
                        >
                          <Box
                            sx={{
                              display: "inline-block", // không full width
                              px: 1, // padding ngang nhỏ
                              py: 0.3,
                              background:
                                status === "OK"
                                  ? "linear-gradient(180deg, #66bb6a 0%, #2e7d32 100%)" // xanh lá gradient
                                  : isDenied
                                    ? "linear-gradient(180deg, rgb(233, 85, 80) 0%, rgb(241, 16, 8) 100%)" // đỏ gradient
                                    : status !== 'Need Maintenance'
                                      ? "linear-gradient(180deg, #fff176a2 0%, #fbc02d 100%)"
                                      : "linear-gradient(180deg,rgb(233, 85, 80) 0%,rgb(241, 16, 8) 100%)",
                              borderRadius: 2,
                              color: (status === 'Need Maintenance' || isDenied) ? "#fff" : "#000", // màu chữ
                              fontWeight: 700,
                              minWidth: "fit-content",
                            }}
                          >
                            {status}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  }
                )
                : ""}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog
        open={showDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      // PaperProps={{
      //   sx: {
      //     borderRadius: "16px",
      //     boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      //     background: theme.palette.background.default || "#fff",
      //     p: 1,
      //   },
      // }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            fontWeight: 700,
            fontSize: "1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          Cập nhật Bảo trì Line {selectedRow?.LINE}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              color: "grey.500",
              "&:hover": { color: "grey.700" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 6, sm: 6 }} xs={6} lg={6}
              md={6}>
              <TextField
                label="Line"
                value={selectedRow?.LINE || ""}
                disabled
                fullWidth
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  sx: { backgroundColor: "action.disabledBackground" }
                }}
              />
            </Grid>
            <Grid item size={{ xs: 6, sm: 6 }} xs={6} lg={6}
              md={6}>
              <TextField
                label="Factory"
                value={selectedRow?.FACTORY || selectedFactory || ""}
                disabled
                fullWidth
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  sx: { backgroundColor: "action.disabledBackground" }
                }}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 12 }} xs={12} lg={12}
              md={12}>
              <TextField
                label="Người xác nhận (ID Confirm)"
                value={idConfirm}
                onChange={(e) => setIdConfirm(e.target.value)}
                fullWidth
                required
                variant="outlined"
                placeholder="Nhập mã nhân viên hoặc tên..."
                autoFocus
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 12 }} xs={12} lg={12}
              md={12}>
              <TextField
                label="Ghi chú (Comment)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Nhập ghi chú chi tiết về tình trạng bảo trì..."
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 12 }} xs={12} lg={12}
              md={12}>
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "text.secondary" }}>
                  Hình ảnh thiết bị đính kèm
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    textTransform: "none",
                    borderRadius: "8px",
                    borderStyle: "dashed",
                    borderWidth: "1.5px",
                    borderColor: "primary.main",
                    color: "primary.main",
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                    py: 1.5,
                    width: "100%",
                    "&:hover": {
                      borderStyle: "dashed",
                      borderWidth: "1.5px",
                      backgroundColor: "rgba(25, 118, 210, 0.08)",
                    }
                  }}
                >
                  Chọn ảnh từ thiết bị
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
              </Box>

              {previewUrls.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1.5,
                    mt: 2,
                    maxHeight: "130px",
                    overflowY: "auto",
                    p: 1.5,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: "8px",
                    backgroundColor: "action.hover",
                  }}
                >
                  {previewUrls.map((url, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        width: 54,
                        height: 54,
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <img
                        src={url}
                        alt={`preview-${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                        sx={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          backgroundColor: "error.main",
                          color: "white",
                          padding: "2px",
                          width: 16,
                          height: 16,
                          boxShadow: 2,
                          "&:hover": {
                            backgroundColor: "error.dark",
                          },
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 10 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, justifyContent: "flex-end", gap: 1 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
              }
            }}
          >
            {isSubmitting ? "Đang gửi..." : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>

      <HiModal
        header={`Chi tiết Kế hoạch Bảo trì Line ${detailRow?.LINE}`}
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        widthModal={75}
        heightModal={80}
      >
        <Box sx={{ p: 2, height: "100%", overflowY: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
          {/* General Information */}
          <Grid container spacing={2.5}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ p: 1.5, borderRadius: "8px", backgroundColor: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)" }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 0.5 }}>
                  LINE
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {detailRow?.LINE || "N/A"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ p: 1.5, borderRadius: "8px", backgroundColor: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)" }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 0.5 }}>
                  FACTORY
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {detailRow?.FACTORY || selectedFactory || "N/A"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ p: 1.5, borderRadius: "8px", backgroundColor: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)" }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 0.5 }}>
                  NGƯỜI XÁC NHẬN
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: "primary.main" }}>
                  {detailRow?.IDCONFIRM || detailRow?.idConfirm || "N/A"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ p: 1.5, borderRadius: "8px", backgroundColor: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)" }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 0.5 }}>
                  CẬP NHẬT LÚC
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {formatDateTime(detailRow?.UPDATED_AT)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ p: 2, borderRadius: "8px", backgroundColor: "rgba(25, 118, 210, 0.03)", border: "1px dashed rgba(25, 118, 210, 0.2)" }}>
                <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 700, display: "block", mb: 0.8 }}>
                  GHI CHÚ / COMMENT
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: "pre-wrap" }}>
                  {detailRow?.NOTE || detailRow?.note || "Không có ghi chú."}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Stepper progress */}
          <Box sx={{ py: 3, px: 2, background: "rgba(0,0,0,0.01)", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.04)" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 4, height: 18, bgcolor: "primary.main", borderRadius: 1 }} />
              Tiến độ Ký duyệt (Signature Progress)
            </Typography>

            {/* OK banner */}
            {((detailRow?.STATUS || "").trim().toLowerCase() === "ok" || (detailRow?.STATUS || "").trim().toLowerCase() === "approved") && (
              <Box sx={{
                mb: 3,
                p: 2,
                borderRadius: "12px",
                background: "linear-gradient(90deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.05) 100%)",
                borderLeft: "5px solid #4caf50",
                display: "flex",
                alignItems: "center",
                gap: 2
              }}>
                <Box sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: "#4caf50",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "16px"
                }}>
                  ✓
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#2e7d32" }}>
                    Đã hoàn thành toàn bộ ký duyệt!
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Tất cả các bộ phận đã xác nhận, quá trình bảo trì cho line đã kết thúc thành công.
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Deny banner */}
            {(() => {
              const statusLower = (detailRow?.STATUS || "").trim().toLowerCase();
              if (statusLower.startsWith("deny")) {
                return (
                  <Box sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: "12px",
                    background: "linear-gradient(90deg, rgba(244, 67, 54, 0.15) 0%, rgba(244, 67, 54, 0.05) 100%)",
                    borderLeft: "5px solid #f44336",
                    display: "flex",
                    alignItems: "center",
                    gap: 2
                  }}>
                    <Box sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: "#f44336",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "16px"
                    }}>
                      ✗
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#d32f2f" }}>
                        Kế hoạch bảo trì bị từ chối! ({detailRow?.STATUS})
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Vui lòng kiểm tra lại và cập nhật thông tin bảo trì.
                      </Typography>
                    </Box>
                  </Box>
                );
              }
              return null;
            })()}

            <Box sx={{
              width: "100%",
              mt: 2
            }}>
              <Box sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.5,
                justifyContent: "flex-start"
              }}>
                {(() => {
                  const currentStep = getCurrentStep(detailRow?.STATUS);
                  const normStatus = (detailRow?.STATUS || "").trim().toLowerCase();
                  const isDenied = normStatus.startsWith("deny");

                  return stages.map((stage, idx) => {
                    const isDone = idx < currentStep;
                    const isActive = idx === currentStep;
                    const isStageDenied = isActive && isDenied;
                    return (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.2,
                          px: 1.5,
                          py: 1,
                          borderRadius: "10px",
                          border: "1px solid",
                          borderColor: isDone
                            ? "success.light"
                            : isStageDenied
                              ? "error.light"
                              : isActive
                                ? "primary.light"
                                : "rgba(0,0,0,0.06)",
                          background: isDone
                            ? "linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, rgba(129, 199, 132, 0.02) 100%)"
                            : isStageDenied
                              ? "linear-gradient(135deg, rgba(244, 67, 54, 0.08) 0%, rgba(244, 67, 54, 0.02) 100%)"
                              : isActive
                                ? "linear-gradient(135deg, rgba(33, 150, 243, 0.08) 0%, rgba(100, 181, 246, 0.02) 100%)"
                                : "rgba(0,0,0,0.02)",
                          minWidth: "100px",
                          flexGrow: 1,
                          boxShadow: isActive && !isStageDenied
                            ? "0 2px 8px rgba(33, 150, 243, 0.15)"
                            : isStageDenied
                              ? "0 2px 8px rgba(244, 67, 54, 0.15)"
                              : "none",
                        }}
                      >
                        <Box sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: isDone
                            ? "linear-gradient(135deg, #81c784 0%, #388e3c 100%)"
                            : isStageDenied
                              ? "linear-gradient(135deg, #e57373 0%, #d32f2f 100%)"
                              : isActive
                                ? "linear-gradient(135deg, #64b5f6 0%, #1976d2 100%)"
                                : "#e0e0e0",
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: 700,
                          border: "2px solid",
                          borderColor: isDone ? "#c8e6c9" : isStageDenied ? "#ffcdd2" : isActive ? "#bbdefb" : "#fff",
                        }}>
                          {isDone ? "✓" : isStageDenied ? "✗" : idx + 1}
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: "12px", lineHeight: 1.2 }}>
                            {stage.label}
                          </Typography>
                          <Typography variant="caption" sx={{
                            fontSize: "10px",
                            fontWeight: 700,
                            color: isDone ? "success.main" : isStageDenied ? "error.main" : isActive ? "primary.main" : "text.secondary"
                          }}>
                            {isDone ? "Đã ký" : isStageDenied ? "Bị từ chối" : isActive ? "Chờ ký" : "Chờ"}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  });
                })()}
              </Box>
            </Box>
          </Box>

          {/* Documents Images */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 4, height: 18, bgcolor: "primary.main", borderRadius: 1 }} />
              Hình ảnh bảo trì đính kèm (Attachments)
            </Typography>

            {(() => {
              const docStr = detailRow?.DOCUMENT || detailRow?.document || "";
              const documents = docStr.split(",").map(item => item.trim()).filter(Boolean);

              if (documents.length > 0) {
                return (
                  <Grid container spacing={2}>
                    {documents.map((img, idx) => {
                      const fullImgUrl = img.startsWith("http") ? img : `${apiBaseUrl}/${img}`;
                      return (
                        <Grid item xs={4} sm={3} md={2} key={idx}>
                          <Box
                            sx={{
                              position: "relative",
                              borderRadius: "8px",
                              overflow: "hidden",
                              border: "1px solid rgba(0,0,0,0.1)",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                              cursor: "pointer",
                              transition: "transform 0.2s ease, box-shadow 0.2s ease",
                              "&:hover": {
                                transform: "scale(1.05)",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                              }
                            }}
                            onClick={() => window.open(fullImgUrl, "_blank")}
                          >
                            <img
                              src={fullImgUrl}
                              alt={`document-${idx}`}
                              style={{
                                width: "100%",
                                height: "100px",
                                objectFit: "cover",
                                display: "block"
                              }}
                            />
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                );
              } else {
                return (
                  <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic" }}>
                    Không có hình ảnh đính kèm.
                  </Typography>
                );
              }
            })()}
          </Box>

          {/* Action button if denied by ME */}
          {(detailRow?.STATUS || "").trim().toLowerCase() === "deny by me" && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button
                variant="contained"
                onClick={() => {
                  setSelectedRow(detailRow);
                  setIdConfirm("");
                  setComment("");
                  previewUrls.forEach((url) => URL.revokeObjectURL(url));
                  setSelectedFiles([]);
                  setPreviewUrls([]);
                  setShowDetailModal(false);
                  setShowDialog(true);
                }}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "8px",
                  px: 4,
                  py: 1.2,
                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
                  background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                  color: "#fff",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
                  }
                }}
              >
                Cập nhật Bảo trì
              </Button>
            </Box>
          )}
        </Box>
      </HiModal>
    </>
  );
};

export default React.memo(TableMaintenancePlan);
