import React, { memo, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  TextField,
  Collapse,
  IconButton,
  Tooltip,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { PRIORITY_CONFIG } from './AlertStatsBar';

const AlertCard = ({ alert, onAcknowledge, onAssign }) => {
  const [expanded, setExpanded] = useState(false);
  const [assignee, setAssignee] = useState(alert.assignedTo || '');
  const [editingAssign, setEditingAssign] = useState(false);

  const cfg = PRIORITY_CONFIG[alert.priority] || PRIORITY_CONFIG.info;
  const { Icon } = cfg;

  const timeAgo = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <Box
      sx={{
        borderRadius: 3,
        border: `1px solid ${cfg.border}30`,
        borderLeft: `4px solid ${cfg.border}`,
        background: alert.acknowledged
          ? 'rgba(255,255,255,0.02)'
          : cfg.bg,
        mb: 1,
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        opacity: alert.acknowledged ? 0.65 : 1,
        '&:hover': {
          boxShadow: `0 4px 20px ${cfg.border}20`,
          transform: 'translateY(-1px)',
        },
      }}
    >
      <Box sx={{ p: 1.5 }}>
        {/* Top row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          {/* Priority icon */}
          <Box
            sx={{
              mt: 0.2,
              p: 0.6,
              borderRadius: '50%',
              background: `${cfg.border}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              animation:
                alert.priority === 'critical' && !alert.acknowledged
                  ? 'pulse 2s ease-in-out infinite'
                  : 'none',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.4 },
              },
            }}
          >
            <Icon sx={{ fontSize: 18, color: cfg.color }} />
          </Box>

          {/* Message + meta */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap', mb: 0.3 }}>
              <Chip
                size="small"
                label={cfg.label}
                sx={{
                  height: 18,
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  bgcolor: `${cfg.border}20`,
                  color: cfg.color,
                  border: `1px solid ${cfg.border}50`,
                }}
              />
              <Chip
                size="small"
                label={alert.source}
                sx={{ height: 18, fontSize: '0.6rem', fontWeight: 600 }}
              />
              {alert.acknowledged && (
                <Chip
                  size="small"
                  label="Acknowledged"
                  color="success"
                  sx={{ height: 18, fontSize: '0.6rem', fontWeight: 600 }}
                />
              )}
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                lineHeight: 1.3,
                mb: 0.3,
                textDecoration: alert.acknowledged ? 'line-through' : 'none',
                color: alert.acknowledged ? 'text.secondary' : 'text.primary',
              }}
            >
              {alert.title}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {timeAgo(alert.timestamp)} · {new Date(alert.timestamp).toLocaleString()}
            </Typography>
          </Box>

          {/* Expand toggle */}
          <IconButton size="small" onClick={() => setExpanded((p) => !p)}>
            {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 0.75, mt: 1, flexWrap: 'wrap' }}>
          {!alert.acknowledged && (
            <Button
              size="small"
              variant="contained"
              startIcon={<CheckCircleOutlineIcon />}
              onClick={() => onAcknowledge(alert.id)}
              sx={{
                fontSize: '0.7rem',
                py: 0.3,
                px: 1.2,
                textTransform: 'none',
                bgcolor: '#38ef7d',
                color: '#000',
                fontWeight: 700,
                '&:hover': { bgcolor: '#2ed8b6' },
              }}
            >
              Acknowledge
            </Button>
          )}
          {!editingAssign ? (
            <Button
              size="small"
              variant="outlined"
              startIcon={<PersonAddOutlinedIcon />}
              onClick={() => setEditingAssign(true)}
              sx={{ fontSize: '0.7rem', py: 0.3, px: 1.2, textTransform: 'none' }}
            >
              {alert.assignedTo ? `Assigned: ${alert.assignedTo}` : 'Assign'}
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Technician name..."
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                sx={{ '& .MuiInputBase-input': { py: 0.4, fontSize: '0.75rem' }, width: 160 }}
                autoFocus
              />
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  onAssign(alert.id, assignee);
                  setEditingAssign(false);
                }}
                sx={{ py: 0.4, fontSize: '0.7rem', textTransform: 'none' }}
              >
                Save
              </Button>
              <Button
                size="small"
                onClick={() => setEditingAssign(false)}
                sx={{ py: 0.4, fontSize: '0.7rem', textTransform: 'none' }}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Expanded detail */}
      <Collapse in={expanded}>
        <Box
          sx={{
            px: 2,
            pb: 1.5,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(0,0,0,0.15)',
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
            <strong>Detail:</strong> {alert.detail || 'No additional details.'}
          </Typography>
          {alert.assignedTo && (
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
              <strong>Assigned to:</strong> {alert.assignedTo}
            </Typography>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default memo(AlertCard);
