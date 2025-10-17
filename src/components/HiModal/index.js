import React, {  useState, useRef } from 'react';
import {Slide, Box, Typography,IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Close, FilterNone, Remove} from "@mui/icons-material"



const HiModal = ({
  children,
  alarn,
  alarnHeader = false,
  statusHeader = [],
  width = '100%',
  height = 'auto',
  border = '1px solid black',
  variant = 'default',
  widthModal = 70,
  heightModal = 78,
  header = '',
  lg = 12,
  md = 12,
  xs = 12,
  overflow = true,
  whereMove = 'top',
  whereTop = 85,  
  whereRight= 10,
  open,
  onClose
}) => {
    const theme = useTheme();
    const [reSize, setReSize] = useState(widthModal);
    const [reSizeH, setReSizeH] = useState(heightModal);

    const isResizing = useRef(false);
    const isResizingH = useRef(false);

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
    const handleMouseDownH = (e) =>{
        e.preventDefault();
        isResizingH.current = true;
        document.addEventListener("mousemove", handleMouseMoveH);
        document.addEventListener("mouseup", handleMouseUpH);
    }
    const handleMouseMoveH = (e) =>{
        if(!isResizingH.current) return;
        let newSize = ( e.clientY/ window.innerHeight)*100;
        if(newSize < 20) newSize = 20;
        if(newSize > 85) newSize = 85;
        setReSizeH(newSize);
    }
    const handleMouseUpH =() =>{
        isResizingH.current = false;
        document.removeEventListener("mousemove", handleMouseMoveH);
        document.removeEventListener("mouseup", handleMouseUpH);

    }

  return (

    <Slide direction={`${whereMove}`} in={open} mountOnEnter unmountOnExit style={{ zIndex: 1200 }}>
            <Box
            sx={{
                width: `${reSize}%`,
                position: 'fixed',
                top: whereTop,
                right: whereRight,
                height: 'auto',
                backgroundColor: theme.palette.primary.background,
                boxShadow: 3,
                borderRadius: '15px',
                padding: '0.4rem',
                zIndex: 9990,
                border: '2px',
                display: 'flex',
                flexDirection: "column",
            }}
            >
                <Box 
                    
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
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
                <Box 
                sx={{
                    position: "absolute",
                    bottom: 0,
                   
                    height: "2px",
                    borderRadius: "10px",
                    width: "100%",
                    cursor: 's-resize',
                    backgroundColor: "transparent",
                    "&:hover":{
                        backgroundColor:"rgba(0,0,0,0.2)"
                    }
                }}
                onMouseDown={handleMouseDownH}
                >
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:'space-between' }}>
                    <Typography variant="h5" noWrap sx={{backgroundColor: theme.palette.primary.background, padding:'5px 15px 0px 15px', fontWeight: 'bold', borderRadius: '15px', borderBottomRightRadius: 'unset' , borderBottomLeftRadius: 'unset'}}>
                        {header ? header : "header"}
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
                        size="small" onClick={() => setReSizeH(0)}>
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
                        size="small" onClick={() => setReSizeH(heightModal)}>
                            <FilterNone  onClick={() => setReSize(widthModal)} sx={{rotate:"180deg" , padding:"4px" }}  />
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


            {/* Nội dung */}
                <Box  sx={{
                    width: '100%',
                    overflowY: 'auto', 
                    height: `${reSizeH}vh`,   
                    padding: 2, 
                    backgroundColor: theme.palette.primary.background,
                    borderRadius:"0 10px 15px 15px",
                    '&::-webkit-scrollbar': { width: 6, height:8, opacity: 0 },
                    '&:hover::-webkit-scrollbar': { width: 6,height:8, opacity: 1 },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#999', borderRadius: '10px' },    
                }}
                >
                    {children}
                </Box>
                
            </Box>
    </Slide>


    
  );
};

export default HiModal;
