// src/components/LanguageSelector.js
import React from 'react';
import { Select, MenuItem } from '@mui/material';
import '../../../Assets/lang/index';
import { useTranslation } from 'react-i18next';

const LanguageSelector = ({onChangeLang}) => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
    onChangeLang?.(event.target.value)
  };

  return (
    <Select
      value={i18n.language}
      onChange={handleLanguageChange}
      sx={{height:'35px' ,width: '120px',}}
      MenuProps={{
        disableScrollLock: true,
      }}
    >
      <MenuItem value="en">English</MenuItem>
      <MenuItem value="vi">Tiếng Việt</MenuItem>
      {/* <MenuItem value="cn"></MenuItem> */}

    </Select>
  );
};

export default LanguageSelector;
