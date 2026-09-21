import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

const OEEKpiCard = ({ title, value = 0, target = 85, unit = '%', trend = [], icon, color }) => {
  const isGood = value >= target;
  const isWarn = value >= target * 0.9 && value < target;
  const statusColor = isGood ? '#38ef7d' : isWarn ? '#f09819' : '#ff416c';

  // Compute sparkline trend arrow
  const trendLen = trend.length;
  const trendDiff =
    trendLen >= 2 ? trend[trendLen - 1] - trend[trendLen - 2] : 0;
  const TrendIcon =
    trendDiff > 0.5 ? TrendingUpIcon : trendDiff < -0.5 ? TrendingDownIcon : TrendingFlatIcon;
  const trendColor =
    trendDiff > 0.5 ? '#38ef7d' : trendDiff < -0.5 ? '#ff416c' : '#aaa';

  const pct = Math.min((value / 100) * 100, 100);

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        border: `1px solid ${statusColor}30`,
        borderLeft: `5px solid ${statusColor}`,
        background: `linear-gradient(135deg, ${statusColor}08 0%, ${statusColor}01 100%)`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 1.5,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background watermark */}
      <Box
        sx={{
          position: 'absolute',
          right: -8,
          bottom: -8,
          fontSize: '6rem',
          opacity: 0.06,
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        {icon}
      </Box>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}
        >
          {title}
        </Typography>
        <TrendIcon sx={{ fontSize: 32, color: trendColor }} />
      </Box>

      {/* Value */}
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 900, color: statusColor, lineHeight: 1 }}
        >
          {value.toFixed(1)}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700 }}>
          {unit}
        </Typography>
      </Box>

      {/* Progress bar */}
      <Box>
        <Box sx={{ position: 'relative', height: 16, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          {/* Target marker */}
          <Box
            sx={{
              position: 'absolute',
              left: `${target}%`,
              top: 0,
              bottom: 0,
              width: 4,
              bgcolor: 'rgba(255,255,255,0.4)',
              zIndex: 2,
            }}
          />
          {/* Fill */}
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${pct}%`,
              borderRadius: 3,
              background: `linear-gradient(90deg, ${statusColor}88, ${statusColor})`,
              transition: 'width 0.8s ease',
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.3 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
            0%
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
            Target {target}%
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
            100%
          </Typography>
        </Box>
      </Box>

      {/* Delta vs target */}
      <Typography variant="caption" sx={{ color: isGood ? '#38ef7d' : '#ff6b6b', fontWeight: 700, fontSize: '1rem' }}>
        {isGood
          ? `✓ +${(value - target).toFixed(1)}% above target`
          : `↓ ${(target - value).toFixed(1)}% below target`}
      </Typography>
    </Box>
  );
};

export default memo(OEEKpiCard);
