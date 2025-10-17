import React, { useState, useEffect } from 'react';
import {Button, Grid, Box,Divider,List,ListItem,ListItemText,TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Grid2} from '@mui/material';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Viewer, Worker } from "@react-pdf-viewer/core";

import TableYR from './compornents/TableYR';


import HiLineChart from '../../../components/HiChart/HiLineChart';
import HiBox from '../../../components/HiBox';
import ColumnChart from './compornents/ColumnChart';

import HiAreaChart from '../../../components/HiChart/HiAreaChart';
import HiDonut3DChart from '../../../components/HiChart/HiDonut3DChart';
import HiRadialChart from  '../../../components/HiChart/HiRadialChart';
import HiColumnChart from '../../../components/HiChart/HiColumnChart';
import HiLegend from '../../../components/HiLegend';

import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
// import FileUploadPDF from '../../UploadFile/PrinterUploadFile'
import HiShowFilePDF from '../../../components/HiShow/HiShowPDF'



const YieldRateTracking = () =>{
    const [isLoading, setIsLoading] = useState(true);
    const [YRData, setYRData] = useState([]);
    const [YRChart, setYRChart] = useState([]);

    const [modal , setModal] = useState({
        dateFrom: "",
        dateTo: "",
      });

    const fetchYRStatus = (modal) => {
        fetch("/api/PE/YRStatus",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(modal)
        }) // API GET danh sách file
          .then((res) => res.json())
          .then((data) => {
            setYRData(data || []); // Cập nhật state với danh sách file
          })
        .catch((error) => console.error("Error fetching files:", error));
      };
    const fetchYRTrendChart = (modal) => {
        fetch("/api/PE/YRTrendChart",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(modal)
        }) // API GET danh sách file
          .then((res) => res.json())
          .then((data) => {
            setYRChart(data || []); // Cập nhật state với danh sách file
          })
        .catch((error) => console.error("Error fetching files:", error));
      };

      useEffect(() => {
        setIsLoading(true);
        try{
            fetchYRStatus();
            fetchYRTrendChart();
        }catch(error){

        }
        finally{
            setIsLoading(false);
        }
    }, []);
    
    const data = [
        {
            name: "Line 1",
            data: YRChart.length < 1 ? [] :  YRChart.map(item => item.Line1)
        },
        {
            name: "Line 2",
            data: YRChart.length < 1 ? [] : YRChart.map(item => item.Line2)
        },
        {
            name: "Line 4",
            data: YRChart.length < 1 ? [] : YRChart.map(item => item.Line4)
        },
        {
            name: "Line 5",
            data: YRChart.length < 1 ? [] : YRChart.map(item => item.Line5)
        }
       
        ]


    return (
        <Grid container columns={12}>
            <HiBox lg={4} md={6} xs={12} header = "SMT Summary" alarn={false}  height="44vh" variant="filled">
                <TableYR data={YRData} filter={'OK'}></TableYR>
            </HiBox>
            <HiBox lg={4} md={6} xs={12} header = "Yield Rate Summary" alarn={false}  height="44vh" variant="filled">
                <HiAreaChart data = {data} categories = {YRChart.length < 1 ? [] : YRChart.map(item => item.TimeT)}  />
            </HiBox>
            <HiBox lg={4} md={6} xs={12} header = "SMT Defect Total" alarn={false}  height="44vh" variant="filled">
                <ColumnChart data = {data} categories = {YRChart.length < 1 ? [] : YRChart.map(item => item.TimeT)}  />

            </HiBox>
            <HiBox lg={4} md={12} xs={12} header = "SMT Defect" alarn={false}  height="44vh" variant="filled">
                <TableYR data={YRData} filter={'NG'}></TableYR>
            </HiBox>
            <HiBox lg={8} md={12} xs={12} header = "Top Error" alarn={false}  height="44vh" variant="filled">
                <Grid container columns={12}>
                    <Grid lg={6} md={6} xs={6} header = "" alarn={false}  height="11vh" variant="filled">
                       <HiRadialChart/>
                    </Grid>
                    <Grid lg={6} md={6} xs={6} header = "" alarn={false}  height="13vh" variant="filled">
                        <ColumnChart data = {data} categories = {YRChart.length < 1 ? [] : YRChart.map(item => item.TimeT)}  />
                    </Grid>
                    <Grid lg={6} md={6} xs={6} header = "" alarn={false}  height="11vh" variant="filled">
                        <HiRadialChart/>
                    </Grid>
                    <Grid lg={6} md={6} xs={6} header = "" alarn={false}  height="13vh" variant="filled">
                        <ColumnChart data = {data} categories = {YRChart.length < 1 ? [] : YRChart.map(item => item.TimeT)}  />
                    </Grid>
                    <Grid lg={6} md={6} xs={6} header = "" alarn={false}  height="11vh" variant="filled">
                        <HiRadialChart/>
                    </Grid>
                    <Grid lg={6} md={6} xs={6} header = "" alarn={false}  height="13vh" variant="filled">
                        <ColumnChart data = {data} categories = {YRChart.length < 1 ? [] : YRChart.map(item => item.TimeT)}  />
                    </Grid>
                </Grid>
            </HiBox>
            
            <HiBox lg={4} md={12} xs={12} header = "Yield Rate" alarn={false}  height="44vh" variant="filled">
                <HiDonut3DChart></HiDonut3DChart>
            </HiBox>
            <HiBox lg={8} md={12} xs={12} header = "Yield Rate" alarn={false}  height="44vh" variant="filled">

            </HiBox>
        </Grid>
    )
}
export default YieldRateTracking;
