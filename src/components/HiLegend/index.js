import React from "react";
import { Box, Typography } from "@mui/material";

const HiLegend = ({
    legendItem = [
        {color: "#ff5733" , label: "Error"},
        {color: "#33ff57" , label: "Success"},
        {color: "#337Bff" , label: "Info"},
    ],
    title = '',
    contentFloat = 'right',
    sizeLegend = 12
}) => {

 
    return(
        <Box
        sx={{display: 'flex',
            alignItems: "center",
            float: contentFloat ,
            gap: 1.8, // khoang cach giua cac muc
            padding: 0.3, //khoang cach ben trong
            // border: "1px solid #ddd", // vien component
            // borderRadius: '8px', //goc bo tron
            // backgroundColor: '#f9f9f9',
            borderBottom: legendItem !== '' ?  '1px solid #99999955': '',
        }}>
            <Typography>{title}</Typography>
            
            {legendItem !== '' ? legendItem.map((item, index) => (
                <Box 
                    key={index}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap:0.8,
                    }}
                >
                    {/* O mau */}
                    <Box 
                        sx={{
                            width: sizeLegend,
                            height: sizeLegend,
                            backgroundColor: item.color,
                            borderRadius: '50%',
                        }}>
                 
                    </Box>
                    <Typography variant="body2" sx={{textWrap: 'nowrap'}}>{item.label}</Typography>
                </Box>
                
            )):''}

        </Box>
    );

};


export default HiLegend;