import React, { useMemo } from "react";
import { Box, List, ListItem, ListItemText, Typography, Chip, Badge, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const MaintenanceAlerts = ({ idata = [], onCallBack }) => {
  const theme = useTheme();

  const alerts = useMemo(() => {
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    const upcoming = [];
    const stuck = [];

    // Deduplicate idata to only evaluate the latest record for each Line
    const latestItemsByLine = Object.values(
      (idata || []).reduce((acc, item) => {
        if (!acc[item.LINE]) {
          acc[item.LINE] = item;
        }
        return acc;
      }, {})
    );

    latestItemsByLine.forEach((item) => {
      const statusUpper = (item.STATUS || "").trim().toUpperCase();
      const isDenied = (item.STATUS || "").trim().toLowerCase().startsWith("deny");

      // 1. Check for stuck or denied signatures
      if (item.STATUS && statusUpper !== "OK" && statusUpper !== "APPROVED") {
        if (isDenied) {
          stuck.push({
            ...item,
            type: "denied",
            title: `Line ${item.LINE} - Bị từ chối duyệt`,
            description: `Kế hoạch bảo trì bị từ chối: [${item.STATUS}]. Cần cập nhật lại.`,
          });
        } else if (item.UPDATED_AT) {
          const updateDate = new Date(item.UPDATED_AT);
          if (!isNaN(updateDate.getTime())) {
            const diffHours = (today - updateDate) / (1000 * 60 * 60);
            if (diffHours > 24) {
              stuck.push({
                ...item,
                type: "stuck",
                hours: Math.round(diffHours),
                title: `Line ${item.LINE} - Chậm trễ ký duyệt`,
                description: `Chờ ký duyệt [${item.STATUS}] đã trôi qua ${Math.round(diffHours)} giờ.`,
              });
            }
          }
        }
      }

      // 2. Check for upcoming maintenance (no status, date_check is between today and 3 days later)
      if (!item.STATUS && item.DATE_CHECK) {
        const checkDate = new Date(item.DATE_CHECK);
        if (!isNaN(checkDate.getTime())) {
          // Normalize dates to midnight for day comparison
          const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const checkMid = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate());
          const diffDays = Math.round((checkMid - todayMid) / (1000 * 60 * 60 * 24));

          if (diffDays >= 0 && diffDays <= 3) {
            upcoming.push({
              ...item,
              type: "upcoming",
              days: diffDays,
              title: `Line ${item.LINE} - Sắp đến hạn`,
              description: diffDays === 0 
                ? "Lên kế hoạch bảo trì vào hôm nay!" 
                : `Hạn bảo trì trong ${diffDays} ngày tới (${item.DATE_CHECK}).`,
            });
          }
        }
      }
    });

    // Sort by urgency: Denied > Stuck (highest hours first) > Upcoming (closest days first)
    const deniedAlerts = stuck.filter((a) => a.type === "denied");
    const stuckAlerts = stuck.filter((a) => a.type === "stuck").sort((a, b) => b.hours - a.hours);
    const upcomingAlerts = upcoming.sort((a, b) => a.days - b.days);

    return [...deniedAlerts, ...stuckAlerts, ...upcomingAlerts];
  }, [idata]);

  if (alerts.length === 0) {
    return (
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        p: 2,
        color: "text.secondary"
      }}>
        <ErrorOutlineIcon sx={{ fontSize: 36, color: "action.disabled", mb: 1 }} />
        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
          Không có cảnh báo khẩn cấp nào.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", overflowY: "auto", pr: 0.5 }}>
      <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {alerts.map((alert, idx) => (
          <ListItem
            key={idx}
            component={Paper}
            elevation={1}
            onClick={() => onCallBack(alert)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              p: 1.5,
              borderRadius: "8px",
              cursor: "pointer",
              borderLeft: "5px solid",
              borderLeftColor: (alert.type === "stuck" || alert.type === "denied") ? "error.main" : "primary.main",
              backgroundColor: (alert.type === "stuck" || alert.type === "denied") ? "rgba(211, 47, 47, 0.02)" : "rgba(25, 118, 210, 0.02)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 3,
                backgroundColor: (alert.type === "stuck" || alert.type === "denied") ? "rgba(211, 47, 47, 0.05)" : "rgba(25, 118, 210, 0.05)",
              }
            }}
          >
            <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: "12px", color: "text.primary" }}>
                {alert.title}
              </Typography>
              <Chip
                icon={
                  alert.type === "denied" 
                    ? <ErrorOutlineIcon style={{ fontSize: 12 }} /> 
                    : alert.type === "stuck" 
                      ? <AccessTimeIcon style={{ fontSize: 12 }} /> 
                      : <EventNoteIcon style={{ fontSize: 12 }} />
                }
                label={alert.type === "denied" ? "Bị từ chối" : alert.type === "stuck" ? `${alert.hours}h` : alert.days === 0 ? "Hôm nay" : `${alert.days} ngày`}
                size="small"
                color={(alert.type === "stuck" || alert.type === "denied") ? "error" : "primary"}
                sx={{
                  height: 18,
                  fontSize: "9px",
                  fontWeight: 700,
                  "& .MuiChip-label": { px: 0.8 },
                  "& .MuiChip-icon": { marginLeft: "4px", marginRight: "-4px" }
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "11px", fontWeight: 500 }}>
              {alert.description}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default React.memo(MaintenanceAlerts);
