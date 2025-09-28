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
import { useNavigate } from "react-router-dom";

const schema = yup.object({

  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .matches(
      /^[a-zA-Z0-9._%+-]+@stu\.najah\.edu$/,
      "Email must be a student email (@stu.najah.edu)"
    ),
});


export default function ForgetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setMessage("");

      const response = await axios.post(
        "https://askly.runasp.net/api/Accounts/ForgetPassword",
        data
      );

      console.log("Response:", response.data);
      setMessage("A verification code has been sent to your email!");

      setTimeout(() => {
        navigate("/reset-password", { state: { email: data.email } });
      }, 2000);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
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
backgroundColor: "transparent",
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
          Forget Password
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              {...register("email")}
              label="Email"
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
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Send Code"
              )}
            </Button>

            {message && (
              <Typography
                align="center"
                mt={2}
                color={message.includes("sent") ? "green" : "error"}
              >
                {message}
              </Typography>
            )}
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
