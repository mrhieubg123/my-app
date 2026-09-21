import React, { memo } from 'react';
import {
  Box,
  Typography,
  Drawer,
  Divider,
  Chip,
  IconButton,
  LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import { STATUS_CONFIG } from './StatusLegend';
import { parseCellValue } from './MachineCell';

const InfoRow = ({ label, value, color }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
      {label}
    </Typography>
    <Typography variant="caption" sx={{ fontWeight: 700, color: color || 'text.primary' }}>
      {value || '—'}
    </Typography>
  </Box>
);

const DetailPanel = ({ open, onClose, selectedMachine }) => {
  if (!selectedMachine) return null;

  const { line, machineName, cellValue } = selectedMachine;
  const parsed = parseCellValue(cellValue);
  const statusKey = parsed.status || 'OFF';
  const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG['OFF'];
  const isError = statusKey === 'ERROR';
  const isRun = statusKey === 'RUN';

  const StatusIcon = isRun
    ? CheckCircleOutlineIcon
    : isError
    ? WarningAmberIcon
    : PowerOffIcon;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{
        '& .MuiDrawer-paper': {
          width: 320,
          bgcolor: 'background.paper',
          backgroundImage: 'none',
          boxShadow: '-4px 0 30px rgba(0,0,0,0.2)',
        },
      }}
    >
      <Box sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {parsed.machineName || machineName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Line: {line}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Status Card */}
        <Box
          sx={{
            borderRadius: 3,
            p: 2,
            background: cfg.bg,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 2,
            boxShadow: `0 4px 20px ${cfg.glow}`,
          }}
        >
          <StatusIcon sx={{ fontSize: 36, color: '#fff' }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', lineHeight: 1 }}>
              {cfg.label}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Current Status
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Info Details */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
            Machine Details
          </Typography>
          <InfoRow label="Status" value={cfg.label} color={cfg.color} />
          {parsed.time && <InfoRow label="Last Update" value={parsed.time} />}
          {parsed.shift && parsed.shift !== 'None' && (
            <InfoRow label="Shift" value={parsed.shift} />
          )}

          {(isError || parsed.errorCode) && (
            <>
              <Divider sx={{ my: 1.5 }} />
              <Typography
                variant="overline"
                sx={{ color: '#ff4b2b', mb: 1, display: 'block', fontWeight: 700 }}
              >
                Error Information
              </Typography>
              {parsed.errorCode && parsed.errorCode !== 'None' && (
                <InfoRow label="Error Code" value={parsed.errorCode} color="#ff6b6b" />
              )}
              {parsed.errorMsg && parsed.errorMsg !== 'None' && (
                <InfoRow label="Error Message" value={parsed.errorMsg} color="#ff6b6b" />
              )}
              {parsed.detail && parsed.detail !== 'None' && (
                <InfoRow label="Detail" value={parsed.detail} />
              )}
            </>
          )}
        </Box>

        {/* Footer hint */}
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 2,
            background: 'rgba(115,103,240,0.08)',
            border: '1px solid rgba(115,103,240,0.2)',
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            💡 Go to{' '}
            <strong>MET System → Machine Control</strong> for full machine analysis.
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default memo(DetailPanel);
