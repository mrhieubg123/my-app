import {
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import HomeIcon from '@mui/icons-material/Home';
import DownloadIcon from '@mui/icons-material/Download';
import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// Import module để hiển thị labels trên đường (ví dụ cho USL, UCL, ...)
// Có thể cần cài thêm: npm install highcharts-more highcharts/modules/annotations
import HighchartsAccessibility from 'highcharts/modules/accessibility'; // Khuyến nghị cho accessiblity
// import HighchartsAnnotations from 'highcharts/modules/annotations'; // Nếu muốn dùng annotations nâng cao

// Register the accessibility module
HighchartsAccessibility(Highcharts);
// HighchartsAnnotations(Highcharts); // Register annotations if needed

const DataGelHighcharts = ({
    idata = [],
    MOL = 'Line'
}
) => {
    const [selectedMachine, setSelectedMachine] = useState('BF1_A110');

    // Dữ liệu mẫu (thời gian và giá trị)
    // Trong Highcharts, dữ liệu series thường là mảng các cặp [x, y]
    // Đối với trục thời gian, x có thể là timestamp (milliseconds since epoch)
    // hoặc chỉ mục (index) nếu dùng category axis. Ở đây dùng category.
    const timestamps = [
        '07:35:00', '07:40:00', '07:45:00', '07:50:00', '07:55:00', '08:00:00',
        '08:05:00', '08:10:00', '08:15:00', '08:20:00', '08:25:00', '08:30:00',
        '08:35:00', '08:40:00', '08:45:00',
    ];
    const gsmValues = [
        0.135, 0.1355, 0.136, 0.1365, 0.137, 0.1375, 0.138, 0.1385, 0.139,
        0.1395, 0.140, 0.1405, 0.1408, 0.141, 0.1412,
    ];

    // Các giá trị giới hạn
    const USL_VALUE = 0.143;
    const UCL_VALUE = 0.1365;
    const LCL_VALUE = 0.124;
    const LSL_VALUE = 0.117;

    // Cấu hình Highcharts Options
    const highchartsOptions = {
        chart: {
            type: 'line',
            backgroundColor: '#333', // Màu nền biểu đồ
            style: {
                fontFamily: 'Arial, sans-serif',
                color: 'white',
            },
            height: '100%', // Chiều cao 100% của container
        },
        title: {
            text: null, // Ẩn tiêu đề biểu đồ mặc định
        },
        credits: {
            enabled: false, // Ẩn "Highcharts.com"
        },
        xAxis: {
            categories: timestamps, // Sử dụng các nhãn thời gian làm categories
            labels: {
                style: {
                    color: 'white', // Màu nhãn trục X
                },
            },
            lineColor: 'rgba(255, 255, 255, 0.2)', // Màu đường trục
            tickColor: 'rgba(255, 255, 255, 0.2)', // Màu vạch chia
            gridLineColor: 'rgba(255, 255, 255, 0.1)', // Màu lưới
        },
        yAxis: {
            title: {
                text: 'gsm', // Tiêu đề trục Y
                style: {
                    color: 'white',
                },
            },
            labels: {
                style: {
                    color: 'white', // Màu nhãn trục Y
                },
            },
            lineColor: 'rgba(255, 255, 255, 0.2)',
            tickColor: 'rgba(255, 255, 255, 0.2)',
            gridLineColor: 'rgba(255, 255, 255, 0.1)',
            plotLines: [ // Các đường giới hạn
                {
                    value: USL_VALUE,
                    color: 'red',
                    dashStyle: 'Dash', // Đường đứt nét
                    width: 1,
                    zIndex: 4, // Đảm bảo nằm trên các đường lưới
                    label: {
                        text: 'USL ' + USL_VALUE,
                        align: 'right',
                        x: -10, // Dịch sang trái một chút
                        style: {
                            color: 'red',
                            fontWeight: 'bold',
                        },
                    },
                },
                {
                    value: UCL_VALUE,
                    color: 'yellow',
                    dashStyle: 'Dash',
                    width: 1,
                    zIndex: 4,
                    label: {
                        text: 'UCL ' + UCL_VALUE,
                        align: 'right',
                        x: -10,
                        style: {
                            color: 'yellow',
                            fontWeight: 'bold',
                        },
                    },
                },
                {
                    value: LCL_VALUE,
                    color: 'yellow',
                    dashStyle: 'Dash',
                    width: 1,
                    zIndex: 4,
                    label: {
                        text: 'LCL ' + LCL_VALUE,
                        align: 'right',
                        x: -10,
                        style: {
                            color: 'yellow',
                            fontWeight: 'bold',
                        },
                    },
                },
                {
                    value: LSL_VALUE,
                    color: 'red',
                    dashStyle: 'Dash',
                    width: 1,
                    zIndex: 4,
                    label: {
                        text: 'LSL ' + LSL_VALUE,
                        align: 'right',
                        x: -10,
                        style: {
                            color: 'red',
                            fontWeight: 'bold',
                        },
                    },
                },
            ],
            min: 0.115, // Đặt min/max cho trục Y để khớp hình ảnh
            max: 0.146,
        },
        legend: {
            enabled: false, // Ẩn legend mặc định
        },
        tooltip: {
            shared: true,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            borderColor: 'gray',
            style: {
                color: '#FFFFFF',
            },
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: true, // Hiển thị điểm dữ liệu
                    radius: 3,
                },
            },
            line: {
                // Cấu hình mặc định cho tất cả các line series
                // pointStart: Date.UTC(2025, 6, 2, 7, 35, 0), // Nếu dùng datetime axis
                // pointInterval: 5 * 60 * 1000, // Nếu dùng datetime axis (mỗi 5 phút)
            },
        },
        series: [
            {
                name: 'gsm',
                data: gsmValues, // Dữ liệu của đường chính
                color: '#007bff', // Màu xanh dương
                marker: {
                    symbol: 'circle', // Kiểu điểm dữ liệu
                },
            },
        ],
    };

    return (
        <Box
            sx={{
                // backgroundColor: '#222', // Nền tổng thể màu xám đậm
                // minHeight: '100vh',
                height: '100%',
                color: 'white',
                // p: 2,
                // display: 'flex',
                // flexDirection: 'column',
            }}
        >
            {/* Header */}
            <Box sx={{justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                    Data Gel <span style={{ fontSize: '0.8em', color: '#888', ml: 1 }}>Export to Excel</span>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Machine Selection */}
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 1 }}>
                        <InputLabel id="machine-select-label" sx={{ color: 'white' }}>Machine</InputLabel>
                        <Select
                            labelId="machine-select-label"
                            value={selectedMachine}
                            onChange={(e) => setSelectedMachine(e.target.value)}
                            label="Machine"
                            sx={{
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'white',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'white',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'white',
                                },
                                '& .MuiSvgIcon-root': {
                                    color: 'white',
                                },
                            }}
                        >
                            <MenuItem value="BF1_A110">BF1_A110</MenuItem>
                            <MenuItem value="BF1_A120">BF1_A120</MenuItem>
                        </Select>
                    </FormControl>
                    {/* Control Icons */}
                    <IconButton sx={{ color: 'white' }}>
                        <SearchIcon />
                    </IconButton>
                    <IconButton sx={{ color: 'white' }}>
                        <ZoomInIcon />
                    </IconButton>
                    <IconButton sx={{ color: 'white' }}>
                        <ZoomOutIcon />
                    </IconButton>
                    <IconButton sx={{ color: 'white' }}>
                        <HomeIcon /> {/* Ví dụ icon reset zoom */}
                    </IconButton>
                    <IconButton sx={{ color: 'white' }}>
                        <FormatListBulletedIcon />
                    </IconButton>
                    <IconButton sx={{ color: 'white' }}>
                        <DownloadIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Biểu đồ Highcharts */}
            <Box sx={{ flexGrow: 1, display: 'expand', p: 1, backgroundColor: '#333', borderRadius: '8px' }}>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={highchartsOptions}
                />
            </Box>
        </Box>
    );
}

export default DataGelHighcharts;