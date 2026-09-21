import React, { memo, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { useTheme } from '@mui/material/styles';

const ParetoLossChart = ({ data = [] }) => {
  const totalDuration = useMemo(() => data.reduce((s, d) => s + d.durationH, 0), [data]);
  const theme = useTheme();

  const options = useMemo(() => {
    const categories = data.map((d) => d.category);
    const durations = data.map((d) => parseFloat(d.durationH.toFixed(1)));
    const cumulative = data.map((d) => parseFloat(d.cumulative.toFixed(1)));

    return {
      chart: {
        backgroundColor: 'transparent',
        height: '45%',
        // margin: [20, 60, 60, 60],
      },
      title: null,
      credits: { enabled: false },
      xAxis: {
        categories,
        crosshair: true,
        labels: {
          style: { color: theme.palette.chart.color, fontSize: '0.7rem' },
          rotation: -20,
        },
      },
      yAxis: [
        {
          // Left: Duration hours
          title: {
            text: 'Downtime (h)',
            style: { fontSize: '0.7rem', color: '#aaa' },
          },
          gridLineColor: 'rgba(255,255,255,0.06)',
          labels: {
            style: { fontSize: '0.65rem', color: '#999' },
          },
        },
        {
          // Right: Cumulative %
          title: {
            text: 'Cumulative %',
            style: { fontSize: '0.7rem', color: '#7367f0' },
          },
          opposite: true,
          min: 0,
          max: 100,
          labels: {
            formatter() { return `${this.value}%`; },
            style: { fontSize: '0.65rem', color: '#7367f0' },
          },
          plotLines: [
            {
              value: 80,
              color: '#f09819',
              dashStyle: 'ShortDash',
              width: 1.5,
              label: {
                text: '80% (Pareto)',
                align: 'right',
                style: { color: '#f09819', fontSize: '0.62rem' },
              },
            },
          ],
        },
      ],
      tooltip: {
        shared: true,
        formatter() {
          let s = `<b>${this.x}</b><br/>`;
          this.points.forEach((p) => {
            s += `${p.series.name}: <b>${p.y}${p.series.name.includes('%') ? '%' : 'h'}</b><br/>`;
          });
          return s;
        },
      },
      legend: {
        align: 'right',
        verticalAlign: 'top',
        itemStyle: { color: theme.palette.chart.color, fontSize: '0.7rem' },
      },
      plotOptions: {
        column: {
          borderRadius: 4,
          colorByPoint: true,
          colors: [
            'rgba(255,65,108,0.85)',
            'rgba(240,152,25,0.85)',
            'rgba(33,154,245,0.85)',
            'rgba(56,239,125,0.85)',
            'rgba(156,39,176,0.85)',
            'rgba(96,108,136,0.85)',
          ],
          dataLabels: {
            enabled: true,
            formatter() { return `${this.y}h`; },
            style: { fontSize: '0.65rem', fontWeight: '700', textOutline: 'none' },
          },
        },
        spline: { lineWidth: 2.5 },
      },
      series: [
        {
          type: 'column',
          name: 'Downtime (h)',
          data: durations,
          yAxis: 0,
          animation: { duration: 800 },
        },
        {
          type: 'spline',
          name: 'Cumulative %',
          data: cumulative,
          yAxis: 1,
          color: '#7367f0',
          marker: { radius: 4, fillColor: '#7367f0' },
          animation: { duration: 1000 },
        },
      ],
    };
  }, [data]);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {data.length === 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120 }}>
          <Typography color="text.secondary" variant="body2">No loss data</Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Total downtime: {totalDuration.toFixed(1)}h · Focus on top 2-3 causes (80/20 rule)
            </Typography>
          </Box>
          <HighchartsReact highcharts={Highcharts} options={options} containerProps={{ style: { height: '90%' } }} />
        </>
      )}
    </Box>
  );
};

export default memo(ParetoLossChart);
