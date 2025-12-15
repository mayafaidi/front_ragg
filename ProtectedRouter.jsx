import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
const isTokenExpired=(token)=>{
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    console.log(decoded.exp)
    return decoded.exp < currentTime; 
  } catch (e) {
    return true; 
  }

} 
const ProtectedRouter = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = token && !isTokenExpired(token); 

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
export default ProtectedRouter;