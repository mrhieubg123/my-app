import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import HiBox from "../../../components/HiBox";
import { Grid, Box, Typography, Icon } from "@mui/material";
import {
  Functions,
  RadioButtonUnchecked,
  Check,
  Error,
} from "@mui/icons-material";
import { getAuthorizedAxiosIntance } from "../../../utils/axiosConfig";
import TableTemperatureMachineStatus from "./components/MachineStatus";
import { styled } from "@mui/material/styles";

const axiosInstance = await getAuthorizedAxiosIntance();

const DataTemperatureScreen = () => {
  const paramState = useSelector((state) => state.param);
  const [queryMain, setQueryMain] = useState({ arr: [], timet: "", datet: "" });
  const [queryDate, setQueryDate] = useState("");

  const isFirstRender = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(null);
  const [isLoadingData2, setIsLoadingData2] = useState(null);
  const [dataTemperatureMachineStatus, setDataTemperatureMachineStatus] =
    useState([]);
  const [dataGelListError, setDataGelListError] = useState([]);
  const [dataTotal, setDataTotal] = useState([0, 0, 0]);

  const legendItemGel = useMemo(
    () => [
      { color: "#00e396", label: "Checked" },
      { color: "#fdfd00", label: "Uncheck" },
      { color: "#ff3110", label: "Over Spec" },
    ],
    []
  );

  // Styled component cho phần chứa icon và số liệu
  const IconNumberWrapper = styled(Box)({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // Đẩy icon và số liệu ra hai đầu
    width: "100%", // Chiếm toàn bộ chiều rộng của thẻ
    marginTop: "auto", // Đẩy xuống cuối thẻ
  });

  const fetchTemperatureMachineStatus = async () => {
    setIsLoadingData(true);
    try {
      const response = await axiosInstance.get(
        "api/ME/getTemperatureMachineStatus"
      );
      setDataTemperatureMachineStatus(response.data || []); // Cập nhật state
      var totalCheck = 0;
      var totalUnCheck = 0;
      var totalOver = 0;
      (response.data || []).map((dataRow) => {
        if (
          +dataRow?.TEMP < +dataRow?.TEMP_MAX &&
          +dataRow?.TEMP > +dataRow?.TEMP_MIN
        )
          totalCheck++;
        else if (
          +dataRow?.TEMP > +dataRow?.TEMP_MAX ||
          +dataRow?.TEMP < +dataRow?.TEMP_MIN
        )
          totalOver++;
        else totalUnCheck++;
      });
      setDataTotal([totalCheck, totalUnCheck, totalOver]);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoadingData(false);
    }
  };

  // const fetchDataGelListError = async (model) => {
  //   setIsLoadingData2(true);
  //   try {
  //     const response = await axiosInstance.post(
  //       "api/Gel/getDataGelListError",
  //       model
  //     );
  //     setDataGelListError(response.data || []); // Cập nhật state
  //   } catch (error) {
  //     console.log(error.message);
  //   } finally {
  //     setIsLoadingData2(false);
  //   }
  // };

  useEffect(() => {
    const newModel = {
      dateFrom: paramState.params.starttime,
      dateTo: paramState.params.endtime,
    };
    setQueryMain((prev) => ({
      ...prev,
      dateFrom: paramState.params.starttime,
      dateTo: paramState.params.endtime,
    }));
    fetchTemperatureMachineStatus();
    const interval = setInterval(() => {
      fetchTemperatureMachineStatus();
    }, 30000);
    return () => clearInterval(interval);
  }, [paramState.params.starttime, paramState.params.endtime]);



  const cardComponent = (name, value, icon, background) => {
    return (
      <HiBox lg={3} md={3} xs={3} alarn={false} height="15vh" variant="filled" background={background}>
        <Box
          component={"div"}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
            height: "100%",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "600", color: "white" }}>
            {name}
          </Typography>
          <IconNumberWrapper>
            <Icon component={icon} sx={{ fontSize: 36, color: "white" }} />{" "}
            {/* Icon lịch */}
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "white" }}
            >
              {value}
            </Typography>
          </IconNumberWrapper>
        </Box>
      </HiBox>
    );
  };

  return (
    <Grid container columns={12}>
      <Grid size={{ lg: 12, md: 12, xs: 12 }} lg={12} md={12} xs={12} container columns={12}>
        <Grid size={{ lg: 12, md: 12, xs: 12 }} lg={12} md={12} xs={12} container columns={12}>
          {cardComponent(
            "Total Machine",
            dataTemperatureMachineStatus.length,
            Functions,
            "linear-gradient(45deg,#2566e8,#2566e870)"
          )}
          {cardComponent(
            "Checked",
            dataTotal[0],
            Check,
            "linear-gradient(45deg,#00e396,#00e39670)"
          )}
          {cardComponent(
            "Uncheck",
            dataTotal[1],
            RadioButtonUnchecked,
            "linear-gradient(45deg,#f1c40f,#f1c40f70)"
          )}
          {cardComponent(
            "Over Spec",
            dataTotal[2],
            Error,
            "linear-gradient(45deg,#ff3110,#ff311070)"
          )}
        </Grid>
        <HiBox
          lg={12}
          md={12}
          xs={12}
          alarn={false}
          header="Temperature Machine Status"
          height="73vh"
          variant="filled"
          legendItem={legendItemGel}
        >
          <TableTemperatureMachineStatus idata={dataTemperatureMachineStatus} />
        </HiBox>
       
      </Grid>
      {/* <Grid lg={6} md={6} xs={12} container columns={12}>
        <Grid lg={12} md={12} xs={12} container columns={12}>
          {cardComponent(
            "Total Machine",
            dataTemperatureMachineStatus.length,
            Functions,
            "linear-gradient(45deg,#2566e8,#2566e870)"
          )}
          {cardComponent(
            "Checked",
            dataTotal[0],
            Check,
            "linear-gradient(45deg,#00e396,#00e39670)"
          )}
          {cardComponent(
            "Uncheck",
            dataTotal[1],
            RadioButtonUnchecked,
            "linear-gradient(45deg,#f1c40f,#f1c40f70)"
          )}
          {cardComponent(
            "Over Spec",
            dataTotal[2],
            Error,
            "linear-gradient(45deg,#ff3110,#ff311070)"
          )}
        </Grid>
        <HiBox
          lg={12}
          md={12}
          xs={12}
          alarn={false}
          header="Tốc độ hút gió lò và router"
          height="60vh"
          variant="filled"
          legendItem={legendItemGel}
        >
          <TableTemperatureMachineStatus idata={dataTemperatureMachineStatus} />
        </HiBox>
      </Grid> */}
      {/* <Grid lg={12} md={12} xs={12} container columns={12}>
        <TableError/>
      </Grid> */}
    </Grid>
  );
};

export default memo(DataTemperatureScreen);
