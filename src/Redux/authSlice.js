import {createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice ({
    name: 'auth',
    initialState: {
        login:{
            currentUser: null,
            isFetching: false,
            error: false,
           
        },
        register:{
            isFetching: false,
            error: false,
            success: false,
        },
        logout:{
            isFetching: false,
            error: false,
        }
    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = false;          
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailure: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },

        registerStart: (state) => {
            state.register.isFetching = true;          
        },
        registerSuccess: (state) => {
            state.register.isFetching = false;
            state.register.error = false;
            state.register.success = true;
        },
        registerFailure: (state) => {
            state.register.isFetching = false;
            state.register.error = true;
            state.register.success = false;
        },


       
        logOutSuccess: (state) => {
            state.logout.isFetching = false;
            state.login.currentUser = null;
            state.logout.error = false;
        },
        logOutFailure: (state) => {
            state.logout.isFetching = false;
            state.logout.error = true;
        },
        logOutStart: (state) => {
            state.logout.isFetching = true;
        },

    },
});

export const {loginStart, loginSuccess, loginFailure, registerStart, registerSuccess, registerFailure, logOutStart, logOutSuccess, logOutFailure} = authSlice.actions;
export default authSlice.reducer;