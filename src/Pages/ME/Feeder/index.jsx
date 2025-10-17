import React, { useRef, useState,useEffect, useCallback } from "react";
import {Grid,Box, Typography, LinearProgress,TableContainer,Table,TableHead,TableRow,TableCell,TableBody, Slider, CircularProgress, Button, FormControlLabel, TextField } from "@mui/material";
import HiBox from "../../../components/HiBox";
import FeederTotal from "./components/FeederTotal";
import { useTheme } from '@mui/material/styles';
import ColumnChart from "./components/FeederChart";
import HiModal from "../../../components/HiModal";
import { getAuthorizedAxiosIntance } from '../../../utils/axiosConfig';
import TableFeederDetail from "./components/FeederDetail";
import TableFeederWaitMaintenance from "./components/FeederWaitMaintenance";
import ColumnChartMR from "./components/FeederChartMR";
import { CheckBox } from "@mui/icons-material";
import HiPieChart from "../../../components/HiChart/HiPieChart";
import img from './components/img/Feeder.png'
import CABChart from "./components/CABChart";
import { useSelector, useDispatch} from 'react-redux';
import TableFeederMRDetail from "./components/FeederMRDetail";
import FeederStatus from "./components/FeederStatus";


const axiosInstance = await getAuthorizedAxiosIntance();

//http://localhost:5000
const API_BASE_URL = '/api';

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





const FeederControl = () => {
  const theme = useTheme();
  const paramState = useSelector(state => state.param);

  const navigationRef = useRef(null);
  const [isLoadingData, setIsLoadingData] = useState(null);
  const [noteDateChart, setNodeDateChart] = useState('');
  const [noteDateChart2, setNodeDateChart2] = useState('');

  const [serialNumber, setSerialNumber] = useState('');
  const [feederNo, setFeederNo] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [showModalOpen2, setShowModalOpen2] = useState(false);

  const [dataFeederStatus, setDataFeederStatus] = useState([]);
  const [dataFeederStatusByType, setDataFeederStatusByType] = useState([]);
  const [dataFEEDER_CHART_MR, setDataFEEDER_CHART_MR] = useState([]);
  const [dataFeederStatusDetail,setDataFeederStatusDetail] = useState([]);
  const [dataFeederWaitMaintenance,setDataFeederWaitMaintenance] = useState([]);
  const [dataFEEDER_CHART_MR_Detail ,setDataFEEDER_CHART_MR_Detail] = useState([]);
  const [dataFeederError, setDataFeederError] = useState([]);
  const [dataFeederTop20Error, setDataFeederTop20Error] = useState([]);
  const [dataFeederTotalTrend, setDataFeederTotalTrend] = useState([]);
  const [dataFeederMaintainDetail, setDataFeederMaintainDetail] = useState([]);
  const [dataFEEDER_MR_Detail, setDataFEEDER_MR_Detail] = useState([]);
  const [showMaintain, setShowMaintain ] = useState(false);

  const [showMaintainMR, setShowMaintainMR ] = useState(false);


  useEffect(() => {
    const newModel = {
        dateFrom : paramState.params.starttime,
        dateTo : paramState.params.endtime
    }
      fetchFeederStatus();
      fetchFeederStatusByType(newModel);
      fetchFEEDER_CHART_MR(newModel);
      fetchFeederWaitMaintenance(newModel);
      fetchFEEDER_CHART_MR_Detail(newModel);
      fetchFeederError(newModel);
      fetchFeederTop20Error(newModel);
      fetchFeederTotalTrend(newModel);
  },[paramState.params.starttime,paramState.params.endtime ])

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const newModel = {
        serialNumber : serialNumber,
        feederNO : feederNo
    }
    setShowMaintain(true);

    setShowModalOpen(true);
    fetchFeederStatusDetail(newModel);
    fetchFeederMaintainDetail(newModel);
  }, [serialNumber,feederNo]);

 

  
  

  const fetchFeederStatus = async () => {
    setIsLoadingData(true);
    try {
      const response = await axiosInstance.get('api/ME/FeederStatus')
      setDataFeederStatus(response.data || []); // Cập nhật state với danh sách file
    }
    catch (error) {
        console.log(error.message)
    }
    finally{
      setIsLoadingData(false);
    }
  };

  const fetchFeederStatusByType = async (model) => {
    setIsLoadingData(true);
    try {
      const response = await axiosInstance.post('api/ME/FeederStatusByType',model)
      setDataFeederStatusByType(response.data || []); // Cập nhật state với danh sách file
    }
    catch (error) {
        console.log(error.message)
    }
    finally{
      setIsLoadingData(false);
    }
  };

  const fetchFEEDER_CHART_MR = async (model) => {
    setIsLoadingData(true);
    try {
      const response = await axiosInstance.post('api/ME/FEEDER_CHART_MR',model)
      setDataFEEDER_CHART_MR(response.data || []); // Cập nhật state với danh sách file

      const maxDate = response.data.reduce((max, item) => {
        return new Date(item.DateT) > new Date(max.DateT) ? item : max
      })
      setNodeDateChart(maxDate.DateT.split('T')[0])

      console.log(maxDate.DateT)
      fetchFEEDER_CHART_MR_Detail({dateTime: maxDate.DateT});

    }
    catch (error) {
        console.log(error.message)
    }
    finally{
      setIsLoadingData(false);
    }
  };

  const fetchFEEDER_CHART_MR_Detail = async (model) => {
    setIsLoadingData(true);
    try {
      const response = await axiosInstance.post('api/ME/FEEDER_CHART_MR_Detail',model)
      setDataFEEDER_CHART_MR_Detail(response.data || []); // Cập nhật state với danh sách file
    }
    catch (error) {
        console.log(error.message)
    }
    finally{
      setIsLoadingData(false);
    }
  };

  const fetchFeederStatusDetail = async (model) => {
    setIsLoadingData(true);
    try {
      const response = await axiosInstance.post('api/ME/FeederStatusDetail',model)
      setDataFeederStatusDetail(response.data || []); // Cập nhật state với danh sách file
    }
    catch (error) {
        console.log(error.message)
    }
    finally{
      setIsLoadingData(false);
    }
  };

  const fetchFeederMaintainDetail = async (model) => {
    setIsLoadingData(true);
    try {
      const response = await axiosInstance.post('api/ME/FeederMaintainDetail',model)
      setDataFeederMaintainDetail(response.data || []); // Cập nhật state với danh sách file
    }
    catch (error) {
        console.log(error.message)
    }
    finally{
      setIsLoadingData(false);
    }
  };


  const fetchFeederWaitMaintenance = async (model) => {
    setIsLoadingData(true);
    try {
      const response = await axiosInstance.post('api/ME/FeederWaitMaintenance',model)
      setDataFeederWaitMaintenance(response.data || []); // Cập nhật state với danh sách file
    }
    catch (error) {
        console.log(error.message)
    }
    finally{
      setIsLoadingData(false);
    }
  };

  const fetchFeederError = async (model) => {
    setIsLoadingData(true);
    try {
      const response = await axiosInstance.post('api/ME/FeederError',model)
      setDataFeederError(response.data || []); // Cập nhật state với danh sách file
    }
    catch (error) {
        console.log(error.message)
    }
    finally{
      setIsLoadingData(false);
    }
  };

  const fetchFeederTop20Error = async (model) => {
    setIsLoadingData(true);
    try {
      const response = await axiosInstance.post('api/ME/FeederTop20Error',model)
      setDataFeederTop20Error(response.data || []); // Cập nhật state với danh sách file
    }
    catch (error) {
        console.log(error.message)
    }
    finally{
      setIsLoadingData(false);
    }
  };

  const fetchFeederTotalTrend = async (model) => {
    setIsLoadingData(true);
    try {
      const response = await axiosInstance.post('api/ME/FeederTotalTrend',model)
      setDataFeederTotalTrend(response.data || []); // Cập nhật state với danh sách file
    }
    catch (error) {
        console.log(error.message)
    }
    finally{
      setIsLoadingData(false);
    }
  };

  const fetchFEEDER_MR_Detail = async (model) => {
    setIsLoadingData(true);
    try {
      const response = await axiosInstance.post('api/ME/FEEDER_MR_Detail',model)
      setDataFEEDER_MR_Detail(response.data || []); // Cập nhật state với danh sách file
      console.log(response.data);
    }
    catch (error) {
        console.log(error.message)
    }
    finally{
      setIsLoadingData(false);
    }
  };

  



  const handelChangeStatus = (newModel) => {
    setShowModalOpen(prev => !prev);
    setShowMaintain(false);
    fetchFeederStatusDetail(newModel);
  }

  const handleChangeDateChart = (Model) => {
    setNodeDateChart(Model.dateTime);
    setNodeDateChart2(Model.dateTime);
    fetchFEEDER_CHART_MR_Detail(Model);
    fetchFeederError(Model);
  }

  const handleColumnMR = (model) => {
    
    const newModel = {
      ...model,
      dateTime: noteDateChart
    }
    setShowMaintainMR(['ExistMain','ActualMain'].includes(model.name))
    setShowModalOpen2(prev => !prev);
    fetchFEEDER_MR_Detail(newModel);

  } 



const colorsd = ['linear-gradient(45deg,#2ed8b6,#59e0c5)', 'linear-gradient(45deg,#ff9c80,#ffb59e)', 'linear-gradient(45deg,#c053ff,#c186ff)','linear-gradient(45deg,#ffbc40,#fdd38a)','linear-gradient(45deg,#ff4040,#ff8080)']
  return (
    <Grid container columns={12}>
        <Grid size={{ lg: 4, md: 12, xs: 12 }} lg={4} md={12} xs={12} container columns={12}>
          <HiBox lg={12} md={4} xs={12} header = "Feeder" alarn={false}  height="29vh" variant="filled">
            <Grid  container columns={12} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Grid size={{ lg: 7, md: 7, xs: 7 }} lg={7} md={7} xs={7} sx={{padding: '5px'}}>
                <img src={img} style={{width: '100%'}}></img>
              </Grid>
              <Grid size={{ lg: 5, md: 5, xs: 5 }} lg={5} md={5} xs={5} sx={{textAlign: 'center', padding: '5px'}}>
                {/* <Typography>Standard: <Box > &lt; 90 day</Box></Typography> */}
                <Box sx={{fontWeight: 'bold' , whiteSpace: 'nowrap'}}>
                  <Typography sx={{fontWeight: 'bold' , whiteSpace: 'nowrap'}}>Maintenance:</Typography>
                  <Box sx={{backgroundColor: '#ff2323', padding: '6px', color:'#fff'}}>&ge; 90 day</Box>
                  <Box sx={{backgroundColor: '#ffbc42', padding: '6px', color:'#fff'}}>&ge; 80 day</Box>
                </Box>
              </Grid>
            </Grid>
          <Box
                component={'form'}
                onSubmit={handleSubmit}
                sx={{display: 'flex', gap: 1, width:'100%', marginTop: '6px' , position:'absolute', bottom: 0}}
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Feeder SN"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    size="small"
                />
                
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Feeder NO"
                    value={feederNo}
                    onChange={(e) => setFeederNo(e.target.value)}
                    size="small"
                />
                
                <Button
                   type='submit'
                   variant='contained'
                   color='primary'
                   size="small"
                >
                    Submit
                </Button>

            </Box>
          </HiBox>
          <HiBox lg={12} md={4} xs={12} header = "Failure Analysis"  note={`Quarter ${dataFeederError.map(item => item.QUY)[0]} Year ${dataFeederError.map(item => item.NAM)[0]}`} alarn={false}  height="29vh" variant="filled" overflow={false}>
              <HiPieChart idata={dataFeederError}></HiPieChart>
          </HiBox>
          <HiBox lg={12} md={4} xs={12} header = "Feeder Wait Maintenance" alarn={false}  height="29vh" variant="filled" overflow={true}>
              <TableFeederWaitMaintenance data={dataFeederWaitMaintenance}></TableFeederWaitMaintenance>
          </HiBox> 
        </Grid>  
      <Grid size={{ lg: 8, md: 12, xs: 12 }} lg={8} md={12} xs={12} container columns={12}>
        {dataFeederStatus.length > 0 ? 
        <>
          <FeederTotal lg={2} md={4} xs={6} height="12vh" bgColor={'linear-gradient(45deg,#4099ff,#73b4ff)'} header='Total' onCheckSheet={handelChangeStatus} >{[].reduce(( sum, item) =>  sum + item.Total*1 || 0 , 0)}</FeederTotal>
          {[].map((item, index) => (
            <FeederTotal lg={2} md={4} xs={6} height="12vh" bgColor={colorsd[index]} header={`${item.STATUS}`} onCheckSheet={handelChangeStatus}>{item.Total}</FeederTotal>
          ))}
        </>: ''}
        <HiModal header={`Feeder Status Detail`}  open={showModalOpen} onClose={()=> setShowModalOpen(false)} widthModal={56} heightModal={85}>
            {isLoadingData ? 
              <Box sx={{width:'100%', height: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                <CircularProgress ></CircularProgress>
              </Box>  
              : 
              <TableFeederDetail showMaintain={showMaintain} data={dataFeederStatusDetail}  data2={dataFeederMaintainDetail}></TableFeederDetail>
              }
          </HiModal>
        <Grid lg={12} md={12} xs={12} container columns={12}>
          <HiBox lg={6} md={6} xs={12} header = "Feeder Status" alarn={false}  height="37.4vh" variant="filled">
            <FeederStatus data={dataFeederStatusByType}></FeederStatus>
          </HiBox>
          <HiBox lg={6} md={6} xs={12} header = "Total Trend" alarn={false}  height="37.4vh" variant="filled">
            <CABChart idata={dataFeederTotalTrend}></CABChart>
          </HiBox>
          <HiBox lg={6} md={6} xs={12} header = "Feeder M&R	" alarn={false}  height="37.4vh" variant="filled">
            
            <HiModal header={`Feeder MR Detail`}  open={showModalOpen2} onClose={()=> setShowModalOpen2(false)} widthModal={56} heightModal={85}>
              {isLoadingData ? 
                <Box sx={{width:'100%', height: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                  <CircularProgress ></CircularProgress>
                </Box>  
                : 
                <TableFeederMRDetail showMaintain={showMaintainMR} data={dataFEEDER_MR_Detail} ></TableFeederMRDetail>
                }
            </HiModal>

            <ColumnChart idata={dataFEEDER_CHART_MR} onModelChange={handleChangeDateChart}></ColumnChart>
          </HiBox>
          <HiBox lg={6} md={6} xs={12} header = "Feeder M&R" note={`${noteDateChart || 'now'}`} alarn={false}  height="37.4vh" variant="filled">
            <ColumnChartMR idata={dataFEEDER_CHART_MR_Detail} onModelChange={handleColumnMR}  set></ColumnChartMR>
          </HiBox>
        </Grid>
      </Grid>
      <HiBox lg={12} md={12} xs={12} header = "Feeder Top 20 Error" alarn={false}  height="39vh" variant="filled" overflow={true}>
            <TableContainer sx={{overflow:'auto', height: '100%',
                      '&::-webkit-scrollbar': { width: 4,height:4, opacity: 0 },
                      '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                      '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
                  <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
                      <TableHead sx={{position:'sticky', top: '0', backgroundColor: theme.palette.background.conponent}}>
                          <TableRow>
                              <TableCell style={{padding: "3px", fontWeight: "bold"}} align="center">No.</TableCell>
                              <TableCell style={{padding: "3px", fontWeight: "bold"}} align="center">Feeder SN</TableCell>
                              <TableCell style={{padding: "3px", fontWeight: "bold"}} align="center">Feeder NO</TableCell>
                              <TableCell style={{padding: "3px", fontWeight: "bold"}} align="center">Feeder Type</TableCell>

                              <TableCell style={{padding: "3px", fontWeight: "bold"}} align="center">Error code</TableCell>
                              <TableCell style={{padding: "3px", fontWeight: "bold"}} align="center">Error</TableCell>
                              <TableCell style={{padding: "3px", fontWeight: "bold"}} align="center">Total</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                      {dataFeederTop20Error.map((row, index) => (
                          <TableRow key={index}>
                              <TableCell style={{padding: "13px"}} align="center" >{index + 1}</TableCell>
                              <TableCell style={{padding: "13px"}} align="center" >{row.FEEDER_SN}</TableCell>
                              <TableCell style={{padding: "13px"}} align="center" >{row.FEEDER_NO}</TableCell>
                              <TableCell style={{padding: "13px"}} align="center" >{row.FEEDER_TYPE}</TableCell>
                              <TableCell style={{padding: "13px"}} align="center" >{row.ERR_DESC_EMP}</TableCell>
                              <TableCell style={{padding: "13px"}} align="center" >{row.ERR_DESC}</TableCell>
                              <TableCell style={{padding: "13px"}} align="center" >{row.Total}</TableCell>
                          </TableRow>
                      ))}
                      </TableBody>
                  </Table>
            </TableContainer>
      </HiBox> 
      
     
    </Grid>
  );
};

export default FeederControl;
