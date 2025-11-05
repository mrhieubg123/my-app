import React, { memo, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import HiBox from "../../../components/HiBox";
import { Grid } from "@mui/material";
import MachineStatusHighchartsGrid from "./components/MachineStatus";
import CABChart from "./components/CABChart";
import { getAuthorizedAxiosIntance } from "../../../utils/axiosConfig";
import LineChart from "./components/LineChart";
import ESDTotal from "./components/ESDTotal";

const axiosInstance = await getAuthorizedAxiosIntance();

const VCutMachineStatus = () => {
  const paramState = useSelector((state) => state.param);
  const [queryDate, setQueryDate] = useState("");
  const [dataVcutMachineStatus, setDataVcutMachineStatus] = useState([]);
  const [dataVcutMachineTotalTrend, setDataVcutMachineTotalTrend] = useState(
    []
  );

  const legendItem = useMemo(
    () => [
      { color: "#00e396", label: "Good(<450,000)" },
      { color: "#f1c40f", label: "Warning(>450,000)" },
      { color: "#ff3110", label: "Over(>500,000)" },
    ],
    []
  );

  const fetchVcutMachineStatus = async () => {
    try {
      const response = await axiosInstance.get("api/vcut/getVcutMachineStatus");
      setDataVcutMachineStatus(response.data || []); // Cập nhật state
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchVcutMachineTotalTrend = async (model) => {
    try {
      const response = await axiosInstance.post(
        "api/vcut/getDataVcutMachineTotalTrend",
        model
      );
      setDataVcutMachineTotalTrend(response.data || []); // Cập nhật state
      const lastesTimeStr = Object.values(response.data)
        .map((item) => item.TIME)
        .reduce((a, b) => (new Date(a) > new Date(b) ? a : b));
      setQueryDate(new Date(lastesTimeStr).toISOString().slice(0, 10));
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchVcutMachineStatus();
    const interval = setInterval(() => {
      fetchVcutMachineStatus();
    }, 60000 * 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newModel = {
      dateFrom: paramState.params.starttime,
      dateTo: paramState.params.endtime,
    };
    fetchVcutMachineTotalTrend(newModel);
    const interval = setInterval(() => {
      fetchVcutMachineTotalTrend();
    }, 60000 * 5);
    return () => clearInterval(interval);
  }, [paramState.params.starttime, paramState.params.endtime]);

  const handleChangeDate = (idate) => {
    setQueryDate(idate);
  };

  const CRITICAL_THRESHOLD = 500000;
  const WARNING_THRESHOLD = 450000;
  const TotalStatus = (data) => {
    const counts = {
      GOOD: 0,
      WARNING: 0,
      OVER: 0,
    };

    for (const row of data) {
      if (row.TOTAL >= CRITICAL_THRESHOLD) counts.OVER += 1;
      else if (row.TOTAL >= WARNING_THRESHOLD) counts.WARNING += 1;
      else counts.GOOD += 1;
    }
    return counts;
  };
  const countStatus = TotalStatus(dataVcutMachineStatus);
  return (
    <Grid container columns={12}>
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
            {dataVcutMachineStatus.length}
          </ESDTotal>
          <ESDTotal
            lg={3}
            md={3}
            xs={3}
            height="15vh"
            bgColor={"linear-gradient(45deg,#2ed8b6,#59e0c5)"}
            header="Good"
          >
            {countStatus.GOOD}
          </ESDTotal>
          <ESDTotal
            lg={3}
            md={3}
            xs={3}
            height="15vh"
            bgColor={"linear-gradient(45deg,#ffb640,#ffcb80)"}
            header="Warning"
          >
            {countStatus.WARNING}
          </ESDTotal>
          <ESDTotal
            lg={3}
            md={3}
            xs={3}
            height="15vh"
            bgColor={"linear-gradient(45deg,#ff5370,#ff869a)"}
            header="Over"
          >
            {countStatus.OVER}
          </ESDTotal>
        </Grid>
        <HiBox
          lg={12}
          md={12}
          xs={12}
          alarn={false}
          header="V-Cut Machine Status"
          height="75vh"
          variant="filled"
          legendItem={legendItem}
        >
          <MachineStatusHighchartsGrid
            idata={dataVcutMachineStatus}
            onCallBack={fetchVcutMachineStatus}
          ></MachineStatusHighchartsGrid>
        </HiBox>
      </Grid>
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
          <CABChart
            idata={dataVcutMachineTotalTrend}
            onChangeDate={handleChangeDate}
          ></CABChart>
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
    </Grid>
  );
};

export default memo(VCutMachineStatus);
