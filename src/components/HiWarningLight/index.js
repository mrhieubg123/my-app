import React from "react";
import { Box, Typography } from "@mui/material";
import { color } from "highcharts";
import { Label } from "@mui/icons-material";



const HiWarningLight = ({status = "Pass"}) => {
    const Color = status === 'Pass' ? '#00e396' : '#ff3110'
    return(
        <Box
        sx={{
            display: 'flex',
            alignItems: "center",
            gap: 2, 
            padding: 1, 
            float: 'right'

        }}>
            <Box 
                sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: Color,
                    boxShadow : `0 0 10px ${Color}`,
                }}
            >
            </Box>
        </Box>
    );

};


export default HiWarningLight;