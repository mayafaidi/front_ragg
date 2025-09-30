import React, { useEffect, useState } from "react";
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
import "aos/dist/aos.css";
import axios from "axios";
import AOS from "aos";

import style from "./Login.module.css";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .matches(
      /^[a-zA-Z0-9._%+-]+@stu\.najah\.edu$/,
      "Email must be a student email (@stu.najah.edu)"
    ),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Min length is 6"),
});

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
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
       toast.success(response.data.message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
    });
       setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      console.error("Axios Error:", error.response?.data || error.message);
    toast.error(
      error.response?.data?.message || "Login failed! Please try again.",
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
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
      }}
    >
      <Paper
        data-aos="fade-up"
        data-aos-duration="500"
        elevation={6}
        sx={{
          width: "400px",
          padding: "2rem",
          borderRadius: "12px",
          textAlign: "center",
          backgroundColor: "transparent",
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
            // data-aos="fade-left"
            // data-aos-duration="1200"
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
            // data-aos="fade-right"
            // data-aos-duration="1400"
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

          <Box
            //  data-aos="fade-down"
            //  data-aos-duration="1500"
            textAlign="left"
            mb={2}
          >
            <Link
              data-aos="fade-down"
              data-aos-duration="1500"
              to="/forgot-password"
              style={{
                fontSize: "0.85rem",
                color: "#93c5fd",
                textDecoration: "none",
              }}
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            //  data-aos="fade-down"
            //   data-aos-duration="1500"
            className={`${style.shakeBtn}`}
            type="submit"
            variant="contained"
            fullWidth
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
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "login"
            )}
          </Button>

          <Typography
            //  data-aos="fade-down"
            //   data-aos-duration="1500"
            mt={2}
            fontSize="0.9rem"
            color="gray"
          >
            Don’t have an account?{" "}
            <Link
              to="/register"
              style={{ fontWeight: 600, color: "#fff", textDecoration: "none" }}
            >
              Create one
            </Link>
          </Typography>
        </form>
      </Paper>
        <ToastContainer />
    </Box>
  );
}
