import React from "react";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";

const TableWoOverTime = ({ idata = [], onShowModal }) => {
  const theme = useTheme();

  const dataDisplay = React.useMemo(() => {
    const tempError = {};
    idata.forEach((item) => {
      if (tempError[item.wo]) {
        tempError[item.wo].Frequency += 1;
      } else {
        tempError[item.wo] = {
          wo: item.wo,
          Frequency: 1,
          model: item.model,
          station: item.station,
          end_time: item.end_time,
        };
      }
    });
    const List2 = Object.values(tempError);
    List2.sort((a, b) => dayjs(a.end_time) - dayjs(b.end_time));
    return List2;
  }, [idata]);

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
  };

  const displayItems = React.useMemo(() => {
    return idata.filter(
      (item) => checkTimeDifferenceStatus(item.end_time) != "ok"
    );
  }, [idata]);

  return (
    <Box sx={{ height: "100%" }}>
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
            sx={{
              position: "sticky",
              top: "0",
              backgroundColor: theme.palette.background.conponent,
            }}
          >
            <TableRow>
              <TableCell
                style={{
                  padding: "3px 6px",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
                align="center"
              >
                Model
              </TableCell>
              <TableCell
                style={{
                  padding: "3px 6px",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
                align="center"
              >
                WO
              </TableCell>
              <TableCell
                style={{
                  padding: "3px 6px",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
                align="center"
              >
                Qty
              </TableCell>
              <TableCell
                style={{
                  padding: "3px 6px",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
                align="center"
              >
                TimeOff
              </TableCell>
              <TableCell
                style={{
                  padding: "3px 6px",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
                align="center"
              >
                Aging Time
              </TableCell>
              <TableCell
                style={{
                  padding: "3px 6px",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
                align="center"
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataDisplay.length > 0
              ? dataDisplay.map((row, index) => {
                  const status = checkTimeDifferenceStatus(row.end_time);
                  const colorText =
                    status > 12 ? "#ff7373" : status > 8 ? "#d3bd50" : "";
                  //   console.log('timeOver',row.end_time,timeOver)
                  return (
                    //,ERROR,ERROR_CODE,root_,EMP_confirm, act

                    <TableRow key={index}>
                      <TableCell
                        align="center"
                        style={{
                          color: colorText,
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {row.model || ""}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          color: colorText,
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {row.wo || ""}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          color: colorText,
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {row.Frequency || ""}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          color: colorText,
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {row.end_time || ""}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          color: colorText,
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {status.toFixed(2) || ""}h
                      </TableCell>
                      <TableCell align="center"
                        style={{
                          color: '#2196F3',
                          padding: "3px",
                          fontSize: "10px",
                        }}>
                        <Box
                          onClick={() => {
                            onShowModal(
                              idata.filter((item) => item.wo === row.wo)
                            );
                          }}
                        >
                          Detail
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              : ""}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default TableWoOverTime;
