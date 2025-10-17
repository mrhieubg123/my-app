import React from "react";
import { AppBar, Toolbar, Typography, IconButton, InputBase, Box ,Button} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import HiWarningLight from '../HiWarningLight'


const HiHeader = ({
    children,
    alarnHeader = false,
}) => {
    const theme = useTheme();


    return(
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            marginLeft: 1,
            color: theme.palette.primary.conponent,
          }}
        >
          <Typography variant="h6" sx={{fontWeight: '800'}}>{children} {alarnHeader ? <HiWarningLight></HiWarningLight> : ''} </Typography>
        </Box>
    )
}

export default HiHeader;