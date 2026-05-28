import React, { useState } from 'react';
import { Box, ToggleButtonGroup, ToggleButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setParam } from '../../Redux/Actions/paramSlice';
import { checkPageSupport } from '../../utils/pageFactoryConfig';

const FactorySelect = () => {
    const paramFactoryState = useSelector((state) => state.param.params.Factory);
    const paramPageState = useSelector((state) => state.param.page);
    const dispatch = useDispatch();

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const handleFactoryChange = (event, newFactory) => {
        if (newFactory !== null) {
            const dep = paramPageState?.dep;
            const pageName = paramPageState?.page_name;
            if (dep && pageName && !checkPageSupport(dep, pageName, newFactory)) {
                setAlertMessage(`Trang này chưa được xây dựng cho nhà máy ${newFactory}!`);
                setAlertOpen(true);
                return;
            }
            dispatch(setParam({ params: { Factory: newFactory } }));
        }
    };

    return (
        <Box sx={{
            position: 'fixed',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1001,
            opacity: 0.3,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                opacity: 1,
                transform: 'translateX(-50%) translateY(-5px) scale(1.02)'
            }
        }}>
            <ToggleButtonGroup
                value={paramFactoryState}
                exclusive
                onChange={handleFactoryChange}
                aria-label="Factory Selection"
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '20px',
                    p: 0.8,
                    boxShadow: '0 10px 40px 0 rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    '& .MuiToggleButton-root': {
                        color: '#94a3b8',
                        border: 'none',
                        borderRadius: '16px !important',
                        px: 4,
                        py: 1.2,
                        mx: 0.5,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '1rem',
                        letterSpacing: '0.5px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: '#fff',
                        },
                        '&.Mui-selected': {
                            backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                            color: '#fff',
                            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.5)',
                            '&:hover': {
                                backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                            }
                        }
                    }
                }}
            >
                <ToggleButton value="A02">Factory A02</ToggleButton>
                <ToggleButton value="BN3">Factory BN3</ToggleButton>
                <ToggleButton value="B06">Factory B06</ToggleButton>
            </ToggleButtonGroup>

            <Dialog
                open={alertOpen}
                onClose={() => setAlertOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '15px',
                        padding: '10px',
                        backdropFilter: 'blur(5px)',
                        backgroundColor: 'rgba(30, 30, 40, 0.9)',
                        color: '#fff',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 'bold', color: '#ff4d4d' }}>Thông Báo</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: '#e2e8f0' }}>
                        {alertMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAlertOpen(false)} sx={{ color: '#3b82f6', fontWeight: 'bold' }}>
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FactorySelect;
