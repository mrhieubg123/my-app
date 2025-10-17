import React from "react";
import {useNavigate} from 'react-router-dom';
import { Box, Button, Typography } from "@mui/material";


const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            
        }}>
            <Typography variant="h3" gutterBottom color="error">Đã xảy ra lỗi !</Typography>
            <Typography variant="body1" mb={4}>Có gì đó không đúng. Vui lòng quay lại trang chủ.</Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/')}>Về trang chủ</Button>
        </Box>
    )
}

export default ErrorPage;
