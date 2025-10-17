import React, {useEffect} from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";


function PageController() {
    const navigate = useNavigate();
    const paramState = useSelector(state => state.param);
    const location = useLocation(); // Lấy đường dẫn hiện tại

    const local = '/'+paramState.page.dep+'/'+paramState.page.page_name

    const pageNumber = paramState.showpage;


    // dieu huong trang 
    useEffect(() => {
        if(local !== location.pathname){
            navigate(`${local}`)
        }
    },[local, navigate])
    return null;
}
export default PageController;