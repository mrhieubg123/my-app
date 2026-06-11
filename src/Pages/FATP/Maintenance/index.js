import { memo, useCallback, useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import HiBox from "../../../components/HiBox";
import { Grid, Box, Typography } from "@mui/material";
import ColumnChart from "./components/ColumnChart";
import TableMaintenancePlan from "./components/TableMaintenancePlan";
import { getAuthorizedAxiosIntance } from "../../../utils/axiosConfig";
import RadialChart from "./components/RadialChart";
import TableMaintenanceHistory from "./components/TableMaintenanceHistory";
import HiModal from "../../../components/HiModal";
import ErrorDetail from "./components/ErrorDetail";
import factory from "highcharts/highcharts-3d";
import { CheckCircleOutline, AccessTime, WarningAmber, ListAlt } from "@mui/icons-material";
import MonthlyTrendChart from "./components/MonthlyTrendChart";
import MaintenanceAlerts from "./components/MaintenanceAlerts";

const axiosInstance = await getAuthorizedAxiosIntance();
const MONTH_ABBR = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const MaintenanceStatus = () => {
  const paramState = useSelector((state) => state.param);
  const [showModal3, setShowModal3] = useState(false);
  const [dataMaintenancePlan, setDataMaintenancePlan] = useState([]);
  const [dataMaintenancePlanSelect, setDataMaintenancePlanSelect] = useState(
    []
  );
  const [dataMaintenancePlanPresent, setDataMaintenancePlanPresent] = useState(
    []
  );
  const [monthSelect, setMonthSelect] = useState(null);
  const [dataMaintenanceDetailFilter, setDataMaintenanceDetailFilter] =
    useState([]);
  const selectedFactory = useSelector((state) => state.param.params.Factory);

  const fetchMaintenancePlan = async (model) => {
    try {
      const response = await axiosInstance.post(
        "api/maintenance/getFATPMaintenanceMultiMonth",
        model
      );
      setDataMaintenancePlan(response.data || []); // Cập nhật state
    } catch (error) {
      console.log(error.message);
    }
  };
  function getMonthAbbrFromDate(dateStr) {
    if (!dateStr) return null; // hoặc ""
    // dateStr dạng "YYYY-MM-DD"
    const monthIndex = Number(dateStr.slice(5, 7)) - 1; // "11" -> 10
    return MONTH_ABBR[monthIndex] || null;
  }

  useEffect(() => {
    const newMo = {
      dateFrom: paramState.params.starttime,
      dateTo: paramState.params.endtime,
      factory: selectedFactory
    };
    fetchMaintenancePlan(newMo);
  }, [paramState.params.starttime, paramState.params.endtime, selectedFactory]);

  useEffect(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const currentMonth = getMonthAbbrFromDate(todayStr);
    const targetMonth = monthSelect || currentMonth;

    const machinesMap = {};
    const machinesPresentMap = {};

    (dataMaintenancePlan || []).forEach((item) => {
      const machineId = item.ID;
      const isMatchingMonth = getMonthAbbrFromDate(item.DATE_CHECK) === targetMonth;
      const isMatchingPresentMonth = getMonthAbbrFromDate(item.DATE_CHECK) === currentMonth;

      if (!machinesMap[machineId] || isMatchingMonth) {
        machinesMap[machineId] = {
          ...item,
          STATUS: isMatchingMonth ? item.STATUS : null,
          NOTE: isMatchingMonth ? item.NOTE : null,
          DOCUMENT: isMatchingMonth ? item.DOCUMENT : null,
          DATE_CHECK: isMatchingMonth ? item.DATE_CHECK : null,
          UPDATED_AT: isMatchingMonth ? item.UPDATED_AT : null,
          TARGET_MONTH: targetMonth,
        };
      }

      if (!machinesPresentMap[machineId] || isMatchingPresentMonth) {
        machinesPresentMap[machineId] = {
          ...item,
          STATUS: isMatchingPresentMonth ? item.STATUS : null,
          NOTE: isMatchingPresentMonth ? item.NOTE : null,
          DOCUMENT: isMatchingPresentMonth ? item.DOCUMENT : null,
          DATE_CHECK: isMatchingPresentMonth ? item.DATE_CHECK : null,
          UPDATED_AT: isMatchingPresentMonth ? item.UPDATED_AT : null,
          TARGET_MONTH: currentMonth,
        };
      }
    });

    setDataMaintenancePlanSelect(Object.values(machinesMap));
    setDataMaintenancePlanPresent(Object.values(machinesPresentMap));
  }, [dataMaintenancePlan, monthSelect]);

  const openModalMaintenanceDetails = (data) => {
    setDataMaintenanceDetailFilter(data);
    setShowModal3(true);
  };

  const kpiData = useMemo(() => {
    const totalPresent = dataMaintenancePlanPresent.length;
    const completedPresent = dataMaintenancePlanPresent.filter(item => item.STATUS?.trim().toUpperCase() === "OK").length;
    const completionRate = totalPresent > 0 ? Math.round((completedPresent / totalPresent) * 100) : 0;
    
    const todayStr = new Date().toISOString().slice(0, 10);
    const delayedCount = dataMaintenancePlanPresent.filter(item => {
      return item.DATE_CHECK && item.DATE_CHECK < todayStr && (!item.STATUS || item.STATUS.trim().toUpperCase() !== "OK");
    }).length;
    
    const pendingCount = dataMaintenancePlanPresent.filter(item => {
      return item.STATUS && item.STATUS.trim().toUpperCase() !== "OK";
    }).length;

    const totalMaintained = dataMaintenancePlanPresent.filter(item => item.STATUS).length;

    return [
      {
        title: "Tỷ lệ Hoàn thành",
        value: `${completionRate}%`,
        subText: `${completedPresent} / ${totalPresent} máy`,
        icon: <CheckCircleOutline sx={{ fontSize: 32, color: "#4caf50" }} />,
        color: "#4caf50",
        bg: "linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, rgba(76, 175, 80, 0.01) 100%)",
      },
      {
        title: "Chờ Ký duyệt",
        value: pendingCount,
        subText: "Đang xử lý chữ ký",
        icon: <AccessTime sx={{ fontSize: 32, color: "#2196f3" }} />,
        color: "#2196f3",
        bg: "linear-gradient(135deg, rgba(33, 150, 243, 0.08) 0%, rgba(33, 150, 243, 0.01) 100%)",
      },
      {
        title: "Line Trễ Bảo trì",
        value: delayedCount,
        subText: "Yêu cầu kiểm tra",
        icon: <WarningAmber sx={{ fontSize: 32, color: "#f44336" }} />,
        color: "#f44336",
        bg: "linear-gradient(135deg, rgba(244, 67, 54, 0.08) 0%, rgba(244, 67, 54, 0.01) 100%)",
      },
      {
        title: "Kế hoạch Tháng",
        value: totalPresent,
        subText: `Đã bảo trì ${totalMaintained} máy`,
        icon: <ListAlt sx={{ fontSize: 32, color: "#9c27b0" }} />,
        color: "#9c27b0",
        bg: "linear-gradient(135deg, rgba(156, 39, 176, 0.08) 0%, rgba(156, 39, 176, 0.01) 100%)",
      },
    ];
  }, [dataMaintenancePlanPresent]);

  return (
    <Grid container columns={12} spacing={1}>
      {/* KPI Cards row */}
      <Grid item size={{ lg: 12, md: 12, xs: 12 }} lg={12} md={12} xs={12} container spacing={2} sx={{ px: 1, pb: 1, pt: 0.5 }}>
        {kpiData.map((kpi, idx) => (
          <Grid item size={{ lg: 3, md: 3, xs: 6 }} lg={3} md={3} xs={6} key={idx}>
            <Box sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderRadius: "12px",
              boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.05)",
              borderLeft: `5px solid ${kpi.color}`,
              background: kpi.bg,
              height: "11vh",
            }}>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, display: "block" }}>
                  {kpi.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", mt: 0.5, mb: 0.2, lineHeight: 1.1 }}>
                  {kpi.value}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block" }}>
                  {kpi.subText}
                </Typography>
              </Box>
              <Box sx={{
                p: 1,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.8)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {kpi.icon}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Main dashboard columns */}
      <Grid
        size={{ lg: 3, md: 3, xs: 12 }}
        lg={3}
        md={3}
        xs={12}
        container
        columns={12}
      >
        <HiBox
          lg={12}
          md={12}
          xs={4}
          alarn={false}
          header={"Month maintenance"}
          height="33vh"
          variant="filled"
        >
          <HiModal
            header={`Month maintenance details`}
            open={showModal3}
            onClose={() => setShowModal3(false)}
            widthModal={80}
            heightModal={80}
          >
            <ErrorDetail idata={dataMaintenanceDetailFilter}></ErrorDetail>
          </HiModal>
          <RadialChart
            idata={dataMaintenancePlanSelect}
            onCallBack={openModalMaintenanceDetails}
          ></RadialChart>
        </HiBox>
        <HiBox
          lg={12}
          md={12}
          xs={4}
          header="Maintenance plan"
          variant="filled"
          height="45vh"
        >
          <TableMaintenancePlan idata={dataMaintenancePlanPresent} />
        </HiBox>
      </Grid>
      <Grid
        size={{ lg: 9, md: 9, xs: 12 }}
        lg={9}
        md={9}
        xs={12}
        container
        columns={12}
      >
        {/* Row 1 of right side */}
        <HiBox
          lg={8}
          md={8}
          xs={12}
          alarn={false}
          header="Maintenance for line"
          height="40vh"
          variant="filled"
        >
          <ColumnChart
            idata={dataMaintenancePlanSelect}
            onCallBack={openModalMaintenanceDetails}
          ></ColumnChart>
        </HiBox>
        <HiBox
          lg={4}
          md={4}
          xs={12}
          alarn={false}
          header="Maintenance alerts"
          height="40vh"
          variant="filled"
        >
          <MaintenanceAlerts
            idata={dataMaintenancePlan}
            onCallBack={(alert) => {
              setDataMaintenanceDetailFilter([alert]);
              setShowModal3(true);
            }}
          />
        </HiBox>

        {/* Row 2 of right side */}
        <HiBox
          lg={8}
          md={8}
          xs={12}
          alarn={false}
          header="Monthly trend"
          height="38vh"
          variant="filled"
        >
          <MonthlyTrendChart idata={dataMaintenancePlan} />
        </HiBox>
        <HiBox
          lg={4}
          md={4}
          xs={12}
          alarn={false}
          header="Maintenance history"
          height="38vh"
          variant="filled"
        >
          <TableMaintenanceHistory
            idata={dataMaintenancePlan}
            monthSelect={monthSelect}
            onCallBack={(value) => setMonthSelect(value)}
          ></TableMaintenanceHistory>
        </HiBox>
      </Grid>
    </Grid>
  );
};

export default memo(MaintenanceStatus);
