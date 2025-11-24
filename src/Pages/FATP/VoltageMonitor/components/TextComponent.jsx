import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  Chip,
  Divider,
  Box
} from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import SpeedIcon from '@mui/icons-material/Speed';
import TimerIcon from '@mui/icons-material/Timer';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function DryerStatusCard({
  status = 'off',
  temperature = 0,
  snCode = '',
  msdLevel = '',
  timeControl = '',
  startTime = '',
  endTime = '' // [{time:'08:00', temp:80}, ...]
}) {

    const tempHistory = [
    { time: "08:00", temp: 80 },
    { time: "08:10", temp: 82 },
    { time: "08:20", temp: 84 },
    { time: "08:30", temp: 85 },
    { time: "08:40", temp: 83 },
  ];
  const isOn = status.toLowerCase() === 'on';

  const InfoItem = ({ icon: Icon, label, value, color }) => (
    <Box display="flex" flexDirection="column" alignItems="flex-start" gap={0.5}>
      <Box display="flex" alignItems="center" gap={1}>
        <Icon color={color || 'action'} />
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
      </Box>
      <Typography variant="h6">{value}</Typography>
    </Box>
  );

  // chuẩn hóa data cho Highcharts
  const categories = tempHistory.map(item => item.time);
  const temps = tempHistory.map(item => item.temp);

  const chartOptions = {
    chart: {
      type: 'line',
      backgroundColor: 'transparent',
      height: 200
    },
    title: { text: null },
    xAxis: {
      categories,
      title: { text: 'Time' }
    },
    yAxis: {
      title: { text: '°C' }
    },
    series: [
      {
        name: 'Temperature',
        data: temps,
        color: '#d32f2f'
      }
    ],
    credits: { enabled: false },
    legend: { enabled: false }
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 4,
        p: 1,
        // backgroundColor: isOn ? '#f1fff1' : '#f9f9f9'
      }}
    >
      <CardHeader
        title="Dryer Status"
        action={
          <Chip
            icon={<PowerSettingsNewIcon />}
            label={isOn ? 'ON' : 'OFF'}
            color={isOn ? 'success' : 'default'}
            sx={{ fontWeight: 'bold', fontSize: '0.9rem', px: 1.5 }}
          />
        }
      />
      <Divider />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <InfoItem
              icon={DeviceThermostatIcon}
              label="Temperature"
              value={`${temperature} °C`}
              color="error"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoItem
              icon={QrCode2Icon}
              label="SN Code"
              value={snCode}
              color="primary"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoItem
              icon={SpeedIcon}
              label="MSD Level"
              value={msdLevel}
              color="secondary"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoItem
              icon={TimerIcon}
              label="Time Control"
              value={timeControl}
              color="warning"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoItem
              icon={PlayCircleIcon}
              label="Start Time"
              value={startTime}
              color="success"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoItem
              icon={StopCircleIcon}
              label="End Time"
              value={endTime}
              color="error"
            />
          </Grid>
        </Grid>

        {/* Highcharts mini chart */}
        <Box mt={4}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Temperature Trend
          </Typography>
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </Box>
      </CardContent>
    </Card>
  );
}
