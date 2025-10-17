import React, {useState,useEffect ,useContext } from 'react';
import { Slide, Box, List, ListItem, ListItemText, Switch, Typography, Divider,useMediaQuery, IconButton,useTheme } from '@mui/material';
import { LightMode, DarkMode, Close as CloseIcon } from '@mui/icons-material';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';
// import { ThemeContext } from './ThemeContext';


const Settings = ({ open, onClose, onToggleTheme,isDarkMode, onToggleMenu, onChangeLang  }) => {
//   const { darkMode, toggleTheme , marginEnabled, toggleMargin } = useContext(ThemeContext);

  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleChangeLang = (imodel) =>{
    onChangeLang?.(imodel);
  }

  const handleChangeScreen = () =>{
    if (!document.fullscreenElement) {
      // Nếu hiện tại không ở chế độ toàn màn hình, yêu cầu vào chế độ toàn màn hình
      document.documentElement.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
        // Nếu đang ở chế độ toàn màn hình, thoát khỏi chế độ toàn màn hình
        document.exitFullscreen();
    }
  }


  return (
    <Slide direction="down" in={open} mountOnEnter unmountOnExit>
      <Box
        sx={{
          width: 300,
          position: 'absolute',
          top: 85,
          right: 90,
          height: 'auto',
          backgroundColor: theme.palette.background.main,
          boxShadow: 4,
          borderRadius: '8px',
          padding: '1rem',
          overflowY: 'auto',
          maxHeight: '80vh',
          zIndex: 9999,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 , color: theme.palette.primary.conponent }}>
            {t('Settings')}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List>
          <ListItem>
            <ListItemText primary={ isDarkMode ? t('Dark Mode'):t('Light Mode') }  sx={{color:  theme.palette.primary.conponent}}/>
            <Switch
              checked={isDarkMode}
              onChange={onToggleTheme} // Truyền hàm toggleTheme xuống Header
              // onChange={toggleTheme}
              inputProps={{ 'aria-label': 'controlled' }}
              icon={<LightMode sx={{ fontSize: '1.25rem', backgroundColor: '#f2bf34', padding:'0.2rem', borderRadius: '1rem', color: '#fff' }} />}
              checkedIcon={<DarkMode sx={{ fontSize: '1.25rem', backgroundColor: '#29b7f4',padding:'0.2rem',borderRadius: '1rem', color: '#fff' }} />}
            />
          </ListItem>
          {/* <ListItem>
            <ListItemText primary={t('Enable Margin')} sx={{ color: theme.palette.primary.conponent }} />
            <Switch
            //   checked={marginEnabled}
            onChange={onToggleMenu}
            inputProps={{ 'aria-label': 'controlled' }}
            />
          </ListItem> */}

          <ListItem>
            <ListItemText primary={t('Language')} sx={{color: theme.palette.primary.conponent}} />
            <LanguageSelector onChangeLang={handleChangeLang}/>
          </ListItem>
          <ListItem>
            <ListItemText primary={t('Full screen')} sx={{ color: theme.palette.primary.conponent }} />
            <Switch
            //   checked={marginEnabled}
            onChange={handleChangeScreen}
            inputProps={{ 'aria-label': 'controlled' }}
            />
          </ListItem>
        </List>
      </Box>
    </Slide>
  );
};

export default Settings;
