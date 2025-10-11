import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import ForgetPassword from "./pages/forgetpassword/Forgetpassword";
import ResetPass from "./pages/resetpas/Resetpass";
import Home from "./pages/home/Home";
import ProtectedRouter from "../ProtectedRouter";
import PublicRoute from "../PublicRouter";
function App() {
  return (
   <Router>
  <Routes>
    <Route
      path="/login"
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      }
    />
    <Route
      path="/register"
      element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      }
    />
    <Route
      path="/forgot-password"
      element={
        <PublicRoute>
          <ForgetPassword />
        </PublicRoute>
      }
    />
    <Route
      path="/reset-password"
      element={
        <PublicRoute>
          <ResetPass />
        </PublicRoute>
      }
    />
    <Route
      path="/Home"
      element={
        <ProtectedRouter>
          <Home />
        </ProtectedRouter>
      }
    />
  </Routes>
</Router>
  );
}

export default App;
