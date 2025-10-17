import React, { useMemo,useState,useRef,useEffect } from 'react';
import { Box, Grid, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,Paper, LinearProgress, Button, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { color } from 'highcharts';
import { ProductionQuantityLimits } from '@mui/icons-material';
import HiHoverReveal from '../../../../components/HiHoverReveal';

const FeederStatus = ({
    alarn,
    width = '100%',
    height = '100%',
    variant = 'default',
    data = [] ,


  }) => {

    const theme = useTheme();
    const parentRef = useRef(null);
    const [parentSize, setParentSize] = useState({width:0 , height:0});
   
    useEffect (() => {
        const updateSize = () =>{
            if( parentRef.current ){
                const {width, height} = parentRef.current.getBoundingClientRect();
                setParentSize((prev) =>
                    prev.width !== width || prev.height !== height ? {width, height}: prev
                );
            }
        };
        const resizeObserver = new ResizeObserver(updateSize);
        parentRef.current && resizeObserver.observe(parentRef.current);
        return () => resizeObserver.disconnect();
    },[]);


   


    return (
        <div ref={parentRef} style={{height: "100%", display:"block"}}>
            <Box  sx={{position: 'relative', height: "100%"}}>
            <TableContainer sx={{overflow:'auto',
                '&::-webkit-scrollbar': { width: 4,height:4, opacity: 0 },
                '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
            <Table sx={{ borderSpacing: "0 8px",height: parentSize.height}} aria-label="customized table">
                <TableHead sx={{position:'sticky', top: '0', backgroundColor: theme.palette.background.conponent}}>
                    <TableRow>
                        <TableCell rowSpan={2} style={{padding: "3px", fontWeight: "bold"}} align="center">Type</TableCell>
                        <TableCell rowSpan={2} style={{padding: "3px", fontWeight: "bold"}} align="center">Online</TableCell>
                        <TableCell rowSpan={2} style={{padding: "3px", fontWeight: "bold"}} align="center">Offline</TableCell>
                        <TableCell colSpan={2} style={{padding: "3px", fontWeight: "bold"}} align="center">Maintenance</TableCell>
                        <TableCell rowSpan={2} style={{padding: "3px", fontWeight: "bold"}} align="center">Repair</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell style={{padding: "3px", fontWeight: "bold"}} align="center">Requires</TableCell>
                        <TableCell  style={{padding: "3px", fontWeight: "bold"}} align="center">Under</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {data.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell style={{padding:'unset'}} align="center" >{row.FEEDER_TYPE}</TableCell>
                        <TableCell style={{padding:'unset', color: "#039930"}} align="center" >{row.ONLINE}</TableCell>
                        <TableCell style={{padding:'unset'}} align="center" >{row.OFFLINE}</TableCell>
                        <TableCell style={{padding:'unset', color: "#c055ff"}} align="center" >{row.MAINTAIN}</TableCell>
                        <TableCell style={{padding:'unset',color: "#ff9930"}} align="center" >{row.MAINTAINING}</TableCell>
                        <TableCell style={{padding:'unset',color: "#ff1930"}} align="center" >{row.REPAIRING}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>            
            </Box>          
        </div>  
    )
}
export default React.memo(FeederStatus);