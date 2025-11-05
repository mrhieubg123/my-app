import React, { memo, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import HiBox from "../../../components/HiBox";
import { Grid, Button, Box } from "@mui/material";
import CABChart from "./components/CABChart";
import TableMachineStatus from "./components/MachineStatus";
import HiProgressBar from "./components/FailureAnalysis";
import { getAuthorizedAxiosIntance } from "../../../utils/axiosConfig";
import LineChart from "./components/LineChart";
import TableErorHistory from "./components/tableErrorOver10m";
import HiModal from "../../../components/HiModal";
import ESDTotal from "./components/ESDTotal";
import { Description, Build } from "@mui/icons-material";
import ForceDefaultDetail from "./components/ForceDefaultDetail";
import ForceFileExplorer from "./components/ForceDocummentFolder";
import ForceDocummentDetail from "./components/ForceDocummentDetail";
import RotatingModeSelector from "./components/CircularSliderMUI";

const axiosInstance = await getAuthorizedAxiosIntance();

const GlueScrewStatus = () => {
  const paramState = useSelector((state) => state.param);
  const [queryMain, setQueryMain] = useState({
    arr: [],
    timet: "",
    datet: "",
    type: "",
  });
  const [queryDate, setQueryDate] = useState("");
  const isFirstRender2 = useState(true);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [dataScrewMachineStatus, setDataScrewMachineStatus] = useState([]);
  const [dataForceDefault, setDataForceDefault] = useState([]);
  const [dataFATPMachineAnalysis, setDataFATPMachineAnalysis] = useState([]);
  const [dataErrorHistory, setDataErrorHistory] = useState([]);
  const [Data5, setData5] = useState({});
  const [Data6, setData6] = useState({});
  const [activeModeId, setActiveModeId] = useState("Screw");

  const legendItemStatus = useMemo(
    () => [
      { color: "#00e396", label: ">99.7" },
      { color: "#fdfd00", label: ">99.5" },
      { color: "#ff3110", label: "<99.5" },
      { color: "#808080", label: "NA" },
    ],
    []
  );

  const fetchScrewMachineStatus = async () => {
    try {
      const response = await axiosInstance.post(
        "api/Screw/getScrewMachineStatus",
        {
          dateFrom: paramState.params.starttime,
          dateTo: paramState.params.endtime,
          type: activeModeId,
        }
      );
      setDataScrewMachineStatus(response.data || []);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchDataForceDefault = async () => {
    try {
      const response = await axiosInstance.get("api/Screw/getDataForceDefault");
      setDataForceDefault(response.data || []); // Cập nhật state
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchFATPMachineAnalysis = async (model) => {
    try {
      const response = await axiosInstance.post(
        "api/Screw/getScrewMachineAnalysis",
        model
      );
      setDataFATPMachineAnalysis(response.data || []); // Cập nhật state
      const tempError2 = {};
      response.data
        .filter((item) => item.FAIL_COUNT > 0)
        .forEach((item) => {
          if (tempError2[item.LINE]) {
            tempError2[item.LINE].Downtime += item.FAIL_COUNT;
          } else {
            tempError2[item.LINE] = {
              Series: item.LINE,
              Downtime: item.FAIL_COUNT,
            };
          }
        });
      const List3 = Object.values(tempError2);
      List3.sort((a, b) => b.Downtime - a.Downtime);
      setData6({
        DataSeries: List3,
        colors: ["linear-gradient(90deg,#ff311055,#ff3110) "],
        labels: ["Frequency"],
      });
      const tempError = {};
      response.data
        .filter((item) => item.FAIL_COUNT > 0)
        .forEach((item) => {
          if (tempError[item.NAME_MACHINE]) {
            tempError[item.NAME_MACHINE].Downtime += item.FAIL_COUNT;
          } else {
            tempError[item.NAME_MACHINE] = {
              Series: item.NAME_MACHINE,
              Downtime: item.FAIL_COUNT,
            };
          }
        });
      const List2 = Object.values(tempError);
      List2.sort((a, b) => b.Downtime - a.Downtime);
      setData5({
        DataSeries: List2,
        colors: ["linear-gradient(90deg,#ff311055,#ff3110)  "],
        labels: ["Frequency"],
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchDataErrorHistory = async (model) => {
    try {
      const response = await axiosInstance.post(
        "api/Screw/getDataErrorHistory",
        model
      );
      setDataErrorHistory(response.data || []); // Cập nhật state
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchDataForceDefault();
  }, []);

  useEffect(() => {
    setQueryMain((prev) => ({
      ...prev,
      dateFrom: paramState.params.starttime,
      dateTo: paramState.params.endtime,
      type: activeModeId,
    }));
    fetchScrewMachineStatus();
    const interval = setInterval(() => {
      fetchScrewMachineStatus();
    }, 60000);
    return () => clearInterval(interval);
  }, [paramState.params.starttime, paramState.params.endtime, activeModeId]);

  useEffect(() => {
    if (isFirstRender2.current) {
      isFirstRender2.current = false;
      return;
    }
    console.log("queryMain", queryMain);
    console.log("queryDate", queryDate);
    const newMo = {
      arr: queryMain.arr,
      dateFrom: queryDate ? queryDate + " 00:00:00" : "",
      dateTo: queryDate ? queryDate + " 23:59:59" : "",
      type: activeModeId,
    };
    fetchFATPMachineAnalysis(newMo);
    fetchDataErrorHistory(newMo);
    const interval = setInterval(() => {
      fetchFATPMachineAnalysis(newMo);
      fetchDataErrorHistory(newMo);
    }, 30 * 60000);
    return () => clearInterval(interval);
  }, [queryDate, queryMain, activeModeId]);

  const handleChangeDate = (idate) => {
    setQueryDate(idate);
  };
  const totalStatus = useMemo(() => {
    const totalPass = dataScrewMachineStatus.reduce(
      (sum, item) => sum + item[`PASS_COUNT`],
      0
    );
    const totalFail = dataScrewMachineStatus.reduce(
      (sum, item) => sum + item[`FAIL_COUNT`],
      0
    );
    const total = totalPass + totalFail;

    return {
      total: total,
      totalPass: totalPass,
      totalFail: totalFail,
    };
  }, [dataScrewMachineStatus]);

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
          header={"Mode"}
          height="40vh"
          variant="filled"
          functionHtml={
            <Box
              sx={{
                 position: "absolute", top: 0, right: 0 ,
                flexDirection: "row",
              }}
            >
              <Button
                size="small"
                onClick={() => {
                  setShowModal2(true);
                }}
              >
                <Description />
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setShowModal3(true);
                }}
              >
                <Build />
              </Button>
            </Box>
          }
        >
          <HiModal
            header={`Documment`}
            open={showModal2}
            onClose={() => setShowModal2(false)}
            widthModal={80}
            heightModal={80}
          >
            <ForceFileExplorer
              idata={dataForceDefault}
              idataMachine={dataScrewMachineStatus}
              onModelChange={fetchDataForceDefault}
            ></ForceFileExplorer>
          </HiModal>
          <HiModal
            header={`Force Default Detail`}
            open={showModal3}
            onClose={() => setShowModal3(false)}
            widthModal={80}
            heightModal={80}
          >
            <ForceDefaultDetail
              idata={dataForceDefault}
              idataMachine={dataScrewMachineStatus}
              onModelChange={fetchDataForceDefault}
            ></ForceDefaultDetail>
          </HiModal>
          <RotatingModeSelector
            activeModeaI={activeModeId}
            onChangeMode={(value) => setActiveModeId(value)}
          />
          {/* <RadialChart idata={dataFATPMachineAnalysis}></RadialChart> */}
        </HiBox>
        <HiBox
          lg={12}
          md={12}
          xs={4}
          header="Failure Analysis"
          note={"by Lines"}
          variant="filled"
          height="27.8vh"
        >
          <HiProgressBar
            idata={dataErrorHistory}
            DataSeries={Data6.DataSeries}
            Colors={Data6.colors}
            Labels={Data6.labels}
            keyFilter={"LINE"}
          />
        </HiBox>
        <HiBox
          lg={12}
          md={12}
          xs={4}
          header="Failure Analysis"
          note={"by Machine"}
          variant="filled"
          height="27.8vh"
        >
          <HiProgressBar
            idata={dataErrorHistory}
            DataSeries={Data5.DataSeries}
            Colors={Data5.colors}
            keyFilter={"NAME_MACHINE"}
            Labels={Data5.labels}
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
            {totalStatus.total}
          </ESDTotal>
          <ESDTotal
            lg={3}
            md={3}
            xs={3}
            height="15vh"
            bgColor={"linear-gradient(45deg,#2ed8b6,#59e0c5)"}
            header="Pass"
          >
            {totalStatus.totalPass}
          </ESDTotal>
          <ESDTotal
            lg={3}
            md={3}
            xs={3}
            height="15vh"
            bgColor={"linear-gradient(45deg,#ff5370,#ff869a)"}
            header="Fail"
          >
            {totalStatus.totalFail}
          </ESDTotal>
          <ESDTotal
            lg={3}
            md={3}
            xs={3}
            height="15vh"
            bgColor={"linear-gradient(45deg,#ffb640,#ffcb80)"}
            header="FPY"
          >
            {(
              ((totalStatus.totalPass || 0) / (totalStatus.total || 1)) *
              100
            ).toFixed(2)}
            %
          </ESDTotal>
        </Grid>
        <HiBox
          lg={6}
          md={6}
          xs={6}
          alarn={false}
          header="Machine Status"
          height="43vh"
          variant="filled"
          legendItem={legendItemStatus}
        >
          <TableMachineStatus
            idata={dataScrewMachineStatus}
            dataForce={dataForceDefault}
            activeModeId={activeModeId}
            model={queryMain}
          ></TableMachineStatus>
        </HiBox>
        <HiBox
          lg={6}
          md={6}
          xs={6}
          alarn={false}
          header="Total Trend"
          height="43vh"
          variant="filled"
        >
          <CABChart
            idata={dataFATPMachineAnalysis}
            onChangeDate={handleChangeDate}
          ></CABChart>
        </HiBox>
        <HiBox
          lg={6}
          md={6}
          xs={6}
          alarn={false}
          header="Next Trend"
          note={queryDate}
          height="41vh"
          variant="filled"
        >
          <LineChart idata={dataFATPMachineAnalysis}></LineChart>
        </HiBox>
        <HiBox
          lg={6}
          md={6}
          xs={6}
          alarn={false}
          header="History Error Table"
          height="41vh"
          variant="filled"
        >
          <TableErorHistory idata={dataErrorHistory}></TableErorHistory>
        </HiBox>
      </Grid>
    </Grid>
  );
};

export default memo(GlueScrewStatus);
