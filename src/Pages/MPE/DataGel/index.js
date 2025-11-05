import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import HiBox from '../../../components/HiBox';
import { Grid, Box } from '@mui/material';
import HiProgressBar from './components/FailureAnalysis';
import { getAuthorizedAxiosIntance } from '../../../utils/axiosConfig';
import LineChart from './components/LineChart';
import TableError from './components/tableError';
import MachineGelStatusTable from './components/tableStatus'; 
import img1 from "./components/image/machine.png";

const axiosInstance = await getAuthorizedAxiosIntance();

const DataGelScreen = () => {
    const paramState = useSelector(state => state.param);
    const [queryMain, setQueryMain] = useState({ arr: [], timet: '', datet: '' });
    const [queryDate, setQueryDate] = useState('');
    const theme = useTheme();
    const isFirstRender = useState(true);
    const [isLoadingData, setIsLoadingData] = useState(null);
    const [isLoadingData2, setIsLoadingData2] = useState(null);
    const [dataGelMachineStatus, setDataGelMachineStatus] = useState([]);
    const [dataGelListError, setDataGelListError] = useState([]);

    const legendItemGel = useMemo(() => ([
        { color: '#00e396', label: 'Good' },
        { color: '#fdfd00', label: 'Pass' },
        { color: '#ff3110', label: 'Error' },
        { color: '#808080', label: 'Off' },
    ]), []);

    const fetchDataGelMachineStatus = async () => {
        setIsLoadingData(true);
        try {
            const response = await axiosInstance.get('api/MPE/DataGelStatus')
            setDataGelMachineStatus(response.data || []); // Cập nhật state  
        }
        catch (error) {
            console.log(error.message)
        }
        finally {
            setIsLoadingData(false);
        }
    };

    const fetchDataGelListError = async (model) => {
        setIsLoadingData2(true);
        try {
            const response = await axiosInstance.post('api/MPE/getDataGelListError', model)
            setDataGelListError(response.data || []); // Cập nhật state 
        }
        catch (error) {
            console.log(error.message)
        }
        finally {
            setIsLoadingData2(false);
        }
    };


    useEffect(() => {
        const newModel = {
            dateFrom: paramState.params.starttime,
            dateTo: paramState.params.endtime
        }
        setQueryMain(prev => ({
            ...prev,
            dateFrom: paramState.params.starttime,
            dateTo: paramState.params.endtime,
        }))
        fetchDataGelMachineStatus()
        const interval = setInterval(() => {
            fetchDataGelMachineStatus()
        }, 30000);
        return () => clearInterval(interval);
    }, [paramState.params.starttime, paramState.params.endtime])

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        fetchDataGelListError(queryMain);
        const interval = setInterval(() => {
            fetchDataGelListError(queryMain);
        }, 30 * 60000);
        return () => clearInterval(interval);
    }, [queryMain])

    const handleChangeMain = useCallback((model) => {
        setQueryMain(prev => ({
            ...prev,
            arr: model
        }))
    }, []);
    const handleChangeDate = (idate) => {
        setQueryDate(idate)
    }

    return (
        <Grid container columns={12}>
            <Grid size={{ lg: 3, md: 3, xs: 12 }} lg={3} md={3} xs={12} container columns={12} >
                <HiBox lg={12} md={12} xs={12} alarn={false} height="30vh" variant="filled" >
                    <Box component={'div'} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                        <Box
                            component="img"
                            align="center"
                            src={img1}
                            sx={{ height: '100%' }}
                        />
                    </Box>
                </HiBox>
                <HiBox lg={12} md={12} xs={12} alarn={false} header="Failure Analysis" note='by Project' height="30vh" variant="filled" >
                    <HiProgressBar DataSeries={dataGelListError} Colors={['linear-gradient(90deg,#ff311055,#ff3110)  ', 'linear-gradient(90deg,#fdfd0055,#fdfd00) ']} Labels={['Frequecy Error', 'Frequecy Alarm']} />
                </HiBox>
                <HiBox lg={12} md={12} xs={12} alarn={false} header="Failure Analysis" note='by Machine' height="30vh" variant="filled" >
                    <HiProgressBar DataSeries={dataGelListError} type={'Machine'} Colors={['linear-gradient(90deg,#ff311055,#ff3110)  ', 'linear-gradient(90deg,#fdfd0055,#fdfd00) ']} Labels={['Frequecy Error', 'Frequecy Alarm']} />
                </HiBox>
            </Grid>
            <Grid size={{ lg: 9, md: 9, xs: 12 }} lg={9} md={9} xs={12} container columns={12} >
                <HiBox lg={6} md={6} xs={12} alarn={false} header="Machine Gel Status" height="45vh" variant="filled" legendItem={legendItemGel}>
                    <MachineGelStatusTable idata={dataGelMachineStatus} />
                </HiBox>
                <TableError idata={dataGelListError} onConfirmSuccess={fetchDataGelListError} />

                <HiBox lg={12} md={12} xs={12} alarn={false} header="Data Gel" height="45vh" variant="filled" >
                    <LineChart idata={dataGelMachineStatus}></LineChart>
                </HiBox>
            </Grid>
        </Grid>
    )
};



export default memo(DataGelScreen);
