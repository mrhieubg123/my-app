import React, { useState, useEffect, useRef } from "react";
import { Slide,Box,Tabs, Tab, Button, Typography, Grid ,IconButton,Divider, Slider} from "@mui/material";
import {Replay, Close, Minimize, FilterNone, Remove} from "@mui/icons-material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Close as CloseIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import * as XLSX from 'xlsx';
 

const HiShowFileXLSX = ({  
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
    const [excelData2,setExcelData2] = useState([]);
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



    const handleFileUpload2 = (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const allSheets = {};
            workbook.SheetNames.forEach((sheetName) => {
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    
                if(jsonData.length < 4) return;
    
                const dataRows = [];
    
                for(let i = 5; i < jsonData.length; i++){
                    const row = jsonData[i];
                    if(row.some((cell) => cell && cell.toString().trim() === "~THE  END~")){
                        break
                    }
                    dataRows.push(row)
                }
    
                if(dataRows.length > 1){
                    const headers = dataRows[0];
                    const slotIndex = headers.indexOf("SLOT");
                    const feederIndex = headers.indexOf("FEEDER");
                    const locationIndex = headers.indexOf("LOCATION");
                    const qtyIndex = headers.indexOf("QTY");
                    if(slotIndex !== -1 || slotIndex !== -1){
                        for(let i = 1; i < dataRows.length; i++){
                            if(slotIndex !== -1 && (dataRows[i][slotIndex] === undefined || dataRows[i][slotIndex] === null || dataRows[i][slotIndex] === "")){
                                dataRows[i][slotIndex] = dataRows[i - 1][slotIndex] || "-";
                            }
                            if(feederIndex !== -1 && (dataRows[i][feederIndex] === undefined || dataRows[i][feederIndex] === null || dataRows[i][feederIndex] === "")){
                                dataRows[i][feederIndex] = dataRows[i - 1][feederIndex] || "-";
                            }
                            if(locationIndex !== -1 && (dataRows[i][locationIndex] === undefined || dataRows[i][locationIndex] === null || dataRows[i][locationIndex] === "")){
                                dataRows[i][locationIndex] = dataRows[i - 1][locationIndex] || "-";
                            }
                            if(qtyIndex !== -1 && (dataRows[i][qtyIndex] === undefined || dataRows[i][qtyIndex] === null || dataRows[i][qtyIndex] === "")){
                                dataRows[i][qtyIndex] = dataRows[i - 1][qtyIndex]+ '*' || "-";
                            }
                        }
                    }
                }
                allSheets[sheetName] = dataRows;
            });
            if (Object.keys(allSheets).length === 0) {
                return;
            }
            setExcelData2(allSheets);
        };
        reader.readAsArrayBuffer(file);
    };



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

export default HiShowFileXLSX;








