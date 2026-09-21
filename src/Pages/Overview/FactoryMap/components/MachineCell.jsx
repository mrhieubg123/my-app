import React, { memo } from 'react';
import { Box, Typography, Chip, Tooltip } from '@mui/material';
import { STATUS_CONFIG } from './StatusLegend';

/**
 * Parse cell value from API format:
 * "STATUS-/-MachineName-/-Time-/-ErrorCode-/-ErrorMsg-/-Detail-/-Shift"
 */
export const parseCellValue = (raw) => {
  if (!raw) return { status: null, machineName: '', error: '', detail: '' };
  const parts = raw.split('-/-');
  return {
    status: parts[0] || null,
    machineName: parts[1] || '',
    time: parts[2] || '',
    errorCode: parts[3] || '',
    errorMsg: parts[4] || '',
    detail: parts[5] || '',
    shift: parts[6] || '',
  };
};

const MachineCell = ({ machineName, cellValue, onClick, isSelected }) => {
  const parsed = parseCellValue(cellValue);
  const statusKey = parsed.status || 'OFF';
  const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG['OFF'];
  const isError = statusKey === 'ERROR';
  const isRun = statusKey === 'RUN';

  return (
    <Tooltip
      title={
        cellValue ? (
          <Box sx={{ p: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
              {parsed.machineName || machineName}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: cfg.color }}>
              Status: {cfg.label}
            </Typography>
            {parsed.errorMsg && parsed.errorMsg !== 'None' && (
              <Typography variant="caption" sx={{ display: 'block', color: '#ff6b6b' }}>
                Error: {parsed.errorMsg}
              </Typography>
            )}
            {parsed.time && (
              <Typography variant="caption" sx={{ display: 'block', opacity: 0.7 }}>
                {parsed.time}
              </Typography>
            )}
          </Box>
        ) : machineName
      }
      placement="top"
      arrow
    >
      <Box
        onClick={onClick}
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 0.75,
          borderRadius: '10px',
          cursor: 'pointer',
          border: isSelected
            ? '2px solid #7367f0'
            : '1px solid rgba(255,255,255,0.1)',
          background: isSelected
            ? 'rgba(115,103,240,0.2)'
            : 'rgba(255,255,255,0.04)',
          transition: 'all 0.2s ease',
          minWidth: 70,
          minHeight: 70,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 6px 20px ${cfg.glow}`,
            border: `2px solid ${cfg.color}`,
            background: 'rgba(255,255,255,0.08)',
          },
        }}
      >
        {/* Status Indicator Circle */}
        <Box
          className={isError ? 'blinking' : ''}
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: cfg.bg,
            boxShadow: `0 0 ${isError ? '12px' : '6px'} ${cfg.glow}`,
            mb: 0.5,
            flexShrink: 0,
            animation: isError ? 'pulse 1.2s ease-in-out infinite' : 'none',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1, transform: 'scale(1)' },
              '50%': { opacity: 0.6, transform: 'scale(1.15)' },
            },
          }}
        />

        {/* Machine name */}
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.65rem',
            fontWeight: 600,
            textAlign: 'center',
            lineHeight: 1.2,
            color: 'text.primary',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {machineName}
        </Typography>

        {/* Status label */}
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.6rem',
            color: cfg.color,
            fontWeight: 700,
            mt: 0.2,
          }}
        >
          {cfg.label}
        </Typography>

        {/* Error badge */}
        {isError && (
          <Box
            sx={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#ff416c',
              border: '2px solid #fff',
              animation: 'pulse 1s ease-in-out infinite',
            }}
          />
        )}
      </Box>
    </Tooltip>
  );
};

export default memo(MachineCell);
