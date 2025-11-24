import React, { useState, useEffect, useMemo} from 'react';
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
    <Box sx={{display:'flex', float:'right', width:'100%', whiteSpace:'nowrap' ,mt: 0.6, mb:0.3}}>
        {labels.map((label, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Box sx={{ width: 12, height: 12, background: colors[index], mr: 1 , border: '1px solid #fff'  }} />
            <Typography sx={{ color: colors[index], pt: '2px' }} variant="body2">
                {label}
            </Typography>
            </Box>
        ))}
    </Box>
    
  );


const HiProgressBar = ({ DataSeries = [], Colors =[], Labels=[]}) => {
  const theme = useTheme();
  const [current, setCurrent] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5); // Number of visible items


  useEffect(() => {
    if (DataSeries.length < visibleCount) return ;
    const interval = setInterval(() => {
      setCurrent(prev => (prev >= DataSeries.length - visibleCount ? 0 : prev + 1))
    }, 3600);
    return () => clearInterval(interval);
    
  }, [DataSeries.length, visibleCount]);

  const displayItems = useMemo(() => {
    if(DataSeries.length <= visibleCount) return DataSeries;

    return DataSeries.slice(current, current+visibleCount)
    .concat(DataSeries.slice(0,Math.max(0,current+ visibleCount - DataSeries.length)));
  },[DataSeries, current, visibleCount])


    // const displayItems = DataSeries.length <= visibleCount
    //   ? DataSeries
    //   : DataSeries.slice(current, current + visibleCount)
    //       .concat(DataSeries.slice(0, Math.max(0, current + visibleCount - DataSeries.length)));

  const maxFrequency =DataSeries.length > 0 ? Math.max(...displayItems.map(e => e.Frequency), 0) : 1;
  const maxDowntime = DataSeries.length > 0 ? Math.max(...displayItems.map(e => e.Downtime), 0) : 1;

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
            {/* <Box className='SlideProgress' sx={{ width: '40%', textAlign: 'left', pl: 0.5, }}>
              <Typography sx={{  fontSize: '12px', whiteSpace: 'nowrap',bottom:0, color: '#ffffff00 !important', marginBottom: '0' }} variant="body2" color="textSecondary" gutterBottom>
                .
              </Typography>
              <ProgressContainer>
                <StyledLinearProgress
                  variant="determinate"
                  value={error.Frequency > 0 ? (error.Frequency * 100) / maxFrequency : 0}
                  sx={{ 
                    transform: 'rotateY(180deg)',
                    '& .MuiLinearProgress-bar': { background: Colors[0] },
                }}
                />
                <ProgressText
                  sx={{
                    right: `calc(${error.Frequency > 0 ? (error.Frequency * 100) / maxFrequency : 0}% + 1px)`, // Điều chỉnh vị trí giá trị để căn giữa thanh
                    width: 'auto',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                    color:theme.palette.primary.conponent,
                    fontSize: '12px',
                  }}
                  variant="body2"
                >
                  {`${error.Frequency}`}
                </ProgressText>
              </ProgressContainer>
            </Box> */}

            <Box className='SlideProgress' sx={{ width: '60%', textAlign: 'left', pl: 0.5 }}>
              <Typography className='headerSlideProgress' sx={{ fontSize: '12px', whiteSpace: 'nowrap', color: theme.palette.primary.conponent, marginBottom: '0' }} variant="body2" color="textSecondary" gutterBottom>
                {error.Series||'Other'}
              </Typography>
              <ProgressContainer>
                <StyledLinearProgress
                  variant="determinate"
                  value={error.Downtime > 0 ? (error.Downtime * 100) / maxDowntime : 0}
                  sx={{'& .MuiLinearProgress-bar': { background: Colors[1] },}}
                />
                <ProgressText
                  sx={{
                    left: `calc(${error.Downtime > 0 ? (error.Downtime * 100) / maxDowntime : 0}% + 1px)`, // Điều chỉnh vị trí giá trị để căn giữa thanh
                    width: 'auto',
                    minWidth: '30px',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                    fontSize: '12px',
                    
                    color:theme.palette.primary.conponent
                  }}
                  variant="body2"
                >
                  {(error.Downtime*1).toFixed(2)}
                </ProgressText>
              </ProgressContainer>
            </Box>
          </Box>
        ))}
      </Box>
    </>
    :
    <Box sx={{width:'100%', height: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
        <Typography>Null</Typography>
    </Box> 
  );
};

export default HiProgressBar;
