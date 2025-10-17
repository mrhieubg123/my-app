import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    answer: "",
    data: [],
    do_query: "",
    file_name: "",
    highlight: [],
    msg: "",
    page:"",
    questions: "",
    showpage: "",
    status_code: "",
    params: {
        Building: "",
        Factory:"",
        Linename:"",
        Machine: "",
        Project:"",
        Section: "",
        endtime: "",
        starttime: "",
    },
    topic: {
        count: "",
        object: "",
        order: "",
        property: "",
        type: "",
        type_q: null,
        type_topic: ""
    },
};

const paramSlice = createSlice({
    name: 'param',
    initialState,
    reducers:{
        setParam:(state, action) =>{
            return{
                ...state,
                ...action.payload, //ghi  de khi co du lieu moi
                params:{
                    ...state.params,
                    ...action.payload.params
                },
                topic:{
                    ...state.topic,
                    ...action.payload.topic
                }
            };
        },
        resetParam: () => initialState
    },
});

export const {setParam , resetParam} = paramSlice.actions;
export default paramSlice.reducer;