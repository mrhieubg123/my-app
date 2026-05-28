import { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import HiBox from "../../../components/HiBox";
import { Grid } from "@mui/material";
import ColumnChart from "./components/ColumnChart";
import TableMaintenancePlan from "./components/TableMaintenancePlan";
import { getAuthorizedAxiosIntance } from "../../../utils/axiosConfig";
import RadialChart from "./components/RadialChart";
import TableMaintenanceHistory from "./components/TableMaintenanceHistory";
import HiModal from "../../../components/HiModal";
import ErrorDetail from "./components/ErrorDetail";
import factory from "highcharts/highcharts-3d";

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
    const targetMonth = monthSelect || getMonthAbbrFromDate(todayStr);

    const machinesMap = {};

    (dataMaintenancePlan || []).forEach((item) => {
      const machineId = item.ID;
      const isMatchingMonth = getMonthAbbrFromDate(item.DATE_CHECK) === targetMonth;

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
    });

    setDataMaintenancePlanSelect(Object.values(machinesMap));
  }, [dataMaintenancePlan, monthSelect]);

  const openModalMaintenanceDetails = (data) => {
    setDataMaintenanceDetailFilter(data);
    setShowModal3(true);
  };

  return (
    <Grid container columns={12}>
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
          height="36vh"
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
          height="52vh"
        >
          <TableMaintenancePlan idata={dataMaintenancePlanSelect} />
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
        <HiBox
          lg={12}
          md={12}
          xs={12}
          alarn={false}
          header="Maintenance for line"
          height="44vh"
          variant="filled"
        >
          <ColumnChart
            idata={dataMaintenancePlanSelect}
            onCallBack={openModalMaintenanceDetails}
          ></ColumnChart>
        </HiBox>
        <HiBox
          lg={12}
          md={12}
          xs={12}
          alarn={false}
          header="Maintenance history"
          height="43vh"
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
