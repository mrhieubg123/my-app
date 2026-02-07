import React, { useState, useEffect } from "react";
import { Box, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  FolderOpenTwoTone,
  CalendarMonth,
  EditSquare,
  Settings,
  MailOutline,
  Newspaper,
} from "@mui/icons-material";
import SubMenu from "./components/SubMenu";
import FileSection from "./components/FileSection";
import EmailConfig from "./components/EmailConfig";

export default function ProjectManagement() {
  const theme = useTheme();
  const [headerParts, setHeaderParts] = useState("ProjectManagement/");
  const [headerPartsSubMenu, setHeaderPartsSubMenu] = useState("");

  const toggleMenu = (menu) => {
    if (headerParts !== menu) setHeaderParts(menu);
    else setHeaderParts("");
    setHeaderPartsSubMenu("");
  };
  const subItems = [
    {
      label: "RFQ",
      icon: <CalendarMonth />,
      path: "/FATP/FATPMachineControl",
      type: "folder",
    },
    {
      label: "NPI Projects",
      icon: <EditSquare />,
      path: "/FATP/GlueScrewStatus",
      type: "folder",
    },
    {
      label: "MP Projects",
      icon: <EditSquare />,
      path: "/FATP/VCutMachineStatus",
      type: "folder",
    },
    {
      label: "EOL",
      icon: <CalendarMonth />,
      path: "/FATP/MaintenanceStatus",
      type: "folder",
    },
  ];

  const subItemsCategory = [
    {
      label: "Email Config",
      icon: <MailOutline />,
      path: "/FATP/FATPMachineControl",
      type: "screen",
    },
  ];

  const menuItems = [
    {
      title: "Category",
      headerParts: "Category",
      subItems: subItemsCategory,
      icon: <Settings />,
      component: (
        <EmailConfig
          headerParts={headerParts}
          subHeaderParts={headerPartsSubMenu}
        />
      ),
    },
    {
      title: "Project Management",
      headerParts: "ProjectManagement/",
      subItems: subItems,
      icon: <FolderOpenTwoTone />,
      component: (
        <FileSection
          headerParts={headerParts}
          subHeaderParts={headerPartsSubMenu}
        />
      ),
    },
    {
      title: "ECN/MCO Tracking",
      headerParts: "TrainingDocument",
      icon: <Newspaper />,
      subItems: subItems,
    },
  ];

  const selectSubFolder = (e) => {
    setHeaderPartsSubMenu(e);
  };

  return (
    <Box p={3} sx={{ display: "flex", height: "90vh", gap: 2 }}>
      {/* Sidebar */}
      <Paper
        sx={{
          width: 300,
          p: 2,
          overflowY: "auto",
          height: "100%",
          background: theme.palette.background.component,
          boxShadow: 4,
          position: "relative",
          "&::-webkit-scrollbar": { width: 6, opacity: 0 },
          "&:hover::-webkit-scrollbar": { width: 6, opacity: 1 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#cdcdcd8c",
            borderRadius: "10px",
          },
        }}
      >
        {menuItems.map((item) => (
          <SubMenu
            key={item.headerParts}
            // isMini={isMini}
            open={headerParts === item.headerParts}
            onToggle={() => toggleMenu(item.headerParts)}
            icon={item.icon}
            title={item.title}
            subItems={item.subItems}
            //selectedItem={selectedItem} // Truyền trạng thái selectedItem vào SubMenu
            onSelectItem={selectSubFolder} // Hàm chọn mục vào SubMenu
          />
        ))}
      </Paper>
      {menuItems.find((f) => f.headerParts === headerParts)?.component}
      {/* <FileSection
        headerParts={headerParts}
        subHeaderParts={headerPartsSubMenu}
      /> */}
    </Box>
  );
}
