import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import HiBox from "../../../components/HiBox";
import { Grid, Switch } from "@mui/material";
import { getAuthorizedAxiosIntance } from "../../../utils/axiosConfig";
import WeeklyChart from "./components/WeeklyChart";
import IssueChart from "./components/IssueChart";
import CheckingIssueChart from "./components/CheckingIssueChart";
import IssueByModelChart from "./components/IssueByModelChart";
import IssueBySlotChart from "./components/IssueBySlotChart";
import CheckingModelChart from "./components/CheckingModelChart";
import LineChart from "./components/LineChart";

const axiosInstance = await getAuthorizedAxiosIntance();

const YieldRatePTH = () => {
  const paramState = useSelector((state) => state.param);
  const [dataDefectAnalysis, setDataDefectAnalysis] = useState({});
  const [dataYeildRate, setDataYeildRate] = useState({});
  const [switchMOL, setSwitchMOL] = useState(true);
  const [listWeek, setListWeek] = useState([]);
  const [weekSelected, setWeekSelected] = useState("");
  const [issueSelected, setIssueSelected] = useState("");
  const [modelSelected, setModelSelected] = useState("");
  const [slotSelected, setSlotSelected] = useState("");
  const [listQtyProduct, setListQtyProduct] = useState([]);

  const fetchDefectAnalysis = async (model) => {
    // setDataDefectAnalysis(data1.Data);
    return data1.Data;
    try {
      const response = await axiosInstance.post(
        "api/YeildRate/getDefectAnalysis",
        model
      );
      // setDataDefectAnalysis(response.data.Data || []);
      return response.data.Data || [];
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchYeildRate = async (model) => {
    return data2.Data;
    try {
      const response = await axiosInstance.post(
        "api/YeildRate/getYeildRate",
        model
      );
      return response.data.Data || [];
    } catch (error) {
      console.log(error.message);
    }
    return [];
  };

  useEffect(() => {
    let isMounted = true;
    let intervalId;

    const load = async () => {
      const lw = getLast8WeeksCategories(
        paramState.params.endtime || paramState.params.starttime,
        8,
        true
      );

      const entries = await Promise.all(
        lw.map(async (week) => {
          const model = parseWeekToDateRange(week);
          const data = await fetchYeildRate(model);
          return [week, data];
        })
      );

      if (!isMounted) return;

      const result = Object.fromEntries(entries);
      setDataYeildRate(result);
    };

    // chạy lần đầu
    load();

    // refresh mỗi 30 phút
    intervalId = setInterval(() => {
      load();
    }, 30 * 60000);

    // cleanup
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [paramState.params.starttime, paramState.params.endtime]);

  useEffect(() => {
    let isMounted = true;
    let intervalId;

    const load = async () => {
      const lw = getLast8WeeksCategories(
        paramState.params.endtime || paramState.params.starttime,
        8,
        true
      );

      const entries = await Promise.all(
        lw.map(async (week) => {
          const model = parseWeekToDateRange(week);
          const data = await fetchDefectAnalysis(model);
          return [week, data];
        })
      );

      if (!isMounted) return;

      const result = Object.fromEntries(entries);
      setDataDefectAnalysis(result);
    };

    // chạy lần đầu
    load();

    // refresh mỗi 30 phút
    intervalId = setInterval(() => {
      load();
    }, 30 * 60000);

    // cleanup
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [paramState.params.starttime, paramState.params.endtime]);

  useEffect(() => {
    var lw = [];
    if (switchMOL)
      lw = getLast8WeeksCategories(
        paramState.params.endtime || paramState.params.starttime,
        8,
        true
      );
    else
      lw = getLast8WeeksCategories(
        paramState.params.endtime || paramState.params.starttime,
        4,
        true
      );
    setListWeek(lw);
    setWeekSelected(lw[lw.length - 1]);
  }, [switchMOL]);

  const handleChangeSwitchErAnLo = (event) => {
    setSwitchMOL(event.target.checked);
  };

  return (
    <Grid container columns={12}>
      <Grid
        size={{ lg: 8, md: 8, xs: 12 }}
        lg={3}
        md={3}
        xs={12}
        container
        columns={12}
      >
        <HiBox
          lg={7}
          md={7}
          xs={7}
          alarn={false}
          header={"Fail Rate Weekly"}
          height="47vh"
          variant="filled"
          note={switchMOL ? "8 week" : "4 week"}
        >
          <Switch
            labels={"sad"}
            checked={switchMOL}
            onChange={handleChangeSwitchErAnLo}
            sx={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}
            defaultChecked
          ></Switch>
          <WeeklyChart
            idata={dataYeildRate}
            idata2={dataDefectAnalysis}
            onSelectWeek={(e) => {
              setWeekSelected(e);
              setIssueSelected("");
              setModelSelected("");
              setSlotSelected("");
            }}
            setDataQtyProduct={(e) => setListQtyProduct(e)}
            weekSelected={weekSelected}
            switchMOL={switchMOL}
            listWeek={listWeek}
          />
        </HiBox>
        <HiBox
          lg={5}
          md={5}
          xs={12}
          alarn={false}
          header={`DIP issue`}
          height="47vh"
          variant="filled"
          note={`${weekSelected}`}
        >
          <IssueChart
            idata={dataDefectAnalysis[weekSelected]}
            issueSelected={issueSelected}
            onSelectIssue={(e) => {
              setIssueSelected(e);
              setModelSelected("");
              setSlotSelected("");
            }}
          />
        </HiBox>
        <HiBox
          lg={6}
          md={6}
          xs={12}
          alarn={false}
          header={`Top Model`}
          height="44vh"
          variant="filled"
          note={`${issueSelected} - ${weekSelected}`}
        >
          <IssueByModelChart
            idata={dataDefectAnalysis[weekSelected]}
            issueSelected={issueSelected}
            weekSelected={weekSelected}
            modelSelected={modelSelected}
            onSelectModel={(e) => {
              setModelSelected(e);
              setSlotSelected("");
            }}
          />
        </HiBox>
        <HiBox
          lg={6}
          md={6}
          xs={12}
          alarn={false}
          header={`Top Slot`}
          height="44vh"
          variant="filled"
          note={`${issueSelected} - ${modelSelected} - ${weekSelected}`}
        >
          <IssueBySlotChart
            idata={dataDefectAnalysis[weekSelected]}
            issueSelected={issueSelected}
            weekSelected={weekSelected}
            modelSelected={modelSelected}
            slotSelected={slotSelected}
            onSelectSlot={(e) => setSlotSelected(e)}
          />
        </HiBox>
      </Grid>
      <Grid
        size={{ lg: 4, md: 4, xs: 12 }}
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
          header={"Checking Issue"}
          height="32vh"
          variant="filled"
          note={`${issueSelected}`}
        >
          <CheckingIssueChart
            idata={dataDefectAnalysis}
            issueSelected={issueSelected}
            listQtyProduct={listQtyProduct}
            listWeek={
              switchMOL
                ? getLast8WeeksCategories(
                    paramState.params.endtime || paramState.params.starttime
                  )
                : getLast8WeeksCategories(
                    paramState.params.endtime || paramState.params.starttime,
                    4
                  )
            }
          />
        </HiBox>
        <HiBox
          lg={12}
          md={12}
          xs={12}
          alarn={false}
          header={"Top Line"}
          height="25vh"
          variant="filled"
          note={`${issueSelected} - ${modelSelected} - ${slotSelected} - ${weekSelected}`}
        >
          <LineChart
            idata={dataDefectAnalysis[weekSelected]}
            issueSelected={issueSelected}
            modelSelected={modelSelected}
            slotSelected={slotSelected}
            listQtyProduct={listQtyProduct}
            switchMOL={switchMOL}
            listWeek={
              switchMOL
                ? getLast8WeeksCategories(
                    paramState.params.endtime || paramState.params.starttime
                  )
                : getLast8WeeksCategories(
                    paramState.params.endtime || paramState.params.starttime,
                    4
                  )
            }
          />
        </HiBox>
        <HiBox
          lg={12}
          md={12}
          xs={12}
          alarn={false}
          header={"Tracking Model/Slot"}
          height="32vh"
          variant="filled"
          note={`${issueSelected} - ${modelSelected} - ${slotSelected}`}
        >
          <CheckingModelChart
            idata={dataDefectAnalysis}
            issueSelected={issueSelected}
            modelSelected={modelSelected}
            slotSelected={slotSelected}
            listQtyProduct={listQtyProduct}
            listWeek={
              switchMOL
                ? getLast8WeeksCategories(
                    paramState.params.endtime || paramState.params.starttime
                  )
                : getLast8WeeksCategories(
                    paramState.params.endtime || paramState.params.starttime,
                    4
                  )
            }
          />
        </HiBox>
      </Grid>
    </Grid>
  );
};

export default YieldRatePTH;

function getISOWeekInfo(date) {
  // dùng UTC để tránh lệch ngày do timezone
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );

  // ISO: Thứ 2 = 1 ... CN = 7
  const day = d.getUTCDay() || 7;

  // đưa về thứ Năm của tuần hiện tại để xác định week-year
  d.setUTCDate(d.getUTCDate() + 4 - day);

  const weekYear = d.getUTCFullYear();
  const yearStart = new Date(Date.UTC(weekYear, 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);

  return { weekNo, weekYear };
}

function getLast8WeeksCategories(selectedDate, num = 8, haveYear) {
  const base = selectedDate ? new Date(selectedDate) : new Date();

  const result = [];
  for (let i = num - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(base.getDate() - i * 7); // lùi i tuần

    const { weekNo, weekYear } = getISOWeekInfo(d);
    if (haveYear) result.push(`${weekYear}/WK${weekNo}`);
    else result.push(`WK${weekNo}`);
  }

  return result;
}

function parseWeekToDateRange(weekStr) {
  // weekStr: "2026/WK4"
  const [yearStr, weekStrNum] = weekStr.split("/WK");
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekStrNum, 10);

  // Lấy ngày 4/1 (ISO rule)
  const jan4 = new Date(year, 0, 4);

  // Thứ của 4/1 (Mon = 1, Sun = 7)
  const jan4Day = jan4.getDay() === 0 ? 7 : jan4.getDay();

  // Thứ Hai của tuần 1
  const mondayWeek1 = new Date(jan4);
  mondayWeek1.setDate(jan4.getDate() - jan4Day + 1);

  // Thứ Hai của tuần cần tìm
  const mondayTargetWeek = new Date(mondayWeek1);
  mondayTargetWeek.setDate(mondayWeek1.getDate() + (week - 1) * 7);

  // dateFrom: Monday 07:30
  const dateFrom = new Date(mondayTargetWeek);
  dateFrom.setHours(7, 30, 0, 0);

  // dateTo: Sunday 19:30
  const dateTo = new Date(mondayTargetWeek);
  dateTo.setDate(mondayTargetWeek.getDate() + 7);
  dateTo.setHours(19, 30, 0, 0);

  const format = (d) =>
    d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0") +
    String(d.getHours()).padStart(2, "0") +
    String(d.getMinutes()).padStart(2, "0");

  return {
    dateFrom: format(dateFrom),
    dateTo: format(dateTo),
  };
}

const data1 = {
  Code: "1",
  Message: "OK QUERY_DEFECT_ANALYSIS",
  Data: [
    {
      MODEL_NAME: "6353191AT00",
      TEST_LINE: "AP6",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "JEL03",
      ERROR_ITEM_CODE: "JEL03",
      TEST_CODE: "VI01",
      ERROR_DESC: "CAU THIEC",
      QTY: 35.0,
      "Rate(%)": "  15.35",
    },
    {
      MODEL_NAME: "6353191AT00",
      TEST_LINE: "AP6",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "JEL01",
      ERROR_ITEM_CODE: "JEL01",
      TEST_CODE: "VI01",
      ERROR_DESC: "CAU THIEC",
      QTY: 29.0,
      "Rate(%)": "  12.72",
    },
    {
      MODEL_NAME: "6353191AT00",
      TEST_LINE: "AP6",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "UK03",
      ERROR_ITEM_CODE: "UK03",
      TEST_CODE: "VI03",
      ERROR_DESC: "THIEU THIEC",
      QTY: 22.0,
      "Rate(%)": "   9.65",
    },
    {
      MODEL_NAME: "6353191AT00",
      TEST_LINE: "AP6",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "JEW01",
      ERROR_ITEM_CODE: "JEW01",
      TEST_CODE: "VI01",
      ERROR_DESC: "CAU THIEC",
      QTY: 19.0,
      "Rate(%)": "   8.33",
    },
    {
      MODEL_NAME: "BGW620-7001T00",
      TEST_LINE: "AP3",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "SK1200",
      ERROR_ITEM_CODE: "SK1200",
      TEST_CODE: "VI03",
      ERROR_DESC: "THIEU THIEC",
      QTY: 19.0,
      "Rate(%)": "   8.33",
    },
    {
      MODEL_NAME: "BGW620-7001T00",
      TEST_LINE: "AP3",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "J2001",
      ERROR_ITEM_CODE: "J2001",
      TEST_CODE: "VI03",
      ERROR_DESC: "THIEU THIEC",
      QTY: 17.0,
      "Rate(%)": "   7.46",
    },
    {
      MODEL_NAME: "BGW620-7002T00",
      TEST_LINE: "AP3",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "SK200",
      ERROR_ITEM_CODE: "SK200",
      TEST_CODE: "VI03",
      ERROR_DESC: "THIEU THIEC",
      QTY: 12.0,
      "Rate(%)": "   5.26",
    },
    {
      MODEL_NAME: "BGW620-7002T00",
      TEST_LINE: "AP3",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "SW1500",
      ERROR_ITEM_CODE: "SW1500",
      TEST_CODE: "VI03",
      ERROR_DESC: "THIEU THIEC",
      QTY: 10.0,
      "Rate(%)": "   4.39",
    },
    {
      MODEL_NAME: "6353191AT00",
      TEST_LINE: "AP6",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "UEL02",
      ERROR_ITEM_CODE: "UEL02",
      TEST_CODE: "VI01",
      ERROR_DESC: "CAU THIEC",
      QTY: 9.0,
      "Rate(%)": "   3.95",
    },
    {
      MODEL_NAME: "6353191AT00",
      TEST_LINE: "AP6",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "JP02",
      ERROR_ITEM_CODE: "JP02",
      TEST_CODE: "VI03",
      ERROR_DESC: "THIEU THIEC",
      QTY: 8.0,
      "Rate(%)": "   3.51",
    },
    {
      MODEL_NAME: "5608407AT00",
      TEST_LINE: "PT1",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "J5",
      ERROR_ITEM_CODE: "J5",
      TEST_CODE: "VI01",
      ERROR_DESC: "CAU THIEC",
      QTY: 5.0,
      "Rate(%)": "   2.19",
    },
    {
      MODEL_NAME: "6353191AT00",
      TEST_LINE: "AP6",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "UEL02",
      ERROR_ITEM_CODE: "UEL02",
      TEST_CODE: "VI03",
      ERROR_DESC: "THIEU THIEC",
      QTY: 5.0,
      "Rate(%)": "   2.19",
    },
    {
      MODEL_NAME: "6353191AT00",
      TEST_LINE: "AP6",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "JEL03",
      ERROR_ITEM_CODE: "JEL03",
      TEST_CODE: "VI03",
      ERROR_DESC: "THIEU THIEC",
      QTY: 5.0,
      "Rate(%)": "   2.19",
    },
    {
      MODEL_NAME: "5608407AT00",
      TEST_LINE: "PT1",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "E5402",
      ERROR_ITEM_CODE: "E5402",
      TEST_CODE: "VI03",
      ERROR_DESC: "THIEU THIEC",
      QTY: 4.0,
      "Rate(%)": "   1.75",
    },
    {
      MODEL_NAME: "BGW620-7001T00",
      TEST_LINE: "AP3",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "PL2005",
      ERROR_ITEM_CODE: "PL2005",
      TEST_CODE: "VI03",
      ERROR_DESC: "THIEU THIEC",
      QTY: 4.0,
      "Rate(%)": "   1.75",
    },
    {
      MODEL_NAME: "6339224AT00",
      TEST_LINE: "AP4",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "OCVIT",
      ERROR_ITEM_CODE: "OCVIT",
      TEST_CODE: "VI08",
      ERROR_DESC: "CAO CHAN",
      QTY: 3.0,
      "Rate(%)": "   1.32",
    },
    {
      MODEL_NAME: "6353191AT00",
      TEST_LINE: "AP6",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "JEW01",
      ERROR_ITEM_CODE: "JEW01",
      TEST_CODE: "VI03",
      ERROR_DESC: "THIEU THIEC",
      QTY: 2.0,
      "Rate(%)": "   0.88",
    },
    {
      MODEL_NAME: "6353191AT00",
      TEST_LINE: "AP6",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "JP02",
      ERROR_ITEM_CODE: "JP02",
      TEST_CODE: "VI08",
      ERROR_DESC: "CAO CHAN",
      QTY: 2.0,
      "Rate(%)": "   0.88",
    },
    {
      MODEL_NAME: "6353191AT00",
      TEST_LINE: "AP6",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "UK03",
      ERROR_ITEM_CODE: "UK03",
      TEST_CODE: "VI08",
      ERROR_DESC: "CAO CHAN",
      QTY: 2.0,
      "Rate(%)": "   0.88",
    },
    {
      MODEL_NAME: "BGW620-7001T00",
      TEST_LINE: "AP3",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "PL2004",
      ERROR_ITEM_CODE: "PL2004",
      TEST_CODE: "VI01",
      ERROR_DESC: "CAU THIEC",
      QTY: 1.0,
      "Rate(%)": "   0.44",
    },
    {
      MODEL_NAME: "BGW620-7001T00",
      TEST_LINE: "AP3",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "PL2003",
      ERROR_ITEM_CODE: "PL2003",
      TEST_CODE: "VI01",
      ERROR_DESC: "CAU THIEC",
      QTY: 1.0,
      "Rate(%)": "   0.44",
    },
    {
      MODEL_NAME: "5608407AT00",
      TEST_LINE: "PT1",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "J900",
      ERROR_ITEM_CODE: "J900",
      TEST_CODE: "VI01",
      ERROR_DESC: "CAU THIEC",
      QTY: 1.0,
      "Rate(%)": "   0.44",
    },
    {
      MODEL_NAME: "BGW620-7001T00",
      TEST_LINE: "AP3",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "SK1200",
      ERROR_ITEM_CODE: "SK1200",
      TEST_CODE: "VI01",
      ERROR_DESC: "CAU THIEC",
      QTY: 1.0,
      "Rate(%)": "   0.44",
    },
    {
      MODEL_NAME: "6353191AT00",
      TEST_LINE: "AP6",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "UK03",
      ERROR_ITEM_CODE: "UK03",
      TEST_CODE: "VI01",
      ERROR_DESC: "CAU THIEC",
      QTY: 1.0,
      "Rate(%)": "   0.44",
    },
    {
      MODEL_NAME: "6353191AT00",
      TEST_LINE: "AP6",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "SP03",
      ERROR_ITEM_CODE: "SP03",
      TEST_CODE: "VI01",
      ERROR_DESC: "CAU THIEC",
      QTY: 1.0,
      "Rate(%)": "   0.44",
    },
    {
      MODEL_NAME: "6353191AT00",
      TEST_LINE: "AP6",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "JEL01",
      ERROR_ITEM_CODE: "JEL01",
      TEST_CODE: "VI03",
      ERROR_DESC: "THIEU THIEC",
      QTY: 1.0,
      "Rate(%)": "   0.44",
    },
    {
      MODEL_NAME: "5608407AT00",
      TEST_LINE: "PT1",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "E5404",
      ERROR_ITEM_CODE: "E5404",
      TEST_CODE: "VI03",
      ERROR_DESC: "THIEU THIEC",
      QTY: 1.0,
      "Rate(%)": "   0.44",
    },
    {
      MODEL_NAME: "5608407AT00",
      TEST_LINE: "PT1",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "J5",
      ERROR_ITEM_CODE: "J5",
      TEST_CODE: "VI03",
      ERROR_DESC: "THIEU THIEC",
      QTY: 1.0,
      "Rate(%)": "   0.44",
    },
    {
      MODEL_NAME: "BGW620-7002T00",
      TEST_LINE: "AP3",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "FS1801",
      ERROR_ITEM_CODE: "FS1801",
      TEST_CODE: "VI03",
      ERROR_DESC: "THIEU THIEC",
      QTY: 1.0,
      "Rate(%)": "   0.44",
    },
    {
      MODEL_NAME: "6353191AT00",
      TEST_LINE: "AP6",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "JX04",
      ERROR_ITEM_CODE: "JX04",
      TEST_CODE: "VI03",
      ERROR_DESC: "THIEU THIEC",
      QTY: 1.0,
      "Rate(%)": "   0.44",
    },
    {
      MODEL_NAME: "BGW620-7002T00",
      TEST_LINE: "AP3",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "FS1803",
      ERROR_ITEM_CODE: "FS1803",
      TEST_CODE: "VI03",
      ERROR_DESC: "THIEU THIEC",
      QTY: 1.0,
      "Rate(%)": "   0.44",
    },
    {
      MODEL_NAME: "BGW620-7002T00",
      TEST_LINE: "AP3",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "FS1800",
      ERROR_ITEM_CODE: "FS1800",
      TEST_CODE: "VI08",
      ERROR_DESC: "CAO CHAN",
      QTY: 1.0,
      "Rate(%)": "   0.44",
    },
    {
      MODEL_NAME: "6353191AT00",
      TEST_LINE: "AP6",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "UEL02",
      ERROR_ITEM_CODE: "UEL02",
      TEST_CODE: "VI08",
      ERROR_DESC: "CAO CHAN",
      QTY: 1.0,
      "Rate(%)": "   0.44",
    },
    {
      MODEL_NAME: "6353191AT00",
      TEST_LINE: "AP6",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "JEL03",
      ERROR_ITEM_CODE: "JEL03",
      TEST_CODE: "VI08",
      ERROR_DESC: "CAO CHAN",
      QTY: 1.0,
      "Rate(%)": "   0.44",
    },
    {
      MODEL_NAME: "6353191AT00",
      TEST_LINE: "AP6",
      TEST_SECTION: "PTH",
      TEST_GROUP: "PTHVI",
      LOCATION_CODE: "JEL03",
      ERROR_ITEM_CODE: "JEL03",
      TEST_CODE: "VI12",
      ERROR_DESC: "LOI KHAC",
      QTY: 1.0,
      "Rate(%)": "   0.44",
    },
  ],
};

const data2 = {
  Code: "1",
  Message:
    "OK QUERY_YEILD_RATE Q_GROUP_PIVOT: Q_FIELD_SELECT:R.LINE_NAME,R.SECTION_NAME,R.GROUP_NAME,",
  Data: [
    {
      MODEL_NAME: "5605707AT00",
      LINE_NAME: "AP6",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 0.0,
      FAIL_QTY: 1.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 1.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "             .00",
      REPASS_QTY: 0.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "5608407AT00",
      LINE_NAME: "PT1",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 966.0,
      FAIL_QTY: 12.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 978.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "           98.77",
      REPASS_QTY: 0.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "5612369AT00",
      LINE_NAME: "AP3",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 3086.0,
      FAIL_QTY: 0.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 3086.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "          100.00",
      REPASS_QTY: 0.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "5612369AT00",
      LINE_NAME: "AP4",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 480.0,
      FAIL_QTY: 0.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 480.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "          100.00",
      REPASS_QTY: 0.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "6339224AT00",
      LINE_NAME: "AP4",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 5066.0,
      FAIL_QTY: 3.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 5069.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "           99.94",
      REPASS_QTY: 0.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "6345113AT00",
      LINE_NAME: "AP6",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 2374.0,
      FAIL_QTY: 0.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 2374.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "          100.00",
      REPASS_QTY: 0.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "6353191AT00",
      LINE_NAME: "AP6",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 2428.0,
      FAIL_QTY: 131.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 2559.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "           94.88",
      REPASS_QTY: 109.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "BGW620-7001T00",
      LINE_NAME: "AP3",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 1111.0,
      FAIL_QTY: 30.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 1141.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "           97.37",
      REPASS_QTY: 25.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "BGW620-7002T00",
      LINE_NAME: "AP3",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 2131.0,
      FAIL_QTY: 22.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 2153.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "           98.98",
      REPASS_QTY: 19.0,
      REFAIL_QTY: 0.0,
    },
    {
      MODEL_NAME: "BGW620-7002T00",
      LINE_NAME: "AP4",
      SECTION_NAME: "PTH",
      GROUP_NAME: "PTHVI",
      PASS_QTY: 2.0,
      FAIL_QTY: 0.0,
      FIRST_FAIL_QTY: 0.0,
      TOTAL_QTY: 2.0,
      FPY_RATE: "          100.00",
      YIELD_RATE: "          100.00",
      REPASS_QTY: 0.0,
      REFAIL_QTY: 0.0,
    },
  ],
};
