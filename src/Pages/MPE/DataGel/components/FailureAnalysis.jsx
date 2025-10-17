import React, { useState, useEffect, useMemo } from 'react';
import { LinearProgress, Box, Typography, styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Tạo một styled component để hiển thị giá trị bên trong thanh tiến trình
const ProgressContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
}));

const ProgressText = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  borderRadius: '5px',
  color: '#fff',
  padding: '0 6px',
  transition: 'left 0.6s ease, right 0.6s ease', // Thêm transition cho cả left và right
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: '12px !important',
  borderRadius: '5px',
  backgroundColor: '#ffffff00 !important',
  overflow: 'hidden', // Đảm bảo rằng các góc bo tròn
  '& .MuiLinearProgress-bar': {
    borderRadius: '5px', // Bo tròn thanh tiến trình bên trong
  },
}));


const Legend = ({ labels, colors }) => (
  <Box sx={{ display: 'flex', float: 'right', width: '100%', whiteSpace: 'nowrap', mt: 0.6, mb: 0.3 }}>
    {labels.map((label, index) => (
      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
        <Box sx={{ width: 12, height: 12, background: colors[index], mr: 1, border: '1px solid #fff' }} />
        <Typography sx={{ color: colors[index], pt: '2px' }} variant="body2">
          {label}
        </Typography>
      </Box>
    ))}
  </Box>

);


const HiProgressBar = ({ DataSeries = [], Colors = [], Labels = [], type }) => {
  const theme = useTheme();
  const [current, setCurrent] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5); // Number of visible items
  const [dataForAnalystic, setDataForAnalystic] = useState([]);

  const convertDataSeriesProject = () => {
    const projectStats = {}; // Dùng một object để lưu trữ thống kê theo project

    DataSeries.forEach((item) => {
      const { Project, CL, UCL, LCL } = item; 

      // Đảm bảo project đã tồn tại trong projectStats
      if (!projectStats[Project]) {
        projectStats[Project] = {
          error: 0,
          alarm: 0,
          total: 0, // Tổng số phần tử cho project này
        };
      }
      projectStats[Project].total++;
      const isError = CL < UCL && CL > LCL; 

      if (isError)
        projectStats[Project].alarm++;
      else projectStats[Project].error++;
    });
    // Chuyển đổi object thống kê thành mảng kết quả mong muốn
    const result = Object.keys(projectStats).map((project) => ({
      Project: project,
      name: project,
      error: projectStats[project].error,
      total: projectStats[project].total,
      alarm: projectStats[project].alarm, // alrm = tổng số phần tử có project - error
    }));
    return result;
  };

  const convertDataSeriesMachine = () => { 
    const projectStats = {}; // Dùng một object để lưu trữ thống kê theo project

    DataSeries.forEach((item) => {
      const { Machine, CL, UCL, LCL } = item;

      // Đảm bảo project đã tồn tại trong projectStats
      if (!projectStats[Machine]) {
        projectStats[Machine] = {
          error: 0,
          alarm: 0,
          total: 0, // Tổng số phần tử cho project này
        };
      }
      projectStats[Machine].total++;
      const isError = CL < UCL && CL > LCL; 

      if (isError)
        projectStats[Machine].alarm++;
      else projectStats[Machine].error++;
    });
    // Chuyển đổi object thống kê thành mảng kết quả mong muốn
    const result = Object.keys(projectStats).map((Machine) => ({
      Machine: Machine,
      name: Machine,
      error: projectStats[Machine].error,
      total: projectStats[Machine].total,
      alarm: projectStats[Machine].alarm,
    }));
    return result;
  };

  useEffect(() => {
    if (type == "Machine") {
      const result = convertDataSeriesMachine();
      setDataForAnalystic(result);
    } else {
      const result = convertDataSeriesProject();
      setDataForAnalystic(result);
    }
    if (dataForAnalystic.length < visibleCount) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev >= dataForAnalystic.length - visibleCount ? 0 : prev + 1))
    }, 3600);
    return () => clearInterval(interval);

  }, [DataSeries.length, visibleCount]);

  const displayItems = useMemo(() => {
    if (dataForAnalystic.length <= visibleCount) return dataForAnalystic;

    return dataForAnalystic.slice(current, current + visibleCount)
      .concat(dataForAnalystic.slice(0, Math.max(0, current + visibleCount - dataForAnalystic.length)));
  }, [dataForAnalystic, current, visibleCount])


  // const displayItems = DataSeries.length <= visibleCount
  //   ? DataSeries
  //   : DataSeries.slice(current, current + visibleCount)
  //       .concat(DataSeries.slice(0, Math.max(0, current + visibleCount - DataSeries.length)));

  const maxFrequencyAlarm = DataSeries.length > 0 ? Math.max(...displayItems.map(e => e.alarm), 0) : 1;
  const maxFrequencyError = DataSeries.length > 0 ? Math.max(...displayItems.map(e => e.error), 0) : 1;

  return (
    DataSeries.length > 0 ?
      <>
        <Box sx={{ position: 'relative' }}>
          <Legend labels={Labels} colors={Colors} />
          {displayItems.map((error, index) => (
            <Box
              key={index} // Thêm key cho mỗi Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mt: 0.9,
                mb: 0,
                transition: 'opacity 1s ease-in-out',
                padding: '0px 35px'
              }}
            >
              <Box className='SlideProgress' sx={{ width: '40%', textAlign: 'left', pl: 0.5, }}>
                <Typography sx={{ fontSize: '12px', whiteSpace: 'nowrap', bottom: 0, color: '#ffffff00 !important', marginBottom: '0' }} variant="body2" color="textSecondary" gutterBottom>
                  .
                </Typography>
                <ProgressContainer>
                  <StyledLinearProgress
                    variant="determinate"
                    value={error.error > 0 ? (error.error * 100) / maxFrequencyError : 0}
                    sx={{
                      transform: 'rotateY(180deg)',
                      '& .MuiLinearProgress-bar': { background: Colors[0] },
                    }}
                  />
                  <ProgressText
                    sx={{
                      right: `calc(${error.error > 0 ? (error.error * 100) / maxFrequencyError: 0}% + 1px)`, // Điều chỉnh vị trí giá trị để căn giữa thanh
                      width: 'auto',
                      whiteSpace: 'nowrap',
                      textAlign: 'center',
                      color: theme.palette.primary.conponent,
                      fontSize: '12px',
                    }}
                    variant="body2"
                  >
                    {`${error.error}`}
                  </ProgressText>
                </ProgressContainer>
              </Box>

              <Box className='SlideProgress' sx={{ width: '60%', textAlign: 'left', pl: 0.5 }}>
                <Typography className='headerSlideProgress' sx={{ fontSize: '12px', whiteSpace: 'nowrap', color: theme.palette.primary.conponent, marginBottom: '0' }} variant="body2" color="textSecondary" gutterBottom>
                  {error.name || 'Other'}
                </Typography>
                <ProgressContainer>
                  <StyledLinearProgress
                    variant="determinate"
                    value={error.alarm > 0 ? (error.alarm * 100) / maxFrequencyAlarm: 0}
                    sx={{ '& .MuiLinearProgress-bar': { background: Colors[1] }, }}
                  />
                  <ProgressText
                    sx={{
                      left: `calc(${error.alarm > 0 ? (error.alarm * 100) / maxFrequencyAlarm : 0}% + 1px)`, // Điều chỉnh vị trí giá trị để căn giữa thanh
                      width: 'auto',
                      minWidth: '30px',
                      whiteSpace: 'nowrap',
                      textAlign: 'center',
                      fontSize: '12px',

                      color: theme.palette.primary.conponent
                    }}
                    variant="body2"
                  >
                    {`${error.alarm}`}
                  </ProgressText>
                </ProgressContainer>
              </Box>
            </Box>
          ))}
        </Box>
      </>
      :
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
        <Typography>Null</Typography>
      </Box>
  );
};

export default HiProgressBar;
