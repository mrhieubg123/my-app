import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const STATUS_CONFIG = {
  RUN: {
    label: 'Running',
    color: '#38ef7d',
    bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    glow: 'rgba(56,239,125,0.6)',
  },
  STOP: {
    label: 'Stopped',
    color: '#edde5d',
    bg: 'linear-gradient(135deg, #f09819 0%, #edde5d 100%)',
    glow: 'rgba(240,152,25,0.6)',
  },
  ERROR: {
    label: 'Error',
    color: '#ff4b2b',
    bg: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
    glow: 'rgba(255,65,108,0.8)',
  },
  OFF: {
    label: 'Offline',
    color: '#606c88',
    bg: 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
    glow: 'rgba(96,108,136,0.4)',
  },
  CUT: {
    label: 'Cut / Rest',
    color: '#fecfef',
    bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    glow: 'rgba(255,154,158,0.5)',
  },
};

export { STATUS_CONFIG };

const StatusLegend = ({ counts = {} }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        flexWrap: 'wrap',
        py: 0.5,
      }}
    >
      {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
        <Box
          key={key}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: cfg.bg,
              boxShadow: `0 0 6px ${cfg.glow}`,
              flexShrink: 0,
            }}
          />
          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.72rem' }}>
            {cfg.label}
            {counts[key] !== undefined ? ` (${counts[key]})` : ''}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default StatusLegend;
