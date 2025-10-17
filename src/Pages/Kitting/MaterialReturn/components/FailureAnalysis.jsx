import React, { useState, useEffect, useMemo } from "react";
import { LinearProgress, Box, Typography, styled, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Tạo một styled component để hiển thị giá trị bên trong thanh tiến trình
const ProgressContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
}));

const ProgressText = styled(Typography)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  borderRadius: "5px",
  color: "#fff",
  padding: "0 6px",
  transition: "left 0.6s ease, right 0.6s ease", // Thêm transition cho cả left và right
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: "12px !important",
  borderRadius: "5px",
  backgroundColor: "#ffffff00 !important",
  overflow: "hidden", // Đảm bảo rằng các góc bo tròn
  "& .MuiLinearProgress-bar": {
    borderRadius: "5px", // Bo tròn thanh tiến trình bên trong
  },
}));

const Legend = ({ labels, colors, number }) => (
  <Box
    sx={{
      display: "flex",
      float: "right",
      width: "100%",
      whiteSpace: "nowrap",
      mt: 0.6,
      mb: 0.3,
    }}
  >
    {labels.map((label, index) => (
      <Box key={index} sx={{ display: "flex", alignItems: "center", mr: 2 }}>
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: colors[index],
            alignItems: "center",
            mr: 1,
            border: "1px solid #fff",
          }}
        >
          <Typography sx={{ textAlign: "center" }} variant="body2">
            {number || 0}
          </Typography>
        </Box>
        <Typography sx={{ color: colors[index], pt: "2px" }} variant="body2">
          {label}
        </Typography>
      </Box>
    ))}
  </Box>
);

const HiProgressBar = ({
  DataSeries = [],
  DataSeries2 = [],
  onShowModal,
  idata = [],
  idata2 = [],
}) => {
  const theme = useTheme();

  const maxFrequency =
    DataSeries.length > 0
      ? Math.max(...DataSeries.map((e) => e.Frequency), 0)
      : 1;

  const maxFrequency2 =
    DataSeries2.length > 0
      ? Math.max(...DataSeries2.map((e) => e.Frequency), 0)
      : 1;

  return DataSeries.length > 0 ? (
    <>
      <Grid container columns={12}>
        <Grid lg={6} md={6} xs={12}>
          <Box sx={{ position: "relative" }}>
            <Legend
              labels={[`Wait Return`]}
              colors={["linear-gradient(90deg,#ff311055,#ff3110)"]}
              number={DataSeries.length}
            />
            {DataSeries.map((error, index) => (
              <Box
                key={index} // Thêm key cho mỗi Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 0.9,
                  mb: 0,
                  transition: "opacity 1s ease-in-out",
                  padding: "0px 35px",
                }}
                onClick={() => {
                  onShowModal(
                    idata.filter((item) => item.kp_no === error.Series)
                  );
                }}
              >
                <Box
                  className="SlideProgress"
                  sx={{ width: "90%", textAlign: "left", pl: 0.5 }}
                >
                  <Typography
                    className="headerSlideProgress"
                    sx={{
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                      color: theme.palette.primary.conponent,
                      marginBottom: "0",
                    }}
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    {error.Series || "Other"}
                  </Typography>
                  <ProgressContainer>
                    <StyledLinearProgress
                      variant="determinate"
                      value={
                        error.Frequency > 0
                          ? (error.Frequency * 100) / maxFrequency
                          : 0
                      }
                      sx={{
                        "& .MuiLinearProgress-bar": {
                          background:
                            "linear-gradient(90deg,#ff311055,#ff3110)",
                        },
                      }}
                    />
                    <ProgressText
                      sx={{
                        left: `calc(${
                          error.Frequency > 0
                            ? (error.Frequency * 100) / maxFrequency
                            : 0
                        }% + 1px)`, // Điều chỉnh vị trí giá trị để căn giữa thanh
                        width: "auto",
                        minWidth: "30px",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                        fontSize: "12px",

                        color: theme.palette.primary.conponent,
                      }}
                      variant="body2"
                    >
                      {error.Frequency}
                    </ProgressText>
                  </ProgressContainer>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid lg={6} md={6} xs={12}>
          <Box sx={{ position: "relative" }}>
            <Legend
              labels={[`Wait LCR`]}
              colors={["linear-gradient(90deg,#efae4d,#ff9800)"]}
              number={DataSeries2.length}
            />
            {DataSeries2.map((error, index) => (
              <Box
                key={index} // Thêm key cho mỗi Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 0.9,
                  mb: 0,
                  transition: "opacity 1s ease-in-out",
                  padding: "0px 35px",
                }}
                onClick={() => {
                  onShowModal(
                    idata2.filter((item) => item.kp_no === error.Series)
                  );
                }}
              >
                <Box
                  className="SlideProgress"
                  sx={{ width: "90%", textAlign: "left", pl: 0.5 }}
                >
                  <Typography
                    className="headerSlideProgress"
                    sx={{
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                      color: theme.palette.primary.conponent,
                      marginBottom: "0",
                    }}
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    {error.Series || "Other"}
                  </Typography>
                  <ProgressContainer>
                    <StyledLinearProgress
                      variant="determinate"
                      value={
                        error.Frequency > 0
                          ? (error.Frequency * 100) / maxFrequency2
                          : 0
                      }
                      sx={{
                        "& .MuiLinearProgress-bar": {
                          background: "linear-gradient(90deg,#efae4d,#ff9800)",
                        },
                      }}
                    />
                    <ProgressText
                      sx={{
                        left: `calc(${
                          error.Frequency > 0
                            ? (error.Frequency * 100) / maxFrequency2
                            : 0
                        }% + 1px)`, // Điều chỉnh vị trí giá trị để căn giữa thanh
                        width: "auto",
                        minWidth: "30px",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                        fontSize: "12px",

                        color: theme.palette.primary.conponent,
                      }}
                      variant="body2"
                    >
                      {error.Frequency}
                    </ProgressText>
                  </ProgressContainer>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </>
  ) : (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Typography>Null</Typography>
    </Box>
  );
};

export default HiProgressBar;
