import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableSortLabel,
  Button,
} from "@mui/material";
import ConfirmDataGelDialog from "./confirmDataGelError";
import dayjs from "dayjs";

const TableError = ({ idata = [], onConfirmSucces }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dataForDialog, setDataForDialog] = useState();

  const handleOpenDialog = (dataRow) => {
    setDataForDialog(dataRow);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  const checkTimeDifferenceStatus = (targetTimeString) => {
    // 1. Chuyển đổi chuỗi thời gian sang định dạng ISO an toàn và tạo Date object
    // Thay thế '/' bằng '-' để đảm bảo tính nhất quán khi phân tích cú pháp.
    const safeTimeString = targetTimeString.replace(/\//g, "-");
    const targetDate = new Date(safeTimeString);

    // Kiểm tra tính hợp lệ của Date object
    if (isNaN(targetDate.getTime())) {
      console.error("Lỗi: Chuỗi thời gian không hợp lệ.");
      return "invalid_time";
    }

    // 2. Lấy thời gian hiện tại (NOW)
    const now = new Date();

    // 3. Tính toán sự khác biệt (tính bằng mili giây)
    // Thời gian hiện tại trừ thời gian trong quá khứ. Nếu kết quả âm, nghĩa là targetTimeString là tương lai.
    const diffInMilliseconds = now.getTime() - targetDate.getTime();

    // Chuyển mili giây sang giờ
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

    return diffInHours;
    // 4. So sánh và trả về trạng thái
    if (diffInHours > 12) {
      return "error"; // Lớn hơn 12 giờ
    } else if (diffInHours > 8) {
      return "warning"; // Lớn hơn 8 giờ nhưng nhỏ hơn hoặc bằng 12 giờ
    } else {
      return "ok"; // Nhỏ hơn hoặc bằng 8 giờ
    }
  };
  return (
    <Grid sx={{ height: "100%" }} container columns={12}>
      <ConfirmDataGelDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        initialData={dataForDialog}
        onConfirmSucces={onConfirmSucces}
      />
      <TableContainer
        sx={{
          overflow: "auto",
          height: "100%",
          "&::-webkit-scrollbar": { width: 0, opacity: 0 },
          "&:hover::-webkit-scrollbar": { width: 4, opacity: 1 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#cdcdcd8c",
            borderRadius: "10px",
          },
        }}
      >
        <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
          <TableHead
            sx={{ position: "sticky", top: "0", backgroundColor: "#4099ff" }}
          >
            <TableRow>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                  color: "#000",
                }}
                align="center"
              >
                WO
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                  color: "#000",
                }}
                align="center"
              >
                Model
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                  color: "#000",
                }}
                align="center"
              >
                KP_NO
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                  color: "#000",
                }}
                align="center"
              >
                TR_SN
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                  color: "#000",
                }}
                align="center"
              >
                Station
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                  color: "#000",
                }}
                align="center"
              >
                Slot No
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                  color: "#000",
                }}
                align="center"
              >
                Slot Request
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                  color: "#000",
                }}
                align="center"
              >
                Return Qty
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                  color: "#000",
                }}
                align="center"
              >
                Status
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                  color: "#000",
                }}
                align="center"
              >
                EMP NO
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                  color: "#000",
                }}
                align="center"
              >
                {idata && idata[0].status === "Wait return"
                  ? "End Time"
                  : "Counted Time"}
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                  color: "#000",
                }}
                align="center"
              >
                Aging Time
              </TableCell>
              <TableCell
                style={{
                  padding: "6px 6px",
                  fontWeight: "bold",
                  color: "#000",
                }}
                align="center"
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {idata.map((row, index) => {
              const status = checkTimeDifferenceStatus(row.end_time);
              const colorText =
                status > 12 ? "#ff7373" : status > 8 ? "#d3bd50" : "#000";
              return (
                <TableRow key={index}>
                  <TableCell
                    align="center"
                    sx={{ color: colorText, padding: "6px 6px" }}
                  >
                    {row.wo || ""}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: colorText, padding: "6px 6px" }}
                  >
                    {row.model || ""}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: colorText, padding: "6px 6px" }}
                  >
                    {row.kp_no || ""}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: colorText, padding: "6px 6px" }}
                  >
                    {row.tr_sn || ""}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: colorText, padding: "6px 6px" }}
                  >
                    {row.station || ""}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: colorText, padding: "6px 6px" }}
                  >
                    {row.slot_no || ""}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: colorText, padding: "6px 6px" }}
                  >
                    {row.slot_request || ""}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: colorText, padding: "6px 6px" }}
                  >
                    {row.return_qty || ""}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: colorText, padding: "6px 6px" }}
                  >
                    {row.status || ""}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ color: colorText, padding: "6px 6px" }}
                  >
                    {row.emp_no || ""}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: colorText, padding: "6px 6px" }}
                  >
                    {row.end_time || ""}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: colorText, padding: "6px 6px" }}
                  >
                    {status.toFixed(2) || ""}h
                  </TableCell>
                  <TableCell align="center" sx={{ padding: "6px 6px" }}>
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
                        py: 1, // Padding dọc
                        fontSize: "8px",
                        borderRadius: "4px",
                      }}
                      onClick={() => {
                        handleOpenDialog(row);
                      }}
                    >
                      CONFIRM
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};
export default TableError;
