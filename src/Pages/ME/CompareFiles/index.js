import React, { useState, useEffect, useCallback } from 'react';
import { Alert, Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, Menu, MenuItem, Paper, Select, Snackbar, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Typography } from '@mui/material';
import HiBox from '../../../components/HiBox';
import { useNotification } from "../../../components/HiNotification";
import { AddOutlined } from '@mui/icons-material';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useTheme } from '@mui/material/styles';
import { getAuthorizedAxiosIntance } from '../../../utils/axiosConfig';
import TableExcel from './components/tableExcel';
import TableSheetExcel from './components/tableExcelSheet';

const axiosInstance = await getAuthorizedAxiosIntance();

const CompareFiles = () => {
    const theme = useTheme();
    const showNotification = useNotification();
    const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
    const [newFolderDialogOpen2, setNewFolderDialogOpen2] = useState(false);

    const [excelData, setExcelData] = useState([]);
    const [excelData2, setExcelData2] = useState([]);
    const [mergedData, setMergedData] = useState([]); // Bảng gộp từ excelData và excelData2

    const [activeSheet, setActiveSheet] = useState(0);
    const [warnings, setWarnings] = useState([]);
    const [errorRows, setErrorRows] = useState([]);
    

    const [formData, setFormData] = useState({
        project: "",
        line: "",
        machine: "",
        machineName: "",
        location: "",
        machineCode: ""
    });

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) {
            showToast('❌ Không có File Excel nào !', 'error');
            return;
        }
        const requiredColumns = ["Level", "Number", "Description", "BOM.Qty", "BOM.Find Num", "BOM.Ref Des", "BOM.Alternative"];

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const workbook = XLSX.read(bstr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            if (!sheetName) {
                showToast('❌ File Excel không có sheet nào !', 'error');
                return;
            }
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) || [];
            if (data.length === 0) {
                showToast('❌ File Excel rỗng !', 'error');
                return;
            }
            const header = data[0];
            const colIndex = requiredColumns.map((col) => header.indexOf(col)).filter((i) => i !== -1);

            const filterData = data.map((row) => colIndex.map((i) => row[i]));

            setExcelData([requiredColumns, ...filterData.slice(1)]);
            setNewFolderDialogOpen(false);
            // console.log("Dữ liệu Excel (File 1):", data);
            compareFiles([requiredColumns, ...filterData.slice(1)], excelData2);
            mergeData([requiredColumns, ...filterData.slice(1)], excelData2);

        };
        reader.readAsBinaryString(file);
    };

    const handleFileUpload2 = (e) => {
        const file = e.target.files[0];
        if (!file) {
            showToast('❌ Không có File Excel nào !', 'error');
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
                showToast('❌ File Excel rỗng !', 'error');
                return;
            }
            setExcelData2(allSheets);
            setActiveSheet(0);
            setNewFolderDialogOpen2(false);
            // console.log("Dữ liệu Excel2 (File gốc):", allSheets);
            compareFiles(excelData, allSheets);
            mergeData(excelData, allSheets);
        };
        reader.readAsArrayBuffer(file);
    };


    const mergeData = (file1Data, file2Data) => {
        if (!file1Data.length || !Object.keys(file2Data).length) {
            setMergedData({});
            setErrorRows([]);
            return;
        }

        const mergedSheets = {};
        const allErrorRows = [];
        const headers1 = file1Data[0] || [];
        const number1Index = headers1.indexOf("Number");

        if (number1Index === -1) {
            showToast('❌ Thiếu cột Number trong file gốc!', 'error');
            setMergedData({});
            setErrorRows([]);
            return;
        }

        // Gộp dữ liệu cho từng sheet trong file2Data
        Object.keys(file2Data).forEach((sheetName) => {
            const file2Sheet = file2Data[sheetName] || [];
            if (!file2Sheet.length || file2Sheet.length === 0) {
                mergedSheets[sheetName] = [];
                return;
            }

            const headers2 = file2Sheet[0] || [];

            const number2Index = headers2.findIndex(h => h && h.toString().trim().toLowerCase() === "material no");
            const slotIndex = headers2.findIndex(h => h && h.toString().trim().toLowerCase() === "slot");
            const feederIndex = headers2.findIndex(h => h && h.toString().trim().toLowerCase() === "feeder");
            const alternativeIndex = headers2.findIndex(h => h && h.toString().trim().toLowerCase() === "bom.alternative");

            // console.log(`Sheet ${sheetName} - number2Index: ${number2Index}, slotIndex: ${slotIndex}, feederIndex: ${feederIndex}, alternativeIndex: ${alternativeIndex}`);


            if (number2Index === -1) {
                showToast(`❌ Thiếu cột MATERIAL NO trong sheet ${sheetName}!`, 'error');
                mergedSheets[sheetName] = [];
                return;
            }

            // Tạo header cho bảng gộp
            const mergedHeaders = [...new Set([ ...headers2.filter(h => h !== "MATERIAL NO"), ...headers1])];
            const mergedRows = [];

            // Gộp dữ liệu dựa trên Number và MATERIAL NO
            file2Sheet.slice(1).forEach((row2, rowIndex) => {
                const materialNo = row2[number2Index];
                if (!materialNo) return;  // Bỏ qua dòng nếu MATERIAL NO rỗng

                const mergedRow = {highlight: false}
                mergedRow.originalRowIndex = rowIndex +2 ;
                const matchingRow1 = file1Data.slice(1).find(row1 => row1[number1Index] === materialNo);
                       
                // Giữ nguyên dữ liệu từ excelData2
                mergedHeaders.forEach(header => {
                    if (header === "Number") {
                        mergedRow[header] = materialNo;
                    } else if (headers1.includes(header)) {
                        mergedRow[header] = matchingRow1 && matchingRow1[headers1.indexOf(header)] !== undefined 
                            ? matchingRow1[headers1.indexOf(header)] 
                            : "-";
                    } else if (headers2.includes(header)) {
                        const idx = headers2.indexOf(header);
                        mergedRow[header] = row2[idx] !== undefined ? row2[idx] : "-";
                    }
                });

                if (!matchingRow1){
                    mergedRow.highlight = true;
                    allErrorRows.push({
                        sheet: sheetName,
                        rowIndex:  rowIndex + 2,
                        materialNo: materialNo,
                        slot: slotIndex !== -1 ? (row2[slotIndex] || '-') : '-',
                        feeder: feederIndex !== -1 ? (row2[feederIndex] || '-') : '-',
                        alternative: alternativeIndex !== -1 ? (row2[alternativeIndex] || '-') : '-',
                        errorType: 'Missing in Agile'
                    })
                }

                mergedRows.push(mergedRow);

                // else {

                //     const mergedRow = { highlight: false }; // Thêm thuộc tính highlight
                //     mergedHeaders.forEach(header => {
                //         if (header === "Number") {
                //             mergedRow[header] = materialNo;
                //         } else if (headers1.includes(header)) {
                //             const idx = headers1.indexOf(header);
                //             mergedRow[header] = matchingRow1[idx] !== undefined ? matchingRow1[idx] : "-";
                //         } else if (headers2.includes(header)) {
                //             const idx = headers2.indexOf(header);
                //             mergedRow[header] = row2[idx] !== undefined ? row2[idx] : "-";
                //         }
                       
                //     });
                //     mergedRows.push(mergedRow);
                // }
            });
            // console.log("groups");
            // Kiểm tra và đánh dấu các dòng có SLOT và FEEDER giống nhau nhưng BOM.Alternative khác nhau
            // if (slotIndex !== -1 && feederIndex !== -1 && alternativeIndex !== -1) {
                // console.log(`Sheet ${sheetName}: Đã vào điều kiện kiểm tra SLOT, FEEDER, BOM.Alternative`);
                
                const groups = {};
                mergedRows.forEach((row, idx) => {
                    if (row["SLOT"] && row["FEEDER"]) {
                        const key = `${row["SLOT"]}|${row["FEEDER"]}`;
                        if (!groups[key]) {
                            groups[key] = [];
                        }
                        groups[key].push({ row, idx });
                    }
                });
                Object.values(groups).forEach(group => {
                    const validRows = group.filter(({ row }) => 
                        row["BOM.Alternative"] !== undefined && 
                        row["BOM.Alternative"] !== null && 
                        row["BOM.Alternative"] !== ""
                    );
                    if (validRows.length > 1) {
                        const alternatives = validRows.map(({ row }) => 
                            row["BOM.Alternative"]?.split(',')[0]?.trim() || row["BOM.Alternative"]
                        );
                        const uniqueAlternatives = [...new Set(alternatives)];
                        if (uniqueAlternatives.length > 1) {
                            validRows.forEach(({ row, idx }) => {
                                mergedRows[idx].highlight = true;
                                allErrorRows.push({
                                    sheet: sheetName,
                                    rowIndex: row.originalRowIndex,
                                    materialNo: row["Number"],
                                    slot: row["SLOT"],
                                    feeder: row["FEEDER"],
                                    alternative: row["BOM.Alternative"]?.split(',')[0]?.trim() || row["BOM.Alternative"],
                                    errorType: 'Different BOM.Alternative'
                                });
                            });
                        }
                    }
                });


            // Chuyển mergedRows thành mảng 2 chiều
            mergedSheets[sheetName] = [mergedHeaders, ...mergedRows.map(row => mergedHeaders.map(h => row[h]))];
            mergedSheets[sheetName].rowHighlights = mergedRows.map(row => row.highlight); // Lưu thông tin highlight
        });

        setErrorRows(allErrorRows);
        setMergedData(mergedSheets);
        // console.log("Dữ liệu gộp (nhiều sheet):", mergedSheets);
    };


    const compareFiles = (file2Data, file1Data) => {
        if (!file1Data.length || !Object.keys(file2Data).length) return;

        const warningsList = [];
        const file2Sheet = file2Data[Object.keys(file2Data)[0]] || [];
        const file2Headers = file2Sheet[0] || [];
        const file2NumberIndex = file2Headers.indexOf("Number");
        const file2AlternativeIndex = file2Headers.indexOf("BOM.Alternative");

        const file1Headers = file1Data[0] || [];
        const file1NumberIndex = file1Headers.indexOf("Number");
        const file1DataRows = file1Data.slice(1);

        // Tạo danh sách các mã liệu và nhóm thay thế từ file gốc
        const alternativeGroups = {};
        file2Sheet.slice(1).forEach((row) => {
            const number = row[file2NumberIndex];
            const alternativeGroup = row[file2AlternativeIndex] || "";
            if (number && alternativeGroup) {
                if (!alternativeGroups[alternativeGroup]) {
                    alternativeGroups[alternativeGroup] = [];
                }
                alternativeGroups[alternativeGroup].push(number);
            }
        });

        // Kiểm tra mã liệu từ file 1
        file1DataRows.forEach((row, idx) => {
            const number = row[file1NumberIndex];
            if (!number) return;

            // Kiểm tra xem mã liệu có trong file gốc không
            const foundInFile2 = file2Sheet.slice(1).some((r) => r[file2NumberIndex] === number);
            if (!foundInFile2) {
                // Kiểm tra nhóm thay thế
                const group = file2Sheet.slice(1).find((r) => r[file2NumberIndex] === number)?.[file2AlternativeIndex] || "";
                const alternatives = alternativeGroups[group] || [];
                const hasValidAlternative = file1DataRows.some((r) => alternatives.includes(r[file1NumberIndex]));

                if (!hasValidAlternative) {
                    warningsList.push(`Mã liệu ${number} (dòng ${idx + 2}) không tồn tại trong file gốc và không có mã thay thế hợp lệ.`);
                }
            }
        });

        setWarnings(warningsList);
        if (warningsList.length > 0) {
            showToast(`⚠️ Có ${warningsList.length} mã liệu bất thường!`, 'warning');
        } else {
            showToast('✅ Không có mã liệu bất thường.', 'success');
        }
    };

    const [toast, setToast] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const showToast = (message, severity = 'success') => {
        setToast({ open: true, message, severity });
    };

    const handleTabChange = (event, newValue) => {
        setActiveSheet(newValue);
    };

    const sheetNames = Object.keys(excelData2);
    const activeSheetName = sheetNames[activeSheet];
    const activeData = excelData2[activeSheetName] || [];
    const activeMergedData = mergedData[activeSheetName] || [];
    const rowHighlights = activeMergedData.rowHighlights || [];



    return (
        <Grid container columns={12}>
            <Grid container columns={12} lg={6}>
            <HiBox lg={12} md={12} xs={12} header="" alarn={false} height="40vh" variant="filled" overflow={false}>
                <Button sx={{ position: 'absolute', top: 0, right: 0, zIndex: '10' }} size='small' onClick={() => setNewFolderDialogOpen(true)}><AddOutlined /></Button>
                <TableExcel idata={excelData}></TableExcel>
            </HiBox>
            <HiBox lg={12} md={12} xs={12} header="" alarn={false} height="40vh" variant="filled" overflow={false}>
                <Button sx={{ position: 'absolute', top: 0, right: 0, zIndex: '10' }} size='small' onClick={() => setNewFolderDialogOpen2(true)}><AddOutlined /></Button>
                <Box sx={{ height: '100%',width: '100%'}}>
                    <Tabs value={activeSheet} onChange={handleTabChange}>
                        {sheetNames.map((name, idx) => (
                            <Tab key={idx} label={name} />
                        ))}
                    </Tabs>
                  
                        <TableContainer component={Paper}>
                            <Table stickyHeader>
                                <TableHead >
                                    <TableRow>
                                        {activeData[0]?.map((col, colIdx) => (
                                            <TableCell  key={colIdx} sx={{fontWeight: "bold"}}>
                                                {col}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {activeData.slice(1).map((row, rowIdx) => (
                                        <TableRow key={rowIdx}>
                                            {row.map((cell, cellIdx) => (
                                                <TableCell key={cellIdx} sx={{backgroundColor: cell !== undefined && cell !== null && cell !== "" ? cell.toString().indexOf("*") > 0 ? '#cee1ff': '' :''}}>
                                                    <Typography sx={{fontSize: '13px' , whiteSpace:'nowrap', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {cell !== undefined && cell !== null && cell !== "" ? cell : '-'}
                                                    </Typography> 
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
             
                </Box>
            </HiBox>
            </Grid>
            <Grid container columns={12} lg={6}>
            <HiBox lg={12} md={12} xs={12} header="" alarn={false} height="81.5vh" variant="filled" overflow={false}>
                 {/* Hiển thị danh sách cảnh báo */}
                    {errorRows.length > 0 ? (
                        <Box sx={{height: '100%', marginTop: 2, padding: 2, backgroundColor: '#ff254638', borderRadius: 2 }}>
                            <Typography variant="h6" color="error">Cảnh báo mã liệu bất thường:</Typography>
                            <TableContainer  sx={{overflow: 'auto' }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: 'bold'}}>Sheet</TableCell>
                                            <TableCell sx={{fontWeight: 'bold'}}>MATERIAL NO</TableCell>
                                            <TableCell sx={{fontWeight: 'bold'}}>SLOT</TableCell>
                                            <TableCell sx={{fontWeight: 'bold'}}>FEEDER</TableCell>
                                            <TableCell sx={{fontWeight: 'bold'}}>BOM.Alternative</TableCell>
                                            <TableCell sx={{fontWeight: 'bold'}}>Error Type</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {errorRows.map((error, idx) => (
                                            <TableRow key={idx} >
                                                <TableCell>{error.sheet}</TableCell>
                                                <TableCell>{error.materialNo}</TableCell>
                                                <TableCell>{error.slot}</TableCell>
                                                <TableCell>{error.feeder}</TableCell>
                                                <TableCell>{error.alternative}</TableCell>
                                                <TableCell>{error.errorType}</TableCell>

                                                
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                </TableContainer>
                        </Box>
                    )
                    : 
                    <Box sx={{ marginTop: 2, padding: 2, backgroundColor: '#2fd371', borderRadius: 2 }}>
                        <Typography variant="h6" color="success">Không có mã liệu bất thường:</Typography>
                    </Box>
                    }
            </HiBox>
               
            </Grid>
            <Grid item xs={12}>

            <HiBox header={`Sheet: ${activeSheetName || 'n/a'}`} alarn={false} height="80vh" variant="filled" overflow={false}>
                <Box sx={{ marginTop: 2 }}>
                        <Tabs value={activeSheet} onChange={handleTabChange}>
                            {sheetNames.map((name, idx) => (
                                <Tab key={idx} label={name} />
                            ))}
                        </Tabs>
                        <Box sx={{ height: '100%',width: '100%', overflow: 'auto' }}>
                            <TableContainer component={Paper} sx={{ maxHeight: '86vh', overflow: 'auto' }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        {activeMergedData[0]?.map((col, colIdx) => (
                                            <TableCell key={colIdx} sx={{ fontWeight: "bold" }}>
                                                {col}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {activeMergedData.slice(1).map((row, rowIdx) => (
                                        <TableRow key={rowIdx} sx={{ backgroundColor: rowHighlights[rowIdx] ? '#ffcccc' : 'inherit' }}>
                                            {row.map((cell, cellIdx) => (
                                                <TableCell key={cellIdx}>
                                                    <Typography sx={{fontSize: '13px' , whiteSpace:'nowrap', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {cell !== undefined && cell !== null && cell !== "" ? cell : '-'}
                                                    </Typography> 
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                </HiBox>
            </Grid>
            

            <Dialog open={newFolderDialogOpen} onClose={() => setNewFolderDialogOpen(false)}>
                <DialogTitle>Create a new file BOM</DialogTitle>
                <Box sx={{ width: '100%' }}>
                    <DialogContent sx={{ paddingTop: '8px !important', minWidth: '350px' }}>
                        <Box sx={{ marginTop: '10px' }}>
                            <Typography>File</Typography>
                            <Button variant='outlined' component="label">
                                Chọn File Excel
                                <input type="file" hidden accept='.xlsx,.xls' onChange={handleFileUpload} />
                            </Button>
                        </Box>
                    </DialogContent>
                </Box>
                <DialogActions>
                    <Button variant="outlined" color='error' onClick={() => setNewFolderDialogOpen(false)}>Exit</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={newFolderDialogOpen2} onClose={() => setNewFolderDialogOpen2(false)}>
                <DialogTitle>Create a new file material</DialogTitle>
                <Box sx={{ width: '100%' }}>
                    <DialogContent sx={{ paddingTop: '8px !important', minWidth: '350px' }}>
                        <Box sx={{ marginTop: '10px' }}>
                            <Typography>File</Typography>
                            <Button variant='outlined' component="label">
                                Chọn File Excel
                                <input type="file" hidden accept='.xlsx,.xls' onChange={handleFileUpload2} />
                            </Button>
                        </Box>
                    </DialogContent>
                </Box>
                <DialogActions>
                    <Button variant="outlined" color='error' onClick={() => setNewFolderDialogOpen2(false)}>Exit</Button>
                </DialogActions>
            </Dialog>

           

            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default CompareFiles;