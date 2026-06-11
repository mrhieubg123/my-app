import React, { memo, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  Box,
  Grid,
  Typography,
  Button,
  Dialog,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
} from "@mui/material";
import { getAuthorizedAxiosIntance } from "../../../utils/axiosConfig";
import {
  FolderSpecialRounded, FilePresentRounded,
  Search,
  Download,
  TrendingUp,
  Close,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const axiosInstance = await getAuthorizedAxiosIntance();
const API = "/api/files";

const AoiPicture = () => {
  const paramState = useSelector((state) => state.param);
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
    setFiles(data);
    return;
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

  const totalPass = dataYeildRate.reduce(
    (sum, item) => sum + (item.PASS_QTY || 0),
    0,
  );

  const totalFail = dataYeildRate.reduce(
    (sum, item) => sum + (item.FAIL_QTY || 0),
    0,
  );

  const avgYield = totalOutput > 0 ? (totalPass / totalOutput) * 100 : 100;

  const activeLines = useMemo(() => {
    const lines = new Set(dataYeildRate.map((item) => item.LINE_NAME).filter(Boolean));
    return lines.size;
  }, [dataYeildRate]);

  const activeModels = useMemo(() => {
    const models = new Set(dataYeildRate.map((item) => item.MODEL_NAME).filter(Boolean));
    return models.size;
  }, [dataYeildRate]);

  const kpis = {
    totalInspections: totalOutput,
    totalDefects: files.length,
    defectRate: totalOutput > 0 ? Number(((files.length / totalOutput) * 100).toFixed(2)) : 0,
    lastWeekRate: 4.15,
    totalPass: totalPass,
    totalFail: totalFail,
    avgYieldRate: avgYield,
    activeLines,
    activeModels,
  };

  const trend = [3.9, 4.05, 4.12, 4.18, 4.32, 4.31, 4.43];

  const delta = Number((kpis.defectRate - kpis.lastWeekRate).toFixed(2));

  // Group yield rate data by LINE_NAME
  const lineData = useMemo(() => {
    const grouped = {};
    dataYeildRate.forEach((item) => {
      const line = item.LINE_NAME || "Unknown";
      if (!grouped[line]) {
        grouped[line] = { pass: 0, total: 0 };
      }
      grouped[line].pass += item.PASS_QTY || 0;
      grouped[line].total += item.TOTAL_QTY || 0;
    });
    return Object.entries(grouped).map(([line, val]) => {
      const rate = val.total > 0 ? (val.pass / val.total) * 100 : 100;
      return {
        line,
        rate: Number(rate.toFixed(2)),
        total: val.total,
      };
    }).sort((a, b) => b.total - a.total);
  }, [dataYeildRate]);

  const lineQualityChartOptions = useMemo(() => {
    return {
      chart: {
        backgroundColor: "#ffffff00",
        type: "column",
        style: { fontFamily: "Inter, Roboto, sans-serif" }
      },
      title: {
        text: "Line Production & Yield Rate Comparison",
        style: { color: "#fff", fontSize: "14px", fontWeight: "bold" }
      },
      xAxis: {
        categories: lineData.map((d) => d.line),
        labels: { style: { color: "#cbd5e1" } },
        lineColor: "rgba(255,255,255,0.1)",
        tickColor: "rgba(255,255,255,0.1)"
      },
      yAxis: [
        {
          title: { text: "Yield Rate (%)", style: { color: "#10b981" } },
          labels: { style: { color: "#10b981" }, format: "{value}%" },
          min: 0,
          max: 100,
          gridLineColor: "rgba(255,255,255,0.05)"
        },
        {
          title: { text: "Total Production Qty", style: { color: "#3b82f6" } },
          labels: { style: { color: "#3b82f6" } },
          opposite: true,
          gridLineColor: "rgba(255,255,255,0.05)"
        }
      ],
      tooltip: {
        shared: true,
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        borderColor: "rgba(255,255,255,0.1)",
        style: { color: "#fff" }
      },
      legend: {
        itemStyle: { color: "#cbd5e1" },
        itemHoverStyle: { color: "#fff" }
      },
      series: [
        {
          name: "Total Qty",
          type: "column",
          yAxis: 1,
          data: lineData.map((d) => d.total),
          color: "rgba(59, 130, 246, 0.75)",
          borderRadius: 4
        },
        {
          name: "Yield Rate",
          type: "spline",
          yAxis: 0,
          data: lineData.map((d) => d.rate),
          color: "#10b981",
          tooltip: { valueSuffix: "%" },
          marker: { lineWidth: 2, lineColor: "#10b981", fillColor: "#fff" }
        }
      ],
      credits: { enabled: false }
    };
  }, [lineData]);

  // Group defect pictures by TYPE
  const defectTypesData = useMemo(() => {
    const counts = {};
    files.forEach((file) => {
      const typeVal = file.TYPE || file.error || "Unknown Defect";
      if (typeof typeVal === "string") {
        typeVal.split(";").forEach((t) => {
          const cleanType = t.trim();
          if (cleanType) {
            counts[cleanType] = (counts[cleanType] || 0) + 1;
          }
        });
      } else {
        counts[typeVal] = (counts[typeVal] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, y]) => ({ name, y })).sort((a, b) => b.y - a.y);
  }, [files]);

  const defectPieChartOptions = useMemo(() => {
    return {
      chart: {
        backgroundColor: "#ffffff00",
        type: "pie",
        style: { fontFamily: "Inter, Roboto, sans-serif" }
      },
      title: {
        text: "Defect Type Distribution",
        style: { color: "#fff", fontSize: "14px", fontWeight: "bold" }
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)",
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        borderColor: "rgba(255,255,255,0.1)",
        style: { color: "#fff" }
      },
      plotOptions: {
        pie: {
          innerSize: "60%",
          depth: 45,
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "{point.name}: {point.percentage:.1f}%",
            style: { color: "#cbd5e1", textOutline: "none", fontSize: "10px" }
          },
          showInLegend: true
        }
      },
      legend: {
        itemStyle: { color: "#cbd5e1" },
        itemHoverStyle: { color: "#fff" }
      },
      series: [
        {
          name: "Defect Count",
          data: defectTypesData.length > 0 ? defectTypesData : [{ name: "No Defects", y: 0 }],
          colors: ["#f43f5e", "#fbbf24", "#3b82f6", "#a855f7", "#06b6d4", "#10b981"]
        }
      ],
      credits: { enabled: false }
    };
  }, [defectTypesData]);

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
          {/* Total Inspections & Pass/Fail */}
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
                <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem", fontWeight: 600, mb: 1 }}>Total Inspections</Typography>
                <Typography sx={{ color: "#fff", fontSize: "2.2rem", fontWeight: 800, mb: 1.5 }}>
                  {kpis.totalInspections.toLocaleString()} <span style={{ fontSize: "1.1rem", fontWeight: 500 }}>pcs</span>
                </Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", fontWeight: 600 }}>PASS</Typography>
                    <Typography sx={{ color: "#45f3ff", fontSize: "1.2rem", fontWeight: 800 }}>{kpis.totalPass.toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", fontWeight: 600 }}>FAIL</Typography>
                    <Typography sx={{ color: "#ff4d4d", fontSize: "1.2rem", fontWeight: 800 }}>{kpis.totalFail.toLocaleString()}</Typography>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={kpis.avgYieldRate}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: "rgba(255,255,255,0.15)",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "#10b981"
                      }
                    }}
                  />
                </Box>
              </Box>
              <Search sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: "140px", color: "rgba(255,255,255,0.1)", transform: 'rotate(-15deg)', zIndex: 1 }} />
            </Box>
          </Grid>

          {/* Average Yield Rate */}
          <Grid item xs={12} md={4} size={{ xs: 12, md: 4 }}>
            <Box sx={{
              p: 3, borderRadius: "20px", height: "100%",
              background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)",
              boxShadow: "0 10px 30px -5px rgba(124, 58, 237, 0.4)",
              position: 'relative', overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: "0 15px 35px -5px rgba(124, 58, 237, 0.6)" }
            }}>
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem", fontWeight: 600, mb: 1 }}>Average Yield Rate</Typography>
                <Typography sx={{ color: "#fff", fontSize: "2.5rem", fontWeight: 900, mb: 1 }}>
                  {kpis.avgYieldRate.toFixed(2)}%
                </Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", fontWeight: 600 }}>Active Lines</Typography>
                    <Typography sx={{ color: "#fff", fontSize: "1.8rem", fontWeight: 800 }}>{kpis.activeLines}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", fontWeight: 600 }}>Active Models</Typography>
                    <Typography sx={{ color: "#fff", fontSize: "1.8rem", fontWeight: 800 }}>{kpis.activeModels}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <TrendingUp sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: "140px", color: "rgba(255,255,255,0.1)", transform: 'rotate(15deg)', zIndex: 1 }} />
            </Box>
          </Grid>

          {/* Uploaded Defect Rate */}
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
                <Typography sx={{ color: "#94a3b8", fontSize: "1rem", fontWeight: 600 }}>Defect Rate (Uploads)</Typography>
                <Chip size="small" label={delta >= 0 ? `+${delta}%` : `${delta}%`} sx={{ bgcolor: delta >= 0 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: delta >= 0 ? '#f43f5e' : '#10b981', fontWeight: 'bold' }} />
              </Box>

              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1 }}>
                <Typography sx={{ fontSize: "2.2rem", fontWeight: 900, color: "#f87171", lineHeight: 1 }}>
                  {kpis.defectRate.toFixed(2)}%
                </Typography>
                <Typography sx={{ color: "#94a3b8", fontSize: "0.95rem" }}>
                  ({kpis.totalDefects} images)
                </Typography>
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

        {/* Highcharts Analytics Row */}
        <Grid item xs={12} md={7} size={{ xs: 12, md: 7 }}>
          <Box sx={{
            p: 3, borderRadius: "20px", height: "450px",
            background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 10px 30px -5px rgba(0,0,0,0.3)",
          }}>
            <HighchartsReact highcharts={Highcharts} options={lineQualityChartOptions} />
          </Box>
        </Grid>

        <Grid item xs={12} md={5} size={{ xs: 12, md: 5 }}>
          <Box sx={{
            p: 3, borderRadius: "20px", height: "450px",
            background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 10px 30px -5px rgba(0,0,0,0.3)",
          }}>
            <HighchartsReact highcharts={Highcharts} options={defectPieChartOptions} />
          </Box>
        </Grid>

        {/* Detailed Yield Rate Table */}
        <Grid item xs={12} size={12}>
          <Box sx={{
            p: 3, borderRadius: "20px",
            background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 10px 30px -5px rgba(0,0,0,0.3)",
          }}>
            <Typography variant="h6" sx={{ color: "#e2e8f0", fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp sx={{ color: '#10b981' }} /> Detailed Yield Rate by Line & Model
            </Typography>

            <TableContainer component={Paper} sx={{
              maxHeight: "350px",
              backgroundColor: "transparent",
              backgroundImage: "none",
              boxShadow: "none",
              overflow: "auto",
              "&::-webkit-scrollbar": { width: 4, height: 6 },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: "10px",
              },
            }}>
              <Table stickyHeader aria-label="yield rate table" sx={{ borderCollapse: "separate", borderSpacing: "0 4px" }}>
                <TableHead>
                  <TableRow sx={{
                    "& th": {
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      fontWeight: 700,
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      fontSize: "0.85rem",
                    }
                  }}>
                    <TableCell align="center">Line</TableCell>
                    <TableCell align="left">Model Name</TableCell>
                    <TableCell align="center">Pass Qty / Total Qty</TableCell>
                    <TableCell align="center">Fail Qty</TableCell>
                    <TableCell align="center">Yield Rate</TableCell>
                    <TableCell align="center" style={{ width: "250px" }}>Quality Level</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataYeildRate.map((row, idx) => {
                    const yieldVal = row.TOTAL_QTY > 0 ? (row.PASS_QTY / row.TOTAL_QTY) * 100 : 100;
                    const parsedYield = parseFloat(row.YIELD_RATE) || yieldVal;
                    let progressColor = "#10b981"; // Green (Optimal)
                    if (parsedYield < 98) {
                      progressColor = "#ef4444"; // Red (Critical)
                    } else if (parsedYield < 99) {
                      progressColor = "#fbbf24"; // Yellow (Warning)
                    }

                    return (
                      <TableRow key={idx} sx={{
                        "& td": {
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                          color: "#cbd5e1",
                          py: 1.2,
                        },
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.02)"
                        }
                      }}>
                        <TableCell align="center" sx={{ fontWeight: 700, color: "#3b82f6 !important" }}>{row.LINE_NAME}</TableCell>
                        <TableCell align="left">{row.MODEL_NAME}</TableCell>
                        <TableCell align="center">{row.PASS_QTY} / {row.TOTAL_QTY}</TableCell>
                        <TableCell align="center" sx={{ color: row.FAIL_QTY > 0 ? "#ef4444 !important" : "inherit" }}>
                          {row.FAIL_QTY}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, color: progressColor }}>
                          {parsedYield.toFixed(2)}%
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ flexGrow: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={parsedYield}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: "rgba(255,255,255,0.1)",
                                  "& .MuiLinearProgress-bar": {
                                    bgcolor: progressColor
                                  }
                                }}
                              />
                            </Box>
                            <Chip
                              size="small"
                              label={parsedYield >= 99 ? "Optimal" : parsedYield >= 98 ? "Warning" : "Critical"}
                              sx={{
                                height: "20px",
                                fontSize: "0.75rem",
                                fontWeight: "bold",
                                bgcolor: parsedYield >= 99 ? "rgba(16, 185, 129, 0.15)" : parsedYield >= 98 ? "rgba(251, 191, 36, 0.15)" : "rgba(239, 68, 68, 0.15)",
                                color: progressColor,
                                border: `1px solid ${progressColor}33`
                              }}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
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

const data = [
  {
    "ID": 45,
    "LINE": "T3",
    "TYPE": "ER00",
    "NAME": null,
    "PATH": "uploads/imageAOI/1774000520974_JA021026120002YA_16h55m17_FS1800.JPG",
    "CREATED_AT": "2026-03-20T09:55:21.022Z",
    "FACTORY": "B01",
    "MODEL": "BGW620-7002T00",
    "SN": "JA021026120002YA",
    "SLOT": "FS1800",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 46,
    "LINE": "T3",
    "TYPE": "VI04;VI02",
    "NAME": null,
    "PATH": "uploads/imageAOI/1774010038303_JA021026120002HZ_19h33m53_FS1800_FS1801_XNL.JPG",
    "CREATED_AT": "2026-03-20T12:33:58.351Z",
    "FACTORY": "B01",
    "MODEL": "BGW620-7002T00",
    "SN": "JA021026120002HZ",
    "SLOT": "FS1800;FS1801",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 47,
    "LINE": "T3",
    "TYPE": "VI04;ER00",
    "NAME": null,
    "PATH": "uploads/imageAOI/1774010052535_JA021026120002VN_19h34m8_FS1802_FS1803_XNL.JPG",
    "CREATED_AT": "2026-03-20T12:34:12.582Z",
    "FACTORY": "B01",
    "MODEL": "BGW620-7002T00",
    "SN": "JA021026120002VN",
    "SLOT": "FS1802;FS1803",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 48,
    "LINE": "T3",
    "TYPE": "ER00;VI02;VI04;VI04;VI07",
    "NAME": null,
    "PATH": "uploads/imageAOI/1774010162528_JA0112261200005G_19h35m54_C4302_C5301_PL2003_XNL.JPG",
    "CREATED_AT": "2026-03-20T12:36:02.588Z",
    "FACTORY": "B01",
    "MODEL": "BGW620-7001T00",
    "SN": "JA0112261200005G",
    "SLOT": "C4302;C5301;PL2003;PL2004;PL2006",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 49,
    "LINE": "T3",
    "TYPE": "VI02;VI07;VI07",
    "NAME": null,
    "PATH": "uploads/imageAOI/1774010175421_JA0112261200005F_19h36m9_C4302_J2001_PL2005_XNL.JPG",
    "CREATED_AT": "2026-03-20T12:36:15.483Z",
    "FACTORY": "B01",
    "MODEL": "BGW620-7001T00",
    "SN": "JA0112261200005F",
    "SLOT": "C4302;J2001;PL2005",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 50,
    "LINE": "T3",
    "TYPE": "VI07",
    "NAME": null,
    "PATH": "uploads/imageAOI/1774021868049_JA0112261200006D_22h51m1_C5301_XNL.JPG",
    "CREATED_AT": "2026-03-20T15:51:08.079Z",
    "FACTORY": "B01",
    "MODEL": "BGW620-7001T00",
    "SN": "JA0112261200006D",
    "SLOT": "C5301",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 51,
    "LINE": "T3",
    "TYPE": "ER00",
    "NAME": null,
    "PATH": "uploads/imageAOI/1774031628655_JA021026120002R9_1h33m44_FS1800.JPG",
    "CREATED_AT": "2026-03-20T18:33:48.701Z",
    "FACTORY": "B01",
    "MODEL": "BGW620-7002T00",
    "SN": "JA021026120002R9",
    "SLOT": "FS1800",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 52,
    "LINE": "T3",
    "TYPE": "ER00",
    "NAME": null,
    "PATH": "uploads/imageAOI/1774032099239_JA021026120002ET_1h41m35_FS1803.JPG",
    "CREATED_AT": "2026-03-20T18:41:39.285Z",
    "FACTORY": "B01",
    "MODEL": "BGW620-7002T00",
    "SN": "JA021026120002ET",
    "SLOT": "FS1803",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 53,
    "LINE": "T3",
    "TYPE": "ER00",
    "NAME": null,
    "PATH": "uploads/imageAOI/1774032149049_JA021026120002FQ_1h42m25_FS1803.JPG",
    "CREATED_AT": "2026-03-20T18:42:29.097Z",
    "FACTORY": "B01",
    "MODEL": "BGW620-7002T00",
    "SN": "JA021026120002FQ",
    "SLOT": "FS1803",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 54,
    "LINE": "T3",
    "TYPE": "VI04;VI04",
    "NAME": null,
    "PATH": "uploads/imageAOI/1774039941117_JA01122612000045_3h51m53_PL2003_PL2004_XNL.JPG",
    "CREATED_AT": "2026-03-20T20:52:21.178Z",
    "FACTORY": "B01",
    "MODEL": "BGW620-7001T00",
    "SN": "JA01122612000045",
    "SLOT": "PL2003;PL2004",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 55,
    "LINE": "T3",
    "TYPE": "VI07",
    "NAME": null,
    "PATH": "uploads/imageAOI/1774043095672_JA011226120000XL_4h44m46_BOSA_XNL.JPG",
    "CREATED_AT": "2026-03-20T21:44:55.734Z",
    "FACTORY": "B01",
    "MODEL": "BGW620-7001T00",
    "SN": "JA011226120000XL",
    "SLOT": "BOSA",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 56,
    "LINE": "T3",
    "TYPE": "ER00;ER00;ER00;ER00;ER00;ER00;ER00;ER00;ER00",
    "NAME": null,
    "PATH": "uploads/imageAOI/1774053367116_JA011226120000XG_7h35m59_BOSA_C4302_C5301.JPG",
    "CREATED_AT": "2026-03-21T00:36:07.181Z",
    "FACTORY": "B01",
    "MODEL": "BGW620-7001T00",
    "SN": "JA011226120000XG",
    "SLOT": "BOSA;C4302;C5301;J2001;PL2003;PL2004;PL2005;PL2006;SK1200",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 57,
    "LINE": "T3",
    "TYPE": "ER00;ER00;ER00;ER00;ER00;ER00;ER00",
    "NAME": null,
    "PATH": "uploads/imageAOI/1774053424218_JA011226120000XF_7h36m53_FS1800_FS1801_FS1802.JPG",
    "CREATED_AT": "2026-03-21T00:37:04.267Z",
    "FACTORY": "B01",
    "MODEL": "BGW620-7002T00",
    "SN": "JA011226120000XF",
    "SLOT": "FS1800;FS1801;FS1802;FS1803;J1810;SK200;SW1500",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 58,
    "LINE": "T3",
    "TYPE": "ER00;ER00",
    "NAME": null,
    "PATH": "uploads/imageAOI/1774053677072_JA011226120000T8_7h41m12_PL2003_PL2004.JPG",
    "CREATED_AT": "2026-03-21T00:41:17.135Z",
    "FACTORY": "B01",
    "MODEL": "BGW620-7001T00",
    "SN": "JA011226120000T8",
    "SLOT": "PL2003;PL2004",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 59,
    "LINE": "T3",
    "TYPE": "ER00",
    "NAME": null,
    "PATH": "uploads/imageAOI/1774055817526_JA011226120001F9_8h16m52_BOSA.JPG",
    "CREATED_AT": "2026-03-21T01:16:57.589Z",
    "FACTORY": "B01",
    "MODEL": "BGW620-7001T00",
    "SN": "JA011226120001F9",
    "SLOT": "BOSA",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 60,
    "LINE": "T3",
    "TYPE": "ER00",
    "NAME": null,
    "PATH": "uploads/imageAOI/1774055865579_JA011226120001AI_8h17m41_BOSA.JPG",
    "CREATED_AT": "2026-03-21T01:17:45.637Z",
    "FACTORY": "B01",
    "MODEL": "BGW620-7001T00",
    "SN": "JA011226120001AI",
    "SLOT": "BOSA",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 61,
    "LINE": "T3",
    "TYPE": "ER00",
    "NAME": null,
    "PATH": "uploads/imageAOI/1774055875630_JA011226120001FO_8h17m51_BOSA.JPG",
    "CREATED_AT": "2026-03-21T01:17:55.691Z",
    "FACTORY": "B01",
    "MODEL": "BGW620-7001T00",
    "SN": "JA011226120001FO",
    "SLOT": "BOSA",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 62,
    "LINE": "T3",
    "TYPE": "ER00",
    "NAME": null,
    "PATH": "uploads/imageAOI/1774056904751_JA011226120001CD_8h34m58_PL2003.JPG",
    "CREATED_AT": "2026-03-21T01:35:04.813Z",
    "FACTORY": "B01",
    "MODEL": "BGW620-7001T00",
    "SN": "JA011226120001CD",
    "SLOT": "PL2003",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 63,
    "LINE": "T3",
    "TYPE": "ER00;ER00",
    "NAME": null,
    "PATH": "uploads/imageAOI/1774056917374_JA011226120001CE_8h35m10_C4302_C5301.JPG",
    "CREATED_AT": "2026-03-21T01:35:17.435Z",
    "FACTORY": "B01",
    "MODEL": "BGW620-7001T00",
    "SN": "JA011226120001CE",
    "SLOT": "C4302;C5301",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 64,
    "LINE": "T3",
    "TYPE": "ER00",
    "NAME": null,
    "PATH": "uploads/imageAOI/1774056978909_JA021026120002R3_8h36m11_J1810.JPG",
    "CREATED_AT": "2026-03-21T01:36:18.958Z",
    "FACTORY": "B01",
    "MODEL": "BGW620-7002T00",
    "SN": "JA021026120002R3",
    "SLOT": "J1810",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 44,
    "LINE": "T3",
    "TYPE": "VI04",
    "NAME": null,
    "PATH": "uploads/imageAOI/1773979815357_JA0210261200039H_11h10m10_FS1803_XNL.JPG",
    "CREATED_AT": "2026-03-20T04:10:15.406Z",
    "FACTORY": "B01",
    "MODEL": "BGW620-7002T00",
    "SN": "JA0210261200039H",
    "SLOT": "FS1803",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 41,
    "LINE": "T5",
    "TYPE": "ER00",
    "NAME": null,
    "PATH": "uploads/imageAOI/1773973529033_9h25m29_SK9801.JPG",
    "CREATED_AT": "2026-03-20T02:25:29.083Z",
    "FACTORY": "B01",
    "MODEL": "5605658AT00",
    "SN": "9h25m29",
    "SLOT": "SK9801",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 42,
    "LINE": "T5",
    "TYPE": "ER00;ER00;ER00;ER00;ER00",
    "NAME": null,
    "PATH": "uploads/imageAOI/1773973570990_9h26m11_IR9200_SK2200_SK801.JPG",
    "CREATED_AT": "2026-03-20T02:26:11.043Z",
    "FACTORY": "B01",
    "MODEL": "5605658AT00",
    "SN": "9h26m11",
    "SLOT": "IR9200;SK2200;SK801;SK9801;SW9201",
    "ERROR": null,
    "STATE": null
  },
  {
    "ID": 43,
    "LINE": "T3",
    "TYPE": "ER00",
    "NAME": null,
    "PATH": "uploads/imageAOI/1773974666318_JA021026110003E3_9h44m20_FS1803.JPG",
    "CREATED_AT": "2026-03-20T02:44:26.364Z",
    "FACTORY": "B01",
    "MODEL": "BGW620-7002T00",
    "SN": "JA021026110003E3",
    "SLOT": "FS1803",
    "ERROR": null,
    "STATE": null
  }
];
