import React,{useRef,useState, useEffect} from "react";
import {Box, Typography, CircularProgress, Button} from "@mui/material";
import TypewriterText from './styleCom/TypewriterText';
import {OpenInNew} from '@mui/icons-material';
import HiShowFilePDF from "../../../components/HiShow/HiShowPDF";



const ChatWindow = ({messages, setFile}) =>{
    const messageEndRef = useRef(null);
    const scrollToBottom = () =>{
        if(messageEndRef.current){
            messageEndRef.current.scrollIntoView({behavior:"smooth"});
        }
    }
    useEffect(() => {
        scrollToBottom();
    },[messages]);

    function ClosePDF(link, name){
        const model = {
            showFile: link,
            fileName: name
        }
        setFile?.(model)
    }


    return (
        <Box
            sx={{
                flex:1,
                color: '#fff',
                padding: 2,
                overflowY:'auto',
                backgroundColor: '',
                '&::-webkit-scrollbar': { width: 5, opacity: 0.6 },
                '&:hover::-webkit-scrollbar': { width: 5, opacity: 1 },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#00000099', borderRadius: '10px' }
                
            }}
        >
            {messages.map((message, index) => (
                <Box 
                    key={index}
                    sx={{display: "flex",
                        justifyContent: message.sender === 'Bot' ? "flex-start" : "flex-end",
                        marginBottom: 1,
                    }}
                >
                    <Box
                    sx={{
                        padding:1,
                        backgroundColor: message.sender === 'Bot' ? "primary.dark" : "secondary.main",
                        borderRadius: 2,
                        maxWidth: '80%', 
                        textAlign: "left",

                    }}>
                        <Box> {message.isLoading ? 
                        (<CircularProgress size={25} color="inherit"></CircularProgress>) : 
                        (<TypewriterText text={message.text.replaceAll(`<a onclick="ClosePDF()">ShowFilePdf</a>`,'')} sender={message.sender} />)}  
                        </Box> 
                        {message.text.includes(`<a onclick="ClosePDF()">ShowFilePdf</a>`) ? 
                        <Button variant="contained" size="small" 
                        onClick={() => ClosePDF(`https://10.225.42.71:5000/uploads/PDF/${message.pageName}#page=${message.pageNumber}`,`${message.pageName}`)}>
                            Show File 
                            <OpenInNew style={{fontSize: '15px' , marginLeft: '5px'}}></OpenInNew>
                        </Button> : ''}
                        { message.isLoading ?  '' : <Typography variant="caption" sx={{opacity: 0.7, display:"block"}}>{message.time}</Typography> }
                    </Box>
                </Box>
            ))}
            <Box ref={messageEndRef}></Box>
        </Box>
    )
}

// https://10.225.42.71:5000/
export default ChatWindow;
