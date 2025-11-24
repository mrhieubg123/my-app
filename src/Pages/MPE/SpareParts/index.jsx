import React, { useState, useEffect, useCallback } from 'react';
import { Alert, Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, Menu, MenuItem, Select, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography} from '@mui/material';
import HiBox from '../../../components/HiBox';
import { useNotification } from "../../../components/HiNotification";
import MachineStatus from './components/MachineStatus';
import { AddOutlined} from '@mui/icons-material';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useTheme } from '@mui/material/styles';
import { getAuthorizedAxiosIntance } from '../../../utils/axiosConfig';
import TableMachineStatus from './components/MachineStatus copy';
import MachineTotal from './components/MachineTotal';
import ListProducts from './components/ListProducts';
import EquipmentInStock from './components/EquipmentInStock';
import TableEquipmentUse from './components/TableEquipmentUse';
import ListProductsUseInMonth from './components/ListProductsUseInMonth';
import PieChart from './components/PieChart';
import { useSelector, useDispatch } from 'react-redux';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs,{Dayjs} from 'dayjs';
import LineChart from './components/LineChart';

const axiosInstance = await getAuthorizedAxiosIntance();

function getLocalDate() {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset*60000);
    return localDate.toISOString().slice(0, 19);
}
const month = getLocalDate().split(' ')[0].split('-')[1]
const year = getLocalDate().split(' ')[0].split('-')[0]

const SpareParts = () =>{
    const theme = useTheme();
    const user = useSelector((state) => state.auth.login.currentUser);

    const showNotification = useNotification();
    const [totalOK, setTotalOK] = useState(false);
    const [totalAlarm, setTotalAlarm] = useState(false);
    const [totalNG, setTotalNG] = useState(false);
    const [fil, setFil] = useState('In');
    const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
    const [newFolderDialogOpen2, setNewFolderDialogOpen2] = useState(false);
    const [newFolderDialogOpen3, setNewFolderDialogOpen3] = useState(false);
    const [newFolderDialogOpen4, setNewFolderDialogOpen4] = useState(false);
    const [newFolderDialogOpen5, setNewFolderDialogOpen5] = useState(false);
    const [newFolderDialogOpen6, setNewFolderDialogOpen6] = useState(false);
    const [newFolderDialogOpen7, setNewFolderDialogOpen7] = useState(false);
    const [newFolderDialogOpen8, setNewFolderDialogOpen8] = useState(false);
    const [newFolderDialogOpen9, setNewFolderDialogOpen9] = useState(false);
    const [newFolderDialogOpenEditMachine, setNewFolderDialogOpenEditMachine] = useState(false);
    const [newFolderDialogOpenEditMachineCode, setNewFolderDialogOpenEditMachineCode] = useState(false);

    

    const [dataListSpareParts , setDataListSpareParts] = useState([]);
    const [dataMachineSparePartsStatus, setDataMachineSparePartsStatus] = useState([]);
    const [dataSparePartsDetail , setDataSparePartsDetail] = useState([]);
    const [dataEquipmentInStock , setDataEquipmentInStock] = useState([]);
    const [dataMachineSparePartsDetail, setDataMachineSparePartsDetail] = useState([]);
    const [dataHistorySparePartsDetails, setDataHistorySparePartsDetails] = useState([]);
    const [dataMachineCodeDetailsbyYear, setDataMachineCodeDetailsbyYear] = useState([]);
    const [dataEquipmentUseInMonth, setDataEquipmentUseInMonth] = useState([]);

    const [listProduct, setListProduct] = useState({EnList: "", VnList: "", TiControl:""});
    const [value, setValue] = React.useState(dayjs().format('YYYY-MM'));
    const [value2, setValue2] = React.useState(dayjs().format('YYYY'));


    const [formData, setFormData] = useState({
        project:"",
        line:"",
        machine:"",
        machineName:"",
        location:"",
        machineCode:"",
        comment:""
    })
    const [excelData, setExcelData] = useState([]);

    const [newProduct, setNewProduct] = useState({
        product_en: "", 
        product_vn: "",
        Time_Control: ""
    });

    const [newAddEquipment, setNewAddEquipment] = useState({
        product_en: "", 
        product_vn: "",
        quantity: "",
        comment: "",
    });

    const [queryMachineCode, setQueryMachineCode] = useState({
        project: "",
        line: "",
        machine: "",
        machineName: "",
        location: "",
        machineCode: "",
        year: year
    });
    
    const fetchMachineSparePartsStatus = async (model) => {
        try {
            const response = await axiosInstance.post('api/MPE/MachineSparePartsStatus', model)
            setDataMachineSparePartsStatus(response.data || []); // Cập nhật state với danh sách file
            const columns = response.data.length > 0 ? Object.keys(response.data[0]).map((keycol) => keycol.replace('LINE','')): [];
            const filterColumn = columns.filter(key => !['Project', 'Line'].includes(key));
            let vTotalOK = 0;
            let vTotalAlarm = 0;
            let vTotalNG = 0;
            response.data.forEach(item => {
                filterColumn.forEach(key => {
                    const value = item[key] !== null ? item[key].split('-sta-')[1] : [];
                    const ara = value.length > 0 ?  value.split('/-/') : []
                    ara.forEach(id => {
                        const val = id.split('//')[1]
                        if(val >= 5*24){vTotalOK ++ } 
                        else if(val >= 0){ vTotalAlarm ++ } 
                        else{ vTotalNG ++ }
                    })
                })
            })
            setTotalOK(vTotalOK);
            setTotalAlarm(vTotalAlarm);
            setTotalNG(vTotalNG);
        }
        catch (error) {
            console.log(error.message)
        }
    };

    const fetchSparePartsDetail = async (model) => {
        try {
            const response = await axiosInstance.post('api/MPE/SparePartsDetail', model)
            setDataSparePartsDetail(response.data || []); // Cập nhật state với danh sách file
        }
        catch (error) {
            console.log(error.message)
        }
    };
    const ListSparePartsProduct = async () => {
        try{
            const reponse = await axiosInstance.post('api/MPE/ListSparePartsProduct', {}) 
            setDataListSpareParts(reponse.data);
            const en = new Set();
            const vn = new Set();
            reponse.data.forEach((item) => {
                if(item.Product_en) en.add(item.Product_en);
                if(item.Product_vn) vn.add(item.Product_vn);
            })

            setListProduct({
                ...listProduct,
                EnList: [...en].sort((a, b) => a.localeCompare(b)), 
                VnList: [...vn].sort((a, b) => a.localeCompare(b)), 
            })
        }
        catch(error){
            console.error("Lỗi khi lưu:", error)
            showToast('Lỗi khi kết nôi server','error');
        }
      };

    const ListEquipmentInStock = async () => {
    try{
        const reponse = await axiosInstance.post('api/MPE/EquipmentInStock', {}) 
        setDataEquipmentInStock(reponse.data);
    }
    catch(error){
        console.error("Lỗi khi lưu:", error)
        showToast('Lỗi khi kết nôi server','error');
    }
    };
    
    //   MachineSparePartsDetail
    const MachineSparePartsDetail = async () => {
        try{
            const reponse = await axiosInstance.post('api/MPE/MachineSparePartsDetail', {}) 
            setDataMachineSparePartsDetail(reponse.data);
        }
        catch(error){
            console.error("Lỗi khi lưu:", error)
            showToast('Lỗi khi kết nôi server','error');
        }
    };

    
    //   HistorySparePartsDetails
    const HistorySparePartsDetails = async (model) => {
        try{
            const reponse = await axiosInstance.post('api/MPE/HistorySparePartsDetails', model) 
            setDataHistorySparePartsDetails(reponse.data);
        }
        catch(error){
            console.error("Lỗi khi lưu:", error)
            showToast('Lỗi khi kết nôi server','error');
        }
    };

    //   Machine Details
    const MachineCodeDetailsbyYear = async (model) => {
        try{
            const reponse = await axiosInstance.post('api/MPE/MachineCodeDetailsbyYear', model) 
            setDataMachineCodeDetailsbyYear(reponse.data);
            console.log(reponse.data);
        }
        catch(error){
            console.error("Lỗi khi lưu:", error)
            showToast('Lỗi khi kết nôi server','error');
        }
    };

    

    //   Equipment Use In Month
    const EquipmentUseInMonth = async (model) => {
        try{
            const reponse = await axiosInstance.post('api/MPE/EquipmentUseInMonth', model) 
            setDataEquipmentUseInMonth(reponse.data);
        }
        catch(error){
            console.error("Lỗi khi lưu:", error)
            showToast('Lỗi khi kết nôi server','error');
        }
    };

    useEffect(() => {
        fetchMachineSparePartsStatus();
        MachineSparePartsDetail()
        ListEquipmentInStock();
        EquipmentUseInMonth({month: month, year: year});
    },[]);

    


    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const templateHeader =  ['product_en', 'product_vn', 'Time_Control(day)'];

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if(!file){
            showToast('❌ Không có File Excel nào !', 'error');
            return;
        } 
        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const workbook = XLSX.read(bstr, {type: "binary"});
            //Lấy Sheet đầu tiên
            const sheetName = workbook.SheetNames[0];
            if(!sheetName){
                showToast('❌ File Excel không có sheet nào !', 'error');
                return;
            }
            const sheet = workbook.Sheets[sheetName];
            //Chuyển sheet thành JSON
            const data = XLSX.utils.sheet_to_json(sheet ,{header:1}) || [];
            if(data.length === 0) {
                showToast('❌ File Excel rỗng !', 'error');
                return;
            }
            const fileHeader = data[0];
            const isValidHeader = fileHeader.length === templateHeader.length &&  templateHeader.every((col, i) => col === fileHeader[i]);
            if(!isValidHeader){
                showToast('❌ File Excel không đúng định dạng mẫu! Vui lòng tải file mẫu.', 'error');
                return;
            }

            const formattedData = data.slice(1).map((row) => ({
                product_en: row[0] || "", 
                product_vn: row[1] || "",
                Time_Control: row[2] || ""
            }))

            setExcelData(data);
            setNewProduct(formattedData);
        };
        reader.readAsBinaryString(file);
    }

    //Tải File Mẫu
    const handleDownloadTemplate = () => {
        const sampleData = [
            ['product_en', 'product_vn', 'Time_Control(day)'],
            ['springs', 'lò xo', '12'],
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
        const excelBuffer = XLSX.write(workbook, {bookType: "xlsx", type:"array"});
        const blob = new Blob([excelBuffer], {type: "application/octet-stream"});
        saveAs(blob, "FileMau.xlsx")

    }

    const [toast, setToast] = useState({
        open: false,
        message: '',
        severity: 'success',
      });

    const showToast = (message, severity = 'success') => {
        setToast({ open: true, message, severity });
      };

    const createNewMachine = async () => {
        try{
            const reponse = await axiosInstance.post('api/MPE/createNewMachine', { 
                formData,
                newProduct
              })
            if(reponse.data.success){
                showToast(reponse.data.message);
                setExcelData([]);
                setNewProduct({
                    product_en: "", 
                    product_vn: "",
                    Time_Control: ""
                })
                setFormData({
                    project:"",
                    line:"",
                    machine:"",
                    machineName:"",
                    location:"",
                    machineCode:""
                })
                fetchMachineSparePartsStatus();
                ListEquipmentInStock();
                fetchSparePartsDetail(formData);
                setNewFolderDialogOpen(false);
                setNewFolderDialogOpen3(false);
            }
            else {
                // showToast(reponse.data.message,'error');
                showToast('Lưu thất bại','error');
            }
        }
        catch(error){
            console.error("Lỗi khi lưu:", error)
            showToast('Lỗi khi kết nôi server','error');
        }
      };

    const handleConfirmSpareparts = async (model) => {
    setFormData({
        ...formData,
        project: model.project,
        line: model.line,
        machine: model.machine,
        machineName: model.machineName,
        location: model.location,
        machineCode: model.machineCode,
        product_en: model.product_en, 
        product_vn: model.product_vn,
        Time_Control: model.Time_Control,
        idConfirm: model.idConfirm,
        DateTime: model.DateTime,
        totalItemUse: model.totalItemUse
    })
    setNewFolderDialogOpen4(true)
    };
    const handleDeleteSpareParts = async (model) => {
        setFormData({
            ...formData,
            project: model.project,
            line: model.line,
            machine: model.machine,
            machineName: model.machineName,
            location: model.location,
            machineCode: model.machineCode,
            product_en: model.product_en, 
            product_vn: model.product_vn,
            
        })
        setNewFolderDialogOpen5(true)
    }
    const handleDetailSpareParts = async (model) => {
        const newModel = {
            project: model.project,
            line: model.line,
            machine: model.machine,
            machineName: model.machineName,
            location: model.location,
            machineCode: model.machineCode,
            product_en: model.product_en, 
            product_vn: model.product_vn,
            
        }
        setNewFolderDialogOpen7(true);
        HistorySparePartsDetails(newModel);

    }
    const handleDetailMachineCode = async (model) => {
        const newModel = {
            project: model.project,
            line: model.line,
            machine: model.machine,
            machineName: model.machineName,
            location: model.location,
            machineCode: model.machineCode,
            year: year
        }
        setQueryMachineCode({
            ...queryMachineCode,
            project: model.project,
            line: model.line,
            machine: model.machine,
            machineName: model.machineName,
            location: model.location,
            machineCode: model.machineCode,
            year: year
        })


        setNewFolderDialogOpen9(true);
        MachineCodeDetailsbyYear(newModel);
    }

    const openDetailMachineCode = async (model) => {
        setFil(model)
        setNewFolderDialogOpen8(true);
    }

    const handleCreateNewStation = async (model) => { 
    setFormData({
        ...formData,
        project: model.project,
        line: model.line,
        machine: model.machine,
        machineName: model.machineName,
        location: model.location,
        machineCode: model.machineCode,
    })
    setNewFolderDialogOpen(true);
    }

    const handleOpenSpareParts = async (model) => { 
    setNewFolderDialogOpen2(true);
    fetchSparePartsDetail(model);
    }
    const handleEditMachineName = (model) => { 
        setFormData({
            ...formData,
            project: model.project,
            line: model.line,
            machine: model.machine,
            machineName: model.machineName,
            location: model.location,
            machineCode: model.machineCode,
        })
        setNewFolderDialogOpenEditMachine(true);
    }
    // Xác nhận sửa đổi 
    const ConfirmEditMachine = async () => {
        try{
            const reponse = await axiosInstance.post('api/MPE/editMachineName', { 
                formData
            })
            if(reponse.data.success){
                showToast(reponse.data.message);
                setFormData({
                    project:"",
                    line:"",
                    machine:"",
                    machineName:"",
                    location:"",
                    machineCode:"",
                    comment:""
                })
                fetchMachineSparePartsStatus();
                // ListEquipmentInStock();
                // fetchSparePartsDetail(formData);
                // MachineSparePartsDetail();
                setNewFolderDialogOpenEditMachine(false);
            }
            else {
                // showToast(reponse.data.message,'error');
                showToast('Lưu thất bại','error');
            }
        }
        catch(error){
            console.error("Lỗi khi lưu:", error)
            showToast('Lỗi khi kết nôi server','error');
        }
    }

      
    const handleEditMachineCode = (model) => { 
        setFormData({
            ...formData,
            project: model.project,
            line: model.line,
            machine: model.machine,
            machineName: model.machineName,
            location: model.location,
            machineCode: model.machineCode,
        })
        setNewFolderDialogOpenEditMachineCode(true);
    }
    // Xác nhận sửa đổi Machine Code
    const ConfirmEditMachineCode = async () => {
        try{
            const reponse = await axiosInstance.post('api/MPE/editMachineCode', { 
                formData
            })
            if(reponse.data.success){
                showToast(reponse.data.message);
                setFormData({
                    project:"",
                    line:"",
                    machine:"",
                    machineName:"",
                    location:"",
                    machineCode:"",
                    comment:""
                })
                fetchMachineSparePartsStatus();
                ListEquipmentInStock();
                fetchSparePartsDetail(formData);
                MachineSparePartsDetail();
                setNewFolderDialogOpenEditMachineCode(false);
            }
            else {
                // showToast(reponse.data.message,'error');
                showToast('Lưu thất bại','error');
            }
        }
        catch(error){
            console.error("Lỗi khi lưu:", error)
            showToast('Lỗi khi kết nôi server','error');
        }
    }
    
    const handleAddProducts =  () => { 
    ListSparePartsProduct();
    setFormData({
        project: dataSparePartsDetail.map((item) => item.Project)[0],
        line: dataSparePartsDetail.map((item) => item.Line)[0],
        machine: dataSparePartsDetail.map((item) => item.Machine)[0],
        machineName: dataSparePartsDetail.map((item) => item.MachineName)[0],
        location: dataSparePartsDetail.map((item) => item.Location)[0],
        machineCode: dataSparePartsDetail.map((item) => item.MachineCode)[0]
    })
    setNewFolderDialogOpen3(true);
    }
    

    const confirmSpareparts = async () => {
    try{
        const reponse = await axiosInstance.post('api/MPE/confirmSpareParts', { 
            formData
        })
        if(reponse.data.success){
            showToast(reponse.data.message);
            setFormData({
                project:"",
                line:"",
                machine:"",
                machineName:"",
                location:"",
                machineCode:"",
                comment:""
            })
            fetchMachineSparePartsStatus();
            ListEquipmentInStock();
            fetchSparePartsDetail(formData);
            setNewFolderDialogOpen4(false);
            MachineSparePartsDetail();

        }
        else {
            // showToast(reponse.data.message,'error');
            showToast('Lưu thất bại','error');
        }
    }
    catch(error){
        console.error("Lỗi khi lưu:", error)
        showToast('Lỗi khi kết nôi server','error');
    }
    }
    const DeleteSpareParts = async (model) => {
    try{
        const reponse = await axiosInstance.post('api/MPE/deleteItemSpareParts',{ 
            formData
        })
        if(reponse.data.success){
            showToast(reponse.data.message);
            fetchMachineSparePartsStatus();
            ListEquipmentInStock();
            fetchSparePartsDetail(formData);
            setNewFolderDialogOpen5(false);
            setFormData({
                project:"",
                line:"",
                machine:"",
                machineName:"",
                location:"",
                machineCode:""
            })
        }
        else {
            // showToast(reponse.data.message,'error');
            showToast('Lưu thất bại','error');
        }
    }
    catch(error){
        console.error("Lỗi khi lưu:", error)
        showToast('Lỗi khi kết nôi server','error');
    }

    }

    const handleAddQuantityToStock =  () => { 
    ListSparePartsProduct();
    setNewFolderDialogOpen6(true);
    }

    // thêm tồn kho thiết bị
    const AddQuantityToStock = async (model) => {
        try{
            const reponse = await axiosInstance.post('api/MPE/addEquipmentToStock', { 
                newAddEquipment
            })
            if(reponse.data.success){
                showToast(reponse.data.message);
                setNewAddEquipment ({
                    product_en: "", 
                    product_vn: "",
                    quantity: "",
                    comment: "",
                });
                ListEquipmentInStock()
                setNewFolderDialogOpen6(false);
            }
            else {
                showToast('Thêm tồn kho thất bại','error');
            }
        }
        catch(error){
            console.error("Lỗi khi lưu:", error)
            showToast('Lỗi khi kết nôi server','error');
        }
    }
      
    // tim du lieu theo EN VN
    const findByEn = (en) => dataListSpareParts.find((i) => i.Product_en === en);
    const findByVn = (vn) => dataListSpareParts.find((i) => i.Product_vn === vn)
    const handleEnglishChange = (_, newValue) => {
    const record = findByEn(newValue);
    setNewAddEquipment({
        ...newAddEquipment,
        product_en: newValue, 
        product_vn: record?.Product_vn,
    })
    };
    const handleVietnameseChange = (_, newValue) => {
    const record = findByVn(newValue);
    setNewAddEquipment({
        ...newAddEquipment,
        product_en: record?.Product_en, 
        product_vn: newValue,
    });
    };

    const handleEnglishChangeProduct = (_, newValue) => {
    const record = findByEn(newValue);
    setNewProduct({
        ...newProduct,
        product_en: newValue, 
        product_vn: record?.Product_vn,
    })
    };
    const handleVietnameseChangeProduct = (_, newValue) => {
    const record = findByVn(newValue);
    setNewProduct({
        ...newProduct,
        product_en: record?.Product_en, 
        product_vn: newValue,
    });
    };

    return (
        <Grid container columns={12}>
            <Grid size={{ lg: 4, md: 4, xs: 12 }} lg={4} md={4} xs={12} container columns={12}>
                <Grid size={{ lg: 6, md: 6, xs: 6 }} lg={6} md={6} xs={6} container columns={12}>
                    <HiBox lg={12} md={12} xs={12} header = "" alarn={false}  height="15vh" variant="filled" overflow={false}>
                        <TableContainer sx={{height:"100%",overflow:'auto',
                            '&::-webkit-scrollbar': { width: 0,height: 4, opacity: 0 },
                            '&:hover::-webkit-scrollbar': { width: 4,height: 4, opacity: 1 },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }}}>
                            <Table sx={{height: '100%', borderSpacing: "0 8px"}} aria-label="customized table" >
                                <TableBody>
                                    <TableRow >
                                        <TableCell colSpan={2} align="left" component="th" scope="row" sx={{ padding: "6px 15px", borderBottom: '1px solid #999',cursor:"pointer", fontSize: '16px', backgroundColor: '#9995', border: '1px solid #9995', fontWeight: 'bold'}}>A02</TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell rowSpan={2} align="center" component="th" scope="row" sx={{ padding: "unset", border: '1px solid #999',cursor:"pointer" }}>Auto</TableCell>
                                        <TableCell align="center" component="th" scope="row" sx={{ padding: "unset", border: '1px solid #999',cursor:"pointer" }}>Fixture (Công cụ)</TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell align="center" component="th" scope="row" sx={{ padding: "unset", border: '1px solid #999',cursor:"pointer" }}>Haocai</TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell align="center" component="th" scope="row" sx={{ padding: "unset", border: '1px solid #999',cursor:"pointer" }}>FATP</TableCell>
                                        <TableCell align="center" component="th" scope="row" sx={{ padding: "unset", border: '1px solid #999',cursor:"pointer" }}>{user.username}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </HiBox>
                    <HiBox lg={12} md={12} xs={12} header = "" alarn={false}  height="34.9vh" variant="filled">
                        <PieChart idata={dataEquipmentUseInMonth} />

                    </HiBox>
                    
                </Grid>
                <Grid size={{ lg: 6, md: 6, xs: 6 }} lg={6} md={6} xs={6} container columns={12}>
                    <HiBox lg={12} md={12} xs={12} header = "Summary" alarn={false}  height="51.5vh" variant="filled">
                        <MachineStatus lg={12} md={12} xs={12} height="10.6vh" bgColor={'linear-gradient(45deg,#4099ff,#73b4ff)'} >
                            <Typography variant="h7" sx={{fontWeight: '800'}}>{'Machine wait handle'}</Typography>
                            <Button  
                                    variant="text" 
                                    sx={{fontWeight:'bold'}}
                                    // onClick={() => setNewFolderDialogOpen8(true)}
                                > 
                                {totalNG} pcs                                
                            </Button> 
                        </MachineStatus>
                        <MachineStatus lg={12} md={12} xs={12} height="14.8vh" bgColor={'linear-gradient(45deg,#4099ff,#73b4ff)'} >
                            <Typography variant="h7" sx={{fontWeight: '800', cursor:'pointer'}} >{`Spare Parts used`}</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                views={['year','month']}
                                format='MM/YYYY'
                                value={dayjs(value)}
                                onChange={(newValue) => {
                                        const formatted = newValue ? newValue.format('YYYY-MM') : `${year}-${month}` ;
                                        const newModel = {
                                            month: formatted.split('-')[1] || month,
                                            year: formatted.split('-')[0] || year
                                        }
                                        EquipmentUseInMonth(newModel)
                                        setValue(formatted);
                                       
                                       
                                }}
                                slotProps={{
                                    textField:{
                                        variant: 'standard',
                                        InputProps:{disableUnderline: true},
                                        placeholder:'Tháng/Năm',
                                        size:'small',
                                        sx:{ 
                                            width: 'unset',
                                            alignItems:'center',
                                            '& .MuiInputAdornment-root':{
                                                display:'none',
                                               },
                                           '& .MuiInputBase-input':{
                                                border: 'unset',
                                                textAlign: 'center',
                                                width: '100%',
                                                cursor:'pointer'
                                           }
                                           
                                        }
                                    }
                                }}
                            >
                            </DatePicker>
                        </LocalizationProvider>
                                <Button  
                                    variant="text" 
                                    sx={{fontWeight:'bold', padding: 'unset'}}
                                    onClick={() => openDetailMachineCode('Out')}
                                > 
                                    {dataEquipmentUseInMonth.length > 0 ? dataEquipmentUseInMonth.filter(item => item.TransactionsType === 'Out').reduce((sum, item) => sum + item.Quantity, 0) : 0} pcs
                                </Button> 
                        </MachineStatus>
                        <MachineStatus lg={12} md={12} xs={12} height="14.8vh" bgColor={'linear-gradient(45deg,#4099ff,#73b4ff)'} >
                        <Typography variant="h7" sx={{fontWeight: '800', cursor:'pointer'}} >{`Spare Parts Added`}</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                views={['year','month']}
                                format='MM/YYYY'
                                value={dayjs(value)}
                                onChange={(newValue) => {
                                        const formatted = newValue ? newValue.format('YYYY-MM') : `${year}-${month}`;
                                        const newModel = {
                                            month: formatted.split('-')[1] || month,
                                            year: formatted.split('-')[0] || year
                                        }
                                        EquipmentUseInMonth(newModel)
                                        setValue(formatted);
                                        setFil('In');
                                        // console.log(formatted)
                                }}
                                slotProps={{
                                    textField:{
                                        variant: 'standard',
                                        InputProps:{disableUnderline: true},
                                        placeholder:'Tháng/Năm',
                                        size:'small',
                                        sx:{ 
                                            width: 'unset',
                                            alignItems:'center',
                                            '& .MuiInputAdornment-root':{
                                                display:'none',
                                               },
                                           '& .MuiInputBase-input':{
                                                border: 'unset',
                                                textAlign: 'center',
                                                width: '100%',
                                                cursor:'pointer'
                                           }
                                           
                                        }
                                    }
                                }}
                            >
                            </DatePicker>
                        </LocalizationProvider>
                                <Button  
                                    variant="text" 
                                    sx={{fontWeight:'bold', padding: 'unset'}}
                                    onClick={() => openDetailMachineCode('In')}
                                > 
                                    {dataEquipmentUseInMonth.length > 0 ? dataEquipmentUseInMonth.filter(item => item.TransactionsType === 'In').reduce((sum, item) => sum + item.Quantity, 0) : 0} pcs
                                </Button> 
                        </MachineStatus>
                    
                    </HiBox>
                </Grid>
                <Grid size={{ lg: 12, md: 12, xs: 12 }} lg={12} md={12} xs={12} container columns={12}>
                    <HiBox lg={12} md={12} xs={12} header = "Spare Parts in Stock" alarn={false}  height="36.5vh" variant="filled"
                        functionHtml={
                            <Button sx={{position: 'absolute', top: 0, right: 0}} size='small' onClick={() => handleAddQuantityToStock()}><AddOutlined></AddOutlined></Button>
                        }
                    >
                        <EquipmentInStock idata={dataEquipmentInStock}></EquipmentInStock>
                    </HiBox>
                </Grid>

            </Grid>
            <Grid size={{ lg: 8, md: 8, xs: 12 }} lg={8} md={8} xs={12} container columns={12}>
                <Grid size={{ lg: 12, md: 12, xs: 12 }} container columns={12} lg={12} md={12} xs={12} variant="filled">
                    <MachineTotal lg={3} md={3} xs={3} height="13vh" bgColor={'linear-gradient(45deg,#4099ff,#73b4ff)'} header='Total'>{totalOK + totalAlarm + totalNG}</MachineTotal>
                    <MachineTotal lg={3} md={3} xs={3} height="13vh" bgColor={'linear-gradient(45deg,#2ed8b6,#59e0c5)'} header='Good'>{totalOK}</MachineTotal>
                    <MachineTotal lg={3} md={3} xs={3} height="13vh" bgColor={'linear-gradient(45deg,#ffb640,#ffcb80)'} header='Warning'>{totalAlarm}</MachineTotal>
                    <MachineTotal lg={3} md={3} xs={3} height="13vh" bgColor={'linear-gradient(45deg,#ff5370,#ff869a)'} header='Alarm'>{totalNG}</MachineTotal>
                </Grid>
                <HiBox lg={12} md={12} xs={12} header = "Machine"  alarn={false}  height="36.5vh" variant="filled" 
                    functionHtml={
                        <Button sx={{position: 'absolute', top: 0, right: 0}} size='small' onClick={() => setNewFolderDialogOpen(true)}><AddOutlined></AddOutlined></Button>
                    }
                >
                    <TableMachineStatus onModelChange={handleCreateNewStation} onModelChange2={handleOpenSpareParts} onModelChangeEdit={handleEditMachineName} idata={dataMachineSparePartsStatus}></TableMachineStatus>
                </HiBox>
                <HiBox lg={12} md={12} xs={12} header = "Details of Spare Parts used" note='' alarn={false}  height="36.5vh" variant="filled" >
                   <TableEquipmentUse idata={dataMachineSparePartsDetail}></TableEquipmentUse>
                </HiBox>
            </Grid>

            <Dialog open={newFolderDialogOpen} onClose={() => setNewFolderDialogOpen(false)}>
                <DialogTitle>Create a new machine</DialogTitle>
                <Box sx={{width: '100%'}}>
                {/* ([Project] ,[Line] ,[Machine],[MachineName] ,[MachineCode] ,[Location] ,[Time_Start],[Product_en],[Product_vn],[TimeControl],[Confirm],[ID_Confirm],[Comment]) */}
                <DialogContent sx={{ paddingTop: '8px !important', minWidth:'350px'}}>
                    <TextField
                    sx={{ marginTop: '15px !important'}}
                       label="Project"
                       fullWidth
                       name='project'
                       value={formData.project || ''}
                       onChange={handleChange}
                       autoFocus
                   />

                    <TextField
                       sx={{ marginTop: '15px !important'}}
                       label="Line Name"
                       fullWidth
                       name='line'
                       value={formData.line || ''}
                       onChange={handleChange}
                       
                   />

                    <TextField
                        sx={{ marginTop: '15px !important'}}
                       label="Machine"
                       fullWidth
                       name='machine'
                       value={formData.machine || ''}
                       onChange={handleChange}
                       
                   />

                    <TextField
                        sx={{ marginTop: '15px !important'}}
                       label="Machine Name"
                       fullWidth
                       name='machineName'
                       value={formData.machineName || ''}
                       onChange={handleChange}
                       
                   />

                   

                    {/* <TextField
                       sx={{ marginTop: '15px !important'}}
                       label="Station"
                       fullWidth
                       name='station'
                       value={formData.station}
                       onChange={handleChange}
                       
                   /> */}
                   <TextField
                       sx={{ marginTop: '15px !important'}}
                       label="Location"
                       fullWidth
                       type='number'
                       inputProps={{min:1, max: 100, step: 1}}
                       name='location'
                       value={formData.location || ''}
                       onChange={handleChange}
                       
                   />

                    <TextField
                        sx={{ marginTop: '15px !important'}}
                       label="Machine Code"
                       fullWidth
                       name='machineCode'
                       value={formData.machineCode || ''}
                       onChange={handleChange}
                       
                   />

                   {/* <Autocomplete
                       sx={{ marginTop: '15px !important'}}
                       freeSolo
                       options={Monthh}
                       value={formData.status}
                       onChange={(e, newInputValue) => 
                           setFormData({...formData, month: newInputValue})
                       }
                       renderInput={(params) => (
                           <TextField {...params} label="Month" fullWidth></TextField>
                       )}
                   />
                   <TextField
                       sx={{ marginTop: '15px !important'}}
                       label="Status"
                       fullWidth
                       name='status'
                       value={formData.status}
                       onChange={handleChange}
                   /> */}
                   <Box sx={{marginTop: '10px'}}>
                        <Typography>List Product</Typography>
                        <Button variant='outlined' component="label">
                            Chọn File Excel
                            <input type="file" hidden accept='.xlsx,.xls' onChange={handleFileUpload} />
                        </Button>
                        <Button variant='outlined' onClick={handleDownloadTemplate}>
                            Tải File Mẫu
                        </Button>
                   </Box>
               </DialogContent>
               {excelData.length > 0 && 
                   <DialogContent sx={{ paddingTop: '0px !important', height: '200px'}}>
                       <TableContainer sx={{height: '100%', overflow: 'auto',
                        '&::-webkit-scrollbar': { width: 6,height: 6, opacity: 0 },
                        '&:hover::-webkit-scrollbar': { width: 6,height: 6, opacity: 1 },
                        '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd', borderRadius: '10px' },
                        '&:hover::-webkit-scrollbar-thumb': { backgroundColor: '#999', borderRadius: '10px' }
                       }}>
                           <Table>
                               <TableHead sx={{position:'sticky', top: '0' , backgroundColor: theme.palette.background.conponent}}>
                                   {excelData[0].map((header, index) => (
                                       <TableCell align='center' sx={{padding:'6px 3px'}}>
                                           {header}
                                       </TableCell>
                                   ))}
                               </TableHead>
                               <TableBody>
                                   {excelData.slice(1).map((row, rowIndex) => (
                                       <TableRow >
                                           {row.map((cell, cellIndex) => (
                                               <TableCell align='center' key={cellIndex}>{cell || ""}</TableCell>
                                           )
                                       )}
                                       </TableRow>
                                   ))}
                               </TableBody>
                           </Table>
                       </TableContainer>
                   </DialogContent>
               }
                </Box>

                
                
              
                
                <DialogActions>
                <Button variant="contained" color='error'  onClick={() => setNewFolderDialogOpen(false)}>Exit</Button>
                <Button variant="contained" onClick={createNewMachine}>Add Machine</Button>
                </DialogActions>
            </Dialog>

               {/* List Spare Parts */}
            <Dialog open={newFolderDialogOpen2} onClose={() => setNewFolderDialogOpen2(false)} maxWidth="md">
                <Button sx={{position: 'absolute', top: 10, right: 10, backgroundColor:'#9994'}} size='small' onClick={() => handleAddProducts()}><AddOutlined></AddOutlined></Button>
                <Box sx={{padding: '10px' , paddingTop: 'unset'}}>
                    <DialogTitle>Spare parts machine</DialogTitle>

                    <Box sx={{width: '100%',height: '60vh' , padding: '6px'}}>
                        <ListProducts onModelChange={handleConfirmSpareparts} onModelChange2={handleDeleteSpareParts} onModelChange3={handleDetailSpareParts} onModelChange4={handleDetailMachineCode} onModelChangeEdit={handleEditMachineCode}    idata={dataSparePartsDetail}></ListProducts>
                    </Box>
                </Box>
                <DialogActions>
                <Button variant="contained" color='error'  onClick={() => setNewFolderDialogOpen2(false)}>Exit</Button>
                {/* <Button variant="contained" onClick={createNewMachine}>Add Machine</Button> */}
                </DialogActions>
            </Dialog>

               {/* Add thêm Product mới  */}
            <Dialog open={newFolderDialogOpen3} onClose={() => setNewFolderDialogOpen3(false)}>
                <DialogTitle>Create a new Products</DialogTitle>
                <Box sx={{width: '100%'}}>
                {/* ([Project] ,[Line] ,[Machine],[MachineName] ,[MachineCode] ,[Location] ,[Time_Start],[Product_en],[Product_vn],[TimeControl],[Confirm],[ID_Confirm],[Comment]) */}
                <DialogContent sx={{ paddingTop: '8px !important', minWidth:'350px'}}>
                    <Autocomplete
                        sx={{ marginTop: '15px !important'}}
                        freeSolo
                        options={listProduct.EnList}
                        value={newProduct.product_en || ''}
                        inputValue={newProduct.product_en || ''}
                        onChange={handleEnglishChangeProduct}
                        onInputChange={(e, v) => 
                                setNewProduct(prev =>({...prev, product_en: v }))
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Product (EN)" fullWidth></TextField>
                        )}
                   />
                   <Autocomplete
                       sx={{ marginTop: '15px !important'}}
                       freeSolo
                       options={listProduct.VnList}
                       value={newProduct.product_vn || ''}
                       inputValue={newProduct.product_vn || ''}

                       onChange={handleVietnameseChangeProduct}
                       onInputChange={(e, v) => 
                        setNewProduct(prev =>({...prev, product_vn: v }))
                       }

                       renderInput={(params) => (
                           <TextField {...params} label="Product (VN)" fullWidth></TextField>
                       )}
                   />
                   <Autocomplete
                       sx={{ marginTop: '15px !important'}}
                       freeSolo
                       options={[5,10,15,20]}                       
                       inputProps={{min:1, step: 1}}
                       value={newProduct.Time_Control || ''}
                       onChange={(e, newInputValue) => 
                            setNewProduct({...newProduct, Time_Control: newInputValue})
                       }
                       inputValue={newProduct.Time_Control || ''}
                        onInputChange={(e, newInputValue) => 
                            setNewProduct({...newProduct, Time_Control: newInputValue})
                        }
                       renderInput={(params) => (
                           <TextField {...params} type='number' label="Time control (day)" fullWidth></TextField>
                       )}
                   />
               
               </DialogContent>
              
                </Box>
                
                <DialogActions>
                <Button variant="contained" color='error'  onClick={() => setNewFolderDialogOpen3(false)}>Exit</Button>
                <Button variant="contained" onClick={createNewMachine}>Add Product</Button>
                </DialogActions>
            </Dialog>

            {/* Confirm 0Spare Part */}
            <Dialog open={newFolderDialogOpen4} onClose={() => setNewFolderDialogOpen4(false)}>
                    <DialogTitle>Confirm Spare Parts: {formData.product_en +' | '+ formData.product_vn }</DialogTitle>
                    <DialogContent sx={{ paddingTop: '8px !important', minWidth:'350px'}}>
                        <TextField
                            sx={{ marginTop: '15px !important'}}
                            label="Time Control (day)"
                            fullWidth
                            type='number'
                            name='Time_Control'
                            value={formData.Time_Control || ''}
                            onChange={handleChange}
                            
                        />
                         <TextField
                            sx={{ marginTop: '15px !important'}}
                            label="Repair time"
                            fullWidth
                            type='datetime-local'
                            name='DateTime'
                            value={formData.DateTime || ''}
                            onChange={handleChange}
                            defaultValue={getLocalDate()}
                            InputLabelProps={{shrink: true}}
                            
                        />
                        <TextField
                            sx={{ marginTop: '15px !important'}}
                            label="ID Confirm"
                            fullWidth
                            inputProps={{min:1, max: 100, step: 1}}
                            name='idConfirm'
                            value={formData.idConfirm || ''}
                            onChange={handleChange}
                            
                        />
                        <TextField
                            sx={{ marginTop: '15px !important'}}
                            label="Total Item Use"
                            fullWidth
                            inputProps={{min:0, max: 100, step: 1}}
                            name='totalItemUse'
                            type='number'
                            value={formData.totalItemUse || ''}
                            onChange={handleChange}
                            
                        />
                        <Autocomplete
                            sx={{ marginTop: '15px !important'}}
                            freeSolo
                            options={['Replace (Thay thế)', 'Maintain (Bảo dưỡng)']}
                            value={formData.comment || ''}
                            onChange={(e, newInputValue) => 
                                setFormData({...formData, comment: newInputValue})
                            }
                                inputValue={formData.comment || ''}
                                onInputChange={(e, newInputValue) => 
                                    setFormData({...formData, comment: newInputValue})}
                                renderInput={(params) => (
                                <TextField {...params} label="Comment" fullWidth></TextField>
                            )}
                            autoFocus
                        />

                        {/* <TextField
                            sx={{ marginTop: '15px !important'}}
                            label="Comment"
                            fullWidth
                            name='comment'
                            value={formData.comment || ''}
                            onChange={handleChange}
                            autoFocus
                        /> */}
                    </DialogContent>
                <DialogActions>
                    <Button variant="contained" color='error'  onClick={() => setNewFolderDialogOpen4(false)}>Exit</Button>
                    <Button variant="contained" onClick={confirmSpareparts}>Confirm</Button>
                </DialogActions>

            </Dialog>

            {/* Delete Spare Part */}
            <Dialog open={newFolderDialogOpen5} onClose={() => setNewFolderDialogOpen5(false)}>
                    <DialogTitle>Are you sure you want to delete this Item <br></br> {formData.product_en === '%' ? formData.machineName : formData.product_en} | {formData.product_vn === '%' ? formData.machineCode : formData.product_vn} </DialogTitle>
                    <DialogContent sx={{ paddingTop: '8px !important', minWidth:'350px'}}>
                    </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => setNewFolderDialogOpen5(false)}>Exit</Button>
                    <Button variant="contained" color='error' onClick={DeleteSpareParts}>Confirm</Button>
                </DialogActions>

            </Dialog>

            {/* Add quantity to stock */}
            <Dialog open={newFolderDialogOpen6} onClose={() => setNewFolderDialogOpen6(false)}>
                <DialogTitle>Add quantity to Stock</DialogTitle>
                <Box sx={{width: '100%'}}>
                {/* ([Project] ,[Line] ,[Machine],[MachineName] ,[MachineCode] ,[Location] ,[Time_Start],[Product_en],[Product_vn],[TimeControl],[Confirm],[ID_Confirm],[Comment]) */}
                <DialogContent sx={{ paddingTop: '8px !important', minWidth:'350px'}}>
                   <Autocomplete
                       sx={{ marginTop: '15px !important'}}
                       freeSolo
                       options={listProduct.EnList}
                       value={newAddEquipment.product_en || ''}
                        inputValue={newAddEquipment.product_en || ''}
                        onChange={handleEnglishChange}
                        onInputChange={
                            (e, v) => 
                            setNewAddEquipment(prev =>({...prev, product_en: v }) )
                        }
                       renderInput={(params) => (
                           <TextField {...params} label="Product (EN)" fullWidth></TextField>
                       )}
                   />
                   <Autocomplete
                       sx={{ marginTop: '15px !important'}}
                       freeSolo
                       options={listProduct.VnList}
                       value={listProduct.VnList.includes(newAddEquipment.product_vn) ? newAddEquipment.product_vn  : null}
                       inputValue={newAddEquipment.product_vn || ''}
                        onChange={handleVietnameseChange}
                        onInputChange={(e, v) => 
                            setNewAddEquipment(prev =>({...prev, product_vn: v }) )
                        }
                       renderInput={(params) => (
                           <TextField {...params} label="Product (VN)" fullWidth></TextField>
                       )}
                   />
              
                   <TextField
                        sx={{ marginTop: '15px !important'}}
                        label="Quantity"
                        fullWidth
                        freeSolo
                        type='number'
                        name='quantity'
                        value={newAddEquipment.quantity || ''}
                        onChange={(e) => 
                            setNewAddEquipment({...newAddEquipment, quantity: e.target.value})
                       }
                    />
                   <TextField
                        sx={{ marginTop: '15px !important'}}
                        label="Comment"
                        fullWidth
                        freeSolo
                        name='comment'
                        value={newAddEquipment.comment || ''}
                        onChange={(e) => 
                            setNewAddEquipment({...newAddEquipment, comment: e.target.value})
                       }
                    />
               </DialogContent>
                </Box>
                <DialogActions>
                    <Button variant="contained" color='error'  onClick={() => setNewFolderDialogOpen6(false)}>Exit</Button>
                    <Button variant="contained" onClick={AddQuantityToStock}>Add Product</Button>
                </DialogActions>
            </Dialog>

            {/*Spare Parts Detail Maintain */}
            <Dialog open={newFolderDialogOpen7} onClose={() => setNewFolderDialogOpen7(false)} maxWidth="lg">
                <Box sx={{padding: '10px' , paddingTop: 'unset'}}>
                    <DialogTitle>Spare parts Details</DialogTitle>
                    <Box sx={{width: '100%', padding: '6px'}}>
                       <TableEquipmentUse idata={dataHistorySparePartsDetails}></TableEquipmentUse>
                    </Box>
                </Box>
                <DialogActions>
                <Button variant="contained" color='error'  onClick={() => setNewFolderDialogOpen7(false)}>Exit</Button>
                {/* <Button variant="contained" onClick={createNewMachine}>Add Machine</Button> */}
                </DialogActions>
            </Dialog>

            {/* List Spare Parts */}
            <Dialog open={newFolderDialogOpen8} onClose={() => setNewFolderDialogOpen8(false)} maxWidth="md">
                {/* <Button sx={{position: 'absolute', top: 10, right: 10, backgroundColor:'#9994'}} size='small' onClick={() => handleAddProducts()}><AddOutlined></AddOutlined></Button> */}
                <Box sx={{padding: '10px' , paddingTop: 'unset'}}>
                    <DialogTitle>Spare parts used in Month </DialogTitle>

                    <Box sx={{width: '100%',height: '60vh' , padding: '6px'}}>
                        <ListProductsUseInMonth  idata={dataEquipmentUseInMonth.filter(item => item.TransactionsType === fil)}></ListProductsUseInMonth>
                    </Box>
                </Box>
                <DialogActions>
                <Button variant="contained" color='error'  onClick={() => setNewFolderDialogOpen8(false)}>Exit</Button>
                {/* <Button variant="contained" onClick={createNewMachine}>Add Machine</Button> */}
                </DialogActions>
            </Dialog>

            {/* Edit Machine  */}
            <Dialog open={newFolderDialogOpenEditMachine} onClose={() => setNewFolderDialogOpenEditMachine(false)}>
                <DialogTitle>Edit Machine ( {formData.project || ''} - {formData.line || ''} )</DialogTitle>
                <Box sx={{width: '100%'}}>
                    <DialogContent sx={{ paddingTop: '8px !important', minWidth:'350px'}}>
                        <TextField
                            sx={{ marginTop: '15px !important'}}
                        label="Machine"
                        fullWidth
                        name='machine'
                        value={formData.machine || ''}
                        onChange={handleChange}
                    />
                        <TextField
                            sx={{ marginTop: '15px !important'}}
                        label="Machine Name"
                        fullWidth
                        name='machineName'
                        value={formData.machineName || ''}
                        onChange={handleChange}
                    />
                </DialogContent>
                </Box>
                <DialogActions>
                <Button variant="contained" color='error'  onClick={() => setNewFolderDialogOpenEditMachine(false)}>Exit</Button>
                <Button variant="contained" onClick={ConfirmEditMachine}>Confirm</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Machine Code */}
            <Dialog open={newFolderDialogOpenEditMachineCode} onClose={() => setNewFolderDialogOpenEditMachineCode(false)}>
                <DialogTitle>Edit Machine Code ( {formData.machine || ''} - {formData.machineName || ''} )</DialogTitle>
                <Box sx={{width: '100%'}}>
                    <DialogContent sx={{ paddingTop: '8px !important', minWidth:'350px'}}>
                       
                        <TextField
                            sx={{ marginTop: '15px !important'}}
                        label="Machine Code"
                        fullWidth
                        name='machineCode'
                        value={formData.machineCode || ''}
                        onChange={handleChange}
                    />
                </DialogContent>
                </Box>
                <DialogActions>
                <Button variant="contained" color='error'  onClick={() => setNewFolderDialogOpenEditMachineCode(false)}>Exit</Button>
                <Button variant="contained" onClick={ConfirmEditMachineCode}>Confirm</Button>
                </DialogActions>
            </Dialog>

            {/* Machine Code Detail*/}
            <Dialog open={newFolderDialogOpen9} onClose={() => setNewFolderDialogOpen9(false)} maxWidth="lg" fullWidth='true'>
                {/* <Button sx={{position: 'absolute', top: 10, right: 10, backgroundColor:'#9994'}} size='small' onClick={() => handleAddProducts()}><AddOutlined></AddOutlined></Button> */}
                <Box sx={{padding: '10px' , paddingTop: 'unset'}}>
                    <DialogTitle>Machine Spare Parts within one year (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                views={['year']}
                                format='YYYY'
                                value={dayjs(value2)}
                                onChange={(newValue) => {
                                        const formatted = newValue ? newValue.format('YYYY') : `${year}`;
                                        const newModel = {
                                            project: queryMachineCode.project,
                                            line: queryMachineCode.line,
                                            machine: queryMachineCode.machine,
                                            machineName: queryMachineCode.machineName,
                                            location: queryMachineCode.location,
                                            machineCode: queryMachineCode.machineCode,
                                            year: formatted || year
                                        }
                                        MachineCodeDetailsbyYear(newModel)
                                        setValue2(formatted);
                                        // console.log(formatted)
                                }}
                                slotProps={{
                                    textField:{
                                        variant: 'standard',
                                        InputProps:{disableUnderline: true},
                                        placeholder:'Tháng/Năm',
                                        size:'small',
                                        sx:{ 
                                            width: 'unset',
                                            alignItems:'center',
                                            '& .MuiInputAdornment-root':{
                                                display:'none',
                                               },
                                           '& .MuiInputBase-input':{
                                                border: 'unset',
                                                padding: '8px',
                                                width: '40px',
                                                textAlign: 'center',
                                                cursor:'pointer',
                                           }
                                           
                                        }
                                    }
                                }}
                            >
                            </DatePicker>
                        </LocalizationProvider>
                        )
                    
                    </DialogTitle>

                    <Box sx={{width: '100%',height: '60vh' , padding: '6px'}}>
                        <LineChart  idata={dataMachineCodeDetailsbyYear}></LineChart>
                    </Box>
                </Box>
                <DialogActions>
                <Button variant="contained" color='error'  onClick={() => setNewFolderDialogOpen9(false)}>Exit</Button>
                {/* <Button variant="contained" onClick={createNewMachine}>Add Machine</Button> */}
                </DialogActions>
            </Dialog>

            {/* Toast notification */}
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
    )
}
export default SpareParts;
