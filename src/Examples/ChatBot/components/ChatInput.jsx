import React, { useState } from "react";
import {Box, Typography, IconButton, Tooltip, InputBase, TextareaAutosize} from "@mui/material";
import { AttachFileOutlined, Mic, Stop, ArrowUpwardOutlined, EmojiEmotions, Notes } from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';



const ChatInput = ({onSend, onChangeQuestion, idata=[]}) =>{
    const theme = useTheme();
    const [input,setInput] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isQuestion, setIsQuestion] = useState(false);
    

    const handleSend = () => {
        if(input.trim()){
            onSend(input);
            setInput("");
        }
    }

    const startVoiceRecognition = () =>{
        if(!("webkitSpeechRecognition" in window)){
            alert("Trình duyệt không hỗ trợ nhận diện giọng nói!");
            return;
        }
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResult = false;
        recognition.maxAlternatives = 1;

        // khi bat dau nhanj dien
        recognition.onstart = () =>{
            setIsRecording(true);
        }

        // khi nhan duoc ket qua
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput((prev) => prev + " " + transcript);
        }

        // khi gap loi
        recognition.onerror = (event) =>{
            console.error("Recognition error:", event.error);
        }
        //khi ket thuc nhan dien
        recognition.onend = () => {
            setIsRecording(false);
        }
        recognition.start();
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    }
    const handleOpenQuestion = () => {
        setIsQuestion(prev => !prev)
        onChangeQuestion?.()
    }

    const handleSelectQuestion = (question) => {
        setIsQuestion(false);
        setInput(question);
    }
    
    


    return (
        <Box
            sx={{
                // backgroundColor: "#121212",
                padding: 1,
                display: "flex",
                // borderTop:"1px solid #333",
            }}
        >

            
            <Box 
            sx={{
                display: "flex",
                alignItems:"center",
                flexDirection: 'column',

                // backgroundColor: "#f5f5f5",
                // #2f2a31
                border: "2px solid #7f57d5",
                borderRadius: "20px",
                padding: "4px 6px",
                width: '400px',
                
            }}>
                <TextareaAutosize 
                    minRows={1}
                    variant="outlined"
                    size="small"
                    placeholder="Ask anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                        width: '100%',
                        resize: 'none',
                        overflow: 'hidden',
                        border: '0px',
                        outline: 'none',
                        padding: '8px',
                        fontSize: '16px',
                        color: theme.palette.primary.conponent,
                        fontFamily: "Roboto,Helvetica,Arial",
                        input:{color: '#000'},
                        backgroundColor: '#ff000000',
                        // "& .MuiOutlinedInput-root": {
                        //     "& fieldset":{
                        //         borderColor: "#333",
                        //     },
                        // },
                        
                    }}
                    
                />
                {
                    isQuestion ? 
                    <Box sx={{height: '100px',width: '100%', overflowY:'auto', border:'1px solid #999', 
                        '&::-webkit-scrollbar': { width: 4, opacity: 0 },
                        '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                        '&::-webkit-scrollbar-thumb': { backgroundColor: '#9999998c', borderRadius: '10px' }}}
                    >
                        {idata.map(idx =>
                        (
                            // <Tooltip title={idx.question}>
                                <Box sx={{cursor: 'pointer', borderBottom:'1px solid #9995', fontSize: '13px', padding:'2px'}} onClick={() => handleSelectQuestion(idx.Question)}>
                                    - {idx.Question}
                                </Box>
                           // </Tooltip>
                        ))}
                        
                    </Box>
                    : 
                    ''
                }
                
                

                <Box 
                    sx={{
                        width: '100%',
                        display: "flex",
                        alignItems:"center",
                        justifyContent: 'space-between'
                    }}
                >
                    <Box 
                       
                    >
                        <Tooltip title="Question">
                            <IconButton 
                                onClick={handleOpenQuestion}
                                sx={{
                                    color:"#999",
                                }}>
                                <Notes/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box >
                        <Tooltip title="Emoji">
                            <IconButton sx={{
                                    color:"#999",
                                }}>
                                <EmojiEmotions/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Attach File">
                            <IconButton 
                                sx={{
                                    color:"#999",
                                }}>
                                <AttachFileOutlined/>
                            </IconButton>
                        </Tooltip>
                        {input.trim() ? 
                        <Tooltip title={"Send"} >
                            <IconButton  
                                onClick={handleSend} 
                                sx={{borderRadius: "50%",
                                backgroundColor: "#a183e3", 
                                color:"#fff",
                                transition: "background-color 0.3s ease",
                                "&:hover":{
                                    backgroundColor:"#7250bd",
                                }
                                }}>
                                <ArrowUpwardOutlined color="#fff000"/>
                            </IconButton>
                        </Tooltip>
                        :
                        <Tooltip title={isRecording ? "Stop Recording" : "Start Voice"} >
                            <IconButton 
                                color={isRecording ? "Error" : "primary"}
                                onClick={startVoiceRecognition}
                                sx={{
                                    borderRadius: "50%",
                                    backgroundColor: "#a183e3",
                                    color:"#fff",
                                    transition: "background-color 0.3s ease",
                                    "&:hover":{
                                        backgroundColor:"#7250bd",
                                    }
                                }}
                            >
                                {isRecording ? <Stop/> : <Mic/>}
                            </IconButton>

                        </Tooltip>
                        }
                    </Box>
                    
                </Box>


                {/* <InputBase 
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Ask me anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    sx={{
                        marginLeft: '5px',
                        input:{color: '#000'},
                        "& .MuiOutlinedInput-root": {
                            "& fieldset":{
                                borderColor: "#333",
                            },
                        },
                    }}
                ></InputBase> */}


                
                
            </Box>
        </Box>
    )
}

export default ChatInput;
