import React, { useState, useEffect, useRef } from "react";
import { Slide,Box,Tabs, Tab, Button, Typography, Grid ,IconButton,Divider, Slider} from "@mui/material";

const tabData = [
    {lable: "Company", content: "hjsa"},
    {lable: "Company2", content: "hjsa2"},
    {lable: "Company3", content: "hjsa3"},
    {lable: "Company4", content: "hjsa4"},
    
];

const HiTabs = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    return (
        <Box sx={{backgroundColor: "#333", padding:2,borderRadius: 2}}>
            <Tabs
                value={selectedTab}
                onChange={(event, newValue) => setSelectedTab(newValue)}
                sx={{
                    "& .MuiTab-root":{
                        color:"#ccc",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                    },
                    "& .Mui-selected":{
                        color:"#fff",
                        backgroundColor:"#4caf50",
                        borderRadius:"15px 15px 0px 0px",       
                    }
                }}
            >
                {tabData.map((tab, index) =>(
                    <Tab key={index} label={tab.lable} />  
                ))}

            </Tabs>
            <Box sx={{backgroundColor:"#f5f5f5", padding: 3, borderRadius:"0 0 10px 10px"}}>
                <Typography variant="h6" color="primary">
                    {tabData[selectedTab].content}
                </Typography>
            </Box>
        </Box>
    );
};

export default HiTabs;
