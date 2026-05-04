import {
  Box,
  Grid,
  Card,
  Grid2,
  Icon,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HiWarningLight from "../../../../components/HiWarningLight";
import Highcharts, { color, offset } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useMemo, useEffect, useRef, useState } from "react";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import {
  Functions,
  RocketLaunch,
  PauseCircleOutlineRounded,
  ReportGmailerrorredOutlined,
} from "@mui/icons-material";

const ESDTotal = ({
  data = [],
  children,
  alarn,
  alarnHeader = false,
  statusHeader = [],
  width = "100%",
  height = "100px",
  bgColor = "#4CAF50",
  border = "1px solid black",
  variant = "default",
  header = "",
  lg = 12,
  md = 12,
  xs = 12,
  overflow = true,
  onSendData,
  isActive,
  onCheckSheet,
}) => {
  const theme = useTheme();

  return (
    <Grid
      size={{ lg, md, xs }}
      item
      lg={lg}
      md={md}
      xs={xs}
      sx={{ padding: 1 }}
    >
      <Card
        sx={{
          width,
          height,
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          boxShadow: 5,
          padding: 1.5,
          "&:hover": alarn && {
            transform: "scale(1.05)",
            transition: "transform 0.2s ease-in-out",
            backgroundColor: theme.palette.primary.main,
          },

          background: bgColor, // Màu xanh lá cây
          justifyContent: "space-between",
          position: "relative",
          color: "white",
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            marginLeft: 1,
            color: "$fff",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "800" }}>
            {header || "Header"}{" "}
            {alarnHeader ? (
              <HiWarningLight status={statusHeader}></HiWarningLight>
            ) : (
              ""
            )}{" "}
          </Typography>
        </Box>

        {/* Tên file */}
        {/* <Typography
          variant="body2"
          component="div"
          sx={{ fontSize: "1.1vw", fontWeight: "bold" }}
        ></Typography> */}

        {/* Icon góc phải dưới */}
        <Box
          sx={{
            position: "absolute",
            bottom: "10px",
            left: "20px",
          }}
        >
          {header === "Total" ? (
            <Functions sx={{ color: "white", fontSize: "2vw" }} />
          ) : header === "Run" ? (
            <RocketLaunch sx={{ color: "white", fontSize: "2vw" }} />
          ) : header === "Stop" ? (
            <PauseCircleOutlineRounded
              sx={{ color: "white", fontSize: "2vw" }}
            />
          ) : header === "Off" ? (
            <AssignmentOutlinedIcon sx={{ color: "white", fontSize: "2vw" }} />
          ) : (
            <ReportGmailerrorredOutlined
              sx={{ color: "white", fontSize: "2vw" }}
            />
          )}
        </Box>
        {/* Icon góc trai dưới */}
        <Box
          sx={{
            position: "absolute",
            bottom: "10px",
            right: "20px",
            fontSize: "2vw",
            fontWeight: "bold",
          }}
        >
          {children}
        </Box>
      </Card>
    </Grid>
  );
};

export default ESDTotal;
