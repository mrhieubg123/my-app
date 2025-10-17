import React,{Component} from "react";
import { Navigate } from "react-router-dom";


class ErrorBoundary extends Component {
    state = {
        hasError: false,
    }
    // constructor(props){
    //     super(props);
    //     this.state = { hasError: false };
    // }
    static getDerivedStateFromError(error){
        // cập nhật state để render fallback UI
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo){
        // ghi lại log lỗi nếu cần
        console.log("Lỗi Không mong muốn:", error, errorInfo);
    }
    render(){
        if (this.state.hasError){
            return <Navigate to="/ErrorPage" replace />
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
