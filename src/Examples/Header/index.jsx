import React, { useState, useEffect, memo, useCallback } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box ,Button} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimeRangePicker, MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Settings from '../Header/components/setting';
import { CalendarMonthOutlined, SettingsOutlined } from '@mui/icons-material';
import img1 from './../../Assets/img/experience-img2.jpg'
import { setParam, resetParam } from '../../Redux/Actions/paramSlice';
import { useTranslation } from 'react-i18next';
import { setLanguage } from '../../Redux/languageSlice';


const Header = ({ children, isSticky, isMini, isSmallScreen, toggleSidebar, toggleTheme, isDarkMode , toggleMenu }) => {
  const user = useSelector((state) => state.auth.login.currentUser);
  const { t } = useTranslation();

  // const Param = useSelector((state) => state.action);
  const [isExpanded, setIsExpanded] = useState(false); // Trạng thái mở rộng header
  const [dateRange, setDateRange] = useState([null, null]); // Lưu giá trị từ ngày đến ngày

  const [scroll, setScroll] = useState(false); // Màu nền mặc định là trong suốt
  const [settingsOpen , setSettingsOpen] = useState(false);

  const location = useLocation(); // Lấy đường dẫn hiện tại
  const theme = useTheme();
  const dispatch = useDispatch()

  const handleSettingToggle = useCallback(() =>{
    setSettingsOpen((prev) => !prev);
  },[]); 
  //Thêm hàm để thay đổi trạng thái mở rộng:
  const handleExpandToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  },[]);

  const handleSubmit = useCallback((e) =>{
    e.preventDefault();
    if(dateRange[0] && dateRange[1]){
      dispatch(setParam({
        page:{
          dep: location.pathname.split('/')[1],
          page_name: location.pathname.split('/')[2],
        },
        params:{
          starttime: `${dayjs(dateRange[0]?.toISOString()).format('YYYY-MM-DD HH:mm:ss')}` ,
          endtime: `${dayjs(dateRange[1]?.toISOString()).format('YYYY-MM-DD HH:mm:ss')}`
        }
      }))
    }
  },[dispatch, dateRange, location.pathname]);


  const handleChangeLang = (imodel) =>{
    dispatch(setLanguage(imodel))
  };


  const handleClean = useCallback((e) =>{
    e.preventDefault();
    setDateRange([null, null]);
    // dispatch(resetParam());
    dispatch(setParam({
      params:{
        starttime: `` ,
        endtime: ``
      }
    }))
  },[dispatch]);

  // Hàm xử lý sự kiện cuộn
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScroll(true);
      } else {
        setScroll(false)
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Map đường dẫn thành tên tiêu đề
  const pageTitles = {
    '/Home/DashBoard': 'Dashboard',
    '/UploadFile/FileExplorer': 'File Explorer',

    '/SMT/SMTMachine': 'A02-SMT Machine Control',
    '/SMT/PrinterMachine': 'A02-SMT Printer Machine Control',
    '/SMT/AoiSpiMachine': 'A02-SMT AOI/SPI Machine Control',
    '/SMT/XRAYMachine': 'A02-SMT XRAY Control',
    '/SMT/MounterPickup': 'A02-SMT Mounter Pickup',
    '/SMT/AoiMachine': 'A02-SMT AOI/SPI Machine Control',
    '/SMT/AOITraceability': 'A02-SMT PCB Traceability',
    '/SMT/ReflowMachine': 'A02-SMT Reflow Machine Control',
    '/PE/YieldRateControl': 'A02-PE Yield Rate Tracking',
    '/MPE/ESDControl': 'A02-MPE ESD Control',
    '/MPE/SpareParts' : 'A02-MPE Spare Parts',
    '/MPE/DataGelScreen' : 'A02-MPE Data Gel',
    '/Kitting/SolderPasteAndGlue': 'A02-Kitting Solder Paste And Glue',
    '/Kitting/SqueegeeHolders': 'A02-Kitting Squeegee Holders',
    '/Kitting/StencilControl': 'A02-Kitting Stencil Control',
    '/Kitting/PCBLaser': 'A02-Kitting PCB Laser',
    '/Kitting/DryingControl': 'A02-Kitting Drying Control',
    
    '/ME/FeederControl': 'A02-ME Feeder Control',
    '/ME/CompareFiles' : 'A02-ME Compare Files',

    '/Production/MoControl': 'A02-SMT MO Control',
    '/Kitting/MaterialReuse': 'A02-Kitting Material Reuse',
    '/Kitting/MaterialReturn': 'A02-Kitting Material Return',
    '/Production/WipStatus' : 'A02-SMT Wip Status',
    '/Production/SMTYieldRate' : 'A02-SMT Yield Rate',
    '/DailyReport/LCRReport' : 'A02-LCR FAI Report',
    '/ErrorPage' : 'Error page',
    '/FATP/FATPMachineControl':'A02-FATP Machine Control',
    '/FATP/GlueScrewStatus': 'A02-FATP Glue Screw Status',
    '/FATP/VCutMachineStatus': 'A02-FATP VCut Machine Status',
    '/FATP/MaintenanceStatus': 'A02-FATP Maintenance Status',
    '/FATP/VoltageMonitor': 'A02-FATP Voltage Monitor Dashboard',
    '/FATP/StencilRoom': 'A02-FATP StencilRoom & Haocai Manager',
    '/FATP/ProjectManagement': 'A02-FATP Project System',
    '/FATP/MetDocument': 'A02-MET Document',

    // Thêm các tiêu đề khác
  };
  // Tên tiêu đề trang hiện tại
  const title = pageTitles[location.pathname] || 'Welcome to My System';

  useEffect(() =>{
    document.title = title
  }, [title])

  return (
    <>
    <AppBar
      sx={{
        backgroundImage: 'unset !important',
        position: 'sticky',
        top: isSticky ? 0 : '',
        marginLeft: !isSmallScreen ? isMini ? '80px' : '270px' : '0px',
        width: !isSmallScreen ? isMini ? 'calc(100% - 90px)' : 'calc(100% - 280px)' : '100%',
        backdropFilter: 'blur(10px)',
        backgroundColor: theme.palette.background.header,
        boxShadow: scroll ? '0 8px 8px -5px rgba(0, 0, 0, 0.2)' : 'none', // Hiệu ứng bóng cho khi cuộn xuống
        zIndex: 1000,
        color: !isDarkMode ? '#000' : '#fff',
        padding: scroll ? '0px 15px' : '0px 0px',
        borderBottomLeftRadius: '10px',
        borderBottomRightRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'marginLeft 0.3s ease, background-color 0.1s ease , padding 0.3s ease, borderBottomLeftRadius 0.6s ease, borderBottomRightRadius 0.6s ease', // Hiệu ứng chuyển màu nền
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        {/* Menu + Tiêu đề */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Menu icon cho màn hình nhỏ */}
          {isSmallScreen && (
            <IconButton 
              onClick={toggleSidebar}
              sx={{
                zIndex: 1000,
              }} edge="start" color="inherit" aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          )}
          {/* Tiêu đề ứng dụng */}
          <Typography variant="h4" sx={{ flexGrow: 1, fontSize: !isSmallScreen ? '34px' : '24px', fontWeight: 700 }}>
            {title}
          </Typography>
         
        </Box>
        {/* Tìm kiếm + Nút chế độ sáng/tối + Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Tìm kiếm */}
          {isExpanded ? (
          
              <IconButton onClick={handleExpandToggle}>
                ✖
              </IconButton>
         
          ) : (
            <IconButton color="inherit" onClick={handleExpandToggle}>
              <CalendarMonthOutlined></CalendarMonthOutlined>
            </IconButton>
          )}

          <Settings open={settingsOpen} 
          onClose={()=> setSettingsOpen(false)} 
          onToggleTheme={toggleTheme} 
          onToggleMenu={toggleMenu} 
          onChangeLang={handleChangeLang}
          isDarkMode={isDarkMode}
           >

          </Settings>
          <IconButton color='inherit' onClick={handleSettingToggle}>
             <SettingsOutlined/>
          </IconButton>

          {/* Thêm các nút hoặc biểu tượng khác nếu cần */}
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Hello, {user?.username}
              </Typography>
              <IconButton edge="end" color="inherit" aria-label="user">
                <img
                  src= {img1}
                  alt="User"
                  style={{ width: '30px', borderRadius: '50%' }}
                />
              </IconButton>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>

    {/* Phần mở rộng */}
    {isExpanded && (
        <Box
          sx={{
            marginLeft: !isSmallScreen ? (isMini ? '80px' : '270px'): '0px',
            width: !isSmallScreen ? (isMini ? 'calc(100% - 90px)' : 'calc(100% - 280px)' ): '100%',
            backgroundColor: theme.palette.background.header,
            padding: '10px',
            
            // boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            borderTop: '1px solid #999',
            transition: 'all 0.3s ease',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <form style={{display:'flex',justifyContent:'space-between',}} onSubmit={handleSubmit}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimeRangePicker
              slots={{ field: MultiInputDateTimeRangeField }}
              startText="Từ ngày"
              endText="Đến ngày"
              value={dateRange}
              onChange={(newValue) => setDateRange(newValue)}
              renderInput={(startProps, endProps) => (
                <Box sx={{ display: 'flex', gap: '5px' }}>
                  <input
                    {...startProps.inputProps}
                    placeholder="Từ ngày"
                    style={{
                      padding: '3px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }}
                  />
                  <input
                    {...endProps.inputProps}
                    placeholder="Đến ngày"
                    style={{
                      padding: '3px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }}
                  />
                </Box>
              )}
            />
          </LocalizationProvider>
          <Button sx={{marginLeft: '15px' }} variant="contained" type='submit'>Submit</Button>
          <Button sx={{marginLeft: '15px' }} variant="contained" color='error' onClick={ handleClean}>Clean</Button>

          </form>
         


        </Box>
      )}
    </>
  );
};

export default memo(Header);
