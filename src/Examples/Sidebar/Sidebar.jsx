import React, { memo, useState } from 'react';
import { Drawer, Box, IconButton, useTheme } from '@mui/material';
import SidebarHeader from './SidebarHeader';
import SidebarContent from './SidebarContent';
import SidebarFooter from './SidebarFooter';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../Context/AuthContext';



const Sidebar = ({ isOpen, onToggleMini, toggleSidebar,isSmallScreen  }) => {
  const [isMini, setIsMini] = useState(true); // Sidebar bắt đầu ở trạng thái mini
  const [isHovered, setIsHovered] = useState(false); // Kiểm soát trạng thái hover
  const [selectedItem, setSelectedItem] = useState({ key: 'dashboard', subKey: null });

  const theme = useTheme();

  // Kiểm tra trạng thái mở rộng của Sidebar
  const isExpanded = !isMini || isHovered;

  // Xử lý hover vào và ra
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Chuyển đổi chế độ mini/full
  const toggleMenu = () => {
    setIsMini(prev => !prev);
    onToggleMini(!isMini); // Gửi trạng thái mới về parent
  };

  // Chiều rộng của Drawer khi mini/full
  const drawerWidth = isSmallScreen ? 260 : isExpanded ? 260 : 70;

  // Cấu hình CSS cho Drawer
  const drawerStyles = {
    width: drawerWidth,
    position: 'absolute',
    
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      overflow: 'unset',
      borderRight :  'unset',
      boxShadow: isMini ? isExpanded ? '-10px 0 20px 8px rgba(0, 0, 0, 0.2)' : 'none' : 'none', // Hiệu ứng bóng cho khi cuộn xuống
      transition: 'width 0.4s ease-in-out' , // Hiệu ứng chuyển đổi mượt mà
      pr:'5px',
      backgroundColor: theme.palette.background.sidebar,
      
    },
  };

  // da dang nhap thi moi xuong
  // if (!isAuthenticated) return null;
  const { isAuthenticated } = useAuth();

  // if (!isAuthenticated) return null;
  return (
    <Box sx={{ display: 'flex', overflow: 'hidden', zIndex: 99999}}>
      {/* Sidebar on small screen */}
      {isSmallScreen ? (
        <>
          {/* Icon Menu (Hamburger) khi màn hình nhỏ */}
          <Drawer
            variant="temporary"
            open={isOpen}
            onClose={toggleSidebar}
            sx={{
              width: 260,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: 260,
                boxSizing: 'border-box',
                transition: 'width 0.3s ease-in-out',
                // color: 'black', // Đảm bảo màu chữ luôn là màu đen
              },
            }}
          >
            {/* Sidebar header with close icon */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
              <SidebarHeader toggleMenu={toggleMenu} isMini={false}  isSmallScreen ={isSmallScreen}/>
              <IconButton onClick={toggleSidebar}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Sidebar content */}
            <SidebarContent isMini={false} selectedItem={selectedItem} setSelectedItem={setSelectedItem}/>

            {/* Sidebar footer */}
            <SidebarFooter isMini={false} selectedItem={selectedItem} setSelectedItem={setSelectedItem}/>
          </Drawer>
        </>
      ) : (
        // Sidebar for larger screens
        <Drawer
          variant="permanent"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={drawerStyles}
        >
          {/* Sidebar header */}
          <SidebarHeader toggleMenu={toggleMenu} isMini={!isExpanded} isSmallScreen={isSmallScreen} />

          {/* Sidebar content */}
          <SidebarContent isMini={!isExpanded} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />

          {/* Sidebar footer */}
          <SidebarFooter isMini={!isExpanded} selectedItem={selectedItem} setSelectedItem={setSelectedItem}/>
        </Drawer>
      )}
    </Box>
  );
};

export default memo(Sidebar);
