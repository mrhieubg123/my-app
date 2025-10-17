import React, { useState, useEffect, useRef } from "react";
import { Slide,Box,Tabs, Tab, Button, Typography, Grid ,IconButton,Divider, Slider} from "@mui/material";
import {Replay, Close, Minimize, FilterNone, Remove} from "@mui/icons-material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Close as CloseIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
 

const HiShowFilePDF = ({  
        open, 
        onClose, 
        showFile, 
        fileName = '', 
        whereMove = 'left',  
        widthModal = 40,
        heightModal = 78,
    }) => {
    const theme = useTheme();
    const [reSize, setReSize] = useState(widthModal)
    const isResizing = useRef(false);
    //bat dau resize
    const handleMouseDown = (e) =>{
        e.preventDefault();
        isResizing.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }
    const handleMouseMove = (e) =>{
        if(!isResizing.current) return;
        let newSize = ((window.innerWidth - e.clientX)/ window.innerWidth)*100;
        if(newSize < 20) newSize = 20;
        if(newSize > 90) newSize = 90;
        setReSize(newSize);
    }
    const handleMouseUp =() =>{
        isResizing.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

    }

    return (
        <Slide direction={whereMove} in={open} mountOnEnter unmountOnExit>
          
            <Box
            sx={{
                width: `${reSize}%`,
                position: 'fixed',
                top: 85,
                right: whereMove === 'left' ? 10 : '',
                left: whereMove === 'left' ? '' : 80,
                height: 'auto',
                backgroundColor: theme.palette.background.showFile,
                boxShadow: 3,
                borderRadius: '15px',
                padding: '0.4rem',
                // zIndex: 9,
                border: '2px',
                display: 'flex',
                flexDirection: "column",
                zIndex: 99999,
            }}
            >
                <Box 
                    
                sx={{
                    position: "absolute",
                    top: 0,
                    // left: 0,
                    right: whereMove === 'left' ? '' : 0,
                    left: whereMove === 'left' ? 0 : '',
                    width: "2px",
                    borderRadius: "10px",
                    height: "100%",
                    cursor: "ew-resize",
                    backgroundColor: "transparent",
                    "&:hover":{
                        backgroundColor:"rgba(0,0,0,0.2)"
                    }
                }}
                onMouseDown={handleMouseDown}
            >
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:'space-between' }}>
                    <Typography variant="h5" noWrap sx={{color: theme.palette.text.showFile , backgroundColor: "#f6f7f5", padding:'5px 15px 0px 15px', fontWeight: 'bold', borderRadius: '15px', borderBottomRightRadius: 'unset' , borderBottomLeftRadius: 'unset'}}>
                        {fileName ? fileName : "Show file PDF"}
                    </Typography>
                    <Box sx={{display: "flex", 
                        justifyContent: "flex-end",
                        alignItems: "center",
                        height: 32,
                        paddingX:1,
                    }}>
                        <IconButton
                            sx={{
                                borderRadius: 'unset',
                                padding: '5px 10px',
                                "&:hover":{
                                    color:"#fff",
                                    backgroundColor: "#999"
                            }}}
                        size="small" onClick={() => setReSize(10)}>
                            <Remove  onClick={() => setReSize(10)} />
                        </IconButton>
                        <IconButton
                            sx={{
                                borderRadius: 'unset',
                                padding: '5px 10px',
                                "&:hover":{
                                    color:"#fff",
                                    backgroundColor: "#999"
                            }}}
                        size="small" onClick={() => setReSize(widthModal)}>
                            <FilterNone sx={{rotate:"180deg" , padding:"4px" }}  />
                        </IconButton>
                        <IconButton
                            size="small" onClick={onClose}
                            sx={{
                                borderRadius: 'unset',
                                padding: '5px 10px',
                                "&:hover":{
                                    color:"#fff",
                                    backgroundColor: "#ff0000"
                            }}} 
                        >
                            <Close />
                        </IconButton>
                    </Box>
                </Box>      
                <Box  sx={{
                    width: '100%',
                    overflowY: 'hidden',
                    height: '78vh',   
                    padding: 2, 
                    backgroundColor: "#f6f7f5",
                    borderRadius:"0 10px 15px 15px"
                }}
                >
                    {showFile ? (
                        <iframe style={{width: '100%' , height:'100%'}} src= {showFile} />
                    ):(
                        <Typography variant="body2">
                            No File selected
                        </Typography>
                    )}
                </Box>
                
            </Box>
    </Slide>

    );
};

export default HiShowFilePDF;
