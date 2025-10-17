import axios from "axios";
import { loginStart,loginSuccess,loginFailure, registerStart, registerSuccess, registerFailure , logOutStart, logOutFailure, logOutSuccess  } from "./authSlice";
import { getUserStart, getUserSuccess, getUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess} from "./userSlice";
import { getAuthorizedAxiosIntance } from '../utils/axiosConfig';

const axiosInstance = await getAuthorizedAxiosIntance();

// http://localhost:5000
const API_BASE_URL = '';

export const loginUser = async (user, dispatch, navigate) =>{
    dispatch(loginStart());
    dispatch(loginSuccess({"payload":"admin"}));
    navigate("/");
    return;
    try{
        const res = await axios.post(`${API_BASE_URL}/api/v1/auth/login`,user
        );
        dispatch(loginSuccess(res.data));
        navigate("/");
    }
    catch(err){
        dispatch(loginFailure());
    }
}

export const registerUser = async (user, dispatch, navigate) =>{
    dispatch(registerStart());
    try{
        await axios.post(`${API_BASE_URL}/api/v1/auth/register`, user);
        dispatch(registerSuccess());
        navigate("/Home/login");
    }
    catch(err){
        dispatch(registerFailure());
    }
}

export const getAllUsers = async (accessToken,dispatch, axiosJWT) =>{
    dispatch(getUserStart());
    try{
        const res = await axiosJWT.get(`${API_BASE_URL}/api/v1/user`, {
            headers: {token: `Bearer ${accessToken}`},
        });
        dispatch(getUserSuccess(res.data));
    }
    catch(err){
        dispatch(getUserFailure());
    }
}

export const deleteUser = async (accessToken, dispatch, id, axiosJWT ) => {
    dispatch(deleteUserStart());
    try{
        const res = await axiosJWT.delete(`${API_BASE_URL}/api/v1/user/` + id, {
            headers: {token: `Bearer ${accessToken}`},
        });
        dispatch(deleteUserSuccess(res.data));
    }
    catch(err){
        dispatch(deleteUserFailure(err.response.data));
    }

}

export const logoutUser = async (dispatch, id, navigate, accessToken, axiosJWT) =>{
    dispatch(logOutStart());
    try{
        await axios.post(`${API_BASE_URL}/api/v1/auth/logout`,id , {
            headers: {token: `Bearer ${accessToken}`},
        });
        dispatch(logOutSuccess());
        navigate("/Home/login");
    }
    catch(err){
        dispatch(loginFailure());
    }
}