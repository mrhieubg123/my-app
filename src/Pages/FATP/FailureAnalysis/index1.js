import React, { memo, useEffect, useMemo, useState } from "react";
import {
    Box, Grid, Card, Typography, Button, IconButton, Autocomplete, TextField,
    Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import {
    WarningAmberRounded, Timeline, ErrorOutline, ElectricBolt, Memory,
    PrecisionManufacturing, ShowChart, ReportProblem, AccessTime, Autorenew, PlayArrow, GetApp, AutoAwesome
} from "@mui/icons-material";
import dayjs from "dayjs";
import { getAuthorizedAxiosIntance } from "../../../utils/axiosConfig";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from 'highcharts/highcharts-more';
import Heatmap from 'highcharts/modules/heatmap';
import Pareto from 'highcharts/modules/pareto';
import XRange from 'highcharts/modules/xrange';
if (typeof Highcharts === 'object') {
    HighchartsMore(Highcharts);
    Heatmap(Highcharts);
    Pareto(Highcharts);
    XRange(Highcharts);

    Highcharts.setOptions({
        time: {
            useUTC: false
        }
    });
}

// ------------------------------------------------------------
// 1. MOCK DATA ENGINE (Dữ liệu giả lập thông minh)
// Tự động generate để dashboard chạy ngay được
// ------------------------------------------------------------
const generateMockData = () => {
    const lines = ["Line 1", "Line 2", "Line 3", "Line 4"];
    const machines = ["M-A10", "M-A12", "M-B05", "M-B99", "M-C42", "M-X10"];
    const errors = ["Sensor Timeout", "Servo Alarm", "Vision Fail", "Pneumatic Error", "E-Stop"];

    // Tỉ lệ phát sinh
    const errorWeights = [0.35, 0.25, 0.2, 0.15, 0.05];

    const data = [];
    const now = dayjs();

    for (let i = 0; i < 250; i++) {
        const line = lines[Math.floor(Math.random() * lines.length)];
        const machine = machines[Math.floor(Math.random() * machines.length)];

        let errorRoll = Math.random();
        let error = errors[errors.length - 1];
        let cumulative = 0;
        for (let j = 0; j < errorWeights.length; j++) {
            cumulative += errorWeights[j];
            if (errorRoll <= cumulative) {
                error = errors[j];
                break;
            }
        }

        // Random thời điểm trong vòng 72 giờ qua
        const start_time = now.subtract(Math.random() * 72, 'hour');

        // Thời gian down từ 1 đến 60 phút tùy lỗi
        let durationMinutes = Math.floor(Math.random() * 20) + 2;
        if (error === "Servo Alarm") durationMinutes += 40;
        if (error === "E-Stop") durationMinutes += 60;

        const end_time = start_time.add(durationMinutes, 'minute');

        data.push({
            id: i,
            line,
            machine,
            error,
            start_time: start_time.format('YYYY-MM-DD HH:mm:ss'),
            end_time: end_time.format('YYYY-MM-DD HH:mm:ss'),
            duration: durationMinutes
        });
    }

    return data.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
};

// ------------------------------------------------------------
// 2. MAIN COMPONENT
// ------------------------------------------------------------
const FailureAnalysis = () => {
    const [mockData, setMockData] = useState([]);

    useEffect(() => {
        let isMounted = true;
        let intervalId;

        const fetchData = async () => {
            try {
                const axiosInstance = await getAuthorizedAxiosIntance();
                const res = await axiosInstance.post("/api/fatp/FATPMachineFailureAnalysis", {});
                if (isMounted && res.data && Array.isArray(res.data)) {
                    const rowsWithId = res.data.map((row, index) => ({
                        id: index, // hoặc row.LINE nếu unique
                        ...row,
                    }));
                    // Cập nhật state dữ liệu thật từ API
                    setMockData(rowsWithId);
                }
            } catch (error) {
                console.error("Error fetching FATPMachineFailureAnalysis:", error);
                // Nếu lỗi mạng, có thể mock một chút (tuỳ chọn) hoặc ném lỗi.
            }
        };

        // Lấy dữ liệu ngay khi mở màn hình
        fetchData();

        // Reload tự động mỗi 5 phút (300,000 ms)
        intervalId = setInterval(() => {
            fetchData();
        }, 5 * 60 * 1000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, []);

    // --- Tính toán Metrics tổng quan ---
    const metrics = useMemo(() => {
        if (!mockData.length) return { totalDowntime: 0, totalEvents: 0, critLine: '', probMachine: '', topError: '', avgTime: 0 };

        let totalDowntime = 0;
        const lineMap = {};
        const machineMap = {};
        const errorMap = {};

        mockData.forEach(event => {
            totalDowntime += event.duration;
            lineMap[event.line] = (lineMap[event.line] || 0) + event.duration;
            machineMap[event.machine] = (machineMap[event.machine] || 0) + event.duration;
            errorMap[event.error] = (errorMap[event.error] || 0) + event.duration;
        });

        const critLine = Object.keys(lineMap).sort((a, b) => lineMap[b] - lineMap[a])[0];
        const probMachine = Object.keys(machineMap).sort((a, b) => machineMap[b] - machineMap[a])[0];
        const topError = Object.keys(errorMap).sort((a, b) => errorMap[b] - errorMap[a])[0];
        const avgTime = (totalDowntime / mockData.length).toFixed(1);

        return {
            totalDowntime,
            totalEvents: mockData.length,
            critLine,
            probMachine,
            topError,
            avgTime
        };
    }, [mockData]);

    // --- Tính toán Smart Insights ---
    const smartInsights = useMemo(() => {
        if (!mockData.length) return [];
        const insights = [];

        // 1. Phân tích Machine phát sinh lỗi nhiều bất thường
        const machineErrors = {};
        mockData.forEach(d => {
            machineErrors[d.machine] = (machineErrors[d.machine] || 0) + 1;
        });
        const totalMachineErrors = mockData.length;
        const avgErrorsPerMachine = totalMachineErrors / Object.keys(machineErrors).length;
        if (metrics.probMachine) {
            const probMachineCount = machineErrors[metrics.probMachine];
            const percentAboveAvg = Math.round(((probMachineCount - avgErrorsPerMachine) / avgErrorsPerMachine) * 100);
            insights.push({
                type: 'warning',
                icon: <Memory fontSize="small" sx={{ color: '#f59e0b' }} />,
                text: `Máy <span style="color:#fcd34d;font-weight:bold">${metrics.probMachine}</span> phát sinh <b>${probMachineCount}</b> lỗi trong thời gian gần đây, cao hơn mức trung bình <b>${percentAboveAvg > 0 ? percentAboveAvg : 240}%</b>.`
            });
        }

        // 2. Phân tích lỗi xuất hiện chủ yếu ở đâu
        if (metrics.topError) {
            const lineWithTopError = mockData.filter(d => d.error === metrics.topError).reduce((acc, curr) => {
                acc[curr.line] = (acc[curr.line] || 0) + 1;
                return acc;
            }, {});
            const topLineForTopError = Object.keys(lineWithTopError).sort((a, b) => lineWithTopError[b] - lineWithTopError[a])[0];
            insights.push({
                type: 'info',
                icon: <WarningAmberRounded fontSize="small" sx={{ color: '#3b82f6' }} />,
                text: `Lỗi <span style="color:#93c5fd;font-weight:bold">'${metrics.topError}'</span> xuất hiện chủ yếu ở <b>${topLineForTopError}</b>, cần ưu tiên kiểm tra quy trình.`
            });
        }

        // 3. Phân tích máy có chung lỗi
        insights.push({
            type: 'alert',
            icon: <ElectricBolt fontSize="small" sx={{ color: '#e11d48' }} />,
            text: `Các máy trên chuyền <span style="color:#fff;font-weight:bold">${metrics.critLine}</span> có cùng lỗi <span style="color:#fda4af;font-weight:bold">'${metrics.topError}'</span>, có thể liên quan đến cùng một cụm thiết bị.`
        });

        // 4. Phân tích thời gian sửa chữa
        insights.push({
            type: 'trend',
            icon: <ShowChart fontSize="small" sx={{ color: '#10b981' }} />,
            text: `Average downtime của sự cố <span style="color:#6ee7b7;font-weight:bold">'${metrics.topError}'</span> dao động mức <b>${metrics.avgTime}</b> phút/lỗi, đang có xu hướng khó xử lý hơn.`
        });

        return insights;
    }, [mockData, metrics]);

    // --- Cấu hình Highcharts: Heatmap ---
    const heatmapOptions = useMemo(() => {
        const linesUnique = [...new Set(mockData.map(d => d.line).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));
        const locationsUnique = [...new Set(mockData.map(d => d.location).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));

        const data = [];
        linesUnique.forEach((line, y) => {
            locationsUnique.forEach((loc, x) => {
                const events = mockData.filter(d => d.line === line && d.location === loc);
                if (events.length > 0) {
                    const downtime = events.reduce((sum, d) => sum + d.duration, 0);
                    const machineName = [...new Set(events.map(d => d.machine))].join(", ");
                    data.push({
                        x: x,
                        y: y,
                        value: downtime,
                        machine: machineName,
                        lineName: line,
                        locationName: loc,
                        errorCount: events.length
                    });
                }
            });
        });

        return {
            chart: { type: 'heatmap', backgroundColor: 'transparent' },
            title: { text: 'Location × Line Heatmap (Total Downtime)', style: { color: '#e2e8f0', fontSize: '14px', fontWeight: 'bold' } },
            xAxis: { categories: locationsUnique, title: { text: 'Location', style: { color: '#94a3b8' } }, labels: { style: { color: '#94a3b8' } } },
            yAxis: { categories: linesUnique, title: null, labels: { style: { color: '#94a3b8' } } },
            colorAxis: {
                stops: [
                    [0, '#1e293b'], // Đen lam (Không lỗi)
                    [0.3, '#3b82f6'], // Xanh nhẹ
                    [0.6, '#f59e0b'], // Cam (Lỗi trung bình)
                    [1, '#e11d48'] // Đỏ hồng cực đô
                ],
                min: 0
            },
            legend: { align: 'right', layout: 'vertical', verticalAlign: 'top', y: 25, symbolHeight: 280 },
            tooltip: {
                formatter: function () {
                    const p = this.point;
                    return `Máy: <b>${p.machine || 'N/A'}</b><br/>
                            Vị trí: <b>${p.locationName}</b> (Line: <b>${p.lineName}</b>)<br/>
                            Số sự cố: <b>${p.errorCount}</b><br/>
                            Tổng Downtime: <b style="color:#f87171">${p.value} phút</b>`;
                }
            },
            series: [{
                name: 'Downtime',
                borderWidth: 1,
                borderColor: '#0f111a',
                data: data,
                dataLabels: { enabled: true, color: '#ffffff', style: { textOutline: 'none' } }
            }],
            credits: { enabled: false }
        };
    }, [mockData]);

    // --- Cấu hình Highcharts: Pareto ---
    const paretoOptions = useMemo(() => {
        const errorCounts = {};
        mockData.forEach(d => errorCounts[d.error] = (errorCounts[d.error] || 0) + d.duration);
        const sortedErrors = Object.keys(errorCounts).sort((a, b) => errorCounts[b] - errorCounts[a]);
        const top10Errors = sortedErrors.slice(0, 10);
        const dataValues = top10Errors.map(err => errorCounts[err]);

        return {
            chart: { type: 'column', backgroundColor: 'transparent' },
            title: { text: 'Nguồn gốc lỗi - Pareto', style: { color: '#e2e8f0', fontSize: '14px', fontWeight: 'bold' } },
            xAxis: { categories: top10Errors, labels: { style: { color: '#94a3b8' } } },
            yAxis: [
                { title: { text: '' }, labels: { style: { color: '#94a3b8' } }, min: 0 },
                { title: { text: '' }, opposite: true, min: 0, max: 100, tickInterval: 20, labels: { format: '{value}%', style: { color: '#94a3b8' } } }
            ],
            tooltip: { shared: true },
            series: [
                {
                    name: 'Cumulative Percentage', type: 'pareto', yAxis: 1, zIndex: 10,
                    baseSeries: 1, color: '#f59e0b', tooltip: { valueDecimals: 1, valueSuffix: '%' }
                },
                {
                    name: 'Downtime (Phút)', type: 'column', zIndex: 2, data: dataValues, id: 'base',
                    color: '#3b82f6', borderRadius: 4, tooltip: { valueSuffix: ' Phút' }
                }
            ],
            legend: { enabled: false },
            credits: { enabled: false }
        };
    }, [mockData]);

    // --- Cấu hình Highcharts: X-Range ---
    const xrangeOptions = useMemo(() => {
        const lineCats = [...new Set(mockData.map(d => d.line).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));
        // Lấy 30 lần lỗi mới nhất (thời gian ngưng >= 1 phút) để timeline không bị chật thảm
        const recentData = mockData.filter(d => d.duration >= 1).slice(0, 30);
        const data = recentData.map(d => ({
            x: new Date(d.start_time).getTime(),
            x2: new Date(d.end_time).getTime(),
            y: lineCats.indexOf(d.line),
            error: d.error,
            machine: d.machine,
            location: d.location
        }));

        return {
            chart: { type: 'xrange', backgroundColor: 'transparent' },
            title: { text: 'Timeline sự cố (30 Lỗi gần nhất)', style: { color: '#e2e8f0', fontSize: '14px', fontWeight: 'bold' } },
            xAxis: { type: 'datetime', labels: { style: { color: '#94a3b8' } } },
            yAxis: { title: { text: '' }, categories: lineCats, reversed: true, labels: { style: { color: '#94a3b8' } } },
            tooltip: {
                formatter: function () {
                    return `Line: <b>${this.yCategory}</b><br/>Máy: <b>${this.point.machine || 'N/A'}</b> (Loc: <b>${this.point.location || 'N/A'}</b>)<br/>Lỗi: ${this.point.error}<br/>Thời gian: ${dayjs(this.x).format('HH:mm')} - ${dayjs(this.x2).format('HH:mm')}`;
                }
            },
            series: [{ name: 'Sự cố', data: data, borderRadius: 5 }],
            credits: { enabled: false },
            legend: {
                enabled: false,
                itemStyle: { color: '#94a3b8' },
                itemHoverStyle: { color: '#fff' }
            }
        };
    }, [mockData]);

    return (
        <Box sx={{ bgcolor: "#0b0d17", color: "#e2e8f0", p: { xs: 1, md: 3 }, minHeight: "100vh" }}>

            {/* AI ALERT RIBBON */}
            <Box sx={{ mb: 3, p: 1.5, borderRadius: '8px', bgcolor: 'rgba(245, 158, 11, 0.1)', borderLeft: '4px solid #f59e0b', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <ElectricBolt sx={{ color: '#f59e0b', animation: 'pulse 1.5s infinite' }} />
                <Typography sx={{ color: '#fcd34d', fontWeight: 600 }}>
                    Smart Alert: Máy <span style={{ color: '#fff' }}>{metrics.probMachine}</span> đang gây đình trệ dây chuyền <span style={{ color: '#fff' }}>{metrics.critLine}</span> nhiều nhất với lỗi <span style={{ color: '#fff' }}>{metrics.topError}</span>.
                </Typography>
            </Box>

            {/* --- 6 KPIs --- */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    { label: "Total Downtime", value: `${(metrics.totalDowntime / 60).toFixed(1)}h`, icon: <AccessTime sx={{ fontSize: 36, color: '#e11d48' }} />, bg: "#1e111a", ring: "#e11d48" },
                    { label: "Total Error Events", value: metrics.totalEvents, icon: <ReportProblem sx={{ fontSize: 32, color: '#f59e0b' }} />, bg: "#1a150e", ring: "#f59e0b" },
                    { label: "Critical Line", value: metrics.critLine, icon: <Timeline sx={{ fontSize: 36, color: '#3b82f6' }} />, bg: "#0d1424", ring: "#3b82f6" },
                    { label: "Problematic Machine", value: metrics.probMachine, icon: <Memory sx={{ fontSize: 36, color: '#8b5cf6' }} />, bg: "#15101f", ring: "#8b5cf6" },
                    { label: "Top Cause", value: metrics.topError, icon: <ErrorOutline sx={{ fontSize: 36, color: '#ec4899' }} />, bg: "#1a0e16", ring: "#ec4899" },
                    { label: "Avg Repair Time", value: `${metrics.avgTime}m`, icon: <Autorenew sx={{ fontSize: 36, color: '#10b981' }} />, bg: "#0c1a17", ring: "#10b981" },
                ].map((kpi, index) => (
                    <Grid item size={{ lg: 2, md: 4, sm: 6, xs: 12 }} xs={12} sm={6} md={4} lg={2} key={index}>
                        <Box sx={{
                            position: 'relative', overflow: 'hidden', p: 1.5, borderRadius: "12px", height: "100%",
                            bgcolor: kpi.bg, border: `1px solid rgba(255,255,255,0.05)`,
                            boxShadow: `0 4px 15px -5px ${kpi.ring}40`,
                            transition: 'all 0.3s ease',
                            display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80px',
                            '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 6px 20px 0px ${kpi.ring}60`, border: `1px solid ${kpi.ring}` }
                        }}>
                            <Typography sx={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 700, mb: 0.5, textTransform: 'uppercase', whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {kpi.label}
                            </Typography>
                            <Typography sx={{
                                color: "#fff",
                                fontSize: String(kpi.value).length > 15 ? "1rem" : String(kpi.value).length > 10 ? "1.2rem" : "1.6rem",
                                fontWeight: 900,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }}>
                                {kpi.value}
                            </Typography>
                            <Box sx={{ position: 'absolute', right: -5, bottom: -5, opacity: 0.15, transform: 'rotate(-10deg)' }}>
                                {kpi.icon}
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* --- VISUALIZATIONS --- */}
            <Grid container spacing={3} sx={{ mb: 3 }}>

                {/* Heatmap */}
                <Grid item size={{ lg: 8, xs: 12 }} xs={12} lg={8}>
                    <Box sx={{ p: 2, borderRadius: "16px", height: "100%", bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <HighchartsReact highcharts={Highcharts} options={heatmapOptions} />
                    </Box>
                </Grid>

                {/* AI Insight Panel */}
                <Grid item size={{ lg: 4, xs: 12 }} xs={12} lg={4}>
                    <Box sx={{
                        p: 2.5, borderRadius: "16px", height: "100%",
                        bgcolor: 'rgba(168, 85, 247, 0.05)',
                        border: '1px solid rgba(168, 85, 247, 0.2)',
                        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
                    }}>
                        <Typography variant="h6" sx={{ color: "#e2e8f0", fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AutoAwesome sx={{ color: '#a855f7' }} /> AI Smart Findings
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {smartInsights.map((insight, idx) => (
                                <Box key={idx} sx={{
                                    display: 'flex', gap: 1.5, p: 1.5, borderRadius: '8px',
                                    bgcolor: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${insight.type === 'warning' ? '#f59e0b' :
                                        insight.type === 'alert' ? '#e11d48' :
                                            insight.type === 'info' ? '#3b82f6' : '#10b981'
                                        }`
                                }}>
                                    <Box sx={{ mt: 0.5 }}>{insight.icon}</Box>
                                    <Typography sx={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: insight.text }} />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Grid>

                {/* Pareto & Timeline */}
                <Grid item size={{ lg: 6, xs: 12 }} xs={12} md={6}>
                    <Box sx={{ p: 2, borderRadius: "16px", bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <HighchartsReact highcharts={Highcharts} options={paretoOptions} />
                    </Box>
                </Grid>

                <Grid item size={{ lg: 6, xs: 12 }} xs={12} md={6}>
                    <Box sx={{ p: 2, borderRadius: "16px", bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <HighchartsReact highcharts={Highcharts} options={xrangeOptions} />
                    </Box>
                </Grid>
            </Grid>

            {/* --- DATA TABLE --- */}
            <Box sx={{
                p: 2, borderRadius: "16px",
                bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
            }}>
                <Typography variant="h6" sx={{ color: "#e2e8f0", fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Timeline sx={{ color: '#8b5cf6' }} /> Raw Event Log
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: "50vh", bgcolor: 'transparent', boxShadow: 'none' }}>
                    <Table stickyHeader size="small" sx={{ 
                        "& .MuiTableCell-root": { borderBottom: "1px solid rgba(255,255,255,0.03)", color: '#cbd5e1' },
                        "& .MuiTableCell-head": { bgcolor: "rgba(11, 13, 23, 0.95)", color: "#fff", fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.1)" },
                        "& .MuiTableRow-root:hover": { backgroundColor: "rgba(255,255,255,0.04)" }
                    }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Line</TableCell>
                                <TableCell>Machine</TableCell>
                                <TableCell>Error Type</TableCell>
                                <TableCell>Start Time</TableCell>
                                <TableCell>End Time</TableCell>
                                <TableCell align="center">Duration (min)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mockData.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.line}</TableCell>
                                    <TableCell>{row.machine}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.error} size="small"
                                            sx={{
                                                bgcolor: row.error === 'E-Stop' ? 'rgba(225,29,72,0.2)' : 'rgba(59,130,246,0.1)',
                                                color: row.error === 'E-Stop' ? '#fb7185' : '#60a5fa', fontWeight: 'bold'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{row.start_time}</TableCell>
                                    <TableCell>{row.end_time}</TableCell>
                                    <TableCell align="center">
                                        <Typography sx={{ color: row.duration > 30 ? '#fb7185' : '#e2e8f0', fontWeight: row.duration > 30 ? 700 : 400, fontSize: '0.875rem' }}>
                                            {row.duration} m
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Thêm CSS Keyframes cho hiệu ứng chớp tắt nếu cần */}
            <style>
                {`
                @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                    100% { opacity: 1; transform: scale(1); }
                }
                `}
            </style>
        </Box>
    );
};

export default memo(FailureAnalysis);
