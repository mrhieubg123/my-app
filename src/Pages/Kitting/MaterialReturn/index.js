import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import HiBox from "../../../components/HiBox";
import { Grid, Switch } from "@mui/material";
import dayjs from "dayjs";
import CABChart from "./components/CABChart";
import HiProgressBar from "./components/FailureAnalysis";
import AnalysisChart from "./components/AnalysisChart";
import { getAuthorizedAxiosIntance } from "../../../utils/axiosConfig";
import LineChart from "./components/LineChart";
import RadialChart from "./components/RadialChart";
import TableErorOver5m from "./components/tableErrorOver10m";
import HiModal from "../../../components/HiModal";
import TableError from "./components/tableError";
import TableErrorMaterialReturnStatus from "./components/tableErrorMaterialReturnStarus";
import TableWoOverTime from "./components/tableWoOverTime";

const axiosInstance = await getAuthorizedAxiosIntance();

const MOCK_DATA = [
  {
    tr_sn: "SN12345",
    wo: "wo1234",
    model: "model1234",
    kp_no: "KP1234",
    station: "STATION1",
    slot_no: "SLOT1",
    end_time: "2025/10/21 07:40:00",
    emp_no: "EMP1234",
    status: "Wait return",
    slot_request: 10000,
    return_qty: 3000,
  },
  {
    tr_sn: "SN123450",
    wo: "wo1234",
    model: "model1234",
    kp_no: "KP1234",
    station: "STATION1",
    slot_no: "SLOT1",
    end_time: "2025/10/21 07:40:00",
    emp_no: "EMP1234",
    status: "Wait return",
    slot_request: 10000,
    return_qty: 3000,
  },
  {
    tr_sn: "SN123451",
    wo: "wo1234",
    model: "model1234",
    kp_no: "KP1234",
    station: "STATION1",
    slot_no: "SLOT1",
    end_time: "2025/10/21 07:40:00",
    emp_no: "EMP1234",
    status: "Wait return",
    slot_request: 10000,
    return_qty: 3000,
  },
  {
    tr_sn: "SN123452",
    wo: "wo1234",
    model: "model1234",
    kp_no: "KP1234",
    station: "STATION1",
    slot_no: "SLOT1",
    end_time: "2025/10/21 07:40:00",
    emp_no: "EMP1234",
    status: "Wait return",
    slot_request: 10000,
    return_qty: 3000,
  },
  {
    tr_sn: "SN123453",
    wo: "wo1234",
    model: "model1234",
    kp_no: "KP1234",
    station: "STATION1",
    slot_no: "SLOT1",
    end_time: "2025/10/21 07:40:00",
    emp_no: "EMP1234",
    status: "Wait return",
    slot_request: 10000,
    return_qty: 3000,
  },
];
const MOCK_DATA2 = [
  {
    tr_sn: "SN123456",
    wo: "wo1234",
    model: "model1234",
    kp_no: "KP1234",
    station: "STATION1",
    slot_no: "SLOT1",
    end_time: "2025/10/21 07:40:00",
    emp_no: "EMP1234",
    status: "LOCK WAIT UNLOCK",
    slot_request: 10000,
    return_qty: 3000,
  },
  {
    tr_sn: "SN123458",
    wo: "wo1234",
    model: "model1234",
    kp_no: "KP1234",
    station: "STATION1",
    slot_no: "SLOT1",
    end_time: "2025/10/21 07:40:00",
    emp_no: "EMP1234",
    status: "LOCK WAIT UNLOCK",
    slot_request: 10000,
    return_qty: 3000,
  },
  {
    tr_sn: "SN123457",
    wo: "wo1234",
    model: "model1234",
    kp_no: "KP1234",
    station: "STATION1",
    slot_no: "SLOT1",
    end_time: "2025/10/21 07:40:00",
    emp_no: "EMP1234",
    status: "OK",
    slot_request: 10000,
    return_qty: 3000,
  },
];
const MOCK_DATA3 = [
  {
    TR_SN: "SN123459",
    WO: "wo1234",
    MODEL: "model1234",
    KP_NO: "KP1234",
    STATION: "STATION1",
    SLOT_NO: "SLOT1",
    END_TIME: "2025/10/21 07:40:00",
    EMP_NO: "EMP1234",
    TYPE: "Wait count",
    SLOT_REQUEST: 10000,
    RETURN_QTY: 3000,
  },
  {
    TR_SN: "SN12345",
    WO: "wo1234",
    MODEL: "model1234",
    KP_NO: "KP1234",
    STATION: "STATION1",
    SLOT_NO: "SLOT1",
    END_TIME: "2025/10/21 07:40:00",
    EMP_NO: "EMP1234",
    TYPE: "Online",
    SLOT_REQUEST: 10000,
    RETURN_QTY: 3000,
  },
  {
    TR_SN: "SN123458",
    WO: "wo1234",
    MODEL: "model1234",
    KP_NO: "KP1234",
    STATION: "STATION1",
    SLOT_NO: "SLOT1",
    END_TIME: "2025/10/21 07:40:00",
    EMP_NO: "EMP1234",
    TYPE: "Wait count",
    SLOT_REQUEST: 10000,
    RETURN_QTY: 3000,
  },
];

const MaterialReturn = () => {
  const paramState = useSelector((state) => state.param);
  const [queryMain, setQueryMain] = useState({ arr: [], timet: "", datet: "" });
  const [queryDate, setQueryDate] = useState("");
  const [modalData, setModalData] = useState([]);
  const isFirstRender = useState(true);
  const isFirstRender2 = useState(true);
  const [showModal2, setShowModal2] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(null);
  const [isLoadingData2, setIsLoadingData2] = useState(null);
  const [dataMaterialReturnStatus, setDataMaterialReturnStatus] = useState([]);
  const [
    dataMaterialReturnStatusTotalTrend,
    setDataMaterialReturnStatusTotalTrend,
  ] = useState([]);
  const [dataMaterialReturn, setDataMaterialReturn] = useState([]);
  const [dataMaterialKitting, setDataMaterialKitting] = useState([]);
  const [dataMaterialKittingTotalTrend, setDataMaterialKittingTotalTrend] =
    useState([]);
  const [dataMaterialReturnTotalTrend, setDataMaterialReturnTotalTrend] =
    useState([]);
  const [dataFATPMachineAnalysis, setDataFATPMachineAnalysis] = useState([]);
  const [Data5, setData5] = useState({});
  const [Data6, setData6] = useState({});

  const dataMaterialReal = useMemo(() => {
    const listTRSN = new Set(
      dataMaterialReturnStatus.map((item) => item.TR_SN)
    );
    const result = dataMaterialReturn.filter(
      (item) => !listTRSN.has(item.tr_sn)
    );
    const tempError = {};
    result.forEach((item) => {
      if (tempError[item.kp_no]) {
        tempError[item.kp_no].Frequency += 1;
      } else {
        tempError[item.kp_no] = { Series: item.kp_no, Frequency: 1 };
      }
    });
    const List2 = Object.values(tempError);
    List2.sort((a, b) => b.Frequency - a.Frequency);
    setData5({
      DataSeries: List2,
      listData: result || [],
      colors: ["linear-gradient(90deg,#ff311055,#ff3110)"],
      labels: ["Wait Return"],
    });
    return result;
  }, [dataMaterialReturnStatus, dataMaterialReturn]);

  const dataWaitCountReal = useMemo(() => {
    const listTRSN = new Set(dataMaterialKitting.map((item) => item.tr_sn));
    const result = dataMaterialReturnStatus
      .filter((item) => !listTRSN.has(item.TR_SN) && item.TYPE === "Wait count")
      .map((item) => ({
        tr_sn: item.TR_SN,
        wo: item.WO,
        model: item.MODEL,
        kp_no: item.KP_NO,
        station: item.STATION,
        slot_no: item.SLOT_NO,
        end_time: item.END_TIME,
        emp_no: item.EMP_NO,
        status: item.TYPE,
        slot_request: item.SLOT_REQUEST,
        return_qty: item.RETURN_QTY,
      }));
    return result;
  }, [dataMaterialReturnStatus, dataMaterialKitting]);

  const dataMaterialTotalTrendReal = useMemo(() => {
    const listTRSN = new Set(
      dataMaterialReturnStatusTotalTrend.map((item) => item.TR_SN)
    );
    const result = dataMaterialReturnTotalTrend.filter(
      (item) => !listTRSN.has(item.tr_sn)
    );
    return result;
  }, [dataMaterialReturnStatusTotalTrend, dataMaterialReturnTotalTrend]);

  const dataWaitCountTotalTrendReal = useMemo(() => {
    const listTRSN = new Set(
      dataMaterialKittingTotalTrend.map((item) => item.tr_sn)
    );
    const result = dataMaterialReturnStatusTotalTrend
      .filter((item) => !listTRSN.has(item.TR_SN) && item.TYPE === "Wait count")
      .map((item) => ({
        tr_sn: item.TR_SN,
        wo: item.WO,
        model: item.MODEL,
        kp_no: item.KP_NO,
        station: item.STATION,
        slot_no: item.SLOT_NO,
        end_time: item.END_TIME,
        emp_no: item.EMP_NO,
        status: item.TYPE,
        slot_request: item.SLOT_REQUEST,
        return_qty: item.RETURN_QTY,
      }));
    return result;
  }, [dataMaterialReturnStatusTotalTrend, dataMaterialKittingTotalTrend]);

  const fetchMaterialReturnStatus = async (model) => {
    const newMo = model || {
      dateFrom: paramState.params.starttime,
      dateTo: paramState.params.endtime,
    };
    try {
      const response = await axiosInstance.post(
        "api/MaterialReturn/getDataMaterialReturnStatus",
        newMo
      );
      //   const response = { data: MOCK_DATA3 };
      setDataMaterialReturnStatus(response.data || []);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchMaterialReturn = async (model) => {
    setIsLoadingData(true);
    try {
      const response = await axiosInstance.post(
        "api/MaterialReturn/getMaterialReturn",
        model
      );
      //   const response = { data: MOCK_DATA };
      setDataMaterialReturn(response.data || []);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchMaterialReturnTotalTrend = async (model) => {
    setIsLoadingData(true);
    try {
      //   const response = await axiosInstance.post(
      //     "api/MaterialReturn/getMaterialReturnTotalTrend",
      //     model
      //   );
      const response = { data: MOCK_DATA3 };
      setDataMaterialReturnStatusTotalTrend(response.data || []);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchMaterialKitting = async (model) => {
    setIsLoadingData(true);
    try {
      const response = await axiosInstance.post(
        "api/MaterialReturn/getMaterialKiting",
        model
      );
      setDataMaterialKitting(response.data || []);
      //   const response = { data: MOCK_DATA2 };
      setDataMaterialKitting(MOCK_DATA2);
      const tempError = {};
      (response.data || [])
        .filter((item) => item.status === "LOCK WAIT UNLOCK")
        .forEach((item) => {
          if (tempError[item.kp_no]) {
            tempError[item.kp_no].Frequency += 1;
          } else {
            tempError[item.kp_no] = { Series: item.kp_no, Frequency: 1 };
          }
        });
      const List2 = Object.values(tempError);
      List2.sort((a, b) => b.Frequency - a.Frequency);
      setData6({
        DataSeries: List2,
        listData: (response.data || []).filter(
          (item) => item.status === "LOCK WAIT UNLOCK"
        ),
      });
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchMaterialKitingTotalTrend = async (model) => {
    setIsLoadingData2(true);
    try {
      const response = await axiosInstance.post(
        "api/MaterialReturn/getMaterialKitingTotalTrend",
        model
      );
      //   const response = { data: MOCK_DATA2 };
      setDataMaterialKittingTotalTrend(response.data || []); // Cập nhật state
      const response2 = await axiosInstance.post(
        "api/MaterialReturn/getMaterialReturnTotalTrend",
        model
      );
      //   const response2 = { data: MOCK_DATA };
      setDataMaterialReturnTotalTrend(response2.data || []); // Cập nhật state
      const lastesTimeStr = Object.values(response2.data)
        .map((item) => item.end_time)
        .reduce((a, b) => (new Date(a) > Date(b) ? a : b));
      setQueryDate(dayjs(lastesTimeStr).format("YYYY-MM-DD"));
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoadingData2(false);
    }
  };

  useEffect(() => {
    const newMo = {
      dateFrom: paramState.params.starttime,
      dateTo: paramState.params.endtime,
    };
    fetchMaterialReturn(newMo);
    fetchMaterialKitting(newMo);
    fetchMaterialReturnStatus(newMo);
    fetchMaterialReturnTotalTrend(newMo);
    fetchMaterialKitingTotalTrend(newMo);
    const interval = setInterval(() => {
      fetchMaterialReturn(newMo);
      fetchMaterialKitting(newMo);
      fetchMaterialReturnStatus(newMo);
      fetchMaterialReturnTotalTrend(newMo);
      fetchMaterialKitingTotalTrend(newMo);
    }, 60000 * 30);
    return () => clearInterval(interval);
  }, [paramState.params.starttime, paramState.params.endtime]);

  const handleChangeDate = (idate) => {
    setQueryDate(idate);
  };

  const handleOpenModal = (data) => {
    setModalData(data);
    setShowModal2(true);
  };

  return (
    <Grid container columns={12}>
      <Grid
        size={{ lg: 4, md: 4, xs: 12 }}
        lg={4}
        md={4}
        xs={12}
        container
        columns={12}
      >
        <HiBox
          lg={12}
          md={12}
          xs={4}
          alarn={false}
          header={""}
          height="32vh"
          variant="filled"
        >
          <HiModal
            header={`List detail`}
            open={showModal2}
            onClose={() => setShowModal2(false)}
            widthModal={80}
            heightModal={80}
          >
            <TableError
              idata={modalData}
              onConfirmSucces={fetchMaterialReturnStatus}
            ></TableError>
          </HiModal>
          <RadialChart
            idata={dataMaterialReal}
            idata2={dataMaterialKitting}
            idata3={dataWaitCountReal}
            onShowModal={handleOpenModal}
          ></RadialChart>
        </HiBox>
        <HiBox
          lg={12}
          md={12}
          xs={4}
          header="Wait return overtime"
          variant="filled"
          height="30vh"
        >
          <TableWoOverTime
            idata={dataMaterialReal}
            onShowModal={handleOpenModal}
          ></TableWoOverTime>
        </HiBox>
        <HiBox
          lg={12}
          md={12}
          xs={4}
          header="Wait count/LCR overtime"
          variant="filled"
          height="30vh"
        >
          <TableErorOver5m
            idata={[
              ...dataWaitCountReal,
              ...dataMaterialKitting.filter(
                (item) => item.status === "LOCK WAIT UNLOCK"
              ),
            ]}
            onShowModal={handleOpenModal}
          ></TableErorOver5m>
        </HiBox>
      </Grid>
      <Grid
        size={{ lg: 4, md: 4, xs: 12 }}
        lg={4}
        md={4}
        xs={12}
        container
        columns={12}
      >
        <HiBox
          lg={12}
          md={12}
          xs={12}
          alarn={false}
          header="Material Return Status"
          height="48vh"
          variant="filled"
        >
          {/* <Switch checked={switchErAnLo} onChange={handleChangeSwitchErAnLo} sx={{ position: 'absolute', top: 0, right: 0, zIndex: 2 }} defaultChecked ></Switch> */}
          <HiProgressBar
            DataSeries={Data5.DataSeries}
            idata={Data5.listData}
            DataSeries2={Data6.DataSeries}
            idata2={Data6.listData}
            onShowModal={handleOpenModal}
          />
        </HiBox>
        <HiBox
          lg={12}
          md={12}
          xs={12}
          alarn={false}
          header="Next trend"
          note={"by Day"}
          height="48vh"
          variant="filled"
        >
          <LineChart
            idata={dataMaterialTotalTrendReal}
            idata2={dataMaterialKittingTotalTrend}
            idata3={dataWaitCountTotalTrendReal}
            queryDate={queryDate}
          ></LineChart>
        </HiBox>
      </Grid>
      <Grid
        size={{ lg: 4, md: 4, xs: 12 }}
        lg={4}
        md={4}
        xs={12}
        container
        columns={12}
      >
        <HiBox
          lg={12}
          md={12}
          xs={4}
          header="Total Trend"
          note={"by Day"}
          variant="filled"
          height="48vh"
        >
          <CABChart
            idata={dataMaterialKittingTotalTrend}
            idata2={dataMaterialTotalTrendReal}
            idata3={dataWaitCountTotalTrendReal}
            onChangeDate={handleChangeDate}
          ></CABChart>
        </HiBox>
        <HiBox
          lg={12}
          md={12}
          xs={4}
          header="Total Trend"
          note={queryDate}
          variant="filled"
          height="48vh"
        >
          <AnalysisChart
            idata={dataMaterialTotalTrendReal}
            idata2={dataMaterialKittingTotalTrend}
            idata3={dataWaitCountTotalTrendReal}
            queryDate={queryDate}
            onShowModal={handleOpenModal}
          ></AnalysisChart>
        </HiBox>
      </Grid>
      <Grid
        size={{ lg: 12, md: 12, xs: 12 }}
        lg={12}
        md={12}
        xs={12}
        container
        columns={12}
      >
        <HiBox
          lg={12}
          md={12}
          xs={12}
          header="Abnormal material return"
          variant="filled"
          height="30vh"
        >
          <TableErrorMaterialReturnStatus
            idata={dataMaterialReturnStatus}
          ></TableErrorMaterialReturnStatus>
        </HiBox>
      </Grid>
    </Grid>
  );
};

export default memo(MaterialReturn);
