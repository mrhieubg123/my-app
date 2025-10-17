import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        users:{
            allUsers: null,
            isFetching: false,
            error: false,
        },
        msg:"",
    },
    reducers: {
        getUserStart: (state) => {
            state.users.isFetching = true;
        },
        getUserSuccess: (state, action) => {
            state.users.isFetching = false;
            state.users.allUsers = action.payload;
        },
        getUserFailure: (state) => {
            state.users.isFetching = false;
            state.users.error = true;
        },

        // deleteUser
        deleteUserStart: (state) => {
            state.users.isFetching = true;
        },
        deleteUserSuccess: (state, action) => {
            state.users.isFetching = false;
            state.msg = action.payload;
        },
        deleteUserFailure: (state,action) => {
            state.users.isFetching = false;
            state.users.error = true;
            state.msg = action.payload;
        },
        
    },
}); 

export const { getUserStart, getUserSuccess, getUserFailure , deleteUserFailure, deleteUserStart, deleteUserSuccess} = userSlice.actions;
export default userSlice.reducer;