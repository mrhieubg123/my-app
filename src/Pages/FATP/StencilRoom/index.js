import React, { memo, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import HiBox from "../../../components/HiBox";
import { Grid, Box, Switch } from "@mui/material";
import VoltageMonitorStatus from "./components/VoltageMonitorStatus";
import ColumnChart from "./components/ColumnChart";
import TableErorOver5m from "./components/tableErrorOver10m";
import { getAuthorizedAxiosIntance } from "../../../utils/axiosConfig";
import ESDTotal from "./components/ESDTotal";
import imgRobot from "./components/images/robot.png";
import HiModal from "../../../components/HiModal";
import ErrorDetail from "./components/ErrorDetail";
import RadialChart from "./components/RadialChart";
import HiProgressBar from "./components/FailureAnalysis";
import TableNG from "./components/tableNG";

const axiosInstance = await getAuthorizedAxiosIntance();

const StencilRoomDashboard = () => {
  const paramState = useSelector((state) => state.param);
  const [showModal1, setShowModal1] = useState(false);
  const [queryDate, setQueryDate] = useState("");
  const [dataVoltageMonitorMachineStatus, setDataVoltageMonitorMachineStatus] =
    useState([]);
  const [dataVoltageMonitorErrorDetail, setDataVoltageMonitorErrorDetail] =
    useState([]);
  const [switchErAnLo, setSwitchErAnLo] = useState(false);
  const [dataFATPErrorDetailFilter, setDataFATPErrorDetailFilter] = useState(
    []
  );

  const legendItem = useMemo(
    () => [
      { color: "#00e396", label: "Good" },
      { color: "#f1c40f", label: "Warning" },
      { color: "#ff3110", label: "Error" },
    ],
    []
  );

  const fetchVcutMachineStatus = async () => {
    try {
      const response = await axiosInstance.get(
        "api/Voltage/getVoltageMonitorMachineStatus"
      );
      setDataVoltageMonitorMachineStatus(response.data || []); // Cập nhật state
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchVoltageMonitorErrorDetail = async (model) => {
    try {
      const response = await axiosInstance.post(
        "api/Voltage/getVoltageMonitorErrorDetail",
        model
      );
      setDataVoltageMonitorErrorDetail(response.data || []); // Cập nhật state
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchVcutMachineStatus();
    const interval = setInterval(() => {
      fetchVcutMachineStatus();
    }, 60000 * 5);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newMo = {
      dateFrom: paramState.params.starttime,
      dateTo: paramState.params.endtime,
    };
    fetchVoltageMonitorErrorDetail(newMo);
    const interval = setInterval(() => {
      fetchVoltageMonitorErrorDetail(newMo);
    }, 60000 * 30);
    return () => clearInterval(interval);
  }, [paramState.params.starttime, paramState.params.endtime]);

  const handleChangeSwitchErAnLo = (event) => {
    setSwitchErAnLo(event.target.checked);
  };

  const MIN_THRESHOLD = 14.5;
  const MAX_THRESHOLD = 15.5;
  const errorCount = useMemo(() => {
    return dataVoltageMonitorMachineStatus.filter((x) =>
      x.KCN.split("-")
        .map(Number)
        .some((v) => v < MIN_THRESHOLD || v > MAX_THRESHOLD)
    ).length;
  }, [dataVoltageMonitorMachineStatus]);

  const openModalMaintenanceDetails = (data) => {
    setDataFATPErrorDetailFilter(data);
    setShowModal1(true);
  };

  return (
    <Grid container columns={12}>
      <Grid
        size={{ lg: 3, md: 3, xs: 12 }}
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
          header="Inventory"
          height="30vh"
          variant="filled"
        >
          <HiModal
            header={`Error details`}
            open={showModal1}
            onClose={() => setShowModal1(false)}
            widthModal={60}
            heightModal={85}
          >
            <ErrorDetail idata={dataFATPErrorDetailFilter}></ErrorDetail>
          </HiModal>
          <RadialChart
          // idata={dataFATPMachineAnalysis}
          // dataFATPErrorDetail={dataFATPErrorDetail}
          ></RadialChart>
        </HiBox>
        <HiBox
          lg={12}
          md={12}
          xs={12}
          alarn={false}
          header="Top Using"
          // note={switchErAnLo ? "by Machine" : "by Line"}
          height="30vh"
          variant="filled"
        >
          {/* <Switch
            checked={switchErAnLo}
            onChange={handleChangeSwitchErAnLo}
            sx={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}
            defaultChecked
          ></Switch> */}
          <HiProgressBar
            // idata={dataErrorHistory}
            // DataSeries={Data5.DataSeries}
            DataSeries={[1,2]}
            // Colors={Data5.colors}
            // keyFilter={"NAME_MACHINE"}
            // Labels={Data5.labels}
          />
        </HiBox>
        <HiBox
          lg={12}
          md={12}
          xs={12}
          alarn={false}
          header="Top Using"
          height="32vh"
          variant="filled"
        >
          <TableNG/>
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
          lg={6}
          md={6}
          xs={6}
          alarn={false}
          header="Trend Using By Day"
          height="50vh"
          variant="filled"
        >
          <ColumnChart
            idata={dataVoltageMonitorErrorDetail}
            onCallBack={openModalMaintenanceDetails}
            checked={switchErAnLo}
          ></ColumnChart>
        </HiBox>
        <HiBox
          lg={6}
          md={6}
          xs={6}
          alarn={false}
          header="Daily Inventory"
          height="50vh"
          variant="filled"
        >
          <ColumnChart
            idata={dataVoltageMonitorErrorDetail}
            onCallBack={openModalMaintenanceDetails}
            checked={switchErAnLo}
          ></ColumnChart>
        </HiBox>
        <HiBox
          lg={6}
          md={6}
          xs={6}
          alarn={false}
          header="Voltage Monitor Error Detail"
          height="45vh"
          variant="filled"
        >
          <TableErorOver5m
            idata={dataVoltageMonitorErrorDetail}
          ></TableErorOver5m>
        </HiBox>
        <HiBox
          lg={6}
          md={6}
          xs={6}
          alarn={false}
          header="Voltage Monitor Error Detail"
          height="45vh"
          variant="filled"
        >
          <TableErorOver5m
            idata={dataVoltageMonitorErrorDetail}
          ></TableErorOver5m>
        </HiBox>
      </Grid>
      <Grid
        size={{ lg: 12, md: 12, xs: 12 }}
        lg={9}
        md={9}
        xs={12}
        container
        columns={12}
      >
        <HiBox
          lg={4}
          md={4}
          xs={4}
          alarn={false}
          header="Voltage Monitor Error Detail"
          height="45vh"
          variant="filled"
        >
          <TableErorOver5m
            idata={dataVoltageMonitorErrorDetail}
          ></TableErorOver5m>
        </HiBox>
        <HiBox
          lg={8}
          md={8}
          xs={8}
          alarn={false}
          header="Voltage Monitor Error Detail"
          height="45vh"
          variant="filled"
        >
          <TableErorOver5m
            idata={dataVoltageMonitorErrorDetail}
          ></TableErorOver5m>
        </HiBox>
      </Grid>
    </Grid>
  );
};

export default memo(StencilRoomDashboard);
