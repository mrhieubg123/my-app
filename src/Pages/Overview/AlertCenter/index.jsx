import React, { useState, useMemo, memo } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Badge,
  Chip,
  IconButton,
  Button,
  InputAdornment,
  TextField,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import useAlerts from '../../../hooks/useAlerts';
import AlertStatsBar from './components/AlertStatsBar';
import AlertCard from './components/AlertCard';
import AlertFilterPanel from './components/AlertFilterPanel';

const DEFAULT_FILTERS = {
  priorities: ['critical', 'warning', 'info'],
  sources: ['Maintenance', 'Machine', 'Production', 'Voltage', 'Manual'],
  showAcknowledged: false,
};

const AlertCenter = () => {
  const { alerts, isLoading, lastUpdated, acknowledge, assign, refresh } = useAlerts();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [searchText, setSearchText] = useState('');

  const unacknowledgedCount = useMemo(
    () => alerts.filter((a) => !a.acknowledged && a.priority === 'critical').length,
    [alerts]
  );

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (!filters.priorities.includes(a.priority)) return false;
      if (!filters.sources.includes(a.source)) return false;
      if (!filters.showAcknowledged && a.acknowledged) return false;
      if (
        searchText &&
        !a.title.toLowerCase().includes(searchText.toLowerCase()) &&
        !a.detail?.toLowerCase().includes(searchText.toLowerCase())
      )
        return false;
      return true;
    });
  }, [alerts, filters, searchText]);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Badge badgeContent={unacknowledgedCount} color="error" max={99}>
            <NotificationsActiveIcon
              sx={{
                color: unacknowledgedCount > 0 ? '#ff416c' : 'text.secondary',
                animation: unacknowledgedCount > 0 ? 'shake 0.5s ease-in-out infinite alternate' : 'none',
                '@keyframes shake': {
                  '0%': { transform: 'rotate(-8deg)' },
                  '100%': { transform: 'rotate(8deg)' },
                },
              }}
            />
          </Badge>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Anomaly Alert Center
          </Typography>
          {lastUpdated && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              · Updated {lastUpdated.toLocaleTimeString()}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search alerts..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 220, '& .MuiInputBase-input': { py: 0.6, fontSize: '0.8rem' } }}
          />
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={refresh}
            disabled={isLoading}
            variant="outlined"
            sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.4 }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Stats bar */}
      <AlertStatsBar alerts={alerts} />

      {/* Main content */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
        {/* Filter panel */}
        <AlertFilterPanel filters={filters} onChange={setFilters} />

        {/* Alert list */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
              <CircularProgress />
            </Box>
          ) : filteredAlerts.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 200,
                borderRadius: 3,
                border: '1px dashed rgba(255,255,255,0.15)',
                gap: 1,
              }}
            >
              <NotificationsActiveIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
              <Typography color="text.secondary" variant="body2">
                {searchText ? 'No alerts match your search.' : 'No active alerts. All clear! ✅'}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                maxHeight: '75vh',
                overflowY: 'auto',
                pr: 0.5,
                '&::-webkit-scrollbar': { width: 4 },
                '&::-webkit-scrollbar-thumb': { bgcolor: '#cdcdcd8c', borderRadius: 2 },
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block', mb: 1, fontWeight: 600 }}
              >
                Showing {filteredAlerts.length} of {alerts.length} alerts
              </Typography>
              {filteredAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={acknowledge}
                  onAssign={assign}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default memo(AlertCenter);
