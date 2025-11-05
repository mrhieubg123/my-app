import React, { useState } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Tooltip,
} from "@mui/material";
import { Warning, Error, CheckCircle, Close } from "@mui/icons-material";
import dayjs from "dayjs";
import { getAuthorizedAxiosIntance } from "../../../../utils/axiosConfig";
import HiModal from "../../../../components/HiModal";
import VcutMachineDetail from "./VcutMachineDetail";
import { useTheme } from "@mui/material/styles";
import HiHoverReveal from "../../../../components/HiHoverReveal";

const axiosInstance = await getAuthorizedAxiosIntance();
// --- HẰNG SỐ VÀ DỮ LIỆU GIẢ LẬP ---
const CRITICAL_THRESHOLD = 500000;
const WARNING_THRESHOLD = 450000;

// --- COMPONENT CHÍNH (GRID 16 MÁY) ---

const MachineStatusHighchartsGrid = ({ idata = [], onCallBack }) => {
  const theme = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [machine, setMachine] = useState(null);

  function buildPivotByFactory(data) {
    // Group theo FACTORY
    const byFactory = data.reduce((acc, it) => {
      const factory = it.FACTORY ?? "UNKNOWN";
      if (!acc[factory]) acc[factory] = [];
      acc[factory].push(it);
      return acc;
    }, {});

    // Với mỗi factory, dựng cấu trúc pivot
    const result = {};
    Object.entries(byFactory).forEach(([factory, items]) => {
      // Tập cột (Lines)
      const lines = Array.from(new Set(items.map((it) => it.LINE))).sort();

      // Tập hàng (Machines) — gộp theo NAME_MACHINE + LOCATION cho clear
      const machineKeys = Array.from(
        new Set(items.map((it) => it.LOCATION))
      ).sort();

      // Khởi tạo map [machineKey][line] = 0
      const pivot = {};
      machineKeys.forEach((mk) => {
        pivot[mk] = {};
        lines.forEach((ln) => (pivot[mk][ln] = 0));
      });

      // Gộp TOTAL theo (machineKey, line)
      for (const it of items) {
        const mk = it.LOCATION;
        const ln = it.LINE;
        const total = Number(it.TOTAL ?? 0);
        pivot[mk][ln] = (pivot[mk][ln] ?? 0) + total;
      }

      // Tính tổng theo line để làm footer
      const lineTotals = {};
      lines.forEach((ln) => {
        lineTotals[ln] = machineKeys.reduce(
          (sum, mk) => sum + (pivot[mk][ln] ?? 0),
          0
        );
      });

      result[factory] = { lines, machineKeys, pivot, lineTotals };
    });

    return result;
  }

  const pivot = React.useMemo(() => buildPivotByFactory(idata), [idata]);

  const MachineStatusCard3 = ({ machine, mIndex, lIndex }) => {
    const { NAME_MACHINE, TOTAL, LINE, LOCATION } = machine;

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
      bgColor = "#00e396"; // Xanh
      titleColor = "rgb(38, 196, 51)";
      icon = <Close sx={{ fontSize: 18 }} />;
      message = "Active";
      status = "NORMAL";
    }
    return (
      <Tooltip
        arrow
        placement="top"
        title={
          <Box sx={{ textAlign: "center" }}>
            <strong>{NAME_MACHINE}</strong>
            <br />
            Used: {TOTAL.toLocaleString("en-US")}
          </Box>
        }
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
          }}
          onClick={() => {
            setMachine(machine);
            setShowModal(true);
          }}
        >
          <Box
            className={status?.split("-")[0] === "ERROR" ? "blinking" : ""}
            sx={{
              backgroundColor: bgColor,
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              margin: "auto",
            }}
          ></Box>
        </Box>
      </Tooltip>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, width: "100%" }}>
      <HiModal
        header={`Change knife history`}
        open={showModal}
        onClose={() => setShowModal(false)}
        widthModal={60}
        heightModal={80}
      >
        <VcutMachineDetail idata={machine}></VcutMachineDetail>
      </HiModal>
      {Object.entries(pivot).map(
        ([factory, { lines, machineKeys, pivot: pv, lineTotals }]) => (
          <Paper
            component="section"
            sx={{
              flexGrow: 1,
              p: 3,
              width: "100%",
              border: "1px dashed grey",
              marginBottom: "20px",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Factory: {factory}
            </Typography>
            <TableContainer>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, width: "10%" }}>
                      Location
                    </TableCell>
                    {lines.map((ln) => (
                      <TableCell
                        key={ln}
                        align="center"
                        sx={{ fontWeight: 700 }}
                      >
                        {ln}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {machineKeys.map((mk, mIndex) => (
                    <TableRow key={mk} hover>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>M{mk}</TableCell>
                      {lines.map((ln, lIndex) => (
                        <TableCell key={ln} align="center">
                          {pv[mk][ln] ? (
                            <MachineStatusCard3
                              mIndex={mIndex}
                              lIndex={lIndex}
                              machine={idata.find(
                                (m) =>
                                  m.FACTORY === factory &&
                                  m.LINE === ln &&
                                  m.LOCATION === mk
                              )}
                            />
                          ) : (
                            "—"
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )
      )}
    </Box>
  );
};

export default MachineStatusHighchartsGrid;
