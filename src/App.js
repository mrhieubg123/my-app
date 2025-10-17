import React, { useState ,useEffect,  useCallback} from 'react';
import { CssBaseline, ThemeProvider,  Box, useMediaQuery, useTheme, Grid   } from '@mui/material';
import { lightTheme, darkTheme } from './Assets/Theme/theme';
import ErrorBoundary from './components/ErrorBoundary';
import { BrowserRouter as Router, } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import { useSelector } from 'react-redux';
import './App.css';
import Sidebar from './Examples/Sidebar/Sidebar';
import Header from './Examples/Header/index';
import ChatBot from './Examples/ChatBot/ChatBot';
import HiShowFilePDF from './components/HiShow/HiShowPDF';
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import imgbg from './Assets/img/background-hfQ0Sry9.png'

// import PageController from './Redux/Actions/pageController';
// import AnimatedRouter from './Examples/AnimatedRouter';
import AppRoutes from './AppRoutes';
import Refresh from './Examples/Refresh/Refresh';
import FullScreem from './Examples/Refresh/fullScreem';

function App() {
  const user = useSelector((state) => state.auth.login.currentUser);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPDFOpen , setShowPDFOpen] = useState(false);
  const [showFilePDFOpen , setShowFilePDFOpen] = useState({showFile: '',fileName: ''});


  const [isMini, setIsMini] = useState(true); // Quản lý trạng thái mini từ Sidebar
  const [isHovered, setIsHovered] = useState(false); // Kiểm soát trạng thái hover
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Trạng thái mở/đóng sidebar
  const [chatBotState, setChatBotState] = useState({isOpen: false, isPin: true});
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  },[]);

  // Hàm nhận trạng thái từ Sidebar
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev); // Thay đổi trạng thái của sidebar khi nhấn MenuIcon
  },[]);

  const handleToggleMini = useCallback((mini) => {
    setIsMini(mini);
  },[]);

  const handleChatBotState = useCallback((newState) => {
    setChatBotState((prev) => ({...prev, ...newState}));
  },[])
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

 // Kiểm tra trạng thái mở rộng của Sidebar
 const isExpanded = !isMini || isHovered;
 // Kiểm tra Theme
  const memoizedTheme = React.useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode])
  
  const handleFileChange = (model)=>{
    setShowFilePDFOpen(prev => ({
      ...prev,
      showFile: model.showFile,
      fileName: model.fileName
  }))
    setShowPDFOpen((prev) => !prev)

  }

  return (
    <ThemeProvider theme={memoizedTheme}>
      <Box sx={{backgroundColor: !isDarkMode ? "#f4f5fa" : "#29243c", padding:0, minHeight:'100vh' }}>
        {/* backgroundImage:`url(${imgbg})` */}
        <CssBaseline />
        <AuthProvider>
          {user && ( 
            <ChatBot
                onFileChange={handleFileChange}
                isOpen={chatBotState.isOpen}
                isPin={chatBotState.isPin}
                onStateChange={handleChatBotState}
            />
          )}
          {user && ( 
            <Refresh/>
          )}
        
          <Router>
            {user && ( 
              <Header 
                isMini={!isExpanded} 
                isSmallScreen = {isSmallScreen}  
                toggleSidebar={toggleSidebar}
                toggleTheme={toggleTheme} // Truyền hàm toggleTheme xuống Header
                isDarkMode={isDarkMode} // Truyền trạng thái hiện tại
              />
            )}
            <Box sx={{ display: 'flex'}} >
              {/* Sidebar */}
              {user && ( 
                <Sidebar 
                  onToggleMini={handleToggleMini} 
                  isSmallScreen = {isSmallScreen} 
                  isOpen={isSidebarOpen}  
                  toggleSidebar={toggleSidebar}
                />
              )}
             {/* Main Content */}
              <Box 
                sx={{
                  flexGrow: 1,
                  padding: user ? 1 : 0,
                  transition: 'all 0.3s ease', // Hiệu ứng khi Sidebar mở rộng/thu nhỏ
                  marginLeft: user ? !isSmallScreen ? isMini ? '70px' : '260px' : '0px' : null, // Chỉ thay đổi layout khi isMini thay đổi
                  marginRight: chatBotState.isOpen ? chatBotState.isPin ? '360px' : '' : null, // Chỉ thay đổi layout khi isMini thay đổi
                  color: isDarkMode ? '#fff' : '#000',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': { width: 0, opacity: 0 },
                  '&:hover::-webkit-scrollbar': { width: 4, opacity: 1 },
                  '&::-webkit-scrollbar-thumb': { backgroundColor: '#cdcdcd8c', borderRadius: '10px' }
                }}
              >
                <HiShowFilePDF whereMove='right' open={showPDFOpen} onClose={()=> setShowPDFOpen(false)}  showFile = {showFilePDFOpen.showFile} fileName= {showFilePDFOpen.fileName} />
               
                  <AppRoutes user={user} />
            
              </Box>
            </Box>
          </Router>
        </AuthProvider>
      </Box>
    </ThemeProvider>
  );
}

export default App;
