import axios from 'axios';
import { toast } from 'react-toastify';

let authorizedAxiosIntance = null;



export async function getAuthorizedAxiosIntance(){
    
    if(authorizedAxiosIntance) return authorizedAxiosIntance;

    // load config.json

    const res = await fetch('/config.json');
    const configJson = await res.json();

    // tao axios intance
    authorizedAxiosIntance = axios.create({
        baseURL: configJson.apiBaseUrl,
        timeout: 1000*60*15,
        // withCredentials: true
    });

    // request interceptor: gan token
    // authorizedAxiosIntance.interceptors.request.use((config) => {
    //     const accessToken = localStorage.setItem('accessToken');
    //     if(accessToken){
    //         config.headers.Authorization = `Bearer ${accessToken}`;
    //     }
    //     return config;
    // }, (error) => {
    //     return Promise.reject(error);
    // });

    // thong bao loi

    authorizedAxiosIntance.interceptors.response.use((response) => 
        response
    , (error) => {
        if(error.code === 'ECONNABORTED'){
            toast.error("Yêu cầu quá thời gian chờ (timeout)");
        }
        else if (!error.response){
            toast.error("Không thể kết nối với máy chủ (network error)");
        }
        else if(error.response?.status !== 410){
            toast.error(error.response?.data?.message || error?.message);
        }
        return Promise.reject(error);
    })
    return authorizedAxiosIntance
}



