// SidebarFooter.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Box } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import { useSelector ,useDispatch} from 'react-redux';
import { createAxios } from '../../createInstance';
import { logOutSuccess } from '../../Redux/authSlice';
import {logoutUser} from '../../Redux/apiRequest'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import RecentActorsOutlinedIcon from '@mui/icons-material/RecentActorsOutlined';
import { setParam, resetParam } from '../../Redux/Actions/paramSlice';
import { DriveFolderUploadOutlined } from '@mui/icons-material';

const SidebarFooter = ({ isMini, selectedItem, setSelectedItem}) => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;
  const id = user?._id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user, dispatch, logOutSuccess);
  
  const handleSelectItem = (menuKey, subKey = null, path = null) => {
    setSelectedItem({ key: menuKey, subKey });
    if(path) navigate(path);

    // dispatch(resetParam());
    dispatch(setParam({
      page:{
        dep: path.split('/')[1],
        page_name: path.split('/')[2],
      },
     
    }))
    
  };


  const handleLogout = () => {
  //   // Xử l� logout
  //   // Ví dụ: Gọi API logout hoặc xóa token từ localStorage
  //   // ...
  dispatch(resetParam());
  logoutUser(dispatch,id, navigate,accessToken, axiosJWT);
  //   navigate('/Home/Login');
  };


  return (
    <List>
      <ListSubheader>User</ListSubheader>
     
     {/* //uploadfile */}
     <ListItem 
        onClick={() => handleSelectItem('UploadFile', null, '/UploadFile/FileExplorer')}
        sx={{
          background: selectedItem.key === 'UploadFile' ? 'linear-gradient(to left, rgba(120, 123, 255, 0.9), rgba(120, 123, 255, 0.3))' : 'transparent',
          '&:hover': { background: 'linear-gradient(to left, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))' },
          transition: 'background 0.3s ease', margin: '3px 0px',
          borderBottomRightRadius: '20px',
          borderTopRightRadius: '20px',
          cursor: 'pointer',
        }}
      >
        <ListItemIcon sx={{minWidth:36 }}><DriveFolderUploadOutlined /></ListItemIcon>
        <Box 
          sx={{
              transform: !isMini ? 'translateX(0)' : 'translateX(-5px)',
              transition: 'transform 0.4s ease-in-out, opacity 0.4s ease',
              opacity: !isMini ? 1 : 0,
            }}
          >
          <ListItemText primary="Upload File"  sx={{margin:0, whiteSpace:'nowrap'}}/>
        </Box>
      </ListItem>

        {/* //uploadfile */}

      <ListItem 
        onClick={() => handleSelectItem('Setting', null, '/Home/Login')}
        sx={{
          background: selectedItem.key === 'Setting' ? 'linear-gradient(to left, rgba(120, 123, 255, 0.9), rgba(120, 123, 255, 0.3))' : 'transparent',
          '&:hover': { background: 'linear-gradient(to left, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))' },
          transition: 'background 0.3s ease', margin: '3px 0px',
          borderBottomRightRadius: '20px',
          borderTopRightRadius: '20px',
          cursor: 'pointer',
        }}
      >
        


        <ListItemIcon sx={{minWidth:36 }}><ManageAccountsOutlinedIcon /></ListItemIcon>
        <Box 
          sx={{
              transform: !isMini ? 'translateX(0)' : 'translateX(-5px)',
              transition: 'transform 0.4s ease-in-out, opacity 0.4s ease',
              opacity: !isMini ? 1 : 0,
            }}
          >
          <ListItemText primary="Settings"  sx={{margin:0}}/>
        </Box>
      </ListItem>
      {user?.admin ? <ListItem 
        onClick={() => handleSelectItem('UserList', null, '/Home/UserList')}
        sx={{
          background: selectedItem.key === 'UserList' ? 'linear-gradient(to left, rgba(120, 123, 255, 0.9), rgba(120, 123, 255, 0.3))' : 'transparent',
          '&:hover': { background: 'linear-gradient(to left, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))' },
          transition: 'background 0.3s ease', margin: '3px 0px',
          borderBottomRightRadius: '20px',
          borderTopRightRadius: '20px',
          cursor: 'pointer',
        }}
      >
        <ListItemIcon sx={{minWidth:36 }}><RecentActorsOutlinedIcon /></ListItemIcon>
        <Box 
          sx={{
              transform: !isMini ? 'translateX(0)' : 'translateX(-5px)',
              transition: 'transform 0.4s ease-in-out, opacity 0.4s ease',
              opacity: !isMini ? 1 : 0,
            }}
          >
          <ListItemText primary="UserLists"  sx={{margin:0}}/>
        </Box>
      </ListItem> : ''}
      
      <ListItem 
        onClick={handleLogout}
        sx={{
          background: selectedItem.key === 'Logout' ? 'linear-gradient(to left, rgba(120, 123, 255, 0.9), rgba(120, 123, 255, 0.3))' : 'transparent',
          '&:hover': { background: 'linear-gradient(to left, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))' },
          transition: 'background 0.3s ease', margin: '3px 0px',
          borderBottomRightRadius: '20px',
          borderTopRightRadius: '20px',
          cursor: 'pointer',
        }}
      >
        <ListItemIcon sx={{minWidth:36 }}><LogoutOutlinedIcon /></ListItemIcon>
        <Box 
          sx={{
              transform: !isMini ? 'translateX(0)' : 'translateX(-5px)',
              transition: 'transform 0.4s ease-in-out, opacity 0.4s ease',
              opacity: !isMini ? 1 : 0,
            }}
          >
          <ListItemText primary="Logout"  sx={{margin:0}}/>
        </Box>
      </ListItem>
    </List>
  );
};

export default SidebarFooter;
