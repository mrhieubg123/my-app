export const SET_MODAL = 'SET_MODAL';

export const setModal = (modal) => {
    const ModalJSON = JSON.stringify(modal);
    return {
        type: SET_MODAL,
        payload: ModalJSON,
    }
}

// export const SET_PARAM = 'SET_PARAM';

// export const setParam = (param) => {
//     return {
//         type: SET_PARAM,
//         payload: {
//             answer: "Hello!",
//             data: [],
//             do_query: "",
//             file_name: "",
//             highlight: [],
//             msg: "success",
//             page:"",
//             params: {
//                 Building: "BN3",
//                 Factory:"VN",
//                 Linename:"",
//                 Machine: "",
//                 Project:"",
//                 Section: "SMT",
//                 endtime: "2025-02-04",
//                 starttime: "2025-02-04",
//                 questions: "",
//                 showpage: "",
//                 status_code: "succeeded",
//             },
//             topic: {
//                 count: "",
//                 object: "",
//                 order: "not_specified",
//                 property: "",
//                 type: "Normal question",
//                 type_q: null,
//                 type_topic: "error"
//             },
//         }
//     }
// }

