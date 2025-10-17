import { createTheme } from '@mui/material/styles';
import { color } from 'highcharts';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      conponent: '#000',// màu chữ Box component
      conponent2: '#fff',// màu chữ Box component
      background: "#f4f5fa",
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      main: '#f4f5fa',
      default: '#f5f5f5',
      paper: '#f4f5fa',
      header: '#f4f5fa67', // Màu nền cho Header
      sidebar: '#f4f5fa', // Màu nền cho Sidebar
      mainContent: '#f4f5fa', // Màu nền cho phần nội dung chính
      conponent: '#fff',// màu nền Box component
      conponent2: '#322d4a',// màu nền Box component


      main2: 'radial-gradient(circle, #fff 0%, #fff 100%)',
      showFile:'#6274af',

    },
    chart:{
      color: '#002d81',
    },
    text:{
      headerText : "#8b00a3",
      showFile:'#000',
    }
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      conponent: '#fff',// màu chữ Box component
      conponent2: '#000',// màu chữ Box component
      background:  "#29243c",

    },
    secondary: {
      main: '#ce93d8',
    },
    background: {
      main: '#29243c',
      default: '#121212',
      paper: '#28243d',
      header: '#28243d67', // Màu nền cho Header
      sidebar: '#28243d', // Màu nền cho Sidebar
      mainContent: '#28243d', // Màu nền cho phần nội dung chính
      conponent: '#322d4a',// màu nền Box component
      conponent2: '#fff',// màu nền Box component


      //main2: '#0a1929 repeating-radial-gradient(#0a1929, #0a1929 2px,transparent 2px, #00a4ff26 100%)'

      showFile:'#44558b',

    },
    chart:{
      color: '#e1e1e1',
    },
    text:{
      headerText : "#00bcd4",
      showFile:'#000',
    }
  },
});





