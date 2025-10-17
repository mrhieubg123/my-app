
import { Box, Grid, CssBaseline, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemText, Container, Paper, Grid2 } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import HiBox from '../../components/HiBox';
import React from "react";
import MyCalendar from "./components/CustomCalendar";
import HiTabs from "../../components/HiShow/HiTabs";
import HiSlideShow from "../../components/HiSlideShowImage";

const chartOptions = {
  title: { text: "Thống kê sản xuất" },
  series: [{
    name: "Sản lượng",
    data: [10, 20, 30, 40, 50],
  }],
  credit:{
    text: ''
  }
};

const Home = () => {
  const [displayWeekNumber, setDisplayWeekNumber] = React.useState(false)

  return (
    <Box sx={{width: '100%'}}>
      <HiSlideShow></HiSlideShow>
    </Box>
    
    // <Grid  container columns={12} >
    //   {/* Main Content */}
    //     <HiBox lg={4} md={4} xs={4} alarn={true} header="Report"  height="35vh" variant="filled">

    //     </HiBox>
    //     <HiBox lg={5} md={5} xs={5} height="35vh" variant="filled">
    //           <Paper sx={{ p: 2 }}>
    //             <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    //           </Paper>
    //     </HiBox>
    //     <Box lg={3} md={3} xs={3} variant="filled" 
    //         sx={{ display: 'flex',
    //         flexDirection: 'column',
    //         justifyContent: "center",
    //         alignContent: 'center',
    //         margin: 'auto auto',
    //       }}
    //     >
    //       <MyCalendar></MyCalendar>
    //     </Box>
    //     <HiBox lg={12} md={12} xs={12} alarn={false} header="Time Line"  height="34vh" variant="filled">

    //     </HiBox>
    //     <HiTabs>
          
    //     </HiTabs>
        
     
    // </Grid>
  );
};

export default Home;

