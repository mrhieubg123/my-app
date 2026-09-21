import React, { memo } from 'react';
import { Box, Typography, Chip, LinearProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

const PRIORITY_CONFIG = {
  critical: {
    label: 'CRITICAL',
    color: '#ff416c',
    bg: 'rgba(255,65,108,0.08)',
    border: '#ff416c',
    Icon: ErrorIcon,
  },
  warning: {
    label: 'WARNING',
    color: '#f09819',
    bg: 'rgba(240,152,25,0.08)',
    border: '#f09819',
    Icon: WarningAmberIcon,
  },
  info: {
    label: 'INFO',
    color: '#219af5',
    bg: 'rgba(33,154,245,0.08)',
    border: '#219af5',
    Icon: InfoIcon,
  },
};

const AlertStatsBar = ({ alerts = [] }) => {
  const counts = alerts.reduce(
    (acc, a) => {
      acc[a.priority] = (acc[a.priority] || 0) + 1;
      if (a.acknowledged) acc.acknowledged++;
      acc.total++;
      return acc;
    },
    { total: 0, critical: 0, warning: 0, info: 0, acknowledged: 0 }
  );

  const stats = [
    { label: 'Total', value: counts.total, color: '#7367f0', bg: 'rgba(115,103,240,0.1)' },
    { label: 'Critical', value: counts.critical, color: '#ff416c', bg: 'rgba(255,65,108,0.1)' },
    { label: 'Warning', value: counts.warning, color: '#f09819', bg: 'rgba(240,152,25,0.1)' },
    { label: 'Info', value: counts.info, color: '#219af5', bg: 'rgba(33,154,245,0.1)' },
    { label: 'Acknowledged', value: counts.acknowledged, color: '#38ef7d', bg: 'rgba(56,239,125,0.1)' },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
      {stats.map((s) => (
        <Box
          key={s.label}
          sx={{
            flex: '1 1 100px',
            minWidth: 90,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1.5,
            borderRadius: 2.5,
            background: s.bg,
            border: `1px solid ${s.color}30`,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800, color: s.color, lineHeight: 1 }}>
            {s.value}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.3 }}>
            {s.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export { PRIORITY_CONFIG };
export default memo(AlertStatsBar);
