import React, { useState } from 'react';
import { Box,  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Typography, Tabs, Tab, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Download } from '@mui/icons-material';
const TableSheetExcel = ({
    idata = {},
  }) => {
    const theme = useTheme();
    const [activeSheet,setActiveSheet] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveSheet(newValue);
      };
    
      const sheetNames = Object.keys(idata);
      const activeSheetName = sheetNames[activeSheet];
      const activeData = idata[activeSheetName] || [];
    return (
        
        <Box sx={{height:'100%', position: 'relative',}}>
                <Box sx={{ marginTop: 3 }}>
                  {/* Tabs */}
                  <Tabs value={activeSheet} onChange={handleTabChange}>
                    {sheetNames.map((name, idx) => (
                      <Tab key={idx} label={name} />
                    ))}
                  </Tabs>
        
                  <Typography variant="h6" sx={{ marginY: 2 }}>
                    Sheet: {activeSheetName}
                  </Typography>
        
                  {/* Hiển thị bảng */}
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {activeData[0]?.map((col, colIdx) => (
                            <TableCell key={colIdx} sx={{ fontWeight: "bold" }}>
                              {col}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {activeData.slice(1).map((row, rowIdx) => (
                          <TableRow key={rowIdx}>
                            {row.map((cell, cellIdx) => (
                              <TableCell key={cellIdx}>{cell}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
        </Box>
    )
}
export default TableSheetExcel;