import * as React from "react";
import { Fab, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";

const ExpandFab = styled(Fab)(({ theme }) => ({
  position: "absolute",
  right: 0,
  top: 0,
  width: 120, // trạng thái mặc định: chỉ icon
  background:
    "linear-gradient(to left, rgba(255,255,255,0.09), rgba(255,255,255,0.04))",
  color: theme.palette.primary.conponent,
  transition: "transform 0.25s ease-out",
  transformOrigin: "right top",
  // zIndex: 889,
  opacity: 1,
  transform: "scale(1) translateX(65%)",
  borderTopRightRadius: "unset",
  borderBottomRightRadius: "unset",
  borderTopLeftRadius: "30px",
  borderBottomLeftRadius: "30px",
  paddingRight: "5px",
  "&:hover": {
    backgroundColor:
      "linear-gradient(to left, rgba(64, 207 , 239, 0.9), rgba(64, 207, 239, 0.5))",
    transform: "translateX(0%)",
    color: theme.palette.primary.conponent2,
  },
}));

export default function FloatingExpandFab({ onClick }) {
  const handleClick = () => {
    onClick();
    console.log("FAB clicked");
  };

  return (
    <Box>
      <ExpandFab
        color="primary"
        size="small"
        aria-label="create"
        onClick={handleClick}
        // variant giữ mặc định (circular) để khi chưa hover nó tròn
      >
        <AddIcon />
        <Typography
          sx={{
            fontSize: 16,
            float: "right",
            marginLeft: "10px",
            textTransform: "none",
          }}
        >
          Change
        </Typography>
      </ExpandFab>
    </Box>
  );
}
