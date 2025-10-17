import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import CircleIcon from '@mui/icons-material/Circle'; // Import icon cho trạng thái
import { useTheme } from '@mui/material/styles';

const MachineGelStatusTable = ({
    idata = [],
}) => {
    const data = idata;
    const theme = useTheme();    

    const getStatusColor = (dataRow) => {
        const sevenThirtyAMToday = dayjs()
            .hour(7)
            .minute(30)
            .second(0)
            .millisecond(0);
        if (dayjs(dataRow.TIME_START).isBefore(sevenThirtyAMToday))
            return '#808080';
        if (dataRow.CL < dataRow.USL && dataRow.CL > dataRow.LSL)
            return '#00ff00';
        else if (dataRow.CL < dataRow.UCL && dataRow.CL > dataRow.LCL)
            return '#ffff00';
        else if (dataRow.CL > dataRow.UCL || dataRow.CL < dataRow.LCL)
            return '#ff0000';
        else return '#808080';
    };

    // Helper để gom nhóm các ô Project và Line nếu trùng lặp
    const renderMergedCell = (value, currentIndex, dataKey, totalRows) => {
        if (currentIndex === 0 || data[currentIndex - 1][dataKey] !== value) {
            let rowSpan = 1;
            for (let i = currentIndex + 1; i < totalRows; i++) {
                if (data[i][dataKey] === value) {
                    rowSpan++;
                } else {
                    break;
                }
            }
            return <TableCell sx={{padding:'6px', border: '1px solid #444', textAlign: 'center' }} rowSpan={rowSpan}>{value}</TableCell>;
        }
        return null;
    };

    // Helper để gom nhóm các ô Line nếu trùng lặp (chỉ cho Project và Line)
    const renderMergedLineCell = (value, currentIndex, dataKey, totalRows, projectValue) => {
        if (currentIndex === 0 || data[currentIndex - 1][dataKey] !== value || data[currentIndex - 1]['Project'] !== projectValue) {
            let rowSpan = 1;
            for (let i = currentIndex + 1; i < totalRows; i++) {
                if (data[i][dataKey] === value && data[i]['Project'] === projectValue) {
                    rowSpan++;
                } else {
                    break;
                }
            }
            return <TableCell sx={{padding:'6px', border: '1px solid #444', textAlign: 'center' }} rowSpan={rowSpan}>{value}</TableCell>;
        }
        return null;
    };

    // Helper để gom nhóm các ô Station nếu trùng lặp (chỉ cho Project và Line)
    const renderMergedStationCell = (value, currentIndex, dataKey, totalRows, lineValue, projectValue) => {
        if (currentIndex === 0 || data[currentIndex - 1][dataKey] !== value || data[currentIndex - 1]['Project'] !== projectValue || data[currentIndex - 1]['Line'] !== lineValue) {
            let rowSpan = 1;
            for (let i = currentIndex + 1; i < totalRows; i++) {
                if (data[i][dataKey] === value && data[i]['Line'] === lineValue && data[i]['Project'] === projectValue) {
                    rowSpan++;
                } else {
                    break;
                }
            }
            return <TableCell sx={{padding:'6px', border: '1px solid #444', textAlign: 'center' }} rowSpan={rowSpan}>{value}</TableCell>;
        }
        return null;
    };

    return (
        <Box sx={{ height: '100%' }}>

            <TableContainer sx={{
                overflow: 'auto', height: '100%',
                '&::-webkit-scrollbar': { width: 0, opacity: 0 },
                '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }
            }}>
                <Table stickyHeader aria-label="customized table">
                    <TableHead  sx={{ position: 'sticky', top: '0', backgroundColor: '#4099ff' }}>
                        <TableRow sx={{ backgroundColor: theme.palette.background.conponent,
                            '& th':{
                                backgroundColor: theme.palette.background.conponent,
                               borderBottom: '2px solid #999',
                               borderTop: '2px solid #999',
                            },
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                        }}>
                            <TableCell align="center" sx={{borderLeft: '2px solid #999', padding:'6px',  fontWeight: 'bold' }}>Project</TableCell>
                            <TableCell align="center" sx={{padding:'6px',  fontWeight: 'bold' }}>Line</TableCell>
                            <TableCell align="center" sx={{padding:'6px',  fontWeight: 'bold' }}>Station</TableCell>
                            <TableCell align="center" sx={{padding:'6px', fontWeight: 'bold' }}>Machine</TableCell>
                            <TableCell align="center" sx={{borderRight: '2px solid #999', padding:'6px',  fontWeight: 'bold' }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[].map((row, index) => (
                            <TableRow key={index} >
                                {renderMergedCell(row.Project, index, 'Project', data.length)}
                                {renderMergedLineCell(row.Line, index, 'Line', data.length, row.Project)}
                                {renderMergedStationCell(row.station, index, 'station', data.length, row.Line, row.Project)}
                                {/* <TableCell sx={{ border: '1px solid #444', color: '#000' }}>{row.station}</TableCell> */}
                                <TableCell sx={{padding:'6px', border: '1px solid #444', textAlign: 'center' }}>{row.Machine}</TableCell>
                                <TableCell sx={{padding:'6px', border: '1px solid #444', textAlign: 'center' }}> 
                                    <CircleIcon sx={{ color: getStatusColor(row) }} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default MachineGelStatusTable;