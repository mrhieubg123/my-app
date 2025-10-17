import React, { useState } from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";

const CalendarContainer = styled("div")({
  width: "100%",
  padding: "10px",
//   backgroundColor: "#fff",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
//   boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
});

const HeaderContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  padding: "10px 20px",
});

const CustomDateCalendar = styled(DateCalendar)({
    "& .MuiPickerCalendarHeader-root":{
        display: "none"
    },
  "& .MuiPickersDay-root": {
    fontSize: "1rem",
   
    borderRadius: "50%",
    color: "#888",
  },
  "& .Mui-selected": {
    backgroundColor: "#9fcf6a !important", // Màu xanh nhạt cho ngày được chọn
    color: "white",
  },
  "& .MuiPickersDay-root:hover": {
    backgroundColor: "#f0f0f0",
  },
  "& .MuiPickersDay-root.Mui-disabled": {
    color: "#ddd",
  },
  "& .MuiPickersCalendarHeader-label": {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#77a25d", // Màu xanh lá cho tên tháng
  },
  "& .MuiIconButton-root": {
    color: "black", // Màu nút chuyển tháng
  },
});
const MyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CalendarContainer>
      
        <CustomDateCalendar
          value={currentDate}
          onChange={(newDate) => setCurrentDate(newDate)}
          onMonthChange={(newMonth) => setCurrentDate(dayjs(newMonth))}
          dayOfWeekFormatter={(day) => day.format("ddd")}
        />
      </CalendarContainer>
    </LocalizationProvider>
  );
};

export default MyCalendar;
