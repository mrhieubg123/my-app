import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Chip,
  CircularProgress,
  Badge,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useSelector } from 'react-redux';
import HiBox from '../../../components/HiBox';
import { getAuthorizedAxiosIntance } from '../../../utils/axiosConfig';
import MachineCell, { parseCellValue } from './components/MachineCell';
import StatusLegend, { STATUS_CONFIG } from './components/StatusLegend';
import DetailPanel from './components/DetailPanel';

const POLL_INTERVAL = 5000; // 5 seconds
const axiosInstance = await getAuthorizedAxiosIntance();

const FactoryFloorMap = () => {
  const selectedFactory = useSelector((state) => state.param.params.Factory);
  const [machineData, setMachineData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCellKey, setSelectedCellKey] = useState(null);


  const fetchData = useCallback(async () => {
    if (!axiosInstance) return;
    try {
      const response = await axiosInstance.post('api/Fatp/FATPMachineStatus', {
        factory: selectedFactory,
      });
      setMachineData(response.data || []);
      setLastUpdated(new Date());
    } catch (err) {
      // axiosConfig already shows toast
    } finally {
      setIsLoading(false);
    }
  }, [axiosInstance, selectedFactory]);

  // Initial fetch + polling
  useEffect(() => {
    if (!axiosInstance) return;
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData, axiosInstance]);

  // Compute status counts
  const statusCounts = useMemo(() => {
    const counts = { RUN: 0, STOP: 0, ERROR: 0, OFF: 0, CUT: 0 };
    machineData.forEach((row) => {
      Object.entries(row).forEach(([key, val]) => {
        if (key === 'LINE' || !val) return;
        const status = val.split('-')[0];
        if (counts[status] !== undefined) counts[status]++;
      });
    });
    return counts;
  }, [machineData]);

  // Get machine columns (all keys except LINE)
  const machineColumns = useMemo(() => {
    if (machineData.length === 0) return [];
    return Object.keys(machineData[0]).filter((k) => k !== 'LINE');
  }, [machineData]);

  const handleCellClick = (line, machineName, cellKey, cellValue) => {
    setSelectedMachine({ line, machineName, cellValue });
    setSelectedCellKey(cellKey);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedCellKey(null);
  };

  const errorCount = statusCounts.ERROR || 0;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1.5,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MapOutlinedIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Factory Floor Map
          </Typography>
          {errorCount > 0 && (
            <Chip
              size="small"
              label={`${errorCount} Error${errorCount > 1 ? 's' : ''}`}
              color="error"
              sx={{
                fontWeight: 700,
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.6 },
                },
              }}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Live indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <FiberManualRecordIcon
              sx={{
                fontSize: 12,
                color: '#38ef7d',
                animation: 'blink 1.5s ease-in-out infinite',
                '@keyframes blink': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.2 },
                },
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              LIVE · updates every 5s
            </Typography>
          </Box>
          {lastUpdated && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Last: {lastUpdated.toLocaleTimeString()}
            </Typography>
          )}
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={fetchData}
            disabled={isLoading}
            variant="outlined"
            sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.3 }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Legend */}
      <Box sx={{ mb: 1.5 }}>
        <StatusLegend counts={statusCounts} />
      </Box>

      {/* Map Content */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : machineData.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
          <Typography color="text.secondary">No machine data available</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            borderRadius: 3,
            overflow: 'auto',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Column headers */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `120px repeat(${machineColumns.length}, 1fr)`,
              gap: 0.5,
              px: 1.5,
              pt: 1.5,
              pb: 0.5,
              position: 'sticky',
              top: 0,
              zIndex: 10,
              background: 'background.paper',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'center', py: 0.5 }}
            >
              LINE
            </Typography>
            {machineColumns.map((col) => (
              <Typography
                key={col}
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: 'text.secondary',
                  textAlign: 'center',
                  py: 0.5,
                  fontSize: '0.65rem',
                }}
              >
                {col}
              </Typography>
            ))}
          </Box>

          {/* Rows */}
          <Box sx={{ px: 1.5, pb: 1.5 }}>
            {machineData.map((row, rowIndex) => (
              <Box
                key={rowIndex}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `120px repeat(${machineColumns.length}, 1fr)`,
                  gap: 0.75,
                  mb: 0.75,
                  py: 0.75,
                  borderRadius: 2,
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  '&:last-child': { borderBottom: 'none' },
                  '&:hover': { background: 'rgba(255,255,255,0.02)' },
                  transition: 'background 0.2s',
                }}
              >
                {/* Line label */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    pl: 0.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      color: 'text.primary',
                    }}
                  >
                    {row.LINE}
                  </Typography>
                </Box>

                {/* Machine cells */}
                {machineColumns.map((col) => {
                  const cellKey = `${rowIndex}-${col}`;
                  const cellValue = row[col];
                  const parsed = parseCellValue(cellValue);
                  const machineName = parsed.machineName || col;

                  return (
                    <MachineCell
                      key={col}
                      machineName={machineName}
                      cellValue={cellValue}
                      isSelected={selectedCellKey === cellKey}
                      onClick={() => handleCellClick(row.LINE, machineName, cellKey, cellValue)}
                    />
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Detail Drawer */}
      <DetailPanel
        open={detailOpen}
        onClose={handleCloseDetail}
        selectedMachine={selectedMachine}
      />
    </Box>
  );
};

export default memo(FactoryFloorMap);
