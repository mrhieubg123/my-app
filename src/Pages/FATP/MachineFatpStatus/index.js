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
  Grid,
  Switch,
  Button,
} from "@mui/material";
import TableMachineStatus from "./components/MachineStatus";
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
import OverTimeDetail from "./components/OverTimeDetail";
import AiSuggest from "./components/AiSuggest";
import { Description } from "@mui/icons-material";
import ESDTotal from "./components/ESDTotal";

const axiosInstance = await getAuthorizedAxiosIntance();

const FATPMachine = () => {
  const paramState = useSelector((state) => state.param);
  const [queryMain, setQueryMain] = useState({
    arr: [],
    dateFrom: "",
    dateTo: "",
  });
  const [queryDate, setQueryDate] = useState("");
  const selectedFactory = useSelector((state) => state.param.params.Factory);

  const queryMainStr = useMemo(() => JSON.stringify(queryMain.arr), [queryMain.arr]);

  const isFirstRender = useRef(true);
  const isFirstRender2 = useRef(true);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(null);
  const [isLoadingData1, setIsLoadingData1] = useState(null);
  const [isLoadingData2, setIsLoadingData2] = useState(null);
  const [dataFATPMachineStatus, setDataFATPMachineStatus] = useState([]);
  const [dataFATPMachineTotalTrend, setDataFATPMachineTotalTrend] = useState(
    []
  );
  const [dataFATPMachineAnalysis, setDataFATPMachineAnalysis] = useState([]);
  const [dataFATPMachineError5m, setDataFATPMachineError5m] = useState([]);
  const [dataFATPMachineErrorDetail, setDataFATPMachineErrorDetail] = useState(
    []
  );
  const [dataFATPErrorDetail, setDataFATPErrorDetail] = useState([]);
  const [dataFATPErrorDetailFilter, setDataFATPErrorDetailFilter] = useState(
    []
  );
  const [dataAISuggest, setDataAISuggest] = useState([]);
  const [switchErAnLo, setSwitchErAnLo] = useState(false);
  const [switchLiAnMa, setSwitchLiAnMa] = useState(false);
  const [Data5, setData5] = useState({});
  const [Data6, setData6] = useState({});

  const legendItem = useMemo(
    () => [
      { color: "#00e396", label: "Run" },
      { color: "#fdfd00", label: "Stop" },
      { color: "pink", label: "Rest" },
      { color: "#ff3110", label: "Error" },
      { color: "#808080", label: "Off" },
    ],
    []
  );

  const fetchFATPMachineStatus = async () => {
    setIsLoadingData(true);
    try {
      const response = await axiosInstance.post("api/Fatp/FATPMachineStatus", { factory: selectedFactory });
      setDataFATPMachineStatus(response.data || []); // Cập nhật state
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchFATPMachineTotalTrend = async (model, isMountedObject = { current: true }) => {
    setIsLoadingData2(true);
    try {
      const response = await axiosInstance.post(
        "api/Fatp/FATPMachineTotalTrend",
        model
      );
      if (!isMountedObject.current) return;

      const data = response.data || [];
      setDataFATPMachineTotalTrend(data);

      if (data.length > 0) {
        const lastesTimeStr = data
          .map((item) => item.DATET)
          .reduce((a, b) => (new Date(a) > new Date(b) ? a : b));
        setQueryDate(lastesTimeStr);
      } else {
        // Nếu không có dữ liệu thì có thể set về null hoặc ngày hiện tại
        setQueryDate(null);
      } // Lấy thời gian mới nhất
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoadingData2(false);
    }
  };

  const fetchFATPMachineAnalysis = async (model, isMountedObject = { current: true }) => {
    setIsLoadingData2(true);
    try {
      console.log("fetchFATPMachineAnalysis", model);
      const response = await axiosInstance.post(
        "api/Fatp/FATPMachineAnalysis",
        model
      );
      if (!isMountedObject.current) return;

      setDataFATPMachineAnalysis(response.data || []); // Cập nhật state
      const tempError = {};
      response.data
        .filter((item) => item.STATUS === "NG")
        .forEach((item) => {
          if (tempError[item.ERROR]) {
            tempError[item.ERROR].Downtime += (item.TOTALTIME * 1) / 3600;
            tempError[item.ERROR].Frequency += item.FREN * 1;
          } else {
            tempError[item.ERROR] = {
              Series: item.ERROR,
              Downtime: (item.TOTALTIME * 1) / 3600,
              Frequency: item.FREN * 1,
            };
          }
        });
      const List2 = Object.values(tempError);
      List2.sort((a, b) => b.Downtime - a.Downtime);
      setData5({
        DataSeries: List2,
        colors: [
          "linear-gradient(90deg,#ff311055,#ff3110)  ",
          "linear-gradient(90deg,#219af555,#219af5) ",
        ],
        labels: ["Frequency", "Duration(h)"],
      });
      const tempError2 = {};
      response.data
        .filter((item) => item.STATUS === "NG")
        .forEach((item) => {
          if (tempError2[item.LINE]) {
            tempError2[item.LINE].Downtime += (item.TOTALTIME * 1) / 3600;
            tempError2[item.LINE].Frequency += item.FREN * 1;
          } else {
            tempError2[item.LINE] = {
              Series: item.LINE,
              Downtime: (item.TOTALTIME * 1) / 3600,
              Frequency: item.FREN * 1,
            };
          }
        });
      const List3 = Object.values(tempError2);
      List3.sort((a, b) => b.Downtime - a.Downtime);
      setData6({
        DataSeries: List3,
        colors: [
          "linear-gradient(90deg,#ff311055,#ff3110) ",
          "linear-gradient(90deg,#219af555,#219af5) ",
        ],
        labels: ["Frequency", "Duration(h)"],
      });
      setSwitchErAnLo(false);
      setSwitchLiAnMa(false);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoadingData2(false);
    }
  };

  const fetchFATPMachineError5m = async (model, isMountedObject = { current: true }) => {
    setIsLoadingData2(true);
    try {
      const response = await axiosInstance.post(
        "api/Fatp/FATPMachineError5m",
        model
      );
      if (!isMountedObject.current) return;

      setDataFATPMachineError5m(response.data || []); // Cập nhật state
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoadingData2(false);
    }
  };

  const fetchFATPMachineErrorDetail = async (model, isMountedObject = { current: true }) => {
    setIsLoadingData2(true);
    try {
      const response = await axiosInstance.post(
        "api/Fatp/FATPMachineErrorDetail",
        model
      );
      if (!isMountedObject.current) return;

      if (model.error === "") {
        setDataAISuggest(response.data || []); // Cập nhật state
      } else {
        setDataFATPMachineErrorDetail(response.data || []); // Cập nhật state
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoadingData2(false);
    }
  };

  const fetchFATPErrorDetail = async (model, isMountedObject = { current: true }) => {
    setIsLoadingData2(true);
    try {
      const response = await axiosInstance.post(
        "api/Fatp/FATPErrorDetail",
        model
      );
      if (!isMountedObject.current) return;

      setDataFATPErrorDetail(response.data || []); // Cập nhật state
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoadingData2(false);
    }
  };

  useEffect(() => {
    fetchFATPMachineStatus();
    const interval = setInterval(() => {
      fetchFATPMachineStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedFactory]);

  useEffect(() => {
    const isMounted = { current: true };
    const newMo = {
      arr: queryMain.arr,
      dateFrom: paramState.params.starttime,
      dateTo: paramState.params.endtime,
      factory: selectedFactory,
    };
    fetchFATPMachineTotalTrend(newMo, isMounted);
    fetchFATPMachineErrorDetail({ error: "" }, isMounted);
    const interval = setInterval(() => {
      fetchFATPMachineTotalTrend(newMo);
    }, 30 * 60000);
    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [queryMainStr, paramState.params.starttime, paramState.params.endtime, selectedFactory]);

  useEffect(() => {
    if (isFirstRender2.current) {
      isFirstRender2.current = false;
      return;
    }
    const isMounted = { current: true };
    const newMo = {
      arr: queryMain.arr,
      dateFrom: queryDate ? queryDate + " 00:00:00" : "",
      dateTo: queryDate ? queryDate + " 23:59:59" : "",
      factory: selectedFactory,
    };
    fetchFATPMachineAnalysis(newMo, isMounted);
    fetchFATPErrorDetail(newMo, isMounted);
    fetchFATPMachineError5m(newMo, isMounted);
    return () => {
      isMounted.current = false;
    };
  }, [queryMainStr, queryDate, selectedFactory]);

  const handleChangeMain = useCallback((model) => {
    setQueryMain((prev) => ({
      ...prev,
      arr: model,
    }));
  }, []);

  const handleChangeSwitchErAnLo = (event) => {
    setSwitchErAnLo(event.target.checked);
    const tempError = {};
    switchErAnLo
      ? dataFATPMachineAnalysis
        .filter((item) => item.STATUS === "NG")
        .forEach((item) => {
          if (tempError[item.ERROR]) {
            tempError[item.ERROR].Downtime += (item.TOTALTIME * 1) / 3600;
            tempError[item.ERROR].Frequency += item.FREN * 1;
          } else {
            tempError[item.ERROR] = {
              Series: item.ERROR,
              Downtime: (item.TOTALTIME * 1) / 3600,
              Frequency: item.FREN * 1,
            };
          }
        })
      : dataFATPMachineAnalysis
        .filter((item) => item.STATUS === "NG")
        .forEach((item) => {
          if (tempError[item.ERROR_CODE]) {
            tempError[item.ERROR_CODE].Downtime +=
              (item.TOTALTIME * 1) / 3600;
            tempError[item.ERROR_CODE].Frequency += item.FREN * 1;
          } else {
            tempError[item.ERROR_CODE] = {
              Series: item.ERROR_CODE,
              Downtime: (item.TOTALTIME * 1) / 3600,
              Frequency: item.FREN * 1,
            };
          }
        });

    const List2 = Object.values(tempError);
    List2.sort((a, b) => b.Downtime - a.Downtime);

    setData5({
      DataSeries: List2,
      colors: [
        "linear-gradient(90deg,#ff311055,#ff3110)  ",
        "linear-gradient(90deg,#219af555,#219af5) ",
      ],
      labels: ["Frequency", "Duration(h)"],
    });
  };
  const handleChangeSwitchLiAnMa = (event) => {
    setSwitchLiAnMa(event.target.checked);
    const tempError2 = {};
    switchLiAnMa
      ? dataFATPMachineAnalysis
        .filter((item) => item.STATUS === "NG")
        .forEach((item) => {
          if (tempError2[item.LINE]) {
            tempError2[item.LINE].Downtime += (item.TOTALTIME * 1) / 3600;
            tempError2[item.LINE].Frequency += item.FREN * 1;
          } else {
            tempError2[item.LINE] = {
              Series: item.LINE,
              Downtime: (item.TOTALTIME * 1) / 3600,
              Frequency: item.FREN * 1,
            };
          }
        })
      : dataFATPMachineAnalysis
        .filter((item) => item.STATUS === "NG")
        .forEach((item) => {
          if (tempError2[item.MACHINE_NAME]) {
            tempError2[item.MACHINE_NAME].Downtime +=
              (item.TOTALTIME * 1) / 3600;
            tempError2[item.MACHINE_NAME].Frequency += item.FREN * 1;
          } else {
            tempError2[item.MACHINE_NAME] = {
              Series: item.MACHINE_NAME,
              Downtime: (item.TOTALTIME * 1) / 3600,
              Frequency: item.FREN * 1,
            };
          }
        });
    const List3 = Object.values(tempError2);
    List3.sort((a, b) => b.Downtime - a.Downtime);

    setData6({
      DataSeries: List3,
      colors: [
        // "linear-gradient(90deg,#99999955,#999999)  ",
        "linear-gradient(90deg,#ff311055,#ff3110) ",
        "linear-gradient(90deg,#219af555,#219af5) ",
      ],
      labels: ["Frequency", "Duration(h)"],
    });
  };
  const handleChangeDate = (idate) => {
    setQueryDate(idate);
  };
  const handleChangeError = (model) => {
    if (!model) {
      return;
    }
    setShowModal2((prev) => !prev);
    console.log(model);
    fetchFATPMachineErrorDetail({ error: model });
  };

  function normalizeDateTo(dateTo) {
    if (!dateTo) return null;

    // Tách hh:mm:ss
    const [hh, mm, ss] = dateTo.split(":").map(Number);

    // Nếu >= 24:00:00 thì set về 23:59:59
    if (hh >= 24) {
      return "23:59:59";
    }
    return dateTo;
  }

  const handleChangeErrorDetail = (nol) => {
    console.log("handleChangeErrorDetail", nol);
    setShowModal1((prev) => !prev);
    const newModel = {
      arr: queryMain.arr,
      dateFrom: queryDate + " " + nol.dateFrom,
      dateTo: queryDate + " " + normalizeDateTo(nol.dateTo),
    };
    const startBoundary = new Date(queryDate + " " + nol.dateFrom);
    const endBoundary = new Date(queryDate + " " + normalizeDateTo(nol.dateTo));
    const dataFilter = dataFATPErrorDetail.filter((item) => {
      const startTime = new Date(item.START_TIME);
      return startTime >= startBoundary && startTime <= endBoundary;
    });
    setDataFATPErrorDetailFilter(dataFilter);
    // fetchFATPErrorDetail(newModel);
  };

  const TotalStatus = (data) => {
    const counts = {
      TOTAL: 0,
      RUN: 0,
      STOP: 0,
      WARNING: 0,
      ERROR: 0,
      OFF: 0,
      UNKNOWN: 0,
    };

    for (const row of data) {
      // Lấy tất cả giá trị của M1..M22 (bỏ qua key LINE nếu có)
      for (const [key, val] of Object.entries(row)) {
        if (key === "LINE" || !val) continue; // bỏ qua LINE và null
        const statusToken = val.split("-/-")[0] ?? ""; // lấy token đầu tiên trước "-/-"
        // const norm = normalizeStatus(statusToken);
        counts[statusToken] = (counts[statusToken] ?? 0) + 1;
        counts["TOTAL"] += 1;
      }
    }
    return counts;
  };
  const countStatus = TotalStatus(dataFATPMachineStatus);

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
          header={queryDate}
          height="32vh"
          variant="filled"
          functionHtml={
            <Button
              sx={{ position: "absolute", top: 0, right: 0 }}
              size="small"
              onClick={() => {
                setShowModal3(true);
              }}
            >
              <Description />
            </Button>
          }
        >
          <HiModal
            header={`OverTime Infomation`}
            open={showModal3}
            onClose={() => setShowModal3(false)}
            widthModal={80}
            heightModal={80}
          >
            <OverTimeDetail
              idata={dataFATPErrorDetail}
              idataMachine={dataFATPMachineStatus}
            ></OverTimeDetail>
          </HiModal>
          <RadialChart
            idata={dataFATPMachineAnalysis}
            dataFATPErrorDetail={dataFATPErrorDetail}
          ></RadialChart>
        </HiBox>
        <HiBox
          lg={12}
          md={12}
          xs={4}
          header="Failure Analysis"
          note={switchErAnLo ? "by ErrorCode" : "by Errors"}
          variant="filled"
          height="35vh"
        >
          <Switch
            checked={switchErAnLo}
            onChange={handleChangeSwitchErAnLo}
            sx={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}
            defaultChecked
          ></Switch>
          <HiProgressBar
            idata={dataFATPErrorDetail}
            DataSeries={Data5.DataSeries}
            Colors={Data5.colors}
            Labels={Data5.labels}
            keyFilter={switchErAnLo ? "ERROR_CODE" : "ERROR_TYPE"}
          />
        </HiBox>
        <HiBox
          lg={12}
          md={12}
          xs={4}
          header="Failure Analysis"
          note={switchLiAnMa ? "by Machine" : "by Lines"}
          variant="filled"
          height="35vh"
        >
          <Switch
            checked={switchLiAnMa}
            onChange={handleChangeSwitchLiAnMa}
            sx={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}
            defaultChecked
          ></Switch>
          <HiProgressBar
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
            lg={2.4}
            md={2.4}
            xs={2.4}
            height="12vh"
            bgColor={"linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)"}
            header="Total"
          >
            {countStatus.TOTAL}
          </ESDTotal>
          <ESDTotal
            lg={2.4}
            md={2.4}
            xs={2.4}
            height="12vh"
            bgColor={"linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"}
            header="Run"
          >
            {countStatus.RUN}
          </ESDTotal>
          <ESDTotal
            lg={2.4}
            md={2.4}
            xs={2.4}
            height="12vh"
            bgColor={"linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)"}
            header="Error"
          >
            {countStatus.ERROR}
          </ESDTotal>
          <ESDTotal
            lg={2.4}
            md={2.4}
            xs={2.4}
            height="12vh"
            bgColor={"linear-gradient(135deg, #f09819 0%, #edde5d 100%)"}
            header="Stop"
          >
            {countStatus.STOP}
          </ESDTotal>
          <ESDTotal
            lg={2.4}
            md={2.4}
            xs={2.4}
            height="12vh"
            bgColor={"linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)"}
            header="Off"
          >
            {countStatus.OFF}
          </ESDTotal>
        </Grid>
        <HiBox
          lg={12}
          md={12}
          xs={12}
          alarn={false}
          header="FATP Machine Status"
          height="47vh"
          variant="filled"
          legendItem={legendItem}
        >
          <HiModal
            header={`ErrorCode details and Fixes`}
            open={showModal2}
            onClose={() => setShowModal2(false)}
            widthModal={60}
            heightModal={80}
          >
            <TableError idata={dataFATPMachineErrorDetail}></TableError>
          </HiModal>
          <TableMachineStatus
            onModelChange={handleChangeMain}
            onModelChange2={handleChangeError}
            idata={dataFATPMachineStatus}
          >
            {" "}
          </TableMachineStatus>
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
            idata={dataFATPMachineTotalTrend}
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
          height="43vh"
          variant="filled"
        >
          <LineChart idata={dataFATPMachineAnalysis}></LineChart>
        </HiBox>
      </Grid>
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
          xs={12}
          alarn={false}
          header="AI Suggest"
          height="41vh"
          variant="filled"
          background="linear-gradient(45deg,#4099ff,#40f9ff75)"
        >
          <AiSuggest
            idata={dataAISuggest.filter((item) => item.Total * 1 > 0)}
          ></AiSuggest>
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
          header="Failure Analysis"
          note={queryDate}
          height="41vh"
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
          <AnalysisChart
            onQuery={handleChangeErrorDetail}
            idata={dataFATPMachineAnalysis.filter(
              (item) => item.STATUS === "NG"
            )}
          ></AnalysisChart>
        </HiBox>
        <HiBox
          lg={6}
          md={6}
          xs={6}
          alarn={false}
          header="Failure Analysis Detail"
          note="Over 10m"
          height="41vh"
          variant="filled"
        >
          <TableErorOver5m idata={dataFATPMachineError5m}></TableErorOver5m>
        </HiBox>
      </Grid>
    </Grid>
  );
};

export default memo(FATPMachine);
