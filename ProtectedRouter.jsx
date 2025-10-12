import { Navigate } from "react-router-dom";

const ProtectedRouter=({children})=>{
     const isAuthenticated = localStorage.getItem("token");
    return isAuthenticated ? children : <Navigate to="/login" replace  />;
    //replace  هاي عشان لما يضغط رجوع مابرجع عصفحة محمية 
    //فلما يرجع رح يرجع لصفحة لكان قبلها  
}
export default ProtectedRouter;