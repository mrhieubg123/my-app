// import React, { useState, useMemo } from "react";
// import { Box, Typography, Paper, styled, useTheme } from "@mui/material";
// // Import các Icon
// import ScrewIcon from "@mui/icons-material/PrecisionManufacturing";
// import GlueIcon from "@mui/icons-material/FormatPaint";
// import ShieldingIcon from "@mui/icons-material/VerifiedUser";

// // --- Dữ liệu Định nghĩa Modes ---
// const MODES_DATA = [
//   { id: "Screw", label: "Screw", icon: ScrewIcon, color: "#00bcd4" }, // Cyan
//   { id: "Glue", label: "Glue", icon: GlueIcon, color: "#ff9800" }, // Amber
//   {
//     id: "Shielding",
//     label: "Shielding",
//     icon: ShieldingIcon,
//     color: "#4caf50",
//   }, // Green
// ];

// // Góc xoay ban đầu cho mỗi item (3 items, 360/3 = 120 độ)
// const ROTATION_ANGLE = 120;
// // Container xoay chính, được áp dụng CSS transform: rotate()
// const RotatingContainer = styled(Box)(({ theme, rotation }) => ({
//   width: "100%",
//   height: "100%",
//   position: "relative",
//   transition: "transform 0.5s ease-in-out", // Hiệu ứng chuyển động mượt mà
//   transform: `rotate(${rotation}deg)`, // Áp dụng góc xoay
// }));

// // Nút Icon nằm trên chu vi vòng tròn
// const ModeItem = styled(Paper)(({ theme, index, modeColor, isCenter }) => ({
//   width: theme.spacing(11),
//   height: theme.spacing(11),
//   borderRadius: "50%",
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "center",
//   alignItems: "center",
//   cursor: "pointer",
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transformOrigin: "0 0", // Điểm neo là tâm của container
//   transition: "all 0.5s ease-in-out",
//   zIndex: isCenter ? 10 : 5,
//   boxShadow: theme.shadows[4],
//   backgroundColor: isCenter ? modeColor : theme.palette.grey[100],
//   color: isCenter ? theme.palette.common.white : modeColor,

//   // Áp dụng vị trí ban đầu (dạng tròn)
//   // Tính toán vị trí ra chu vi vòng tròn (khoảng cách 120px)
//   transform: `translate(-50%, -50%) rotate(${
//     index * ROTATION_ANGLE
//   }deg) translate(120px) rotate(-${index * ROTATION_ANGLE}deg)`,

//   "&:hover": {
//     boxShadow: theme.shadows[8],
//   },
// }));

// // Vị trí hiển thị Text trung tâm
// const CenterText = styled(Box)(({ theme, modeColor }) => ({
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   zIndex: 15, // Đảm bảo nổi trên tất cả
//   textAlign: "center",
//   padding: theme.spacing(2),
//   width: theme.spacing(16),
//   height: theme.spacing(16),
//   borderRadius: "50%",
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "center",
//   alignItems: "center",
//   border: `4px solid ${modeColor}`,
//   boxShadow: theme.shadows[10],
//   transition: "border-color 0.5s ease-in-out, color 0.5s ease-in-out",
// }));
// export default function RotatingModeSelector({
//   activeModeaI = MODES_DATA[0].id,
//   onChangeMode,
// }) {
//   const theme = useTheme();

//   // 1. Tính toán góc xoay tổng
//   // Mode Screw ở vị trí 0 độ, Glue ở 120 độ, Shielding ở 240 độ
//   // Để mode X ở giữa, ta cần xoay ngược lại góc của mode X
//   const activeIndex = MODES_DATA.findIndex((m) => m.id === activeModeaI);
//   const totalRotation = useMemo(() => {
//     return -(activeIndex * ROTATION_ANGLE);
//   }, [activeIndex]);

//   // 2. Lấy thông tin Mode hiện tại cho Text trung tâm
//   const activeMode = MODES_DATA.find((m) => m.id === activeModeaI);

//   const handleModeClick = (clickedId) => {
//     onChangeMode(clickedId);
//     console.log(`Chế độ đã chọn: ${clickedId}`);
//     // Thực hiện logic tải lại dashboard tại đây
//   };

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         height: "100%",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       {/* 3. Text Trung tâm - Hiển thị Mode đang hoạt động */}
//       <CenterText modeColor={activeMode.color}>
//         <Typography
//           variant="h5"
//           sx={{ fontWeight: "bold", color: activeMode.color }}
//         >
//           {activeMode.label}
//         </Typography>
//         <Typography variant="caption" color="text.secondary">
//           Mode
//         </Typography>
//       </CenterText>

//       {/* 4. Container chứa các Icon - Áp dụng góc xoay tổng */}
//       <RotatingContainer rotation={totalRotation}>
//         {MODES_DATA.map((mode, index) => {
//           const CurrentIcon = mode.icon;

//           return (
//             <ModeItem
//               key={mode.id}
//               index={index}
//               modeColor={mode.color}
//               isCenter={mode.id === activeModeaI}
//               onClick={() => handleModeClick(mode.id)}
//             >
//               {/* Icon bên trong, xoay ngược lại để luôn thẳng */}
//               <Box sx={{ transform: `rotate(${-totalRotation}deg)` }}>
//                 <CurrentIcon sx={{ fontSize: 40 }} />
//               </Box>
//             </ModeItem>
//           );
//         })}
//       </RotatingContainer>
//     </Box>
//   );
// }
import React from "react";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import ScrewIcon from "@mui/icons-material/PrecisionManufacturing";
import GlueIcon from "@mui/icons-material/FormatPaint";
import ShieldingIcon from "@mui/icons-material/VerifiedUser";

const MODES_DATA = [
  { id: "Screw", label: "Screw", icon: ScrewIcon, color: "#00bcd4" },
  { id: "Glue", label: "Glue", icon: GlueIcon, color: "#ff9800" },
  { id: "Shielding", label: "Shielding", icon: ShieldingIcon, color: "#4caf50" },
];

const ROTATION_ANGLE = 120;

export default function RotatingModeSelector({
  activeModeaI = MODES_DATA[0].id,
  onChangeMode,
}) {
  const theme = useTheme();
  const activeIndex = MODES_DATA.findIndex((m) => m.id === activeModeaI);
  const totalRotation = React.useMemo(() => -(activeIndex * ROTATION_ANGLE), [activeIndex]);
  const activeMode = MODES_DATA.find((m) => m.id === activeModeaI);

  // --- NEW: đo kích thước container để tính bán kính responsive ---
  const stageRef = React.useRef(null);
  const [{ w, h }, setRect] = React.useState({ w: 0, h: 0 });

  React.useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setRect({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setRect({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // bán kính = 35% cạnh ngắn (bạn có thể chỉnh 0.30 - 0.40 tuỳ ý)
  const radius = Math.max(0, Math.min(w, h) * 0.35);

  const handleModeClick = (clickedId) => onChangeMode?.(clickedId);

  return (
    <Box
      sx={{
        // khung ngoài có thể co giãn: chiều cao/ rộng linh hoạt
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // giới hạn tối đa, tránh quá to trên màn lớn:
        maxWidth: 520,
        mx: "auto",
      }}
    >
      {/* Center label: dùng clamp để responsive */}
      <Box
        sx={{
          position: "absolute",
          zIndex: 15,
          textAlign: "center",
          width: "clamp(60px, 18vw, 96px)",
          height: "clamp(60px, 18vw, 96px)",
          borderRadius: "50%",
          border: `4px solid ${activeMode.color}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: 4,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, color: activeMode.color, lineHeight: 1.1 }}
        >
          {activeMode.label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Mode
        </Typography>
      </Box>

      {/* Sân khấu tròn: dùng ref để đo kích thước */}
      <Box
        ref={stageRef}
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          // đảm bảo là hình vuông để bố trí tròn đẹp hơn:
          aspectRatio: "1 / 1",
          maxWidth: 520,
        }}
      >
        {/* Container xoay tổng */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            transition: "transform .5s ease",
            transform: `rotate(${totalRotation}deg)`,
          }}
        >
          {MODES_DATA.map((mode, index) => {
            const CurrentIcon = mode.icon;
            const angle = index * ROTATION_ANGLE;
            const isActive = mode.id === activeModeaI;

            // --- NEW: kích thước item responsive bằng clamp ---
            const itemSize = "clamp(40px, 10vw, 88px)";

            return (
              <Paper
                key={mode.id}
                onClick={() => handleModeClick(mode.id)}
                elevation={isActive ? 6 : 2}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: itemSize,
                  height: itemSize,
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isActive ? theme.palette.common.white : mode.color,
                  backgroundColor: isActive ? mode.color : theme.palette.grey[100],
                  boxShadow: isActive ? 6 : 2,
                  transition: "all .35s ease",
                  transform: `
                    translate(-50%, -50%)
                    rotate(${angle}deg)
                    translate(${radius}px)
                    rotate(-${angle}deg)
                  `,
                }}
              >
                {/* Icon luôn thẳng nhờ xoay ngược totalRotation */}
                <Box sx={{ transform: `rotate(${-totalRotation}deg)` }}>
                  <CurrentIcon sx={{ fontSize: "clamp(18px, 4vw, 40px)" }} />
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
