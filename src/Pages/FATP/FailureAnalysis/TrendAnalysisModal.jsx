import React, { useEffect, useMemo, useState } from "react";
import { Button, Chip, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { GetApp } from "@mui/icons-material";
import dayjs from "dayjs";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import * as XLSX from "xlsx";
import HiBox from "../../../components/HiBox";
import HiModal from "../../../components/HiModal";

const EMPTY_TREND = { categories: [], days: [], data: [], insight: "", color: "", machineNames: "" };
const CHART_CONTAINER_PROPS = { style: { width: "100%", height: "100%" } };
const formatNumber = value => Number(value || 0).toFixed(2);

const getProductionDay = (dateValue = dayjs()) => {
    const date = dayjs(dateValue);
    const beforeShiftStart = date.hour() < 7 || (date.hour() === 7 && date.minute() < 30);
    return (beforeShiftStart ? date.subtract(1, "day") : date).format("YYYY-MM-DD");
};

const sumDurationBy = (events, key) => {
    const totals = events.reduce((result, event) => {
        const name = event[key] || "N/A";
        if (!result[name]) result[name] = { duration: 0, frequency: 0 };
        result[name].duration += Number(event.duration || 0);
        result[name].frequency += 1;
        return result;
    }, {});

    return Object.entries(totals)
        .map(([name, values]) => ({ name, ...values }))
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5);
};

const TrendAnalysisModal = ({
    open,
    onClose,
    events = [],
    selectedError = null,
    selectedLine = null,
    selectedLocation = null,
}) => {
    const [activeMachine, setActiveMachine] = useState(null);
    const [activeError, setActiveError] = useState(null);
    const [selectedDay, setSelectedDay] = useState(getProductionDay());

    const lineEvents = useMemo(() => events.filter(event => (
        !selectedLine || event.line === selectedLine
    )), [events, selectedLine]);

    const entryMachine = useMemo(() => selectedLocation
        ? lineEvents.find(event => event.location === selectedLocation)?.machine || null
        : null,
        [lineEvents, selectedLocation]);

    const dayEvents = useMemo(() => lineEvents.filter(event => (
        getProductionDay(event.start_time) === selectedDay
    )), [lineEvents, selectedDay]);

    const topMachines = useMemo(() => sumDurationBy(
        entryMachine ? dayEvents.filter(event => event.machine === entryMachine) : dayEvents,
        "machine",
    ), [dayEvents, entryMachine]);

    useEffect(() => {
        if (!open) return;
        setSelectedDay(getProductionDay());
        setActiveMachine(entryMachine);
        setActiveError(selectedError || null);
    }, [entryMachine, open, selectedError, selectedLine, selectedLocation]);

    const machineEvents = useMemo(() => dayEvents.filter(event => (
        !activeMachine || event.machine === activeMachine
    )), [dayEvents, activeMachine]);

    const topErrors = useMemo(() => sumDurationBy(machineEvents, "error"), [machineEvents]);

    const tableRows = useMemo(() => machineEvents
        .filter(event => !activeError || event.error === activeError)
        .map((event, index) => ({ ...event, id: event.id ?? `${event.start_time}-${index}` })),
        [machineEvents, activeError]);

    const trendData = useMemo(() => {
        if (!open || !events.length) return EMPTY_TREND;

        let trendEvents = events;
        if (selectedError) trendEvents = trendEvents.filter(event => event.error === selectedError);
        if (selectedLine) trendEvents = trendEvents.filter(event => event.line === selectedLine);
        if (selectedLocation) trendEvents = trendEvents.filter(event => event.location === selectedLocation);

        const now = dayjs();
        const latestDay = dayjs(getProductionDay(now));

        const last7Days = Array.from({ length: 7 }, (_, index) => (
            latestDay.subtract(6 - index, "day").format("YYYY-MM-DD")
        ));
        const dataByDay = {};

        trendEvents.forEach(event => {
            const day = getProductionDay(event.start_time);
            dataByDay[day] = (dataByDay[day] || 0) + Number(event.duration || 0);
        });

        const data = last7Days.map(day => dataByDay[day] || 0);
        const recentSum = data.slice(-3).reduce((sum, value) => sum + value, 0);
        const olderSum = data.slice(0, 4).reduce((sum, value) => sum + value, 0);
        const machineNames = [...new Set(trendEvents.map(event => event.machine).filter(Boolean))].join(", ");
        const filterDesc = selectedError
            ? `lỗi '${selectedError}'`
            : selectedLocation
                ? `lỗi của máy ${machineNames || "N/A"} tại ${selectedLine} - ${selectedLocation}`
                : selectedLine
                    ? `lỗi của chuyền ${selectedLine}`
                    : "tổng lỗi toàn nhà máy";

        if (recentSum > olderSum * 1.2) {
            return {
                categories: last7Days.map(day => dayjs(day).format("DD/MM")),
                days: last7Days,
                data,
                machineNames,
                color: "#f87171",
                insight: `Xu hướng ${filterDesc} đang có dấu hiệu TĂNG MẠNH trong 3 ngày gần đây (${formatNumber(recentSum)} phút vs ${formatNumber(olderSum)} phút của 4 ngày trước). Cần chú ý kiểm tra ngay.`,
            };
        }

        if (recentSum < olderSum * 0.8) {
            return {
                categories: last7Days.map(day => dayjs(day).format("DD/MM")),
                days: last7Days,
                data,
                machineNames,
                color: "#34d399",
                insight: `Xu hướng ${filterDesc} đang GIẢM (${formatNumber(recentSum)} phút vs ${formatNumber(olderSum)} phút của 4 ngày trước). Các biện pháp khắc phục có vẻ đang phát huy hiệu quả.`,
            };
        }

        return {
            categories: last7Days.map(day => dayjs(day).format("DD/MM")),
            days: last7Days,
            data,
            machineNames,
            color: "#fbbf24",
            insight: `Xu hướng ${filterDesc} tương đối ỔN ĐỊNH. Không có biến động bất thường đáng kể (${formatNumber(recentSum)} phút vs ${formatNumber(olderSum)} phút).`,
        };
    }, [events, open, selectedError, selectedLine, selectedLocation]);

    const trendChartOptions = useMemo(() => {
        return {
            chart: { type: "spline", backgroundColor: "transparent", reflow: true, height: '40%' },
            title: { text: null, style: { color: "#e2e8f0", fontWeight: "bold", fontSize: "16px" } },
            xAxis: {
                categories: trendData.categories,
                crosshair: true,
                labels: { style: { color: "#94a3b8" } },
            },
            yAxis: { title: { text: "Downtime (Phút)", style: { color: "#94a3b8" } }, labels: { style: { color: "#94a3b8" } } },
            tooltip: {
                formatter: function () {
                    return `<b>${this.category}</b><br/>Downtime: <b>${formatNumber(this.y)} phút</b><br/><span style="color:#94a3b8">Bấm để chọn ngày</span>`;
                },
            },
            plotOptions: {
                series: {
                    cursor: "pointer",
                    point: {
                        events: {
                            click: function () {
                                setSelectedDay(this.options.custom.day);
                                setActiveError(null);
                            },
                        },
                    },
                    marker: { enabled: true, radius: 5 },
                },
            },
            series: [{
                name: "Downtime",
                color: "#3b82f6",
                data: trendData.data.map((value, index) => ({
                    y: value,
                    custom: { day: trendData.days[index] },
                    color: trendData.days[index] === selectedDay ? "#f59e0b" : "#3b82f6",
                    marker: trendData.days[index] === selectedDay
                        ? { fillColor: "#f59e0b", radius: 7, lineWidth: 2, lineColor: "#ffffff" }
                        : undefined,
                })),
            }],
            credits: { enabled: false },
            legend: { enabled: false },
        };
    }, [selectedDay, trendData]);

    const columnOptions = (title, items, selectedValue, onSelect, color) => ({
        chart: { type: "column", backgroundColor: "transparent", reflow: true, height: '40%' },
        title: { text: null, style: { color: "#e2e8f0", fontSize: "14px", fontWeight: "bold" } },
        xAxis: { categories: items.map(item => item.name), labels: { style: { color: "#94a3b8" } } },
        yAxis: [{
            min: 0,
            title: { text: "Downtime (Phút)", style: { color: "#94a3b8" } },
            labels: { style: { color: "#94a3b8" } },
        }, {
            min: 0,
            opposite: true,
            allowDecimals: false,
            title: { text: "Tần suất (Lần)", style: { color: "#00e396" } },
            labels: { format: "{value:.0f}", style: { color: "#00e396" } },
        }],
        tooltip: { shared: true, valueDecimals: 2 },
        plotOptions: {
            series: {
                cursor: "pointer",
                point: { events: { click: function () { onSelect(this.category); } } },
            },
        },
        series: [{
            name: "Downtime",
            type: "column",
            yAxis: 0,
            tooltip: { valueDecimals: 2, valueSuffix: " phút" },
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return formatNumber(this.y);
                },
                style: { color: "#e2e8f0", textOutline: "none" },
            },
            data: items.map(item => ({ y: item.duration, color: item.name === selectedValue ? "#f59e0b" : color })),
        }, {
            name: "Tần suất lỗi",
            type: "spline",
            yAxis: 1,
            color: "#00e396",
            zIndex: 5,
            tooltip: { valueDecimals: 0, valueSuffix: " lần" },
            dataLabels: {
                enabled: true,
                format: "{y:.0f}",
                style: { color: "#00e396", textOutline: "none" },
            },
            marker: { enabled: true, radius: 4 },
            data: items.map(item => item.frequency),
        }],
        credits: { enabled: false },
        legend: {
            enabled: true,
            itemStyle: { color: "#94a3b8" },
            itemHoverStyle: { color: "#ffffff" },
        },
    });

    const machineChartOptions = columnOptions(
        `Top 5 máy lỗi theo thời gian${selectedLine ? ` - ${selectedLine}` : ""}`,
        topMachines,
        activeMachine,
        machine => { if (machine === activeMachine) setActiveMachine(null); else setActiveMachine(machine); setActiveError(null); },
        "#77a7f3ff",
    );

    const errorChartOptions = columnOptions(
        `Top 5 lỗi theo thời gian${activeMachine ? ` - ${activeMachine}` : selectedLine ? ` - ${selectedLine}` : ""}`,
        topErrors,
        activeError,
        error => { if (error === activeError) setActiveError(null); else setActiveError(error); },
        "#e11d48",
    );

    const columns = [
        { field: "line", headerName: "Line", minWidth: 90, flex: 0.5 },
        { field: "machine", headerName: "Machine", minWidth: 120, flex: 0.8 },
        { field: "location", headerName: "Location", minWidth: 100, flex: 0.6 },
        { field: "error", headerName: "Error", minWidth: 180, flex: 1.2, renderCell: params => <Chip label={params.value || "N/A"} size="small" /> },
        {
            field: "start_time",
            headerName: "Start Time",
            minWidth: 110,
            flex: 0.8,
            renderCell: params => params.value ? dayjs(params.value).format("HH:mm:ss") : "",
        },
        {
            field: "end_time",
            headerName: "End Time",
            minWidth: 110,
            flex: 0.8,
            renderCell: params => params.value ? dayjs(params.value).format("HH:mm:ss") : "",
        },
        {
            field: "duration",
            headerName: "Duration (min)",
            minWidth: 130,
            type: "number",
            renderCell: params => formatNumber(params.value),
        },
    ];

    const exportToExcel = () => {
        const exportRows = tableRows.map(({ id, ...row }) => ({
            Line: row.line,
            Machine: row.machine,
            Location: row.location,
            Error: row.error,
            "Start Time": row.start_time ? dayjs(row.start_time).format("YYYY/MM/DD HH:mm:ss") : "",
            "End Time": row.end_time ? dayjs(row.end_time).format("YYYY/MM/DD HH:mm:ss") : "",
            "Duration (min)": row.duration,
        }));
        const worksheet = XLSX.utils.json_to_sheet(exportRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Failure Analysis");
        XLSX.writeFile(workbook, `failure-analysis-${dayjs().format("YYYYMMDD-HHmmss")}.xlsx`);
    };

    let titleNote = "";
    if (selectedLocation) titleNote += `${trendData.machineNames || "NA"} - Line ${selectedLine}`;
    else if (selectedLine) titleNote += `Line ${selectedLine}`

    const errorChartNote = activeMachine
        ? `Machine ${activeMachine} - Line ${selectedLine || "N/A"}`
        : `Line ${selectedLine || "Tất cả"}`;

    return (
        <HiModal open={open} onClose={onClose} header="Phân tích xu hướng lỗi" widthModal={92} heightModal={90} whereRight="4vw" whereTop="5vh">
            <Grid container columns={12} sx={{ p: 1 }}>
                <HiBox header="Xu hướng lỗi 7 ngày" note={titleNote} lg={6} md={6} xs={6} height="42vh" variant="filled" overflow={false}>
                    <HighchartsReact highcharts={Highcharts} options={trendChartOptions} containerProps={CHART_CONTAINER_PROPS} />
                </HiBox>

                <HiBox header="Top 5 máy lỗi" note={`${selectedLine || "Tất cả line"} - ${dayjs(selectedDay).format("DD/MM/YYYY")}`} lg={6} md={6} xs={12} height="42vh" variant="filled" overflow={false}>
                    <HighchartsReact highcharts={Highcharts} options={machineChartOptions} containerProps={CHART_CONTAINER_PROPS} />
                </HiBox>

                <HiBox header="Top 5 lỗi" note={errorChartNote} lg={6} md={6} xs={12} height="42vh" variant="filled" overflow={false}>
                    <HighchartsReact highcharts={Highcharts} options={errorChartOptions} containerProps={CHART_CONTAINER_PROPS} />
                </HiBox>

                <HiBox
                    header="Danh sách lỗi theo máy / line"
                    note={`${dayjs(selectedDay).format("DD/MM/YYYY")} - ${tableRows.length} bản ghi`}
                    lg={6}
                    md={6}
                    xs={6}
                    height="42vh"
                    variant="filled"
                    overflow={false}
                    functionHtml={<Button size="small" variant="contained" startIcon={<GetApp />} onClick={exportToExcel} disabled={!tableRows.length}>Export Excel</Button>}
                >
                    <DataGrid rows={tableRows} columns={columns} disableRowSelectionOnClick pageSizeOptions={[10, 25, 50]} initialState={{ pagination: { paginationModel: { pageSize: 50 } } }} />
                </HiBox>
            </Grid>
        </HiModal>
    );
};

export default TrendAnalysisModal;
