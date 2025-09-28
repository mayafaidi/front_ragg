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
import { Link, useNavigate } from "react-router-dom"; 
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";


const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Min length is 6"),
});

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    console.log("Sending login data:", data);
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://askly.runasp.net/api/Accounts/Login",
        data
      );
      console.log("Login Success:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Axios Error:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
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
  variant="h5"
  mb={3}
  sx={{
    fontWeight: 700,
    color: "white",
    "&::first-letter": { color: "red" }, 
    fontFamily: "Cairo, Poppins, sans-serif",
  }}
>
  Askly Chatbot
</Typography>


        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("email")}
            placeholder="Email"
            variant="outlined"
            type="email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#fff",
              },
            }}
          />

          <TextField
            {...register("password")}
            placeholder="Password"
            variant="outlined"
            type="password"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#fff",
              },
            }}
          />

          <Box textAlign="left" mb={2}>
            <Link to="/forgot-password" style={{ fontSize: "0.85rem", color: "#93c5fd", textDecoration: "none" }}>
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
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
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "login"}
          </Button>

          <Typography mt={2} fontSize="0.9rem">
            Don’t have an account?{" "}
            <Link to="/register" style={{ fontWeight: 600, color: "#fff", textDecoration: "none" }}>
              Create one
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}
