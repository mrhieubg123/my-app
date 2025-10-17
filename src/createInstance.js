import axios from "axios";
import {jwtDecode} from "jwt-decode";

// http://localhost:5000
const API_BASE_URL = '';

const refreshToken = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`,{}, {withCredentials: true} );
      console.log('Refresh token response:', res.data);
      return res.data;
    } catch (err) {
      console.log('Lỗi khi thiết lập request:', err);
      return err;
    }
  };


export const createAxios = (user ,dispatch, stateSuccess)=>{
    const newInstance = axios.create({baseURL: API_BASE_URL});
    newInstance.interceptors.request.use( async (config) => {
      if(!user?.accessToken) return config;
        try {
          const decodedToken = jwtDecode(user?.accessToken);

          const now = Date.now();
          // const decodedToken = (() => {
          //   try {
          //     return jwtDecode(user?.accessToken);
          //   } catch (err) {
          //     console.error("Invalid token:", err);
          //     return null;
          //   }
          //})();
          console.log(
            "token expiry time:", new Date(decodedToken.exp*1000).toLocaleTimeString()
          )

          // if (!decodedToken) {
          //   console.error("User token is invalid or missing");
          //   throw new Error("Invalid token");
          // }
          // console.log('Token expiry time:', decodedToken.exp);
  
          if (decodedToken.exp * 1000 < now) {
            console.log("Token expired. Refreshing...");
            const data = await refreshToken();
            if(!data?.accessToken){
              throw new Error("Failed to refresh token");
            }

            const refreshedUser  = {
              ...user,
              accessToken: data?.accessToken
            };
            dispatch(stateSuccess(refreshedUser));
            config.headers["token"] = "Bearer " + data.accessToken;
          }
          else {
            // Token còn hiệu lực
            config.headers["token"] = `Bearer ${user?.accessToken}`;
          }

          return config;
        } catch (err) {
          console.error('Error in interceptor:', err);
          return Promise.reject(err);
        }
      },
      (err) => Promise.reject(err)
    );
    return newInstance;
}