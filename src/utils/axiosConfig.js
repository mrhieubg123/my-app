import axios from 'axios';
import { toast } from 'react-toastify';

let authorizedAxiosIntance = null;



export async function getBaseURL() {
    // load config.json
    const res = await fetch('/config.json');
    const configJson = await res.json();

    const prefixes = configJson.apiBaseUrl121Prefixes;
    if (prefixes && typeof prefixes === 'object') {
        if (Array.isArray(prefixes)) {
            for (const item of prefixes) {
                if (item && item.key && window.location.hostname.startsWith(item.key)) {
                    return item.value;
                }
            }
        } else {
            for (const [key, value] of Object.entries(prefixes)) {
                if (window.location.hostname.startsWith(key)) {
                    return value;
                }
            }
        }
    }

    // fallback to old logic
    return window.location.hostname.startsWith("10.228.121.39")
        ? (configJson.apiBaseUrl121 || configJson.apiBaseUrl)
        : configJson.apiBaseUrl;
}

export async function getAuthorizedAxiosIntance() {

    if (authorizedAxiosIntance) return authorizedAxiosIntance;

    const baseURL = await getBaseURL();

    // tao axios intance
    authorizedAxiosIntance = axios.create({
        baseURL: baseURL,
        timeout: 1000 * 60 * 15,
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
            if (error.code === 'ECONNABORTED') {
                toast.error("Yêu cầu quá thời gian chờ (timeout)");
            }
            else if (!error.response) {
                toast.error("Không thể kết nối với máy chủ (network error)");
            }
            else if (error.response?.status !== 410) {
                toast.error(error.response?.data?.message || error?.message);
            }
            return Promise.reject(error);
        })
    return authorizedAxiosIntance
}



