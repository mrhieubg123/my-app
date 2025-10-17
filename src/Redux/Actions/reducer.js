import {SET_MODAL} from "./action";

const initialState = {
    ModalJSON : '', // luu modal duoi dang JSON
};

const modalReducer = (state = initialState, action) => {
   
    switch (action.type){
        case SET_MODAL:
            return{
                ...state,
                ModalJSON: action.payload,
                
            };
        default:
            return state;
    }
}

export default modalReducer;