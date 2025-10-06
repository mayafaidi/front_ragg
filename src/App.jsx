import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import ForgetPassword from "./pages/forgetpassword/Forgetpassword";
import ResetPass from "./pages/resetpas/Resetpass";
import Home from "./pages/home/Home";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPass />} />
<Route path="/Home" element={<Home />} />

      </Routes>
    </Router>
  );
}

export default App;
