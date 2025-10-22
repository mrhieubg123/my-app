import { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import HiBox from "../../../components/HiBox";
import { Grid } from "@mui/material";
import ColumnChart from "./components/ColumnChart";
import TableMaintenancePlan from "./components/FailureAnalysis";
import { getAuthorizedAxiosIntance } from "../../../utils/axiosConfig";
import RadialChart from "./components/RadialChart";
import TableMaintenanceHistory from "./components/tableErrorOver10m";
import HiModal from "../../../components/HiModal";
import ErrorDetail from "./components/ErrorDetail";

const axiosInstance = await getAuthorizedAxiosIntance();

const MaintenanceStatus = () => {
  const paramState = useSelector((state) => state.param);
  const [showModal3, setShowModal3] = useState(false);
  const [dataFATPMachineStatus, setDataFATPMachineStatus] = useState([]);

  const [dataFATPMachineAnalysis, setDataFATPMachineAnalysis] = useState([]);
  const [dataFATPMachineError5m, setDataFATPMachineError5m] = useState([]);
  const [dataFATPErrorDetail, setDataFATPErrorDetail] = useState([]);
  const [dataMaintenanceDetailFilter, setDataMaintenanceDetailFilter] =
    useState([]);
  const [switchLiAnMa, setSwitchLiAnMa] = useState(false);
  const [Data6, setData6] = useState({});

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
            idata={dataFATPMachineAnalysis}
            dataFATPErrorDetail={dataFATPErrorDetail}
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
          <TableMaintenancePlan
            idata={dataFATPErrorDetail}
            DataSeries={Data6.DataSeries}
            Colors={Data6.colors}
            Labels={Data6.labels}
            keyFilter={switchLiAnMa ? "MACHINE_NAME" : "LINE"}
          />
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
            idata={dataFATPMachineStatus}
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
            idata={dataFATPMachineError5m}
          ></TableMaintenanceHistory>
        </HiBox>
      </Grid>
    </Grid>
  );
};

export default memo(MaintenanceStatus);
