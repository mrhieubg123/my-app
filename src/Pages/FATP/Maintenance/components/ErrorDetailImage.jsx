import React, { useState, useMemo } from "react";
import { Box, Button, Grid } from "@mui/material";
import imgMachine from "./image/machine.png";
import imgRobot from "./image/robot.png";
import stickLabel from "./image/stickLabel.png";
import xyRobot from "./image/xyRobot.png";
import { ExpandCircleDown, Help } from "@mui/icons-material";

const ErrorDetailImage = ({ idata = [] }) => {
  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Grid container columns={12}>
        {idata.length > 0
          ? idata.map(
              (
                row,
                index //,ERROR,ERROR_CODE,root_,EMP_confirm, act
              ) => {
                const todayStr = new Date().toISOString().slice(0, 10);
                const status =
                  row.STATUS_NAME === "approve"
                    ? "Approved"
                    : row.DATE_CHECK < todayStr
                    ? "Delay"
                    : "Ongoing";
                return (
                  <Grid size={{ lg: 3, md: 3, xs: 4 }}>
                    <a
                      href={`https://fiisw-cns.myfiinet.com/paperless/machine-history?qrcode=${encodeURIComponent(
                        row.QR_CODE || ""
                      )}`}
                      style={{
                        display: "flex",
                        flexDirection: "column", // xếp dọc
                        alignItems: "center", // center ngang
                        justifyContent: "center", // center dọc
                        height: "100%", // hoặc set cố định: 200px,...
                        textAlign: "center",
                        paddingBottom: "64px",
                        color: "#3498db",
                        gap: 8,
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Box
                        component="img"
                        align="center"
                        src={
                          row.NAME_MACHINE.toLowerCase().includes("xy")
                            ? xyRobot
                            : row.NAME_MACHINE.toLowerCase().includes("robot")
                            ? imgRobot
                            : row.NAME_MACHINE.toLowerCase().includes(
                                "stick label"
                              )
                            ? stickLabel
                            : imgMachine
                        }
                        sx={{ height: 72 }}
                      />

                      <div style={{ fontSize: 16, fontWeight: 600 }}>
                        {row.NAME_MACHINE}
                      </div>

                      {status === "Approved" ? (
                        <ExpandCircleDown
                          sx={{ fontSize: "1rem" }}
                        ></ExpandCircleDown>
                      ) : (
                        <Help
                          sx={{ fontSize: "1rem", color: "#757575" }}
                        ></Help>
                      )}
                    </a>
                  </Grid>
                );
              }
            )
          : ""}
      </Grid>
    </Box>
  );
};
export default ErrorDetailImage;
