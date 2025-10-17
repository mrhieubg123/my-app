import React, { useRef, useState,useEffect, useCallback } from "react";
import {Grid,Box, Typography, LinearProgress,TableContainer,Table,TableHead,styled,TableRow,TableCell,TableBody, Slider, CircularProgress, Button, FormControlLabel, TextField } from "@mui/material";
import HiBox from "../../../components/HiBox";
import { useTheme } from '@mui/material/styles';
import HiModal from "../../../components/HiModal";
import { getAuthorizedAxiosIntance } from '../../../utils/axiosConfig';
import { useSelector, useDispatch} from 'react-redux';
import MOTotal from "./components/MOTotal";
import MoComponentDetail from "./components/MoComponentDetail";
import HiPieChart from "../../../components/HiChart/HiPieChart";
import ColumnChart from "./components/MoChart";
import DailyMoStatus from "./components/DailyMoStatus";
import { useNotification } from "../../../components/HiNotification";
import { toast } from 'react-toastify';
import PieChart from "./components/PieChart";

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





const MOControl = () => {
    const theme = useTheme();
    const showNotification = useNotification();

    const [isLoadingData, setIsLoadingData] = useState(null);
    const [isLoadingDataDailyMoStatus, setIsLoadingDataDailyMoStatus] = useState(null);
    const [isLoadingConfirm, setIsLoadingConfirm] = useState(null);
    const [totalMOOpenInMonth, setTotalMOOpenInMonth] = useState(null);
    

    const paramState = useSelector(state => state.param);
    const [openModal1, setOpenModal1] = useState(false);
    const [openModal2, setOpenModal2] = useState(false);


    const [modelSelect, setModelSelect] = useState('');
    const [dataMOStatus,setDataMOStatus] = useState([]);
    const [dataMOStation,setDataMOStation ] = useState([]);
    const [dataMOStatusMM, setDataMOStatusMM] = useState([]);
    const [dataMO_WipOverTime, setDataMO_WipOverTime] = useState([]);
    const [dataMoOverTime, setDataMoOverTime] = useState([]);
    const [dataMoOpenInMonth, setDataMoOpenInMonth ] = useState([]);
    const [dataMoTotalTrend, setDataMoTotalTrend ] = useState([]);
    const [dataDailyMoStatus, setDataDailyMoStatus] = useState([]);
    const [dataMoOpenInMonthDetail, setDataMoOpenInMonthDetail] = useState([]);

    const [statusConfirm, setStatusConfirm] = useState();




    useEffect(() => {
        const newModel = {
            dateFrom : paramState.params.starttime,
            dateTo : paramState.params.endtime
        }
        fetchMOStatus();
        fetchMOStation();
        fetchMOStatusMM();
        fetchMO_WipOverTime();
        fetchMoOverTime();
        fetchMoOpenInMonth();
        fetchMoTotalTrend(newModel);
    },[paramState.params.starttime,paramState.params.endtime ])

    const fetchMOStatusMM = async () => {
        setIsLoadingData(true);
        try {
        const response = await axiosInstance.get('api/Production/MOStatusMM')
        setDataMOStatusMM(response.data || []); // Cập nhật state với danh sách file
        }
        catch (error) {
            console.log(error.message)
        }
        finally{
        setIsLoadingData(false);
        }
    };

    const fetchMOStatus = async (model) => {
        setIsLoadingData(true);
        try {
        const response = await axiosInstance.post('api/Production/MoStatus', model)
        setDataMOStatus(response.data || []); // Cập nhật state với danh sách file
        }
        catch (error) {
            console.log(error.message)
        }
        finally{
        setIsLoadingData(false);
        }
    };

    const fetchMOStation = async (model) => {
        setIsLoadingData(true);
        try {
        const response = await axiosInstance.post('api/Production/MOStation', model)
        setDataMOStation(response.data || []); // Cập nhật state với danh sách file
        }
        catch (error) {
            console.log(error.message)
        }
        finally{
        setIsLoadingData(false);
        }
    };

    const fetchMO_WipOverTime = async () => {
        setIsLoadingData(true);
        try {
        const response = await axiosInstance.get('api/Production/MO_WipOverTime')
        setDataMO_WipOverTime(response.data || []); // Cập nhật state với danh sách file
        }
        catch (error) {
            console.log(error.message)
        }
        finally{
        setIsLoadingData(false);
        }
    };

    const fetchMoOverTime = async (model) => {
        setIsLoadingData(true);
        try {
        const response = await axiosInstance.post('api/Production/MoOverTime', model)
        setDataMoOverTime(response.data || []); // Cập nhật state với danh sách file
        }
        catch (error) {
            console.log(error.message)
        }
        finally{
        setIsLoadingData(false);
        }
    };
 
    const fetchMoOpenInMonth = async (model) => {
        setIsLoadingData(true);
        try {
        const response = await axiosInstance.post('api/Production/MoOpenInMonth', model)
        setDataMoOpenInMonth(response.data || []); // Cập nhật state với danh sách file
        setTotalMOOpenInMonth(response.data.reduce((sum, item) => sum + item.y*1, 0))
        }
        catch (error) {
            console.log(error.message)
        }
        finally{
        setIsLoadingData(false);
        }
    };

    const fetchMoOpenInMonthDetail = async (model) => {
        setIsLoadingData(true);
        try {
        const response = await axiosInstance.post('api/Production/MoOpenInMonthDetail', model)
            setDataMoOpenInMonthDetail(response.data || []); // Cập nhật state với danh sách file
        }
        catch (error) {
            console.log(error.message)
        }
        finally{
        setIsLoadingData(false);
        }
    };

    

    const fetchMoTotalTrend = async (model) => {
        setIsLoadingData(true);
        try {
        const response = await axiosInstance.post('api/Production/MoTotalTrend', model)
        setDataMoTotalTrend(response.data || []); // Cập nhật state với danh sách file
        }
        catch (error) {
            console.log(error.message)
        }
        finally{
        setIsLoadingData(false);
        }
    };

    const fetchDailyMoStatus = async (model) => {
        setIsLoadingDataDailyMoStatus(true);
        try {
            const response = await axiosInstance.post('api/Production/DailyMoStatus', model)
            setDataDailyMoStatus(response.data || []); // Cập nhật state với danh sách file
        }
        catch (error) {
            console.log(error.message)
        }
        finally{
        setIsLoadingDataDailyMoStatus(false);
        }
    };

    const fetchMOConfirm = async (model) => {
        setIsLoadingConfirm(true);
        try {
            const response = await axiosInstance.post('api/Production/MOConfirm', model)
            if (response.status === 200 ){
                showNotification('Xác nhận thành công !', 'success')
            }
            await fetchDailyMoStatus(statusConfirm)
        }
        catch (error) {
            console.log(error.message)
            showNotification('Lỗi xác nhận!', 'error')
        }
        finally{
            setIsLoadingConfirm(false);
        }
    };

    const handleChangeModel = (model) => {
        setModelSelect(model.model)
        fetchMOStatus(model);
        fetchMOStation(model);
    }

    const handleChange = (model) => {
        setStatusConfirm(model)
        setOpenModal1(prev => !prev)
        fetchDailyMoStatus(model);
    }

    const handleConfirmMO = (model) => {
        const newModel = {
            idconfirm: model.user,
            comment: JSON.stringify(model.value),
            wipStatus: model.value.WIP,
            sapStatus: model.value.SAP,
            mo: model.id
        }
        fetchMOConfirm(newModel);
    }

    const handleChangeModelPieChart = (model) =>{
        fetchMoOpenInMonthDetail(model)
        setOpenModal2(true);
    }

const colorsd = ['linear-gradient(45deg,#2ed8b6,#59e0c5)', 'linear-gradient(45deg,#ff9c80,#ffb59e)', 'linear-gradient(45deg,#c053ff,#c186ff)','linear-gradient(45deg,#ffbc40,#fdd38a)','linear-gradient(45deg,#ff4040,#ff8080)']
  return (
    <Grid container columns={12}>
        <Grid size={{ lg: 3, md: 12, xs: 12 }}  lg={3} md={12} xs={12} container columns={12}>
            <HiBox lg={12} md={4} xs={12} header = "MO opened this month" note={`(${totalMOOpenInMonth})`} alarn={false}  height="29vh" variant="filled">
                <HiModal header={`MO opened this month Detail`}  open={openModal2} onClose={()=> setOpenModal2(false)} widthModal={35} heightModal={45}>
                    {dataMoOpenInMonthDetail.length > 0 && 
                        <TableContainer sx={{overflow:'auto',height:'100%',
                        '&::-webkit-scrollbar': { width: 4, opacity: 0 },
                        '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                        '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
                    <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
                        <TableHead sx={{position:'sticky', top: '0', backgroundColor: theme.palette.background.conponent}}>
                            <TableRow>
                                <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">Model</TableCell>
                                <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">MO</TableCell>
                                <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">Open time</TableCell>
                                <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">Close time</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {dataMoOpenInMonthDetail.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell align="center" component="th" scope="row" sx={{ padding: "6px" }}>{row.MODEL_NAME || ''}</TableCell>
                                <TableCell align="center" sx={{ padding: "3px 6px"}}>{row.MO_NUMBER || ''}</TableCell>
                                <TableCell align="center" sx={{ padding: "3px 6px"}} >{row.TIMEOL || ''}</TableCell>
                                <TableCell align="center" sx={{ padding: "3px 6px"}}> {row.DATET.split('T')[0] || ''}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
                    }
                </HiModal>
                <PieChart idata={dataMoOpenInMonth} onChangeModel={handleChangeModelPieChart} label1={'Model'}></PieChart>
            </HiBox>
            <HiBox lg={12} md={4} xs={12} header = "MO Overtime" alarn={false}  height="29vh" variant="filled">
                <TableContainer sx={{overflow:'auto',height:'100%',
                    '&::-webkit-scrollbar': { width: 4, opacity: 0 },
                    '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
                <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
                    <TableHead sx={{position:'sticky', top: '0', backgroundColor: theme.palette.background.conponent}}>
                        <TableRow>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">Model</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">MO</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">TimeOL</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">Date Driff</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {dataMoOverTime.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px" }}>{row.MODEL_NAME || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px"}}>{row.MO_NUMBER || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px"}} >{row.TIMEOL.split('T')[0] || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px"}}> {row.DAYDIFF || ''}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
                
            </HiBox>
            <HiBox lg={12} md={4} xs={12} header = "Wip Overtime" alarn={false}  height="29vh" variant="filled">
            <TableContainer sx={{overflow:'auto',height: '100%',
                    '&::-webkit-scrollbar': { width: 4, opacity: 0 },
                    '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
                <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
                    <TableHead sx={{position:'sticky', top: '0', backgroundColor: theme.palette.background.conponent}}>
                        <TableRow>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">Model</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">Station</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">Time</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {[].map((row, index) => (
                        <TableRow key={index}>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px" }}>{row.MODEL_NAME || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px"}}>{row.WIP_GROUP || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px"}} >{row.TIMER || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px"}}> {row.Total || ''}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </HiBox>
        </Grid>
        <Grid size={{ lg: 9, md: 12, xs: 12 }} lg={9} md={12} xs={12} container columns={12}>
            <HiBox lg={6} md={6} xs={12} header = "Total Trend" alarn={false}  height="37.4vh" variant="filled">
                <HiModal header={`MO`}  open={openModal1} onClose={()=> setOpenModal1(false)} widthModal={88} heightModal={85}>
                    {/* {!isLoadingDataDailyMoStatus ?  */}
                        <DailyMoStatus onModelChange={handleConfirmMO} idata={dataDailyMoStatus}></DailyMoStatus>
                    {/* : 
                    <Box sx={{width:'100%', height: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                        <CircularProgress ></CircularProgress>
                    </Box>
                    } */}
                </HiModal>

                <ColumnChart onModelChange={handleChange} idata={dataMoTotalTrend}></ColumnChart>
            </HiBox>
            <HiBox lg={6} md={6} xs={12} header = "MO Status" note={`${modelSelect}`} alarn={false}  height="37.4vh" variant="filled">
                
                <Button size="small" color='primary' variant='contained' sx={{position: 'absolute',display: 'flex', bottom: 0, right: 0, zIndex: 2, opacity: modelSelect !== '' ? 0.4 : 0, '&:hover': { opacity: 1 },}}
                    onClick={() => handleChangeModel({model: '', mo:''})}
                >
                    Reset
                </Button>
            <TableContainer sx={{overflow:'auto',height: '100%',
                    '&::-webkit-scrollbar': { width: 4, opacity: 0 },
                    '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
                <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
                    <TableHead sx={{position:'sticky', top: '0', backgroundColor: theme.palette.background.conponent, zIndex: 2}}>
                        <TableRow>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">No.</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">Model</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">MO</TableCell>

                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">Target Qty</TableCell>
                            {/* <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">Not input</TableCell>
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center">Input</TableCell> */}
                            <TableCell style={{padding: "6px 6px", fontWeight: "bold"}} align="center"> Progress</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {[].map((row, index) => (
                        <TableRow key={index} sx={{zIndex: 1}}>
                            <TableCell align="center" sx={{ padding: "3px 6px"}}>{index + 1 || ''}</TableCell>
                            <TableCell align="center" component="th" scope="row" sx={{ padding: "6px", cursor: 'pointer','&:hover': { color: '#f09'}  }} onClick={() => handleChangeModel({model: row.MODEL_NAME, mo: row.MO_NUMBER })}>{row.MODEL_NAME || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px"}}>{row.MO_NUMBER || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px"}}>{row.TARGET_QTY || ''}</TableCell>
                            {/* <TableCell align="center" sx={{ padding: "3px 6px"}} >{row.NOTINPUT_QTY || ''}</TableCell>
                            <TableCell align="center" sx={{ padding: "3px 6px"}}> {row.Total || ''}</TableCell> */}
                            <TableCell sx={{ minWidth: "200px",padding: "5px"}}>
                                <Box sx={{display:'flex', justifyContent: 'space-between', alignItems:'center', gap:1}}>
                                    <LinearProgress  
                                        variant='determinate' 
                                        value={row.Total > 0 ? (row.Total * 100) / row.TARGET_QTY : 0}
                                        sx={{height:15,width:'100%',borderRadius: 2  ,'& .MuiLinearProgress-bar': { backgroundColor: '#26c1a2' },}} 
                                        /> 
                                    <Typography sx={{fontSize: '0.875rem'}}>{row.Total > 0 ? ((row.Total * 100) / row.TARGET_QTY).toFixed(0) : 0}%</Typography>
                                </Box>
                            </TableCell>

              
                            </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
                
            </HiBox>
                <MOTotal lg={2} md={4} xs={6} header = "IN LOADING"  bgColor={'linear-gradient(45deg,#4099ff,#73b4ff)'}  height="12.4vh" variant="filled">
                    {dataMOStatus.reduce((sum, item) => sum + item.INLOADING*1, 0)}
                </MOTotal>
                <MOTotal lg={2} md={4} xs={6} header = "TURNPCB" bgColor={colorsd[0]}  height="12.4vh" variant="filled">
                    {dataMOStatus.reduce((sum, item) => sum + item.TURNPCB*1, 0)}
                </MOTotal>
                <MOTotal lg={2} md={4} xs={6} header = "INSP" bgColor={colorsd[1]}  height="12.4vh" variant="filled">
                    {dataMOStatus.reduce((sum, item) => sum + item.INSP*1, 0)}
                </MOTotal>
                <MOTotal lg={2} md={4} xs={6} header = "ROUTER" bgColor={colorsd[2]}  height="12.4vh" variant="filled">
                    {dataMOStatus.reduce((sum, item) => sum + item.ROUTER*1, 0)}
                </MOTotal>
                <MOTotal lg={2} md={4} xs={6} header = "STOCKIN" bgColor={colorsd[3]}  height="12.4vh" variant="filled">
                    {dataMOStatus.reduce((sum, item) => sum + item.STOCKIN*1, 0)}
                </MOTotal>
                <MOTotal lg={2} md={4} xs={6} header = "INSTOCKIN" bgColor={colorsd[4]}  height="12.4vh" variant="filled">
                    {dataMOStatus.reduce((sum, item) => sum + item.INSTOCKIN*1, 0)}
                </MOTotal>

                <MoComponentDetail lg={2} md={4} xs={6} height="37.4vh" >
                    {dataMOStatus.reduce((sum, item) => sum + item.INLOADING*1, 0) !== 0 ? 
                    <Box sx={{marginBottom: 1}}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between',  }}>
                            <Typography>Loading</Typography>
                            <Typography>{dataMOStatus.reduce((sum, item) => sum + item.INLOADING*1, 0)}</Typography>
                        </Box>
                        <LinearProgress 
                            sx={{height: '10px'}}
                            size={82} 
                            color='secondary' 
                            variant='determinate' 
                            value={100}/>
                    </Box>:''}
                    
                </MoComponentDetail>
                <MoComponentDetail lg={2} md={4} xs={6} height="37.4vh" data={dataMOStation.filter(item => item.MERGE_WIP === 'TURNPCB')}></MoComponentDetail>
                <MoComponentDetail lg={2} md={4} xs={6} height="37.4vh" data={dataMOStation.filter(item => item.MERGE_WIP === 'INSP')}></MoComponentDetail>
                <MoComponentDetail lg={2} md={4} xs={6} height="37.4vh" data={dataMOStation.filter(item => item.MERGE_WIP === 'ROUTER')}></MoComponentDetail>
                <MoComponentDetail lg={2} md={4} xs={6} height="37.4vh" data={dataMOStation.filter(item => item.MERGE_WIP === 'STOCKIN')}></MoComponentDetail>
                <MoComponentDetail lg={2} md={4} xs={6} height="37.4vh" data={dataMOStation.filter(item => item.MERGE_WIP === 'INSTOCKIN')}></MoComponentDetail>
           
        </Grid>
        
    </Grid>
  );
};

export default MOControl;
