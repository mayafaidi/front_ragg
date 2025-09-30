import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Typography,
  Box,
  Container,
  TextField,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import "aos/dist/aos.css";
import AOS from "aos";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const schema = yup.object({
  code: yup.string().required("Verification code is required"),
  newPassword: yup
    .string()
    .required("New password is required")
     .min(6, "Min length is 6")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[@$!%*?&]/, "Must contain at least one special character"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export default function ResetPass() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setMessage("");

      const response = await axios.patch(
        "https://askly.runasp.net/api/Accounts/ResetPassword",
        {
          email: email,
          code: data.code,
          newPassword: data.newPassword,
        }
      );

      if (response.status === 200) {
       // setMessage("Password has been changed successfully!");
         toast.success("✅ Password has been changed successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
       setTimeout(() => navigate("/login"), 3000);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);

  const errorMessage =
    error.response?.data?.message ||
    error.response?.data?.errors ||
    error.response?.data ||
    error.message ||
    "An unexpected error occurred.";

  toast.error(
    typeof errorMessage === "object"
      ? JSON.stringify(errorMessage)
      : errorMessage,
    {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      transition: Bounce,
    }
  );
} finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
    AOS.refresh();
  }, []);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
        padding: 2,
      }}
    >
      <Paper
        data-aos="fade-down"
        data-aos-duration="500"
        elevation={6}
        sx={{
          width: "400px",
          padding: "2rem",
          borderRadius: "12px",
          textAlign: "center",
          backgroundColor: "#0f172a99",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          mb={3}
          sx={{
            fontWeight: 700,
            color: "white",
            fontFamily: "Cairo, Poppins, sans-serif",
            "&::first-letter": { color: "red" },
          }}
        >
          Reset Password
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              disabled
              sx={{
                mb: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                },
              }}
            />

            <TextField
              {...register("code")}
              label="Verification Code"
              variant="outlined"
              fullWidth
              error={!!errors.code}
              helperText={errors.code?.message}
              sx={{
              mb: 0.5,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#fff",
              },
            }}
            />

            <TextField
              {...register("newPassword")}
              label="New Password"
              type="password"
              variant="outlined"
              fullWidth
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              sx={{
              mb: 0.5,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#fff",
              },
            }}
            />

            <TextField
              {...register("confirmPassword")}
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
             sx={{
              mb: 0.5,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#fff",
              },
            }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || Object.keys(errors).length > 0}
              sx={{
                py: 1.2,
                fontSize: "14px",
                fontWeight: 700,
                backgroundColor: "#2563EB",
                "&:hover": { backgroundColor: "#1D4ED8" },
                borderRadius: "8px",
                fontFamily: "Cairo, Poppins, sans-serif",
                textTransform: "none",
                color: "white",
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Reset Password"
              )}
            </Button>

            {message && (
              <Typography
                align="center"
                mt={2}
                color={message.includes("successfully") ? "green" : "error"}
              >
                {message}
              </Typography>
            )}
          </Box>
        </form>
      </Paper>
      
      <ToastContainer />
    </Box>
  );
}
