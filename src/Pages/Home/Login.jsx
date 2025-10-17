import { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../Redux/apiRequest';
import background from '../../Assets/img/experience-img2.jpg';
import background2 from '../../Assets/img/unnamed.png';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const newUser = { username, password };
    loginUser(newUser, dispatch, navigate);
  };

  return (
    <Grid container sx={{ height: '100vh', width: '100%', 
      backgroundImage: `url(${background2})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      
      }}>
      {/* Left Section */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundImage: `url(${background})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        
          backgroundPosition: 'center',
          // backgroundColor: '#2b2b63',
          padding: '24px',
        }}
      >
        <Typography variant="h4" color="white" sx={{ marginBottom: 2 }}>
          Welcome to Web by Harmony! 👋
        </Typography>
        <Typography variant="body1" color="#bdbdbd" sx={{ marginBottom: 4 }}>
          Please sign in to your account and start the adventure.
        </Typography>
      </Grid>

      {/* Right Section */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: '#1d1b41',
        }}
      >
        <Box
          sx={{
            width: { xs: '90%', sm: '400px' },
            padding: '24px',
            borderRadius: '8px',
            backgroundColor: '#2f2c56',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            label="User"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputLabelProps={{ style: { color: '#bdbdbd' } }}
            sx={{
              marginBottom: '16px',
              '& .MuiOutlinedInput-root': { backgroundColor: '#4b4970', color: 'white' },
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ style: { color: '#bdbdbd' } }}
            sx={{
              marginBottom: '16px',
              '& .MuiOutlinedInput-root': { backgroundColor: '#4b4970', color: 'white' },
            }}
          />
          <FormControlLabel
            control={<Checkbox defaultChecked sx={{ color: '#bdbdbd' }} />}
            label="Remember me"
            sx={{ color: '#bdbdbd', marginBottom: '16px' }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx={{
              backgroundColor: '#7367f0',
              '&:hover': { backgroundColor: '#5b52d1', transform: 'scale(1.05)' },
              color: 'white',
              padding: '10px',
              fontWeight: 'bold',
              marginBottom: '16px',
              transition: 'transform 0.2s',
            }}
          >
            Log In
          </Button>
          <Typography align="center" color="#bdbdbd">
            New on our platform?{' '}
            <a href="/Home/register" style={{ color: '#7367f0', textDecoration: 'none' }}>
              Create an account
            </a>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
