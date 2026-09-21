import React, { memo } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Button,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { PRIORITY_CONFIG } from './AlertStatsBar';

const AlertFilterPanel = ({ filters, onChange }) => {
  const { priorities, sources, showAcknowledged } = filters;

  const handlePriority = (p) => {
    const next = priorities.includes(p) ? priorities.filter((x) => x !== p) : [...priorities, p];
    onChange({ ...filters, priorities: next });
  };

  const handleSource = (s) => {
    const next = sources.includes(s) ? sources.filter((x) => x !== s) : [...sources, s];
    onChange({ ...filters, sources: next });
  };

  const allSources = ['Maintenance', 'Machine', 'Production', 'Voltage', 'Manual'];

  return (
    <Box
      sx={{
        width: { xs: '100%', md: 200 },
        flexShrink: 0,
        borderRadius: 3,
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.02)',
        p: 2,
        height: 'fit-content',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <FilterListIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Filters
        </Typography>
      </Box>

      {/* Priority */}
      <Typography
        variant="overline"
        sx={{ color: 'text.secondary', fontSize: '0.65rem', display: 'block', mb: 0.5 }}
      >
        Priority
      </Typography>
      {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
        <FormControlLabel
          key={key}
          control={
            <Checkbox
              size="small"
              checked={priorities.includes(key)}
              onChange={() => handlePriority(key)}
              sx={{ color: cfg.color, '&.Mui-checked': { color: cfg.color }, py: 0.3 }}
            />
          }
          label={
            <Typography variant="caption" sx={{ fontWeight: 600, color: cfg.color }}>
              {cfg.label}
            </Typography>
          }
        />
      ))}

      <Divider sx={{ my: 1.5 }} />

      {/* Source */}
      <Typography
        variant="overline"
        sx={{ color: 'text.secondary', fontSize: '0.65rem', display: 'block', mb: 0.5 }}
      >
        Source
      </Typography>
      {allSources.map((s) => (
        <FormControlLabel
          key={s}
          control={
            <Checkbox
              size="small"
              checked={sources.includes(s)}
              onChange={() => handleSource(s)}
              sx={{ py: 0.3 }}
            />
          }
          label={<Typography variant="caption">{s}</Typography>}
        />
      ))}

      <Divider sx={{ my: 1.5 }} />

      {/* Show Acknowledged */}
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={showAcknowledged}
            onChange={(e) => onChange({ ...filters, showAcknowledged: e.target.checked })}
            sx={{ py: 0.3 }}
          />
        }
        label={<Typography variant="caption">Show Acknowledged</Typography>}
      />

      <Button
        size="small"
        fullWidth
        variant="outlined"
        onClick={() =>
          onChange({
            priorities: ['critical', 'warning', 'info'],
            sources: allSources,
            showAcknowledged: false,
          })
        }
        sx={{ mt: 1.5, fontSize: '0.72rem', textTransform: 'none' }}
      >
        Reset Filters
      </Button>
    </Box>
  );
};

export default memo(AlertFilterPanel);
