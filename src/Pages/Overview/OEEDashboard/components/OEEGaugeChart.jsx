import React, { memo, useMemo, useRef, useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

// Safely initialize Highcharts-More and SolidGauge modules only once
let _initialized = false;
const initHighcharts = () => {
  if (_initialized || typeof Highcharts !== 'object') return;
  try {
    const HighchartsMore = require('highcharts/highcharts-more');
    const SolidGauge = require('highcharts/modules/solid-gauge');
    if (typeof HighchartsMore === 'function') HighchartsMore(Highcharts);
    else if (HighchartsMore.default) HighchartsMore.default(Highcharts);
    if (typeof SolidGauge === 'function') SolidGauge(Highcharts);
    else if (SolidGauge.default) SolidGauge.default(Highcharts);
    _initialized = true;
  } catch (e) {
    console.warn('Highcharts module init warning:', e.message);
  }
};
initHighcharts();

const OEE_COLOR_STOPS = [
  [0, '#ff416c'],   // < 60%  → red
  [0.60, '#f09819'],   // 60-85% → orange
  [0.85, '#38ef7d'],   // > 85%  → green
];

const OEEGaugeChart = ({ oee = 0, target = 85 }) => {
  const parentRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });

  const color = oee >= target ? '#38ef7d' : oee >= 60 ? '#f09819' : '#ff416c';
  const label = oee >= target ? 'World-Class ✓' : oee >= 60 ? 'Needs Improvement' : 'Critical';

  useEffect(() => {
    const updateSize = () => {
      if (parentRef.current) {
        const { width, height } = parentRef.current.getBoundingClientRect();
        setParentSize({ width, height });
      }
    };

    const resizeObserver = new ResizeObserver(updateSize);
    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);
    }

    return () => {
      if (parentRef.current) {
        resizeObserver.unobserve(parentRef.current);
      }
    };
  }, []);

  const options = useMemo(() => ({
    chart: {
      type: 'solidgauge',
      // height: '85%',
      backgroundColor: 'transparent',
      margin: [0, 0, 0, 0],
      height: parentSize.height,
    },
    title: null,
    credits: { enabled: false },
    pane: {
      center: ['50%', '75%'],
      size: '140%',
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        innerRadius: '60%',
        outerRadius: '100%',
        shape: 'arc',
        borderColor: 'transparent',
      },
    },
    yAxis: {
      min: 0,
      max: 100,
      stops: OEE_COLOR_STOPS,
      lineWidth: 0,
      tickWidth: 0,
      minorTickInterval: null,
      tickAmount: 2,
      title: {
        text: `<span style="font-size:1rem;font-weight:900;color:${color}">${oee.toFixed(1)}%</span>`,
        useHTML: true,
        y: -30,
      },
      labels: {
        y: 16,
        style: { fontSize: '0.65rem', color: '#999' },
      },
      plotBands: [
        {
          from: 0,
          to: target,
          color: 'rgba(255,255,255,0.04)',
          innerRadius: '60%',
          outerRadius: '100%',
        },
      ],
    },
    plotOptions: {
      solidgauge: {
        innerRadius: '60%',
        rounded: true,
        dataLabels: { enabled: false },
      },
    },
    tooltip: { enabled: false },
    series: [
      {
        name: 'OEE',
        data: [{ y: oee, color }],
        animation: { duration: 1000 },
      },
    ],
  }), [oee, target, color]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
      <Box sx={{ textAlign: 'center', mt: -2 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color,
            display: 'block',
            fontSize: '0.75rem',
          }}
        >
          {label}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Target: {target}%
        </Typography>
      </Box>
    </Box>
  );
};

export default memo(OEEGaugeChart);
