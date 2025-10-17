import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import HiBox from '../../../components/HiBox';
import { Grid, Switch } from '@mui/material';
import dayjs from "dayjs";
import CABChart from './components/CABChart';
import HiProgressBar from './components/FailureAnalysis';
import AnalysisChart from './components/AnalysisChart';
import { getAuthorizedAxiosIntance } from '../../../utils/axiosConfig';
import LineChart from './components/LineChart';
import RadialChart from './components/RadialChart';
import TableErorOver5m from './components/tableErrorOver10m';
import HiModal from '../../../components/HiModal';
import TableError from './components/tableError';
import TableErrorMaterialReturnStatus from './components/tableErrorMaterialReturnStarus';
import TableWoOverTime from './components/tableWoOverTime';

const axiosInstance = await getAuthorizedAxiosIntance();

const MaterialReturn = () => {
    const paramState = useSelector(state => state.param);
    const [queryMain, setQueryMain] = useState({ arr: [], timet: '', datet: '' });
    const [queryDate, setQueryDate] = useState('');
    const [modalData, setModalData] = useState([]);
    const isFirstRender = useState(true);
    const isFirstRender2 = useState(true);
    const [showModal2, setShowModal2] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(null);
    const [isLoadingData2, setIsLoadingData2] = useState(null);
    const [dataMaterialReturnStatus, setDataMaterialReturnStatus] = useState([]);
    const [dataMaterialReturn, setDataMaterialReturn] = useState([]);
    const [dataMaterialKitting, setDataMaterialKitting] = useState([]);
    const [dataMaterialKitingTotalTrend, setDataMaterialKitingTotalTrend] = useState([]);
    const [dataMaterialReturnTotalTrend, setDataMaterialReturnTotalTrend] = useState([]);
    const [dataFATPMachineAnalysis, setDataFATPMachineAnalysis] = useState([]);
    const [Data5, setData5] = useState({});
    const [Data6, setData6] = useState({});

    const dataMaterialReal = useMemo(() => {
        const listTRSN = new Set(dataMaterialReturnStatus.map((item) => item.TR_SN));
        const result = dataMaterialReturn.filter((item) => !listTRSN.has(item.tr_sn))
        const tempError = {};
        result.forEach(item => {
            if (tempError[item.kp_no]) {
                tempError[item.kp_no].Frequency += 1;
            }
            else {
                tempError[item.kp_no] = { Series: item.kp_no, Frequency: 1 };
            }
        });
        const List2 = Object.values(tempError);
        List2.sort((a, b) => b.Frequency - a.Frequency);
        setData5({
            DataSeries: List2,
            listData: result || [],
            colors: ['linear-gradient(90deg,#ff311055,#ff3110)'],
            labels: ['Wait Return'],
        });
        return result;
    }, [dataMaterialReturnStatus, dataMaterialReturn])

    const dataMaterialTotalTrendReal = useMemo(() => {
        const listTRSN = new Set(dataMaterialReturnStatus.map((item) => item.TR_SN));
        const result = dataMaterialReturnTotalTrend.filter((item) => !listTRSN.has(item.tr_sn))
        return result;
    }, [dataMaterialReturnStatus, dataMaterialReturnTotalTrend])

    const fetchMaterialReturnStatus = async (model) => {
        const newMo = model || {
            dateFrom: paramState.params.starttime,
            dateTo: paramState.params.endtime
        }
        try {
            const response = await axiosInstance.post('api/MaterialReturn/getDataMaterialReturnStatus', newMo)
            setDataMaterialReturnStatus(response.data || []);
        }
        catch (error) {
            console.log(error.message)
        }
    };

    const fetchMaterialReturn = async (model) => {
        setIsLoadingData(true);
        try {
            const response = await axiosInstance.post('api/MaterialReturn/getMaterialReturn', model)
            setDataMaterialReturn(response.data || []);
        }
        catch (error) {
            console.log(error.message)
        }
        finally {
            setIsLoadingData(false);
        }
    };

    const fetchMaterialKitting = async (model) => {
        setIsLoadingData(true);
        try {
            const response = await axiosInstance.post('api/MaterialReturn/getMaterialKiting', model)
            setDataMaterialKitting(response.data || []);
            const tempError = {};
            ((response.data || []).filter((item) => item.status === "LOCK WAIT UNLOCK")).forEach(item => {
                if (tempError[item.kp_no]) {
                    tempError[item.kp_no].Frequency += 1;
                }
                else {
                    tempError[item.kp_no] = { Series: item.kp_no, Frequency: 1 };
                }
            });
            const List2 = Object.values(tempError);
            List2.sort((a, b) => b.Frequency - a.Frequency);
            setData6({
                DataSeries: List2,
                listData: (response.data || []).filter((item) => item.status === "LOCK WAIT UNLOCK"),
            });
        }
        catch (error) {
            console.log(error.message)
        }
        finally {
            setIsLoadingData(false);
        }
    };

    const fetchMaterialKitingTotalTrend = async (model) => {
        setIsLoadingData2(true);
        try {
            const response = await axiosInstance.post('api/MaterialReturn/getMaterialKitingTotalTrend', model)
            setDataMaterialKitingTotalTrend(response.data || []); // Cập nhật state 
            const response2 = await axiosInstance.post('api/MaterialReturn/getMaterialReturnTotalTrend', model)
            setDataMaterialReturnTotalTrend(response2.data || []); // Cập nhật state 
            const lastesTimeStr = Object.values(response2.data).map(item => item.end_time).reduce((a, b) => new Date(a) > Date(b) ? a : b);
            setQueryDate(dayjs(lastesTimeStr).format("YYYY-MM-DD"));
        }
        catch (error) {
            console.log(error.message)
        }
        finally {
            setIsLoadingData2(false);
        }
    };

    const fetchFATPMachineAnalysis = async (model) => {
        setIsLoadingData2(true);
        try {
            const response = await axiosInstance.post('api/Fatp/FATPMachineAnalysis', model)
            setDataFATPMachineAnalysis(response.data || []); // Cập nhật state 
        }
        catch (error) {
            console.log(error.message)
        }
        finally {
            setIsLoadingData2(false);
        }
    };

    useEffect(() => {
        setQueryMain(prev => ({
            ...prev,
            dateFrom: paramState.params.starttime,
            dateTo: paramState.params.endtime,
        }))
        const newMo = {
            dateFrom: paramState.params.starttime,
            dateTo: paramState.params.endtime
        }
        fetchMaterialReturn(newMo)
        fetchMaterialKitting(newMo)
        fetchMaterialReturnStatus(newMo)
        const interval = setInterval(() => {
            fetchMaterialReturn(newMo)
            fetchMaterialKitting(newMo)
            fetchMaterialReturnStatus(newMo)
        }, 60000 * 30);
        return () => clearInterval(interval);
    }, [paramState.params.starttime, paramState.params.endtime])

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        fetchMaterialKitingTotalTrend(queryMain);
        const interval = setInterval(() => {
            fetchMaterialKitingTotalTrend(queryMain);
        }, 30 * 60000);
        return () => clearInterval(interval);

    }, [queryMain])

    useEffect(() => {
        if (isFirstRender2.current) {
            isFirstRender2.current = false;
            return;
        }
        const newMo = {
            arr: queryMain.arr,
            dateFrom: queryDate ? queryDate + ' 00:00:00' : '',
            dateTo: queryDate ? queryDate + ' 23:59:59' : ''
        }

        fetchFATPMachineAnalysis(newMo);
        const interval = setInterval(() => {
            fetchFATPMachineAnalysis(newMo);
        }, 30 * 60000);
        return () => clearInterval(interval);

    }, [queryDate, queryMain])

    const handleChangeDate = (idate) => {
        setQueryDate(idate)
    }

    const handleOpenModal = (data) => {
        setModalData(data);
        setShowModal2(true);
    }

    return (
        <Grid container columns={12}>
            <Grid size={{ lg: 4, md: 4, xs: 12 }} lg={4} md={4} xs={12} container columns={12}>
                <HiBox lg={12} md={12} xs={4} alarn={false} header={''} height="32vh" variant="filled" >
                    <HiModal
                        header={`List detail`}
                        open={showModal2}
                        onClose={() => setShowModal2(false)}
                        widthModal={80}
                        heightModal={80}
                    >
                        <TableError idata={modalData} onConfirmSucces={fetchMaterialReturnStatus}></TableError>
                    </HiModal>
                    <RadialChart idata={dataMaterialReal} idata2={dataMaterialKitting} onShowModal={handleOpenModal}></RadialChart>
                </HiBox>
                <HiBox lg={12} md={12} xs={4} header="Wait return overtime" variant="filled" height="30vh">
                    <TableWoOverTime idata={dataMaterialReal} onShowModal={handleOpenModal}></TableWoOverTime>
                </HiBox>
                <HiBox lg={12} md={12} xs={4} header="Wait LCR overtime" variant="filled" height="30vh">
                    <TableErorOver5m idata={dataMaterialKitting.filter((item) => item.status == "LOCK WAIT UNLOCK")} onShowModal={handleOpenModal}></TableErorOver5m>
                </HiBox>
            </Grid>
            <Grid size={{ lg: 4, md: 4, xs: 12 }} lg={4} md={4} xs={12} container columns={12} >
                <HiBox lg={12} md={12} xs={12} alarn={false} header="Material Return Status" height="48vh" variant="filled">
                    {/* <Switch checked={switchErAnLo} onChange={handleChangeSwitchErAnLo} sx={{ position: 'absolute', top: 0, right: 0, zIndex: 2 }} defaultChecked ></Switch> */}
                    <HiProgressBar DataSeries={Data5.DataSeries} idata={Data5.listData} DataSeries2={Data6.DataSeries} idata2={Data6.listData} onShowModal={handleOpenModal} />
                </HiBox>
                <HiBox lg={12} md={12} xs={12} alarn={false} header="Total trend" note={'by Day'} height="48vh" variant="filled">
                    <LineChart idata={dataMaterialTotalTrendReal} idata2={dataMaterialKitingTotalTrend} queryDate={queryDate}></LineChart>
                </HiBox>
            </Grid>
            <Grid size={{ lg: 4, md: 4, xs: 12 }} lg={4} md={4} xs={12} container columns={12}>
                <HiBox lg={12} md={12} xs={4} header="Total Trend" note={'by Day'} variant="filled" height="48vh">
                    <CABChart idata={dataMaterialKitingTotalTrend} idata2={dataMaterialTotalTrendReal} onChangeDate={handleChangeDate}></CABChart>
                </HiBox>
                <HiBox lg={12} md={12} xs={4} header="Total Trend" note={queryDate} variant="filled" height="48vh">
                    <AnalysisChart idata={dataMaterialTotalTrendReal} idata2={dataMaterialKitingTotalTrend} queryDate={queryDate} onShowModal={handleOpenModal}></AnalysisChart>
                </HiBox>
            </Grid>
            <Grid size={{ lg: 12, md: 12, xs: 12 }} lg={12} md={12} xs={12} container columns={12}>
                <HiBox lg={12} md={12} xs={12} header="Abnormal material return" variant="filled" height="30vh">
                    <TableErrorMaterialReturnStatus idata={dataMaterialReturnStatus}></TableErrorMaterialReturnStatus>
                </HiBox>
            </Grid>
        </Grid>
    )
};



export default memo(MaterialReturn);
