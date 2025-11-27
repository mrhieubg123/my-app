import React, { memo, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import HiBox from "../../../components/HiBox";
import { Grid, Box } from "@mui/material";
import VoltageMonitorStatus from "./components/VoltageMonitorStatus";
import CABChart from "./components/CABChart";
import { getAuthorizedAxiosIntance } from "../../../utils/axiosConfig";
import LineChart from "./components/LineChart";
import ESDTotal from "./components/ESDTotal";
import imgRobot from "./components/images/robot.png";

const axiosInstance = await getAuthorizedAxiosIntance();

const VoltageMonitorDashboard = () => {
  const paramState = useSelector((state) => state.param);
  const [queryDate, setQueryDate] = useState("");
  const [dataVoltageMonitorMachineStatus, setDataVoltageMonitorMachineStatus] =
    useState([]);
  const [dataVcutMachineTotalTrend, setDataVcutMachineTotalTrend] = useState(
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

  useEffect(() => {
    fetchVcutMachineStatus();
    const interval = setInterval(() => {
      fetchVcutMachineStatus();
    }, 60000 * 5);
    return () => clearInterval(interval);
  }, []);

  const MIN_THRESHOLD = 14.5;
  const MAX_THRESHOLD = 15.5;
  const errorCount = useMemo(() => {
    return dataVoltageMonitorMachineStatus.filter((x) =>
      x.KCN.split("-")
        .map(Number)
        .some((v) => v < MIN_THRESHOLD || v > MAX_THRESHOLD)
    ).length;
  }, [dataVoltageMonitorMachineStatus]);

  return (
    <Grid container columns={12}>
      <Grid
        size={{ lg: 5, md: 5, xs: 12 }}
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
          header="Total Trend"
          height="45vh"
          variant="filled"
        >
          <Box
            component={"div"}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Box
              component="img"
              align="center"
              src={imgRobot}
              sx={{ height: "100%" }}
            />
          </Box>
        </HiBox>
        <HiBox
          lg={12}
          md={12}
          xs={12}
          alarn={false}
          header="Next Trend"
          note={queryDate}
          height="45vh"
          variant="filled"
        >
          <LineChart
            idata={dataVcutMachineTotalTrend.filter(
              (item) =>
                new Date(item.TIME).toISOString().slice(0, 10) === queryDate
            )}
          ></LineChart>
        </HiBox>
      </Grid>
      <Grid
        size={{ lg: 7, md: 7, xs: 12 }}
        lg={9}
        md={9}
        xs={12}
        container
        columns={12}
      >
        <Grid
          size={{ lg: 12, md: 12, xs: 12 }}
          container
          columns={12}
          lg={12}
          md={12}
          xs={12}
          variant="filled"
        >
          <ESDTotal
            lg={3}
            md={3}
            xs={3}
            height="15vh"
            bgColor={"linear-gradient(45deg,#4099ff,#73b4ff)"}
            header="Total"
          >
            {dataVoltageMonitorMachineStatus.length}
          </ESDTotal>
          <ESDTotal
            lg={3}
            md={3}
            xs={3}
            height="15vh"
            bgColor={"linear-gradient(45deg,#2ed8b6,#59e0c5)"}
            header="Good"
          >
            {dataVoltageMonitorMachineStatus.length - errorCount}
          </ESDTotal>
          <ESDTotal
            lg={3}
            md={3}
            xs={3}
            height="15vh"
            bgColor={"linear-gradient(45deg,#ffb640,#ffcb80)"}
            header="Warning"
          >
            {0}
          </ESDTotal>
          <ESDTotal
            lg={3}
            md={3}
            xs={3}
            height="15vh"
            bgColor={"linear-gradient(45deg,#ff5370,#ff869a)"}
            header="Error"
          >
            {errorCount}
          </ESDTotal>
        </Grid>
        <HiBox
          lg={12}
          md={12}
          xs={12}
          alarn={false}
          header="Voltage Monitor Machine Status"
          height="75vh"
          variant="filled"
          legendItem={legendItem}
        >
          <VoltageMonitorStatus
            idata={dataVoltageMonitorMachineStatus}
            onCallBack={fetchVcutMachineStatus}
          ></VoltageMonitorStatus>
        </HiBox>
      </Grid>
    </Grid>
  );
};

export default memo(VoltageMonitorDashboard);
