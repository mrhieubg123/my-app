import React, { useState, useEffect, useCallback } from 'react';
import { Grid} from '@mui/material';

import HiBox from '../../../components/HiBox';

import ESDTotal from './conpornent/ESDTotal';
import ESDStatusTable from './conpornent/ESDStatus';
import ESDChart from './conpornent/ESDChart';
import ESDTopError from './conpornent/ESDTopError';
import ESDDetailDot from './conpornent/ESDDetail';
import HiModal from '../../../components/HiModal';
import ESDErrorDetail from './conpornent/ESDErrorDetail';
import ESDStatusDetail from './conpornent/ESDStatusDetail';
import { useNotification } from "../../../components/HiNotification";

import img from './conpornent/img/Picture1222.png'

import video1 from './conpornent/img/ESDbright.mp4';
import video2 from './conpornent/img/ESDdark.mp4';


const ESDControl = () =>{
    const showNotification = useNotification();
    const theme2 = localStorage.getItem('theme');

    const [isLoading, setIsLoading] = useState(true);
    const [showModalOpen , setShowModalOpen] = useState(false);
    const [showModalOpen2 , setShowModalOpen2] = useState(false);

    const [showModalOpenError , setShowModalOpenError] = useState(false);

    const [ESDStatus, setESDStatus] = useState([]);
    const [ESDTotalErrorChart, setESDTotalErrorChart] = useState([]);
    const [ESDESDTopError, setESDESDTopError] = useState([]);
    const [ESDDetail, setESDDetail] = useState([]);
    const [dataESDErrorDetail, setDataESDErrorDetail] = useState([]);
    const [dataESDConfirmDetail, setDataESDConfirmDetail] = useState([]);
    const [dataFilter, setDataFilter] = useState('')

    const [model, setModel] = useState({
        line: "",
        lane: "",
        station: "",
        dateFrom: "",
        dateTo: "",
        department:"",
        name:"",
    })

    const fetchDataESDStatus = () => {
        fetch("/api/MPE/ESDStatus") // API GET danh sách file
          .then((res) => res.json())
          .then((data) => {
            setESDStatus(data ?? []) // Cập nhật state với danh sách file
          })
        .catch((error) => console.error("Error fetching files:", error));
      };

    const fetchESDErrorChart = (model) => {
    fetch("/api/MPE/ESDTotalErrorChart",{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(model)
    }) // API GET danh sách file
        .then((res) => res.json())
        .then((data) => {
            setESDTotalErrorChart(data || []); // Cập nhật state với danh sách file
        })
    .catch((error) => console.error("Error fetching files:", error));
    };
    
    const fetchESDTopError = (model) => {
        fetch("/api/MPE/ESDTopError",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(model)
        }) // API GET danh sách file
            .then((res) => res.json())
            .then((data) => {
                setESDESDTopError(data || []); // Cập nhật state với danh sách file
            })
        .catch((error) => console.error("Error fetching files:", error));
    };

    const fetchESDDetail = (model) => {
        fetch("/api/MPE/ESDDetail",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(model)
        }) // API GET danh sách file
            .then((res) => res.json())
            .then((data) => {
                setESDDetail(data || []); // Cập nhật state với danh sách file
            })
        .catch((error) => console.error("Error fetching files:", error));
    };


    //ESDERROR
    const fetchESDDataErrorDetail = (model) => {
    fetch("/api/MPE/ESDDataErrorDetail",{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(model)
    }) // API GET danh sách file
        .then((res) => res.json())
        .then((data) => {
            setDataESDErrorDetail(data || []); // Cập nhật state với danh sách file
        })
    .catch((error) => console.error("Error fetching files:", error));
    };


    const fetchESDStatusConfirmDetail = (model) => {
        fetch("/api/MPE/ESDStatusConfirmDetail",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(model)
        }) // API GET danh sách file
            .then((res) => res.json())
            .then((data) => {
                setDataESDConfirmDetail(data || []); // Cập nhật state với danh sách file
            })
        .catch((error) => console.error("Error fetching files:", error));
        };

    const fetchConfirmESD = (model) => {
        fetch("/api/MPE/confirmESDStatus",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(model)
            
        }) 
        .catch((error) => console.error("Error fetching files:", error));
        };
    

    useEffect((model) => {
        setIsLoading(true);
        Promise.all([
            fetchDataESDStatus(),
            fetchESDErrorChart(model),
            fetchESDTopError(model),
            fetchESDStatusConfirmDetail()
        ])
        .catch(error => console.error("error fetching data:", error))
        .finally(() => setIsLoading(false))
    }, [model]);

    const TotalStatus = (status) =>{
        return ESDStatus.reduce((sum, item) => sum + item[`${status}`], 0);
    }

    const handleModelChange = useCallback((newModel) =>{
        setModel(newModel);
        fetchESDDetail(newModel);
        setShowModalOpen(!showModalOpen);

    },[]);
    const handleModelChange2 = useCallback((newModel2) =>{
        // fetchESDDetail(newModel);
        setDataFilter(newModel2)
        console.log(newModel2)
        setShowModalOpen2(!showModalOpen);


    },[]);
    const handleInputConfirm = useCallback((model) =>{
        fetchConfirmESD(model);
        console.log(model);
    },[]);


    const handleModelChangeError = useCallback((newModel) =>{
        setModel(newModel);
        fetchESDDataErrorDetail(newModel);
        setShowModalOpenError(!showModalOpenError);
    },[]);
console.log(dataESDErrorDetail)

    return (
        <Grid container columns={12}>
            <Grid size={{ lg: 4, md: 4, xs: 12 }} lg={4} md={4} xs={12} container columns={12}>
                <HiBox lg={12} md={12} xs={12} header = "" alarn={false}  height="26vh" variant="filled" overflow={false}>
                    {/* <img style={{height: '100%'}} src={img} /> */}
                    <video loop autoPlay muted playsInline style={{width: '100%'}}>
                        <source src={theme2 === 'dark' ? video2 : video1} type='video/mp4'></source>
                    </video>
                </HiBox>
                <HiBox lg={12} md={12} xs={12} header = "Total Error" alarn={false}  height="30vh" variant="filled">
                    {ESDTotalErrorChart.length > 0 ? <ESDChart data={ESDTotalErrorChart} onModelChange={handleModelChangeError}></ESDChart> : ''} 
                </HiBox>
                <HiBox lg={12} md={12} xs={12} header = "Top 10 Station ab-normal" alarn={false}  height="30vh" variant="filled">
                    <HiModal header={`ESD Error Detail`} open={showModalOpenError} onClose={()=> setShowModalOpenError(false)} widthModal={50}>
                        { Array.isArray(dataESDErrorDetail) && dataESDErrorDetail.length > 0 ? (<ESDErrorDetail data={dataESDErrorDetail}></ESDErrorDetail>) : null }
                    </HiModal>
                    {ESDESDTopError.length > 0 ? <ESDTopError data={ESDESDTopError}  onModelChange={handleModelChangeError}></ESDTopError> : ''} 
                </HiBox>

            </Grid>
            <Grid size={{ lg: 8, md: 8, xs: 12 }} lg={8} md={8} xs={12} container columns={12}>
                <Grid container size={{ lg: 12, md: 12, xs: 12 }} columns={12} lg={12} md={12} xs={12} variant="filled">
                    <ESDTotal lg={3} md={3} xs={3} height="15vh" bgColor={'linear-gradient(45deg,#4099ff,#73b4ff)'} header='Total'>{TotalStatus('RUN') + TotalStatus('OFFt') + TotalStatus('ERROR')}</ESDTotal>
                    <ESDTotal lg={3} md={3} xs={3} height="15vh" bgColor={'linear-gradient(45deg,#2ed8b6,#59e0c5)'} header='Good'>{TotalStatus('RUN')}</ESDTotal>
                    <ESDTotal lg={3} md={3} xs={3} height="15vh" bgColor={'linear-gradient(45deg,#ffb640,#ffcb80)'} header='Off'>{TotalStatus('OFFt')}</ESDTotal>
                    <ESDTotal lg={3} md={3} xs={3} height="15vh" bgColor={'linear-gradient(45deg,#ff5370,#ff869a)'} header='Error'>{TotalStatus('ERROR')}</ESDTotal>
                </Grid>
                <HiBox lg={6} md={6} xs={12} header = "Area: SMT-PTH" alarn={false}  height="35.5vh" variant="filled">
                    {ESDStatus.length > 0 ?  <ESDStatusTable onModelChange={handleModelChange} onModelChange2={handleModelChange2} data={ESDStatus} data2={dataESDConfirmDetail} dataFilter={["SMT", "PTH", "SMT_New"]} /> : ''}
                </HiBox>
                <HiBox lg={6} md={6} xs={12} header = "Area: 3F" alarn={false}  height="35.5vh" variant="filled" >
                    {ESDStatus.length > 0 ?  <ESDStatusTable onModelChange={handleModelChange} onModelChange2={handleModelChange2} data={ESDStatus} data2={dataESDConfirmDetail} dataFilter={["Sirocco_Z1"]} /> : ''}
                </HiBox>
                <HiBox lg={6} md={6} xs={12} header = "Area: 2F" alarn={false}  height="35.5vh" variant="filled" >
                    {ESDStatus.length > 0 ?  <ESDStatusTable onModelChange={handleModelChange} onModelChange2={handleModelChange2} data={ESDStatus} data2={dataESDConfirmDetail} dataFilter={["Sub3-Sub4", "Bismuth2", "Bismuth1","KRX", "Z1-Sirocco", "Main1-2","Test1-SA3_Off", "Test2", "SA2", "SA1"]} /> : ''}
                </HiBox>
                <HiBox lg={6} md={6} xs={12} header = "Area: PK" alarn={false}  height="35.5vh" variant="filled" >
                    {ESDStatus.length > 0 ?  <ESDStatusTable onModelChange={handleModelChange} onModelChange2={handleModelChange2} data={ESDStatus} data2={dataESDConfirmDetail} dataFilter={[ "SA2", "SA1"]} /> : ''}
                    <HiModal header={`ESD Detail (${ESDDetail.map(item => item.DEPARTMENT)[0]})`} open={showModalOpen} onClose={()=> setShowModalOpen(false)} widthModal={85}>
                        <ESDDetailDot data={ESDDetail}></ESDDetailDot>
                    </HiModal>
                    <HiModal header={`ESD Confirm Detail `} open={showModalOpen2} onClose={()=> setShowModalOpen2(false)} widthModal={45}>
                        <ESDStatusDetail data={dataESDConfirmDetail} dataFilter={[dataFilter]} onModelChange={handleInputConfirm}></ESDStatusDetail>
                    </HiModal>
                </HiBox>
            </Grid>
        </Grid>
    )
}
export default ESDControl;
