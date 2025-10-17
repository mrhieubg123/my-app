import React, { memo } from 'react';
import { Box,  TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const TableDetail = ({
    idata = [],
    onChangeInput
  }) => {
    const theme = useTheme();    
    // const processData = (data) => {
    //     const categoryCount = {};
    //     const processedData = [];
    
    //     data.forEach(item => {
    //       categoryCount[item.SN] = (categoryCount[item.SN] || 0) + 1;
    //     });
    
    //     let currentCategory = '';
    //     data.forEach(item => {
    //       if (currentCategory !== item.SN) {
    //         processedData.push({
    //           ...item,
    //           rowspan: categoryCount[item.SN],
    //           isFirstInCategory: true
    //         });
    //         currentCategory = item.SN;
    //       } else {
    //         processedData.push({
    //           ...item,
    //           isFirstInCategory: false
    //         });
    //       }
    //     });
    //     return processedData;
    //   };
    //   const tableData = processData(data);


    //   const snGroups = {};
    //   const groupedData = [];
    //   let stt = 1;
  
    //   data.forEach(item => {
    //       if(!snGroups[item.SN]){
    //           snGroups[item.SN] = [];
    //       }
    //       snGroups[item.SN].push(item);
    //   })
    //   console.log(snGroups);
  
    //   Object.entries(snGroups).forEach(([sn, items]) => {
    //       items.forEach((item, index) => {
    //           groupedData.push({
    //               showSN: index === 0 ,
    //               rowSpan: index === 0 ? items.length : 0,
    //               STT: index === 0 ? stt : '',
    //               SN:  index === 0 ? sn : '',
    //               LINE: item.LINE,
    //               LANE: item.LANE,
    //               MODEL: item.MODEL,
    //               STATION: item.STATION,
    //               STATUS: item.STATUS,
    //               LOCATION: item.LOCATION,
    //               ERROR_CODE: item.ERROR_CODE,
    //               ALARM_TYPE: item.ALARM_TYPE,
    //           })
    //       })
    //       stt++;
    //   })


    const handleInputChange = (iserialName , icategories) =>{
        const newModel = {
          model: iserialName,
          timediff: '',
          cartsn:icategories
        }
        onChangeInput?.(newModel)
      }



    return (
        <Box sx={{height: '100%'}}>
            
            <TableContainer sx={{overflow:'auto',height: '100%',
                '&::-webkit-scrollbar': { width: 0, opacity: 0 },
                '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
            <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
                <TableHead sx={{position:'sticky', top: '0', backgroundColor: theme.palette.background.conponent}}>
                    <TableRow>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}}>No.</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Model</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Line</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">In Time</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Op Pack</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Car ID</TableCell>
                        <TableCell style={{padding: "3px 6px", fontWeight: "bold"}} align="center">Q'ty</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {idata.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell component="th" scope="row" style={{ padding: "6px" }}>{index + 1 || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px" }}>{item.MODEL || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px" }}>{item.LINE || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px" }}>{item.SMT_TIME.replace('T', ' ').replace('.000Z', '') || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px" }}>{item.EMP_SMT || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px" }}>{item.CART_SN || ''}</TableCell>
                        <TableCell align="center" style={{ padding: "3px 6px" , color: '#1f78ff', fontWeight: 'bold' , cursor: 'pointer'}} 
                            onClick={() => handleInputChange(item.MODEL, item.CART_SN )}
                        >
                            {item.Total || ''}
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        </Box>
    )
}
export default memo(TableDetail);