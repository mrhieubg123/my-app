import React, { useState, memo, useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from '@mui/material';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import SpeedIcon from '@mui/icons-material/Speed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BarChartIcon from '@mui/icons-material/BarChart';
import StarIcon from '@mui/icons-material/Star';
import HiBox from '../../../components/HiBox';
import OEEGaugeChart from './components/OEEGaugeChart';
import OEEKpiCard from './components/OEEKpiCard';
import OEEByLineChart from './components/OEEByLineChart';
import ParetoLossChart from './components/ParetoLossChart';
import {
  OEE_TARGET,
  mockOEEOverall,
  mockOEEByLine,
  mockParetoLosses,
  mockOEETrend,
  mockShiftOEE,
} from './mockData';

const TIME_RANGES = ['Today', 'This Week', 'This Month'];

const OEEDashboard = () => {
  const [timeRange, setTimeRange] = useState('This Week');

  // In production: fetch from API based on timeRange
  const overall = mockOEEOverall;
  const byLine = mockOEEByLine;
  const pareto = mockParetoLosses;
  const trend = mockOEETrend;

  const kpiCards = useMemo(
    () => [
      {
        title: 'Availability',
        value: overall.availability,
        target: 90,
        icon: '⏱️',
        color: '#219af5',
      },
      {
        title: 'Performance',
        value: overall.performance,
        target: 95,
        icon: '⚡',
        color: '#f09819',
      },
      {
        title: 'Quality (FPY)',
        value: overall.quality,
        target: 99,
        icon: '✅',
        color: '#38ef7d',
      },
    ],
    [overall]
  );

  return (
    <Grid container columns={12} spacing={1.5}>
      {/* Header */}
      <Grid size={{ xs: 12, lg: 12 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
            mb: 0.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LeaderboardOutlinedIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              OEE Dashboard
            </Typography>
            <Box
              sx={{
                px: 1,
                py: 0.2,
                borderRadius: 1,
                bgcolor: 'rgba(115,103,240,0.12)',
                border: '1px solid rgba(115,103,240,0.3)',
              }}
            >
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.65rem' }}>
                TARGET: {OEE_TARGET}%
              </Typography>
            </Box>
          </Box>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={(_, v) => v && setTimeRange(v)}
            size="small"
            sx={{ '& .MuiToggleButton-root': { py: 0.4, px: 1.5, fontSize: '0.72rem', textTransform: 'none' } }}
          >
            {TIME_RANGES.map((r) => (
              <ToggleButton key={r} value={r}>
                {r}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Grid>

      {/* OEE Gauge (left) */}
      <Grid size={{ xs: 12, md: 3, lg: 3 }}>
        <HiBox lg={12} md={12} xs={12} header="Overall OEE" height="28vh" variant="filled" alarn={false}>
          <OEEGaugeChart oee={overall.oee} target={OEE_TARGET} />
        </HiBox>
      </Grid>

      {/* KPI Cards (right of gauge) */}
      <Grid size={{ xs: 12, md: 9, lg: 9 }} container spacing={1.5}>
        {kpiCards.map((kpi) => (
          <Grid size={{ xs: 12, md: 4, lg: 4 }} key={kpi.title}>
            <HiBox lg={12} md={12} xs={12} height="28vh" variant="filled" alarn={false}>
              <OEEKpiCard
                title={kpi.title}
                value={kpi.value}
                target={kpi.target}
                icon={kpi.icon}
                color={kpi.color}
                trend={trend.oee}
              />
            </HiBox>
          </Grid>
        ))}
      </Grid>

      {/* Shift OEE summary strip */}
      <Grid size={{ xs: 12, lg: 12 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            p: 1.5,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            flexWrap: 'wrap',
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: 'text.secondary', mr: 1, alignSelf: 'center', textTransform: 'uppercase', letterSpacing: 0.5 }}
          >
            OEE by Shift:
          </Typography>
          {mockShiftOEE.map((s) => {
            const color = s.oee >= OEE_TARGET ? '#38ef7d' : s.oee >= 60 ? '#f09819' : '#ff416c';
            return (
              <Box
                key={s.shift}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  border: `1px solid ${color}40`,
                  background: `${color}10`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.7,
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.65rem' }}>
                  {s.shift}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, color, fontSize: '0.8rem' }}>
                  {s.oee}%
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Grid>

      {/* OEE by Line Chart */}
      <Grid size={{ xs: 12, md: 7, lg: 7 }}>
        <HiBox
          lg={12}
          md={12}
          xs={12}
          header="OEE by Line"
          note={`${timeRange} · Target ${OEE_TARGET}%`}
          height="42vh"
          variant="filled"
          alarn={false}
        >
          <Box sx={{ height: '100%', overflowY: 'auto', '&::-webkit-scrollbar': { width: 4 } }}>
            <OEEByLineChart data={byLine} target={OEE_TARGET} />
          </Box>
        </HiBox>
      </Grid>

      {/* Pareto Loss Chart */}
      <Grid size={{ xs: 12, md: 5, lg: 5 }}>
        <HiBox
          lg={12}
          md={12}
          xs={12}
          header="Top Loss Categories"
          note="Pareto Analysis"
          height="42vh"
          variant="filled"
          alarn={false}
        >
          <ParetoLossChart data={pareto} />
        </HiBox>
      </Grid>

      {/* OEE Formula explanation */}
      <Grid size={{ xs: 12, lg: 12 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            p: 1.5,
            borderRadius: 3,
            background: 'rgba(115,103,240,0.05)',
            border: '1px solid rgba(115,103,240,0.15)',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', mr: 0.5 }}>
            OEE Formula:
          </Typography>
          {[
            { label: 'Availability', value: `${overall.availability}%`, desc: '(Run Time / Planned Time)', color: '#219af5' },
            { label: '×', value: '', desc: '', color: 'text.secondary' },
            { label: 'Performance', value: `${overall.performance}%`, desc: '(Actual Output / Target Output)', color: '#f09819' },
            { label: '×', value: '', desc: '', color: 'text.secondary' },
            { label: 'Quality', value: `${overall.quality}%`, desc: '(Good Units / Total Units)', color: '#38ef7d' },
            { label: '=', value: '', desc: '', color: 'text.secondary' },
            { label: 'OEE', value: `${overall.oee}%`, desc: '', color: '#7367f0' },
          ].map((item, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              {item.value && (
                <>
                  <Typography variant="caption" sx={{ color: item.color, fontWeight: 700 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: item.color, fontSize: '0.9rem' }}>
                    {item.value}
                  </Typography>
                  {item.desc && (
                    <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.6rem' }}>
                      {item.desc}
                    </Typography>
                  )}
                </>
              )}
              {!item.value && (
                <Typography variant="body1" sx={{ color: item.color, fontWeight: 700, px: 0.5 }}>
                  {item.label}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
};

export default memo(OEEDashboard);
