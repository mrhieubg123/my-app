import React from "react";
import {Box, Typography, IconButton} from "@mui/material";
import { Close, Reddit, SmartToy } from "@mui/icons-material";
import {RiPushpinFill, RiUnpinFill} from "react-icons/ri"
import chatBot from '../components/img/chatBot.gif';


const ChatHeader = ({onClose, toggleChat, isPin, isFactory, changeMode}) =>{

    return (
        <Box
            sx={{
                // backgroundColor: "primary.main",
                background: "linear-gradient(45deg,#4099ff,#73b4ff)",
                color: '#fff',
                padding: 1.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems:'center',
            }}
        >
            <Box>
                {/* <img src={chatBot} style={{width:80, height: 80}}></img> */}
        
                <Typography variant="h6">Chat Bot AI</Typography>
            </Box>
           
            <Box>
                <IconButton color="inherit" size="small" onClick={changeMode}>
                    {isFactory ? <Reddit/> : <SmartToy/>}
                </IconButton>
                <IconButton onClick={toggleChat}>
                    {isPin ? <RiPushpinFill color="#fff"/> : <RiUnpinFill color="#fff"/>}
                </IconButton>
                <IconButton color="inherit" size="small" onClick={onClose}>
                    <Close></Close>
                </IconButton>
            </Box>
        </Box>
    )
}

export default ChatHeader;
