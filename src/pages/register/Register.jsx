import React, { useState } from "react";
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
import { useNavigate, Link } from "react-router-dom";

// ✅ تعريف الـ Yup Schema
const schema = yup.object({
  firstName: yup
    .string()
    .required("First Name is required")
    .min(4, "Min length is 4"),
  lastName: yup
    .string()
    .required("Last Name is required")
    .min(4, "Min length is 4"),
  userName: yup
    .string()
    .required("UserName is required")
    .min(6, "Min length is 6"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .matches(
      /^[sS]\d+@stu\.najah\.edu$/,
      "Email must be like: s123456@stu.najah.edu"
    ),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Min length is 6")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[@$!%*?&]/, "Must contain at least one special character"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://askly.runasp.net/api/Accounts/Register",
        data
      );

      if (response.data.success) {
        alert("Registration successful! Please log in.");
        navigate("/login");
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Axios Error:", error.response?.data || error.message);
      alert("Registration failed. Please check your data.");
    } finally {
      setIsLoading(false);
    }
  };

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
          }}
        >
          Register
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              {...register("firstName")}
              label="First Name"
              variant="outlined"
              fullWidth
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
            <TextField
              {...register("lastName")}
              label="Last Name"
              variant="outlined"
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
            <TextField
              {...register("userName")}
              label="UserName"
              variant="outlined"
              fullWidth
              error={!!errors.userName}
              helperText={errors.userName?.message}
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
            <TextField
              {...register("email")}
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
            <TextField
              {...register("password")}
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
            <TextField
              {...register("confirmPassword")}
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
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
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Register"}
            </Button>

            <Typography mt={2} fontSize="0.9rem" color="white">
              Already have an account?{" "}
              <Link
                to="/login"
                style={{ fontWeight: 600, color: "#93c5fd", textDecoration: "none" }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
