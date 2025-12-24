import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Collapse, Box } from '@mui/material';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import LensOutlinedIcon from '@mui/icons-material/LensOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import { AccountTreeOutlined, AnalyticsOutlined, ApiOutlined, DeveloperBoard, FactCheck, FactCheckOutlined, MarkChatReadOutlined, PortableWifiOffOutlined, ProductionQuantityLimitsOutlined, ProductionQuantityLimitsRounded, Propane, RocketLaunchOutlined, RoundaboutLeftOutlined, SafetyDividerOutlined } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { setParam, resetParam } from '../../Redux/Actions/paramSlice';



const SidebarContent = ({ isMini ,selectedItem, setSelectedItem}) => {
  const [openStates, setOpenStates] = useState({});

  const toggleMenu = (menu) => {
    setOpenStates((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();
  const handleSelectItem = (menuKey, subKey = null, path = null) => {
    setSelectedItem({ key: menuKey, subKey });
    if(path) navigate(path);

    dispatch(resetParam());
    const parts =  path?.split('/')
    if(parts?.length >= 3){
      dispatch(setParam({
        page:{
          dep: path.split('/')[1],
          page_name: path.split('/')[2],
        },
       
      }))
    }
    
    
  };

  const menuItems = [
    {
      label: 'Daily Report',
      icon: <InventoryOutlinedIcon />,
      key: 'DailyReport',
      subItems: [
        { label: 'LCR Report', icon: <LensOutlinedIcon />, path: '/DailyReport/LCRReport' },

        // { label: 'SMT INTROLDUCTION PROCESS', icon: <LensOutlinedIcon />, path: '/Kitting/StencilControl' },
        // { label: 'Training OP', icon: <LensOutlinedIcon />, path: '/Kitting/StencilControl' },
        // { label: 'Fixture CONTROL', icon: <LensOutlinedIcon />, path: '/Kitting/StencilControl' },
        // { label: 'SMT report by LINE ', icon: <LensOutlinedIcon />, path: '/Kitting/StencilControl' },
        // { label: 'SMT Daily REPORT', icon: <LensOutlinedIcon />, path: '/DailyReport/Report' },
        // { label: 'MSD CONTROL', icon: <LensOutlinedIcon />, path: '/Kitting/StencilControl' },
        // { label: 'DFM BY MODEL', icon: <LensOutlinedIcon />, path: '/Kitting/StencilControl' },
        // { label: 'SMT CIP', icon: <LensOutlinedIcon />, path: '/Kitting/StencilControl' },
        // { label: 'SMT Check safety  ( BBS )', icon: <LensOutlinedIcon />, path: '/Kitting/StencilControl' },
      ],
    },
    {
      label: 'Kitting',
      icon: <ArchiveOutlinedIcon />,
      key: 'kitting',
      subItems: [
        { label: 'Material Return', icon: <LensOutlinedIcon />, path: '/Kitting/MaterialReturn' },
        { label: 'Solder Paste and Glue', icon: <LensOutlinedIcon />, path: '/Kitting/SolderPasteAndGlue' },
        { label: 'Stencil Control', icon: <LensOutlinedIcon />, path: '/Kitting/StencilControl' },
        { label: 'Squeegee Holders Control', icon: <LensOutlinedIcon />, path: '/Kitting/SqueegeeHolders' },
        { label: 'PCB Laser', icon: <LensOutlinedIcon />, path: '/Kitting/PCBLaser' },
        { label: 'Material Reuse', icon: <LensOutlinedIcon />, path: '/Kitting/MaterialReuse' },
        { label: 'Drying Control', icon: <LensOutlinedIcon />, path: '/Kitting/DryingControl' },

        
        // { label: 'Inventory Kitting', icon: <LensOutlinedIcon />, path: '/Kitting/StencilControl' },
        // { label: 'Inventory MO', icon: <LensOutlinedIcon />, path: '/Kitting/StencilControl' },
        // { label: 'Config Material', icon: <LensOutlinedIcon />, path: '/Kitting/StencilControl' },
        // { label: 'KIT ACM', icon: <LensOutlinedIcon />, path: '/Kitting/StencilControl' },
        // { label: 'TR-SN History', icon: <LensOutlinedIcon />, path: '/Kitting/StencilControl' },
        // { label: 'FAI-LCR report', icon: <LensOutlinedIcon />, path: '/Kitting/StencilControl' },
        // { label: 'KIT baking report ', icon: <LensOutlinedIcon />, path: '/Kitting/StencilControl' },
        // { label: 'KIT ACM  AI Assistant', icon: <LensOutlinedIcon />, path: '/Kitting/StencilControl' },
        // { label: 'KITING RETURN MATERIAL', icon: <LensOutlinedIcon />, path: '/Kitting/StencilControl' },
      ],
    },
    {
      label: 'Production',
      icon: <DeveloperBoard />,
      key: 'production',
      subItems: [
        { label: 'MO Control', icon: <LensOutlinedIcon /> , path: '/Production/MoControl'  },
        { label: 'Wip Status', icon: <LensOutlinedIcon /> , path: '/Production/WipStatus'  },
        { label: 'SMT Yield Rate', icon: <LensOutlinedIcon /> , path: '/Production/SMTYieldRate'},
      ],
    },
    {
      label: 'SMT',
      icon: <RocketLaunchOutlined />,
      key: 'smt',
      subItems: [
        { label: 'Aoi Spi Machine', icon: <LensOutlinedIcon /> , path: '/SMT/AoiSpiMachine'},
        { label: 'Machine Status', icon: <LensOutlinedIcon /> , path: '/SMT/SMTMachine'},
        // { label: 'Introduction', icon: <LensOutlinedIcon /> , path: '/SMT/SMTMachine'  },
        { label: 'Xray Machine', icon: <LensOutlinedIcon /> , path: '/SMT/XRAYMachine'},
        { label: 'Printer Machine', icon: <LensOutlinedIcon /> , path: '/SMT/PrinterMachine'},
        { label: 'AOI Machine', icon: <LensOutlinedIcon /> , path: '/SMT/AoiMachine'},
        { label: 'Mounter Pickup', icon: <LensOutlinedIcon /> , path: '/SMT/MounterPickup'},
        { label: 'PCB Traceability', icon: <LensOutlinedIcon /> , path: '/SMT/AOITraceability'},
        { label: 'Reflow Machine', icon: <LensOutlinedIcon /> , path: '/SMT/ReflowMachine'},
      ],
    },
    {
      label: 'ME',
      icon: <AccountTreeOutlined />,
      key: 'me',
      subItems: [
       
        { label: 'Feeder Control', icon: <LensOutlinedIcon /> , path: '/ME/FeederControl'},
        { label: 'Xray Machine', icon: <LensOutlinedIcon /> , path: '/SMT/XRAYMachine'},
        { label: 'Printer Machine', icon: <LensOutlinedIcon /> , path: '/SMT/PrinterMachine'},
        { label: 'Compare Files', icon: <LensOutlinedIcon /> , path: '/ME/CompareFiles'},
        { label: 'Temperature', icon: <LensOutlinedIcon /> , path: '/ME/Temperature'},
        
      ],
    },
    {
      label: 'PE',
      icon: <AnalyticsOutlined/>,
      key: 'pe',
      subItems: [
        { label: 'BN3-Yield rate', icon: <LensOutlinedIcon />, path: '/PE/YieldRateControl'  },
        { label: 'Log Reader', icon: <LensOutlinedIcon /> , path: '/PE/LogReader' },
      ],
    },
    
    {
      label: 'RE',
      icon: <ApiOutlined />,
      key: 're',
      subItems: [
        // { label: 'Introduction', icon: <LensOutlinedIcon />, path: '/Kitting/StencilControl'  },
        // { label: 'API', icon: <LensOutlinedIcon /> , path: '/Kitting/StencilControl' },
      ],
    },
    {
      label: 'FAP-SOLO',
      icon: <FactCheckOutlined />,
      key: 'mpe',
      subItems: [
        { label: 'BN3-ESD Control', icon: <LensOutlinedIcon />, path: '/MPE/ESDControl'  },
        { label: 'BN3-MPE Spare Parts', icon: <LensOutlinedIcon />, path: '/MPE/SpareParts'  },
        { label: 'BN3-MPE Data Gel', icon: <LensOutlinedIcon />, path: '/MPE/DataGelScreen'  },

      ],
    },
    {
      label: 'FATP-SIGMA',
      icon: <PrecisionManufacturingOutlinedIcon />,
      key: 'fatp',
      subItems: [
        { label: 'Machine Control', icon: <LensOutlinedIcon />, path: '/FATP/FATPMachineControl'  },
        { label: 'Glue Screw Status', icon: <LensOutlinedIcon />, path: '/FATP/GlueScrewStatus'  },
        { label: 'VCut Machine Status', icon: <LensOutlinedIcon />, path: '/FATP/VCutMachineStatus'  },
        { label: 'Maintenance', icon: <LensOutlinedIcon />, path: '/FATP/MaintenanceStatus'  },
        { label: 'Voltage Monitor', icon: <LensOutlinedIcon />, path: '/FATP/VoltageMonitor'  },
        { label: 'Stencil Room', icon: <LensOutlinedIcon />, path: '/FATP/StencilRoom'  },
      ],
    },
  ];

  // useEffect(() => {
  //   const pathParts = location.pathname.split('/');
  //   if(location.pathname === '/'){
      
  //     dispatch(setParam({
  //       page:{dep: 'dashboard',page_name: ''},
       
  //     }));
  //     setSelectedItem({key: 'dashboard', subKey: null});
  //     return;
  //   }

  //   if(pathParts?.length >= 3){
  //     const dep = pathParts[1];
  //     const page = pathParts[2];
      
  //     for(const menu of menuItems){
  //       if(menu.key.toLowerCase() === dep.toLowerCase()){
  //         const subIndex = menu.subItems.findIndex((sub) => 
  //           sub.path?.toLowerCase() === `/${dep.toLowerCase()}/${page.toLowerCase()}`
  //         );
  //         if(subIndex !== -1){
  //           setSelectedItem({key: menu.label, subKey: subIndex})
  //           dispatch(setParam({
  //             page:{
  //               dep: dep,
  //               page_name: page,
  //             },
             
  //           }));
  //           break;
  //         }
  //       }
  //     }
  //   }
  // },[location.pathname])

  return (
    <List
      sx={{
        maxHeight: 'calc(100vh - 64px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        
        padding: 'unset',
        '&::-webkit-scrollbar': { width: 0, opacity: 0 },
        '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
        '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' },
        transition: 'width 0.5s ease, opacity 0.5s ease',
      }}
    >
      <ListItem
        
        onClick={() => handleSelectItem('dashboard', null, '/')}
        sx={{
          background: selectedItem.key === 'dashboard' ? 'linear-gradient(to left, rgba(120, 123, 255, 0.9), rgba(120, 123, 255, 0.3))' : 'transparent',
          '&:hover': { background: 'linear-gradient(to left, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))' },
          transition: 'background 0.3s ease', margin: '3px 0px',
          borderBottomRightRadius: '20px',
          borderTopRightRadius: '20px',
          cursor: 'pointer',
        }}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>
          <DashboardOutlinedIcon />
        </ListItemIcon>
        <Box
          sx={{

            transform: !isMini ? 'translateX(0)' : 'translateX(-5px)',
            transition: 'transform 0.4s ease-in-out, opacity 0.4s ease',
            opacity: !isMini ? 1 : 0,
            cursor: 'pointer',
          }}
        >
          <ListItemText primary="Dashboard" sx={{ margin: 0 }} />
        </Box>
      </ListItem>
      <ListSubheader>Pages</ListSubheader>
      {menuItems.map((item) => (
        <SubMenu
          key={item.key}
          isMini={isMini}
          open={openStates[item.key] || false}
          onToggle={() => toggleMenu(item.key)}
          icon={item.icon}
          title={item.label}
          subItems={item.subItems}
          selectedItem={selectedItem} // Truyền trạng thái selectedItem vào SubMenu
          onSelectItem={handleSelectItem} // Hàm chọn mục vào SubMenu
        />
      ))}
    </List>
  );
};

const SubMenu = ({ isMini, open, onToggle, icon, title, subItems, selectedItem, onSelectItem }) => (
  <>
    <ListItem  onClick={onToggle} sx={{ display: 'flex', alignItems: 'center',   borderBottomRightRadius: '20px', borderTopRightRadius: '20px',cursor: 'pointer', }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
        <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
        <Box
          sx={{
            transform: !isMini ? 'translateX(0)' : 'translateX(-5px)',
            transition: 'transform 0.4s ease-in-out, opacity 0.4s ease',
            opacity: !isMini ? 1 : 0,

          }}
        >
          <ListItemText
            primary={title}
            sx={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }}
          />
        </Box>
      </Box>
      {!isMini && (open ? <ExpandMore /> : <KeyboardArrowRightOutlinedIcon />)}
    </ListItem>
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {subItems.map((subItem, index) => (
          <ListItem
            
            key={index}
            onClick={() => onSelectItem(title, index, subItem.path)}
            sx={{
              pl: 3.2,
              background:
                selectedItem.key === title && selectedItem.subKey === index
                  ? 'linear-gradient(to left, rgba(120, 123, 255, 0.9), rgba(120, 123, 255, 0.3))'
                  : 'transparent',
              '&:hover': { background: 'linear-gradient(to left, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))' },
              transition: 'background 0.3s ease',margin: '3px 0px',
        
              borderBottomRightRadius: '20px',
              borderTopRightRadius: '20px',
              cursor: 'pointer',
            }}

          >
            <ListItemIcon sx={{ minWidth: 36, '& svg': { fontSize: '14px' } }}>
              {subItem.icon}
            </ListItemIcon>
            <Box
              sx={{
                transform: !isMini ? 'translateX(0)' : 'translateX(-5px)',
                transition: 'transform 0.4s ease-in-out, opacity 0.4s ease',
                opacity: !isMini ? 1 : 0,
              }}
            >
              <ListItemText
                primary={subItem.label}
                sx={{
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  cursor: 'pointer',
                }}
              />
            </Box>
          </ListItem>
        ))}
      </List>
    </Collapse>
  </>
);

export default SidebarContent;

