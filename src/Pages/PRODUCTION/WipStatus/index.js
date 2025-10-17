import React, { useRef, useState,useEffect, useCallback } from "react";
import {Grid,Box, Typography, LinearProgress,TableContainer,Table,TableHead,styled,TableRow,TableCell,TableBody, Slider, CircularProgress, Button, FormControlLabel, TextField } from "@mui/material";
import HiBox from "../../../components/HiBox";
import { useTheme } from '@mui/material/styles';
import HiModal from "../../../components/HiModal";
import { getAuthorizedAxiosIntance } from '../../../utils/axiosConfig';
import { useSelector, useDispatch} from 'react-redux';

import { useNotification } from "../../../components/HiNotification";
import { toast } from 'react-toastify';
import WipStatusTotalTrendChart from "./components/WipStatusTotalTrendChart";
import WipPieChart from "./components/WipPieChart";
import ColumnChartMR from "./components/WipStatusChartMR";
import RecoveryChart from "./components/RecoveryChart";
import TableDetail from "./components/tableDetail";
import TableStatusDetail from "./components/tableStatusDetail";
import img from './components/image/inventory2.png'


const axiosInstance = await getAuthorizedAxiosIntance();
const convertDate = (date) =>{
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const date1 = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const formarttedDate = `${year}-${month}-${date1}T${hours}:${minutes}:${seconds}`;
  return formarttedDate;
} 
const driffInMinutes = (time1 , time2) =>{
  const startTime = time1 !== '' ? new Date(time1) : new Date(convertDate(new Date()));
  const endTime = time2 !== '' ? new Date(time2) : new Date(convertDate(new Date()));
  const diffInMs = endTime - startTime;
  return Math.floor(diffInMs/(1000*60));
}

const WipStatus = () => {
    const theme = useTheme();
    const showNotification = useNotification();
    const [isLoadingData, setIsLoadingData] = useState(null);
    const [showModal1,  setShowModal1 ] = useState(null);
    const [showModal2,  setShowModal2 ] = useState(null);

    const [dataWipStatusTotalTrend, setDataWipStatusTotalTrend] = useState([]);
    const [staDate, setStaDate] = useState('');
    const [dataWipStatusNextTrend , setDataWipStatusNextTrend] = useState([]);
    const [dataWipStatusControlTime , setDataWipStatusControlTime] = useState([]);
    const [dataWipStatusDetail , setDataWipStatusDetail] = useState([]);
    const [dataWipStatusDetail_Station , setDataWipStatusDetail_Station] = useState([]);
    const [dataWipStatusDetail_ControlTimeADetail , setDataWipStatusDetail_ControlTimeADetail] = useState([]);

    const paramState = useSelector(state => state.param);
    useEffect(() => {
        const newModel = {
            dateFrom : paramState.params.starttime,
            dateTo : paramState.params.endtime
        }
   
        fetchWipStatusTotalTrend(newModel);
        fetchWipStatusControlTime();
        fetchWipStatusDetail();
    },[paramState.params.starttime,paramState.params.endtime ])

    const fetchWipStatusTotalTrend = async (model) => {
        setIsLoadingData(true);
        try {
        const response = await axiosInstance.post('api/Production/WipStatusTotalTrend', model)
          setDataWipStatusTotalTrend(response.data || []); // Cập nhật state với danh sách file
          const newDate = response.data.map(item => item.DateT).reduce((max, curr) => (curr > max ? curr : max), response.data[0].DateT) || 'null';
          setStaDate(newDate);
          fetchWipStatusNextTrend({dateTime: newDate })
        }
        catch (error) {
            console.log(error.message)
        }
        finally{
        setIsLoadingData(false);
        }
    };

    const fetchWipStatusNextTrend = async (model) => {
      setIsLoadingData(true);
      try {
      const response = await axiosInstance.post('api/Production/WipStatusNextTrend', model)
        setDataWipStatusNextTrend(response.data || []); // Cập nhật state với danh sách file
        console.log(response.data);
      }
      catch (error) {
          console.log(error.message)
      }
      finally{
      setIsLoadingData(false);
      }
  };

  const fetchWipStatusControlTime = async (model) => {
    setIsLoadingData(true);
    try {
    const response = await axiosInstance.post('api/Production/WipStatusControlTime', model)
      setDataWipStatusControlTime(response.data || []); // Cập nhật state với danh sách file
    }
    catch (error) {
        console.log(error.message)
    }
    finally{
    setIsLoadingData(false);
    }
};

  const fetchWipStatusDetail = async (model) => {
    setIsLoadingData(true);
    try {
    const response = await axiosInstance.post('api/Production/WipStatusDetail', model)
      setDataWipStatusDetail(response.data || []); // Cập nhật state với danh sách file
    }
    catch (error) {
        console.log(error.message)
    }
    finally{
    setIsLoadingData(false);
    }
  };

  const fetchWipStatusDetail_Station = async (model) => {
    setIsLoadingData(true);
    try {
    const response = await axiosInstance.post('api/Production/WipStatusDetail_Station', model)
      setDataWipStatusDetail_Station(response.data || []); // Cập nhật state với danh sách file
    }
    catch (error) {
        console.log(error.message)
    }
    finally{
    setIsLoadingData(false);
    }
  };
  
  const fetchWipStatusDetail_ControlTimeADetail = async (model) => {
    setIsLoadingData(true);
    try {
    const response = await axiosInstance.post('api/Production/WipStatusDetail_ControlTimeADetail', model)
      setDataWipStatusDetail_ControlTimeADetail(response.data || []); // Cập nhật state với danh sách file
      console.log(response.data);
    }
    catch (error) {
        console.log(error.message)
    }
    finally{
    setIsLoadingData(false);
    }
  };

  const handleTrendChart = (newModel) => {
    fetchWipStatusNextTrend(newModel);
    setStaDate(newModel.dateTime);
  }
const handleNextTrend = (newModel) => {
  const newModelQuery = {
    dateTime : staDate,
    model : newModel.model,
    station1: newModel.station1
  }
  setShowModal1(prev => ! prev);
  fetchWipStatusDetail_Station(newModelQuery);

}

const handleControlTimeADetail = (newModel) => {
  setShowModal2(prev => ! prev);
  fetchWipStatusDetail_ControlTimeADetail(newModel);
}

// console.log(dataWipStatusDetail);
const TotalInventory = dataWipStatusDetail.length > 0 && dataWipStatusDetail.reduce((sum, item) => sum + item.Total,0) ;

    
const colorsd = ['linear-gradient(45deg,#2ed8b6,#59e0c5)', 'linear-gradient(45deg,#ff9c80,#ffb59e)', 'linear-gradient(45deg,#c053ff,#c186ff)','linear-gradient(45deg,#ffbc40,#fdd38a)','linear-gradient(45deg,#ff4040,#ff8080)']
  return (
    <Grid container columns={12}>
        <HiBox lg={4} md={4} xs={12} header = {staDate} alarn={false}  height="44vh" variant="filled">
          <Box sx={{width:'100%', height:'100%', display:'flex', justifyContent: 'center', alignItems: 'center', padding: '10px'}}>
            <Box component={'img'} src={img} sx={{height: '100%'}}></Box>
          </Box>
          <Box sx={{position:'absolute', top:0, right: 0}}>
            <Typography sx={{fontWeight:'bold', fontSize: '20px'}}>Inventory:</Typography>
            <Typography >{TotalInventory}</Typography>
          </Box>
            {/* <WipPieChart idata={dataWipStatusNextTrend} ></WipPieChart> */}
        </HiBox>
        <HiBox lg={4} md={4} xs={12} header = "Total Trend" alarn={false}  height="44vh" variant="filled">
            <WipStatusTotalTrendChart onModelChange={handleTrendChart} idata={dataWipStatusTotalTrend}></WipStatusTotalTrendChart>
        </HiBox>
        <HiBox lg={4} md={4} xs={12} header = "Next Trend" note={staDate} alarn={false}  height="44vh" variant="filled">
            <HiModal header={`Detail`} open={showModal1} onClose={()=> setShowModal1(false)} widthModal={63} heightModal={47} >
                <TableStatusDetail idata={dataWipStatusDetail_Station}></TableStatusDetail>
            </HiModal>
            <ColumnChartMR onModelChange={handleNextTrend} idata={dataWipStatusNextTrend}></ColumnChartMR>
        </HiBox>
        <HiBox lg={6} md={6} xs={12} header = "SMT-WIP Control Time" alarn={false}  height="44vh" variant="filled">
            <HiModal header={`Detail`} open={showModal2} onClose={()=> setShowModal2(false)} widthModal={63} heightModal={47} >
                <TableStatusDetail idata={dataWipStatusDetail_ControlTimeADetail}></TableStatusDetail>
            </HiModal>
            <RecoveryChart onChangeInput={handleControlTimeADetail} idata={dataWipStatusControlTime}></RecoveryChart>
        </HiBox>
        <HiBox lg={6} md={6} xs={12} header = "WIP Detail" alarn={false}  height="44vh" variant="filled">
            <TableDetail onChangeInput={handleControlTimeADetail} idata={dataWipStatusDetail}></TableDetail>
        </HiBox>
    </Grid>
        
  );
};

export default WipStatus;
