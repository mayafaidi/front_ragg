import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
const isTokenExpired=(token)=>{
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decoded.exp < currentTime; // true = expired
  } catch (e) {
    return true; // invalid token = treat as expired
  }

} 
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const expired = isTokenExpired(token);
  if (expired) {
  localStorage.removeItem("token");
}
  if ( token && !expired)  {
    return <Navigate to="/Home" replace />;
  }
  return children;
};

export default PublicRoute;
