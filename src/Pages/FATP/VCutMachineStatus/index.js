import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import HiBox from "../../../components/HiBox";
import {
  Box,
  Grid,
  CardContent,
  Switch,
  Typography,
  LinearProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  lighten,
  Button,
} from "@mui/material";
import { CheckCircle, Warning, Error, Close } from "@mui/icons-material";
import MachineStatusHighchartsGrid from "./components/MachineStatus";
import CABChart from "./components/CABChart";
import HiProgressBar from "./components/FailureAnalysis";
import AnalysisChart from "./components/AnalysisChart";
import { getAuthorizedAxiosIntance } from "../../../utils/axiosConfig";
import LineChart from "./components/LineChart";
import RadialChart from "./components/RadialChart";
import TableErorOver5m from "./components/tableErrorOver10m";
import HiModal from "../../../components/HiModal";
import TableError from "./components/tableError";
import ErrorDetail from "./components/ErrorDetail";
import AiSuggest from "./components/AiSuggest";
import DryerStatusCard from "./components/TextComponent";
import ESDTotal from "./components/ESDTotal";

const axiosInstance = await getAuthorizedAxiosIntance();

const VCutMachineStatus = () => {
  const paramState = useSelector((state) => state.param);
  const [queryMain, setQueryMain] = useState({ arr: [], timet: "", datet: "" });
  const [queryDate, setQueryDate] = useState("");

  const isFirstRender = useState(true);
  const isFirstRender2 = useState(true);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(null);
  const [isLoadingData1, setIsLoadingData1] = useState(null);
  const [isLoadingData2, setIsLoadingData2] = useState(null);
  const [dataVcutMachineStatus, setDataVcutMachineStatus] = useState([]);
  const [dataFATPMachineTotalTrend, setDataFATPMachineTotalTrend] = useState(
    []
  );
  const [dataFATPMachineAnalysis, setDataFATPMachineAnalysis] = useState([]);

  const legendItem = useMemo(
    () => [
      { color: "#00e396", label: "Good" },
      { color: "#f1c40f", label: "Warning" },
      { color: "#ff3110", label: "Over" },
    ],
    []
  );

  const fetchVcutMachineStatus = async () => {
    setIsLoadingData(true);
    try {
      const response = await axiosInstance.get("api/vcut/getVcutMachineStatus");
      setDataVcutMachineStatus(response.data || []); // Cập nhật state
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchVcutMachineStatus();
    const interval = setInterval(() => {
      fetchVcutMachineStatus();
    }, 60000 * 60);
    return () => clearInterval(interval);
  }, []);

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
      if (row.DIFF >= CRITICAL_THRESHOLD) counts.OVER += 1;
      else if (row.DIFF >= WARNING_THRESHOLD) counts.WARNING += 1;
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
            idata={dataVcutMachineStatus} onCallBack={fetchVcutMachineStatus}
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
            idata={[1, 2, 3]}
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
          <LineChart idata={dataFATPMachineAnalysis}></LineChart>
        </HiBox>
      </Grid>
    </Grid>
  );
};

export default memo(VCutMachineStatus);
