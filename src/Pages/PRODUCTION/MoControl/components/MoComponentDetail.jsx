import { Box, Grid,Card,  Grid2, Icon, Typography, Button, Divider, LinearProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import HiWarningLight from '../../../../components/HiWarningLight'
import Highcharts, { color, offset } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useMemo, useEffect, useRef, useState } from "react";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { Functions, RocketLaunch, ReportGmailerrorredOutlined, ConstructionOutlined } from '@mui/icons-material';

const MoComponentDetail = ({
    data = [],
  children,
  alarn,
  alarnHeader = false,
  statusHeader = [],
  width = '100%',
  height = '100px',
  bgColor = '#80baff',
  border = '1px solid black',
  variant = 'default',
  header = '',
  lg = 12,
  md = 12,
  xs = 12,
  overflow = true ,
  onSendData,
  isActive,
  onCheckSheet
}) => {
    const theme = useTheme();

    const handleClick = (istatus) =>{
      const newModel ={
        status : istatus === 'Total' ? '': istatus
      }
      onCheckSheet?.(newModel)
    }
    const sumf = data.reduce((sum ,item) => sum + item.COUNTWIP*1, 0);


    const totalData = data.reduce((acc, item) => {
        if(!acc[item.WIP_GROUP]){
            acc[item.WIP_GROUP] = {WIP_GROUP: item.WIP_GROUP , COUNTWIP: 0};
        }
        acc[item.WIP_GROUP].COUNTWIP += item.COUNTWIP*1;
        return acc
    },{})

    const result = Object.values(totalData);


    return (
        <Grid size={{ lg, md, xs }} item lg={lg} md={md} xs={xs} sx={{ padding: 1 }}>
          <Card
            sx={{width,
                height,
                boxShadow: 5,
                padding: 1.5,
                background: bgColor, // Màu xanh lá cây
                overflowY: 'auto',
                '&::-webkit-scrollbar': { width: 4, opacity: 0 },
                '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd', borderRadius: '10px' }
              }}
            
          >
           
            {/* Icon góc trai dưới */}
            <Box              
              onClick={() => handleClick(`${header}`)}
            
            >
                {result.map((row, index) => (
                
                    <Box key={index} sx={{marginBottom: 1}}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between',  }}>
                            <Typography>{row.WIP_GROUP}</Typography>
                            <Typography>{row.COUNTWIP}</Typography>
                        </Box>
                        <LinearProgress 
                            sx={{height: '10px'}}
                            size={82} 

                            color='secondary' 
                            variant='determinate' 
                            value={row.COUNTWIP*100 / sumf}/>
                    </Box>
                
                ))}


             { children}
            </Box>
    
           
            
          </Card>
        </Grid>
      );
}

export default MoComponentDetail;