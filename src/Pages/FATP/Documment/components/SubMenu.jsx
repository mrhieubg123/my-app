import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Collapse,
  ListItemIcon,
} from "@mui/material";
import { ExpandMore, KeyboardArrowRightOutlined } from "@mui/icons-material";
const SubMenu = ({
  isMini,
  open,
  onToggle,
  icon,
  title,
  subItems,
  selectedItem,
  onSelectItem,
}) => (
  <>
    <ListItem
      onClick={onToggle}
      sx={{
        display: "flex",
        alignItems: "center",
        borderBottomRightRadius: "20px",
        borderTopRightRadius: "20px",
        cursor: "pointer",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
        <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
        <Box
          sx={{
            transform: !isMini ? "translateX(0)" : "translateX(-5px)",
            transition: "transform 0.4s ease-in-out, opacity 0.4s ease",
            opacity: !isMini ? 1 : 0,
          }}
        >
          <ListItemText
            primary={title}
            sx={{
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "pointer",
            }}
          />
        </Box>
      </Box>
      {!isMini && (open ? <ExpandMore /> : <KeyboardArrowRightOutlined />)}
    </ListItem>
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {subItems.map((subItem, index) => (
          <ListItem
            key={index}
            // onClick={() => onSelectItem(title, index, subItem.path)}
            onClick={() => onSelectItem(`/${subItem.label}`, "")}
            sx={{
              pl: 3.2,
              // background:
              //   selectedItem.key === title && selectedItem.subKey === index
              //     ? "linear-gradient(to left, rgba(120, 123, 255, 0.9), rgba(120, 123, 255, 0.3))"
              //     : "transparent",
              "&:hover": {
                background:
                  "linear-gradient(to left, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))",
              },
              transition: "background 0.3s ease",
              margin: "3px 0px",

              borderBottomRightRadius: "20px",
              borderTopRightRadius: "20px",
              cursor: "pointer",
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, "& svg": { fontSize: "18px" } }}>
              {subItem.icon}
            </ListItemIcon>
            <Box
              sx={{
                transform: !isMini ? "translateX(0)" : "translateX(-5px)",
                transition: "transform 0.4s ease-in-out, opacity 0.4s ease",
                opacity: !isMini ? 1 : 0,
              }}
            >
              <ListItemText
                primary={subItem.label}
                sx={{
                  margin: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                }}
              />
            </Box>
          </ListItem>
        ))}
      </List>
    </Collapse>
  </>
);

export default SubMenu;
