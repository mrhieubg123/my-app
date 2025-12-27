import React, { memo, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Routes, Route,Navigate, useNavigate} from 'react-router-dom';
import Login from './Pages/Home/Login'; // Trang Home
import Register from './Pages/Home/Register'; // Trang Register
import UserList from './Pages/Home/UserList'; // Trang Register
import Home from './Pages/Home/DashBoard'; // Trang Home
// import SMTMachine from './Pages/SMT/MachineStatus'; //Machine Status
// import StencilControl from './Pages/KITTING/StencilControl/StencilControl'; // Trang Contact
// import PrinterMachine from './Pages/SMT/PrinterMachine/PrinterMachine'; // Trang About
// import AoiMachine from './Pages/SMT/AOIMachine/AoiMachine'; // Trang About
// import AoiSpiMachine from './Pages/SMT/AOI&SPIMachine'; // Trang About
// import ReflowMachine from './Pages/SMT/ReflowMachine/ReflowMachine'; // Trang About
import YieldRateTracking from './Pages/PE/YieldRate';
// import DailyReport from  './Pages/DailyReport/Report/index'
import ESDControl from './Pages/MPE/ESDControl';
// import SolderPasteAndGlue from './Pages/KITTING/SolderPasteAndGlue';
// import Squeegee from './Pages/KITTING/Squeegee/SqueegeeControl';
// import AOITraceability from './Pages/SMT/AOITraceability';
// import XRAYMachine from './Pages/SMT/XRAY';
import FeederControl from './Pages/ME/Feeder';
import CompareFiles from './Pages/ME/CompareFiles';


import MOControl from './Pages/PRODUCTION/MoControl';
import MaterialReturn from './Pages/Kitting/MaterialReturn';
// import PCBLaser from './Pages/KITTING/PCBLaser';
// import MaterialReuse from './Pages/KITTING/MaterialReuse';

// import MounterPickup from './Pages/SMT/MounterPickup';

import WipStatus from './Pages/PRODUCTION/WipStatus';
import SMTYieldRate from './Pages/PRODUCTION/SMTYR';
// import LCRReport from './Pages/DailyReport/LCRReport';

import SpareParts from './Pages/MPE/SpareParts';

import FileExplorer from './Pages/UploadFile/FileExplorer';
import ErrorPage from './Pages/ErrorPage';

import FatpMachineControl from './Pages/FATP/MachineFatpStatus';
import GlueScrewStatus from './Pages/FATP/GlueScrew';
import VCutMachineStatus from './Pages/FATP/VCutMachineStatus';
import MaintenanceStatus from './Pages/FATP/Maintenance';

import DataGelScreen from './Pages/MPE/DataGel';
import Temperature from './Pages/ME/Temperature';
import VoltageMonitorDashboard from './Pages/FATP/VoltageMonitor';
import StencilRoomDashboard from './Pages/FATP/StencilRoom';
import ProjectManagement from './Pages/FATP/ProjectManagement';
import MetDocument from './Pages/FATP/Documment';
// import DryingControlScreen from './Pages/KITTING/Drying';


const AppRoutes = ({user}) => {
  const paramState = useSelector(state => state.param);
  const navigate = useNavigate();
  
  useEffect(() => {
    if(paramState.page.dep && paramState.page.page_name){
      navigate(`/${paramState.page.dep}/${paramState.page.page_name}`);
    }
    
  },[paramState.page.dep, paramState.page.page_name, navigate])


    const PrivateRoute = ({ children, isAuthenticated, isAdmin }) => {  
        if (!user) {
          return <Navigate to="/Home/Login" />; // Nếu không có currentUser thì chuyển đến trang đăng nhập
        }
        return children; // Nếu có currentUser, trả về children (các trang đã bảo vệ)
      };
    return (
        <Routes >
              <Route path="/Home/Login" element={<Login />} />
              <Route path="/Home/Register" element={<Register />} />
              {user?.admin ?  <Route path='/Home/UserList' element={<PrivateRoute><UserList /></PrivateRoute>} /> : ''}
              <Route path="/Home/DashBoard" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
              {/* <Route path="/SMT/SMTMachine" element={<PrivateRoute><SMTMachine /></PrivateRoute>} />
              <Route path="/Kitting/StencilControl" element={<PrivateRoute><StencilControl /></PrivateRoute>} />
              <Route path="/SMT/PrinterMachine" element={<PrivateRoute><PrinterMachine /></PrivateRoute>} />
              <Route path="/SMT/AoiMachine" element={<PrivateRoute><AoiMachine /></PrivateRoute>} />
              <Route path="/SMT/AoiSpiMachine" element={<PrivateRoute><AoiSpiMachine /></PrivateRoute>} />
              <Route path="/SMT/MounterPickup" element={<PrivateRoute><MounterPickup /></PrivateRoute>} />
              <Route path='/SMT/AOITraceability' element={<PrivateRoute><AOITraceability/></PrivateRoute>} />
              <Route path="/SMT/XRAYMachine" element={<PrivateRoute><XRAYMachine /></PrivateRoute>} />
              <Route path="/SMT/ReflowMachine" element={<PrivateRoute><ReflowMachine /></PrivateRoute>} /> */}
              <Route path="/Kitting/MaterialReturn" element={<PrivateRoute><MaterialReturn/></PrivateRoute>} />
              <Route path="/PE/YieldRateControl" element={<PrivateRoute><YieldRateTracking /></PrivateRoute>} />
              <Route path="/MPE/ESDControl" element={<PrivateRoute><ESDControl /></PrivateRoute>} />
              <Route path="/MPE/SpareParts" element={<PrivateRoute><SpareParts /></PrivateRoute>} />
              <Route path='/MPE/DataGelScreen' element={<PrivateRoute><DataGelScreen /></PrivateRoute>} />


              {/* <Route path='/Kitting/SolderPasteAndGlue' element={<PrivateRoute><SolderPasteAndGlue /></PrivateRoute>} />
              <Route path='/Kitting/SqueegeeHolders' element={<PrivateRoute><Squeegee /></PrivateRoute>} />
              <Route path='/Kitting/PCBLaser' element={<PrivateRoute><PCBLaser /></PrivateRoute>} />
              <Route path='/Kitting/MaterialReuse' element={<PrivateRoute><MaterialReuse /></PrivateRoute>} />
              <Route path='/Kitting/DryingControl' element={<PrivateRoute><DryingControlScreen /></PrivateRoute>} />


              <Route path='/DailyReport/Report' element={<PrivateRoute><DailyReport/></PrivateRoute>} />
              <Route path='/DailyReport/LCRReport' element={<PrivateRoute><LCRReport/></PrivateRoute>} /> */}
              <Route path='/ME/FeederControl' element={<PrivateRoute><FeederControl/></PrivateRoute>} />
              <Route path='/ME/CompareFiles' element={<PrivateRoute><CompareFiles/></PrivateRoute>} />
              <Route path='/ME/Temperature' element={<PrivateRoute><Temperature/></PrivateRoute>} />


              <Route path='/Production/MOControl' element={<PrivateRoute><MOControl/></PrivateRoute>} />
              <Route path='/Production/WipStatus' element={<PrivateRoute><WipStatus/></PrivateRoute>} />
              <Route path='/Production/SMTYieldRate' element={<PrivateRoute><SMTYieldRate/></PrivateRoute>} />

              <Route path='/UploadFile/FileExplorer' element={<PrivateRoute><FileExplorer/></PrivateRoute>} />

              <Route path='/FATP/FATPMachineControl' element={<PrivateRoute><FatpMachineControl/></PrivateRoute>} />
              <Route path='/FATP/GlueScrewStatus' element={<PrivateRoute><GlueScrewStatus/></PrivateRoute>} />
              <Route path='/FATP/VCutMachineStatus' element={<PrivateRoute><VCutMachineStatus/></PrivateRoute>} />
              <Route path='/FATP/MaintenanceStatus' element={<PrivateRoute><MaintenanceStatus/></PrivateRoute>} />
              <Route path='/FATP/VoltageMonitor' element={<PrivateRoute><VoltageMonitorDashboard/></PrivateRoute>} />
              <Route path='/FATP/StencilRoom' element={<PrivateRoute><StencilRoomDashboard/></PrivateRoute>} />
              <Route path='/FATP/ProjectManagement' element={<PrivateRoute><ProjectManagement/></PrivateRoute>} />
              <Route path='/FATP/MetDocument' element={<PrivateRoute><MetDocument/></PrivateRoute>} />
              
              
              <Route path='/ErrorPage' element={<ErrorPage/>}/>
            </Routes>
    )
}

export default memo(AppRoutes);
