import React, {createContext, useContext} from "react";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotificationContext = createContext();
export const NotificationProvider = ({children}) =>{
    const showNotification = (message, type = "success") => {
        toast(message, {type})
    }
    return (
        <NotificationContext.Provider value={showNotification}>
            {children}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
        </NotificationContext.Provider>
    );
};
export const useNotification = () => useContext(NotificationContext);


   
