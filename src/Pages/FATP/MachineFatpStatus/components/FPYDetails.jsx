import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  CircularProgress,
  Card,
  LinearProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HiBox from "../../../../components/HiBox";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { getAuthorizedAxiosIntance } from "../../../../utils/axiosConfig";
import Drilldown from "highcharts/modules/drilldown";
import MachineOutputDrillChart from "./MachineOutputDrillChart";

Drilldown(Highcharts);

const axiosInstance = await getAuthorizedAxiosIntance();

const FPYDetails = ({
  idata = [],
  selectMachineDetail = { line: "", location: "" },
}) => {
  const theme = useTheme();
  const parentRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });
  const [weeklyData, setWeeklyData] = useState([]);
  const [dataMinCycleTimeAndLatestRow, setDataMinCycleTimeAndLatestRow] =
    useState([]);

  const kpis = {
    totalInspections: 12840,
    totalDefects: 568,
    defectRate: 4.43,
    lastWeekRate: 4.15,
  };

  const trend = [3.9, 4.05, 4.12, 4.18, 4.32, 4.31, 4.43];

  useEffect(() => {
    const updateSize = () => {
      if (parentRef.current) {
        const { width, height } = parentRef.current.getBoundingClientRect();
        setParentSize({ width, height });
      }
    };
    const resizeObserver = new ResizeObserver(updateSize);
    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);
    }
    return () => {
      if (parentRef.current) {
        resizeObserver.unobserve(parentRef.current);
      }
    };
  }, []);

  useEffect(() => {
    console.log("selectMachineDetail", selectMachineDetail);
    fetchMachineHourlyOutputToday();
    fetchMinCycleTimeAndLatestRow();
  }, [selectMachineDetail]);

  const fetchMachineHourlyOutputToday = async () => {
    try {
      const response = await axiosInstance.post(
        "api/Fatp/getMachineWeeklyDrilldownData",
        {
          line: selectMachineDetail.line,
          location: selectMachineDetail.location,
        },
      );
      const data = response.data || [];
      setWeeklyData(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchMinCycleTimeAndLatestRow = async () => {
    try {
      const response = await axiosInstance.post(
        "api/Fatp/getMinCycleTimeAndLatestRow",
        {
          line: selectMachineDetail.line,
          location: selectMachineDetail.location,
        },
      );
      const data = response.data || [];
      setDataMinCycleTimeAndLatestRow(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  /** Sparkline nhỏ bằng SVG (không cần chart lib) */
  function Sparkline({
    data = [],
    width = 300,
    height = 110,
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

  const getTodayAndYesterdayFailRate = (weeklyData) => {
    if (!weeklyData || weeklyData.length === 0) {
      return {
        outputToday: 0,
        today: 0,
        yesterday: 0,
      };
    }

    const formatDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const today = new Date();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(today.getDate() - 1);

    const todayStr = formatDate(today);
    const yesterdayStr = formatDate(yesterdayDate);

    let todayFailRate = 0;
    let yesterdayFailRate = 0;
    let outputToday = 0;

    // duyệt toàn bộ weeks → days
    for (const week of weeklyData) {
      for (const day of week.days || []) {
        if (day.day === todayStr) {
          todayFailRate = day.failRate || 0;
          outputToday = day.value || 0;
        }
        if (day.day === yesterdayStr) {
          yesterdayFailRate = day.failRate || 0;
        }
      }
    }

    return {
      outputToday: outputToday,
      today: Number((100 - (todayFailRate || 0) * 100).toFixed(2)),
      yesterday: Number((100 - (yesterdayFailRate || 0) * 100).toFixed(2)),
    };
  };

  const { outputToday, today, yesterday } =
    getTodayAndYesterdayFailRate(weeklyData);

  const targetToday = 1500;

  const delta = Number((today - yesterday).toFixed(2));

  return (
    <Box sx={{ position: "relative", height: "100%" }}>
      <Grid container columns={12}>
        <HiBox
          lg={4}
          md={4}
          xs={12}
          alarn={false}
          header="FPY"
          height="30vh"
          variant="filled"
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              gap: { xs: 0.5, sm: 1 },
              py: { xs: 1, sm: 0 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                sx={{
                  fontSize: "clamp(32px, 4vw, 44px)",
                  fontWeight: 700,
                  color: "error.main",
                  lineHeight: 1,
                }}
              >
                {today}%
              </Typography>
              <TrendingUpIcon
                sx={{
                  color: "error.main",
                  fontSize: "clamp(28px, 3.5vw, 36px)",
                }}
              />
            </Box>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                my: { xs: 0.5, sm: 1 },
              }}
            >
              <Box sx={{ width: "100%", maxWidth: 250, px: 2 }}>
                <Sparkline
                  data={trend}
                  width={250}
                  height={60}
                  stroke="#ff4d4f"
                />
              </Box>
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: "clamp(12px, 1.5vw, 14px)",
              }}
            >
              Last day: {yesterday}%
              <Box
                component="span"
                sx={{
                  color: delta >= 0 ? "error.main" : "success.main",
                  fontWeight: "bold",
                }}
              >
                {delta >= 0 ? `(+${delta}%)` : `(${delta}%)`}
              </Box>
            </Typography>
          </Box>
        </HiBox>

        <HiBox
          lg={4}
          md={4}
          xs={12}
          alarn={false}
          header="Cycle Time"
          height="30vh"
          variant="filled"
        >
          {(() => {
            const currentCT = 24.24 ?? Number(
              (dataMinCycleTimeAndLatestRow?.latestCreatedAtRow?.CYCLE_TIME || 0).toFixed(2)
            );
            const bestCT = 24.22 ?? Number(
              (dataMinCycleTimeAndLatestRow?.minCycleTimeRow?.CYCLE_TIME || 0).toFixed(2)
            );
            const ratio = currentCT > 0 ? Math.min((bestCT / currentCT) * 100, 100) : 0;

            return (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  gap: { xs: 1, sm: 2 },
                  py: { xs: 1, sm: 0 },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    display: "inline-flex",
                    transform: {
                      xs: "scale(0.8)",
                      sm: "scale(0.9)",
                      md: "scale(1)",
                    },
                  }}
                >
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={140}
                    thickness={5}
                    sx={{
                      color:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.05)",
                      position: "absolute",
                    }}
                  />
                  <>
                    <svg width="0" height="0" style={{ position: "absolute" }}>
                      <defs>
                        <linearGradient id="cycle-time-success" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#00e676" />
                          <stop offset="100%" stopColor="#69f0ae" />
                        </linearGradient>
                        <linearGradient id="cycle-time-warning" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ffc107" />
                          <stop offset="100%" stopColor="#ffd54f" />
                        </linearGradient>
                        <linearGradient id="cycle-time-error" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ff1744" />
                          <stop offset="100%" stopColor="#ff8a80" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <CircularProgress
                      variant="determinate"
                      value={ratio}
                      size={140}
                      thickness={5}
                      sx={{
                        "& .MuiCircularProgress-circle": {
                          stroke: `url(#${ratio >= 95 ? "cycle-time-success" : ratio >= 80 ? "cycle-time-warning" : "cycle-time-error"})`,
                          strokeLinecap: "round"
                        }
                      }}
                    />
                  </>

                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography sx={{ fontSize: "11px", fontWeight: "bold", color: "text.secondary", textTransform: "uppercase", letterSpacing: 1, mb: -0.5 }}>
                      Current
                    </Typography>
                    <Typography
                      sx={{ fontSize: 32, fontWeight: 700, color: ratio >= 95 ? "#00e676" : ratio >= 80 ? "warning.main" : "error.main" }}
                    >
                      {currentCT}
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "clamp(16px, 2vw, 20px)",
                          fontWeight: "normal",
                          ml: 0.5
                        }}
                      >
                        s
                      </Typography>
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: { xs: -1, sm: 0 }, bgcolor: theme.palette.mode === "dark" ? "rgba(0,230,118,0.1)" : "rgba(0,230,118,0.05)", px: 1.5, py: 0.5, borderRadius: 2, border: "1px solid", borderColor: theme.palette.mode === "dark" ? "rgba(0,230,118,0.3)" : "rgba(0,230,118,0.2)" }}>
                  <Typography sx={{ fontSize: 16 }}>🏆</Typography>
                  <Typography
                    sx={{
                      fontSize: "clamp(12px, 1.5vw, 14px)",
                      color: "text.secondary",
                      display: "flex",
                      alignItems: "center",
                      gap: 1
                    }}
                  >
                    Best Time:{" "}
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: "bold",
                        color: "#00e676",
                        fontSize: "inherit",
                      }}
                    >
                      {bestCT} s
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            );
          })()}
        </HiBox>

        <HiBox
          lg={4}
          md={4}
          xs={12}
          alarn={false}
          header="Output"
          height="30vh"
          variant="filled"
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
              px: { xs: 2, sm: 4, md: 6 },
              py: { xs: 1, sm: 0 },
            }}
          >
            <Typography
              sx={{
                fontSize: "clamp(32px, 4vw, 44px)",
                fontWeight: 700,
                color: "#2196f3",
                lineHeight: 1,
              }}
            >
              {outputToday}
              <Typography
                component="span"
                sx={{
                  fontSize: "clamp(18px, 2vw, 22px)",
                  color: "text.secondary",
                  fontWeight: "normal",
                }}
              >
                {" pcs"}
              </Typography>
            </Typography>

            <Box
              sx={{
                width: "100%",
                mt: { xs: 1, sm: 2 },
                mb: 1,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "clamp(12px, 1.5vw, 14px)" }}
              >
                Progress
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  color: "#2196f3",
                  fontSize: "clamp(12px, 1.5vw, 14px)",
                }}
              >
                {Number((((outputToday || 0) / targetToday) * 100).toFixed(2))}%
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={Number(
                (((outputToday || 0) / targetToday) * 100).toFixed(2),
              )}
              sx={{
                width: "100%",
                height: { xs: 8, sm: 10 },
                borderRadius: 5,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 5,
                  backgroundColor: "#2196f3",
                },
              }}
            />

            <Box
              sx={{
                width: "100%",
                mt: 1,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "clamp(10px, 1.2vw, 12px)" }}
              >
                Target: {Number(targetToday).toLocaleString("en-US")}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "clamp(10px, 1.2vw, 12px)" }}
              >
                Remaining:{" "}
                {Number(targetToday - (outputToday || 0)).toLocaleString(
                  "en-US",
                )}
              </Typography>
            </Box>
          </Box>
        </HiBox>
        <HiBox
          lg={12}
          md={12}
          xs={12}
          alarn={false}
          header="Capacity"
          height="42vh"
          variant="filled"
        >
          <div ref={parentRef} style={{ height: "90%", display: "block" }}>
            {/* <HighchartsReact highcharts={Highcharts} options={options} /> */}
            <MachineOutputDrillChart
              weeklyData={weeklyData}
              parentSize={parentSize}
              theme={theme}
            />
          </div>
        </HiBox>
      </Grid>
    </Box>
  );
};

export default React.memo(FPYDetails);
