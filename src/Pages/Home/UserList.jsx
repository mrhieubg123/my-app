import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { getAllUsers, deleteUser } from '../../Redux/apiRequest';
import { useSelector, useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginSuccess } from '../../Redux/authSlice';
import { createAxios } from '../../createInstance';

const UserList = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userList = useSelector((state) => state.users.users?.allUsers);
  const msg = useSelector((state) => state.users?.msg);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Fetch dữ liệu người dùng
  let axiosJWT = createAxios(user, dispatch, loginSuccess );

  useEffect(() => {
    // Kiểm tra xem người d�ng đã đăng nhập chưa
    if (user?.accessToken) {
      getAllUsers(user?.accessToken,dispatch, axiosJWT);
    
    }
  }, []);
  
  const handleDelete = async (id) => {
    try {
      await deleteUser(user?.accessToken, dispatch, id, axiosJWT);
      // Sau khi xóa thành công, tải lại danh sách người dùng
      getAllUsers(user?.accessToken, dispatch, axiosJWT);
    } catch (err) {
      console.error('Xóa người dùng thất bại:', err);
    }
  };
  

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Management {user?.admin ? '(Admin)' : '(User)'}
      </Typography>
      <div className="err">{msg}</div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userList?.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user._id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" sx={{ mr: 1 }}>
                    Edit
                  </Button>
                  <Button onClick={()=> handleDelete(user._id)} variant="outlined" color="error">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserList;
