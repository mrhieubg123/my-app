import React, { memo, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { OEE_TARGET } from '../mockData';

const OEEByLineChart = ({ data = [], target = OEE_TARGET }) => {
  const sorted = useMemo(() => [...data].sort((a, b) => b.oee - a.oee), [data]);

  const options = useMemo(() => ({
    chart: {
      type: 'bar',
      backgroundColor: 'transparent',
      height: Math.max(sorted.length * 42 + 60, 200),
      margin: [10, 20, 40, 10],
    },
    title: null,
    credits: { enabled: false },
    xAxis: {
      categories: sorted.map((d) => d.line),
      lineColor: 'transparent',
      tickColor: 'transparent',
      labels: {
        style: { fontSize: '0.72rem', fontWeight: '600' },
      },
    },
    yAxis: {
      min: 0,
      max: 100,
      title: { text: null },
      gridLineColor: 'rgba(255,255,255,0.06)',
      labels: {
        style: { fontSize: '0.65rem', color: '#999' },
        formatter() { return `${this.value}%`; },
      },
      plotLines: [
        {
          value: target,
          color: '#7367f0',
          dashStyle: 'ShortDash',
          width: 2,
          label: {
            text: `Target ${target}%`,
            align: 'right',
            style: { color: '#7367f0', fontSize: '0.65rem', fontWeight: '700' },
          },
          zIndex: 5,
        },
      ],
    },
    legend: { enabled: false },
    tooltip: {
      formatter() {
        const row = sorted.find((d) => d.line === this.x);
        return `
          <b>${this.x}</b><br/>
          OEE: <b style="color:${this.color}">${this.y.toFixed(1)}%</b><br/>
          Availability: ${row?.availability?.toFixed(1) || '—'}%<br/>
          Performance: ${row?.performance?.toFixed(1) || '—'}%<br/>
          Quality: ${row?.quality?.toFixed(1) || '—'}%
        `;
      },
      useHTML: true,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        dataLabels: {
          enabled: true,
          formatter() { return `${this.y.toFixed(1)}%`; },
          style: { fontSize: '0.7rem', fontWeight: '700', textOutline: 'none' },
        },
        colorByPoint: true,
        colors: sorted.map((d) =>
          d.oee >= target
            ? 'rgba(56,239,125,0.85)'
            : d.oee >= target * 0.9
            ? 'rgba(240,152,25,0.85)'
            : 'rgba(255,65,108,0.85)'
        ),
      },
    },
    series: [
      {
        name: 'OEE',
        data: sorted.map((d) => d.oee),
        animation: { duration: 800 },
      },
    ],
  }), [sorted, target]);

  if (data.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120 }}>
        <Typography color="text.secondary" variant="body2">No data</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Top / Bottom badges */}
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        {sorted[0] && (
          <Box sx={{ px: 1, py: 0.3, borderRadius: 1, bgcolor: 'rgba(56,239,125,0.15)', border: '1px solid rgba(56,239,125,0.3)' }}>
            <Typography variant="caption" sx={{ color: '#38ef7d', fontWeight: 700, fontSize: '0.65rem' }}>
              🏆 Top: {sorted[0].line} ({sorted[0].oee.toFixed(1)}%)
            </Typography>
          </Box>
        )}
        {sorted[sorted.length - 1] && (
          <Box sx={{ px: 1, py: 0.3, borderRadius: 1, bgcolor: 'rgba(255,65,108,0.12)', border: '1px solid rgba(255,65,108,0.3)' }}>
            <Typography variant="caption" sx={{ color: '#ff416c', fontWeight: 700, fontSize: '0.65rem' }}>
              ⚠ Lowest: {sorted[sorted.length - 1].line} ({sorted[sorted.length - 1].oee.toFixed(1)}%)
            </Typography>
          </Box>
        )}
      </Box>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Box>
  );
};

export default memo(OEEByLineChart);
