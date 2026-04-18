import React, { memo, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import HiBox from "../../../components/HiBox";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  IconButton,
  Drawer,
  AppBar,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import CABChart from "./components/CABChart";
import TableMachineStatus from "./components/MachineStatus";
import HiProgressBar from "./components/FailureAnalysis";
import { getAuthorizedAxiosIntance } from "../../../utils/axiosConfig";
import LineChart from "./components/LineChart";
import TableErorHistory from "./components/tableErrorOver10m";
import HiModal from "../../../components/HiModal";
import ESDTotal from "./components/ESDTotal";
import { Description, Build } from "@mui/icons-material";
import ForceDefaultDetail from "./components/ForceDefaultDetail";
import ForceFileExplorer from "./components/ForceDocummentFolder";
import ForceDocummentDetail from "./components/ForceDocummentDetail";
import RotatingModeSelector from "./components/CircularSliderMUI";
import {
  WarningAmberRounded,
  FolderSpecialRounded,
  NotificationsNone,
  Search,
  FilePresentRounded,
  Download,
  TrendingUp,
  Close,
  ErrorOutline,
  WarningAmber,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const axiosInstance = await getAuthorizedAxiosIntance();
const API = "/api/files";

const drawerWidth = 240;

// Cấu hình mẫu cho Highcharts (Biểu đồ cột kết hợp đường Trend)
const chartOptions = {
  title: { text: "" },
  xAxis: { categories: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"] },
  yAxis: [
    { title: { text: "Sản lượng (pcs)" } },
    { title: { text: "Số lỗi" }, opposite: true },
  ],
  series: [
    {
      type: "column",
      name: "Sản lượng",
      data: [2100, 2250, 2150, 2300, 1900, 1750],
      color: "#e0e0e0",
    },
    {
      type: "spline",
      name: "Lỗi phát sinh",
      data: [45, 52, 38, 65, 41, 45],
      yAxis: 1,
      color: "#d32f2f",
    },
  ],
  credits: { enabled: false },
};

// Dữ liệu mẫu cho bảng
const defectData = [
  {
    id: 1,
    time: "2026-04-04 08:21",
    line: "L01 / M-A12",
    error: "Missing part",
    state: "NEW",
  },
  {
    id: 2,
    time: "2026-04-04 08:24",
    line: "L02 / M-B99",
    error: "Scratch",
    state: "CONFIRMED",
  },
  {
    id: 3,
    time: "2026-04-04 09:15",
    line: "L03 / M-X10",
    error: "Dirty",
    state: "IN_PROGRESS",
  },
];

const AoiPicture = () => {
  const paramState = useSelector((state) => state.param);
  const [station, setStation] = useState("AOI Station A");
  const [range, setRange] = useState("7d");
  const [defectType, setDefectType] = useState("all");
  const [search, setSearch] = useState("");
  const [files, setFiles] = useState([
    {
      sn: "SN001",
      station: "AOI Station1",
      model: "Model 1",
      slot: "Slot1,Slot3",
      error: "Missing Component",
      path: "uploads/imageA0I/1765953736112_6330223191317482764.jpg",
      createdAt: "17-DEC-25 01.42.16.116000000 PM",
    },
    {
      sn: "SN002",
      station: "AOI Station1",
      model: "Model 1",
      slot: "Slot1,Slot3",
      error: "Missing Component",
      path: "uploads/imageA0I/1765953736112_6330223191317482764.jpg",
      createdAt: "17-DEC-25 01.42.16.116000000 PM",
    },
    {
      sn: "SN003",
      station: "AOI Station1",
      model: "Model 1",
      slot: "Slot1,Slot3",
      error: "Missing Component",
      path: "uploads/imageA0I/1765953736112_6330223191317482764.jpg",
      createdAt: "17-DEC-25 01.42.16.116000000 PM",
    },
  ]);
  const [dataYeildRate, setDataYeildRate] = useState([]);
  const [baseURL, setBaseURL] = useState("");
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleImageClick = (url) => {
    setSelectedImage(url);
    setOpenImageModal(true);
  };

  const fetchAoiPictureError = async (model) => {
    try {
      const response = await axiosInstance.post(
        "api/screw/getDataScrewDocummentUpload",
        model,
      );
      setFiles(response.data || []);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchYeildRate = async (model) => {
    return data2.Data;
    try {
      const response = await axiosInstance.post(
        "api/YeildRate/getYeildRate",
        model,
      );
      return response.data.Data || [];
    } catch (error) {
      console.log(error.message);
    }
    return [];
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const url = await getBaseURL();
      if (mounted) setBaseURL(url);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    let intervalId;

    const load = async () => {
      if (!isMounted) return;

      const newMo = {
        dateFrom: paramState.params.starttime,
        dateTo: paramState.params.endtime,
      };
      fetchAoiPictureError(newMo);

      let model;

      if (!paramState.params.starttime || !paramState.params.endtime) {
        model = getDefaultTimeRange();
      } else {
        model = {
          dateFrom: formatDateTime(paramState.params.starttime),
          dateTo: formatDateTime(paramState.params.endtime),
        };
      }

      const result = await fetchYeildRate(model);
      if (isMounted) {
        setDataYeildRate(result);
      }
    };

    load();

    intervalId = setInterval(() => {
      load();
    }, 30 * 60000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [paramState.params.starttime, paramState.params.endtime]);

  const totalOutput = dataYeildRate.reduce(
    (sum, item) => sum + (item.TOTAL_QTY || 0),
    0,
  );

  const kpis = {
    totalInspections: totalOutput,
    totalDefects: files.length,
    defectRate: Number(((files.length / totalOutput) * 100).toFixed(2)),
    lastWeekRate: 4.15,
  };

  const trend = [3.9, 4.05, 4.12, 4.18, 4.32, 4.31, 4.43];

  const delta = Number((kpis.defectRate - kpis.lastWeekRate).toFixed(2));

  /** Sparkline nhỏ bằng SVG (không cần chart lib) */
  function Sparkline({
    data = [],
    width = 220,
    height = 56,
    stroke = "#1976d2",
  }) {
    const points = useMemo(() => {
      if (!data.length) return "";
      const min = Math.min(...data);
      const max = Math.max(...data);
      const range = max - min || 1;

      return data
        .map((v, i) => {
          const x = (i / (data.length - 1 || 1)) * (width - 8) + 4;
          const y = height - ((v - min) / range) * (height - 10) - 5;
          return `${x},${y}`;
        })
        .join(" ");
    }, [data, width, height]);

    return (
      <svg
        width="100%"
        height="auto"
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: "block", maxWidth: width }}
      >
        <polyline
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
      </svg>
    );
  }

  function DonutRate({ value = 4.43, size = 120 }) {
    // Donut bằng CircularProgress (MUI)
    const pct = Math.max(0, Math.min(100, value));
    return (
      <Box
        sx={{
          position: "relative",
          display: "inline-flex",
          transform: { xs: "scale(0.8)", sm: "scale(0.9)", md: "scale(1)" },
        }}
      >
        <Box
          sx={{
            width: size,
            height: size,
            borderRadius: "50%",
            bgcolor: "action.hover",
            position: "absolute",
            inset: 0,
          }}
        />
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Typography
              sx={{ fontSize: "clamp(20px, 2.5vw, 24px)", fontWeight: 800 }}
            >
              {pct.toFixed(2)}%
            </Typography>
          </Box>

          {/* Track */}
          <Box
            sx={{
              width: size,
              height: size,
              borderRadius: "50%",
              border: "10px solid",
              borderColor: "rgba(25,118,210,0.15)",
            }}
          />
          {/* Arc (fake donut) */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "10px solid",
              borderColor: "transparent",
              borderTopColor: "#1976d2",
              borderRightColor: pct > 25 ? "#1976d2" : "transparent",
              borderBottomColor: pct > 50 ? "#1976d2" : "transparent",
              borderLeftColor: pct > 75 ? "#1976d2" : "transparent",
              transform: `rotate(${(pct / 100) * 360}deg)`,
              opacity: 0.95,
            }}
          />
        </Box>
      </Box>
    );
  }

  let cachedBaseURL = null;

  const getBaseURL = async () => {
    if (cachedBaseURL) return cachedBaseURL;

    const res = await fetch("/config.json");
    if (!res.ok) throw new Error("Cannot load config.json");
    const configJson = await res.json();

    cachedBaseURL =
      window.location.hostname === "10.228.121.39"
        ? configJson.apiBaseUrl121
        : configJson.apiBaseUrl;

    return cachedBaseURL;
  };

  const handleDownload = async (filename) => {
    window.open(
      `${baseURL}${API}/download/${encodeURIComponent(filename)}`,
      "_blank",
    );
  };

  const columns = [
    {
      field: "SN",
      headerName: "SN",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "FACTORY",
      headerName: "Factory",
      flex: 0.5, // tự chia chiều rộng
      minWidth: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "MODEL",
      headerName: "Model",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "SLOT",
      headerName: "Slot",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "TYPE",
      headerName: "Defect Type",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "CREATED_AT",
      headerName: "Created at",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const val = params.row.CREATED_AT;
        if (!val) return "";
        let cleanedStr = String(val);
        const oracleRegex =
          /^(\d{2})-([A-Za-z]{3})-(\d{2})\s+(\d{2})\.(\d{2})\.(\d{2})\.\d+\s+(AM|PM)$/i;
        const match = cleanedStr.match(oracleRegex);
        if (match) {
          const [_, dd, mmm, yy, hh, mm, ss, ampm] = match;
          const d = dayjs(`${dd} ${mmm} 20${yy} ${hh}:${mm}:${ss} ${ampm}`);
          if (d.isValid()) return d.format("HH:mm:ss DD/MM/YYYY");
        }
        const normalD = dayjs(val);
        if (normalD.isValid()) return normalD.format("HH:mm:ss DD/MM/YYYY");
        return val;
      },
    },
    {
      field: "PATH",
      headerName: "Image",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          component="img"
          src={`${baseURL}/${params.row.PATH}`}
          alt="defect"
          loading="lazy"
          onClick={() => handleImageClick(`${baseURL}/${params.row.PATH}`)}
          style={{
            width: 160,
            height: 80,
            objectFit: "cover",
            borderRadius: 8,
            cursor: "pointer",
          }}
        />
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      minWidth: 50,
      headerAlign: "center",
      align: "center",
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
              title="Download"
              onClick={() => handleDownload(row.path)}
              sx={{
                minWidth: "unset",
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "#e2e8f0",
                "&:hover": { backgroundColor: "rgba(59, 130, 246, 0.4)", color: "#fff" },
                borderRadius: "8px"
              }}
              size="small"
            >
              <Download sx={{ fontSize: "1rem" }} />
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
    <Box sx={{ color: "#e2e8f0", p: { xs: 1, md: 3 }, minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      {/* Background glowing effects for extra high-tech feel */}
      <Box sx={{
        position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(15,17,26,0) 70%)',
        zIndex: 0, pointerEvents: 'none'
      }} />
      <Box sx={{
        position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%',
        background: 'radial-gradient(circle, rgba(244,63,94,0.1) 0%, rgba(15,17,26,0) 70%)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      <Grid container columns={12} spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
        {/* Banner / Title */}
        <Grid item xs={12} size={12}>
          <Box sx={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            p: 2.5, borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)"
          }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#fff", display: 'flex', alignItems: 'center', gap: 1.5, letterSpacing: '0.5px' }}>
              <FolderSpecialRounded sx={{ color: "#3b82f6", fontSize: 32 }} />
              AOI Defect Dashboard
            </Typography>
            <Chip
              icon={<TrendingUp sx={{ color: '#10b981 !important' }} />}
              label="Real-time Monitoring"
              sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 600, border: '1px solid rgba(16, 185, 129, 0.2)' }}
            />
          </Box>
        </Grid>

        {/* KPIs */}
        <Grid container item xs={12} spacing={3} justifyContent="center" size={12}>
          {/* TotaL Inspections */}
          <Grid item xs={12} md={4} size={{ xs: 12, md: 4 }}>
            <Box sx={{
              p: 3, borderRadius: "20px", height: "100%",
              background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
              boxShadow: "0 10px 30px -5px rgba(59, 130, 246, 0.4)",
              position: 'relative', overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: "0 15px 35px -5px rgba(59, 130, 246, 0.6)" }
            }}>
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem", fontWeight: 600, mb: 1 }}>Total Inspections</Typography>
                <Typography sx={{ color: "#fff", fontSize: "2.5rem", fontWeight: 800 }}>{kpis.totalInspections.toLocaleString()}</Typography>
              </Box>
              <Search sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: "140px", color: "rgba(255,255,255,0.15)", transform: 'rotate(-15deg)', zIndex: 1 }} />
            </Box>
          </Grid>

          {/* Total Defects */}
          <Grid item xs={12} md={4} size={{ xs: 12, md: 4 }}>
            <Box sx={{
              p: 3, borderRadius: "20px", height: "100%",
              background: "linear-gradient(135deg, #be123c 0%, #f43f5e 100%)",
              boxShadow: "0 10px 30px -5px rgba(244, 63, 94, 0.4)",
              position: 'relative', overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: "0 15px 35px -5px rgba(244, 63, 94, 0.6)" }
            }}>
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem", fontWeight: 600, mb: 1 }}>Total Defects</Typography>
                <Typography sx={{ color: "#fff", fontSize: "2.5rem", fontWeight: 800 }}>{kpis.totalDefects.toLocaleString()}</Typography>
              </Box>
              <WarningAmberRounded sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: "140px", color: "rgba(255,255,255,0.15)", transform: 'rotate(10deg)', zIndex: 1 }} />
            </Box>
          </Grid>

          {/* Defect Rate */}
          <Grid item xs={12} md={4} size={{ xs: 12, md: 4 }}>
            <Box sx={{
              p: 2, borderRadius: "20px", height: "100%",
              background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 10px 30px -5px rgba(0,0,0,0.3)",
              display: 'flex', flexDirection: 'column',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-5px)' }
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography sx={{ color: "#94a3b8", fontSize: "1rem", fontWeight: 600 }}>Defect Rate</Typography>
                <Chip size="small" label={delta >= 0 ? `+${delta}%` : `${delta}%`} sx={{ bgcolor: delta >= 0 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: delta >= 0 ? '#f43f5e' : '#10b981', fontWeight: 'bold' }} />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Typography sx={{ fontSize: "2.5rem", fontWeight: 900, color: "#f87171", lineHeight: 1 }}>
                  {kpis.defectRate.toFixed(2)}%
                </Typography>
                <TrendingUp sx={{ color: "#f87171", fontSize: "2rem" }} />
              </Box>

              <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <Box sx={{ width: "100%", height: 50, display: 'flex', justifyContent: 'center' }}>
                  <Sparkline data={trend} width={300} height={50} stroke="#f87171" />
                </Box>
                <Typography sx={{ color: "#64748b", fontSize: "0.85rem", mt: 1, textAlign: 'right' }}>
                  Last week: {kpis.lastWeekRate.toFixed(2)}%
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* DataGrid */}
        <Grid item xs={12} size={12}>
          <Box sx={{
            p: 2.5, borderRadius: "20px",
            background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
          }}>
            <Typography variant="h6" sx={{ color: "#e2e8f0", fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilePresentRounded sx={{ color: '#8b5cf6' }} /> Defect Image List
            </Typography>

            <Box sx={{ height: "60vh", width: "100%" }}>
              <DataGrid
                rows={rowsWithId || []}
                getRowHeight={() => "auto"}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10 },
                  },
                }}
                pageSizeOptions={[10]}
                disableRowSelectionOnClick
                sx={{
                  height: "100%",
                  border: 'none',
                  color: '#e2e8f0',
                  "& .MuiDataGrid-columnHeaders": {
                    // backgroundColor: "rgba(255,255,255,0.05)",
                    // borderBottom: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                  },
                  // "& .MuiDataGrid-columnHeader": {
                  //   backgroundColor: "transparent",
                  // },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    py: 1.5,
                    alignItems: "center",
                    color: "#cbd5e1"
                  },
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "rgba(255,255,255,0.04)",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    color: "#cbd5e1",
                  },
                  "& .MuiTablePagination-root": {
                    color: "#cbd5e1",
                  },
                  "& .MuiTablePagination-selectIcon": {
                    color: "#cbd5e1",
                  },
                  "& .MuiDataGrid-iconSeparator": {
                    display: "none",
                  }
                }}
              />
            </Box>
          </Box>
        </Grid>

      </Grid>

      {/* Image Modal for Enlarging DataGrid Image */}
      <Dialog
        open={openImageModal}
        onClose={() => setOpenImageModal(false)}
        maxWidth="lg"
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'hidden'
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: 'blur(15px)',
              backgroundColor: 'rgba(0, 0, 0, 0.7)'
            }
          }
        }}
      >
        <Box sx={{ position: "relative", p: 1, backgroundColor: "transparent" }}>
          <IconButton
            aria-label="close"
            onClick={() => setOpenImageModal(false)}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: "white",
              backgroundColor: "rgba(255,255,255,0.1)",
              backdropFilter: 'blur(10px)',
              zIndex: 10,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease',
            }}
          >
            <Close />
          </IconButton>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Enlarged defect"
              style={{
                maxWidth: "100%",
                maxHeight: "85vh",
                display: "block",
                margin: "0 auto",
                borderRadius: "16px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                border: "1px solid rgba(255,255,255,0.1)"
              }}
            />
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default memo(AoiPicture);

const formatDateTime = (date) => {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");

  return `${year}${month}${day}${hour}${minute}`;
};

const getDefaultTimeRange = () => {
  const now = new Date();

  const start = new Date();
  start.setHours(7, 30, 0, 0);

  // nếu hiện tại < 07:30 → lùi về hôm trước
  if (now < start) {
    start.setDate(start.getDate() - 1);
  }

  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  return {
    dateFrom: formatDateTime(start),
    dateTo: formatDateTime(end),
  };
};

const data2 = {
  Code: "1",
  Message:
    "OK QUERY_YEILD_RATE Q_GROUP_PIVOT: Q_FIELD_SELECT:R.LINE_NAME,R.SECTION_NAME,R.GROUP_NAME,",
  Data: [
    {
      MODEL_NAME: "5605707AT00",
      LINE_NAME: "AP6",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 0.0,
      FAIL_QTY: 1.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 1.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "             .00",
      REPASS_QTY: 0.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "5608407AT00",
      LINE_NAME: "PT1",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 966.0,
      FAIL_QTY: 12.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 978.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "           98.77",
      REPASS_QTY: 0.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "5612369AT00",
      LINE_NAME: "AP3",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 3086.0,
      FAIL_QTY: 0.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 3086.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "          100.00",
      REPASS_QTY: 0.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "5612369AT00",
      LINE_NAME: "AP4",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 480.0,
      FAIL_QTY: 0.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 480.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "          100.00",
      REPASS_QTY: 0.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "6339224AT00",
      LINE_NAME: "AP4",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 5066.0,
      FAIL_QTY: 3.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 5069.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "           99.94",
      REPASS_QTY: 0.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "6345113AT00",
      LINE_NAME: "AP6",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 2374.0,
      FAIL_QTY: 0.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 2374.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "          100.00",
      REPASS_QTY: 0.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "6353191AT00",
      LINE_NAME: "AP6",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 2428.0,
      FAIL_QTY: 131.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 2559.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "           94.88",
      REPASS_QTY: 109.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "BGW620-7001T00",
      LINE_NAME: "AP3",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 1111.0,
      FAIL_QTY: 30.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 1141.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "           97.37",
      REPASS_QTY: 25.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "BGW620-7002T00",
      LINE_NAME: "AP3",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 2131.0,
      FAIL_QTY: 22.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 2153.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "           98.98",
      REPASS_QTY: 19.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "BGW620-7002T00",
      LINE_NAME: "AP4",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 2.0,
      FAIL_QTY: 0.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 2.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "          100.00",
      REPASS_QTY: 0.0,
      REFAIL_QTY: 0.0,
    },
  ],
};
