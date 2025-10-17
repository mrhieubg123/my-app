import React, { useRef, useState,useEffect, useCallback } from "react";
import {Grid,Box, Typography, LinearProgress,TableContainer,Table,TableHead,styled,TableRow,TableCell,TableBody, Slider, CircularProgress, Button, FormControlLabel, TextField } from "@mui/material";
import HiBox from "../../../components/HiBox";
import { useTheme } from '@mui/material/styles';
import HiModal from "../../../components/HiModal";
import { getAuthorizedAxiosIntance } from '../../../utils/axiosConfig';
import { useSelector, useDispatch} from 'react-redux';
import HiPieChart from "../../../components/HiChart/HiPieChart";

import { useNotification } from "../../../components/HiNotification";
import { toast } from 'react-toastify';

// import TrainArcDiagram from "./components/MoChartStation";

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





const SMTYieldRate = () => {
    const theme = useTheme();
    const showNotification = useNotification();

    const [isLoadingData, setIsLoadingData] = useState(null);

    const paramState = useSelector(state => state.param);
    

    useEffect(() => {
        const newModel = {
            dateFrom : paramState.params.starttime,
            dateTo : paramState.params.endtime
        }
   
        fetchMoTotalTrend(newModel);
    },[paramState.params.starttime,paramState.params.endtime ])

   

   
    const fetchMoTotalTrend = async (model) => {
        setIsLoadingData(true);
        try {
        const response = await axiosInstance.post('api/Production/MoTotalTrend', model)
        (response.data || []); // Cập nhật state với danh sách file
        }
        catch (error) {
            console.log(error.message)
        }
        finally{
        setIsLoadingData(false);
        }
    };

    
const colorsd = ['linear-gradient(45deg,#2ed8b6,#59e0c5)', 'linear-gradient(45deg,#ff9c80,#ffb59e)', 'linear-gradient(45deg,#c053ff,#c186ff)','linear-gradient(45deg,#ffbc40,#fdd38a)','linear-gradient(45deg,#ff4040,#ff8080)']
  return (
    <Grid container columns={12}>
        <HiBox lg={4} md={4} xs={12} header = "Total Trend" alarn={false}  height="44vh" variant="filled">
            
        </HiBox>
        <HiBox lg={4} md={4} xs={12} header = "MO Status" alarn={false}  height="44vh" variant="filled">
            
        </HiBox>
        <HiBox lg={4} md={4} xs={12} header = "MO Status" alarn={false}  height="44vh" variant="filled">
            
        </HiBox>
        <HiBox lg={6} md={6} xs={12} header = "MO Status" alarn={false}  height="44vh" variant="filled">
            
        </HiBox>
        <HiBox lg={6} md={6} xs={12} header = "MO Status" alarn={false}  height="44vh" variant="filled">
            
        </HiBox>
    </Grid>
        
  );
};

export default SMTYieldRate;
